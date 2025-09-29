"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { StepCard } from "@/components/docs/StepCard";
import { FeatureCard } from "@/components/docs/FeatureCard";
import { QuickActionGrid } from "@/components/docs/QuickActionGrid";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  CheckCircle,
  ArrowRight,
  Brain,
  Palette,
  ShoppingCart,
  BarChart3,
  Users,
  Mail,
  Calendar,
  Video,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function GettingStartedPage() {
  const { user, tenant } = useAuth();

  const steps = [
    {
      title: "Set Up Your Account",
      description: "Complete your profile and configure basic settings",
      icon: <Users className="h-6 w-6" />,
      tasks: [
        "Complete your profile information",
        "Set up your business details",
        "Configure your team members",
        "Choose your subscription plan",
      ],
      href: "/dashboard/settings",
    },
    {
      title: "Choose Your Approach",
      description: "Select how you want to build your business",
      icon: <Brain className="h-6 w-6" />,
      tasks: [
        "AI Generation: Describe your idea and let AI build it",
        "Visual Builder: Use drag-and-drop tools",
        "Template Library: Start with pre-built templates",
        "Custom Development: Build from scratch",
      ],
      href: "/dashboard/unified-platform",
    },
    {
      title: "Configure Core Features",
      description: "Set up the essential features for your business",
      icon: <FileText className="h-6 w-6" />,
      tasks: [
        "Set up your e-commerce store",
        "Configure email marketing",
        "Set up analytics tracking",
        "Create your first content",
      ],
      href: "/dashboard",
    },
    {
      title: "Launch & Grow",
      description: "Go live and start growing your business",
      icon: <Rocket className="h-6 w-6" />,
      tasks: [
        "Test everything before going live",
        "Launch your marketing campaigns",
        "Monitor performance and analytics",
        "Scale based on data insights",
      ],
      href: "/dashboard/analytics",
    },
  ];

  const features = [
    {
      title: "AI-Powered Development",
      description: "Generate complete applications from natural language",
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      benefits: [
        "No coding required",
        "Complete applications in minutes",
        "Multiple business types supported",
        "Global deployment included",
      ],
    },
    {
      title: "Visual Builder",
      description: "Drag-and-drop page and funnel creation",
      icon: <Palette className="h-8 w-8 text-green-600" />,
      benefits: [
        "Real-time preview",
        "Mobile responsive design",
        "SEO optimization",
        "A/B testing capabilities",
      ],
    },
    {
      title: "E-commerce Platform",
      description: "Complete online store with payments and fulfillment",
      icon: <ShoppingCart className="h-8 w-8 text-purple-600" />,
      benefits: [
        "Product catalog management",
        "Payment processing",
        "Order fulfillment",
        "Inventory tracking",
      ],
    },
    {
      title: "Marketing Automation",
      description: "Email, SMS, and campaign management",
      icon: <Mail className="h-8 w-8 text-orange-600" />,
      benefits: [
        "Email sequences",
        "SMS marketing",
        "Campaign management",
        "Analytics tracking",
      ],
    },
    {
      title: "Analytics & Reporting",
      description: "Business intelligence and performance insights",
      icon: <BarChart3 className="h-8 w-8 text-red-600" />,
      benefits: [
        "Custom dashboards",
        "Revenue analytics",
        "User engagement",
        "Performance monitoring",
      ],
    },
    {
      title: "CRM & Sales",
      description: "Customer relationship management",
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      benefits: [
        "Contact management",
        "Sales pipelines",
        "Deal tracking",
        "Team collaboration",
      ],
    },
  ];

  const quickActions = [
    {
      title: "Generate Your First App",
      description: "Use AI to create your business application",
      icon: <Brain className="h-5 w-5" />,
      href: "/dashboard/unified-platform",
      color: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      title: "Set Up E-commerce",
      description: "Configure your online store",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/dashboard/ecommerce",
      color: "bg-green-50 border-green-200 text-green-800",
    },
    {
      title: "Create Marketing Campaign",
      description: "Launch your first email campaign",
      icon: <Mail className="h-5 w-5" />,
      href: "/dashboard/email",
      color: "bg-purple-50 border-purple-200 text-purple-800",
    },
    {
      title: "View Analytics",
      description: "Monitor your business performance",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/dashboard/analytics",
      color: "bg-orange-50 border-orange-200 text-orange-800",
    },
  ];

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DocsLayout
      title="Welcome to Rockket!"
      description="The world's most comprehensive business platform. Let's get you started with everything you need to build and grow your business."
      breadcrumbs={[{ label: "Getting Started" }]}
    >
      {/* Account Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            Your Account is Ready
          </span>
        </div>
        <p className="text-blue-800">
          You're logged in as <strong>{user.name}</strong> for{" "}
          <strong>{tenant.name}</strong>. Let's start building your business!
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActionGrid
        title="Quick Actions"
        description="Start building your business with these essential tools"
        actions={quickActions.map((action) => ({
          title: action.title,
          description: action.description,
          icon: action.icon,
          href: action.href,
          color: action.color,
        }))}
        columns={4}
        className="mb-8"
      />

      {/* Getting Started Steps */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Getting Started Steps
        </h2>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
              steps={step.tasks}
              href={step.href}
              stepNumber={index + 1}
            />
          ))}
        </div>
      </div>

      {/* Platform Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          What You Can Build
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              benefits={feature.benefits}
              status="ready"
            />
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Ready to Get Started?
        </h3>
        <p className="text-gray-600 mb-4">
          Choose your preferred approach and start building your business today.
          You can always switch between different methods as you learn and grow.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/unified-platform">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Brain className="h-4 w-4 mr-2" />
              Start with AI Generation
            </Button>
          </Link>
          <Link href="/dashboard/builder">
            <Button variant="outline">
              <Palette className="h-4 w-4 mr-2" />
              Use Visual Builder
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Browse Documentation
            </Button>
          </Link>
        </div>
      </div>
    </DocsLayout>
  );
}
