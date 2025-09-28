"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  User,
  Building,
  Settings,
  LogOut,
  BarChart3,
  Palette,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, tenant, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
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

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-muted-foreground">{tenant.name}</div>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your {tenant.name} organization.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-card rounded-lg border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-muted-foreground">
                  Team Members
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{tenant.plan}</div>
                <div className="text-sm text-muted-foreground">
                  Current Plan
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">
                  Active Projects
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">AI App Generator</h3>
            <p className="text-muted-foreground mb-4">
              Generate complete applications using AI with multiple providers.
            </p>
            <Button
              className="w-full"
              onClick={() => router.push("/dashboard/generator")}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Generate App
            </Button>
          </div>

          <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Visual Builder</h3>
            <p className="text-muted-foreground mb-4">
              Drag-and-drop interface builder for creating applications
              visually.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/builder")}
            >
              <Palette className="h-4 w-4 mr-2" />
              Open Builder
            </Button>
          </div>

          <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Track user behavior and platform performance metrics.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/analytics")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>

          <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Team Management</h3>
            <p className="text-muted-foreground mb-4">
              Manage your team members, roles, and permissions.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/team")}
            >
              <User className="h-4 w-4 mr-2" />
              Manage Team
            </Button>
          </div>

          <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Content Management</h3>
            <p className="text-muted-foreground mb-4">
              Create and manage your website content with our powerful CMS.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/cms")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage Content
            </Button>
          </div>

          <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">
              Organization Settings
            </h3>
            <p className="text-muted-foreground mb-4">
              Manage your organization settings, billing, and preferences.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-center text-muted-foreground">
              <Rocket className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity yet.</p>
              <p className="text-sm">Start by creating your first project!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
