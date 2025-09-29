/**
 * WebSocket Handler for Rockket Platform
 *
 * This handler manages WebSocket connections for real-time updates,
 * particularly for VibeSDK code generation progress.
 */

import { Env } from "../index";

export async function handleWebSocket(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle generation WebSocket connections
  if (path.startsWith("/ws/generation/")) {
    return handleGenerationWebSocket(request, env);
  }

  // Handle general WebSocket connections
  if (path.startsWith("/ws/")) {
    return handleGeneralWebSocket(request, env);
  }

  return new Response("WebSocket endpoint not found", { status: 404 });
}

async function handleGenerationWebSocket(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const generationId = pathParts[pathParts.length - 1];

  if (!generationId) {
    return new Response("Missing generation ID", { status: 400 });
  }

  // Get the CodeGenerator Durable Object
  const id = env.CODE_GENERATOR.idFromName("default");
  const stub = env.CODE_GENERATOR.get(id);

  // Create WebSocket connection
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  // Handle the server-side WebSocket
  server.accept();

  // Set up message handling
  server.addEventListener("message", async (event) => {
    try {
      const message = JSON.parse(event.data);

      if (message.type === "subscribe") {
        // Subscribe to generation updates
        await subscribeToGenerationUpdates(generationId, server, stub);
      }
    } catch (error) {
      console.error("WebSocket message error:", error);
      server.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        })
      );
    }
  });

  server.addEventListener("close", () => {
    console.log("Generation WebSocket closed for:", generationId);
  });

  server.addEventListener("error", (error) => {
    console.error("Generation WebSocket error:", error);
  });

  // Send initial connection confirmation
  server.send(
    JSON.stringify({
      type: "connected",
      generationId,
      timestamp: new Date().toISOString(),
    })
  );

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

async function handleGeneralWebSocket(
  request: Request,
  env: Env
): Promise<Response> {
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();

  server.addEventListener("message", async (event) => {
    try {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "ping":
          server.send(
            JSON.stringify({
              type: "pong",
              timestamp: new Date().toISOString(),
            })
          );
          break;

        case "subscribe":
          // Handle general subscriptions
          break;

        default:
          server.send(
            JSON.stringify({
              type: "error",
              message: "Unknown message type",
            })
          );
      }
    } catch (error) {
      console.error("General WebSocket error:", error);
      server.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        })
      );
    }
  });

  server.addEventListener("close", () => {
    console.log("General WebSocket closed");
  });

  server.addEventListener("error", (error) => {
    console.error("General WebSocket error:", error);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

async function subscribeToGenerationUpdates(
  generationId: string,
  server: WebSocket,
  stub: DurableObjectStub
): Promise<void> {
  // Poll for generation status updates
  const pollInterval = setInterval(async () => {
    try {
      const response = await stub.fetch(`/status?id=${generationId}`);
      const status = await response.json();

      // Send update to client
      server.send(
        JSON.stringify({
          type: "generation_update",
          ...status,
        })
      );

      // Stop polling if generation is complete or failed
      if (status.status === "completed" || status.status === "failed") {
        clearInterval(pollInterval);
      }
    } catch (error) {
      console.error("Error polling generation status:", error);
      server.send(
        JSON.stringify({
          type: "error",
          message: "Failed to get generation status",
        })
      );
    }
  }, 1000); // Poll every second

  // Clean up on close
  server.addEventListener("close", () => {
    clearInterval(pollInterval);
  });
}
