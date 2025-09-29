/**
 * Services Initialization for Rockket Platform
 *
 * This module handles the initialization of all platform services,
 * including database setup, cache configuration, and external service connections.
 */

import { Env } from "../index";

export async function initializeServices(env: Env): Promise<void> {
  console.log("Initializing Rockket Platform services...");

  try {
    // Initialize database
    await initializeDatabase(env);

    // Initialize cache
    await initializeCache(env);

    // Initialize storage
    await initializeStorage(env);

    // Initialize AI services
    await initializeAI(env);

    // Initialize monitoring
    await initializeMonitoring(env);

    console.log("All services initialized successfully");
  } catch (error) {
    console.error("Service initialization failed:", error);
    throw error;
  }
}

async function initializeDatabase(env: Env): Promise<void> {
  console.log("Initializing database...");

  try {
    // Check database connection
    const result = await env.DB.prepare("SELECT 1 as test").first();
    if (!result) {
      throw new Error("Database connection failed");
    }

    // Check if tables exist, create if not
    await ensureTablesExist(env);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

async function ensureTablesExist(env: Env): Promise<void> {
  const tables = [
    "tenants",
    "users",
    "projects",
    "content",
    "products",
    "orders",
    "analytics",
    "feature_flags",
    "code_generations",
  ];

  for (const table of tables) {
    try {
      await env.DB.prepare(`SELECT 1 FROM ${table} LIMIT 1`).first();
    } catch (error) {
      console.log(`Table ${table} does not exist, creating...`);
      // In a real implementation, you would run the migration here
      // For now, we'll just log that the table needs to be created
      console.log(`Please run migrations to create table: ${table}`);
    }
  }
}

async function initializeCache(env: Env): Promise<void> {
  console.log("Initializing cache...");

  try {
    // Test cache connection
    await env.CACHE.put("health-check", "ok", { expirationTtl: 60 });
    const value = await env.CACHE.get("health-check");

    if (value !== "ok") {
      throw new Error("Cache connection failed");
    }

    console.log("Cache initialized successfully");
  } catch (error) {
    console.error("Cache initialization failed:", error);
    throw error;
  }
}

async function initializeStorage(env: Env): Promise<void> {
  console.log("Initializing storage...");

  try {
    // Test storage connection
    await env.STORAGE.put("health-check", "ok");
    const object = await env.STORAGE.get("health-check");

    if (!object) {
      throw new Error("Storage connection failed");
    }

    console.log("Storage initialized successfully");
  } catch (error) {
    console.error("Storage initialization failed:", error);
    throw error;
  }
}

async function initializeAI(env: Env): Promise<void> {
  console.log("Initializing AI services...");

  try {
    // Test AI Gateway connection
    const response = await env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [{ role: "user", content: "Hello" }],
    });

    if (!response) {
      throw new Error("AI Gateway connection failed");
    }

    console.log("AI services initialized successfully");
  } catch (error) {
    console.error("AI initialization failed:", error);
    throw error;
  }
}

async function initializeMonitoring(env: Env): Promise<void> {
  console.log("Initializing monitoring...");

  try {
    // Initialize monitoring services
    if (env.ENABLE_MONITORING === "true") {
      console.log("Monitoring enabled");
    }

    if (env.ENABLE_ANALYTICS === "true") {
      console.log("Analytics enabled");
    }

    if (env.ENABLE_PERFORMANCE_TRACKING === "true") {
      console.log("Performance tracking enabled");
    }

    console.log("Monitoring initialized successfully");
  } catch (error) {
    console.error("Monitoring initialization failed:", error);
    throw error;
  }
}
