import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Zap,
  Palette,
  BarChart3,
  Shield,
  Users,
  Globe,
  Code,
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: "AI-Powered App Generation",
      description:
        "Generate complete applications using advanced AI with multiple providers including OpenAI, Anthropic, and Google AI.",
      highlights: [
        "Multiple AI providers",
        "Custom prompts",
        "Code generation",
        "Deployment instructions",
      ],
    },
    {
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: "Visual Builder",
      description:
        "Drag-and-drop interface builder with 50+ pre-built components for creating applications visually.",
      highlights: [
        "Drag & drop interface",
        "50+ components",
        "Real-time preview",
        "Export functionality",
      ],
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Analytics Dashboard",
      description:
        "Comprehensive analytics and business intelligence with real-time performance metrics.",
      highlights: [
        "User behavior tracking",
        "Performance metrics",
        "Custom events",
        "Data visualization",
      ],
    },
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Content Management",
      description:
        "Full-featured CMS with 12+ content block types, SEO optimization, and publishing workflow.",
      highlights: [
        "Page management",
        "Content blocks",
        "SEO optimization",
        "Publishing workflow",
      ],
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "E-commerce Platform",
      description:
        "Complete online store with product management, shopping cart, and payment processing.",
      highlights: [
        "Product catalog",
        "Shopping cart",
        "Order management",
        "Payment integration",
      ],
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Multi-tenant Architecture",
      description:
        "Enterprise-ready multi-tenant platform with complete tenant isolation and role-based access control.",
      highlights: [
        "Tenant isolation",
        "Role-based access",
        "Team management",
        "Organization settings",
      ],
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Security & Compliance",
      description:
        "Enterprise-grade security with JWT authentication, data encryption, and compliance features.",
      highlights: [
        "JWT authentication",
        "Data encryption",
        "Compliance engine",
        "Audit logging",
      ],
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Advanced Features",
      description:
        "Feature flags, progressive onboarding, vertical packs, and education system for complete business solutions.",
      highlights: [
        "Feature flags",
        "Progressive onboarding",
        "Vertical packs",
        "Education system",
      ],
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
              Powerful Features for{" "}
              <span className="gradient-text">Modern Applications</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Build, deploy, and scale applications with our comprehensive suite
              of AI-powered tools and enterprise-grade features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers and businesses who are already using
              Rockket to build their next big idea.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Start Building Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
