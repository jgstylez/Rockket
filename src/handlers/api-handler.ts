/**
 * API Handler for Rockket Platform
 *
 * This handler processes API requests and integrates with VibeSDK for code generation.
 */

import { Env } from "../index";

export async function handleAPIRoute(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Route to appropriate handler
    if (path.startsWith("/api/generate")) {
      return await handleCodeGeneration(request, env);
    } else if (path.startsWith("/api/projects")) {
      return await handleProjects(request, env);
    } else if (path.startsWith("/api/tenants")) {
      return await handleTenants(request, env);
    } else if (path.startsWith("/api/users")) {
      return await handleUsers(request, env);
    } else if (path.startsWith("/api/analytics")) {
      return await handleAnalytics(request, env);
    } else {
      return new Response("Not Found", { status: 404, headers: corsHeaders });
    }
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
}

// Code Generation API
async function handleCodeGeneration(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/api/generate" && request.method === "POST") {
    const { prompt, options = {} } = await request.json();

    // Get or create CodeGenerator Durable Object
    const id = env.CODE_GENERATOR.idFromName("default");
    const stub = env.CODE_GENERATOR.get(id);

    // Start code generation
    const response = await stub.fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, options }),
    });

    return response;
  }

  if (path.startsWith("/api/generate/status")) {
    const generationId = url.searchParams.get("id");
    if (!generationId) {
      return new Response("Missing generation ID", { status: 400 });
    }

    const id = env.CODE_GENERATOR.idFromName("default");
    const stub = env.CODE_GENERATOR.get(id);

    const response = await stub.fetch(`/status?id=${generationId}`);
    return response;
  }

  return new Response("Not Found", { status: 404 });
}

// Projects API
async function handleProjects(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/api/projects" && request.method === "GET") {
    // Get projects from database
    const projects = await env.DB.prepare(
      "SELECT * FROM projects ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify({ projects: projects.results }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (path === "/api/projects" && request.method === "POST") {
    const { name, description, type } = await request.json();

    // Create new project
    const result = await env.DB.prepare(
      "INSERT INTO projects (name, description, type, created_at) VALUES (?, ?, ?, ?)"
    )
      .bind(name, description, type, new Date().toISOString())
      .run();

    return new Response(
      JSON.stringify({
        id: result.meta.last_row_id,
        name,
        description,
        type,
        created_at: new Date().toISOString(),
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (path.startsWith("/api/projects/") && request.method === "GET") {
    const projectId = path.split("/")[3];

    const project = await env.DB.prepare("SELECT * FROM projects WHERE id = ?")
      .bind(projectId)
      .first();

    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    return new Response(JSON.stringify({ project }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
}

// Tenants API
async function handleTenants(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/api/tenants" && request.method === "GET") {
    const tenants = await env.DB.prepare(
      "SELECT * FROM tenants ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify({ tenants: tenants.results }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (path === "/api/tenants" && request.method === "POST") {
    const { name, slug, plan } = await request.json();

    // Create new tenant
    const result = await env.DB.prepare(
      "INSERT INTO tenants (name, slug, plan, created_at) VALUES (?, ?, ?, ?)"
    )
      .bind(name, slug, plan, new Date().toISOString())
      .run();

    return new Response(
      JSON.stringify({
        id: result.meta.last_row_id,
        name,
        slug,
        plan,
        created_at: new Date().toISOString(),
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response("Not Found", { status: 404 });
}

// Users API
async function handleUsers(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/api/users" && request.method === "GET") {
    const users = await env.DB.prepare(
      "SELECT * FROM users ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify({ users: users.results }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (path === "/api/users" && request.method === "POST") {
    const { email, name, role, tenant_id } = await request.json();

    // Create new user
    const result = await env.DB.prepare(
      "INSERT INTO users (email, name, role, tenant_id, created_at) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(email, name, role, tenant_id, new Date().toISOString())
      .run();

    return new Response(
      JSON.stringify({
        id: result.meta.last_row_id,
        email,
        name,
        role,
        tenant_id,
        created_at: new Date().toISOString(),
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response("Not Found", { status: 404 });
}

// Analytics API
async function handleAnalytics(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/api/analytics" && request.method === "GET") {
    // Get analytics data from cache or database
    const cached = await env.CACHE.get("analytics:summary");
    if (cached) {
      return new Response(cached, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=300",
        },
      });
    }

    // Generate analytics data
    const analytics = await generateAnalytics(env);

    // Cache for 5 minutes
    await env.CACHE.put("analytics:summary", JSON.stringify(analytics), {
      expirationTtl: 300,
    });

    return new Response(JSON.stringify(analytics), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
}

// Generate analytics data
async function generateAnalytics(env: Env): Promise<any> {
  const [totalUsers, totalProjects, totalTenants, recentActivity] =
    await Promise.all([
      env.DB.prepare("SELECT COUNT(*) as count FROM users").first(),
      env.DB.prepare("SELECT COUNT(*) as count FROM projects").first(),
      env.DB.prepare("SELECT COUNT(*) as count FROM tenants").first(),
      env.DB.prepare(
        `
      SELECT * FROM projects 
      ORDER BY created_at DESC 
      LIMIT 10
    `
      ).all(),
    ]);

  return {
    totalUsers: totalUsers?.count || 0,
    totalProjects: totalProjects?.count || 0,
    totalTenants: totalTenants?.count || 0,
    recentActivity: recentActivity.results || [],
    generatedAt: new Date().toISOString(),
  };
}
