"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Zap,
  Database,
  Image,
  Code,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Settings,
} from "lucide-react";

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  bundleSize: number;
  memoryUsage: number;
  cacheHitRate: number;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: 1.2,
    fid: 45,
    cls: 0.05,
    fcp: 0.8,
    ttfb: 120,
    bundleSize: 245,
    memoryUsage: 65,
    cacheHitRate: 85,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPerformanceMetrics();
  }, []);

  const loadPerformanceMetrics = async () => {
    try {
      setLoading(true);
      
      // Simulate loading performance metrics
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would load from the performance monitor
      setMetrics({
        lcp: 1.2 + Math.random() * 0.5,
        fid: 45 + Math.random() * 20,
        cls: 0.05 + Math.random() * 0.02,
        fcp: 0.8 + Math.random() * 0.3,
        ttfb: 120 + Math.random() * 50,
        bundleSize: 245 + Math.random() * 50,
        memoryUsage: 65 + Math.random() * 10,
        cacheHitRate: 85 + Math.random() * 10,
      });
    } catch (error) {
      console.error("Failed to load performance metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPerformanceMetrics();
    setRefreshing(false);
  };

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return { status: "good", color: "text-green-600" };
    if (value <= thresholds.warning) return { status: "warning", color: "text-yellow-600" };
    return { status: "poor", color: "text-red-600" };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "poor":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge className="bg-green-100 text-green-800">Good</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "poor":
        return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading performance metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="text-gray-600">Monitor and optimize application performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LCP</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.lcp.toFixed(2)}s</div>
            <p className="text-xs text-muted-foreground">
              Largest Contentful Paint
            </p>
            <div className="mt-2">
              {getStatusBadge(
                getPerformanceStatus(metrics.lcp, { good: 2.5, warning: 4.0 }).status
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FID</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.fid.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">
              First Input Delay
            </p>
            <div className="mt-2">
              {getStatusBadge(
                getPerformanceStatus(metrics.fid, { good: 100, warning: 300 }).status
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CLS</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cls.toFixed(3)}</div>
            <p className="text-xs text-muted-foreground">
              Cumulative Layout Shift
            </p>
            <div className="mt-2">
              {getStatusBadge(
                getPerformanceStatus(metrics.cls, { good: 0.1, warning: 0.25 }).status
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FCP</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.fcp.toFixed(2)}s</div>
            <p className="text-xs text-muted-foreground">
              First Contentful Paint
            </p>
            <div className="mt-2">
              {getStatusBadge(
                getPerformanceStatus(metrics.fcp, { good: 1.8, warning: 3.0 }).status
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="caching">Caching</TabsTrigger>
          <TabsTrigger value="bundle">Bundle</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
                    <span className="text-green-600">45ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connection Pool</span>
                    <span>15/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Hit Rate</span>
                    <span className="text-green-600">{metrics.cacheHitRate.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Bundle Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Size</span>
                    <span>{metrics.bundleSize.toFixed(0)}KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>JavaScript</span>
                    <span>180KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CSS</span>
                    <span>65KB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Heap Size</span>
                    <span>{metrics.memoryUsage.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Used</span>
                    <span>45MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available</span>
                    <span>25MB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="caching" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cache Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Hit Rate</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-600">{metrics.cacheHitRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(metrics.cacheHitRate, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Target: &gt; 80% | Current: {metrics.cacheHitRate.toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Keys</span>
                    <span>1,245</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Used</span>
                    <span>45MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expired Keys</span>
                    <span>23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bundle" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bundle Size Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Bundle Size</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-600">{metrics.bundleSize.toFixed(0)}KB</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((metrics.bundleSize / 500) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Target: &lt; 500KB | Current: {metrics.bundleSize.toFixed(0)}KB
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bundle Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>JavaScript</span>
                    <span>180KB (73%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CSS</span>
                    <span>65KB (27%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Images</span>
                    <span>0KB (0%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Query Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Query Time</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-600">45ms</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(45 / 100) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Target: &lt; 100ms | Current: 45ms
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Connections</span>
                    <span>15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idle Connections</span>
                    <span>5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Connections</span>
                    <span>20</span>
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
