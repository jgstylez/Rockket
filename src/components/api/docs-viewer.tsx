"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Code,
  Download,
  ExternalLink,
  Search,
  Filter,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
  Lock,
  Users,
  Zap,
  Database,
  ShoppingCart,
  BarChart3,
  Settings,
  Key,
} from "lucide-react";

interface APIDocumentation {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
    contact: {
      name: string;
      email: string;
      url: string;
    };
    license: {
      name: string;
      url: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  tags: Array<{
    name: string;
    description: string;
  }>;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
    securitySchemes: Record<string, any>;
  };
}

interface EndpointInfo {
  path: string;
  methods: Array<{
    method: string;
    summary: string;
    description: string;
    tags: string[];
    security: any[];
    parameters?: any[];
    requestBody?: any;
    responses: Record<string, any>;
  }>;
}

export function APIDocsViewer() {
  const [docs, setDocs] = useState<APIDocumentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(
    new Set()
  );
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  useEffect(() => {
    fetchAPIDocs();
  }, []);

  const fetchAPIDocs = async () => {
    try {
      const response = await fetch("/api/docs");
      if (!response.ok) {
        throw new Error("Failed to fetch API documentation");
      }
      const data = await response.json();
      setDocs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "get":
        return "bg-green-100 text-green-800 border-green-200";
      case "post":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "put":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "delete":
        return "bg-red-100 text-red-800 border-red-200";
      case "patch":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "authentication":
        return <Key className="h-4 w-4" />;
      case "ai generation":
        return <Zap className="h-4 w-4" />;
      case "visual builder":
        return <Code className="h-4 w-4" />;
      case "content management":
        return <BookOpen className="h-4 w-4" />;
      case "e-commerce":
        return <ShoppingCart className="h-4 w-4" />;
      case "analytics":
        return <BarChart3 className="h-4 w-4" />;
      case "tenants":
        return <Users className="h-4 w-4" />;
      case "users":
        return <Users className="h-4 w-4" />;
      case "features":
        return <Settings className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getSecurityIcon = (security: any[]) => {
    if (security.some((s) => s.BearerAuth)) {
      return <Lock className="h-4 w-4 text-red-500" />;
    }
    return <Globe className="h-4 w-4 text-green-500" />;
  };

  const copyToClipboard = async (text: string, endpoint: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(endpoint);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const toggleEndpoint = (endpoint: string) => {
    const newExpanded = new Set(expandedEndpoints);
    if (newExpanded.has(endpoint)) {
      newExpanded.delete(endpoint);
    } else {
      newExpanded.add(endpoint);
    }
    setExpandedEndpoints(newExpanded);
  };

  const filteredEndpoints = React.useMemo(() => {
    if (!docs?.paths) return [];

    const endpoints: EndpointInfo[] = [];

    Object.entries(docs.paths).forEach(([path, pathData]) => {
      const methods: EndpointInfo["methods"] = [];

      Object.entries(pathData).forEach(
        ([method, methodData]: [string, any]) => {
          if (typeof methodData === "object" && methodData.summary) {
            // Apply search filter
            if (searchTerm) {
              const searchLower = searchTerm.toLowerCase();
              const matchesSearch =
                methodData.summary.toLowerCase().includes(searchLower) ||
                methodData.description?.toLowerCase().includes(searchLower) ||
                path.toLowerCase().includes(searchLower) ||
                methodData.tags?.some((tag: string) =>
                  tag.toLowerCase().includes(searchLower)
                );
              if (!matchesSearch) return;
            }

            // Apply tag filter
            if (selectedTag) {
              const hasTag = methodData.tags?.includes(selectedTag);
              if (!hasTag) return;
            }

            methods.push({
              method: method.toUpperCase(),
              summary: methodData.summary,
              description: methodData.description || "",
              tags: methodData.tags || [],
              security: methodData.security || [],
              parameters: methodData.parameters,
              requestBody: methodData.requestBody,
              responses: methodData.responses || {},
            });
          }
        }
      );

      if (methods.length > 0) {
        endpoints.push({ path, methods });
      }
    });

    return endpoints;
  }, [docs, searchTerm, selectedTag]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">
            <BookOpen className="h-12 w-12 text-red-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Documentation
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchAPIDocs}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!docs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Documentation Available
          </h2>
          <p className="text-gray-600">
            API documentation could not be loaded.
          </p>
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
            {docs.info.title}
          </h1>
          <p className="text-gray-600">{docs.info.description}</p>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="outline">v{docs.info.version}</Badge>
            <Badge variant="outline">{docs.openapi}</Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            OpenAPI
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search endpoints, descriptions, or paths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedTag || ""}
                onChange={(e) => setSelectedTag(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Tags</option>
                {docs.tags.map((tag) => (
                  <option key={tag.name} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Servers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            API Servers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {docs.servers.map((server, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="font-medium text-sm text-gray-900">
                  {server.description}
                </div>
                <div className="text-sm text-gray-600 font-mono">
                  {server.url}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">API Endpoints</h2>
        {filteredEndpoints.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No endpoints found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || selectedTag
                    ? "Try adjusting your search or filter criteria"
                    : "No API endpoints are available"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredEndpoints.map((endpoint) => (
            <Card key={endpoint.path}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <code className="text-lg font-mono text-gray-900">
                      {endpoint.path}
                    </code>
                    <div className="flex space-x-1">
                      {endpoint.methods.map((method, index) => (
                        <Badge
                          key={index}
                          className={`${getMethodColor(method.method)} border`}
                        >
                          {method.method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEndpoint(endpoint.path)}
                  >
                    {expandedEndpoints.has(endpoint.path) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {expandedEndpoints.has(endpoint.path) && (
                <CardContent>
                  <div className="space-y-4">
                    {endpoint.methods.map((method, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-gray-200 pl-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getMethodColor(method.method)}>
                              {method.method}
                            </Badge>
                            <span className="font-medium">
                              {method.summary}
                            </span>
                            {getSecurityIcon(method.security)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                `${method.method} ${endpoint.path}`,
                                `${endpoint.path}-${method.method}`
                              )
                            }
                          >
                            {copiedEndpoint ===
                            `${endpoint.path}-${method.method}` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {method.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {method.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="flex items-center space-x-1"
                            >
                              {getTagIcon(tag)}
                              <span>{tag}</span>
                            </Badge>
                          ))}
                        </div>
                        {method.parameters && method.parameters.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-medium text-sm text-gray-900 mb-2">
                              Parameters
                            </h4>
                            <div className="space-y-1">
                              {method.parameters.map(
                                (param: any, paramIndex: number) => (
                                  <div key={paramIndex} className="text-sm">
                                    <code className="text-blue-600">
                                      {param.name}
                                    </code>
                                    <span className="text-gray-500">
                                      {" "}
                                      ({param.in})
                                    </span>
                                    {param.required && (
                                      <Badge
                                        variant="destructive"
                                        className="ml-2 text-xs"
                                      >
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {method.requestBody && (
                          <div className="mb-3">
                            <h4 className="font-medium text-sm text-gray-900 mb-2">
                              Request Body
                            </h4>
                            <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                              {method.requestBody.required
                                ? "Required"
                                : "Optional"}
                            </div>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 mb-2">
                            Responses
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(method.responses).map(
                              ([code, response]: [string, any]) => (
                                <div
                                  key={code}
                                  className="flex items-center space-x-2 text-sm"
                                >
                                  <Badge
                                    variant={
                                      code.startsWith("2")
                                        ? "default"
                                        : code.startsWith("4")
                                          ? "destructive"
                                          : "secondary"
                                    }
                                  >
                                    {code}
                                  </Badge>
                                  <span className="text-gray-600">
                                    {response.description}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Schemas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Data Schemas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(docs.components.schemas).map(
              ([name, schema]: [string, any]) => (
                <div key={name} className="p-4 border rounded-lg">
                  <div className="font-medium text-sm text-gray-900 mb-2">
                    {name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {schema.description || "No description available"}
                  </div>
                  {schema.required && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">
                        Required fields:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {schema.required.map((field: string) => (
                          <Badge
                            key={field}
                            variant="outline"
                            className="text-xs"
                          >
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
