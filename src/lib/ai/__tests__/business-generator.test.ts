import {
  BusinessApplicationGenerator,
  type BusinessRequirements,
} from "../business-generator";

// Mock the AI service
jest.mock("../providers", () => ({
  AIGenerationService: jest.fn().mockImplementation(() => ({
    generateApp: jest.fn(),
  })),
}));

describe("BusinessApplicationGenerator", () => {
  let generator: BusinessApplicationGenerator;
  let mockAIService: any;

  beforeEach(() => {
    generator = new BusinessApplicationGenerator();
    mockAIService = (generator as any).aiService;
  });

  describe("generateBusinessApp", () => {
    const mockRequirements: BusinessRequirements = {
      name: "Test E-commerce Store",
      description: "A complete e-commerce platform",
      industry: "Retail",
      features: ["Product catalog", "Shopping cart", "Payment processing"],
      userTypes: ["Customers", "Admins"],
      paymentRequired: true,
      contentManagement: true,
      userAccounts: true,
      integrations: ["Stripe", "Email"],
      deployment: "cloudflare",
    };

    it("should generate a business application successfully", async () => {
      const mockResponse = {
        data: {
          name: "Test E-commerce Store",
          description: "A complete e-commerce platform",
          industry: "Retail",
          techStack: ["Next.js", "TypeScript", "Prisma"],
          features: ["Product catalog", "Shopping cart", "Payment processing"],
          architecture: {
            frontend: "Next.js with TypeScript",
            backend: "Next.js API routes",
            database: "PostgreSQL with Prisma",
            deployment: "Cloudflare Workers",
          },
          code: {
            frontend: "// Frontend code here",
            backend: "// Backend code here",
            database: "// Database schema here",
            configuration: "// Configuration files here",
          },
          integrations: {
            payments: "// Stripe integration code",
            cms: "// CMS integration code",
            auth: "// Authentication code",
            analytics: "// Analytics code",
          },
          deployment: {
            instructions: "Step-by-step deployment guide",
            environment: "Environment variables",
            secrets: ["STRIPE_SECRET_KEY", "DATABASE_URL"],
          },
          businessLogic: {
            workflows: ["Order processing workflow"],
            rules: ["Business rules"],
            automations: ["Email notifications"],
          },
        },
      };

      mockAIService.generateApp.mockResolvedValue(mockResponse);

      const result = await generator.generateBusinessApp(mockRequirements);

      expect(result).toBeDefined();
      expect(result.name).toBe("Test E-commerce Store");
      expect(result.description).toBe("A complete e-commerce platform");
      expect(result.industry).toBe("Retail");
      expect(result.techStack).toEqual(["Next.js", "TypeScript", "Prisma"]);
      expect(result.features).toEqual([
        "Product catalog",
        "Shopping cart",
        "Payment processing",
      ]);
      expect(result.architecture).toBeDefined();
      expect(result.code).toBeDefined();
      expect(result.integrations).toBeDefined();
      expect(result.deployment).toBeDefined();
      expect(result.businessLogic).toBeDefined();
    });

    it("should handle AI service errors", async () => {
      mockAIService.generateApp.mockRejectedValue(
        new Error("AI service error")
      );

      await expect(
        generator.generateBusinessApp(mockRequirements)
      ).rejects.toThrow("Failed to generate business application");
    });

    it("should handle malformed AI response", async () => {
      const malformedResponse = {
        data: {
          name: "Test App",
          // Missing required fields
        },
      };

      mockAIService.generateApp.mockResolvedValue(malformedResponse);

      const result = await generator.generateBusinessApp(mockRequirements);

      expect(result).toBeDefined();
      expect(result.name).toBe("Test App");
      expect(result.description).toBe("AI-generated business application");
      expect(result.industry).toBe("General");
      expect(result.techStack).toEqual([]);
      expect(result.features).toEqual([]);
    });
  });

  describe("generateEcommerceApp", () => {
    it("should generate e-commerce specific application", async () => {
      const mockResponse = {
        data: {
          name: "E-commerce Store",
          description: "Complete e-commerce platform",
          industry: "Retail",
          features: [
            "Product catalog",
            "Shopping cart",
            "Checkout process",
            "Payment processing",
            "Order management",
            "Customer accounts",
            "Inventory tracking",
            "Admin dashboard",
          ],
          techStack: ["Next.js", "TypeScript", "Stripe"],
          architecture: {
            frontend: "Next.js e-commerce frontend",
            backend: "Next.js API with Stripe",
            database: "PostgreSQL for products and orders",
            deployment: "Cloudflare Workers",
          },
          code: {
            frontend: "// E-commerce frontend code",
            backend: "// E-commerce backend code",
            database: "// Product and order schemas",
            configuration: "// E-commerce configuration",
          },
          integrations: {
            payments: "// Stripe payment integration",
            cms: "// Product management CMS",
            auth: "// Customer authentication",
            analytics: "// E-commerce analytics",
          },
          deployment: {
            instructions: "E-commerce deployment guide",
            environment: "E-commerce environment variables",
            secrets: ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY"],
          },
          businessLogic: {
            workflows: ["Order processing", "Inventory management"],
            rules: ["Pricing rules", "Shipping rules"],
            automations: ["Order confirmations", "Inventory alerts"],
          },
        },
      };

      mockAIService.generateApp.mockResolvedValue(mockResponse);

      const result = await generator.generateEcommerceApp({
        name: "My Store",
        description: "My e-commerce store",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("E-commerce Store");
      expect(result.features).toContain("Product catalog");
      expect(result.features).toContain("Shopping cart");
      expect(result.features).toContain("Payment processing");
      expect(result.integrations.payments).toContain("Stripe");
    });
  });

  describe("generateSaaSApp", () => {
    it("should generate SaaS specific application", async () => {
      const mockResponse = {
        data: {
          name: "SaaS Application",
          description: "Software as a Service platform",
          industry: "Technology",
          features: [
            "User management",
            "Subscription billing",
            "Dashboard",
            "API access",
            "Multi-tenancy",
            "Analytics",
            "Settings",
            "Notifications",
          ],
          techStack: ["Next.js", "TypeScript", "Prisma", "Stripe"],
          architecture: {
            frontend: "Next.js SaaS dashboard",
            backend: "Next.js API with multi-tenancy",
            database: "PostgreSQL with tenant isolation",
            deployment: "Cloudflare Workers",
          },
          code: {
            frontend: "// SaaS dashboard code",
            backend: "// Multi-tenant API code",
            database: "// Multi-tenant database schema",
            configuration: "// SaaS configuration",
          },
          integrations: {
            payments: "// Stripe subscription billing",
            cms: "// Content management",
            auth: "// Multi-tenant authentication",
            analytics: "// SaaS analytics",
          },
          deployment: {
            instructions: "SaaS deployment guide",
            environment: "SaaS environment variables",
            secrets: ["STRIPE_SECRET_KEY", "JWT_SECRET"],
          },
          businessLogic: {
            workflows: ["User onboarding", "Subscription management"],
            rules: ["Access control", "Billing rules"],
            automations: ["Welcome emails", "Billing notifications"],
          },
        },
      };

      mockAIService.generateApp.mockResolvedValue(mockResponse);

      const result = await generator.generateSaaSApp({
        name: "My SaaS",
        description: "My SaaS platform",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("SaaS Application");
      expect(result.features).toContain("User management");
      expect(result.features).toContain("Subscription billing");
      expect(result.features).toContain("Multi-tenancy");
      expect(result.integrations.payments).toContain("Stripe");
    });
  });

  describe("generateContentApp", () => {
    it("should generate content management specific application", async () => {
      const mockResponse = {
        data: {
          name: "Content Platform",
          description: "Content management and publishing platform",
          industry: "Media",
          features: [
            "Content creation",
            "Publishing workflow",
            "User management",
            "SEO optimization",
            "Analytics",
            "Media management",
            "Comments system",
            "Search functionality",
          ],
          techStack: ["Next.js", "TypeScript", "Prisma", "Directus"],
          architecture: {
            frontend: "Next.js content platform",
            backend: "Next.js API with CMS integration",
            database: "PostgreSQL for content and users",
            deployment: "Cloudflare Workers",
          },
          code: {
            frontend: "// Content platform frontend",
            backend: "// Content API code",
            database: "// Content and user schemas",
            configuration: "// Content platform configuration",
          },
          integrations: {
            payments: "// Optional payment integration",
            cms: "// Directus CMS integration",
            auth: "// User authentication",
            analytics: "// Content analytics",
          },
          deployment: {
            instructions: "Content platform deployment guide",
            environment: "Content platform environment variables",
            secrets: ["DIRECTUS_TOKEN", "JWT_SECRET"],
          },
          businessLogic: {
            workflows: ["Content publishing", "Editorial workflow"],
            rules: ["Content approval", "SEO rules"],
            automations: ["Content notifications", "SEO optimization"],
          },
        },
      };

      mockAIService.generateApp.mockResolvedValue(mockResponse);

      const result = await generator.generateContentApp({
        name: "My Blog",
        description: "My content platform",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("Content Platform");
      expect(result.features).toContain("Content creation");
      expect(result.features).toContain("Publishing workflow");
      expect(result.features).toContain("SEO optimization");
      expect(result.integrations.cms).toContain("Directus");
    });
  });

  describe("buildBusinessPrompt", () => {
    it("should build comprehensive business prompt", () => {
      const requirements: BusinessRequirements = {
        name: "Test Business",
        description: "Test description",
        industry: "Technology",
        features: ["Feature 1", "Feature 2"],
        userTypes: ["User Type 1", "User Type 2"],
        paymentRequired: true,
        contentManagement: true,
        userAccounts: true,
        integrations: ["Integration 1", "Integration 2"],
        deployment: "cloudflare",
      };

      const prompt = (generator as any).buildBusinessPrompt(requirements);

      expect(prompt).toContain("Test Business");
      expect(prompt).toContain("Test description");
      expect(prompt).toContain("Technology");
      expect(prompt).toContain("Feature 1, Feature 2");
      expect(prompt).toContain("User Type 1, User Type 2");
      expect(prompt).toContain("Required");
      expect(prompt).toContain("Integration 1, Integration 2");
      expect(prompt).toContain("cloudflare");
      expect(prompt).toContain("OUTPUT FORMAT");
      expect(prompt).toContain("JSON response");
    });
  });

  describe("parseBusinessResponse", () => {
    it("should parse valid business response", () => {
      const mockData = {
        name: "Test App",
        description: "Test description",
        industry: "Technology",
        techStack: ["Next.js", "TypeScript"],
        features: ["Feature 1", "Feature 2"],
        architecture: {
          frontend: "Next.js",
          backend: "API routes",
          database: "PostgreSQL",
          deployment: "Cloudflare",
        },
        code: {
          frontend: "// Frontend code",
          backend: "// Backend code",
          database: "// Database schema",
          configuration: "// Config files",
        },
        integrations: {
          payments: "// Payment code",
          cms: "// CMS code",
          auth: "// Auth code",
          analytics: "// Analytics code",
        },
        deployment: {
          instructions: "Deployment guide",
          environment: "Environment variables",
          secrets: ["SECRET_1", "SECRET_2"],
        },
        businessLogic: {
          workflows: ["Workflow 1"],
          rules: ["Rule 1"],
          automations: ["Automation 1"],
        },
      };

      const result = (generator as any).parseBusinessResponse(mockData);

      expect(result).toEqual({
        name: "Test App",
        description: "Test description",
        industry: "Technology",
        techStack: ["Next.js", "TypeScript"],
        features: ["Feature 1", "Feature 2"],
        architecture: {
          frontend: "Next.js",
          backend: "API routes",
          database: "PostgreSQL",
          deployment: "Cloudflare",
        },
        code: {
          frontend: "// Frontend code",
          backend: "// Backend code",
          database: "// Database schema",
          configuration: "// Config files",
        },
        integrations: {
          payments: "// Payment code",
          cms: "// CMS code",
          auth: "// Auth code",
          analytics: "// Analytics code",
        },
        deployment: {
          instructions: "Deployment guide",
          environment: "Environment variables",
          secrets: ["SECRET_1", "SECRET_2"],
        },
        businessLogic: {
          workflows: ["Workflow 1"],
          rules: ["Rule 1"],
          automations: ["Automation 1"],
        },
      });
    });

    it("should handle malformed response with defaults", () => {
      const malformedData = {
        name: "Test App",
        // Missing other fields
      };

      const result = (generator as any).parseBusinessResponse(malformedData);

      expect(result.name).toBe("Test App");
      expect(result.description).toBe("AI-generated business application");
      expect(result.industry).toBe("General");
      expect(result.techStack).toEqual([]);
      expect(result.features).toEqual([]);
      expect(result.architecture).toEqual({
        frontend: "",
        backend: "",
        database: "",
        deployment: "",
      });
      expect(result.code).toEqual({
        frontend: "",
        backend: "",
        database: "",
        configuration: "",
      });
      expect(result.integrations).toEqual({
        payments: "",
        cms: "",
        auth: "",
        analytics: "",
      });
      expect(result.deployment).toEqual({
        instructions: "",
        environment: "",
        secrets: [],
      });
      expect(result.businessLogic).toEqual({
        workflows: [],
        rules: [],
        automations: [],
      });
    });
  });
});
