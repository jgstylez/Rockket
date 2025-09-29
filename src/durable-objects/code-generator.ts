/**
 * Code Generator Durable Object
 *
 * This Durable Object handles AI-powered code generation using Cloudflare's VibeSDK.
 * It maintains stateful connections and manages the code generation process.
 */

import { DurableObject, DurableObjectState } from "cloudflare:workers";
import { Env } from "../index";

export class CodeGeneratorAgent extends DurableObject {
  env: Env;
  private generationState: Map<string, any> = new Map();

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      switch (path) {
        case "/generate":
          return await this.handleCodeGeneration(request);
        case "/status":
          return await this.handleStatusCheck(request);
        case "/cancel":
          return await this.handleCancellation(request);
        default:
          return new Response("Not Found", { status: 404 });
      }
    } catch (error) {
      console.error("CodeGenerator error:", error);
      return new Response(
        JSON.stringify({
          error: "Code generation failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  private async handleCodeGeneration(request: Request): Promise<Response> {
    const { prompt, options = {} } = await request.json();
    const generationId = crypto.randomUUID();

    // Store generation state
    this.generationState.set(generationId, {
      status: "generating",
      prompt,
      options,
      createdAt: new Date().toISOString(),
      progress: 0,
    });

    // Start generation process
    this.generateCode(generationId, prompt, options);

    return new Response(
      JSON.stringify({
        generationId,
        status: "started",
        message: "Code generation started",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  private async generateCode(
    generationId: string,
    prompt: string,
    options: any
  ): Promise<void> {
    try {
      // Update status to generating
      this.updateGenerationStatus(generationId, "generating", 10);

      // Phase 1: Planning
      const plan = await this.createGenerationPlan(prompt);
      this.updateGenerationStatus(generationId, "planning", 20);

      // Phase 2: Foundation
      const foundation = await this.generateFoundation(plan);
      this.updateGenerationStatus(generationId, "foundation", 40);

      // Phase 3: Core Logic
      const core = await this.generateCoreLogic(plan, foundation);
      this.updateGenerationStatus(generationId, "core", 60);

      // Phase 4: Styling
      const styling = await this.generateStyling(plan, core);
      this.updateGenerationStatus(generationId, "styling", 80);

      // Phase 5: Integration
      const integration = await this.generateIntegration(plan, styling);
      this.updateGenerationStatus(generationId, "integration", 90);

      // Phase 6: Optimization
      const optimized = await this.optimizeCode(integration);
      this.updateGenerationStatus(generationId, "completed", 100, optimized);
    } catch (error) {
      console.error("Generation error:", error);
      this.updateGenerationStatus(generationId, "failed", 0, null, error);
    }
  }

  private async createGenerationPlan(prompt: string): Promise<any> {
    const aiResponse = await this.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        {
          role: "system",
          content: `You are a code generation planning AI. Analyze the user's request and create a detailed plan for generating the application.

          Return a JSON object with:
          - appType: type of application (web, mobile, desktop)
          - features: array of features to implement
          - techStack: recommended technology stack
          - fileStructure: proposed file structure
          - phases: array of generation phases
          
          User request: ${prompt}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return JSON.parse(aiResponse.response);
  }

  private async generateFoundation(plan: any): Promise<any> {
    const aiResponse = await this.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        {
          role: "system",
          content: `Generate the foundation files for a ${plan.appType} application.

          Create:
          - package.json with dependencies
          - Basic configuration files
          - Entry point files
          - Basic project structure
          
          Plan: ${JSON.stringify(plan)}`,
        },
      ],
    });

    return JSON.parse(aiResponse.response);
  }

  private async generateCoreLogic(plan: any, foundation: any): Promise<any> {
    const aiResponse = await this.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        {
          role: "system",
          content: `Generate the core application logic and components.

          Create:
          - Main application components
          - Business logic
          - Data models
          - API endpoints
          
          Plan: ${JSON.stringify(plan)}
          Foundation: ${JSON.stringify(foundation)}`,
        },
      ],
    });

    return JSON.parse(aiResponse.response);
  }

  private async generateStyling(plan: any, core: any): Promise<any> {
    const aiResponse = await this.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        {
          role: "system",
          content: `Generate modern, responsive styling for the application.

          Create:
          - CSS/SCSS files
          - Component styles
          - Responsive design
          - Theme configuration
          
          Plan: ${JSON.stringify(plan)}
          Core: ${JSON.stringify(core)}`,
        },
      ],
    });

    return JSON.parse(aiResponse.response);
  }

  private async generateIntegration(plan: any, styling: any): Promise<any> {
    const aiResponse = await this.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        {
          role: "system",
          content: `Integrate all components and add final touches.

          Create:
          - Integration code
          - API connections
          - External service integrations
          - Final assembly
          
          Plan: ${JSON.stringify(plan)}
          Styling: ${JSON.stringify(styling)}`,
        },
      ],
    });

    return JSON.parse(aiResponse.response);
  }

  private async optimizeCode(integration: any): Promise<any> {
    const aiResponse = await this.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        {
          role: "system",
          content: `Optimize the generated code for performance and best practices.

          Apply:
          - Performance optimizations
          - Code quality improvements
          - Security enhancements
          - Error handling
          
          Integration: ${JSON.stringify(integration)}`,
        },
      ],
    });

    return JSON.parse(aiResponse.response);
  }

  private updateGenerationStatus(
    generationId: string,
    status: string,
    progress: number,
    result?: any,
    error?: any
  ): void {
    const currentState = this.generationState.get(generationId);
    if (currentState) {
      currentState.status = status;
      currentState.progress = progress;
      currentState.updatedAt = new Date().toISOString();

      if (result) {
        currentState.result = result;
      }

      if (error) {
        currentState.error = error.message || "Unknown error";
      }

      this.generationState.set(generationId, currentState);
    }
  }

  private async handleStatusCheck(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const generationId = url.searchParams.get("id");

    if (!generationId) {
      return new Response("Missing generation ID", { status: 400 });
    }

    const state = this.generationState.get(generationId);
    if (!state) {
      return new Response("Generation not found", { status: 404 });
    }

    return new Response(
      JSON.stringify({
        generationId,
        status: state.status,
        progress: state.progress,
        result: state.result,
        error: state.error,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  private async handleCancellation(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const generationId = url.searchParams.get("id");

    if (!generationId) {
      return new Response("Missing generation ID", { status: 400 });
    }

    const state = this.generationState.get(generationId);
    if (!state) {
      return new Response("Generation not found", { status: 404 });
    }

    // Cancel the generation
    this.updateGenerationStatus(generationId, "cancelled", state.progress);

    return new Response(
      JSON.stringify({
        generationId,
        status: "cancelled",
        message: "Generation cancelled",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
