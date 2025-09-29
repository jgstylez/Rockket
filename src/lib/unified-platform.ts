import { BusinessApplication } from "./ai/business-generator";
import { EnhancedVisualBuilder } from "../components/builder/enhanced-visual-builder";
import { BusinessLogicBuilder } from "./builder/business-logic";

export type DevelopmentApproach = "ai" | "visual" | "code";

export interface UnifiedProject {
  id: string;
  name: string;
  description: string;
  currentApproach: DevelopmentApproach;
  approaches: {
    ai?: AIProjectState;
    visual?: VisualProjectState;
    code?: CodeProjectState;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    tags: string[];
  };
}

export interface AIProjectState {
  businessApp?: BusinessApplication;
  requirements: any;
  generatedCode: {
    frontend: string;
    backend: string;
    database: string;
    configuration: string;
  };
  aiProvider: string;
  lastGenerated: Date;
}

export interface VisualProjectState {
  components: any[];
  businessLogic: BusinessLogicBuilder;
  layout: {
    structure: any;
    styles: any;
    responsive: any;
  };
  workflows: any[];
  lastModified: Date;
}

export interface CodeProjectState {
  files: CodeFile[];
  dependencies: string[];
  buildConfig: any;
  lastCompiled: Date;
}

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  lastModified: Date;
}

export interface ConversionResult {
  success: boolean;
  data: any;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

export class UnifiedDevelopmentPlatform {
  private projects: Map<string, UnifiedProject> = new Map();
  private currentProjectId: string | null = null;

  // Project Management
  createProject(
    name: string,
    description: string,
    initialApproach: DevelopmentApproach = "ai"
  ): UnifiedProject {
    const project: UnifiedProject = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      currentApproach: initialApproach,
      approaches: {},
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: "1.0.0",
        tags: [],
      },
    };

