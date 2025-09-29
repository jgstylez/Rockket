/**
 * Session Manager Durable Object
 *
 * This Durable Object handles user session management, authentication,
 * and session state across the platform.
 */

import { DurableObject } from "cloudflare:workers";
import { Env } from "../index";

export class SessionManager extends DurableObject {
  private env: Env;
  private sessions: Map<string, any> = new Map();

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      switch (path) {
        case "/create":
          return await this.handleCreateSession(request);
        case "/validate":
          return await this.handleValidateSession(request);
        case "/destroy":
          return await this.handleDestroySession(request);
        case "/refresh":
          return await this.handleRefreshSession(request);
        default:
          return new Response("Not Found", { status: 404 });
      }
    } catch (error) {
      console.error("SessionManager error:", error);
      return new Response(
        JSON.stringify({
          error: "Session management failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  private async handleCreateSession(request: Request): Promise<Response> {
    const { userId, tenantId, userRole, metadata = {} } = await request.json();

    const sessionId = crypto.randomUUID();
    const sessionData = {
      id: sessionId,
      userId,
      tenantId,
      userRole,
      metadata,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    // Store session in memory
    this.sessions.set(sessionId, sessionData);

    // Store session in database
    await this.env.DB.prepare(
      "INSERT INTO user_sessions (id, user_id, tenant_id, user_role, metadata, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        sessionId,
        userId,
        tenantId,
        userRole,
        JSON.stringify(metadata),
        sessionData.createdAt,
        sessionData.expiresAt
      )
      .run();

    return new Response(
      JSON.stringify({
        sessionId,
        expiresAt: sessionData.expiresAt,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  private async handleValidateSession(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("id");

    if (!sessionId) {
      return new Response("Missing session ID", { status: 400 });
    }

    // Check memory first
    let sessionData = this.sessions.get(sessionId);

    if (!sessionData) {
      // Check database
      const result = await this.env.DB.prepare(
        "SELECT * FROM user_sessions WHERE id = ? AND expires_at > ?"
      )
        .bind(sessionId, new Date().toISOString())
        .first();

      if (!result) {
        return new Response(
          JSON.stringify({
            valid: false,
            reason: "Session not found or expired",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      sessionData = {
        id: result.id,
        userId: result.user_id,
        tenantId: result.tenant_id,
        userRole: result.user_role,
        metadata: JSON.parse(result.metadata || "{}"),
        createdAt: result.created_at,
        lastAccessed: result.last_accessed,
        expiresAt: result.expires_at,
      };
    }

    // Update last accessed time
    sessionData.lastAccessed = new Date().toISOString();
    this.sessions.set(sessionId, sessionData);

    // Update database
    await this.env.DB.prepare(
      "UPDATE user_sessions SET last_accessed = ? WHERE id = ?"
    )
      .bind(sessionData.lastAccessed, sessionId)
      .run();

    return new Response(
      JSON.stringify({
        valid: true,
        session: sessionData,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  private async handleDestroySession(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("id");

    if (!sessionId) {
      return new Response("Missing session ID", { status: 400 });
    }

    // Remove from memory
    this.sessions.delete(sessionId);

    // Remove from database
    await this.env.DB.prepare("DELETE FROM user_sessions WHERE id = ?")
      .bind(sessionId)
      .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  private async handleRefreshSession(request: Request): Promise<Response> {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return new Response("Missing session ID", { status: 400 });
    }

    // Get current session
    const sessionData = this.sessions.get(sessionId);
    if (!sessionData) {
      return new Response("Session not found", { status: 404 });
    }

    // Extend expiration
    const newExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();
    sessionData.expiresAt = newExpiresAt;
    sessionData.lastAccessed = new Date().toISOString();

    // Update in memory
    this.sessions.set(sessionId, sessionData);

    // Update in database
    await this.env.DB.prepare(
      "UPDATE user_sessions SET expires_at = ?, last_accessed = ? WHERE id = ?"
    )
      .bind(newExpiresAt, sessionData.lastAccessed, sessionId)
      .run();

    return new Response(
      JSON.stringify({
        sessionId,
        expiresAt: newExpiresAt,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
