"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  BarChart3,
  Users,
  Activity,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";

interface AnalyticsMetrics {
  totalEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
  topEvents: Array<{ event: string; count: number }>;
  eventsOverTime: Array<{ date: string; count: number }>;
}

interface AnalyticsEvent {
  id: string;
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  tenantId: string;
  timestamp: string;
}

export default function AnalyticsPage() {
  const { user, tenant } = useAuth();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (dateRange) {
        case "1d":
          startDate.setDate(startDate.getDate() - 1);
          break;
        case "7d":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(startDate.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      // Load metrics
      const metricsResponse = await fetch(
        `/api/analytics/metrics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData.metrics);
      }

      // Load events
      const eventsResponse = await fetch(
        `/api/analytics/events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&limit=50`
      );

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    if (!metrics) return;

    const csvContent = [
      ["Metric", "Value"],
      ["Total Events", metrics.totalEvents.toString()],
      ["Unique Users", metrics.uniqueUsers.toString()],
      ["Unique Sessions", metrics.uniqueSessions.toString()],
      ...metrics.topEvents.map((event) => [
        event.event,
        event.count.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${dateRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Rockket</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                  Track user behavior and platform performance for {tenant.name}
                  .
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="input-field"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <Button onClick={exportData} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p>Loading analytics data...</p>
            </div>
          ) : (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {metrics?.totalEvents || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Events
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {metrics?.uniqueUsers || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Unique Users
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {metrics?.uniqueSessions || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Unique Sessions
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Events */}
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Events</h3>
                  <div className="space-y-3">
                    {metrics?.topEvents.slice(0, 5).map((event, index) => (
                      <div
                        key={event.event}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{event.event}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(event.count / (metrics?.topEvents[0]?.count || 1)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {event.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Events Over Time */}
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Events Over Time
                  </h3>
                  <div className="space-y-2">
                    {metrics?.eventsOverTime.slice(-7).map((data, index) => (
                      <div
                        key={data.date}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-muted-foreground">
                          {new Date(data.date).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(data.count / Math.max(...(metrics?.eventsOverTime.map((d) => d.count) || [1]))) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {data.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Events */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Events</h3>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Events</option>
                    {metrics?.topEvents.map((event) => (
                      <option key={event.event} value={event.event}>
                        {event.event}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-card rounded-lg border">
                  <div className="p-6">
                    <div className="space-y-4">
                      {events
                        .filter(
                          (event) =>
                            !selectedEvent || event.event === selectedEvent
                        )
                        .slice(0, 10)
                        .map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between p-4 bg-muted rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <div>
                                <div className="font-medium">{event.event}</div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(event.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {event.userId
                                ? `User: ${event.userId.slice(0, 8)}...`
                                : "Anonymous"}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
