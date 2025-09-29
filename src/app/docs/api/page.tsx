"use client";

import { useAuth } from "@/components/providers/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  Key,
  Database,
  Globe,
  Brain,
  ShoppingCart,
  Mail,
  BarChart3,
  Users,
  Calendar,
  Video,
  ArrowRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function APIPage() {
  const { user, tenant } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const apiEndpoints = [
    {
      category: "Authentication",
      endpoints: [
        {
          method: "POST",
          path: "/api/auth/login",
          description: "Authenticate user and get JWT token",
          auth: false,
        },
        {
          method: "POST",
          path: "/api/auth/register",
          description: "Register new user account",
          auth: false,
        },
        {
          method: "GET",
          path: "/api/auth/me",
          description: "Get current user information",
          auth: true,
        },
        {
          method: "POST",
          path: "/api/auth/logout",
          description: "Logout and invalidate token",
          auth: true,
        },
      ],
    },
    {
      category: "E-commerce",
      endpoints: [
        {
          method: "GET",
          path: "/api/ecommerce/products",
          description: "Get products for tenant",
          auth: true,
        },
        {
          method: "POST",
          path: "/api/ecommerce/products",
          description: "Create new product",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/ecommerce/orders",
          description: "Get orders for tenant",
          auth: true,
        },
        {
          method: "POST",
          path: "/api/ecommerce/orders",
          description: "Create new order",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/ecommerce/inventory",
          description: "Get inventory levels",
          auth: true,
        },
        {
          method: "POST",
          path: "/api/ecommerce/shipping",
          description: "Calculate shipping rates",
          auth: true,
        },
      ],
    },
    {
      category: "Marketing",
      endpoints: [
        {
          method: "GET",
          path: "/api/email/templates",
          description: "Get email templates",
          auth: true,
        },
        {
          method: "POST",
          path: "/api/email/campaigns",
          description: "Create email campaign",
          auth: true,
        },
        {
          method: "POST",
          path: "/api/sms/messages",
          description: "Send SMS message",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/funnels",
          description: "Get sales funnels",
          auth: true,
        },
      ],
    },
    {
      category: "Analytics",
      endpoints: [
        {
          method: "GET",
          path: "/api/analytics/metrics",
          description: "Get analytics metrics",
          auth: true,
        },
        {
          method: "POST",
          path: "/api/analytics/track",
          description: "Track custom event",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/analytics/reports",
          description: "Get analytics reports",
          auth: true,
        },
      ],
    },
    {
      category: "AI Generation",
      endpoints: [
        {
          method: "POST",
          path: "/api/ai/business-generate",
          description: "Generate application with AI",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/ai/templates",
          description: "Get AI templates",
          auth: true,
        },
      ],
    },
  ];

  const codeExamples = {
    authentication: `// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { user, token, tenant } = await response.json();

// Use token for authenticated requests
const apiResponse = await fetch('/api/ecommerce/products', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});`,

    ecommerce: `// Get products
const products = await fetch('/api/ecommerce/products?tenantId=your-tenant-id', {
  headers: { 'Authorization': \`Bearer \${token}\` }
}).then(r => r.json());

// Create product
const newProduct = await fetch('/api/ecommerce/products', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Product',
    price: 99.99,
    description: 'Product description',
    tenantId: 'your-tenant-id'
  })
}).then(r => r.json());`,

    marketing: `// Send email campaign
const campaign = await fetch('/api/email/campaigns', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Welcome Campaign',
    subject: 'Welcome to our platform!',
    templateId: 'template-id',
    recipientList: ['user@example.com'],
    tenantId: 'your-tenant-id'
  })
}).then(r => r.json());

// Track analytics event
await fetch('/api/analytics/track', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event: 'email_sent',
    properties: { campaignId: campaign.id },
    tenantId: 'your-tenant-id'
  })
});`,
  };

  const copyToClipboard = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/docs" className="text-blue-600 hover:text-blue-800">
              Documentation
            </Link>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">API Reference</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Reference
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete REST API documentation for developers building on the
            Rockket platform.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                API Access Ready
              </span>
            </div>
            <p className="text-blue-800">
              Your API token is configured and ready to use. All endpoints
              require authentication with your JWT token.
            </p>
          </div>
        </div>

        {/* API Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            API Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">REST API</span>
                </div>
                <p className="text-sm text-gray-600">
                  Standard HTTP methods and JSON responses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-5 w-5 text-green-600" />
                  <span className="font-medium">JWT Auth</span>
                </div>
                <p className="text-sm text-gray-600">
                  Secure authentication with JSON Web Tokens
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Multi-Tenant</span>
                </div>
                <p className="text-sm text-gray-600">
                  Tenant isolation and data separation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Real-time</span>
                </div>
                <p className="text-sm text-gray-600">
                  WebSocket support for real-time updates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            API Endpoints
          </h2>
          <div className="space-y-6">
            {apiEndpoints.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.endpoints.map((endpoint, endpointIndex) => (
                      <div
                        key={endpointIndex}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              endpoint.method === "GET"
                                ? "default"
                                : endpoint.method === "POST"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono">
                            {endpoint.path}
                          </code>
                          <span className="text-sm text-gray-600">
                            {endpoint.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {endpoint.auth && (
                            <Badge variant="outline" className="text-xs">
                              Auth Required
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Code Examples */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Code Examples
          </h2>
          <Tabs defaultValue="authentication" className="space-y-4">
            <TabsList>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>

            <TabsContent value="authentication">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Authentication Example</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(codeExamples.authentication, "auth")
                      }
                    >
                      {copiedCode === "auth" ? (
                        "Copied!"
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeExamples.authentication}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ecommerce">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>E-commerce Example</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(codeExamples.ecommerce, "ecommerce")
                      }
                    >
                      {copiedCode === "ecommerce" ? (
                        "Copied!"
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeExamples.ecommerce}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marketing">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Marketing Example</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(codeExamples.marketing, "marketing")
                      }
                    >
                      {copiedCode === "marketing" ? (
                        "Copied!"
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeExamples.marketing}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* SDKs and Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            SDKs and Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">JavaScript SDK</CardTitle>
                <CardDescription>
                  Official JavaScript/TypeScript SDK
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Code className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Postman Collection</CardTitle>
                <CardDescription>
                  Import API endpoints into Postman
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download Collection
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">OpenAPI Spec</CardTitle>
                <CardDescription>Complete API specification</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Specification
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Developer Resources
          </h3>
          <p className="text-gray-600 mb-6">
            Access all the tools and resources you need to build on the Rockket
            platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/api/docs">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Code className="h-4 w-4 mr-2" />
                View API Docs
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full">
                <Key className="h-4 w-4 mr-2" />
                API Keys
              </Button>
            </Link>
            <Link href="/docs/database">
              <Button variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Database Schema
              </Button>
            </Link>
            <Link href="/docs/deployment">
              <Button variant="outline" className="w-full">
                <Globe className="h-4 w-4 mr-2" />
                Deployment Guide
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
