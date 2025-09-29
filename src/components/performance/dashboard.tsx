"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartSidebar } from "@/components/layout/smart-sidebar";
import { AICopilot, useAICopilot } from "@/components/ui/ai-copilot";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Activity,
  BarChart3,
  RefreshCw,
  Settings,
  Download,
  Plus,
  Lightbulb,
  Brain,
  Award,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Server,
  Smartphone,
  Laptop,
  Globe,
} from "lucide-react";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "excellent" | "good" | "warning" | "poor";
  trend: "up" | "down" | "stable";
  threshold: { good: number; warning: number };
  description: string;
  impact: "high" | "medium" | "low";
}

interface PerformanceInsight {
  id: string;
  type: "optimization" | "success" | "warning" | "opportunity";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  potentialImprovement: string;
  effort: "low" | "medium" | "high";
  roi: number;
}

export default function PerformanceDashboard() {
  const [userLevel, setUserLevel] = useState<
    "beginner" | "intermediate" | "expert"
  >("intermediate");
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      id: "1",
      name: "Largest Contentful Paint",
      value: 1.8,
      unit: "s",
      status: "excellent",
      trend: "down",
      threshold: { good: 2.5, warning: 4.0 },
      description: "Time to render the largest content element",
      impact: "high",
    },
    {
      id: "2",
      name: "First Input Delay",
      value: 85,
      unit: "ms",
      status: "good",
      trend: "down",
      threshold: { good: 100, warning: 300 },
      description: "Time from first user interaction to browser response",
      impact: "high",
    },
    {
      id: "3",
      name: "Cumulative Layout Shift",
      value: 0.08,
      unit: "",
      status: "excellent",
      trend: "stable",
      threshold: { good: 0.1, warning: 0.25 },
      description: "Visual stability of page content",
      impact: "medium",
    },
    {
      id: "4",
      name: "First Contentful Paint",
      value: 1.2,
      unit: "s",
      status: "excellent",
      trend: "down",
      threshold: { good: 1.8, warning: 3.0 },
      description: "Time to first content render",
      impact: "high",
    },
  ]);

  const [insights, setInsights] = useState<PerformanceInsight[]>([
    {
      id: "1",
      type: "success",
      title: "Performance Score Excellent",
      description: "Your site scores 95/100 on Core Web Vitals",
      impact: "high",
      potentialImprovement: "Maintain current optimization level",
      effort: "low",
      roi: 0,
    },
    {
      id: "2",
      type: "optimization",
      title: "Image Optimization Opportunity",
      description: "Optimizing images could improve LCP by 0.3s",
      impact: "medium",
      potentialImprovement: "15% faster page loads",
      effort: "medium",
      roi: 85,
    },
    {
      id: "3",
      type: "warning",
      title: "Bundle Size Growing",
      description: "JavaScript bundle has grown 20% this month",
      impact: "high",
      potentialImprovement: "Code splitting could reduce initial load",
      effort: "high",
      roi: 75,
    },
  ]);

  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: "1",
      type: "proactive" as const,
      title: "Enable CDN for Static Assets",
      description:
        "Serve images and CSS from a global CDN to reduce load times.",
      action: "Configure CDN",
      priority: "high" as const,
      category: "optimization",
    },
    {
      id: "2",
      type: "educational" as const,
      title: "Learn Performance Optimization",
      description:
        "Master advanced techniques for web performance optimization.",
      action: "Start learning",
      priority: "medium" as const,
      category: "education",
    },
  ]);

  const { suggestions, addSuggestion, removeSuggestion } = useAICopilot();

  useEffect(() => {
    // Simulate AI suggestions for performance
    aiSuggestions.forEach((suggestion) => {
      setTimeout(() => addSuggestion(suggestion), 2000);
    });
  }, [addSuggestion]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "poor":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceStatus = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good)
      return { status: "excellent", color: "text-green-600" };
    if (value <= thresholds.warning)
      return { status: "good", color: "text-yellow-600" };
    return { status: "poor", color: "text-red-600" };
  };

  const overallScore = 95; // Calculated from metrics
  const totalImprovement = insights.reduce(
    (sum, insight) => sum + insight.roi,
    0
  );
  const highImpactInsights = insights.filter(
    (insight) => insight.impact === "high"
  ).length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Smart Sidebar */}
      <SmartSidebar
        userLevel={userLevel}
        activeProject="Performance Dashboard"
        className="w-80"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  Performance Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor and optimize application performance
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Performance Status */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">
                  Excellent Performance
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {overallScore}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Performance Score
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {highImpactInsights}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Optimizations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    +{totalImprovement}%
                  </div>
                  <div className="text-xs text-muted-foreground">Potential</div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* AI Insights - Value Demonstration */}
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Performance Intelligence
              </CardTitle>
              <CardDescription>
                I've analyzed your performance data and found optimization
                opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${
                      insight.type === "success"
                        ? "bg-green-50 border-green-200"
                        : insight.type === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : insight.type === "optimization"
                            ? "bg-blue-50 border-blue-200"
                            : "bg-purple-50 border-purple-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {insight.type === "success" && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {insight.type === "warning" && (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        {insight.type === "optimization" && (
                          <Target className="h-4 w-4 text-blue-600" />
                        )}
                        {insight.type === "opportunity" && (
                          <Lightbulb className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-primary">
                            💡 {insight.potentialImprovement}
                          </span>
                          <Badge className={getEffortColor(insight.effort)}>
                            {insight.effort} effort
                          </Badge>
                        </div>
                        {insight.roi > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              ROI
                            </span>
                            <span className="text-xs font-semibold text-green-600">
                              +{insight.roi}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Core Web Vitals - Value Demonstration */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Core Web Vitals
              </CardTitle>
              <CardDescription>
                Google's key metrics for user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.slice(0, 3).map((metric) => {
                  const performanceStatus = getPerformanceStatus(
                    metric.value,
                    metric.threshold
                  );
                  return (
                    <div key={metric.id} className="text-center">
                      <div className="text-3xl font-bold mb-2">
                        <span className={performanceStatus.color}>
                          {metric.value}
                          {metric.unit}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-foreground mb-1">
                        {metric.name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-3">
                        {metric.description}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                        {metric.trend === "up" && (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        )}
                        {metric.trend === "down" && (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        {metric.trend === "stable" && (
                          <Activity className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => {
              const performanceStatus = getPerformanceStatus(
                metric.value,
                metric.threshold
              );
              return (
                <Card
                  key={metric.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-card-foreground">
                      {metric.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {metric.trend === "up" && (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      )}
                      {metric.trend === "down" && (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      {metric.trend === "stable" && (
                        <Activity className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-card-foreground mb-2">
                      {metric.value}
                      {metric.unit}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                      <span
                        className={`text-xs font-medium ${getImpactColor(metric.impact)}`}
                      >
                        {metric.impact} impact
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        (metric.threshold.good / metric.value) * 100
                      )}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Navigation Tabs */}
          <div className="space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Performance Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-6xl font-bold text-primary mb-4">
                          {overallScore}
                        </div>
                        <div className="text-lg font-medium text-foreground mb-2">
                          Overall Score
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">
                          Based on Core Web Vitals and user experience metrics
                        </div>
                        <Progress value={overallScore} className="h-3 mb-4" />
                        <div className="flex items-center justify-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-green-600">
                              95
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Excellent
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-yellow-600">
                              75
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Good
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-red-600">50</div>
                            <div className="text-xs text-muted-foreground">
                              Needs Work
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Optimization Opportunities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Optimization Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {insights
                          .filter((insight) => insight.type === "optimization")
                          .map((insight) => (
                            <div
                              key={insight.id}
                              className="p-3 rounded-lg border bg-blue-50 border-blue-200"
                            >
                              <div className="flex items-start gap-3">
                                <Target className="h-4 w-4 text-blue-600 mt-1" />
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm mb-1">
                                    {insight.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {insight.description}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-primary">
                                      {insight.potentialImprovement}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        className={getEffortColor(
                                          insight.effort
                                        )}
                                      >
                                        {insight.effort}
                                      </Badge>
                                      <span className="text-xs font-semibold text-green-600">
                                        +{insight.roi}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {metrics.map((metric) => (
                    <Card
                      key={metric.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{metric.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                          <span
                            className={`text-xs font-medium ${getImpactColor(metric.impact)}`}
                          >
                            {metric.impact} impact
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary mb-1">
                              {metric.value}
                              {metric.unit}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {metric.description}
                            </div>
                          </div>
                          <Progress
                            value={Math.min(
                              100,
                              (metric.threshold.good / metric.value) * 100
                            )}
                            className="h-2"
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              Target: {metric.threshold.good}
                              {metric.unit}
                            </span>
                            <span>
                              Warning: {metric.threshold.warning}
                              {metric.unit}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="optimizations" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.map((insight) => (
                    <Card
                      key={insight.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {insight.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getEffortColor(insight.effort)}>
                            {insight.effort} effort
                          </Badge>
                          <span
                            className={`text-xs font-medium ${getImpactColor(insight.impact)}`}
                          >
                            {insight.impact} impact
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {insight.description}
                          </p>
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm font-medium text-primary">
                              💡 {insight.potentialImprovement}
                            </p>
                          </div>
                          {insight.roi > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Potential ROI
                              </span>
                              <span className="text-sm font-semibold text-green-600">
                                +{insight.roi}%
                              </span>
                            </div>
                          )}
                          <Button className="w-full" size="sm">
                            <Zap className="h-4 w-4 mr-2" />
                            Apply Optimization
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No reports yet
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Generate performance reports to track optimization
                      progress
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* AI Copilot */}
      <AICopilot
        suggestions={suggestions}
        onSuggestionClick={(suggestion) => {
          console.log("Performance suggestion clicked:", suggestion);
          removeSuggestion(suggestion.id);
        }}
        onDismiss={removeSuggestion}
      />
    </div>
  );
}

export { PerformanceDashboard };
