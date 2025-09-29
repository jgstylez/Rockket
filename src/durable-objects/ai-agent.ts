/**
 * AI Agent Durable Object
 *
 * This Durable Object manages AI model interactions, caching,
 * and rate limiting for the platform.
 */

import { DurableObject, DurableObjectState } from "cloudflare:workers";
import { Env } from "../index";

export class AIAgent extends DurableObject {
  env: Env;
  private requestCounts: Map<string, number> = new Map();
  private cache: Map<string, any> = new Map();

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      switch (path) {
        case "/process":
          return await this.handleProcessRequest(request);
        case "/cache":
          return await this.handleCacheRequest(request);
        case "/stats":
          return await this.handleStatsRequest(request);
        default:
          return new Response("Not Found", { status: 404 });
      }
    } catch (error) {
      console.error("AIAgent error:", error);
      return new Response(
        JSON.stringify({
          error: "AI processing failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  private async handleProcessRequest(request: Request): Promise<Response> {
    const { prompt, model, options = {} } = await request.json();

    // Check rate limiting
    const rateLimitResult = await this.checkRateLimit();
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          retryAfter: rateLimitResult.retryAfter,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(prompt, model, options);
    const cachedResponse = this.cache.get(cacheKey);
    if (cachedResponse) {
      return new Response(
        JSON.stringify({
          result: cachedResponse,
          cached: true,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      // Process with AI Gateway
      const response = await this.env.AI.run(model, {
        messages: [{ role: "user", content: prompt }],
        ...options,
      });

      // Cache the response
      this.cache.set(cacheKey, response);

      // Set cache expiration (1 hour)
      setTimeout(
        () => {
          this.cache.delete(cacheKey);
        },
        60 * 60 * 1000
      );

      return new Response(
        JSON.stringify({
          result: response,
          cached: false,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("AI processing error:", error);
      return new Response(
        JSON.stringify({
          error: "AI processing failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  private async handleCacheRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    switch (action) {
      case "get":
        const key = url.searchParams.get("key");
        if (!key) {
          return new Response("Missing cache key", { status: 400 });
        }
        const value = this.cache.get(key);
        return new Response(JSON.stringify({ key, value, found: !!value }), {
          headers: { "Content-Type": "application/json" },
        });

      case "set":
        const { cacheKey, cacheValue, ttl } = await request.json();
        this.cache.set(cacheKey, cacheValue);

        if (ttl) {
          setTimeout(() => {
            this.cache.delete(cacheKey);
          }, ttl * 1000);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });

      case "delete":
        const deleteKey = url.searchParams.get("key");
        if (!deleteKey) {
          return new Response("Missing cache key", { status: 400 });
        }
        this.cache.delete(deleteKey);
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });

      case "clear":
        this.cache.clear();
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });

      default:
        return new Response("Invalid cache action", { status: 400 });
    }
  }

  private async handleStatsRequest(request: Request): Promise<Response> {
    const stats = {
      cacheSize: this.cache.size,
      requestCounts: Object.fromEntries(this.requestCounts),
      memoryUsage: this.getMemoryUsage(),
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(stats), {
      headers: { "Content-Type": "application/json" },
    });
  }

  private async checkRateLimit(): Promise<{
    allowed: boolean;
    retryAfter?: number;
  }> {
    const now = Date.now();
    const windowStart = now - 60 * 1000; // 1 minute window
    const maxRequests = 100; // Max requests per minute

    // Get current request count
    const currentCount = this.requestCounts.get("total") || 0;

    if (currentCount >= maxRequests) {
      return {
        allowed: false,
        retryAfter: 60, // Retry after 1 minute
      };
    }

    // Increment request count
    this.requestCounts.set("total", currentCount + 1);

    // Reset counter after window
    setTimeout(() => {
      this.requestCounts.set("total", Math.max(0, currentCount - 1));
    }, 60 * 1000);

    return { allowed: true };
  }

  private generateCacheKey(
    prompt: string,
    model: string,
    options: any
  ): string {
    const keyData = {
      prompt: prompt.substring(0, 100), // Truncate for key
      model,
      options: JSON.stringify(options),
    };

    return btoa(JSON.stringify(keyData));
  }

  private getMemoryUsage(): any {
    // This is a simplified memory usage calculation
    // In a real implementation, you'd use more sophisticated memory tracking
    return {
      cacheEntries: this.cache.size,
      requestCounts: this.requestCounts.size,
      estimatedSize: this.cache.size * 1024, // Rough estimate
    };
  }
}
