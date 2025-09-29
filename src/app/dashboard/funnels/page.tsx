"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Funnel {
  id: string;
  name: string;
  slug: string;
  status: string;
  goalType: string;
  createdAt: string;
  steps: FunnelStep[];
  _count: {
    events: number;
  };
}

interface FunnelStep {
  id: string;
  name: string;
  type: string;
  order: number;
  _count: {
    events: number;
  };
}

interface FunnelAnalytics {
  overview: {
    totalViews: number;
    totalClicks: number;
    totalSubmits: number;
    totalPurchases: number;
    totalRevenue: number;
    conversionRate: number;
    clickThroughRate: number;
  };
  stepAnalytics: Array<{
    stepId: string;
    stepName: string;
    views: number;
    clicks: number;
    submits: number;
    purchases: number;
    revenue: number;
  }>;
}

export default function FunnelsDashboard() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);
  const [analytics, setAnalytics] = useState<FunnelAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunnels();
  }, []);

  const fetchFunnels = async () => {
    try {
      const response = await fetch("/api/funnels?tenantId=demo-tenant");
      const data = await response.json();
      setFunnels(data.funnels || []);
      if (data.funnels && data.funnels.length > 0) {
        setSelectedFunnel(data.funnels[0]);
        fetchAnalytics(data.funnels[0].id);
      }
    } catch (error) {
      console.error("Error fetching funnels:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (funnelId: string) => {
    try {
      const response = await fetch(
        `/api/funnels/analytics?funnelId=${funnelId}&tenantId=demo-tenant`
      );
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case "landing":
        return "bg-blue-100 text-blue-800";
      case "optin":
        return "bg-purple-100 text-purple-800";
      case "sales":
        return "bg-green-100 text-green-800";
      case "checkout":
        return "bg-orange-100 text-orange-800";
      case "upsell":
        return "bg-pink-100 text-pink-800";
      case "downsell":
        return "bg-red-100 text-red-800";
      case "thankyou":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading funnels...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Funnels</h1>
          <p className="text-gray-600">
            Manage your sales funnels and track conversions
          </p>
        </div>
        <Button>Create New Funnel</Button>
      </div>

      <Tabs defaultValue="funnels" className="space-y-6">
        <TabsList>
          <TabsTrigger value="funnels">All Funnels</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="funnels" className="space-y-6">
          <div className="grid gap-6">
            {funnels.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No funnels yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first funnel to start tracking conversions
                    </p>
                    <Button>Create Funnel</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              funnels.map((funnel) => (
                <Card
                  key={funnel.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {funnel.name}
                          <Badge className={getStatusColor(funnel.status)}>
                            {funnel.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Goal: {funnel.goalType} • {funnel._count.events}{" "}
                          events
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFunnel(funnel);
                          fetchAnalytics(funnel.id);
                        }}
                      >
                        View Analytics
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium">
                        Steps ({funnel.steps.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {funnel.steps.map((step, index) => (
                          <div
                            key={step.id}
                            className="flex items-center gap-2"
                          >
                            <Badge className={getStepTypeColor(step.type)}>
                              {step.name}
                            </Badge>
                            {index < funnel.steps.length - 1 && (
                              <span className="text-gray-400">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {selectedFunnel && analytics ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics for {selectedFunnel.name}</CardTitle>
                  <CardDescription>
                    Performance metrics and conversion data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.overview.totalViews}
                      </div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.overview.totalPurchases}
                      </div>
                      <div className="text-sm text-gray-600">Purchases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.overview.conversionRate}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Conversion Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        ${analytics.overview.totalRevenue.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.stepAnalytics.map((step) => (
                      <div key={step.stepId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{step.stepName}</h4>
                          <div className="text-sm text-gray-600">
                            {step.views} views, {step.purchases} purchases
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-blue-600">
                              {step.views}
                            </div>
                            <div className="text-gray-600">Views</div>
                          </div>
                          <div>
                            <div className="font-medium text-green-600">
                              {step.clicks}
                            </div>
                            <div className="text-gray-600">Clicks</div>
                          </div>
                          <div>
                            <div className="font-medium text-purple-600">
                              {step.submits}
                            </div>
                            <div className="text-gray-600">Submits</div>
                          </div>
                          <div>
                            <div className="font-medium text-orange-600">
                              ${step.revenue.toFixed(2)}
                            </div>
                            <div className="text-gray-600">Revenue</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    No analytics data
                  </h3>
                  <p className="text-gray-600">
                    Select a funnel to view its analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
