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
  Server,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Target,
  Lightbulb,
  Brain,
  Plus,
  RefreshCw,
  Settings,
  Download,
  Eye,
  AlertCircle,
  Filter,
  FileText,
  Wifi,
  Database,
  Cpu,
  HardDrive
} from "lucide-react";

interface MonitoringData {
  uptime: number;
  responseTime: number;
  activeUsers: number;
  newUsers: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  throughput: number;
}

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  severity: number;
}

interface Prediction {
  id: string;
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
  recommendation: string;
}

export default function MonitoringDashboard() {
  const [userLevel, setUserLevel] = useState<"beginner" | "intermediate" | "expert">("intermediate");
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<MonitoringData>({
    uptime: 99.9,
    responseTime: 245,
    activeUsers: 1234,
    newUsers: 45,
    errorRate: 0.2,
    cpuUsage: 65,
    memoryUsage: 78,
    diskUsage: 45,
    networkLatency: 12,
    throughput: 1250
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "High CPU Usage",
      description: "CPU usage has been above 80% for the last 15 minutes",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      resolved: false,
      severity: 7
    },
    {
      id: "2",
      type: "info",
      title: "Scheduled Maintenance",
      description: "Database maintenance completed successfully",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: true,
      severity: 3
    }
  ]);

  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: "1",
      metric: "CPU Usage",
      current: 65,
      predicted: 78,
      confidence: 85,
      timeframe: "Next 2 hours",
      recommendation: "Consider scaling up resources"
    },
    {
      id: "2",
      metric: "Memory Usage",
      current: 78,
      predicted: 85,
      confidence: 92,
      timeframe: "Next 4 hours",
      recommendation: "Monitor memory leaks and optimize"
    },
    {
      id: "3",
      metric: "Active Users",
      current: 1234,
      predicted: 1456,
      confidence: 78,
      timeframe: "Next 24 hours",
      recommendation: "Prepare for increased load"
    }
  ]);

  const [insights, setInsights] = useState([
    {
      id: "1",
      type: "success",
      title: "System Performance Excellent",
      description: "All systems are running smoothly with optimal performance",
      impact: "positive",
      suggestion: "Continue current monitoring practices"
    },
    {
      id: "2",
      type: "warning",
      title: "Memory Usage Trending Up",
      description: "Memory usage has increased 15% over the last week",
      impact: "medium",
      suggestion: "Investigate potential memory leaks"
    },
    {
      id: "3",
      type: "opportunity",
      title: "Optimization Opportunity",
      description: "Database queries could be optimized to improve response time",
      impact: "high",
      suggestion: "Review and optimize slow queries"
    }
  ]);

  const { suggestions, addSuggestion, removeSuggestion } = useAICopilot();

  useEffect(() => {
    // Simulate AI suggestions for monitoring
    const monitoringSuggestions = [
      {
        type: "proactive" as const,
        title: "Set up Automated Alerts",
        description: "Configure smart alerts to prevent downtime before it happens.",
        action: "Configure alerts",
        priority: "high" as const,
        category: "automation"
      },
      {
        type: "educational" as const,
        title: "Learn about Performance Optimization",
        description: "Master techniques for optimizing system performance.",
        action: "Start learning",
        priority: "medium" as const,
        category: "optimization"
      }
    ];

    monitoringSuggestions.forEach(suggestion => {
      setTimeout(() => addSuggestion(suggestion), 3000);
    });
  }, [addSuggestion]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMetricStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return { status: "good", color: "text-green-600" };
    if (value <= thresholds.warning) return { status: "warning", color: "text-yellow-600" };
    return { status: "critical", color: "text-red-600" };
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Smart Sidebar */}
      <SmartSidebar 
        userLevel={userLevel}
        activeProject="Monitoring Dashboard"
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
                  <Activity className="h-6 w-6 text-primary" />
                  Monitoring Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time system and business metrics
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* System Status */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">All Systems Operational</span>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{data.uptime}%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{data.responseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{data.activeUsers}</div>
                  <div className="text-xs text-muted-foreground">Users</div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* AI Insights - Predictive Interface */}
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Predictive Intelligence
              </CardTitle>
              <CardDescription>
                I've analyzed your system patterns and predicted future behavior
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
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {insight.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {insight.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                        {insight.type === "opportunity" && <Target className="h-4 w-4 text-blue-600" />}
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

          {/* Key Metrics - Predictive Interface */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Uptime</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{data.uptime}%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
                <div className="mt-2">
                  <Progress value={data.uptime} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{data.responseTime}ms</div>
                <p className="text-xs text-muted-foreground">Average API response</p>
                <div className="mt-2">
                  <Progress value={Math.max(0, 100 - (data.responseTime / 5))} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {data.activeUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{data.newUsers} new today
                </p>
                <div className="mt-2">
                  <Progress value={Math.min(100, (data.activeUsers / 2000) * 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{data.errorRate}%</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
                <div className="mt-2">
                  <Progress value={data.errorRate * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current</span>
                    <span className="font-semibold">{data.cpuUsage}%</span>
                  </div>
                  <Progress value={data.cpuUsage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current</span>
                    <span className="font-semibold">{data.memoryUsage}%</span>
                  </div>
                  <Progress value={data.memoryUsage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current</span>
                    <span className="font-semibold">{data.diskUsage}%</span>
                  </div>
                  <Progress value={data.diskUsage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Alerts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        Recent Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {alerts.slice(0, 3).map((alert) => (
                          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                            <div className="flex-shrink-0 mt-1">
                              {alert.type === "critical" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                              {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                              {alert.type === "info" && <CheckCircle className="h-4 w-4 text-blue-500" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{alert.title}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {alert.timestamp.toLocaleTimeString()}
                                </span>
                                <Badge className={getStatusColor(alert.type)}>
                                  {alert.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Health */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Database</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-600">Healthy</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">API Gateway</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-600">Healthy</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Cache</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm font-medium text-yellow-600">Warning</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">CDN</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-600">Healthy</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search alerts..."
                        className="pl-4 pr-4 py-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </div>

                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <Card key={alert.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {alert.type === "critical" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                            {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                            {alert.type === "info" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{alert.title}</h3>
                              <Badge className={getStatusColor(alert.type)}>
                                {alert.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {alert.timestamp.toLocaleString()}
                              </span>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {predictions.map((prediction) => (
                    <Card key={prediction.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{prediction.metric}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {prediction.confidence}% confidence
                          </Badge>
                          <span className="text-xs text-muted-foreground">{prediction.timeframe}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Current</span>
                            <span className="font-semibold">{prediction.current}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Predicted</span>
                            <span className="font-semibold text-primary">{prediction.predicted}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Current</span>
                              <span>Predicted</span>
                            </div>
                            <div className="flex gap-2">
                              <Progress value={prediction.current} className="flex-1 h-2" />
                              <Progress value={prediction.predicted} className="flex-1 h-2" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{prediction.recommendation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="logs" className="space-y-4">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No logs available</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      System logs will appear here when available
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Enable Logging
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
          console.log("Monitoring suggestion clicked:", suggestion);
          removeSuggestion(suggestion.id);
        }}
        onDismiss={removeSuggestion}
      />
    </div>
  );
}

export { MonitoringDashboard };