"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Save,
  Eye,
  Code,
  Undo,
  Redo,
  Settings,
  Layers,
  Component,
  Zap,
  Workflow,
  Shield,
  Database,
  Brain,
  Play,
  Pause,
  Settings2,
} from "lucide-react";

import { BusinessLogicBuilder } from "@/lib/builder/business-logic";
import {
  BUSINESS_COMPONENT_LIBRARY,
  BusinessComponentFactory,
} from "@/lib/builder/business-components";
import { BuilderComponent } from "@/lib/builder/components";

// Enhanced component with business logic
export interface EnhancedBuilderComponent extends BuilderComponent {
  businessLogic?: {
    rules: any[];
    workflows: any[];
    triggers: string[];
    dataBindings: any[];
    validations: any[];
  };
}

// Business Logic Panel Component
const BusinessLogicPanel: React.FC<{
  component: EnhancedBuilderComponent | null;
  onUpdate: (component: EnhancedBuilderComponent) => void;
}> = ({ component, onUpdate }) => {
  const [businessLogic, setBusinessLogic] = useState(
    component?.businessLogic || {
      rules: [],
      workflows: [],
      triggers: [],
      dataBindings: [],
      validations: [],
    }
  );

  const [activeTab, setActiveTab] = useState("rules");

  useEffect(() => {
    if (component?.businessLogic) {
      setBusinessLogic(component.businessLogic);
    }
  }, [component]);

  const handleUpdate = useCallback(() => {
    if (component) {
      onUpdate({
        ...component,
        businessLogic,
      });
    }
  }, [component, businessLogic, onUpdate]);

  if (!component) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Select a component to configure business logic</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Business Logic</h3>
        <Badge variant="outline">{component.name}</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="space-y-2">
            <Label>Business Rules</Label>
            <div className="space-y-2">
              {businessLogic.rules.map((rule, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={rule.enabled} />
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full">
              + Add Rule
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="space-y-2">
            <Label>Workflows</Label>
            <div className="space-y-2">
              {businessLogic.workflows.map((workflow, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{workflow.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {workflow.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={workflow.enabled} />
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full">
              + Add Workflow
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          <div className="space-y-2">
            <Label>Event Triggers</Label>
            <div className="space-y-2">
              {businessLogic.triggers.map((trigger, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="secondary">{trigger}</Badge>
                  <Button size="sm" variant="ghost">
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add trigger..." />
              <Button size="sm">Add</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="space-y-2">
            <Label>Data Bindings</Label>
            <div className="space-y-2">
              {businessLogic.dataBindings.map((binding, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{binding.field}</p>
                      <p className="text-sm text-muted-foreground">
                        {binding.source} → {binding.target}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full">
              + Add Data Binding
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleUpdate} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save Logic
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setBusinessLogic(
              component?.businessLogic || {
                rules: [],
                workflows: [],
                triggers: [],
                dataBindings: [],
                validations: [],
              }
            )
          }
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

// Enhanced Component Renderer with Business Logic
const EnhancedComponentRenderer: React.FC<{
  component: EnhancedBuilderComponent;
  onSelect?: (component: EnhancedBuilderComponent) => void;
  isSelected?: boolean;
  businessLogicEngine?: BusinessLogicBuilder;
}> = ({ component, onSelect, isSelected, businessLogicEngine }) => {
  const handleClick = useCallback(() => {
    onSelect?.(component);
  }, [component, onSelect]);

  const renderComponent = () => {
    switch (component.type) {
      case "BusinessForm":
        return (
          <div
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Business Form</h3>
              <div className="space-y-2">
                {component.props.formConfig?.fields?.map(
                  (field: any, index: number) => (
                    <div key={index} className="space-y-1">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    </div>
                  )
                )}
              </div>
              <Button className="w-full mt-4">
                {component.props.formConfig?.submitAction || "Submit"}
              </Button>
            </div>
          </div>
        );

      case "BusinessWorkflow":
        return (
          <div
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Business Workflow
              </h3>
              <div className="space-y-2">
                {component.props.workflowConfig?.workflow?.steps?.map(
                  (step: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                    >
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step.name}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "BusinessCheckout":
        return (
          <div
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Business Checkout
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Payment Methods</Label>
                  <div className="flex gap-2 mt-1">
                    {component.props.checkoutConfig?.paymentMethods?.map(
                      (method: any, index: number) => (
                        <Badge key={index} variant="outline">
                          {method}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <Label>Shipping Options</Label>
                  <div className="space-y-1 mt-1">
                    {component.props.checkoutConfig?.shippingOptions?.map(
                      (option: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">{option.name}</span>
                          <span className="text-sm font-medium">
                            ${option.cost}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "BusinessDashboard":
        return (
          <div
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Business Dashboard
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {component.props.dashboardConfig?.widgets?.map(
                  (widget: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium">{widget.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {widget.type}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );

      default:
        // Fallback to regular component rendering
        return (
          <div
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            {component.children?.map((child) => (
              <EnhancedComponentRenderer
                key={child.id}
                component={child as EnhancedBuilderComponent}
                onSelect={onSelect}
                businessLogicEngine={businessLogicEngine}
              />
            ))}
          </div>
        );
    }
  };

  return renderComponent();
};

// Main Enhanced Visual Builder Component
export const EnhancedVisualBuilder: React.FC = () => {
  const [components, setComponents] = useState<EnhancedBuilderComponent[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<EnhancedBuilderComponent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState<EnhancedBuilderComponent[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [businessLogicEngine] = useState(new BusinessLogicBuilder());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      const draggedComponent = BUSINESS_COMPONENT_LIBRARY.find(
        (comp) => comp.id === active.id
      );

      if (draggedComponent) {
        const newComponent: EnhancedBuilderComponent = {
          ...draggedComponent,
          id: `${draggedComponent.type}-${Date.now()}`,
        };

        // Save to history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...components, newComponent]);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        setComponents((prev) => [...prev, newComponent]);
      }

      setActiveId(null);
    },
    [components, history, historyIndex]
  );

  const handleSelectComponent = useCallback(
    (component: EnhancedBuilderComponent) => {
      setSelectedComponent(component);
    },
    []
  );

  const handleUpdateComponent = useCallback(
    (updatedComponent: EnhancedBuilderComponent) => {
      setComponents((prev) =>
        prev.map((comp) =>
          comp.id === updatedComponent.id ? updatedComponent : comp
        )
      );
      setSelectedComponent(updatedComponent);
    },
    []
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const handleSave = useCallback(() => {
    // Save components to backend
    console.log("Saving enhanced components:", components);
    // TODO: Implement save functionality
  }, [components]);

  const handlePreview = useCallback(() => {
    // Open preview in new window
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Enhanced Builder Preview</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            <div class="p-6">
              <h1 class="text-2xl font-bold mb-4">Enhanced Builder Preview</h1>
              <div class="space-y-4">
                ${components
                  .map(
                    (comp) => `
                  <div class="p-4 border rounded-lg">
                    <h3 class="font-semibold">${comp.name}</h3>
                    <p class="text-sm text-gray-600">${comp.description}</p>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          </body>
        </html>
      `);
    }
  }, [components]);

  const groupedComponents = BUSINESS_COMPONENT_LIBRARY.reduce(
    (acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = [];
      }
      acc[component.category].push(component);
      return acc;
    },
    {} as Record<string, typeof BUSINESS_COMPONENT_LIBRARY>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Component Library Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Component className="h-5 w-5" />
              Business Components
            </h2>
            <p className="text-sm text-muted-foreground">
              Drag components with business logic
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {Object.entries(groupedComponents).map(
                  ([category, categoryComponents]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {categoryComponents.map((component) => (
                          <div
                            key={component.id}
                            className="p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            draggable
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{component.icon}</span>
                              <div>
                                <p className="font-medium text-sm">
                                  {component.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {component.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </TabsContent>

              <TabsContent value="business" className="space-y-4 mt-4">
                {groupedComponents["Business Logic"]?.map((component) => (
                  <div
                    key={component.id}
                    className="p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    draggable
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{component.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{component.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {component.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Main Builder Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="min-h-full bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
              {components.length === 0 ? (
                <div className="text-center py-12">
                  <Layers className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Start Building
                  </h3>
                  <p className="text-gray-500">
                    Drag components from the sidebar to start building your
                    application
                  </p>
                </div>
              ) : (
                <SortableContext
                  items={components.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {components.map((component) => (
                    <EnhancedComponentRenderer
                      key={component.id}
                      component={component}
                      onSelect={handleSelectComponent}
                      isSelected={selectedComponent?.id === component.id}
                      businessLogicEngine={businessLogicEngine}
                    />
                  ))}
                </SortableContext>
              )}
            </div>
          </div>
        </div>

        {/* Business Logic Panel */}
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Business Logic
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure business rules and workflows
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <BusinessLogicPanel
              component={selectedComponent}
              onUpdate={handleUpdateComponent}
            />
          </div>
        </div>

        {/* Drag Overlay */}
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              {activeId ? (
                <div className="p-3 border border-gray-200 rounded-lg bg-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {
                        BUSINESS_COMPONENT_LIBRARY.find(
                          (c) => c.id === activeId
                        )?.icon
                      }
                    </span>
                    <span className="font-medium">
                      {
                        BUSINESS_COMPONENT_LIBRARY.find(
                          (c) => c.id === activeId
                        )?.name
                      }
                    </span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );
};
