"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Layers, 
  Settings, 
  Eye, 
  Code, 
  Save,
  Undo,
  Redo,
  Download
} from "lucide-react";

export function EnhancedVisualBuilder() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [components, setComponents] = useState<any[]>([]);

  const availableComponents = [
    { id: "hero", name: "Hero Section", icon: <Palette className="h-4 w-4" /> },
    { id: "features", name: "Features", icon: <Layers className="h-4 w-4" /> },
    { id: "testimonials", name: "Testimonials", icon: <Eye className="h-4 w-4" /> },
    { id: "cta", name: "Call to Action", icon: <Code className="h-4 w-4" /> },
  ];

  const addComponent = (componentId: string) => {
    const newComponent = {
      id: Date.now().toString(),
      type: componentId,
      props: {},
    };
    setComponents([...components, newComponent]);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r p-4">
        <h3 className="font-semibold mb-4">Components</h3>
        <div className="space-y-2">
          {availableComponents.map((component) => (
            <Button
              key={component.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => addComponent(component.id)}
            >
              {component.icon}
              <span className="ml-2">{component.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Code className="h-4 w-4" />
              Code
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-8 bg-gray-100 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {components.length === 0 ? (
              <div className="text-center py-12">
                <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Building Your Page
                </h3>
                <p className="text-gray-600">
                  Drag components from the sidebar to start building your page.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {components.map((component) => (
                  <Card key={component.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg capitalize">
                          {component.type} Component
                        </CardTitle>
                        <Badge variant="outline">
                          {component.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        This is a {component.type} component. Click to edit its properties.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white border-l p-4">
        <h3 className="font-semibold mb-4">Properties</h3>
        {selectedComponent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Component Type
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={selectedComponent}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Enter description"
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Select a component to edit its properties.
          </p>
        )}
      </div>
    </div>
  );
}
