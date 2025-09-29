import { NextRequest } from "next/server";
import { POST } from "../ai/generate/route";

// Mock the AI service
jest.mock("@/lib/ai/providers", () => ({
  AIGenerationService: jest.fn().mockImplementation(() => ({
    generateApp: jest.fn(),
  })),
}));

// Mock the middleware
jest.mock("@/lib/auth/middleware", () => ({
  withAuth: jest.fn((request, handler) => {
    // Mock authenticated request
    const mockRequest = {
      ...request,
      user: {
        userId: "test-user-id",
        tenantId: "test-tenant-id",
        role: "admin",
      },
    };
    return handler(mockRequest);
  }),
}));

// Mock templates
jest.mock("@/lib/ai/templates", () => ({
  getTemplateById: jest.fn((id: string) => {
    if (id === "valid-template") {
      return {
        id: "valid-template",
        name: "E-commerce Template",
        prompt: "Generate an e-commerce application",
        category: "ecommerce",
      };
    }
    return null;
  }),
}));

describe("/api/ai/generate", () => {
  let mockAIService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAIService = {
      generateApp: jest.fn(),
    };

    // Reset the mock implementation
    const { AIGenerationService } = require("@/lib/ai/providers");
    AIGenerationService.mockImplementation(() => mockAIService);
  });

  describe("POST /api/ai/generate", () => {
    it("should generate app with prompt successfully", async () => {
      const mockResult = {
        name: "Generated App",
        description: "AI-generated application",
        code: "console.log('Hello World');",
        techStack: ["Next.js", "TypeScript"],
      };

      mockAIService.generateApp.mockResolvedValue(mockResult);

      const request = new NextRequest("http://localhost:3000/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: "Create a simple todo app",
          provider: "openai",
          context: { theme: "dark" },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result).toEqual(mockResult);
      expect(mockAIService.generateApp).toHaveBeenCalledWith(
        "Create a simple todo app",
        "openai",
        expect.objectContaining({
          theme: "dark",
          userId: "test-user-id",
          tenantId: "test-tenant-id",
          userRole: "admin",
        })
      );
    });

    it("should generate app with template successfully", async () => {
      const mockResult = {
        name: "E-commerce App",
        description: "Complete e-commerce platform",
        code: "// E-commerce code here",
        techStack: ["Next.js", "Stripe", "Prisma"],
      };

      mockAIService.generateApp.mockResolvedValue(mockResult);

      const request = new NextRequest("http://localhost:3000/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({
          templateId: "valid-template",
          provider: "anthropic",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result).toEqual(mockResult);
      expect(mockAIService.generateApp).toHaveBeenCalledWith(
        "Generate an e-commerce application",
        "anthropic",
        expect.objectContaining({
          userId: "test-user-id",
          tenantId: "test-tenant-id",
          userRole: "admin",
        })
      );
    });

    it("should return 400 when neither prompt nor templateId is provided", async () => {
      const request = new NextRequest("http://localhost:3000/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Either prompt or templateId is required");
    });

    it("should return 404 when template is not found", async () => {
      const request = new NextRequest("http://localhost:3000/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({
          templateId: "invalid-template",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Template not found");
    });

    it("should handle AI service errors", async () => {
      mockAIService.generateApp.mockRejectedValue(
        new Error("AI service error")
      );

      const request = new NextRequest("http://localhost:3000/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: "Create a simple app",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to generate application");
    });

    it("should handle malformed JSON request", async () => {
      const request = new NextRequest("http://localhost:3000/api/ai/generate", {
        method: "POST",
        body: "invalid json",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it("should use default provider when not specified", async () => {
      const mockResult = {
        name: "Generated App",
        description: "AI-generated application",
      };

      mockAIService.generateApp.mockResolvedValue(mockResult);

      const request = new NextRequest("http://localhost:3000/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: "Create a simple app",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockAIService.generateApp).toHaveBeenCalledWith(
        "Create a simple app",
        "openai", // Default provider
        expect.any(Object)
      );
    });

    it("should include user context in AI generation", async () => {
      const mockResult = {
        name: "Generated App",
        description: "AI-generated application",
      };

      mockAIService.generateApp.mockResolvedValue(mockResult);

      const request = new NextRequest("http://localhost:3000/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: "Create a simple app",
          context: { customField: "customValue" },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockAIService.generateApp).toHaveBeenCalledWith(
        "Create a simple app",
        "openai",
        expect.objectContaining({
          customField: "customValue",
          userId: "test-user-id",
          tenantId: "test-tenant-id",
          userRole: "admin",
        })
      );
    });

    it("should handle different AI providers", async () => {
      const mockResult = {
        name: "Generated App",
        description: "AI-generated application",
      };

      mockAIService.generateApp.mockResolvedValue(mockResult);

      const providers = ["openai", "anthropic", "google"];

      for (const provider of providers) {
        const request = new NextRequest(
          "http://localhost:3000/api/ai/generate",
          {
            method: "POST",
            body: JSON.stringify({
              prompt: "Create a simple app",
              provider,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockAIService.generateApp).toHaveBeenCalledWith(
          "Create a simple app",
          provider,
          expect.any(Object)
        );
      }
    });
  });
});
