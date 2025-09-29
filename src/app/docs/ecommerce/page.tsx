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
  ShoppingCart,
  Package,
  CreditCard,
  Truck,
  Percent,
  Gift,
  Users,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function EcommercePage() {
  const { user, tenant } = useAuth();

  const features = [
    {
      title: "Product Management",
      description:
        "Complete product catalog with variants, inventory, and media",
      icon: <Package className="h-6 w-6" />,
      features: [
        "Product catalog with variants",
        "Inventory tracking",
        "Media gallery",
        "SEO optimization",
        "Bulk operations",
      ],
      href: "/dashboard/ecommerce",
    },
    {
      title: "Order Processing",
      description: "Complete order lifecycle from cart to fulfillment",
      icon: <ShoppingCart className="h-6 w-6" />,
      features: [
        "Shopping cart management",
        "Secure checkout process",
        "Payment processing",
        "Order fulfillment",
        "Tracking system",
      ],
      href: "/dashboard/ecommerce",
    },
    {
      title: "Payment Processing",
      description: "Secure payment processing with Stripe integration",
      icon: <CreditCard className="h-6 w-6" />,
      features: [
        "Stripe integration",
        "Multiple currencies",
        "Subscription billing",
        "Refund management",
        "Tax calculation",
      ],
      href: "/dashboard/payments",
    },
    {
      title: "Shipping & Fulfillment",
      description: "Multi-zone shipping and order fulfillment",
      icon: <Truck className="h-6 w-6" />,
      features: [
        "Shipping zones",
        "Rate calculation",
        "Order tracking",
        "Fulfillment management",
        "Returns processing",
      ],
      href: "/dashboard/ecommerce",
    },
    {
      title: "Discounts & Promotions",
      description: "Advanced promotional system with coupons and gift cards",
      icon: <Percent className="h-6 w-6" />,
      features: [
        "Percentage discounts",
        "Fixed amount discounts",
        "Coupon codes",
        "Gift cards",
        "Bulk discounts",
      ],
      href: "/dashboard/discounts",
    },
    {
      title: "Customer Management",
      description: "Customer profiles and order history",
      icon: <Users className="h-6 w-6" />,
      features: [
        "Customer profiles",
        "Order history",
        "Address management",
        "Communication tracking",
        "Loyalty programs",
      ],
      href: "/dashboard/crm",
    },
  ];

  const quickStart = [
    {
      title: "Add Your First Product",
      description: "Create your product catalog",
      steps: [
        "Go to Products in your dashboard",
        "Click 'Add Product'",
        "Fill in product details",
        "Upload product images",
        "Set pricing and inventory",
      ],
      href: "/dashboard/ecommerce",
    },
    {
      title: "Configure Payment Processing",
      description: "Set up Stripe for payments",
      steps: [
        "Go to Payments settings",
        "Connect your Stripe account",
        "Configure payment methods",
        "Set up tax rates",
        "Test payment processing",
      ],
      href: "/dashboard/payments",
    },
    {
      title: "Set Up Shipping",
      description: "Configure shipping zones and rates",
      steps: [
        "Go to Shipping settings",
        "Create shipping zones",
        "Set shipping rates",
        "Configure free shipping thresholds",
        "Test shipping calculations",
      ],
      href: "/dashboard/ecommerce",
    },
    {
      title: "Launch Your Store",
      description: "Go live with your online store",
      steps: [
        "Review all settings",
        "Test the checkout process",
        "Set up analytics tracking",
        "Launch marketing campaigns",
        "Monitor performance",
      ],
      href: "/dashboard/analytics",
    },
  ];

  const advancedFeatures = [
    {
      title: "Abandoned Cart Recovery",
      description: "Automatically recover lost sales with email sequences",
      icon: <ShoppingCart className="h-5 w-5" />,
      benefits: [
        "Automatic cart detection",
        "Email sequences",
        "Personalized recovery messages",
        "Analytics tracking",
      ],
    },
    {
      title: "Affiliate Program",
      description: "Manage affiliates and track commissions",
      icon: <Users className="h-5 w-5" />,
      benefits: [
        "Affiliate management",
        "Commission tracking",
        "Payout management",
        "Performance analytics",
      ],
    },
    {
      title: "Inventory Management",
      description: "Track stock levels and manage inventory",
      icon: <Package className="h-5 w-5" />,
      benefits: [
        "Real-time stock tracking",
        "Low stock alerts",
        "Bulk inventory updates",
        "Inventory reports",
      ],
    },
    {
      title: "Analytics & Reporting",
      description: "Track sales performance and customer behavior",
      icon: <BarChart3 className="h-5 w-5" />,
      benefits: [
        "Sales analytics",
        "Customer insights",
        "Product performance",
        "Revenue tracking",
      ],
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
            <span className="text-gray-600">E-commerce Platform</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            E-commerce Platform
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete online store management with products, payments, shipping,
            and customer management.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">
                E-commerce Ready
              </span>
            </div>
            <p className="text-green-800">
              Your e-commerce platform is fully configured and ready to use.
              Start by adding products and configuring your payment settings.
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
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
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
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
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

        {/* Advanced Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advancedFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Management Actions */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Manage Your Store
          </h3>
          <p className="text-gray-600 mb-6">
            Access all your e-commerce management tools from one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/ecommerce">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/dashboard/payments">
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Settings
              </Button>
            </Link>
            <Link href="/dashboard/discounts">
              <Button variant="outline" className="w-full">
                <Percent className="h-4 w-4 mr-2" />
                Discounts & Coupons
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
