import { AIGenerationService } from "./providers";

export interface BusinessRequirements {
  name: string;
  description: string;
  industry: string;
  features: string[];
  userTypes: string[];
  paymentRequired: boolean;
  contentManagement: boolean;
  userAccounts: boolean;
  integrations: string[];
  deployment: "cloudflare" | "vercel" | "aws" | "docker";
}

export interface BusinessApplication {
  name: string;
  description: string;
  industry: string;
  techStack: string[];
  features: string[];
  architecture: {
    frontend: string;
    backend: string;
    database: string;
    deployment: string;
  };
  code: {
    frontend: string;
    backend: string;
    database: string;
    configuration: string;
  };
  integrations: {
    payments: string;
    cms: string;
    auth: string;
    analytics: string;
  };
  deployment: {
    instructions: string;
    environment: string;
    secrets: string[];
  };
  businessLogic: {
    workflows: string[];
    rules: string[];
    automations: string[];
  };
}

export class BusinessApplicationGenerator {
  private aiService: AIGenerationService;

  constructor() {
    this.aiService = new AIGenerationService();
  }

  async generateBusinessApp(
    requirements: BusinessRequirements
  ): Promise<BusinessApplication> {
    const enhancedPrompt = this.buildBusinessPrompt(requirements);

    try {
      const result = await this.aiService.generateApp(
        enhancedPrompt,
        "openai", // Use OpenAI for complex business logic
        { requirements, type: "business_application" }
      );

      return this.parseBusinessResponse(result.data);
    } catch (error) {
      console.error("Business application generation error:", error);
      throw new Error("Failed to generate business application");
    }
  }

  private buildBusinessPrompt(requirements: BusinessRequirements): string {
    return `Generate a complete business application for: ${requirements.name}

BUSINESS CONTEXT:
- Industry: ${requirements.industry}
- Description: ${requirements.description}
- User Types: ${requirements.userTypes.join(", ")}
- Required Features: ${requirements.features.join(", ")}
- Payment Integration: ${requirements.paymentRequired ? "Required" : "Not required"}
- Content Management: ${requirements.contentManagement ? "Required" : "Not required"}
- User Accounts: ${requirements.userAccounts ? "Required" : "Not required"}
- Integrations: ${requirements.integrations.join(", ")}
- Deployment Target: ${requirements.deployment}

REQUIREMENTS:
1. Generate a complete, production-ready application
2. Include pre-configured payment system (Stripe integration)
3. Include user authentication and authorization system
4. Include content management system setup
5. Include database schema with proper relationships
6. Include business logic and workflows
7. Include deployment configuration
8. Include environment setup and secrets management

OUTPUT FORMAT:
Return a comprehensive JSON response with the following structure:
{
  "name": "Application Name",
  "description": "Detailed description",
  "industry": "Industry type",
  "techStack": ["Technology 1", "Technology 2"],
  "features": ["Feature 1", "Feature 2"],
  "architecture": {
    "frontend": "Frontend technology and structure",
    "backend": "Backend technology and APIs",
    "database": "Database design and relationships",
    "deployment": "Deployment strategy"
  },
  "code": {
    "frontend": "Complete frontend code with components",
    "backend": "Complete backend code with APIs",
    "database": "Database schema and migrations",
    "configuration": "Environment and configuration files"
  },
  "integrations": {
    "payments": "Stripe integration code and setup",
    "cms": "Content management system integration",
    "auth": "Authentication system implementation",
    "analytics": "Analytics and tracking setup"
  },
  "deployment": {
    "instructions": "Step-by-step deployment guide",
    "environment": "Environment variables and configuration",
    "secrets": ["SECRET_1", "SECRET_2"]
  },
  "businessLogic": {
    "workflows": ["Workflow 1", "Workflow 2"],
    "rules": ["Business rule 1", "Business rule 2"],
    "automations": ["Automation 1", "Automation 2"]
  }
}

Focus on creating a complete, working business application that can be deployed immediately with all necessary integrations and business logic.`;
  }

