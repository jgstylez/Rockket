import { swaggerConfig } from "./swagger";

// API Documentation Generator
export class APIDocumentationGenerator {
  private config: typeof swaggerConfig;

  constructor() {
    this.config = swaggerConfig;
  }

  // Generate OpenAPI specification
  generateOpenAPISpec(): typeof swaggerConfig {
    return this.config;
  }

  // Add API endpoint documentation
  addEndpoint(
    path: string,
    method: "get" | "post" | "put" | "delete" | "patch",
    endpoint: any
  ) {
    if (!this.config.paths) {
      this.config.paths = {};
    }

    if (!this.config.paths[path]) {
      this.config.paths[path] = {};
    }

    this.config.paths[path][method] = endpoint;
  }

  // Add AI Generation endpoints
  addAIGenerationEndpoints() {
    // POST /api/ai/generate
    this.addEndpoint("/api/ai/generate", "post", {
      tags: ["AI Generation"],
      summary: "Generate application with AI",
      description:
        "Generate a complete application using AI based on natural language description",
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AIGenerationRequest",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Application generated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AIGenerationResponse",
              },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
        "500": {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    });

    // GET /api/ai/providers
    this.addEndpoint("/api/ai/providers", "get", {
      tags: ["AI Generation"],
      summary: "Get available AI providers",
      description:
        "Retrieve list of available AI providers and their capabilities",
      security: [{ BearerAuth: [] }],
      responses: {
        "200": {
          description: "AI providers retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  providers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "openai" },
                        name: { type: "string", example: "OpenAI" },
                        models: {
                          type: "array",
                          items: { type: "string" },
                          example: ["gpt-4", "gpt-3.5-turbo"],
                        },
                        capabilities: {
                          type: "array",
                          items: { type: "string" },
                          example: ["text-generation", "code-generation"],
                        },
                        costPerToken: { type: "number", example: 0.00003 },
                        rateLimit: { type: "integer", example: 1000 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // GET /api/ai/templates
    this.addEndpoint("/api/ai/templates", "get", {
      tags: ["AI Generation"],
      summary: "Get AI generation templates",
      description: "Retrieve available templates for AI generation",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "category",
          in: "query",
          description: "Filter templates by category",
          schema: {
            type: "string",
            enum: ["ecommerce", "saas", "blog", "portfolio"],
          },
        },
      ],
      responses: {
        "200": {
          description: "Templates retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  templates: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          example: "ecommerce-template-v1",
                        },
                        name: { type: "string", example: "E-commerce Store" },
                        description: {
                          type: "string",
                          example: "Complete e-commerce platform",
                        },
                        category: { type: "string", example: "ecommerce" },
                        features: {
                          type: "array",
                          items: { type: "string" },
                          example: [
                            "Product catalog",
                            "Shopping cart",
                            "Payment processing",
                          ],
                        },
                        prompt: {
                          type: "string",
                          example: "Generate an e-commerce platform...",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });
  }

  // Add Visual Builder endpoints
  addVisualBuilderEndpoints() {
    // GET /api/builder/projects
    this.addEndpoint("/api/builder/projects", "get", {
      tags: ["Visual Builder"],
      summary: "Get visual builder projects",
      description:
        "Retrieve all visual builder projects for the current tenant",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Page number",
          schema: { type: "integer", default: 1, minimum: 1 },
        },
        {
          name: "limit",
          in: "query",
          description: "Items per page",
          schema: { type: "integer", default: 20, minimum: 1, maximum: 100 },
        },
      ],
      responses: {
        "200": {
          description: "Projects retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/PaginatedResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/VisualBuilderProject",
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // POST /api/builder/projects
    this.addEndpoint("/api/builder/projects", "post", {
      tags: ["Visual Builder"],
      summary: "Create visual builder project",
      description: "Create a new visual builder project",
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "My Landing Page" },
                description: {
                  type: "string",
                  example: "A modern landing page",
                },
                components: {
                  type: "array",
                  items: { $ref: "#/components/schemas/BuilderComponent" },
                },
                settings: {
                  type: "object",
                  properties: {
                    theme: { type: "string", example: "modern" },
                    responsive: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Project created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VisualBuilderProject" },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // GET /api/builder/projects/{id}
    this.addEndpoint("/api/builder/projects/{id}", "get", {
      tags: ["Visual Builder"],
      summary: "Get visual builder project",
      description: "Retrieve a specific visual builder project",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Project identifier",
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": {
          description: "Project retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VisualBuilderProject" },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
        "404": {
          $ref: "#/components/responses/NotFoundError",
        },
      },
    });

    // PUT /api/builder/projects/{id}
    this.addEndpoint("/api/builder/projects/{id}", "put", {
      tags: ["Visual Builder"],
      summary: "Update visual builder project",
      description: "Update an existing visual builder project",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Project identifier",
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                components: {
                  type: "array",
                  items: { $ref: "#/components/schemas/BuilderComponent" },
                },
                settings: { type: "object" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Project updated successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VisualBuilderProject" },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
        "404": {
          $ref: "#/components/responses/NotFoundError",
        },
      },
    });

    // DELETE /api/builder/projects/{id}
    this.addEndpoint("/api/builder/projects/{id}", "delete", {
      tags: ["Visual Builder"],
      summary: "Delete visual builder project",
      description: "Delete a visual builder project",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Project identifier",
          schema: { type: "string" },
        },
      ],
      responses: {
        "204": {
          description: "Project deleted successfully",
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
        "404": {
          $ref: "#/components/responses/NotFoundError",
        },
      },
    });
  }

  // Add Content Management endpoints
  addContentManagementEndpoints() {
    // GET /api/cms/pages
    this.addEndpoint("/api/cms/pages", "get", {
      tags: ["Content Management"],
      summary: "Get CMS pages",
      description: "Retrieve all CMS pages for the current tenant",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "status",
          in: "query",
          description: "Filter by content status",
          schema: { type: "string", enum: ["draft", "published", "archived"] },
        },
        {
          name: "type",
          in: "query",
          description: "Filter by content type",
          schema: {
            type: "string",
            enum: ["page", "post", "product", "course", "template"],
          },
        },
        {
          name: "page",
          in: "query",
          description: "Page number",
          schema: { type: "integer", default: 1, minimum: 1 },
        },
        {
          name: "limit",
          in: "query",
          description: "Items per page",
          schema: { type: "integer", default: 20, minimum: 1, maximum: 100 },
        },
      ],
      responses: {
        "200": {
          description: "Pages retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/PaginatedResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Content" },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // POST /api/cms/pages
    this.addEndpoint("/api/cms/pages", "post", {
      tags: ["Content Management"],
      summary: "Create CMS page",
      description: "Create a new CMS page",
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "slug", "type", "content"],
              properties: {
                title: { type: "string", example: "Welcome to Our Platform" },
                slug: { type: "string", example: "welcome-to-our-platform" },
                type: {
                  type: "string",
                  enum: ["page", "post", "product", "course", "template"],
                },
                status: {
                  type: "string",
                  enum: ["draft", "published", "archived"],
                  default: "draft",
                },
                content: {
                  type: "string",
                  example: "<h1>Welcome</h1><p>Content here...</p>",
                },
                metadata: {
                  type: "object",
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
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Page created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Content" },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // GET /api/cms/pages/{id}
    this.addEndpoint("/api/cms/pages/{id}", "get", {
      tags: ["Content Management"],
      summary: "Get CMS page",
      description: "Retrieve a specific CMS page",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Page identifier",
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": {
          description: "Page retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Content" },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
        "404": {
          $ref: "#/components/responses/NotFoundError",
        },
      },
    });

    // PUT /api/cms/pages/{id}
    this.addEndpoint("/api/cms/pages/{id}", "put", {
      tags: ["Content Management"],
      summary: "Update CMS page",
      description: "Update an existing CMS page",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Page identifier",
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                slug: { type: "string" },
                type: {
                  type: "string",
                  enum: ["page", "post", "product", "course", "template"],
                },
                status: {
                  type: "string",
                  enum: ["draft", "published", "archived"],
                },
                content: { type: "string" },
                metadata: { type: "object" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Page updated successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Content" },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
        "404": {
          $ref: "#/components/responses/NotFoundError",
        },
      },
    });

    // DELETE /api/cms/pages/{id}
    this.addEndpoint("/api/cms/pages/{id}", "delete", {
      tags: ["Content Management"],
      summary: "Delete CMS page",
      description: "Delete a CMS page",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Page identifier",
          schema: { type: "string" },
        },
      ],
      responses: {
        "204": {
          description: "Page deleted successfully",
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
        "404": {
          $ref: "#/components/responses/NotFoundError",
        },
      },
    });
  }

  // Add E-commerce endpoints
  addEcommerceEndpoints() {
    // GET /api/ecommerce/products
    this.addEndpoint("/api/ecommerce/products", "get", {
      tags: ["E-commerce"],
      summary: "Get products",
      description: "Retrieve all products for the current tenant",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Page number",
          schema: { type: "integer", default: 1, minimum: 1 },
        },
        {
          name: "limit",
          in: "query",
          description: "Items per page",
          schema: { type: "integer", default: 20, minimum: 1, maximum: 100 },
        },
        {
          name: "search",
          in: "query",
          description: "Search products by name or description",
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": {
          description: "Products retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/PaginatedResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Product" },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // POST /api/ecommerce/products
    this.addEndpoint("/api/ecommerce/products", "post", {
      tags: ["E-commerce"],
      summary: "Create product",
      description: "Create a new product",
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "description", "price", "currency", "sku"],
              properties: {
                name: { type: "string", example: "Premium Handmade Necklace" },
                description: {
                  type: "string",
                  example: "Beautiful handmade necklace",
                },
                price: { type: "number", format: "float", example: 99.99 },
                currency: { type: "string", example: "USD" },
                sku: { type: "string", example: "NECK-001" },
                inventory: { type: "integer", example: 50 },
                images: {
                  type: "array",
                  items: { type: "string", format: "uri" },
                  example: ["https://example.com/image1.jpg"],
                },
                variants: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      price: { type: "number" },
                      sku: { type: "string" },
                      inventory: { type: "integer" },
                      attributes: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Product created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // GET /api/ecommerce/orders
    this.addEndpoint("/api/ecommerce/orders", "get", {
      tags: ["E-commerce"],
      summary: "Get orders",
      description: "Retrieve all orders for the current tenant",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "status",
          in: "query",
          description: "Filter by order status",
          schema: {
            type: "string",
            enum: [
              "pending",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ],
          },
        },
        {
          name: "page",
          in: "query",
          description: "Page number",
          schema: { type: "integer", default: 1, minimum: 1 },
        },
        {
          name: "limit",
          in: "query",
          description: "Items per page",
          schema: { type: "integer", default: 20, minimum: 1, maximum: 100 },
        },
      ],
      responses: {
        "200": {
          description: "Orders retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/PaginatedResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Order" },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });
  }

  // Add Analytics endpoints
  addAnalyticsEndpoints() {
    // POST /api/analytics/track
    this.addEndpoint("/api/analytics/track", "post", {
      tags: ["Analytics"],
      summary: "Track analytics event",
      description: "Track a custom analytics event",
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["event"],
              properties: {
                event: { type: "string", example: "page_view" },
                properties: {
                  type: "object",
                  additionalProperties: true,
                  example: {
                    page: "/dashboard",
                    referrer: "https://google.com",
                    duration: 30,
                  },
                },
                sessionId: { type: "string", example: "session_123456789" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Event tracked successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  eventId: { type: "string", example: "event_123456789" },
                },
              },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // GET /api/analytics/events
    this.addEndpoint("/api/analytics/events", "get", {
      tags: ["Analytics"],
      summary: "Get analytics events",
      description: "Retrieve analytics events for the current tenant",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "event",
          in: "query",
          description: "Filter by event name",
          schema: { type: "string" },
        },
        {
          name: "startDate",
          in: "query",
          description: "Start date for events",
          schema: { type: "string", format: "date" },
        },
        {
          name: "endDate",
          in: "query",
          description: "End date for events",
          schema: { type: "string", format: "date" },
        },
        {
          name: "page",
          in: "query",
          description: "Page number",
          schema: { type: "integer", default: 1, minimum: 1 },
        },
        {
          name: "limit",
          in: "query",
          description: "Items per page",
          schema: { type: "integer", default: 20, minimum: 1, maximum: 100 },
        },
      ],
      responses: {
        "200": {
          description: "Events retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/PaginatedResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/AnalyticsEvent" },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });
  }

  // Add Authentication endpoints
  addAuthenticationEndpoints() {
    // POST /api/auth/login
    this.addEndpoint("/api/auth/login", "post", {
      tags: ["Authentication"],
      summary: "User login",
      description: "Authenticate user and return JWT token",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  token: { type: "string", example: "jwt_token_here" },
                  user: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // POST /api/auth/register
    this.addEndpoint("/api/auth/register", "post", {
      tags: ["Authentication"],
      summary: "User registration",
      description: "Register a new user and create tenant",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password", "name", "tenantName"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                password: { type: "string", example: "password123" },
                name: { type: "string", example: "John Doe" },
                tenantName: { type: "string", example: "Acme Corporation" },
                tenantSlug: { type: "string", example: "acme-corp" },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Registration successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  token: { type: "string", example: "jwt_token_here" },
                  user: { $ref: "#/components/schemas/User" },
                  tenant: { $ref: "#/components/schemas/Tenant" },
                },
              },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
      },
    });

    // GET /api/auth/me
    this.addEndpoint("/api/auth/me", "get", {
      tags: ["Authentication"],
      summary: "Get current user",
      description: "Get current authenticated user information",
      security: [{ BearerAuth: [] }],
      responses: {
        "200": {
          description: "User information retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: { $ref: "#/components/schemas/User" },
                  tenant: { $ref: "#/components/schemas/Tenant" },
                },
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // POST /api/auth/logout
    this.addEndpoint("/api/auth/logout", "post", {
      tags: ["Authentication"],
      summary: "User logout",
      description: "Logout user and invalidate token",
      security: [{ BearerAuth: [] }],
      responses: {
        "200": {
          description: "Logout successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Logged out successfully",
                  },
                },
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });
  }

  // Add Feature Flags endpoints
  addFeatureFlagsEndpoints() {
    // GET /api/features
    this.addEndpoint("/api/features", "get", {
      tags: ["Features"],
      summary: "Get feature flags",
      description: "Retrieve all feature flags for the current tenant",
      security: [{ BearerAuth: [] }],
      responses: {
        "200": {
          description: "Feature flags retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  flags: {
                    type: "array",
                    items: { $ref: "#/components/schemas/FeatureFlag" },
                  },
                },
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    });

    // GET /api/features/{name}
    this.addEndpoint("/api/features/{name}", "get", {
      tags: ["Features"],
      summary: "Get feature flag",
      description: "Retrieve a specific feature flag",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "name",
          in: "path",
          required: true,
          description: "Feature flag name",
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": {
          description: "Feature flag retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FeatureFlag" },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError",
        },
        "404": {
          $ref: "#/components/responses/NotFoundError",
        },
      },
    });
  }

  // Generate complete API documentation
  generateCompleteDocumentation() {
    this.addAIGenerationEndpoints();
    this.addVisualBuilderEndpoints();
    this.addContentManagementEndpoints();
    this.addEcommerceEndpoints();
    this.addAnalyticsEndpoints();
    this.addAuthenticationEndpoints();
    this.addFeatureFlagsEndpoints();

    return this.config;
  }
}

// Export the documentation generator
export const apiDocsGenerator = new APIDocumentationGenerator();
export const completeAPIDocs = apiDocsGenerator.generateCompleteDocumentation();
