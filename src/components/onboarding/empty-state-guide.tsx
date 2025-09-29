"use client";

import React, { useState } from "react";
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
  Plus,
  Sparkles,
  Target,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Play,
  Download,
  Users,
  ShoppingCart,
  BarChart3,
  Mail,
  Calendar,
  Video,
  FileText,
  Zap,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

interface EmptyStateProps {
  type: "pages" | "content" | "users" | "analytics" | "ecommerce" | "general";
  onAction?: (action: string) => void;
}

export function EmptyStateGuide({ type, onAction }: EmptyStateProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const getEmptyStateConfig = () => {
    switch (type) {
      case "pages":
        return {
          title: "No pages yet",
          description: "Create your first page to get started",
          icon: <FileText className="h-12 w-12 text-muted-foreground" />,
          suggestions: [
            {
              title: "Homepage",
              description: "Create a welcoming landing page",
              icon: <Target className="h-5 w-5" />,
              action: "create-homepage",
            },
            {
              title: "About Page",
              description: "Tell your story and build trust",
              icon: <Users className="h-5 w-5" />,
              action: "create-about",
            },
            {
              title: "Contact Page",
              description: "Let visitors reach out to you",
              icon: <Mail className="h-5 w-5" />,
              action: "create-contact",
            },
          ],
          templates: [
            {
              title: "Business Landing",
              description: "Professional homepage for businesses",
              preview:
                "🏢 Professional design with hero section, features, and CTA",
              category: "Business",
            },
            {
              title: "Portfolio Showcase",
              description: "Perfect for creatives and freelancers",
              preview: "🎨 Clean design highlighting your work",
              category: "Creative",
            },
            {
              title: "Product Launch",
              description: "Build excitement for your new product",
              preview: "🚀 Modern design with countdown and signup",
              category: "Product",
            },
          ],
        };

      case "content":
        return {
          title: "No content yet",
          description: "Add content to engage your visitors",
          icon: <BookOpen className="h-12 w-12 text-muted-foreground" />,
          suggestions: [
            {
              title: "Blog Post",
              description: "Share your thoughts and expertise",
              icon: <FileText className="h-5 w-5" />,
              action: "create-blog",
            },
            {
              title: "Product Catalog",
              description: "Showcase your products or services",
              icon: <ShoppingCart className="h-5 w-5" />,
              action: "create-catalog",
            },
            {
              title: "Video Content",
              description: "Engage with multimedia content",
              icon: <Video className="h-5 w-5" />,
              action: "create-video",
            },
          ],
          templates: [
            {
              title: "Sample Blog Post",
              description: "Get started with example content",
              preview: "📝 'Welcome to our blog' with tips and insights",
              category: "Content",
            },
            {
              title: "Product Showcase",
              description: "Highlight your best products",
              preview: "🛍️ Product grid with images and descriptions",
              category: "E-commerce",
            },
          ],
        };

      case "users":
        return {
          title: "No team members yet",
          description: "Invite your team to collaborate",
          icon: <Users className="h-12 w-12 text-muted-foreground" />,
          suggestions: [
            {
              title: "Invite Team Member",
              description: "Add collaborators to your project",
              icon: <Users className="h-5 w-5" />,
              action: "invite-member",
            },
            {
              title: "Set Permissions",
              description: "Control who can access what",
              icon: <Target className="h-5 w-5" />,
              action: "set-permissions",
            },
          ],
          templates: [],
        };

      case "analytics":
        return {
          title: "No analytics data yet",
          description: "Set up tracking to understand your visitors",
          icon: <BarChart3 className="h-12 w-12 text-muted-foreground" />,
          suggestions: [
            {
              title: "Enable Google Analytics",
              description: "Track visitor behavior and conversions",
              icon: <BarChart3 className="h-5 w-5" />,
              action: "setup-analytics",
            },
            {
              title: "Add Conversion Tracking",
              description: "Measure your business goals",
              icon: <Target className="h-5 w-5" />,
              action: "setup-conversions",
            },
          ],
          templates: [],
        };

      case "ecommerce":
        return {
          title: "No products yet",
          description: "Add products to start selling",
          icon: <ShoppingCart className="h-12 w-12 text-muted-foreground" />,
          suggestions: [
            {
              title: "Add Product",
              description: "Create your first product listing",
              icon: <Plus className="h-5 w-5" />,
              action: "add-product",
            },
            {
              title: "Set Up Payments",
              description: "Enable secure payment processing",
              icon: <Zap className="h-5 w-5" />,
              action: "setup-payments",
            },
            {
              title: "Configure Shipping",
              description: "Set up delivery options",
              icon: <Target className="h-5 w-5" />,
              action: "setup-shipping",
            },
          ],
          templates: [
            {
              title: "Sample Products",
              description: "Get started with example products",
              preview: "🛍️ 3 sample products with images and descriptions",
              category: "E-commerce",
            },
          ],
        };

      default:
        return {
          title: "Let's get started",
          description: "Choose what you'd like to create",
          icon: <Sparkles className="h-12 w-12 text-muted-foreground" />,
          suggestions: [
            {
              title: "Create Page",
              description: "Add a new page to your site",
              icon: <FileText className="h-5 w-5" />,
              action: "create-page",
            },
            {
              title: "Add Content",
              description: "Create engaging content",
              icon: <BookOpen className="h-5 w-5" />,
              action: "add-content",
            },
          ],
          templates: [],
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">{config.icon}</div>
        <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
        <p className="text-muted-foreground mb-6">{config.description}</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground text-center">
            Quick Actions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50 group"
                onClick={() => onAction?.(suggestion.action)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      {suggestion.icon}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-sm mb-1">
                        {suggestion.title}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Templates */}
        {config.templates.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground text-center">
              Or start with a template
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.templates.map((template, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedTemplate === template.title
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedTemplate(template.title)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-sm mb-1">
                            {template.title}
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          {template.preview}
                        </p>
                      </div>
                      {selectedTemplate === template.title && (
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <CheckCircle className="h-3 w-3" />
                          <span>Selected</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {selectedTemplate ? (
            <Button size="lg" className="px-8">
              <Sparkles className="h-5 w-5 mr-2" />
              Use {selectedTemplate}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          ) : (
            <Button variant="outline" size="lg" className="px-8">
              <Lightbulb className="h-5 w-5 mr-2" />
              Not sure? Get suggestions
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <Button variant="link" className="p-0 h-auto text-xs">
              View our guide
            </Button>{" "}
            or{" "}
            <Button variant="link" className="p-0 h-auto text-xs">
              Contact support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