  private parseBusinessResponse(data: any): BusinessApplication {
    // Validate and structure the AI response
    return {
      name: data.name || "Generated Business Application",
      description: data.description || "AI-generated business application",
      industry: data.industry || "General",
      techStack: Array.isArray(data.techStack) ? data.techStack : [],
      features: Array.isArray(data.features) ? data.features : [],
      architecture: {
        frontend: data.architecture?.frontend || "",
        backend: data.architecture?.backend || "",
        database: data.architecture?.database || "",
        deployment: data.architecture?.deployment || "",
      },
      code: {
        frontend: data.code?.frontend || "",
        backend: data.code?.backend || "",
        database: data.code?.database || "",
        configuration: data.code?.configuration || "",
      },
      integrations: {
        payments: data.integrations?.payments || "",
        cms: data.integrations?.cms || "",
        auth: data.integrations?.auth || "",
        analytics: data.integrations?.analytics || "",
      },
      deployment: {
        instructions: data.deployment?.instructions || "",
        environment: data.deployment?.environment || "",
        secrets: Array.isArray(data.deployment?.secrets)
          ? data.deployment.secrets
          : [],
      },
      businessLogic: {
        workflows: Array.isArray(data.businessLogic?.workflows)
          ? data.businessLogic.workflows
          : [],
        rules: Array.isArray(data.businessLogic?.rules)
          ? data.businessLogic.rules
          : [],
        automations: Array.isArray(data.businessLogic?.automations)
          ? data.businessLogic.automations
          : [],
      },
    };
  }

  // Generate specific business application types
  async generateEcommerceApp(
    requirements: Partial<BusinessRequirements>
  ): Promise<BusinessApplication> {
    const ecommerceRequirements: BusinessRequirements = {
      name: requirements.name || "E-commerce Store",
      description: requirements.description || "Complete e-commerce platform",
      industry: requirements.industry || "Retail",
      features: requirements.features || [
        "Product catalog",
        "Shopping cart",
        "Checkout process",
        "Payment processing",
        "Order management",
        "Customer accounts",
        "Inventory tracking",
        "Admin dashboard",
      ],
      userTypes: requirements.userTypes || ["Customers", "Admins", "Staff"],
      paymentRequired: true,
      contentManagement: true,
      userAccounts: true,
      integrations: requirements.integrations || [
        "Stripe",
        "Email",
        "Analytics",
      ],
      deployment: requirements.deployment || "cloudflare",
    };

    return this.generateBusinessApp(ecommerceRequirements);
  }

  async generateSaaSApp(
    requirements: Partial<BusinessRequirements>
  ): Promise<BusinessApplication> {
    const saasRequirements: BusinessRequirements = {
      name: requirements.name || "SaaS Application",
      description: requirements.description || "Software as a Service platform",
      industry: requirements.industry || "Technology",
      features: requirements.features || [
        "User management",
        "Subscription billing",
        "Dashboard",
        "API access",
        "Multi-tenancy",
        "Analytics",
        "Settings",
        "Notifications",
      ],
      userTypes: requirements.userTypes || [
        "Subscribers",
        "Admins",
        "Developers",
      ],
      paymentRequired: true,
      contentManagement: true,
      userAccounts: true,
      integrations: requirements.integrations || [
        "Stripe",
        "Auth0",
        "Analytics",
        "Email",
      ],
      deployment: requirements.deployment || "cloudflare",
    };

    return this.generateBusinessApp(saasRequirements);
  }

  async generateContentApp(
    requirements: Partial<BusinessRequirements>
  ): Promise<BusinessApplication> {
    const contentRequirements: BusinessRequirements = {
      name: requirements.name || "Content Platform",
      description:
        requirements.description ||
        "Content management and publishing platform",
      industry: requirements.industry || "Media",
      features: requirements.features || [
        "Content creation",
        "Publishing workflow",
        "User management",
        "SEO optimization",
        "Analytics",
        "Media management",
        "Comments system",
        "Search functionality",
      ],
      userTypes: requirements.userTypes || [
        "Authors",
        "Editors",
        "Readers",
        "Admins",
      ],
      paymentRequired: false,
      contentManagement: true,
      userAccounts: true,
      integrations: requirements.integrations || [
        "CMS",
        "Analytics",
        "Search",
        "Email",
      ],
      deployment: requirements.deployment || "cloudflare",
    };

    return this.generateBusinessApp(contentRequirements);
  }
}
