"use client";

import { useAuth } from "@/components/providers/auth-provider";
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
import {
  Mail,
  MessageSquare,
  Users,
  BarChart3,
  Send,
  Target,
  Calendar,
  Phone,
  ArrowRight,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  MousePointer,
} from "lucide-react";
import Link from "next/link";

export default function MarketingPage() {
  const { user, tenant } = useAuth();

  const marketingFeatures = [
    {
      title: "Email Marketing",
      description:
        "Complete email marketing suite with templates, sequences, and campaigns",
      icon: <Mail className="h-6 w-6" />,
      features: [
        "Drag-and-drop email editor",
        "Responsive email templates",
        "Email sequences and automation",
        "Campaign management",
        "Delivery tracking and analytics",
      ],
      href: "/dashboard/email",
    },
    {
      title: "SMS Marketing",
      description: "SMS messaging and two-way communication",
      icon: <MessageSquare className="h-6 w-6" />,
      features: [
        "Bulk SMS messaging",
        "Two-way SMS communication",
        "SMS automation",
        "Delivery tracking",
        "Compliance management",
      ],
      href: "/dashboard/communications",
    },
    {
      title: "Community Building",
      description:
        "Build and engage your community with forums and discussions",
      icon: <Users className="h-6 w-6" />,
      features: [
        "Forum system",
        "Thread management",
        "Member profiles",
        "Moderation tools",
        "Engagement tracking",
      ],
      href: "/dashboard/community",
    },
    {
      title: "Sales Funnels",
      description: "Visual funnel builder for lead generation and sales",
      icon: <Target className="h-6 w-6" />,
      features: [
        "Visual funnel designer",
        "Step templates",
        "Conditional logic",
        "A/B testing",
        "Conversion analytics",
      ],
      href: "/dashboard/funnels",
    },
  ];

  const emailTemplates = [
    {
      title: "Welcome Series",
      description: "Onboard new subscribers with a welcome email sequence",
      steps: [
        "Welcome email with introduction",
        "Feature highlights and benefits",
        "Getting started guide",
        "Support and resources",
      ],
      type: "automation",
    },
    {
      title: "Product Launch",
      description: "Announce new products to your audience",
      steps: [
        "Product announcement email",
        "Feature showcase",
        "Pricing and availability",
        "Call-to-action buttons",
      ],
      type: "campaign",
    },
    {
      title: "Newsletter",
      description: "Regular updates and content for your subscribers",
      steps: [
        "Content curation",
        "Personalized recommendations",
        "Industry insights",
        "Company updates",
      ],
      type: "regular",
    },
    {
      title: "Abandoned Cart",
      description: "Recover lost sales with automated cart recovery",
      steps: [
        "Immediate cart abandonment email",
        "Follow-up with discount offer",
        "Final reminder email",
        "Alternative product suggestions",
      ],
      type: "automation",
    },
  ];

  const smsCampaigns = [
    {
      title: "Appointment Reminders",
      description: "Automated SMS reminders for appointments and bookings",
      features: [
        "24-hour advance notice",
        "2-hour final reminder",
        "Customizable message templates",
        "Delivery confirmation",
      ],
    },
    {
      title: "Order Updates",
      description: "Keep customers informed about their order status",
      features: [
        "Order confirmation",
        "Shipping notifications",
        "Delivery updates",
        "Customer service follow-up",
      ],
    },
    {
      title: "Promotional Campaigns",
      description: "Send targeted promotional messages to your audience",
      features: [
        "Segment-based targeting",
        "Personalized offers",
        "Opt-out management",
        "Performance tracking",
      ],
    },
  ];

  const funnelTypes = [
    {
      title: "Lead Generation",
      description: "Capture and nurture leads for your business",
      steps: [
        "Landing page with lead magnet",
        "Email capture form",
        "Welcome email sequence",
        "Nurture campaign",
        "Sales follow-up",
      ],
      conversion: "15-25%",
    },
    {
      title: "Sales Funnel",
      description: "Convert prospects into paying customers",
      steps: [
        "Product showcase page",
        "Social proof and testimonials",
        "Pricing and offers",
        "Checkout process",
        "Thank you and upsell",
      ],
      conversion: "5-15%",
    },
    {
      title: "Onboarding Funnel",
      description: "Guide new users through your platform",
      steps: [
        "Welcome and setup",
        "Feature introduction",
        "First success milestone",
        "Advanced features",
        "Community engagement",
      ],
      conversion: "60-80%",
    },
  ];

  const quickStart = [
    {
      title: "Create Email Template",
      description: "Design your first email template",
      steps: [
        "Go to Email Templates",
        "Choose a template or start blank",
        "Customize design and content",
        "Test on different devices",
        "Save and publish",
      ],
      href: "/dashboard/email",
    },
    {
      title: "Set Up Email Sequence",
      description: "Create automated email sequences",
      steps: [
        "Go to Email Sequences",
        "Create new sequence",
        "Add email steps",
        "Set triggers and timing",
        "Activate sequence",
      ],
      href: "/dashboard/email",
    },
    {
      title: "Launch SMS Campaign",
      description: "Send your first SMS campaign",
      steps: [
        "Go to SMS Messages",
        "Create new campaign",
        "Write your message",
        "Select recipient list",
        "Schedule and send",
      ],
      href: "/dashboard/communications",
    },
    {
      title: "Build Sales Funnel",
      description: "Create your first sales funnel",
      steps: [
        "Go to Funnels",
        "Choose funnel template",
        "Customize steps",
        "Set up tracking",
        "Launch funnel",
      ],
      href: "/dashboard/funnels",
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/docs" className="text-blue-600 hover:text-blue-800">
              Documentation
            </Link>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Marketing & Communications</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Marketing & Communications
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete marketing automation with email, SMS, funnels, and
            community building tools.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-900">
                Marketing Ready
              </span>
            </div>
            <p className="text-purple-800">
              Your marketing tools are configured and ready to use. Start by
              creating your first email template or SMS campaign.
            </p>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickStart.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">Step {index + 1}</Badge>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 mb-4">
                    {item.steps.map((step, stepIndex) => (
                      <li
                        key={stepIndex}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <Link href={item.href}>
                    <Button variant="outline" size="sm" className="w-full">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Marketing Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketingFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {feature.features.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={feature.href}>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage {feature.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Email Templates */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Email Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emailTemplates.map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <Badge
                      variant={
                        template.type === "automation" ? "default" : "secondary"
                      }
                    >
                      {template.type}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {template.steps.map((step, stepIndex) => (
                      <li
                        key={stepIndex}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* SMS Campaigns */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            SMS Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {smsCampaigns.map((campaign, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {campaign.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sales Funnels */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Sales Funnels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {funnelTypes.map((funnel, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{funnel.title}</CardTitle>
                    <Badge variant="outline">
                      {funnel.conversion} conversion
                    </Badge>
                  </div>
                  <CardDescription>{funnel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {funnel.steps.map((step, stepIndex) => (
                      <li
                        key={stepIndex}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Management Actions */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Manage Your Marketing
          </h3>
          <p className="text-gray-600 mb-6">
            Access all your marketing tools and campaigns from one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/email">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Mail className="h-4 w-4 mr-2" />
                Email Marketing
              </Button>
            </Link>
            <Link href="/dashboard/communications">
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS & Voice
              </Button>
            </Link>
            <Link href="/dashboard/funnels">
              <Button variant="outline" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Sales Funnels
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Marketing Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
