"use client";

import { ReactNode } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Menu,
  X,
  BookOpen,
  Code,
  ArrowLeft,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface DocsLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function DocsLayout({
  children,
  title,
  description,
  breadcrumbs = [],
}: DocsLayoutProps) {
  const { user, tenant } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    {
      title: "Getting Started",
      href: "/docs/getting-started",
      icon: <BookOpen className="h-4 w-4" />,
      children: [
        { title: "Quick Start", href: "/docs/getting-started#quick-start" },
        { title: "Account Setup", href: "/docs/getting-started#account-setup" },
        { title: "First Project", href: "/docs/getting-started#first-project" },
      ],
    },
    {
      title: "User Guides",
      icon: <BookOpen className="h-4 w-4" />,
      children: [
        { title: "E-commerce", href: "/docs/ecommerce" },
        { title: "Marketing", href: "/docs/marketing" },
        { title: "CRM & Sales", href: "/docs/crm" },
        { title: "Analytics", href: "/docs/analytics" },
        { title: "AI Tools", href: "/docs/ai-tools" },
        { title: "Calendar", href: "/docs/calendar" },
        { title: "Video", href: "/docs/video" },
        { title: "Financial", href: "/docs/financial" },
      ],
    },
    {
      title: "Developer Guides",
      icon: <Code className="h-4 w-4" />,
      children: [
        { title: "API Reference", href: "/docs/api" },
        { title: "Authentication", href: "/docs/auth" },
        { title: "Database", href: "/docs/database" },
        { title: "Multi-tenancy", href: "/docs/multi-tenancy" },
        { title: "AI Integration", href: "/docs/ai-integration" },
        { title: "Deployment", href: "/docs/deployment" },
      ],
    },
  ];

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/docs" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Docs</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((section, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700">
                  {section.icon}
                  {section.title}
                </div>
                <div className="ml-4 space-y-1">
                  {section.children.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>

              {/* Breadcrumbs */}
              <nav className="hidden sm:flex items-center space-x-2 text-sm">
                <Link
                  href="/docs"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Docs
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-gray-900 font-medium">
                        {crumb.label}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:inline-flex">
                {tenant.name}
              </Badge>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            {description && (
              <p className="text-xl text-gray-600">{description}</p>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
