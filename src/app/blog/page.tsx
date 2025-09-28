import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const featuredPost = {
    title: "Building Your First AI-Powered Application with Rockket",
    excerpt:
      "Learn how to create a complete web application using our AI generator in just minutes. From concept to deployment, we'll walk you through the entire process.",
    author: "Sarah Johnson",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "Tutorial",
    image: "/api/placeholder/800/400",
    href: "/blog/building-first-ai-app",
  };

  const posts = [
    {
      title: "The Future of No-Code Development: AI and Visual Builders",
      excerpt:
        "Exploring how AI is revolutionizing the way we build applications and what it means for developers.",
      author: "Mike Chen",
      date: "December 12, 2024",
      readTime: "6 min read",
      category: "Industry",
      image: "/api/placeholder/400/250",
      href: "/blog/future-nocode-development",
    },
    {
      title: "10 Best Practices for Multi-Tenant SaaS Architecture",
      excerpt:
        "Essential strategies for building scalable, secure multi-tenant applications that can handle millions of users.",
      author: "Alex Rodriguez",
      date: "December 10, 2024",
      readTime: "12 min read",
      category: "Architecture",
      image: "/api/placeholder/400/250",
      href: "/blog/multitenant-saas-best-practices",
    },
    {
      title: "How We Built Rockket: A Technical Deep Dive",
      excerpt:
        "Behind the scenes look at the technology stack and architecture decisions that power Rockket.",
      author: "Rockket Team",
      date: "December 8, 2024",
      readTime: "15 min read",
      category: "Engineering",
      image: "/api/placeholder/400/250",
      href: "/blog/building-rockket-technical-deep-dive",
    },
    {
      title: "E-commerce Made Simple: Building Online Stores with Rockket",
      excerpt:
        "Step-by-step guide to creating a professional online store without writing a single line of code.",
      author: "Emma Wilson",
      date: "December 5, 2024",
      readTime: "10 min read",
      category: "Tutorial",
      image: "/api/placeholder/400/250",
      href: "/blog/ecommerce-made-simple",
    },
    {
      title: "Analytics That Matter: Tracking User Behavior in Your Apps",
      excerpt:
        "Learn how to implement meaningful analytics that help you understand your users and improve your applications.",
      author: "David Kim",
      date: "December 3, 2024",
      readTime: "7 min read",
      category: "Analytics",
      image: "/api/placeholder/400/250",
      href: "/blog/analytics-that-matter",
    },
    {
      title: "Security First: Protecting Your Applications and User Data",
      excerpt:
        "Essential security practices for modern web applications and how to implement them effectively.",
      author: "Lisa Thompson",
      date: "December 1, 2024",
      readTime: "9 min read",
      category: "Security",
      image: "/api/placeholder/400/250",
      href: "/blog/security-first-protecting-apps",
    },
  ];

  const categories = [
    { name: "All", count: 24, active: true },
    { name: "Tutorial", count: 8, active: false },
    { name: "Industry", count: 5, active: false },
    { name: "Architecture", count: 4, active: false },
    { name: "Engineering", count: 3, active: false },
    { name: "Analytics", count: 2, active: false },
    { name: "Security", count: 2, active: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Rockket <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Insights, tutorials, and best practices for building amazing
              applications. Stay updated with the latest in AI, no-code
              development, and modern web technologies.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
            <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {featuredPost.date}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={featuredPost.href}>
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
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
                  variant={category.active ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <article
                  key={index}
                  className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {post.date}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={post.href}>
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get the latest articles, tutorials, and product updates delivered
              to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="lg">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