    this.projects.set(project.id, project);
    this.currentProjectId = project.id;
    return project;
  }

  getProject(projectId: string): UnifiedProject | null {
    return this.projects.get(projectId) || null;
  }

  getCurrentProject(): UnifiedProject | null {
    return this.currentProjectId
      ? this.getProject(this.currentProjectId)
      : null;
  }

  // Approach Switching
  async switchApproach(
    projectId: string,
    targetApproach: DevelopmentApproach,
    options: {
      preserveData?: boolean;
      convertExisting?: boolean;
      mergeChanges?: boolean;
    } = {}
  ): Promise<ConversionResult> {
    const project = this.getProject(projectId);
    if (!project) {
      return {
        success: false,
        data: null,
        warnings: [],
        errors: ["Project not found"],
        suggestions: [],
      };
    }

    const currentState = project.approaches[project.currentApproach];
    const result: ConversionResult = {
      success: true,
      data: null,
      warnings: [],
      errors: [],
      suggestions: [],
    };

    try {
      switch (targetApproach) {
        case "ai":
          result.data = await this.convertToAI(project, currentState, options);
          break;
        case "visual":
          result.data = await this.convertToVisual(
            project,
            currentState,
            options
          );
          break;
        case "code":
          result.data = await this.convertToCode(
            project,
            currentState,
            options
          );
          break;
      }

      // Update project state
      project.currentApproach = targetApproach;
      project.approaches[targetApproach] = result.data;
      project.metadata.updatedAt = new Date();

      result.suggestions.push(
        `Successfully switched to ${targetApproach} approach`
      );
    } catch (error) {
      result.success = false;
      result.errors.push(
        `Failed to switch to ${targetApproach}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    return result;
  }

  // AI to Visual Conversion
  private async convertToAI(
    project: UnifiedProject,
    currentState: any,
    options: any
  ): Promise<AIProjectState> {
    // If already AI, return existing state
    if (project.approaches.ai) {
      return project.approaches.ai;
    }

    // Convert from visual or code to AI
    const aiState: AIProjectState = {
      requirements: {
        name: project.name,
        description: project.description,
        features: this.extractFeaturesFromState(currentState),
        userTypes: ["Users", "Admins"],
        paymentRequired: false,
        contentManagement: false,
        userAccounts: true,
        integrations: [],
        deployment: "cloudflare",
      },
      generatedCode: {
        frontend: "",
        backend: "",
        database: "",
        configuration: "",
      },
      aiProvider: "openai",
      lastGenerated: new Date(),
    };

    // If converting from visual, extract business logic
    if (project.currentApproach === "visual" && currentState) {
      aiState.requirements.features = this.extractFeaturesFromVisualComponents(
        currentState.components
      );
      aiState.requirements.businessLogic =
        this.extractBusinessLogicFromVisual(currentState);
    }

    // If converting from code, analyze existing code
    if (project.currentApproach === "code" && currentState) {
      aiState.requirements.features = this.analyzeCodeFeatures(
        currentState.files
      );
      aiState.generatedCode = this.extractCodeFromFiles(currentState.files);
    }

    return aiState;
  }

  // AI to Visual Conversion
  private async convertToVisual(
    project: UnifiedProject,
    currentState: any,
    options: any
  ): Promise<VisualProjectState> {
    // If already visual, return existing state
    if (project.approaches.visual) {
      return project.approaches.visual;
    }

    const visualState: VisualProjectState = {
      components: [],
      businessLogic: new BusinessLogicBuilder(),
      layout: {
        structure: {},
        styles: {},
        responsive: {},
      },
      workflows: [],
      lastModified: new Date(),
    };

    // Convert from AI to visual
    if (project.currentApproach === "ai" && currentState) {
      visualState.components =
        this.generateVisualComponentsFromAI(currentState);
      visualState.businessLogic = this.createBusinessLogicFromAI(currentState);
    }

    // Convert from code to visual
    if (project.currentApproach === "code" && currentState) {
      visualState.components = this.parseCodeToVisualComponents(
        currentState.files
      );
      visualState.businessLogic = this.extractBusinessLogicFromCode(
        currentState.files
      );
    }

    return visualState;
  }

  // AI/Visual to Code Conversion
  private async convertToCode(
    project: UnifiedProject,
    currentState: any,
    options: any
  ): Promise<CodeProjectState> {
    // If already code, return existing state
    if (project.approaches.code) {
      return project.approaches.code;
    }

    const codeState: CodeProjectState = {
      files: [],
      dependencies: [],
      buildConfig: {},
      lastCompiled: new Date(),
    };

    // Convert from AI to code
    if (project.currentApproach === "ai" && currentState) {
      codeState.files = this.generateCodeFilesFromAI(currentState);
      codeState.dependencies = this.extractDependenciesFromAI(currentState);
    }

    // Convert from visual to code
    if (project.currentApproach === "visual" && currentState) {
      codeState.files = this.generateCodeFilesFromVisual(currentState);
      codeState.dependencies = this.extractDependenciesFromVisual(currentState);
    }

    return codeState;
  }

  // Helper Methods for Conversion
  private extractFeaturesFromState(state: any): string[] {
    if (!state) return [];

    // Extract features based on state type
    if (state.components) {
      return this.extractFeaturesFromVisualComponents(state.components);
    }

    if (state.files) {
      return this.analyzeCodeFeatures(state.files);
    }

    return [];
  }

  private extractFeaturesFromVisualComponents(components: any[]): string[] {
    const features: string[] = [];

    components.forEach((component) => {
      switch (component.type) {
        case "BusinessForm":
          features.push("Form handling", "User input");
          break;
        case "BusinessWorkflow":
          features.push("Workflow automation", "Business processes");
          break;
        case "BusinessCheckout":
          features.push("E-commerce", "Payment processing");
          break;
        case "BusinessDashboard":
          features.push("Analytics", "Data visualization");
          break;
      }
    });

    return Array.from(new Set(features));
  }

  private extractBusinessLogicFromVisual(state: VisualProjectState): any {
    return {
      rules: state.businessLogic.exportConfiguration().rules,
      workflows: state.businessLogic.exportConfiguration().workflows,
      triggers: [],
    };
  }

  private analyzeCodeFeatures(files: CodeFile[]): string[] {
    const features: string[] = [];

    files.forEach((file) => {
      if (
        file.name.includes("auth") ||
        file.content.includes("authentication")
      ) {
        features.push("User authentication");
      }
      if (file.name.includes("payment") || file.content.includes("stripe")) {
        features.push("Payment processing");
      }
      if (file.name.includes("api") || file.content.includes("endpoint")) {
        features.push("API endpoints");
      }
      if (
        file.content.includes("database") ||
        file.content.includes("prisma")
      ) {
        features.push("Database integration");
      }
    });

    return Array.from(new Set(features));
  }

  private extractCodeFromFiles(files: CodeFile[]): any {
    const code = {
      frontend: "",
      backend: "",
      database: "",
      configuration: "",
    };

    files.forEach((file) => {
      if (file.path.includes("frontend") || file.path.includes("client")) {
        code.frontend += file.content + "\n";
      } else if (
        file.path.includes("backend") ||
        file.path.includes("server")
      ) {
        code.backend += file.content + "\n";
      } else if (
        file.path.includes("database") ||
        file.path.includes("schema")
      ) {
        code.database += file.content + "\n";
      } else if (file.path.includes("config") || file.path.includes("env")) {
        code.configuration += file.content + "\n";
      }
    });

    return code;
  }

  private generateVisualComponentsFromAI(aiState: AIProjectState): any[] {
    const components: any[] = [];

    // Generate components based on AI requirements
    if (aiState.requirements.features.includes("User authentication")) {
      components.push({
        id: "auth_form",
        type: "BusinessForm",
        name: "User Registration Form",
        category: "Business Logic",
        description: "User registration with business logic",
        icon: "👤",
        props: {
          className: "p-6 bg-white border rounded-lg",
          formConfig: {
            fields: [
              {
                id: "email",
                name: "email",
                type: "email",
                label: "Email Address",
                placeholder: "Enter your email",
                required: true,
                validation: [],
                businessLogic: { rules: [], workflows: [] },
              },
            ],
            submitAction: "register_user",
            validationRules: [],
            businessRules: [],
          },
        },
        businessLogic: {
          rules: [],
          workflows: [],
          triggers: ["form_submit"],
          dataBindings: [],
          validations: [],
        },
      });
    }

    return components;
  }

  private createBusinessLogicFromAI(
    aiState: AIProjectState
  ): BusinessLogicBuilder {
    const businessLogic = new BusinessLogicBuilder();

    // Add business rules based on AI requirements
    if (aiState.requirements.paymentRequired) {
      businessLogic.addRule({
        name: "Payment Validation",
        description: "Validate payment before processing",
        condition: "payment.amount > 0",
        action: "allow_payment",
        priority: 1,
        enabled: true,
      });
    }

    return businessLogic;
  }

  private parseCodeToVisualComponents(files: CodeFile[]): any[] {
    const components: any[] = [];

    // Parse code files to extract visual components
    files.forEach((file) => {
      if (file.content.includes("form") || file.content.includes("input")) {
        components.push({
          id: `form_${file.id}`,
          type: "BusinessForm",
          name: "Form Component",
          category: "Business Logic",
          description: "Form extracted from code",
          icon: "📝",
          props: {
            className: "p-6 bg-white border rounded-lg",
            formConfig: {
              fields: [],
              submitAction: "submit_form",
              validationRules: [],
              businessRules: [],
            },
          },
          businessLogic: {
            rules: [],
            workflows: [],
            triggers: ["form_submit"],
            dataBindings: [],
            validations: [],
          },
        });
      }
    });

    return components;
  }

  private extractBusinessLogicFromCode(
    files: CodeFile[]
  ): BusinessLogicBuilder {
    const businessLogic = new BusinessLogicBuilder();

    // Extract business logic from code comments and patterns
    files.forEach((file) => {
      if (file.content.includes("// Business Rule:")) {
        // Extract business rules from comments
        const ruleMatches = file.content.match(/\/\/ Business Rule: (.+)/g);
        ruleMatches?.forEach((match) => {
          businessLogic.addRule({
            name: "Extracted Rule",
            description: match.replace("// Business Rule: ", ""),
            condition: "true",
            action: "execute_rule",
            priority: 1,
            enabled: true,
          });
        });
      }
    });

    return businessLogic;
  }

  private generateCodeFilesFromAI(aiState: AIProjectState): CodeFile[] {
    const files: CodeFile[] = [];

    // Generate code files from AI state
    if (aiState.generatedCode.frontend) {
      files.push({
        id: "frontend_main",
        name: "App.tsx",
        path: "src/App.tsx",
        content: aiState.generatedCode.frontend,
        language: "typescript",
        lastModified: new Date(),
      });
    }

    if (aiState.generatedCode.backend) {
      files.push({
        id: "backend_main",
        name: "server.js",
        path: "server.js",
        content: aiState.generatedCode.backend,
        language: "javascript",
        lastModified: new Date(),
      });
    }

    return files;
  }

  private extractDependenciesFromAI(aiState: AIProjectState): string[] {
    const dependencies: string[] = [];

    // Extract dependencies from AI generated code
    if (aiState.generatedCode.frontend.includes("react")) {
      dependencies.push("react", "react-dom");
    }
    if (aiState.generatedCode.backend.includes("express")) {
      dependencies.push("express");
    }

    return dependencies;
  }

  private generateCodeFilesFromVisual(
    visualState: VisualProjectState
  ): CodeFile[] {
    const files: CodeFile[] = [];

    // Generate code files from visual components
    visualState.components.forEach((component) => {
      files.push({
        id: `component_${component.id}`,
        name: `${component.name}.tsx`,
        path: `src/components/${component.name}.tsx`,
        content: this.generateCodeFromComponent(component),
        language: "typescript",
        lastModified: new Date(),
      });
    });

    return files;
  }

  private generateCodeFromComponent(component: any): string {
    // Generate code from component
    return `
import React from 'react';

export const ${component.name}: React.FC = () => {
  return (
    <div className="${component.props.className}">
      {/* ${component.description} */}
    </div>
  );
};
    `;
  }

  private extractDependenciesFromVisual(
    visualState: VisualProjectState
  ): string[] {
    const dependencies: string[] = ["react", "react-dom"];

    // Extract dependencies based on components
    visualState.components.forEach((component) => {
      if (component.type === "BusinessForm") {
        dependencies.push("formik", "yup");
      }
      if (component.type === "BusinessCheckout") {
        dependencies.push("stripe");
      }
    });

    return dependencies;
  }

  // Export/Import functionality
  exportProject(projectId: string): any {
    const project = this.getProject(projectId);
    if (!project) return null;

    return {
      project,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };
  }

  importProject(projectData: any): UnifiedProject | null {
    try {
      const project: UnifiedProject = projectData.project;
      this.projects.set(project.id, project);
      return project;
    } catch (error) {
      console.error("Failed to import project:", error);
      return null;
    }
  }

  // Get all projects
  getAllProjects(): UnifiedProject[] {
    return Array.from(this.projects.values());
  }
}
