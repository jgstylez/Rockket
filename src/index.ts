/**
 * Rockket Platform - Cloudflare Worker Entry Point
 *
 * This is the main entry point for the Rockket multi-tenant SaaS platform
 * built on Cloudflare Workers with VibeSDK integration.
 */

import {
  DurableObject,
  DurableObjectNamespace,
  D1Database,
  KVNamespace,
  R2Bucket,
  Ai,
  Queue,
  Fetcher,
} from "cloudflare:workers";
import { CodeGeneratorAgent } from "./durable-objects/code-generator";
import { SessionManager } from "./durable-objects/session-manager";
import { AIAgent } from "./durable-objects/ai-agent";
import { handleRequest } from "./handlers/request-handler";
import { setupRoutes } from "./routes/setup";
import { initializeServices } from "./services/initialization";

// Environment interface
export interface Env {
  // D1 Database
  DB: D1Database;

  // KV Storage
  CACHE: KVNamespace;

  // R2 Storage
  STORAGE: R2Bucket;

  // Durable Objects
  CODE_GENERATOR: DurableObjectNamespace;
  SESSION_MANAGER: DurableObjectNamespace;
  AI_AGENT: DurableObjectNamespace;

  // AI Gateway
  AI: Ai;

  // Queue
  TASK_QUEUE: Queue;

  // Service Bindings
  AUTH_SERVICE: Fetcher;
  ANALYTICS_SERVICE: Fetcher;

  // Environment Variables
  NODE_ENV: string;
  ENABLE_MONITORING: string;
  ENABLE_ANALYTICS: string;
  ENABLE_PERFORMANCE_TRACKING: string;

  // Secrets (set via wrangler secret put)
  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;
  GOOGLE_AI_STUDIO_API_KEY?: string;
  JWT_SECRET?: string;
  SENTRY_DSN?: string;
  POSTHOG_KEY?: string;
  SENDGRID_API_KEY?: string;
}

// Main Worker class
export default class RockketWorker {
  private env: Env;
  private initialized: boolean = false;

  constructor(env: Env) {
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    try {
      // Initialize services on first request
      if (!this.initialized) {
        await this.initialize();
        this.initialized = true;
      }

      // Handle the request
      return await handleRequest(request, this.env);
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  private async initialize(): Promise<void> {
    console.log("Initializing Rockket Platform...");

    // Initialize services
    await initializeServices(this.env);

    // Setup routes
    setupRoutes();

    console.log("Rockket Platform initialized successfully");
  }
}

// Durable Object exports
export { CodeGeneratorAgent, SessionManager, AIAgent };

// Health check endpoint
export async function handleHealthCheck(env: Env): Promise<Response> {
  const checks = {
    database: await checkDatabase(env.DB),
    cache: await checkCache(env.CACHE),
    storage: await checkStorage(env.STORAGE),
    ai: await checkAI(env.AI),
  };

  const healthy = Object.values(checks).every(
    (check) => check.status === "healthy"
  );

  return new Response(
    JSON.stringify({
      status: healthy ? "healthy" : "unhealthy",
      checks,
      timestamp: new Date().toISOString(),
      service: "rockket-platform",
      version: "1.0.0",
    }),
    {
      status: healthy ? 200 : 503,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Database health check
async function checkDatabase(
  db: D1Database
): Promise<{ status: string; message?: string }> {
  try {
    const result = await db.prepare("SELECT 1 as test").first();
    return { status: "healthy" };
  } catch (error) {
    return {
      status: "unhealthy",
      message:
        error instanceof Error ? error.message : "Database connection failed",
    };
  }
}

// Cache health check
async function checkCache(
  cache: KVNamespace
): Promise<{ status: string; message?: string }> {
  try {
    await cache.put("health-check", "ok", { expirationTtl: 60 });
    const value = await cache.get("health-check");
    return value === "ok" ? { status: "healthy" } : { status: "unhealthy" };
  } catch (error) {
    return {
      status: "unhealthy",
      message:
        error instanceof Error ? error.message : "Cache connection failed",
    };
  }
}

// Storage health check
async function checkStorage(
  storage: R2Bucket
): Promise<{ status: string; message?: string }> {
  try {
    await storage.put("health-check", "ok");
    const object = await storage.get("health-check");
    return object ? { status: "healthy" } : { status: "unhealthy" };
  } catch (error) {
    return {
      status: "unhealthy",
      message:
        error instanceof Error ? error.message : "Storage connection failed",
    };
  }
}

// AI health check
async function checkAI(ai: Ai): Promise<{ status: string; message?: string }> {
  try {
    // Test AI Gateway connection
    const response = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [{ role: "user", content: "Hello" }],
    });
    return { status: "healthy" };
  } catch (error) {
    return {
      status: "unhealthy",
      message:
        error instanceof Error ? error.message : "AI Gateway connection failed",
    };
  }
}
