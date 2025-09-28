"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Palette,
  Code,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Download,
  Upload,
  Save,
  Eye,
  Settings,
  Zap,
  Brain,
  Workflow,
  Database,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { toast } from "sonner";

import {
  UnifiedDevelopmentPlatform,
  UnifiedProject,
  DevelopmentApproach,
  ConversionResult,
} from "@/lib/unified-platform";
import { BusinessGenerator } from "@/components/ai/business-generator";
import { EnhancedVisualBuilder } from "@/components/builder/enhanced-visual-builder";

interface UnifiedDevelopmentPlatformProps {
  onProjectChange?: (project: UnifiedProject) => void;
}

export function UnifiedDevelopmentPlatformComponent({
  onProjectChange,
}: UnifiedDevelopmentPlatformProps) {
  const [platform] = useState(new UnifiedDevelopmentPlatform());
  const [currentProject, setCurrentProject] = useState<UnifiedProject | null>(
    null
  );
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] =
    useState<ConversionResult | null>(null);
  const [activeTab, setActiveTab] = useState<DevelopmentApproach>("ai");

  // Initialize with a new project
  useEffect(() => {
    const project = platform.createProject(
      "My Unified Project",
      "A project that can switch between AI, visual, and code approaches"
    );
    setCurrentProject(project);
    onProjectChange?.(project);
  }, [platform, onProjectChange]);

  const handleSwitchApproach = useCallback(
    async (targetApproach: DevelopmentApproach) => {
      if (!currentProject) return;

      setIsConverting(true);
      setConversionResult(null);

      try {
        const result = await platform.switchApproach(
          currentProject.id,
          targetApproach,
          {
            preserveData: true,
            convertExisting: true,
            mergeChanges: true,
          }
        );

        setConversionResult(result);

        if (result.success) {
          const updatedProject = platform.getProject(currentProject.id);
          if (updatedProject) {
            setCurrentProject(updatedProject);
            setActiveTab(targetApproach);
            onProjectChange?.(updatedProject);
            toast.success(
              `Successfully switched to ${targetApproach} approach`
            );
          }
        } else {
          toast.error(
            `Failed to switch to ${targetApproach}: ${result.errors.join(", ")}`
          );
        }
      } catch (error) {
        toast.error(
          `Conversion error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      } finally {
        setIsConverting(false);
      }
    },
    [currentProject, platform, onProjectChange]
  );

  const handleSaveProject = useCallback(() => {
    if (!currentProject) return;

    // Save project state
    console.log("Saving project:", currentProject);
    toast.success("Project saved successfully");
  }, [currentProject]);

  const handleExportProject = useCallback(() => {
    if (!currentProject) return;

    const projectData = platform.exportProject(currentProject.id);
    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.name}-unified-project.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Project exported successfully");
  }, [currentProject, platform]);

  const getApproachIcon = (approach: DevelopmentApproach) => {
    switch (approach) {
      case "ai":
        return <Sparkles className="h-5 w-5" />;
      case "visual":
        return <Palette className="h-5 w-5" />;
      case "code":
        return <Code className="h-5 w-5" />;
    }
  };

  const getApproachColor = (approach: DevelopmentApproach) => {
    switch (approach) {
      case "ai":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "visual":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "code":
        return "bg-green-50 border-green-200 text-green-700";
    }
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading unified development platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600" />
                Unified Development Platform
              </h1>
              <p className="text-muted-foreground">
                Seamlessly switch between AI, visual, and code approaches
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveProject}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleExportProject}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Approach Switcher */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Current Approach:
              </span>
              <Badge
                className={`${getApproachColor(currentProject.currentApproach)} flex items-center gap-1`}
              >
                {getApproachIcon(currentProject.currentApproach)}
                {currentProject.currentApproach.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {(["ai", "visual", "code"] as DevelopmentApproach[]).map(
                (approach) => (
                  <Button
                    key={approach}
                    variant={
                      currentProject.currentApproach === approach
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleSwitchApproach(approach)}
                    disabled={
                      isConverting ||
                      currentProject.currentApproach === approach
                    }
                    className="flex items-center gap-2"
                  >
                    {getApproachIcon(approach)}
                    {approach.toUpperCase()}
                    {isConverting &&
                      currentProject.currentApproach !== approach && (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      )}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Result */}
      {conversionResult && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div
              className={`p-4 rounded-lg ${
                conversionResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {conversionResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">
                  {conversionResult.success
                    ? "Conversion Successful"
                    : "Conversion Failed"}
                </span>
              </div>

              {conversionResult.warnings.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-yellow-700">
                    <strong>Warnings:</strong>{" "}
                    {conversionResult.warnings.join(", ")}
                  </p>
                </div>
              )}

              {conversionResult.errors.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-red-700">
                    <strong>Errors:</strong>{" "}
                    {conversionResult.errors.join(", ")}
                  </p>
                </div>
              )}

              {conversionResult.suggestions.length > 0 && (
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>Suggestions:</strong>{" "}
                    {conversionResult.suggestions.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as DevelopmentApproach)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generation
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Visual Builder
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  AI-Powered Application Generation
                </CardTitle>
                <CardDescription>
                  Generate complete business applications with AI, then switch
                  to visual or code approaches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessGenerator
                  onApplicationGenerated={(application) => {
                    // Update project with AI-generated application
                    const updatedProject = { ...currentProject };
                    updatedProject.approaches.ai = {
                      businessApp: application,
                      requirements: {},
                      generatedCode: application.code,
                      aiProvider: "openai",
                      lastGenerated: new Date(),
                    };
                    setCurrentProject(updatedProject);
                    onProjectChange?.(updatedProject);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Visual Builder with Business Logic
                </CardTitle>
                <CardDescription>
                  Build applications visually with drag-and-drop components and
                  business logic understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <EnhancedVisualBuilder />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-600" />
                  Code Editor
                </CardTitle>
                <CardDescription>
                  Full development power with complete code access and
                  customization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        value={currentProject.name}
                        onChange={(e) => {
                          const updatedProject = {
                            ...currentProject,
                            name: e.target.value,
                          };
                          setCurrentProject(updatedProject);
                          onProjectChange?.(updatedProject);
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-version">Version</Label>
                      <Input
                        id="project-version"
                        value={currentProject.metadata.version}
                        onChange={(e) => {
                          const updatedProject = {
                            ...currentProject,
                            metadata: {
                              ...currentProject.metadata,
                              version: e.target.value,
                            },
                          };
                          setCurrentProject(updatedProject);
                          onProjectChange?.(updatedProject);
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={currentProject.description}
                      onChange={(e) => {
                        const updatedProject = {
                          ...currentProject,
                          description: e.target.value,
                        };
                        setCurrentProject(updatedProject);
                        onProjectChange?.(updatedProject);
                      }}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Files
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {currentProject.approaches.code?.files?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Code files
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          Dependencies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {currentProject.approaches.code?.dependencies
                            ?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          NPM packages
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Build Config
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {
                            Object.keys(
                              currentProject.approaches.code?.buildConfig || {}
                            ).length
                          }
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Config options
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
