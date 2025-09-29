/**
 * Static Asset Handler for Rockket Platform
 *
 * This handler serves static assets like images, CSS, JavaScript files,
 * and other resources from R2 storage.
 */

import { Env } from "../index";

export async function handleStaticAssets(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    // Extract the asset path (remove /static/ or /assets/ prefix)
    const assetPath = path.replace(/^\/(static|assets)\//, "");

    if (!assetPath) {
      return new Response("Asset path not found", { status: 404 });
    }

    // Get the asset from R2 storage
    const object = await env.STORAGE.get(assetPath);

    if (!object) {
      return new Response("Asset not found", { status: 404 });
    }

    // Determine content type based on file extension
    const contentType = getContentType(assetPath);

    // Set appropriate headers
    const headers = new Headers({
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      ETag: `"${assetPath}"`,
    });

    // Add CORS headers for cross-origin requests
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    return new Response(object.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error serving static asset:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

function getContentType(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase();

  const contentTypes: Record<string, string> = {
    // Images
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    ico: "image/x-icon",

    // CSS
    css: "text/css",

    // JavaScript
    js: "application/javascript",
    mjs: "application/javascript",

    // Fonts
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    otf: "font/otf",

    // Documents
    html: "text/html",
    htm: "text/html",
    txt: "text/plain",
    json: "application/json",
    xml: "application/xml",
    pdf: "application/pdf",

    // Archives
    zip: "application/zip",
    tar: "application/x-tar",
    gz: "application/gzip",

    // Videos
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",

    // Audio
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
  };

  return contentTypes[extension || ""] || "application/octet-stream";
}
