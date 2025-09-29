/**
 * Page Handler for Rockket Platform
 *
 * This handler serves the main application pages and handles SPA routing.
 */

import { Env } from "../index";

export async function handlePageRoute(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Serve the main SPA application
  if (
    path === "/" ||
    path.startsWith("/dashboard") ||
    path.startsWith("/auth")
  ) {
    return serveSPA(request, env);
  }

  // Handle specific page routes
  switch (path) {
    case "/":
      return serveHomePage(request, env);
    case "/dashboard":
      return serveDashboard(request, env);
    case "/dashboard/generator":
      return serveGenerator(request, env);
    case "/dashboard/builder":
      return serveBuilder(request, env);
    case "/dashboard/cms":
      return serveCMS(request, env);
    case "/dashboard/ecommerce":
      return serveEcommerce(request, env);
    case "/dashboard/analytics":
      return serveAnalytics(request, env);
    default:
      return serveSPA(request, env);
  }
}

async function serveSPA(request: Request, env: Env): Promise<Response> {
  // In a real implementation, this would serve the built Next.js app
  // For now, we'll return a simple HTML response
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rockket Platform</title>
    <script>
        // Simple client-side routing
        const path = window.location.pathname;
        if (path === '/') {
            window.location.href = '/dashboard';
        } else if (path.startsWith('/dashboard')) {
            // Load the dashboard application
            document.body.innerHTML = '<div id="root">Loading Rockket Platform...</div>';
        }
    </script>
</head>
<body>
    <div id="root">
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
            <div style="text-align: center;">
                <h1>🚀 Rockket Platform</h1>
                <p>Loading your application...</p>
                <div style="margin-top: 20px;">
                    <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                </div>
            </div>
        </div>
    </div>
    <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</body>
</html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-cache",
    },
  });
}

async function serveHomePage(request: Request, env: Env): Promise<Response> {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rockket - Launch Your Vision</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .hero {
            text-align: center;
            color: white;
            padding: 100px 0;
        }
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.9;
        }
        .prompt-box {
            max-width: 600px;
            margin: 0 auto 40px;
        }
        .prompt-box textarea {
            width: 100%;
            height: 120px;
            padding: 20px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            resize: none;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            backdrop-filter: blur(10px);
        }
        .prompt-box textarea::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
        .generate-btn {
            background: #4f46e5;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .generate-btn:hover {
            background: #4338ca;
            transform: translateY(-2px);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 80px;
        }
        .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            text-align: center;
        }
        .feature h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
        }
        .feature p {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>🚀 Launch Your Vision</h1>
            <p>The complete business platform that AI coding should have been from the start</p>
            
            <div class="prompt-box">
                <textarea placeholder="Describe your business idea and we'll build the complete platform..."></textarea>
                <br><br>
                <button class="generate-btn" onclick="handleGenerate()">
                    🚀 Generate Platform
                </button>
            </div>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>🎨 Visual Builder</h3>
                <p>Drag-and-drop interface to build your platform visually</p>
            </div>
            <div class="feature">
                <h3>📝 CMS</h3>
                <p>Content management system with AI-powered generation</p>
            </div>
            <div class="feature">
                <h3>🛒 E-commerce</h3>
                <p>Complete online store with payment processing</p>
            </div>
        </div>
    </div>
    
    <script>
        function handleGenerate() {
            const textarea = document.querySelector('textarea');
            const prompt = textarea.value.trim();
            
            if (!prompt) {
                alert('Please enter a description of your application');
                return;
            }
            
            // Store prompt and redirect to generator
            sessionStorage.setItem('generationPrompt', prompt);
            window.location.href = '/dashboard/generator';
        }
        
        // Handle Enter key
        document.querySelector('textarea').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
            }
        });
    </script>
</body>
</html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-cache",
    },
  });
}

async function serveDashboard(request: Request, env: Env): Promise<Response> {
  return new Response("Dashboard page", {
    headers: { "Content-Type": "text/html" },
  });
}

async function serveGenerator(request: Request, env: Env): Promise<Response> {
  return new Response("Generator page", {
    headers: { "Content-Type": "text/html" },
  });
}

async function serveBuilder(request: Request, env: Env): Promise<Response> {
  return new Response("Builder page", {
    headers: { "Content-Type": "text/html" },
  });
}

async function serveCMS(request: Request, env: Env): Promise<Response> {
  return new Response("CMS page", {
    headers: { "Content-Type": "text/html" },
  });
}

async function serveEcommerce(request: Request, env: Env): Promise<Response> {
  return new Response("E-commerce page", {
    headers: { "Content-Type": "text/html" },
  });
}

async function serveAnalytics(request: Request, env: Env): Promise<Response> {
  return new Response("Analytics page", {
    headers: { "Content-Type": "text/html" },
  });
}
