"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Palette,
  Code,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Target,
  Lightbulb,
} from "lucide-react";

interface PathMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  isActive: boolean;
}

export function ThreePathSwitcher() {
  const [activeMode, setActiveMode] = useState("ai");
  const [isExpanded, setIsExpanded] = useState(false);

  const modes: PathMode[] = [
    {
      id: "ai",
      name: "AI Generation",
      description: "Describe what you want and I'll build it",
      icon: <Brain className="h-5 w-5" />,
      color: "purple",
      features: [
        "Natural language input",
        "Automatic code generation",
        "Smart suggestions",
        "One-click deployment",
      ],
      isActive: activeMode === "ai",
    },
    {
      id: "visual",
      name: "Visual Builder",
      description: "Drag and drop to create your interface",
      icon: <Palette className="h-5 w-5" />,
      color: "blue",
      features: [
        "Component library",
        "Real-time preview",
        "Responsive design",
        "Export to code",
      ],
      isActive: activeMode === "visual",
    },
    {
      id: "code",
      name: "Code Editor",
      description: "Write custom code with AI assistance",
      icon: <Code className="h-5 w-5" />,
      color: "green",
      features: [
        "Intelligent autocomplete",
        "AI code suggestions",
        "Live preview",
        "Version control",
      ],
      isActive: activeMode === "code",
    },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      purple: isActive
        ? "bg-purple-50 border-purple-200 text-purple-900"
        : "bg-purple-50/50 border-purple-100 text-purple-700",
      blue: isActive
        ? "bg-blue-50 border-blue-200 text-blue-900"
        : "bg-blue-50/50 border-blue-100 text-blue-700",
      green: isActive
        ? "bg-green-50 border-green-200 text-green-900"
        : "bg-green-50/50 border-green-100 text-green-700",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      purple: "text-purple-600",
      blue: "text-blue-600",
      green: "text-green-600",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Switcher Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <Zap className="h-6 w-6" />
      </Button>

      {/* Expanded Mode Selector */}
      {isExpanded && (
        <Card className="absolute bottom-16 right-0 w-80 shadow-2xl border-0 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Switch Mode</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-6 w-6 p-0"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {modes.map((mode) => (
                  <Card
                    key={mode.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      mode.isActive ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActiveMode(mode.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${getColorClasses(mode.color, mode.isActive)}`}
                        >
                          <div className={getIconColor(mode.color)}>
                            {mode.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{mode.name}</h4>
                            {mode.isActive && (
                              <Badge variant="default" className="text-xs">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {mode.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {mode.features.slice(0, 2).map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-muted rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                            {mode.features.length > 2 && (
                              <span className="text-xs px-2 py-1 bg-muted rounded-full">
                                +{mode.features.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                        {mode.isActive && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Lightbulb className="h-3 w-3" />
                  <span>
                    Pro tip: You can switch modes anytime without losing your
                    work
                  </span>
                </div>
                <Button className="w-full" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Continue in {modes.find((m) => m.isActive)?.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
