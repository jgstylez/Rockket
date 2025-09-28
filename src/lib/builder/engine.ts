import { BuilderComponent, BuilderPage, BuilderProject } from "./components";

export interface BuilderState {
  project: BuilderProject | null;
  currentPage: BuilderPage | null;
  selectedComponent: BuilderComponent | null;
  clipboard: BuilderComponent | null;
  history: BuilderAction[];
  historyIndex: number;
  isPreviewMode: boolean;
}

export interface BuilderAction {
  type: "add" | "remove" | "update" | "move" | "duplicate";
  componentId: string;
  data: any;
  timestamp: number;
}

export class BuilderEngine {
  private state: BuilderState;
  private listeners: Array<(state: BuilderState) => void> = [];

  constructor() {
    this.state = {
      project: null,
      currentPage: null,
      selectedComponent: null,
      clipboard: null,
      history: [],
      historyIndex: -1,
      isPreviewMode: false,
    };
  }

  // State management
  subscribe(listener: (state: BuilderState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState(): BuilderState {
    return { ...this.state };
  }

  // Project management
  createProject(name: string, description: string = ""): BuilderProject {
    const project: BuilderProject = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      pages: [],
      globalStyles: {},
      settings: {},
    };

    this.state.project = project;
    this.notify();
    return project;
  }

  loadProject(project: BuilderProject): void {
    this.state.project = project;
    this.state.currentPage = project.pages[0] || null;
    this.notify();
  }

  saveProject(): BuilderProject | null {
    return this.state.project;
  }

  // Page management
  createPage(name: string, path: string): BuilderPage {
    if (!this.state.project) {
      throw new Error("No project loaded");
    }

    const page: BuilderPage = {
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      path,
      components: [],
      styles: {},
      meta: {},
    };

    this.state.project.pages.push(page);
    this.state.currentPage = page;
    this.notify();
    return page;
  }

  setCurrentPage(pageId: string): void {
    if (!this.state.project) {
      throw new Error("No project loaded");
    }

    const page = this.state.project.pages.find((p) => p.id === pageId);
    if (!page) {
      throw new Error("Page not found");
    }

    this.state.currentPage = page;
    this.notify();
  }

  deletePage(pageId: string): void {
    if (!this.state.project) {
      throw new Error("No project loaded");
    }

    this.state.project.pages = this.state.project.pages.filter(
      (p) => p.id !== pageId
    );

    if (this.state.currentPage?.id === pageId) {
      this.state.currentPage = this.state.project.pages[0] || null;
    }

    this.notify();
  }

  // Component management
  addComponent(
    component: BuilderComponent,
    parentId?: string,
    index?: number
  ): void {
    if (!this.state.currentPage) {
      throw new Error("No current page");
    }

    this.addToHistory({
      type: "add",
      componentId: component.id,
      data: { component, parentId, index },
      timestamp: Date.now(),
    });

    if (parentId) {
      const parent = this.findComponent(parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        if (index !== undefined) {
          parent.children.splice(index, 0, component);
        } else {
          parent.children.push(component);
        }
      }
    } else {
      if (index !== undefined) {
        this.state.currentPage.components.splice(index, 0, component);
      } else {
        this.state.currentPage.components.push(component);
      }
    }

    this.notify();
  }

  removeComponent(componentId: string): void {
    if (!this.state.currentPage) {
      throw new Error("No current page");
    }

    const component = this.findComponent(componentId);
    if (!component) {
      throw new Error("Component not found");
    }

    this.addToHistory({
      type: "remove",
      componentId,
      data: { component },
      timestamp: Date.now(),
    });

    this.removeComponentRecursive(componentId);
    this.notify();
  }

  updateComponent(
    componentId: string,
    updates: Partial<BuilderComponent>
  ): void {
    const component = this.findComponent(componentId);
    if (!component) {
      throw new Error("Component not found");
    }

    this.addToHistory({
      type: "update",
      componentId,
      data: { updates },
      timestamp: Date.now(),
    });

    Object.assign(component, updates);
    this.notify();
  }

  duplicateComponent(componentId: string): BuilderComponent {
    const component = this.findComponent(componentId);
    if (!component) {
      throw new Error("Component not found");
    }

    const duplicated = this.deepCloneComponent(component);
    duplicated.id = `${component.type}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.addComponent(duplicated);
    return duplicated;
  }

  moveComponent(
    componentId: string,
    newParentId?: string,
    newIndex?: number
  ): void {
    const component = this.findComponent(componentId);
    if (!component) {
      throw new Error("Component not found");
    }

    this.addToHistory({
      type: "move",
      componentId,
      data: { newParentId, newIndex },
      timestamp: Date.now(),
    });

    // Remove from current location
    this.removeComponentRecursive(componentId);

    // Add to new location
    this.addComponent(component, newParentId, newIndex);
  }

  // Selection and clipboard
  selectComponent(componentId: string | null): void {
    if (componentId) {
      this.state.selectedComponent = this.findComponent(componentId);
    } else {
      this.state.selectedComponent = null;
    }
    this.notify();
  }

  copyComponent(componentId: string): void {
    const component = this.findComponent(componentId);
    if (component) {
      this.state.clipboard = this.deepCloneComponent(component);
      this.notify();
    }
  }

  pasteComponent(parentId?: string, index?: number): BuilderComponent | null {
    if (!this.state.clipboard) {
      return null;
    }

    const pasted = this.deepCloneComponent(this.state.clipboard);
    pasted.id = `${pasted.type}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.addComponent(pasted, parentId, index);
    return pasted;
  }

  // Preview mode
  togglePreviewMode(): void {
    this.state.isPreviewMode = !this.state.isPreviewMode;
    this.notify();
  }

  // History management
  undo(): void {
    if (this.state.historyIndex > 0) {
      this.state.historyIndex--;
      this.applyHistoryAction(this.state.history[this.state.historyIndex]);
    }
  }

  redo(): void {
    if (this.state.historyIndex < this.state.history.length - 1) {
      this.state.historyIndex++;
      this.applyHistoryAction(this.state.history[this.state.historyIndex]);
    }
  }

  private addToHistory(action: BuilderAction): void {
    // Remove any actions after current index
    this.state.history = this.state.history.slice(
      0,
      this.state.historyIndex + 1
    );

    // Add new action
    this.state.history.push(action);
    this.state.historyIndex = this.state.history.length - 1;

    // Limit history size
    if (this.state.history.length > 50) {
      this.state.history.shift();
      this.state.historyIndex--;
    }
  }

  private applyHistoryAction(action: BuilderAction): void {
    // Implementation would depend on the specific action type
    // This is a simplified version
    this.notify();
  }

  // Utility methods
  findComponent(componentId: string): BuilderComponent | null {
    if (!this.state.currentPage) {
      return null;
    }

    return this.findComponentRecursive(
      this.state.currentPage.components,
      componentId
    );
  }

  private findComponentRecursive(
    components: BuilderComponent[],
    componentId: string
  ): BuilderComponent | null {
    for (const component of components) {
      if (component.id === componentId) {
        return component;
      }

      if (component.children) {
        const found = this.findComponentRecursive(
          component.children,
          componentId
        );
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  private removeComponentRecursive(componentId: string): void {
    if (!this.state.currentPage) {
      return;
    }

    const removeFromArray = (components: BuilderComponent[]): boolean => {
      for (let i = 0; i < components.length; i++) {
        if (components[i].id === componentId) {
          components.splice(i, 1);
          return true;
        }

        if (components[i].children) {
          if (removeFromArray(components[i].children!)) {
            return true;
          }
        }
      }
      return false;
    };

    removeFromArray(this.state.currentPage.components);
  }

  private deepCloneComponent(component: BuilderComponent): BuilderComponent {
    return JSON.parse(JSON.stringify(component));
  }

  // Export functionality
  exportToHTML(): string {
    if (!this.state.currentPage) {
      return "";
    }

    return this.generateHTML(this.state.currentPage.components);
  }

  private generateHTML(components: BuilderComponent[]): string {
    return components
      .map((component) => this.generateComponentHTML(component))
      .join("\n");
  }

  private generateComponentHTML(component: BuilderComponent): string {
    const styles = this.generateStyles(component.styles || {});
    const props = this.generateProps(component.props || {});
    const children = component.children
      ? this.generateHTML(component.children)
      : "";

    switch (component.type) {
      case "Container":
        return `<div class="${props.className || ""}" style="${styles}">${children}</div>`;
      case "Row":
        return `<div class="${props.className || ""}" style="${styles}">${children}</div>`;
      case "Column":
        return `<div class="${props.className || ""}" style="${styles}">${children}</div>`;
      case "Grid":
        return `<div class="${props.className || ""}" style="${styles}">${children}</div>`;
      case "Heading":
        return `<h${component.props.level || 1} class="${props.className || ""}" style="${styles}">${component.props.text || ""}</h${component.props.level || 1}>`;
      case "Paragraph":
        return `<p class="${props.className || ""}" style="${styles}">${component.props.text || ""}</p>`;
      case "Link":
        return `<a href="${props.href || "#"}" class="${props.className || ""}" style="${styles}">${component.props.text || ""}</a>`;
      case "Input":
        return `<input type="${props.type || "text"}" placeholder="${props.placeholder || ""}" class="${props.className || ""}" style="${styles}" />`;
      case "Button":
        return `<button class="${props.className || ""}" style="${styles}">${component.props.text || ""}</button>`;
      case "Textarea":
        return `<textarea placeholder="${props.placeholder || ""}" rows="${props.rows || 4}" class="${props.className || ""}" style="${styles}"></textarea>`;
      case "Image":
        return `<img src="${props.src || ""}" alt="${props.alt || ""}" class="${props.className || ""}" style="${styles}" />`;
      case "Video":
        return `<video src="${props.src || ""}" controls="${props.controls || false}" class="${props.className || ""}" style="${styles}"></video>`;
      default:
        return `<div class="${props.className || ""}" style="${styles}">${children}</div>`;
    }
  }

  private generateStyles(styles: Record<string, any>): string {
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");
  }

  private generateProps(props: Record<string, any>): Record<string, any> {
    const { children, ...otherProps } = props;
    return otherProps;
  }
}
