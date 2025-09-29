"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const router = useRouter();
  const { user, tenant, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user || !tenant) {
    router.push("/auth/login");
    return null;
  }

  const workingFeatures = {
    development: [
      {
        title: "Visual Builder",
        description: "Create your application visually",
        route: "/dashboard/builder",
        icon: "🎨",
      },
      {
        title: "Content Management",
        description: "Manage your content and pages",
        route: "/dashboard/cms",
        icon: "📝",
      },
    ],
    analytics: [
      {
        title: "Analytics",
        description: "Track your application performance",
        route: "/dashboard/analytics",
        icon: "📊",
      },
      {
        title: "Monitoring",
        description: "Monitor your application health",
        route: "/dashboard/monitoring",
        icon: "🔍",
      },
    ],
    business: [
      {
        title: "E-commerce",
        description: "Manage your online store",
        route: "/dashboard/ecommerce",
        icon: "🛍️",
      },
      {
        title: "CRM",
        description: "Manage your customers",
        route: "/dashboard/crm",
        icon: "👥",
      },
    ],
    settings: [
      {
        title: "Settings",
        description: "Configure your application",
        route: "/dashboard/settings",
        icon: "⚙️",
      },
      {
        title: "Team",
        description: "Manage your team members",
        route: "/dashboard/team",
        icon: "👥",
      },
    ],
  };

  return (
    <div className="container py-6 space-y-8">
      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>
              Your project is looking great! Here's what you can do next.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() =>
                  window.open("https://demo.rockket.dev", "_blank")
                }
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Live Site
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/monitoring")}
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3 w-3" />
                Last updated 2 minutes ago
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">+12% traffic this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>
              Current project health and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Health</span>
                <Badge
                  variant="outline"
                  className="text-success border-success/20"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm">120ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Access and manage your application features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="development" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            {Object.entries(workingFeatures).map(([category, features]) => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <Card
                      key={feature.title}
                      className="hover:bg-card-hover cursor-pointer transition-colors"
                      onClick={() => router.push(feature.route)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span>{feature.icon}</span>
                          {feature.title}
                        </CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
