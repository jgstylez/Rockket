"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Save,
  Eye,
  Code,
  Palette,
  Layers,
  MousePointer,
} from "lucide-react";

interface BuilderComponent {
  id: string;
  type: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  props: Record<string, any>;
  children?: BuilderComponent[];
  styles?: Record<string, any>;
}

interface BuilderProject {
  id: string;
  name: string;
  description: string;
  pages: Array<{
    id: string;
    name: string;
    path: string;
    components: BuilderComponent[];
  }>;
}

export default function BuilderPage() {
  const { user, tenant } = useAuth();
  const [projects, setProjects] = useState<BuilderProject[]>([]);
  const [currentProject, setCurrentProject] = useState<BuilderProject | null>(
    null
  );
  const [components, setComponents] = useState<BuilderComponent[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<BuilderComponent | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
    loadComponents();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/builder/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const loadComponents = async () => {
    try {
      const response = await fetch("/api/builder/components");
      if (response.ok) {
        const data = await response.json();
        setComponents(data.components);
      }
    } catch (error) {
      console.error("Failed to load components:", error);
    }
  };

  const createProject = async () => {
    const name = prompt("Enter project name:");
    if (!name) return;

    try {
      const response = await fetch("/api/builder/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: "New visual builder project",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentProject(data.project);
        loadProjects();
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const loadProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/builder/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentProject(data.project);
      }
    } catch (error) {
      console.error("Failed to load project:", error);
    }
  };

  const saveProject = async () => {
    if (!currentProject) return;

    try {
      const response = await fetch(
        `/api/builder/projects/${currentProject.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: currentProject.name,
            description: currentProject.description,
            data: currentProject,
          }),
        }
      );

      if (response.ok) {
        alert("Project saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  const addComponent = (component: BuilderComponent) => {
    if (!currentProject) return;

    const newComponent = {
      ...component,
      id: `${component.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedProject = {
      ...currentProject,
      pages: currentProject.pages.map((page, index) => {
        if (index === 0) {
          return {
            ...page,
            components: [...page.components, newComponent],
          };
        }
        return page;
      }),
    };

    setCurrentProject(updatedProject);
  };

  const selectComponent = (component: BuilderComponent) => {
    setSelectedComponent(component);
  };

  const updateComponent = (
    componentId: string,
    updates: Partial<BuilderComponent>
  ) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      pages: currentProject.pages.map((page, index) => {
        if (index === 0) {
          return {
            ...page,
            components: page.components.map((comp) =>
              comp.id === componentId ? { ...comp, ...updates } : comp
            ),
          };
        }
        return page;
      }),
    };

    setCurrentProject(updatedProject);
  };

  const deleteComponent = (componentId: string) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      pages: currentProject.pages.map((page, index) => {
        if (index === 0) {
          return {
            ...page,
            components: page.components.filter(
              (comp) => comp.id !== componentId
            ),
          };
        }
        return page;
      }),
    };

    setCurrentProject(updatedProject);
    setSelectedComponent(null);
  };

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Rockket</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={saveProject} variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 border-r bg-card">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Visual Builder</h2>

            {/* Project Selection */}
            <div className="mb-6">
              <label className="form-label">Current Project</label>
              <select
                value={currentProject?.id || ""}
                onChange={(e) => loadProject(e.target.value)}
                className="input-field mb-2"
              >
                <option value="">Select a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={createProject}
                className="w-full"
                variant="outline"
              >
                <Layers className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            {/* Component Library */}
            <div>
              <h3 className="font-semibold mb-3">Components</h3>
              <div className="space-y-2">
                {components.slice(0, 8).map((component) => (
                  <div
                    key={component.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => addComponent(component)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{component.icon}</span>
                      <div>
                        <div className="font-medium text-sm">
                          {component.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {component.category}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          {currentProject ? (
            <>
              {/* Canvas Header */}
              <div className="p-4 border-b">
                <h3 className="font-semibold">{currentProject.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentProject.pages[0]?.components.length || 0} components
                </p>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 p-4 overflow-auto">
                <div className="min-h-full border-2 border-dashed border-muted rounded-lg p-4">
                  {currentProject.pages[0]?.components.length === 0 ? (
                    <div className="text-center py-12">
                      <MousePointer className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">
                        Start Building
                      </h3>
                      <p className="text-muted-foreground">
                        Drag components from the sidebar to start building your
                        page.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentProject.pages[0]?.components.map((component) => (
                        <div
                          key={component.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedComponent?.id === component.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => selectComponent(component)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{component.icon}</span>
                              <div>
                                <div className="font-medium">
                                  {component.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {component.type}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteComponent(component.id);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No Project Selected
                </h3>
                <p className="text-muted-foreground mb-4">
                  Select an existing project or create a new one to start
                  building.
                </p>
                <Button onClick={createProject}>
                  <Layers className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedComponent && (
          <div className="w-80 border-l bg-card">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Properties</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Component Type</label>
                  <input
                    type="text"
                    value={selectedComponent.type}
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={selectedComponent.name}
                    onChange={(e) =>
                      updateComponent(selectedComponent.id, {
                        name: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    value={selectedComponent.description}
                    onChange={(e) =>
                      updateComponent(selectedComponent.id, {
                        description: e.target.value,
                      })
                    }
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="form-label">CSS Classes</label>
                  <input
                    type="text"
                    value={selectedComponent.props.className || ""}
                    onChange={(e) =>
                      updateComponent(selectedComponent.id, {
                        props: {
                          ...selectedComponent.props,
                          className: e.target.value,
                        },
                      })
                    }
                    className="input-field"
                    placeholder="e.g., bg-blue-500 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
