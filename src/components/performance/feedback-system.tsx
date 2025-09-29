"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  Save,
  Upload,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  Database,
  Cpu,
  MemoryStick,
  Image,
  HardDrive,
  Activity,
  Gauge,
  Target,
  ArrowRight,
  RefreshCw,
  Play,
  Pause,
  Square,
} from "lucide-react";

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: "excellent" | "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  description: string;
}

interface PerformanceFeedbackProps {
  onOptimize?: (metric: string) => void;
  onDeploy?: () => void;
}

export function PerformanceFeedback({
  onOptimize,
  onDeploy,
}: PerformanceFeedbackProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deployStatus, setDeployStatus] = useState<
    "idle" | "deploying" | "deployed"
  >("idle");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );

  useEffect(() => {
    // Simulate loading metrics
    setIsLoading(true);
    setTimeout(() => {
      setMetrics([
        {
          name: "Page Load Speed",
          value: 1.2,
          target: 2.0,
          unit: "s",
          status: "excellent",
          trend: "up",
          description: "Your site loads faster than 90% of websites",
        },
        {
          name: "Core Web Vitals",
          value: 95,
          target: 90,
          unit: "%",
          status: "excellent",
          trend: "stable",
          description: "All Core Web Vitals are in the green zone",
        },
        {
          name: "Mobile Performance",
          value: 88,
          target: 85,
          unit: "%",
          status: "good",
          trend: "up",
          description: "Good mobile experience, room for improvement",
        },
        {
          name: "SEO Score",
          value: 92,
          target: 80,
          unit: "%",
          status: "excellent",
          trend: "up",
          description: "Excellent SEO optimization",
        },
        {
          name: "Accessibility",
          value: 78,
          target: 90,
          unit: "%",
          status: "warning",
          trend: "down",
          description: "Some accessibility issues need attention",
        },
        {
          name: "Security Score",
          value: 85,
          target: 90,
          unit: "%",
          status: "good",
          trend: "stable",
          description: "Good security practices in place",
        },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleDeploy = async () => {
    setDeployStatus("deploying");
    // Simulate deployment
    setTimeout(() => {
      setDeployStatus("deployed");
      onDeploy?.();
    }, 3000);
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    // Simulate save
    setTimeout(() => {
      setSaveStatus("saved");
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-100 border-green-200";
      case "good":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "warning":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case "stable":
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="font-semibold mb-2">Analyzing Performance...</h3>
            <p className="text-sm text-muted-foreground">
              Checking your site's speed, accessibility, and optimization
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            Performance Overview
          </CardTitle>
          <CardDescription>
            Real-time performance metrics and optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Zap className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">1.2s</div>
              <div className="text-xs text-green-700">Load Time</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-xs text-blue-700">Core Vitals</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Smartphone className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">88%</div>
              <div className="text-xs text-purple-700">Mobile</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">92%</div>
              <div className="text-xs text-orange-700">SEO</div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">All Changes Saved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Live Preview Active</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSave}
                disabled={saveStatus === "saving"}
              >
                {saveStatus === "saving" ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saveStatus === "saving" ? "Saving..." : "Saved"}
              </Button>
              <Button
                size="sm"
                onClick={handleDeploy}
                disabled={deployStatus === "deploying"}
              >
                {deployStatus === "deploying" ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {deployStatus === "deploying" ? "Deploying..." : "Deploy"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">{metric.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Current</span>
                  <span className="font-medium">
                    {metric.value}
                    {metric.unit}
                  </span>
                </div>
                <Progress
                  value={(metric.value / metric.target) * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Target: {metric.target}
                  {metric.unit}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                {metric.description}
              </p>

              {metric.status === "warning" || metric.status === "critical" ? (
                <Button size="sm" variant="outline" className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Optimize {metric.name}
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Performing well</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Real-time Activity
          </CardTitle>
          <CardDescription>
            Live updates on your site's performance and user activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Site is live and performing well
                </p>
                <p className="text-xs text-muted-foreground">
                  Last checked 2 minutes ago
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Globe className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  3 users currently browsing
                </p>
                <p className="text-xs text-muted-foreground">
                  Peak traffic: 12 users/hour
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Active</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Database className="h-4 w-4 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Database queries optimized
                </p>
                <p className="text-xs text-muted-foreground">
                  Average response time: 45ms
                </p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Optimized</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            AI Optimization Suggestions
          </CardTitle>
          <CardDescription>
            Smart recommendations to improve your site's performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <Image className="h-4 w-4 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">Optimize Images</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Compress 3 large images to improve load time by ~0.5s
                </p>
                <Button size="sm" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Auto-optimize
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <Cpu className="h-4 w-4 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">Enable Caching</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Set up browser caching to reduce server load
                </p>
                <Button size="sm" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
