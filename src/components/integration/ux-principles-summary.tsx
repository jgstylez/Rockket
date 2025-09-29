"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Brain,
  Zap,
  Target,
  Users,
  Shield,
  Eye,
  Settings,
  HelpCircle,
  Smartphone,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Lightbulb,
  Heart,
  Sparkles,
} from "lucide-react";

interface UXPrinciple {
  id: string;
  name: string;
  description: string;
  status: "implemented" | "partial" | "planned";
  impact: "high" | "medium" | "low";
  category: string;
  components: string[];
}

export function UXPrinciplesSummary() {
  const [activeCategory, setActiveCategory] = useState("all");

  const principles: UXPrinciple[] = [
    // Core Philosophy
    {
      id: "progressive-disclosure",
      name: "Progressive Disclosure",
      description: "Complexity appears only when mastery is demonstrated",
      status: "implemented",
      impact: "high",
      category: "Core Philosophy",
      components: ["SmartSidebar", "CommandPalette", "AICopilot"],
    },
    {
      id: "contextual-intelligence",
      name: "Contextual Intelligence",
      description: "Features appear when contextually relevant",
      status: "implemented",
      impact: "high",
      category: "Core Philosophy",
      components: ["AICopilot", "SmartSidebar", "CommandPalette"],
    },
    {
      id: "conversation-metaphor",
      name: "Conversation Metaphor",
      description: "Interface feels like talking to an expert",
      status: "implemented",
      impact: "high",
      category: "Core Philosophy",
      components: ["AICopilot", "WelcomeFlow", "ThreePathSwitcher"],
    },

    // Onboarding & Entry
    {
      id: "critical-first-3-minutes",
      name: "Critical First 3 Minutes",
      description: "Reduce decision paralysis with action-first approach",
      status: "implemented",
      impact: "high",
      category: "Onboarding",
      components: ["WelcomeFlow", "ThreePathSwitcher", "EmptyStateGuide"],
    },
    {
      id: "three-path-system",
      name: "Three-Path System",
      description: "Fluid modes between AI, Visual, and Code approaches",
      status: "implemented",
      impact: "high",
      category: "Onboarding",
      components: ["ThreePathSwitcher", "WelcomeFlow"],
    },
    {
      id: "intelligent-routing",
      name: "Intelligent Routing",
      description: "System suggests best starting approach based on input",
      status: "implemented",
      impact: "medium",
      category: "Onboarding",
      components: ["WelcomeFlow", "AICopilot"],
    },

    // Feature Discovery
    {
      id: "contextual-feature-surfacing",
      name: "Contextual Feature Surfacing",
      description: "Features appear when contextually relevant",
      status: "implemented",
      impact: "high",
      category: "Feature Discovery",
      components: ["AICopilot", "SmartSidebar", "CommandPalette"],
    },
    {
      id: "command-palette",
      name: "Command Palette",
      description: "Power user shortcut with fuzzy search",
      status: "implemented",
      impact: "medium",
      category: "Feature Discovery",
      components: ["CommandPalette"],
    },
    {
      id: "three-tier-revelation",
      name: "Three-Tier Revelation",
      description: "Always visible, contextual, and deep features",
      status: "implemented",
      impact: "high",
      category: "Feature Discovery",
      components: ["SmartSidebar", "CommandPalette", "AICopilot"],
    },

    // Dashboard & Navigation
    {
      id: "progressive-layout",
      name: "Progressive Layout",
      description: "Layout complexity increases with usage patterns",
      status: "implemented",
      impact: "high",
      category: "Dashboard",
      components: ["BaseDashboard", "SmartSidebar", "AICopilot"],
    },
    {
      id: "mental-model-organization",
      name: "Mental Model Organization",
      description: "Features grouped by intent, not technology",
      status: "implemented",
      impact: "high",
      category: "Dashboard",
      components: ["SmartSidebar", "IntentSettings"],
    },
    {
      id: "adaptive-dashboards",
      name: "Adaptive Dashboards",
      description: "Dashboards adapt to user expertise level",
      status: "implemented",
      impact: "medium",
      category: "Dashboard",
      components: ["BaseDashboard", "SmartSidebar", "AICopilot"],
    },

    // AI & Assistance
    {
      id: "ai-copilot",
      name: "AI Copilot",
      description: "Always available, never intrusive assistance",
      status: "implemented",
      impact: "high",
      category: "AI & Assistance",
      components: ["AICopilot", "SmartValidation"],
    },
    {
      id: "proactive-suggestions",
      name: "Proactive Suggestions",
      description: "AI predicts needs and suggests solutions",
      status: "implemented",
      impact: "high",
      category: "AI & Assistance",
      components: ["AICopilot", "SmartValidation", "PerformanceFeedback"],
    },
    {
      id: "educational-ai",
      name: "Educational AI",
      description: "AI teaches users as they build",
      status: "implemented",
      impact: "medium",
      category: "AI & Assistance",
      components: ["AICopilot", "EmbeddedHelp"],
    },

    // Error Prevention & Validation
    {
      id: "error-prevention",
      name: "Error Prevention",
      description: "Proactive safety before errors happen",
      status: "implemented",
      impact: "high",
      category: "Error Prevention",
      components: ["SmartValidation", "AICopilot"],
    },
    {
      id: "smart-validation",
      name: "Smart Validation",
      description: "Real-time validation with helpful suggestions",
      status: "implemented",
      impact: "high",
      category: "Error Prevention",
      components: ["SmartValidation"],
    },
    {
      id: "undo-everywhere",
      name: "Undo Everywhere",
      description: "Every action is reversible",
      status: "implemented",
      impact: "medium",
      category: "Error Prevention",
      components: ["BaseDashboard", "LiveCollaboration"],
    },

    // Performance & Feedback
    {
      id: "invisible-speed",
      name: "Invisible Speed",
      description: "Users should never wait",
      status: "implemented",
      impact: "high",
      category: "Performance",
      components: ["PerformanceFeedback", "MobileOptimization"],
    },
    {
      id: "optimistic-ui",
      name: "Optimistic UI",
      description: "Changes appear instantly, sync in background",
      status: "implemented",
      impact: "high",
      category: "Performance",
      components: ["PerformanceFeedback", "BaseDashboard"],
    },
    {
      id: "performance-feedback",
      name: "Performance Feedback",
      description: "Real-time performance metrics and optimization",
      status: "implemented",
      impact: "medium",
      category: "Performance",
      components: ["PerformanceFeedback"],
    },

    // Collaboration
    {
      id: "invisible-collaboration",
      name: "Invisible Collaboration",
      description: "Multiplayer features appear when needed",
      status: "implemented",
      impact: "medium",
      category: "Collaboration",
      components: ["LiveCollaboration", "SmartSidebar"],
    },
    {
      id: "presence-indicators",
      name: "Presence Indicators",
      description: "Show who's online and what they're working on",
      status: "implemented",
      impact: "medium",
      category: "Collaboration",
      components: ["LiveCollaboration"],
    },
    {
      id: "version-history",
      name: "Version History",
      description: "Automatic snapshots and one-click restore",
      status: "implemented",
      impact: "medium",
      category: "Collaboration",
      components: ["LiveCollaboration"],
    },

    // Mobile & Responsive
    {
      id: "live-device-preview",
      name: "Live Device Preview",
      description: "Edit in any view, changes sync instantly",
      status: "implemented",
      impact: "high",
      category: "Mobile",
      components: ["DevicePreview", "MobileOptimization"],
    },
    {
      id: "mobile-first",
      name: "Mobile-First Design",
      description: "Interface adapts to mobile, not hides it",
      status: "implemented",
      impact: "high",
      category: "Mobile",
      components: ["MobileOptimization", "DevicePreview"],
    },

    // Help & Learning
    {
      id: "embedded-help",
      name: "Embedded Help",
      description: "Help integrated into workflow, not separate",
      status: "implemented",
      impact: "medium",
      category: "Help & Learning",
      components: ["EmbeddedHelp", "AICopilot"],
    },
    {
      id: "just-in-time-education",
      name: "Just-in-Time Education",
      description: "Teach features as users need them",
      status: "implemented",
      impact: "medium",
      category: "Help & Learning",
      components: ["EmbeddedHelp", "AICopilot"],
    },

    // Settings & Configuration
    {
      id: "intent-settings",
      name: "Intent-Based Settings",
      description: "Settings organized by what users want to achieve",
      status: "implemented",
      impact: "medium",
      category: "Settings",
      components: ["IntentSettings"],
    },
    {
      id: "context-settings",
      name: "Context Settings",
      description: "Settings appear in right panel, never navigate away",
      status: "implemented",
      impact: "low",
      category: "Settings",
      components: ["IntentSettings"],
    },
  ];

  const categories = [
    "all",
    "Core Philosophy",
    "Onboarding",
    "Feature Discovery",
    "Dashboard",
    "AI & Assistance",
    "Error Prevention",
    "Performance",
    "Collaboration",
    "Mobile",
    "Help & Learning",
    "Settings",
  ];

  const filteredPrinciples =
    activeCategory === "all"
      ? principles
      : principles.filter((p) => p.category === activeCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented":
        return "bg-green-100 text-green-800 border-green-200";
      case "partial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "planned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const implementedCount = principles.filter(
    (p) => p.status === "implemented"
  ).length;
  const totalCount = principles.length;
  const implementationRate = Math.round((implementedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            UX/UI Principles Implementation Summary
          </CardTitle>
          <CardDescription>
            Comprehensive overview of all implemented UX/UI principles and their
            components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {implementedCount}
              </div>
              <div className="text-xs text-green-700">Implemented</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {totalCount}
              </div>
              <div className="text-xs text-blue-700">Total Principles</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {implementationRate}%
              </div>
              <div className="text-xs text-purple-700">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category === "all" ? "All Categories" : category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrinciples.map((principle) => (
          <Card
            key={principle.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                {principle.name}
                <Badge className={getStatusColor(principle.status)}>
                  {principle.status}
                </Badge>
                <Badge className={getImpactColor(principle.impact)}>
                  {principle.impact} impact
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                {principle.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Category: {principle.category}
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  Components: {principle.components.length}
                </div>
                <div className="flex flex-wrap gap-1">
                  {principle.components.map((component) => (
                    <Badge
                      key={component}
                      variant="outline"
                      className="text-xs"
                    >
                      {component}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Status */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            Implementation Status
          </CardTitle>
          <CardDescription>
            All major UX/UI principles have been successfully implemented
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                Progressive Disclosure with Contextual Intelligence
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                Three-Path System (AI, Visual, Code)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                Command Palette & AI Copilot
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                Smart Validation & Error Prevention
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                Live Collaboration & Mobile Optimization
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                Embedded Help & Intent-Based Settings
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
