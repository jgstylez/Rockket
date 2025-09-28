import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Code, Zap, Shield, BookOpen, Terminal, Key } from "lucide-react";
import Link from "next/link";

export default function APIPage() {
  const endpoints = [
    {
      method: "GET",
      path: "/api/auth/me",
      description: "Get current user information",
      auth: true,
    },
    {
      method: "POST",
      path: "/api/auth/login",
      description: "Authenticate user",
      auth: false,
    },
    {
      method: "POST",
      path: "/api/auth/register",
      description: "Register new user",
      auth: false,
    },
    {
      method: "GET",
      path: "/api/ai/generate",
      description: "Generate application with AI",
      auth: true,
    },
    {
      method: "GET",
      path: "/api/analytics/metrics",
      description: "Get analytics metrics",
      auth: true,
    },
    {
      method: "POST",
      path: "/api/analytics/track",
      description: "Track custom events",
      auth: true,
    },
  ];

  const features = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "RESTful API",
      description:
        "Clean, intuitive REST endpoints that follow industry standards",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure Authentication",
      description: "JWT-based authentication with role-based access control",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Real-time Updates",
      description: "WebSocket support for real-time data and notifications",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Comprehensive Docs",
      description: "Detailed documentation with examples and SDKs",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Rockket <span className="gradient-text">API</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Build powerful integrations with our comprehensive REST API.
              Access all platform features programmatically with full
              documentation and SDKs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/docs/api">View Documentation</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/register">Get API Key</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-lg border hover:shadow-lg transition-shadow text-center"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                API Endpoints
              </h2>
              <p className="text-xl text-muted-foreground">
                Explore our comprehensive API with full documentation
              </p>
            </div>

            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Available Endpoints</h3>
                <p className="text-muted-foreground">
                  Complete list of API endpoints
                </p>
              </div>
              <div className="divide-y">
                {endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            endpoint.method === "GET"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {endpoint.description}
                        </span>
                        {endpoint.auth && (
                          <span className="flex items-center gap-1 text-sm text-amber-600">
                            <Key className="h-4 w-4" />
                            Auth Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Quick Start
              </h2>
              <p className="text-xl text-muted-foreground">
                Get started with our API in minutes
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Authentication</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {`// Get your API key from dashboard
const API_KEY = 'your-api-key';

// Set up authentication
const headers = {
  'Authorization': \`Bearer \${API_KEY}\`,
  'Content-Type': 'application/json'
};`}
                </pre>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Make a Request</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {`// Get current user
const response = await fetch('/api/auth/me', {
  headers
});

const user = await response.json();

// Generate AI app
const app = await fetch('/api/ai/generate', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    prompt: 'Create a todo app',
    provider: 'openai'
  })
});`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* SDKs */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                SDKs & Libraries
              </h2>
              <p className="text-xl text-muted-foreground">
                Official SDKs for popular programming languages
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg border p-6 text-center">
                <Terminal className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  JavaScript/TypeScript
                </h3>
                <p className="text-muted-foreground mb-4">
                  Official SDK for Node.js and browser applications
                </p>
                <Button variant="outline" size="sm">
                  npm install @rockket/sdk
                </Button>
              </div>

              <div className="bg-card rounded-lg border p-6 text-center">
                <Code className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Python</h3>
                <p className="text-muted-foreground mb-4">
                  Python SDK for data science and automation
                </p>
                <Button variant="outline" size="sm">
                  pip install rockket-sdk
                </Button>
              </div>

              <div className="bg-card rounded-lg border p-6 text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">PHP</h3>
                <p className="text-muted-foreground mb-4">
                  PHP SDK for web applications and Laravel
                </p>
                <Button variant="outline" size="sm">
                  composer require rockket/sdk
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Build?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start building with our API today. Get your API key and start
              creating amazing integrations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Get API Key</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/api">View Full Docs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
