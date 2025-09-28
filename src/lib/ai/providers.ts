import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

// OpenAI Provider
export class OpenAIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
    });
  }

  async generateApp(prompt: string, context: any): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert full-stack developer. Generate a complete application based on the user's requirements. 
            Return a structured JSON response with the following format:
            {
              "name": "App Name",
              "description": "App description",
              "techStack": ["React", "Node.js", "PostgreSQL"],
              "features": ["Feature 1", "Feature 2"],
              "code": {
                "frontend": "Frontend code here",
                "backend": "Backend code here",
                "database": "Database schema here"
              },
              "deployment": "Deployment instructions"
            }`,
          },
          {
            role: "user",
            content: `Generate an application based on: ${prompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("OpenAI generation error:", error);
      throw new Error("Failed to generate application with OpenAI");
    }
  }
}

// Anthropic Provider
export class AnthropicProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey,
    });
  }

  async generateApp(prompt: string, context: any): Promise<string> {
    try {
      const response = await this.client.completions.create({
        model: "claude-3-sonnet-20240229",
        max_tokens_to_sample: 4000,
        prompt: `You are an expert full-stack developer. Generate a complete application based on the user's requirements.
        
        Return a structured JSON response with the following format:
        {
          "name": "App Name",
          "description": "App description", 
          "techStack": ["React", "Node.js", "PostgreSQL"],
          "features": ["Feature 1", "Feature 2"],
          "code": {
            "frontend": "Frontend code here",
            "backend": "Backend code here", 
            "database": "Database schema here"
          },
          "deployment": "Deployment instructions"
        }
        
        User requirements: ${prompt}`,
      });

      return response.completion || "";
    } catch (error) {
      console.error("Anthropic generation error:", error);
      throw new Error("Failed to generate application with Anthropic");
    }
  }
}

// Google AI Provider
export class GoogleAIProvider {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateApp(prompt: string, context: any): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(`
        You are an expert full-stack developer. Generate a complete application based on the user's requirements.
        
        Return a structured JSON response with the following format:
        {
          "name": "App Name",
          "description": "App description",
          "techStack": ["React", "Node.js", "PostgreSQL"], 
          "features": ["Feature 1", "Feature 2"],
          "code": {
            "frontend": "Frontend code here",
            "backend": "Backend code here",
            "database": "Database schema here"
          },
          "deployment": "Deployment instructions"
        }
        
        User requirements: ${prompt}
      `);

      return result.response.text();
    } catch (error) {
      console.error("Google AI generation error:", error);
      throw new Error("Failed to generate application with Google AI");
    }
  }
}

// AI Provider Factory
export class AIProviderFactory {
  static createProvider(provider: string, apiKey: string) {
    switch (provider.toLowerCase()) {
      case "openai":
        return new OpenAIProvider(apiKey);
      case "anthropic":
        return new AnthropicProvider(apiKey);
      case "google":
        return new GoogleAIProvider(apiKey);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
}

// AI Generation Service
export class AIGenerationService {
  private providers: Map<string, any> = new Map();

  constructor() {
    // Initialize providers with API keys from environment
    if (process.env.OPENAI_API_KEY) {
      this.providers.set(
        "openai",
        new OpenAIProvider(process.env.OPENAI_API_KEY)
      );
    }
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set(
        "anthropic",
        new AnthropicProvider(process.env.ANTHROPIC_API_KEY)
      );
    }
    if (process.env.GOOGLE_AI_API_KEY) {
      this.providers.set(
        "google",
        new GoogleAIProvider(process.env.GOOGLE_AI_API_KEY)
      );
    }
  }

  async generateApp(
    prompt: string,
    provider: string = "openai",
    context: any = {}
  ): Promise<any> {
    const aiProvider = this.providers.get(provider);

    if (!aiProvider) {
      throw new Error(`AI provider ${provider} not available`);
    }

    try {
      const response = await aiProvider.generateApp(prompt, context);

      // Parse JSON response
      const parsedResponse = JSON.parse(response);

      return {
        success: true,
        data: parsedResponse,
        provider,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("AI generation service error:", error);
      throw new Error(
        `Failed to generate application: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
