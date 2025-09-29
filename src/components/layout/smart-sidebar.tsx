"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  BarChart3, 
  Users, 
  DollarSign, 
  Shield, 
  Zap, 
  Settings,
  ChevronRight,
  Plus,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface SmartSidebarProps {
  className?: string;
  userLevel?: "beginner" | "intermediate" | "expert";
  activeProject?: string;
  recentActivity?: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: Date;
    status: "success" | "warning" | "error";
  }>;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
  description?: string;
  category: "core" | "building" | "business" | "analytics" | "advanced";
  requiredLevel?: "beginner" | "intermediate" | "expert";
  isNew?: boolean;
  isPro?: boolean;
}

const navItems: NavItem[] = [
  // Core - Always visible
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="h-4 w-4" />,
    href: "/dashboard",
    description: "Project overview and quick actions",
    category: "core"
  },
  
  // Building - Progressive disclosure
  {
    id: "ai-generator",
    label: "AI Generator",
    icon: <Sparkles className="h-4 w-4" />,
    href: "/dashboard/generator",
    description: "Describe what you want to build",
    category: "building",
    isNew: true
  },
  {
    id: "visual-builder",
    label: "Visual Builder",
    icon: <Zap className="h-4 w-4" />,
    href: "/dashboard/builder",
    description: "Drag and drop interface",
    category: "building"
  },
  {
    id: "code-editor",
    label: "Code Editor",
    icon: <Zap className="h-4 w-4" />,
    href: "/dashboard/code",
    description: "Write custom code",
    category: "building",
    requiredLevel: "intermediate"
  },
  
  // Business - Contextual revelation
  {
    id: "ecommerce",
    label: "E-commerce",
    icon: <DollarSign className="h-4 w-4" />,
    href: "/dashboard/ecommerce",
    description: "Sell products online",
    category: "business",
    badge: "Popular"
  },
  {
    id: "crm",
    label: "CRM",
    icon: <Users className="h-4 w-4" />,
    href: "/dashboard/crm",
    description: "Manage customers and deals",
    category: "business"
  },
  {
    id: "financial",
    label: "Financial Planning",
    icon: <DollarSign className="h-4 w-4" />,
    href: "/dashboard/financial",
    description: "Track revenue and expenses",
    category: "business"
  },
  
  // Analytics - Appears after first deployment
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    href: "/dashboard/analytics",
    description: "Track your performance",
    category: "analytics"
  },
  {
    id: "monitoring",
    label: "Monitoring",
    icon: <Shield className="h-4 w-4" />,
    href: "/dashboard/monitoring",
    description: "System health and performance",
    category: "analytics",
    requiredLevel: "intermediate"
  },
  {
    id: "security",
    label: "Security",
    icon: <Shield className="h-4 w-4" />,
    href: "/dashboard/security",
    description: "Security dashboard and tests",
    category: "analytics",
    requiredLevel: "intermediate"
  },
  
  // Advanced - Expert level
  {
    id: "performance",
    label: "Performance",
    icon: <TrendingUp className="h-4 w-4" />,
    href: "/dashboard/performance",
    description: "Optimize speed and efficiency",
    category: "advanced",
    requiredLevel: "expert"
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    href: "/dashboard/settings",
    description: "Configure your project",
    category: "advanced"
  }
];

export function SmartSidebar({ 
  className, 
  userLevel = "beginner",
  activeProject,
  recentActivity = []
}: SmartSidebarProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(["core", "building"])
  );
  const [showSuggestions, setShowSuggestions] = React.useState(true);

  const getFilteredItems = (category: string) => {
    return navItems.filter(item => {
      if (item.category !== category) return false;
      if (item.requiredLevel && item.requiredLevel !== userLevel) {
        // Show but with reduced opacity for locked items
        return true;
      }
      return true;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "core":
        return <Home className="h-4 w-4" />;
      case "building":
        return <Sparkles className="h-4 w-4" />;
      case "business":
        return <DollarSign className="h-4 w-4" />;
      case "analytics":
        return <BarChart3 className="h-4 w-4" />;
      case "advanced":
        return <Settings className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "core":
        return "Essentials";
      case "building":
        return "Building";
      case "business":
        return "Making Money";
      case "analytics":
        return "Understanding Users";
      case "advanced":
        return "Advanced";
      default:
        return category;
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const categories = ["core", "building", "business", "analytics", "advanced"];

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
      {/* Project Header */}
      {activeProject && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">Live Project</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground truncate">
            {activeProject}
          </h2>
          <p className="text-xs text-muted-foreground">
            Last updated 2 minutes ago
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {categories.map((category) => {
          const items = getFilteredItems(category);
          if (items.length === 0) return null;

          const isExpanded = expandedCategories.has(category);
          const lockedItems = items.filter(item => 
            item.requiredLevel && item.requiredLevel !== userLevel
          );

          return (
            <div key={category} className="border-b border-border last:border-b-0">
              <Button
                variant="ghost"
                onClick={() => toggleCategory(category)}
                className="w-full justify-between px-4 py-3 h-auto"
              >
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <span className="font-medium">{getCategoryLabel(category)}</span>
                  {lockedItems.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {lockedItems.length} locked
                    </Badge>
                  )}
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-90"
                  )} 
                />
              </Button>

              {isExpanded && (
                <div className="pb-2">
                  {items.map((item) => {
                    const isLocked = item.requiredLevel && item.requiredLevel !== userLevel;
                    
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start px-6 py-2 h-auto text-left",
                          isLocked && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={isLocked}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">
                                {item.label}
                              </span>
                              {item.isNew && (
                                <Badge variant="secondary" className="text-xs">
                                  New
                                </Badge>
                              )}
                              {item.isPro && (
                                <Badge variant="outline" className="text-xs">
                                  Pro
                                </Badge>
                              )}
                              {item.badge && (
                                <Badge variant="outline" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </p>
                          </div>
                          {isLocked && (
                            <div className="flex-shrink-0">
                              <Shield className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              {showSuggestions ? "Hide" : "Show"}
            </Button>
          </div>
          
          {showSuggestions && (
            <div className="space-y-2">
              {recentActivity.slice(0, 3).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
                >
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <Button className="w-full mb-2">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
        <Button variant="outline" className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Assistant
        </Button>
      </div>
    </div>
  );
}
