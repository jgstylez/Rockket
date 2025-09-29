"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

interface AnalyticsDashboard {
  id: string;
  name: string;
  description?: string;
  widgets: any[];
  isPublic: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

interface AnalyticsReport {
  id: string;
  name: string;
  description?: string;
  type: string;
  filters: any;
  metrics: any[];
  schedule: any;
  isActive: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  runs: Array<{
    id: string;
    status: string;
    startedAt: string;
    completedAt?: string;
  }>;
}

interface RevenueData {
  total: number;
  monthly: number;
  metrics: Array<{
    id: string;
    date: string;
    revenue: number;
    currency: string;
    source: string;
  }>;
}

interface EngagementData {
  uniqueUsers: number;
  totalEvents: number;
  eventCounts: Record<string, number>;
  metrics: Array<{
    id: string;
    userId: string;
    event: string;
    properties: any;
    timestamp: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

export default function AnalyticsPage() {
  const [dashboards, setDashboards] = useState<AnalyticsDashboard[]>([]);
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData>({
    total: 0,
    monthly: 0,
    metrics: [],
  });
  const [engagementData, setEngagementData] = useState<EngagementData>({
    uniqueUsers: 0,
    totalEvents: 0,
    eventCounts: {},
    metrics: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [dashboardsRes, reportsRes, metricsRes] = await Promise.all([
        fetch("/api/analytics/dashboards?tenantId=demo-tenant"),
        fetch("/api/analytics/reports?tenantId=demo-tenant"),
        fetch("/api/analytics/metrics?tenantId=demo-tenant"),
      ]);

      const dashboardsData = await dashboardsRes.json();
      const reportsData = await reportsRes.json();
      const metricsData = await metricsRes.json();

      setDashboards(dashboardsData.dashboards || []);
      setReports(reportsData.reports || []);
      setRevenueData(
        metricsData.revenue || { total: 0, monthly: 0, metrics: [] }
      );
      setEngagementData(
        metricsData.engagement || {
          uniqueUsers: 0,
          totalEvents: 0,
          eventCounts: {},
          metrics: [],
        }
      );
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <TrendingUp className="h-4 w-4" />;
      case "running":
        return <Activity className="h-4 w-4" />;
      case "pending":
        return <Calendar className="h-4 w-4" />;
      case "failed":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const stats = {
    totalDashboards: dashboards.length,
    totalReports: reports.length,
    totalRevenue: revenueData.total,
    monthlyRevenue: revenueData.monthly,
    uniqueUsers: engagementData.uniqueUsers,
    totalEvents: engagementData.totalEvents,
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Analytics</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Dashboard
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-4 border-b border-gray-200">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading...</p>
            </div>
          ) : activeTab === "dashboards" ? (
            <div className="space-y-2">
              {dashboards.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">No dashboards found</p>
                </div>
              ) : (
                dashboards.map((dashboard) => (
                  <Card
                    key={dashboard.id}
                    className="cursor-pointer hover:border-gray-300"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {dashboard.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {dashboard.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <span className="mr-2">
                              {dashboard.widgets.length} widgets
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dashboard.isPublic ? "completed" : "pending")}`}
                            >
                              {dashboard.isPublic ? "Public" : "Private"}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((report) => (
                <Card
                  key={report.id}
                  className="cursor-pointer hover:border-gray-300"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {report.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {report.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.isActive ? "completed" : "pending")}`}
                          >
                            {report.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="ml-2">{report.type}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Stats */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500">
                Advanced business intelligence and reporting
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalDashboards}
                </div>
                <div className="text-xs text-gray-500">Dashboards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalReports}
                </div>
                <div className="text-xs text-gray-500">Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${stats.monthlyRevenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Monthly Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.uniqueUsers}
                </div>
                <div className="text-xs text-gray-500">Active Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats.totalRevenue.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All time revenue
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Revenue
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats.monthlyRevenue.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.uniqueUsers}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Unique users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Events
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalEvents}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      User interactions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="mt-6">
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Revenue Analytics
                </h3>
                <p className="text-gray-500 mb-4">
                  Track revenue trends and performance
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Revenue Report
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="mt-6">
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">User Engagement</h3>
                <p className="text-gray-500 mb-4">
                  Analyze user behavior and engagement patterns
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Engagement Report
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Custom Reports</h3>
                <p className="text-gray-500 mb-4">
                  Create and schedule custom analytics reports
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
