import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  BarChart3,
  Mail,
  CreditCard,
  Database,
  Globe,
  Code,
} from "lucide-react";
import Link from "next/link";

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "Stripe",
      description: "Accept payments and manage subscriptions",
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      category: "Payments",
      features: [
        "Payment processing",
        "Subscription management",
        "Webhooks",
        "Analytics",
      ],
    },
    {
      name: "Resend",
      description: "Send transactional emails and newsletters",
      icon: <Mail className="h-8 w-8 text-green-600" />,
      category: "Email",
      features: [
        "Transactional emails",
        "Newsletters",
        "Templates",
        "Analytics",
      ],
    },
    {
      name: "PostHog",
      description: "Advanced analytics and user behavior tracking",
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      category: "Analytics",
      features: ["User tracking", "Event analytics", "Funnels", "Cohorts"],
    },
    {
      name: "Auth0",
      description: "Enterprise authentication and user management",
      icon: <Shield className="h-8 w-8 text-orange-600" />,
      category: "Authentication",
      features: ["SSO", "MFA", "User management", "Compliance"],
    },
    {
      name: "AWS S3",
      description: "Cloud storage for files and media",
      icon: <Database className="h-8 w-8 text-yellow-600" />,
      category: "Storage",
      features: ["File storage", "CDN", "Backup", "Security"],
    },
    {
      name: "Zapier",
      description: "Connect with 5000+ apps and automate workflows",
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      category: "Automation",
      features: [
        "Workflow automation",
        "App connections",
        "Triggers",
        "Actions",
      ],
    },
    {
      name: "Slack",
      description: "Team communication and notifications",
      icon: <Globe className="h-8 w-8 text-purple-500" />,
      category: "Communication",
      features: ["Notifications", "Team chat", "Bot integration", "Channels"],
    },
    {
      name: "GitHub",
      description: "Version control and code management",
      icon: <Code className="h-8 w-8 text-gray-800" />,
      category: "Development",
      features: ["Version control", "CI/CD", "Code review", "Collaboration"],
    },
  ];

  const categories = [
    { name: "All", count: 8 },
    { name: "Payments", count: 1 },
    { name: "Email", count: 1 },
    { name: "Analytics", count: 1 },
    { name: "Authentication", count: 1 },
    { name: "Storage", count: 1 },
    { name: "Automation", count: 1 },
    { name: "Communication", count: 1 },
    { name: "Development", count: 1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful <span className="gradient-text">Integrations</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect Rockket with your favorite tools and services. Build
              powerful workflows and automate your processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Start Building</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Request Integration</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-10 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    {integration.icon}
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold">
                        {integration.name}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {integration.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {integration.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {integration.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="w-full">
                    Configure
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Don't See Your Integration?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're constantly adding new integrations. Request one or build
              your own custom integration using our API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Request Integration</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/api-docs">View API Docs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
