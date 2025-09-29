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
  Shield,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  Key,
  User,
  Server,
  Database,
  Globe,
  Smartphone,
  Laptop,
  Wifi,
  Download,
  Upload,
  Settings,
  RefreshCw,
  Plus,
  Target,
  Lightbulb,
  Brain,
  Award,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Filter,
} from "lucide-react";

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  status: "excellent" | "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  description: string;
  recommendation?: string;
}

interface SecurityAlert {
  id: string;
  type: "threat" | "vulnerability" | "compliance" | "info";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  source: string;
}

interface SecurityScore {
  overall: number;
  authentication: number;
  encryption: number;
  network: number;
  compliance: number;
}

export default function SecurityDashboard() {
  const [userLevel, setUserLevel] = useState<
    "beginner" | "intermediate" | "expert"
  >("intermediate");
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [securityScore, setSecurityScore] = useState<SecurityScore>({
    overall: 87,
    authentication: 92,
    encryption: 85,
    network: 90,
    compliance: 88,
  });

  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    {
      id: "1",
      name: "SSL/TLS Score",
      value: 95,
      status: "excellent",
      trend: "up",
      description: "Your SSL/TLS configuration is excellent",
      recommendation: "Maintain current configuration",
    },
    {
      id: "2",
      name: "Password Strength",
      value: 78,
      status: "good",
      trend: "up",
      description: "Password policies are well implemented",
      recommendation: "Consider implementing 2FA for additional security",
    },
    {
      id: "3",
      name: "Firewall Protection",
      value: 92,
      status: "excellent",
      trend: "stable",
      description: "Firewall rules are properly configured",
      recommendation: "Regular rule audits recommended",
    },
    {
      id: "4",
      name: "Data Encryption",
      value: 88,
      status: "good",
      trend: "up",
      description: "Data encryption is properly implemented",
      recommendation: "Consider upgrading to AES-256 for sensitive data",
    },
  ]);

  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: "1",
      type: "vulnerability",
      severity: "medium",
      title: "Outdated Dependencies Detected",
      description: "3 packages have known security vulnerabilities",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: false,
      source: "Dependency Scanner",
    },
    {
      id: "2",
      type: "threat",
      severity: "low",
      title: "Suspicious Login Attempt",
      description: "Multiple failed login attempts from IP 192.168.1.100",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      resolved: true,
      source: "Authentication Monitor",
    },
    {
      id: "3",
      type: "compliance",
      severity: "high",
      title: "GDPR Compliance Check",
      description: "Data retention policies need review for GDPR compliance",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      resolved: false,
      source: "Compliance Scanner",
    },
  ]);

  const [insights, setInsights] = useState([
    {
      id: "1",
      type: "success",
      title: "Security Score Excellent",
      description:
        "Your overall security score of 87% is above industry average",
      impact: "positive",
      suggestion: "Continue current security practices",
    },
    {
      id: "2",
      type: "warning",
      title: "Dependency Updates Needed",
      description: "3 packages have known vulnerabilities that need updating",
      impact: "medium",
      suggestion: "Update packages to latest secure versions",
    },
    {
      id: "3",
      type: "opportunity",
      title: "Enhance Authentication",
      description: "Implementing 2FA could improve your security score by 5%",
      impact: "high",
      suggestion: "Enable two-factor authentication for all users",
    },
  ]);

  const { suggestions, addSuggestion, removeSuggestion } = useAICopilot();

  useEffect(() => {
    // Simulate AI suggestions for security
    const securitySuggestions = [
      {
        type: "proactive" as const,
        title: "Enable Automated Security Scanning",
        description:
          "Set up continuous security monitoring to catch threats early.",
        action: "Configure scanning",
        priority: "high" as const,
        category: "automation",
      },
      {
        type: "educational" as const,
        title: "Learn Security Best Practices",
        description: "Master modern security techniques and threat prevention.",
        action: "Start learning",
        priority: "medium" as const,
        category: "education",
      },
    ];

    securitySuggestions.forEach((suggestion) => {
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
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "threat":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "vulnerability":
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case "compliance":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "info":
        return <Activity className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Smart Sidebar */}
      <SmartSidebar
        userLevel={userLevel}
        activeProject="Security Dashboard"
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
                  <Shield className="h-6 w-6 text-primary" />
                  Security Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor and manage security vulnerabilities
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Security Status */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">
                  Secure
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {securityScore.overall}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Security Score
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {alerts.filter((a) => a.resolved).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {alerts.filter((a) => !a.resolved).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Active</div>
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
          {/* AI Insights - Confidence Building */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-600" />
                Security Intelligence
              </CardTitle>
              <CardDescription>
                I've analyzed your security posture and found key insights
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
                        {insight.type === "success" && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {insight.type === "warning" && (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        {insight.type === "opportunity" && (
                          <Target className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">
                          {insight.title}
                        </h4>
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

          {/* Security Score - Confidence Building */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Security Score Breakdown
              </CardTitle>
              <CardDescription>
                Your comprehensive security assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {securityScore.overall}%
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Overall Score
                  </div>
                  <Progress
                    value={securityScore.overall}
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {securityScore.authentication}%
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Authentication
                  </div>
                  <Progress
                    value={securityScore.authentication}
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {securityScore.encryption}%
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Encryption
                  </div>
                  <Progress
                    value={securityScore.encryption}
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {securityScore.network}%
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Network
                  </div>
                  <Progress
                    value={securityScore.network}
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {securityScore.compliance}%
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Compliance
                  </div>
                  <Progress
                    value={securityScore.compliance}
                    className="h-2 mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
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
                    {metric.value}%
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {metric.description}
                    </span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                  {metric.recommendation && (
                    <p className="text-xs text-primary mt-2">
                      💡 {metric.recommendation}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
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
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="vulnerabilities">
                  Vulnerabilities
                </TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Alerts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                        Recent Security Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {alerts.slice(0, 3).map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-start gap-3 p-3 rounded-lg border"
                          >
                            <div className="flex-shrink-0 mt-1">
                              {getTypeIcon(alert.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-sm">
                                  {alert.title}
                                </h4>
                                <Badge
                                  className={getSeverityColor(alert.severity)}
                                >
                                  {alert.severity}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {alert.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {alert.timestamp.toLocaleTimeString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {alert.source}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Security Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-foreground">
                              SSL/TLS
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                              Secure
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-foreground">
                              Encryption
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                              Enabled
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-foreground">
                              Firewall
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-600">
                              Review Needed
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-foreground">
                              Authentication
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                              Strong
                            </span>
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
                    <Card
                      key={alert.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{alert.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={getSeverityColor(alert.severity)}
                                >
                                  {alert.severity}
                                </Badge>
                                <Badge
                                  variant={
                                    alert.resolved ? "default" : "secondary"
                                  }
                                >
                                  {alert.resolved ? "Resolved" : "Active"}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {alert.description}
                            </p>
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

              <TabsContent value="vulnerabilities" className="space-y-4">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No vulnerabilities found
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Your system is secure! Regular scans help maintain this
                      status.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Run Security Scan
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Compliance Dashboard
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Track your compliance with security standards and
                      regulations
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Check Compliance
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
          console.log("Security suggestion clicked:", suggestion);
          removeSuggestion(suggestion.id);
        }}
        onDismiss={removeSuggestion}
      />
    </div>
  );
}

export { SecurityDashboard };
