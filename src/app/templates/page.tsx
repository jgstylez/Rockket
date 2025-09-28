import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  ShoppingCart,
  BookOpen,
  BarChart3,
  Users,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function TemplatesPage() {
  const templates = [
    {
      title: "E-commerce Store",
      description:
        "Complete online store with product catalog, shopping cart, and payment processing",
      category: "E-commerce",
      icon: <ShoppingCart className="h-8 w-8 text-blue-600" />,
      features: [
        "Product catalog",
        "Shopping cart",
        "Payment processing",
        "Order management",
      ],
      complexity: "Intermediate",
      time: "2-3 hours",
    },
    {
      title: "Blog Platform",
      description:
        "Modern blog with CMS, SEO optimization, and content management",
      category: "Content",
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      features: [
        "Content management",
        "SEO optimization",
        "Comments",
        "Categories",
      ],
      complexity: "Beginner",
      time: "1-2 hours",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Business intelligence dashboard with charts, metrics, and reporting",
      category: "Analytics",
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      features: ["Data visualization", "Custom metrics", "Reports", "Export"],
      complexity: "Advanced",
      time: "3-4 hours",
    },
    {
      title: "Team Collaboration",
      description: "Project management and team collaboration platform",
      category: "Productivity",
      icon: <Users className="h-8 w-8 text-orange-600" />,
      features: [
        "Task management",
        "Team chat",
        "File sharing",
        "Notifications",
      ],
      complexity: "Intermediate",
      time: "2-3 hours",
    },
    {
      title: "Security Portal",
      description:
        "Enterprise security dashboard with compliance and monitoring",
      category: "Security",
      icon: <Shield className="h-8 w-8 text-red-600" />,
      features: [
        "Compliance tracking",
        "Security monitoring",
        "Audit logs",
        "Reports",
      ],
      complexity: "Advanced",
      time: "4-5 hours",
    },
    {
      title: "AI Chatbot",
      description: "Intelligent chatbot with natural language processing",
      category: "AI",
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      features: [
        "Natural language",
        "Context awareness",
        "Multi-language",
        "Analytics",
      ],
      complexity: "Advanced",
      time: "3-4 hours",
    },
    {
      title: "Portfolio Website",
      description: "Professional portfolio with projects, skills, and contact",
      category: "Portfolio",
      icon: <Globe className="h-8 w-8 text-indigo-600" />,
      features: [
        "Project showcase",
        "Skills display",
        "Contact form",
        "Responsive",
      ],
      complexity: "Beginner",
      time: "1-2 hours",
    },
    {
      title: "Learning Management",
      description:
        "Online learning platform with courses and student management",
      category: "Education",
      icon: <BookOpen className="h-8 w-8 text-teal-600" />,
      features: [
        "Course management",
        "Student tracking",
        "Progress reports",
        "Certificates",
      ],
      complexity: "Advanced",
      time: "4-6 hours",
    },
  ];

  const categories = [
    { name: "All", count: 8 },
    { name: "E-commerce", count: 1 },
    { name: "Content", count: 1 },
    { name: "Analytics", count: 1 },
    { name: "Productivity", count: 1 },
    { name: "Security", count: 1 },
    { name: "AI", count: 1 },
    { name: "Portfolio", count: 1 },
    { name: "Education", count: 1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Application <span className="gradient-text">Templates</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Start building faster with our collection of pre-built application
              templates. Choose from various categories and customize to your
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Start Building</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">View Demo</Link>
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

        {/* Templates Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      {template.icon}
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold">
                          {template.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {template.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {template.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            template.complexity === "Beginner"
                              ? "bg-green-100 text-green-800"
                              : template.complexity === "Intermediate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {template.complexity}
                        </span>
                        <span>{template.time}</span>
                      </div>
                    </div>
                    <Button className="w-full">Use Template</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Template CTA */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need a Custom Template?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Create your own template or
              request a custom one from our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard/builder">Create Custom Template</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Request Template</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
