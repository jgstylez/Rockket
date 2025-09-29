"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { FeatureCard } from "@/components/docs/FeatureCard";
import { QuickActionGrid } from "@/components/docs/QuickActionGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Code,
  Users,
  ShoppingCart,
  Mail,
  BarChart3,
  Calendar,
  Video,
  Brain,
  Settings,
  HelpCircle,
  FileText,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const { user, tenant } = useAuth();

  const userGuides = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Rockket",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/docs/getting-started",
      category: "basics",
    },
    {
      title: "E-commerce Platform",
      description: "Complete online store management",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/docs/ecommerce",
      category: "features",
    },
    {
      title: "Marketing & Communications",
      description: "Email, SMS, and campaign management",
      icon: <Mail className="h-5 w-5" />,
      href: "/docs/marketing",
      category: "features",
    },
    {
      title: "CRM & Sales",
      description: "Customer relationship management",
      icon: <Users className="h-5 w-5" />,
      href: "/docs/crm",
      category: "features",
    },
    {
      title: "Analytics & Reporting",
      description: "Business intelligence and insights",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/docs/analytics",
      category: "features",
    },
    {
      title: "AI-Powered Tools",
      description: "Generate applications with AI",
      icon: <Brain className="h-5 w-5" />,
      href: "/docs/ai-tools",
      category: "features",
    },
    {
      title: "Calendar & Booking",
      description: "Event and appointment management",
      icon: <Calendar className="h-5 w-5" />,
      href: "/docs/calendar",
      category: "features",
    },
    {
      title: "Video Hosting",
      description: "Secure video streaming and management",
      icon: <Video className="h-5 w-5" />,
      href: "/docs/video",
      category: "features",
    },
    {
      title: "Financial Planning",
      description: "Business planning and scenario modeling",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/docs/financial",
      category: "features",
    },
  ];

  const developerGuides = [
    {
      title: "API Reference",
      description: "Complete API documentation with examples",
      icon: <Code className="h-5 w-5" />,
      href: "/docs/api",
      category: "technical",
    },
    {
      title: "Authentication",
      description: "JWT authentication and security",
      icon: <Shield className="h-5 w-5" />,
      href: "/docs/auth",
      category: "technical",
    },
    {
      title: "Database Schema",
      description: "Complete database structure and relationships",
      icon: <FileText className="h-5 w-5" />,
      href: "/docs/database",
      category: "technical",
    },
    {
      title: "Multi-Tenancy",
      description: "Tenant isolation and management",
      icon: <Globe className="h-5 w-5" />,
      href: "/docs/multi-tenancy",
      category: "technical",
    },
    {
      title: "AI Integration",
      description: "VibeSDK and AI provider integration",
      icon: <Brain className="h-5 w-5" />,
      href: "/docs/ai-integration",
      category: "technical",
    },
    {
      title: "Deployment",
      description: "Cloudflare Workers and infrastructure",
      icon: <Zap className="h-5 w-5" />,
      href: "/docs/deployment",
      category: "technical",
    },
  ];

  const quickStart = [
    {
      title: "Create Your First Project",
      description: "Use AI to generate your first application",
      href: "/docs/quick-start/ai-generation",
    },
    {
      title: "Set Up E-commerce Store",
      description: "Configure products, payments, and shipping",
      href: "/docs/quick-start/ecommerce",
    },
    {
      title: "Launch Marketing Campaign",
      description: "Create and send your first email campaign",
      href: "/docs/quick-start/marketing",
    },
    {
      title: "Configure Analytics",
      description: "Set up tracking and reporting",
      href: "/docs/quick-start/analytics",
    },
  ];

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <DocsLayout
      title="Rockket Documentation"
      description="Complete guides for users and developers to get the most out of Rockket"
    >
      {/* Quick Start */}
      <QuickActionGrid
        title="Quick Start"
        description="Get up and running quickly with these essential guides"
        actions={quickStart.map((item) => ({
          title: item.title,
          description: item.description,
          icon: <BookOpen className="h-5 w-5" />,
          href: item.href,
          color: "hover:border-primary/20",
        }))}
        columns={4}
        className="mb-8"
      />

      {/* Main Documentation */}
      <Tabs defaultValue="user" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Guides
          </TabsTrigger>
          <TabsTrigger value="developer" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Developer Guides
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              User Documentation
            </h2>
            <p className="text-gray-600 mb-6">
              Learn how to use all of Rockket's features to build and grow your
              business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userGuides.map((guide, index) => (
              <FeatureCard
                key={index}
                title={guide.title}
                description={guide.description}
                icon={guide.icon}
                href={guide.href}
                category={guide.category}
                status="ready"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="developer" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Developer Documentation
            </h2>
            <p className="text-gray-600 mb-6">
              Technical documentation for developers building on the Rockket
              platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developerGuides.map((guide, index) => (
              <FeatureCard
                key={index}
                title={guide.title}
                description={guide.description}
                icon={guide.icon}
                href={guide.href}
                category={guide.category}
                status="ready"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Support Section */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Community Support
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Get help from other users and share your experiences.
            </p>
            <Button variant="outline" size="sm">
              Join Community
            </Button>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Technical Support
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Get direct help from our technical team.
            </p>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Feature Requests</h4>
            <p className="text-sm text-gray-600 mb-3">
              Suggest new features or improvements.
            </p>
            <Button variant="outline" size="sm">
              Submit Request
            </Button>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
