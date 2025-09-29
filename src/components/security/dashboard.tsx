"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Key,
  Database,
  Network,
  FileText,
  BarChart3,
  RefreshCw,
  Download,
  Settings,
  Zap,
  Bug,
  Search,
  Activity,
} from "lucide-react";

interface SecurityMetrics {
  overallScore: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface SecurityTest {
  id: string;
  name: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: "passed" | "failed" | "warning" | "skipped";
  description: string;
  recommendation: string;
  evidence?: string;
  cwe?: string;
  owasp?: string;
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    overallScore: 85,
    criticalIssues: 2,
    highIssues: 5,
    mediumIssues: 8,
    lowIssues: 3,
    totalTests: 45,
    passedTests: 35,
    failedTests: 10,
    riskLevel: "MEDIUM",
  });

  const [tests, setTests] = useState<SecurityTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Simulate loading security data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock security test data
      const mockTests: SecurityTest[] = [
        {
          id: "1",
          name: "SQL Injection Test",
          category: "Input Validation",
          severity: "critical",
          status: "failed",
          description: "Tested for SQL injection vulnerabilities",
          recommendation:
            "Implement parameterized queries and input validation",
          evidence: "SQL injection payload executed successfully",
          cwe: "CWE-89",
          owasp: "A03:2021 – Injection",
        },
        {
          id: "2",
          name: "XSS Protection Test",
          category: "Input Validation",
          severity: "high",
          status: "passed",
          description: "Tested for Cross-Site Scripting vulnerabilities",
          recommendation: "XSS protection is working correctly",
          cwe: "CWE-79",
          owasp: "A03:2021 – Injection",
        },
        {
          id: "3",
          name: "Authentication Bypass",
          category: "Authentication",
          severity: "critical",
          status: "failed",
          description: "Tested for authentication bypass vulnerabilities",
          recommendation: "Implement proper authentication mechanisms",
          evidence: "Authentication bypass successful",
          cwe: "CWE-287",
          owasp: "A07:2021 – Identification and Authentication Failures",
        },
        {
          id: "4",
          name: "Session Management",
          category: "Session Management",
          severity: "medium",
          status: "passed",
          description: "Tested session management implementation",
          recommendation: "Session management is properly implemented",
          cwe: "CWE-613",
        },
        {
          id: "5",
          name: "Password Policy",
          category: "Authentication",
          severity: "medium",
          status: "warning",
          description: "Tested password policy enforcement",
          recommendation: "Strengthen password policy requirements",
          cwe: "CWE-521",
        },
      ];

      setTests(mockTests);
    } catch (error) {
      console.error("Failed to load security data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSecurityData();
    setRefreshing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-blue-600 bg-blue-100";
      case "info":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "skipped":
        return <Eye className="h-4 w-4 text-gray-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "text-red-600 bg-red-100";
      case "HIGH":
        return "text-orange-600 bg-orange-100";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100";
      case "LOW":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading security data...</p>
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
            Security Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage security vulnerabilities
          </p>
        </div>
        <div className="flex items-center space-x-2">
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Security Score
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overallScore}%</div>
            <p className="text-xs text-muted-foreground">
              Overall security score
            </p>
            <div className="mt-2">
              <Progress value={metrics.overallScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge className={getRiskLevelColor(metrics.riskLevel)}>
                {metrics.riskLevel}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Current risk assessment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Issues
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics.criticalIssues}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical vulnerabilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.passedTests}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {metrics.totalTests} tests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Tests */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="tests">Security Tests</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Authentication</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-600">85%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Input Validation</span>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-yellow-600">70%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Session Management</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-600">90%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Vulnerability Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-red-600">Critical</span>
                    <span>{metrics.criticalIssues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-600">High</span>
                    <span>{metrics.highIssues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Medium</span>
                    <span>{metrics.mediumIssues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Low</span>
                    <span>{metrics.lowIssues}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">
                      SQL injection attempt blocked
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Rate limit exceeded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Security scan completed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <div className="space-y-4">
            {tests
              .filter((test) => test.status === "failed")
              .map((test) => (
                <Card key={test.id} className="border-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {test.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {test.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(test.severity)}>
                          {test.severity.toUpperCase()}
                        </Badge>
                        {test.cwe && (
                          <Badge variant="outline" className="text-xs">
                            {test.cwe}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-1">
                          Recommendation
                        </h4>
                        <p className="text-sm text-gray-600">
                          {test.recommendation}
                        </p>
                      </div>

                      {test.evidence && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 mb-1">
                            Evidence
                          </h4>
                          <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                            {test.evidence}
                          </p>
                        </div>
                      )}

                      {test.owasp && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 mb-1">
                            OWASP Reference
                          </h4>
                          <p className="text-sm text-gray-600">{test.owasp}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <div className="space-y-4">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {test.name}
                        </h3>
                        <p className="text-sm text-gray-600">{test.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(test.severity)}>
                        {test.severity.toUpperCase()}
                      </Badge>
                      <Badge
                        variant={
                          test.status === "passed" ? "default" : "destructive"
                        }
                      >
                        {test.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{test.description}</p>
                    <p className="text-sm text-gray-600">
                      {test.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Immediate Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">
                      Fix critical SQL injection vulnerabilities
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">
                      Implement authentication bypass protection
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Strengthen password policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Implement comprehensive input validation
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Add rate limiting to all endpoints
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Enable security headers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Implement proper error handling
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
