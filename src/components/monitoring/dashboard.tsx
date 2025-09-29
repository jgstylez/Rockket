"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Server,
  Users,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
} from "lucide-react";

interface MonitoringData {
  // System metrics
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;

  // User metrics
  activeUsers: number;
  newUsers: number;
  userGrowth: number;

  // Business metrics
  aiGenerations: number;
  visualBuilderUsage: number;
  contentCreated: number;
  revenue: number;

  // Performance metrics
  pageLoadTime: number;
  apiResponseTime: number;
  databaseQueryTime: number;

  // Error metrics
  totalErrors: number;
  criticalErrors: number;
  resolvedErrors: number;
}

interface Alert {
  id: string;
  type: "error" | "warning" | "info";
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData>({
    uptime: 99.9,
    responseTime: 150,
    errorRate: 0.5,
    throughput: 1250,
    activeUsers: 1250,
    newUsers: 45,
    userGrowth: 12.5,
    aiGenerations: 89,
    visualBuilderUsage: 156,
    contentCreated: 234,
    revenue: 12500,
    pageLoadTime: 1.2,
    apiResponseTime: 150,
    databaseQueryTime: 25,
    totalErrors: 12,
    criticalErrors: 2,
    resolvedErrors: 10,
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "error",
      message: "High error rate detected on /api/ai/generate",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      resolved: false,
    },
    {
      id: "2",
      type: "warning",
      message: "Database connection pool near capacity",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      resolved: false,
    },
    {
      id: "3",
      type: "info",
      message: "Scheduled maintenance completed",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: true,
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading monitoring data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good) return "text-green-600";
    if (value <= thresholds.warning) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good)
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (value <= thresholds.warning)
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Monitoring Dashboard
          </h1>
          <p className="text-gray-600">Real-time system and business metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            System Healthy
          </Badge>
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.uptime}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Average API response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.activeUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{data.newUsers} new today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.errorRate}%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Database Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Query Time</span>
                    <span
                      className={getStatusColor(data.databaseQueryTime, {
                        good: 50,
                        warning: 100,
                      })}
                    >
                      {data.databaseQueryTime}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connections</span>
                    <span>45/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Hit Rate</span>
                    <span className="text-green-600">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  API Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span
                      className={getStatusColor(data.apiResponseTime, {
                        good: 200,
                        warning: 500,
                      })}
                    >
                      {data.apiResponseTime}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput</span>
                    <span>{data.throughput.toLocaleString()}/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="text-green-600">99.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>CPU Usage</span>
                    <div className="flex items-center">
                      {getStatusIcon(45, { good: 70, warning: 85 })}
                      <span className="ml-2">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Memory Usage</span>
                    <div className="flex items-center">
                      {getStatusIcon(62, { good: 80, warning: 90 })}
                      <span className="ml-2">62%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Disk Usage</span>
                    <div className="flex items-center">
                      {getStatusIcon(38, { good: 80, warning: 90 })}
                      <span className="ml-2">38%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{data.userGrowth}%</div>
                  <p className="text-sm text-muted-foreground">
                    Growth rate this month
                  </p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+{data.newUsers} new users</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Feature Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>AI Generations</span>
                    <span>{data.aiGenerations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visual Builder</span>
                    <span>{data.visualBuilderUsage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Content Created</span>
                    <span>{data.contentCreated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    ${data.revenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">This month</p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+15.2% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Load Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Load Time</span>
                    <span
                      className={getStatusColor(data.pageLoadTime, {
                        good: 2,
                        warning: 3,
                      })}
                    >
                      {data.pageLoadTime}s
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((data.pageLoadTime / 3) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Target: &lt; 2s | Current: {data.pageLoadTime}s
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Response</span>
                    <span
                      className={getStatusColor(data.apiResponseTime, {
                        good: 200,
                        warning: 500,
                      })}
                    >
                      {data.apiResponseTime}ms
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((data.apiResponseTime / 500) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Target: &lt; 200ms | Current: {data.apiResponseTime}ms
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card
                key={alert.id}
                className={alert.resolved ? "opacity-60" : ""}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {alert.type === "error" && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      {alert.type === "warning" && (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                      {alert.type === "info" && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {alert.resolved ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Resolved
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-red-600 border-red-600"
                        >
                          Active
                        </Badge>
                      )}
                      {!alert.resolved && (
                        <Button size="sm" variant="outline">
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
