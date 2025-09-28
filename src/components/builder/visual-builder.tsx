"use client";

import React, { useState, useCallback } from "react";
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
} from "lucide-react";

// Component types
export interface BuilderComponent {
  id: string;
  type: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  props: Record<string, any>;
  children?: BuilderComponent[];
}

// Predefined components
const COMPONENT_LIBRARY: BuilderComponent[] = [
  // Layout Components
  {
    id: "container",
    type: "Container",
    name: "Container",
    icon: <Component className="h-4 w-4" />,
    category: "Layout",
    props: { className: "p-4 bg-white border rounded-lg" },
  },
  {
    id: "row",
    type: "Row",
    name: "Row",
    icon: <Layers className="h-4 w-4" />,
    category: "Layout",
    props: { className: "flex flex-row gap-4" },
  },
  {
    id: "column",
    type: "Column",
    name: "Column",
    icon: <Layers className="h-4 w-4" />,
    category: "Layout",
    props: { className: "flex flex-col gap-4" },
  },
  // Text Components
  {
    id: "heading",
    type: "Heading",
    name: "Heading",
    icon: <Palette className="h-4 w-4" />,
    category: "Text",
    props: {
      level: 1,
      text: "Your Heading Here",
      className: "text-3xl font-bold text-gray-900",
    },
  },
  {
    id: "paragraph",
    type: "Paragraph",
    name: "Paragraph",
    icon: <Palette className="h-4 w-4" />,
    category: "Text",
    props: {
      text: "Your paragraph text goes here...",
      className: "text-gray-600",
    },
  },
  // Button Component
  {
    id: "button",
    type: "Button",
    name: "Button",
    icon: <Palette className="h-4 w-4" />,
    category: "Interactive",
    props: {
      text: "Click Me",
      className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
    },
  },
];

// Component renderer
const ComponentRenderer: React.FC<{
  component: BuilderComponent;
  onSelect?: (component: BuilderComponent) => void;
  isSelected?: boolean;
}> = ({ component, onSelect, isSelected }) => {
  const handleClick = useCallback(() => {
    onSelect?.(component);
  }, [component, onSelect]);

  const renderComponent = () => {
    switch (component.type) {
      case "Container":
        return (
          <div
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                onSelect={onSelect}
              />
            ))}
          </div>
        );
      case "Row":
        return (
          <div
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                onSelect={onSelect}
              />
            ))}
          </div>
        );
      case "Column":
        return (
          <div
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                onSelect={onSelect}
              />
            ))}
          </div>
        );
      case "Heading":
        const HeadingTag =
          `h${component.props.level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            {component.props.text}
          </HeadingTag>
        );
      case "Paragraph":
        return (
          <p
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            {component.props.text}
          </p>
        );
      case "Button":
        return (
          <button
            className={`${component.props.className} ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            {component.props.text}
          </button>
        );
      default:
        return (
          <div
            className={`p-4 border-2 border-dashed border-gray-300 rounded ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            {component.name}
          </div>
        );
    }
  };

  return renderComponent();
};

// Draggable component item
const DraggableComponent: React.FC<{
  component: BuilderComponent;
}> = ({ component }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white border rounded cursor-grab hover:bg-gray-50">
      {component.icon}
      <span className="text-sm font-medium">{component.name}</span>
    </div>
  );
};

// Main Visual Builder Component
export const VisualBuilder: React.FC = () => {
  const [components, setComponents] = useState<BuilderComponent[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<BuilderComponent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState<BuilderComponent[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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

      const draggedComponent = COMPONENT_LIBRARY.find(
        (comp) => comp.id === active.id
      );

      if (draggedComponent) {
        const newComponent: BuilderComponent = {
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

  const handleSelectComponent = useCallback((component: BuilderComponent) => {
    setSelectedComponent(component);
  }, []);

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
    console.log("Saving components:", components);
    // TODO: Implement save functionality
  }, [components]);

  const handlePreview = useCallback(() => {
    // Open preview in new window
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Preview</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            ${components.map((comp) => (
              <ComponentRenderer key={comp.id} component={comp} />
            ))}
          </body>
        </html>
      `);
    }
  }, [components]);

  const groupedComponents = COMPONENT_LIBRARY.reduce(
    (acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = [];
      }
      acc[component.category].push(component);
      return acc;
    },
    {} as Record<string, BuilderComponent[]>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Component Library Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Component Library</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="interactive">Interactive</TabsTrigger>
            </TabsList>

            {Object.entries(groupedComponents).map(([category, comps]) => (
              <TabsContent key={category} value={category.toLowerCase()}>
                <div className="space-y-2">
                  {comps.map((component) => (
                    <DraggableComponent
                      key={component.id}
                      component={component}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Main Canvas Area */}
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
              <Button variant="outline" size="sm">
                <Code className="h-4 w-4 mr-2" />
                Code
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8 overflow-auto">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="min-h-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
              {components.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Palette className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">
                      Start building your page
                    </p>
                    <p className="text-sm">
                      Drag components from the library to get started
                    </p>
                  </div>
                </div>
              ) : (
                <SortableContext
                  items={components.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {components.map((component) => (
                    <ComponentRenderer
                      key={component.id}
                      component={component}
                      onSelect={handleSelectComponent}
                      isSelected={selectedComponent?.id === component.id}
                    />
                  ))}
                </SortableContext>
              )}
            </div>

            <DragOverlay>
              {activeId ? (
                <DraggableComponent
                  component={COMPONENT_LIBRARY.find((c) => c.id === activeId)!}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedComponent && (
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Properties</h3>
          </div>
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {selectedComponent.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <p className="text-sm text-gray-600">
                      {selectedComponent.type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">ID</label>
                    <p className="text-sm text-gray-600 font-mono">
                      {selectedComponent.id}
                    </p>
                  </div>
                  {/* TODO: Add property editing form */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
