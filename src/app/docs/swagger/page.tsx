"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Code, BookOpen } from "lucide-react";

export default function SwaggerPage() {
  const [swaggerUrl, setSwaggerUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set the Swagger URL to our API docs endpoint
    setSwaggerUrl("/api/docs");
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Swagger UI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            API Documentation
          </h1>
          <p className="text-gray-600">
            Interactive API documentation with Swagger UI
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download OpenAPI
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Raw JSON
          </Button>
        </div>
      </div>

      {/* Swagger UI Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Interactive API Explorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Swagger UI Integration
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This page provides an interactive API documentation interface
                using Swagger UI. You can test API endpoints directly from this
                interface.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-mono text-gray-600">
                    OpenAPI 3.0
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Interactive Testing
                  </span>
                </div>
              </div>
            </div>

            {/* Swagger UI iframe */}
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={`https://petstore.swagger.io/?url=${encodeURIComponent(
                  `${window.location.origin}${swaggerUrl}`
                )}`}
                width="100%"
                height="800"
                frameBorder="0"
                title="Swagger UI"
                className="w-full"
              />
            </div>

            {/* Alternative Swagger UI implementations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Swagger Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Edit and validate your OpenAPI specification with Swagger
                    Editor.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open(
                        `https://editor.swagger.io/?url=${encodeURIComponent(
                          `${window.location.origin}${swaggerUrl}`
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Swagger Editor
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Redoc</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Beautiful, responsive API documentation with Redoc.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open(
                        `https://redocly.github.io/redoc/?url=${encodeURIComponent(
                          `${window.location.origin}${swaggerUrl}`
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Redoc
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* API Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                API Information
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div>
                  <strong>Base URL:</strong>{" "}
                  {typeof window !== "undefined" ? window.location.origin : ""}
                </div>
                <div>
                  <strong>OpenAPI Spec:</strong>{" "}
                  <a
                    href={swaggerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    {swaggerUrl}
                  </a>
                </div>
                <div>
                  <strong>Authentication:</strong> Bearer Token (JWT)
                </div>
                <div>
                  <strong>Content Type:</strong> application/json
                </div>
              </div>
            </div>

            {/* Quick Start Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      1. Authentication
                    </h4>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      POST /api/auth/login
                      <br />
                      {`{
  "email": "user@example.com",
  "password": "password123"
}`}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      2. Use the Token
                    </h4>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      Authorization: Bearer YOUR_JWT_TOKEN
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      3. Make API Calls
                    </h4>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      GET /api/ai/generate
                      <br />
                      POST /api/builder/projects
                      <br />
                      GET /api/cms/pages
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
