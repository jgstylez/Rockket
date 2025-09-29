/**
 * Request Handler for Rockket Platform
 *
 * This handler processes incoming requests and routes them to appropriate handlers
 * based on the VibeSDK architecture.
 */

import { D1Database, KVNamespace, R2Bucket, Ai } from "cloudflare:workers";
import { Env } from "../index";
import { handleAPIRoute } from "./api-handler";
import { handlePageRoute } from "./page-handler";
import { handleWebSocket } from "./websocket-handler";
import { handleStaticAssets } from "./static-handler";

export async function handleRequest(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Health check endpoint
  if (path === "/health") {
    return await handleHealthCheck(env);
  }

  // API routes
  if (path.startsWith("/api/")) {
    return await handleAPIRoute(request, env);
  }

  // WebSocket connections
  if (request.headers.get("Upgrade") === "websocket") {
    return await handleWebSocket(request, env);
  }

  // Static assets
  if (path.startsWith("/static/") || path.startsWith("/assets/")) {
    return await handleStaticAssets(request, env);
  }

  // Page routes (SPA)
  return await handlePageRoute(request, env);
}

async function handleHealthCheck(env: Env): Promise<Response> {
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
