import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Play, Code } from "lucide-react";
import Link from "next/link";

export default function ExamplesPage() {
  const examples = [
    {
      title: "E-commerce Store",
      description:
        "Complete online store with product catalog, shopping cart, and Stripe payments",
      image: "/api/placeholder/600/400",
      liveUrl: "https://demo-store.rockket.dev",
      githubUrl: "https://github.com/rockket/ecommerce-example",
      tech: ["Next.js", "Stripe", "Tailwind CSS"],
      features: [
        "Product catalog",
        "Shopping cart",
        "Payment processing",
        "Order management",
      ],
    },
    {
      title: "Blog Platform",
      description:
        "Modern blog with CMS, SEO optimization, and content management",
      image: "/api/placeholder/600/400",
      liveUrl: "https://demo-blog.rockket.dev",
      githubUrl: "https://github.com/rockket/blog-example",
      tech: ["Next.js", "Prisma", "PostgreSQL"],
      features: [
        "Content management",
        "SEO optimization",
        "Comments",
        "Categories",
      ],
    },
    {
      title: "Analytics Dashboard",
      description:
        "Business intelligence dashboard with charts, metrics, and reporting",
      image: "/api/placeholder/600/400",
      liveUrl: "https://demo-analytics.rockket.dev",
      githubUrl: "https://github.com/rockket/analytics-example",
      tech: ["React", "Chart.js", "D3.js"],
      features: ["Data visualization", "Custom metrics", "Reports", "Export"],
    },
    {
      title: "Team Collaboration",
      description: "Project management and team collaboration platform",
      image: "/api/placeholder/600/400",
      liveUrl: "https://demo-collaboration.rockket.dev",
      githubUrl: "https://github.com/rockket/collaboration-example",
      tech: ["Next.js", "Socket.io", "Redis"],
      features: [
        "Task management",
        "Real-time chat",
        "File sharing",
        "Notifications",
      ],
    },
    {
      title: "AI Chatbot",
      description:
        "Intelligent chatbot with natural language processing and context awareness",
      image: "/api/placeholder/600/400",
      liveUrl: "https://demo-chatbot.rockket.dev",
      githubUrl: "https://github.com/rockket/chatbot-example",
      tech: ["OpenAI", "Next.js", "WebSocket"],
      features: [
        "Natural language",
        "Context awareness",
        "Multi-language",
        "Analytics",
      ],
    },
    {
      title: "Learning Management",
      description:
        "Online learning platform with courses, student tracking, and certificates",
      image: "/api/placeholder/600/400",
      liveUrl: "https://demo-lms.rockket.dev",
      githubUrl: "https://github.com/rockket/lms-example",
      tech: ["Next.js", "Prisma", "PostgreSQL"],
      features: [
        "Course management",
        "Student tracking",
        "Progress reports",
        "Certificates",
      ],
    },
  ];

  const tutorials = [
    {
      title: "Building Your First App",
      description:
        "Step-by-step tutorial for creating your first application with Rockket",
      duration: "15 min",
      difficulty: "Beginner",
      href: "/tutorials/first-app",
    },
    {
      title: "AI Integration Guide",
      description: "Learn how to integrate AI features into your applications",
      duration: "25 min",
      difficulty: "Intermediate",
      href: "/tutorials/ai-integration",
    },
    {
      title: "E-commerce Setup",
      description: "Complete guide to setting up an online store with payments",
      duration: "45 min",
      difficulty: "Advanced",
      href: "/tutorials/ecommerce-setup",
    },
    {
      title: "Analytics Implementation",
      description: "Implement comprehensive analytics and tracking in your app",
      duration: "30 min",
      difficulty: "Intermediate",
      href: "/tutorials/analytics-implementation",
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
              Real-World <span className="gradient-text">Examples</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              See Rockket in action with real applications built by our
              community. Explore live demos, source code, and step-by-step
              tutorials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Start Building</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/templates">Browse Templates</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Examples Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={example.image}
                    alt={example.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold mb-3">
                      {example.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {example.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {example.tech.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-muted text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {example.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-4">
                      <Button asChild>
                        <Link href={example.liveUrl} target="_blank">
                          <Play className="h-4 w-4 mr-2" />
                          Live Demo
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={example.githubUrl} target="_blank">
                          <Github className="h-4 w-4 mr-2" />
                          Source Code
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tutorials Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Step-by-Step Tutorials
              </h2>
              <p className="text-xl text-muted-foreground">
                Learn how to build applications with our comprehensive tutorials
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tutorials.map((tutorial, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg border p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{tutorial.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{tutorial.duration}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          tutorial.difficulty === "Beginner"
                            ? "bg-green-100 text-green-800"
                            : tutorial.difficulty === "Intermediate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tutorial.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {tutorial.description}
                  </p>
                  <Button variant="outline" asChild>
                    <Link href={tutorial.href}>
                      <Code className="h-4 w-4 mr-2" />
                      Start Tutorial
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Share your creations, get help from the community, and contribute
              to open source examples.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/community">Join Community</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/github" target="_blank">
                  <Github className="h-4 w-4 mr-2" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
