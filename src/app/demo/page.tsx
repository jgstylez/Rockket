import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Play,
  Rocket,
  Palette,
  BarChart3,
  Code,
  Zap,
  Users,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const demos = [
    {
      title: "AI App Generator",
      description:
        "See how our AI creates complete applications from simple prompts",
      icon: <Rocket className="h-8 w-8 text-primary" />,
      features: [
        "Multiple AI providers",
        "Code generation",
        "Deployment instructions",
      ],
      duration: "5 min",
      difficulty: "Beginner",
    },
    {
      title: "Visual Builder",
      description: "Experience our drag-and-drop interface builder",
      icon: <Palette className="h-8 w-8 text-primary" />,
      features: ["50+ components", "Real-time preview", "Export functionality"],
      duration: "8 min",
      difficulty: "Beginner",
    },
    {
      title: "Analytics Dashboard",
      description: "Explore our comprehensive analytics and reporting features",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      features: ["User tracking", "Custom metrics", "Data visualization"],
      duration: "6 min",
      difficulty: "Intermediate",
    },
    {
      title: "E-commerce Platform",
      description: "Build a complete online store with payment processing",
      icon: <Code className="h-8 w-8 text-primary" />,
      features: ["Product catalog", "Shopping cart", "Payment integration"],
      duration: "10 min",
      difficulty: "Intermediate",
    },
  ];

  const liveExamples = [
    {
      title: "E-commerce Store",
      description: "Complete online store built with Rockket",
      image: "/api/placeholder/600/400",
      liveUrl: "https://demo-store.rockket.dev",
      features: [
        "Product catalog",
        "Shopping cart",
        "Stripe payments",
        "Order management",
      ],
    },
    {
      title: "Blog Platform",
      description: "Modern blog with CMS and SEO optimization",
      image: "/api/placeholder/600/400",
      liveUrl: "https://demo-blog.rockket.dev",
      features: [
        "Content management",
        "SEO optimization",
        "Comments",
        "Categories",
      ],
    },
    {
      title: "Analytics Dashboard",
      description: "Business intelligence dashboard with real-time data",
      image: "/api/placeholder/600/400",
      liveUrl: "https://demo-analytics.rockket.dev",
      features: ["Data visualization", "Custom metrics", "Reports", "Export"],
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
              Try <span className="gradient-text">Rockket</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience the power of AI-powered application development. Try
              our interactive demos and see what you can build in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#interactive-demos">View Demos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Demos */}
        <section id="interactive-demos" className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Interactive Demos
              </h2>
              <p className="text-xl text-muted-foreground">
                Try our features hands-on with guided demonstrations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {demos.map((demo, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-6">
                    {demo.icon}
                    <div className="ml-4">
                      <h3 className="text-2xl font-semibold">{demo.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{demo.duration}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            demo.difficulty === "Beginner"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {demo.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {demo.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {demo.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Demo
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Examples */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Live Examples
              </h2>
              <p className="text-xl text-muted-foreground">
                See real applications built with Rockket
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {liveExamples.map((example, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={example.image}
                    alt={example.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">
                      {example.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {example.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {example.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" asChild>
                      <Link href={example.liveUrl} target="_blank">
                        <Play className="h-4 w-4 mr-2" />
                        View Live Demo
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Demo */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Watch Rockket in Action
              </h2>
              <p className="text-xl text-muted-foreground">
                See how easy it is to build applications with our platform
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Play className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Demo Video</h3>
                    <p className="text-muted-foreground">
                      Watch our 5-minute product demo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Key Features
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to build amazing applications
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-card rounded-lg border">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">
                  Generate complete applications with AI
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg border">
                <Palette className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Visual Builder</h3>
                <p className="text-sm text-muted-foreground">
                  Drag-and-drop interface builder
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg border">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Multi-tenant</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-ready architecture
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg border">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Building?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers and businesses who are already using
              Rockket to build amazing applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
