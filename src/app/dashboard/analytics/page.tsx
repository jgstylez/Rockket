"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartSidebar } from "@/components/layout/smart-sidebar";
import { AICopilot, useAICopilot } from "@/components/ui/ai-copilot";
import {
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Calendar,
  Filter,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Award,
  Sparkles,
  Brain
} from "lucide-react";

export default function AnalyticsPage() {
  const [userLevel, setUserLevel] = useState<"beginner" | "intermediate" | "expert">("beginner");
  const [activeTab, setActiveTab] = useState("overview");
  const [insights, setInsights] = useState([
    {
      id: "1",
      type: "opportunity",
      title: "High Bounce Rate on Homepage",
      description: "67% of visitors leave without exploring further",
      impact: "high",
      suggestion: "Add compelling call-to-action above the fold"
    },
    {
      id: "2", 
      type: "success",
      title: "Mobile Traffic Growing",
      description: "Mobile visits increased 23% this month",
      impact: "positive",
      suggestion: "Consider mobile-first design improvements"
    },
    {
      id: "3",
      type: "warning", 
      title: "Slow Page Load Times",
      description: "Average load time is 4.2s, above recommended 3s",
      impact: "medium",
      suggestion: "Optimize images and enable compression"
    }
  ]);

  const { suggestions, addSuggestion, removeSuggestion } = useAICopilot();

  useEffect(() => {
    // Simulate AI suggestions for analytics
    const analyticsSuggestions = [
      {
        type: "proactive" as const,
        title: "Set up Conversion Tracking",
        description: "Track how many visitors become customers with Google Analytics goals.",
        action: "Set up in 2 clicks",
        priority: "high" as const,
        category: "analytics"
      },
      {
        type: "educational" as const,
        title: "Learn about Cohort Analysis",
        description: "Understand user retention patterns with cohort analysis.",
        action: "Start learning",
        priority: "medium" as const,
        category: "analytics"
      }
    ];

    analyticsSuggestions.forEach(suggestion => {
      setTimeout(() => addSuggestion(suggestion), 3000);
    });
  }, [addSuggestion]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Smart Sidebar */}
      <SmartSidebar 
        userLevel={userLevel}
        activeProject="Analytics Dashboard"
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
                  <BarChart3 className="h-6 w-6 text-primary" />
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Understand your users and optimize performance
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1,234</div>
                  <div className="text-xs text-muted-foreground">Visitors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+12%</div>
                  <div className="text-xs text-muted-foreground">Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2.3s</div>
                  <div className="text-xs text-muted-foreground">Load Time</div>
                </div>
              </div>

              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* AI Insights - Contextual Intelligence */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Insights
              </CardTitle>
              <CardDescription>
                I've analyzed your data and found some key opportunities
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
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {insight.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {insight.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                        {insight.type === "opportunity" && <Target className="h-4 w-4 text-red-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        <p className="text-xs font-medium text-primary">
                          💡 {insight.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics - Value Demonstration */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Total Visitors
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">1,234</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Conversion Rate
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">3.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+0.5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">$2,456</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+18%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Bounce Rate
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">67%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">+3%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Traffic Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Traffic Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Page Views</span>
                          <span className="font-semibold">2,456</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Unique Visitors</span>
                          <span className="font-semibold">1,234</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Avg. Session Duration</span>
                          <span className="font-semibold">2m 34s</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Traffic is up 12% this week
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Pages */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        Top Pages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { page: "/", views: 456, change: "+12%" },
                          { page: "/products", views: 234, change: "+8%" },
                          { page: "/about", views: 123, change: "-2%" },
                          { page: "/contact", views: 89, change: "+15%" }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{item.page}</p>
                              <p className="text-xs text-muted-foreground">{item.views} views</p>
                            </div>
                            <Badge variant={item.change.startsWith('+') ? "default" : "secondary"}>
                              {item.change}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="dashboards" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="col-span-full">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No dashboards yet</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Create your first dashboard to start tracking your metrics
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="col-span-full">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Download className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Generate your first report to analyze your data
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* AI Copilot */}
      <AICopilot
        suggestions={suggestions}
        onSuggestionClick={(suggestion) => {
          console.log("Analytics suggestion clicked:", suggestion);
          removeSuggestion(suggestion.id);
        }}
        onDismiss={removeSuggestion}
      />
    </div>
  );
}