"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Palette, 
  Database, 
  Cloud, 
  Zap, 
  Settings,
  Play,
  Download,
  Share
} from "lucide-react";

export function UnifiedDevelopmentPlatform() {
  const [activeTab, setActiveTab] = useState("ai-generation");

  const tabs = [
    {
      id: "ai-generation",
      label: "AI Generation",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      id: "visual-builder",
      label: "Visual Builder",
      icon: <Palette className="h-4 w-4" />,
    },
    {
      id: "code-editor",
      label: "Code Editor",
      icon: <Code className="h-4 w-4" />,
    },
    {
      id: "database",
      label: "Database",
      icon: <Database className="h-4 w-4" />,
    },
    {
      id: "deployment",
      label: "Deployment",
      icon: <Cloud className="h-4 w-4" />,
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Unified Development Platform
            </h1>
            <p className="text-gray-600">
              Build, deploy, and manage your applications in one place
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4" />
              Deploy
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center space-x-2 justify-start"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="ai-generation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>AI Generation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your application
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={4}
                        placeholder="Describe what you want to build..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button>Generate Application</Button>
                      <Button variant="outline">Load Template</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visual-builder" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Visual Builder</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Visual Builder
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop components to build your application visually.
                    </p>
                    <Button>Open Visual Builder</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code-editor" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>Code Editor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-green-400 text-sm">
                      <code>
                        {`// Your application code will appear here
function App() {
  return (
    <div className="app">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;`}
                      </code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Database Schema</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tables</h4>
                        <div className="space-y-2">
                          <div className="p-2 bg-gray-50 rounded border">
                            <span className="text-sm font-medium">users</span>
                          </div>
                          <div className="p-2 bg-gray-50 rounded border">
                            <span className="text-sm font-medium">products</span>
                          </div>
                          <div className="p-2 bg-gray-50 rounded border">
                            <span className="text-sm font-medium">orders</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Relationships</h4>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            users → orders (1:many)
                          </div>
                          <div className="text-sm text-gray-600">
                            products → orders (many:many)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deployment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cloud className="h-5 w-5" />
                    <span>Deployment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-900">Production</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Live
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Environment</h4>
                        <p className="text-sm text-gray-600">Production</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">URL</h4>
                        <p className="text-sm text-gray-600">https://app.rockket.com</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Last Deploy</h4>
                        <p className="text-sm text-gray-600">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
