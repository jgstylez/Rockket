import { OpenAPIV3 } from "openapi-types";

export const swaggerConfig: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Rockket Platform API",
    description:
      "Comprehensive API for the Rockket multi-tenant SaaS platform. Build, deploy, and manage applications with AI-powered generation, visual building tools, and enterprise features.",
    version: "1.0.0",
    contact: {
      name: "Rockket API Support",
      email: "api@rockket.dev",
      url: "https://rockket.dev/support",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "https://api.rockket.dev",
      description: "Production server",
    },
    {
      url: "https://staging-api.rockket.dev",
      description: "Staging server",
    },
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "User authentication and authorization",
    },
    {
      name: "AI Generation",
      description: "AI-powered application generation",
    },
    {
      name: "Visual Builder",
      description: "Drag-and-drop visual builder",
    },
    {
      name: "Content Management",
      description: "CMS and content management",
    },
    {
      name: "E-commerce",
      description: "E-commerce and product management",
    },
    {
      name: "Analytics",
      description: "Analytics and tracking",
    },
    {
      name: "Tenants",
      description: "Multi-tenant management",
    },
    {
      name: "Users",
      description: "User management",
    },
    {
      name: "Features",
      description: "Feature flags and A/B testing",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token for authentication",
      },
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
        description: "API key for service-to-service authentication",
      },
    },
    schemas: {
      User: {
        type: "object",
        required: ["id", "email", "name", "role", "tenantId"],
        properties: {
          id: {
            type: "string",
            description: "Unique user identifier",
            example: "user_123456789",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "user@example.com",
          },
          name: {
            type: "string",
            description: "User full name",
            example: "John Doe",
          },
          avatar: {
            type: "string",
            format: "uri",
            description: "User avatar URL",
            example: "https://example.com/avatar.jpg",
          },
          role: {
            type: "string",
            enum: ["admin", "owner", "member", "viewer"],
            description: "User role within the tenant",
            example: "admin",
          },
          tenantId: {
            type: "string",
            description: "Tenant identifier",
            example: "tenant_123456789",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "User creation timestamp",
            example: "2024-01-01T00:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "User last update timestamp",
            example: "2024-01-01T00:00:00Z",
          },
        },
      },
      Tenant: {
        type: "object",
        required: ["id", "name", "slug", "plan", "status"],
        properties: {
          id: {
            type: "string",
            description: "Unique tenant identifier",
            example: "tenant_123456789",
          },
          name: {
            type: "string",
            description: "Tenant organization name",
            example: "Acme Corporation",
          },
          slug: {
            type: "string",
            description: "Tenant URL slug",
            example: "acme-corp",
          },
          domain: {
            type: "string",
            description: "Custom domain for the tenant",
            example: "acme.rockket.dev",
          },
          plan: {
            type: "string",
            enum: ["free", "starter", "professional", "enterprise"],
            description: "Tenant subscription plan",
            example: "professional",
          },
          status: {
            type: "string",
            enum: ["active", "suspended", "cancelled"],
            description: "Tenant status",
            example: "active",
          },
          settings: {
            type: "object",
            description: "Tenant configuration settings",
            properties: {
              branding: {
                type: "object",
                properties: {
                  primaryColor: { type: "string", example: "#FF6B35" },
                  secondaryColor: { type: "string", example: "#1E3A8A" },
                  logo: { type: "string", format: "uri" },
                },
              },
              features: {
                type: "object",
                properties: {
                  aiGenerator: { type: "boolean" },
                  visualBuilder: { type: "boolean" },
                  cms: { type: "boolean" },
                  ecommerce: { type: "boolean" },
                },
              },
            },
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Tenant creation timestamp",
            example: "2024-01-01T00:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Tenant last update timestamp",
            example: "2024-01-01T00:00:00Z",
          },
        },
      },
      AIGenerationRequest: {
        type: "object",
        required: ["prompt"],
        properties: {
          prompt: {
            type: "string",
            description:
              "Natural language description of the application to generate",
            example:
              "Create an e-commerce platform for selling handmade jewelry with inventory management and payment processing",
            minLength: 10,
            maxLength: 2000,
          },
          templateId: {
            type: "string",
            description: "Optional template ID to use as a starting point",
            example: "ecommerce-template-v1",
          },
          provider: {
            type: "string",
            enum: ["openai", "anthropic", "google"],
            description: "AI provider to use for generation",
            example: "openai",
            default: "openai",
          },
          context: {
            type: "object",
            description: "Additional context for generation",
            properties: {
              industry: { type: "string", example: "retail" },
              targetAudience: { type: "string", example: "small businesses" },
              features: {
                type: "array",
                items: { type: "string" },
                example: ["payment", "inventory", "analytics"],
              },
            },
          },
        },
      },
      AIGenerationResponse: {
        type: "object",
        required: ["success", "result"],
        properties: {
          success: {
            type: "boolean",
            description: "Whether the generation was successful",
            example: true,
          },
          result: {
            type: "object",
            description: "Generated application details",
            properties: {
              name: {
                type: "string",
                description: "Generated application name",
                example: "Handmade Jewelry Store",
              },
              description: {
                type: "string",
                description: "Application description",
                example: "Complete e-commerce platform for handmade jewelry",
              },
              techStack: {
                type: "array",
                items: { type: "string" },
                description: "Recommended technology stack",
                example: ["Next.js", "TypeScript", "Stripe", "Prisma"],
              },
              features: {
                type: "array",
                items: { type: "string" },
                description: "Implemented features",
                example: [
                  "Product catalog",
                  "Shopping cart",
                  "Payment processing",
                ],
              },
              code: {
                type: "object",
                description: "Generated code",
                properties: {
                  frontend: { type: "string", description: "Frontend code" },
                  backend: { type: "string", description: "Backend code" },
                  database: { type: "string", description: "Database schema" },
                  configuration: {
                    type: "string",
                    description: "Configuration files",
                  },
                },
              },
              deployment: {
                type: "object",
                description: "Deployment instructions",
                properties: {
                  instructions: {
                    type: "string",
                    description: "Step-by-step deployment guide",
                  },
                  environment: {
                    type: "string",
                    description: "Environment variables",
                  },
                  secrets: {
                    type: "array",
                    items: { type: "string" },
                    description: "Required secrets",
                  },
                },
              },
            },
          },
          metadata: {
            type: "object",
            description: "Generation metadata",
            properties: {
              provider: { type: "string", example: "openai" },
              tokens: { type: "number", example: 1500 },
              cost: { type: "number", example: 0.03 },
              duration: { type: "number", example: 2500 },
            },
          },
        },
      },
      VisualBuilderProject: {
        type: "object",
        required: ["id", "name", "components"],
        properties: {
          id: {
            type: "string",
            description: "Project identifier",
            example: "project_123456789",
          },
          name: {
            type: "string",
            description: "Project name",
            example: "My Landing Page",
          },
          description: {
            type: "string",
            description: "Project description",
            example: "A modern landing page for our product",
          },
          components: {
            type: "array",
            description: "Project components",
            items: {
              $ref: "#/components/schemas/BuilderComponent",
            },
          },
          settings: {
            type: "object",
            description: "Project settings",
            properties: {
              theme: { type: "string", example: "modern" },
              responsive: { type: "boolean", example: true },
              seo: { type: "object" },
            },
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Project creation timestamp",
            example: "2024-01-01T00:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Project last update timestamp",
            example: "2024-01-01T00:00:00Z",
          },
        },
      },
      BuilderComponent: {
        type: "object",
        required: ["id", "type", "props"],
        properties: {
          id: {
            type: "string",
            description: "Component identifier",
            example: "comp_123456789",
          },
          type: {
            type: "string",
            description: "Component type",
            example: "Button",
          },
          props: {
            type: "object",
            description: "Component properties",
            additionalProperties: true,
            example: {
              text: "Click me",
              variant: "primary",
              size: "medium",
            },
          },
          children: {
            type: "array",
            description: "Child components",
            items: {
              $ref: "#/components/schemas/BuilderComponent",
            },
          },
          position: {
            type: "object",
            description: "Component position",
            properties: {
              x: { type: "number", example: 100 },
              y: { type: "number", example: 200 },
            },
          },
        },
      },
      Content: {
        type: "object",
        required: ["id", "title", "slug", "type", "status", "content"],
        properties: {
          id: {
            type: "string",
            description: "Content identifier",
            example: "content_123456789",
          },
          title: {
            type: "string",
            description: "Content title",
            example: "Welcome to Our Platform",
          },
          slug: {
            type: "string",
            description: "Content URL slug",
            example: "welcome-to-our-platform",
          },
          type: {
            type: "string",
            enum: ["page", "post", "product", "course", "template"],
            description: "Content type",
            example: "page",
          },
          status: {
            type: "string",
            enum: ["draft", "published", "archived"],
            description: "Content status",
            example: "published",
          },
          content: {
            type: "string",
            description: "Content body",
            example:
              "<h1>Welcome to Our Platform</h1><p>This is the main content...</p>",
          },
          metadata: {
            type: "object",
            description: "Content metadata",
            properties: {
              seo: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  keywords: { type: "array", items: { type: "string" } },
                },
              },
              social: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  image: { type: "string", format: "uri" },
                },
              },
            },
          },
          publishedAt: {
            type: "string",
            format: "date-time",
            description: "Publication timestamp",
            example: "2024-01-01T00:00:00Z",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Content creation timestamp",
            example: "2024-01-01T00:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Content last update timestamp",
            example: "2024-01-01T00:00:00Z",
          },
        },
      },
      Product: {
        type: "object",
        required: ["id", "name", "description", "price", "currency", "sku"],
        properties: {
          id: {
            type: "string",
            description: "Product identifier",
            example: "product_123456789",
          },
          name: {
            type: "string",
            description: "Product name",
            example: "Premium Handmade Necklace",
          },
          description: {
            type: "string",
            description: "Product description",
            example: "Beautiful handmade necklace crafted with care",
          },
          price: {
            type: "number",
            format: "float",
            description: "Product price",
            example: 99.99,
          },
          currency: {
            type: "string",
            description: "Currency code",
            example: "USD",
          },
          sku: {
            type: "string",
            description: "Product SKU",
            example: "NECK-001",
          },
          inventory: {
            type: "integer",
            description: "Available inventory",
            example: 50,
          },
          images: {
            type: "array",
            items: { type: "string", format: "uri" },
            description: "Product images",
            example: [
              "https://example.com/image1.jpg",
              "https://example.com/image2.jpg",
            ],
          },
          variants: {
            type: "array",
            description: "Product variants",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                price: { type: "number" },
                sku: { type: "string" },
                inventory: { type: "integer" },
                attributes: { type: "object" },
              },
            },
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Product creation timestamp",
            example: "2024-01-01T00:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Product last update timestamp",
            example: "2024-01-01T00:00:00Z",
          },
        },
      },
      Order: {
        type: "object",
        required: ["id", "customerId", "items", "total", "currency", "status"],
        properties: {
          id: {
            type: "string",
            description: "Order identifier",
            example: "order_123456789",
          },
          customerId: {
            type: "string",
            description: "Customer identifier",
            example: "customer_123456789",
          },
          items: {
            type: "array",
            description: "Order items",
            items: {
              type: "object",
              properties: {
                productId: { type: "string" },
                variantId: { type: "string" },
                quantity: { type: "integer" },
                price: { type: "number" },
              },
            },
          },
          total: {
            type: "number",
            format: "float",
            description: "Order total",
            example: 199.98,
          },
          currency: {
            type: "string",
            description: "Currency code",
            example: "USD",
          },
          status: {
            type: "string",
            enum: [
              "pending",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ],
            description: "Order status",
            example: "pending",
          },
          paymentStatus: {
            type: "string",
            enum: ["pending", "paid", "failed", "refunded"],
            description: "Payment status",
            example: "pending",
          },
          shippingAddress: {
            type: "object",
            description: "Shipping address",
            properties: {
              firstName: { type: "string" },
              lastName: { type: "string" },
              address1: { type: "string" },
              address2: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              postalCode: { type: "string" },
              country: { type: "string" },
            },
          },
          billingAddress: {
            type: "object",
            description: "Billing address",
            properties: {
              firstName: { type: "string" },
              lastName: { type: "string" },
              address1: { type: "string" },
              address2: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              postalCode: { type: "string" },
              country: { type: "string" },
            },
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Order creation timestamp",
            example: "2024-01-01T00:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Order last update timestamp",
            example: "2024-01-01T00:00:00Z",
          },
        },
      },
      AnalyticsEvent: {
        type: "object",
        required: ["id", "event", "sessionId", "tenantId", "timestamp"],
        properties: {
          id: {
            type: "string",
            description: "Event identifier",
            example: "event_123456789",
          },
          event: {
            type: "string",
            description: "Event name",
            example: "page_view",
          },
          properties: {
            type: "object",
            description: "Event properties",
            additionalProperties: true,
            example: {
              page: "/dashboard",
              referrer: "https://google.com",
              duration: 30,
            },
          },
          userId: {
            type: "string",
            description: "User identifier (if authenticated)",
            example: "user_123456789",
          },
          sessionId: {
            type: "string",
            description: "Session identifier",
            example: "session_123456789",
          },
          tenantId: {
            type: "string",
            description: "Tenant identifier",
            example: "tenant_123456789",
          },
          timestamp: {
            type: "string",
            format: "date-time",
            description: "Event timestamp",
            example: "2024-01-01T00:00:00Z",
          },
        },
      },
      FeatureFlag: {
        type: "object",
        required: ["id", "name", "description", "enabled"],
        properties: {
          id: {
            type: "string",
            description: "Feature flag identifier",
            example: "flag_123456789",
          },
          name: {
            type: "string",
            description: "Feature flag name",
            example: "ai-generator-v2",
          },
          description: {
            type: "string",
            description: "Feature flag description",
            example: "Enable the new AI generator with improved capabilities",
          },
          enabled: {
            type: "boolean",
            description: "Whether the feature flag is enabled",
            example: true,
          },
          variants: {
            type: "array",
            description: "Feature flag variants for A/B testing",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                value: { type: "string" },
                weight: { type: "number" },
              },
            },
          },
          rules: {
            type: "array",
            description: "Feature flag rules",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                condition: { type: "string" },
                variant: { type: "string" },
                weight: { type: "number" },
              },
            },
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Feature flag creation timestamp",
            example: "2024-01-01T00:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Feature flag last update timestamp",
            example: "2024-01-01T00:00:00Z",
          },
        },
      },
      Error: {
        type: "object",
        required: ["error", "message"],
        properties: {
          error: {
            type: "string",
            description: "Error type",
            example: "ValidationError",
          },
          message: {
            type: "string",
            description: "Error message",
            example: "Invalid request parameters",
          },
          details: {
            type: "object",
            description: "Additional error details",
            additionalProperties: true,
          },
          code: {
            type: "string",
            description: "Error code",
            example: "INVALID_PARAMETERS",
          },
        },
      },
      PaginatedResponse: {
        type: "object",
        required: ["data", "pagination"],
        properties: {
          data: {
            type: "array",
            description: "Array of items",
            items: {},
          },
          pagination: {
            type: "object",
            required: ["page", "limit", "total", "pages"],
            properties: {
              page: {
                type: "integer",
                description: "Current page number",
                example: 1,
              },
              limit: {
                type: "integer",
                description: "Items per page",
                example: 20,
              },
              total: {
                type: "integer",
                description: "Total number of items",
                example: 100,
              },
              pages: {
                type: "integer",
                description: "Total number of pages",
                example: 5,
              },
            },
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Authentication required",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
            example: {
              error: "UnauthorizedError",
              message: "Authentication required",
              code: "AUTH_REQUIRED",
            },
          },
        },
      },
      ForbiddenError: {
        description: "Insufficient permissions",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
            example: {
              error: "ForbiddenError",
              message: "Insufficient permissions",
              code: "INSUFFICIENT_PERMISSIONS",
            },
          },
        },
      },
      NotFoundError: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
            example: {
              error: "NotFoundError",
              message: "Resource not found",
              code: "RESOURCE_NOT_FOUND",
            },
          },
        },
      },
      ValidationError: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
            example: {
              error: "ValidationError",
              message: "Invalid request parameters",
              code: "INVALID_PARAMETERS",
              details: {
                field: "email",
                message: "Invalid email format",
              },
            },
          },
        },
      },
      InternalServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
            example: {
              error: "InternalServerError",
              message: "An unexpected error occurred",
              code: "INTERNAL_ERROR",
            },
          },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};
