import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Code,
  Zap,
  Shield,
  Users,
  BarChart3,
  Palette,
  Rocket,
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Learn the basics and get up and running quickly",
      icon: <Rocket className="h-6 w-6" />,
      articles: [
        { title: "Quick Start Guide", href: "/docs/quick-start" },
        { title: "Installation", href: "/docs/installation" },
        { title: "Your First Project", href: "/docs/first-project" },
        { title: "Account Setup", href: "/docs/account-setup" },
      ],
    },
    {
      title: "AI Generator",
      description: "Master AI-powered application generation",
      icon: <Zap className="h-6 w-6" />,
      articles: [
        { title: "AI Providers Overview", href: "/docs/ai-providers" },
        { title: "Writing Effective Prompts", href: "/docs/prompts" },
        { title: "Templates & Examples", href: "/docs/templates" },
        { title: "Custom Generation", href: "/docs/custom-generation" },
      ],
    },
    {
      title: "Visual Builder",
      description: "Build applications with drag-and-drop interface",
      icon: <Palette className="h-6 w-6" />,
      articles: [
        { title: "Component Library", href: "/docs/components" },
        { title: "Layout System", href: "/docs/layout" },
        { title: "Styling & Theming", href: "/docs/styling" },
        { title: "Export & Deployment", href: "/docs/export" },
      ],
    },
    {
      title: "Content Management",
      description: "Manage your content with our powerful CMS",
      icon: <BookOpen className="h-6 w-6" />,
      articles: [
        { title: "Page Management", href: "/docs/pages" },
        { title: "Content Blocks", href: "/docs/content-blocks" },
        { title: "SEO Optimization", href: "/docs/seo" },
        { title: "Publishing Workflow", href: "/docs/publishing" },
      ],
    },
    {
      title: "E-commerce",
      description: "Set up and manage your online store",
      icon: <Code className="h-6 w-6" />,
      articles: [
        { title: "Product Management", href: "/docs/products" },
        { title: "Shopping Cart", href: "/docs/cart" },
        { title: "Payment Processing", href: "/docs/payments" },
        { title: "Order Management", href: "/docs/orders" },
      ],
    },
    {
      title: "Analytics",
      description: "Track performance and user behavior",
      icon: <BarChart3 className="h-6 w-6" />,
      articles: [
        { title: "Analytics Overview", href: "/docs/analytics" },
        { title: "Custom Events", href: "/docs/custom-events" },
        { title: "Performance Metrics", href: "/docs/performance" },
        { title: "Data Export", href: "/docs/data-export" },
      ],
    },
    {
      title: "Team & Collaboration",
      description: "Work together with your team",
      icon: <Users className="h-6 w-6" />,
      articles: [
        { title: "Team Management", href: "/docs/teams" },
        { title: "Roles & Permissions", href: "/docs/permissions" },
        { title: "Collaboration Features", href: "/docs/collaboration" },
        { title: "Organization Settings", href: "/docs/organization" },
      ],
    },
    {
      title: "Security & Compliance",
      description: "Keep your data secure and compliant",
      icon: <Shield className="h-6 w-6" />,
      articles: [
        { title: "Security Overview", href: "/docs/security" },
        { title: "Authentication", href: "/docs/authentication" },
        { title: "Data Protection", href: "/docs/data-protection" },
        { title: "Compliance Features", href: "/docs/compliance" },
      ],
    },
  ];

  const quickLinks = [
    {
      title: "API Reference",
      href: "/api",
      description: "Complete API documentation",
    },
    {
      title: "Templates",
      href: "/templates",
      description: "Pre-built application templates",
    },
    {
      title: "Examples",
      href: "/examples",
      description: "Real-world examples and tutorials",
    },
    {
      title: "Community",
      href: "/community",
      description: "Join our developer community",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Documentation & <span className="gradient-text">Guides</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Everything you need to build amazing applications with Rockket.
              From quick start guides to advanced features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/docs/quick-start">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/api">API Reference</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-primary mr-3">{section.icon}</div>
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {section.description}
                  </p>
                  <ul className="space-y-3">
                    {section.articles.map((article, idx) => (
                      <li key={idx}>
                        <Link
                          href={article.href}
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Quick Links
              </h2>
              <p className="text-xl text-muted-foreground">
                Popular resources and additional tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link, index) => (
                <div
                  key={index}
                  className="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2">{link.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {link.description}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={link.href}>Learn More</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Help?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to
              help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/community">Join Community</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
