import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageCircle,
  Github,
  Twitter,
  Discord,
  BookOpen,
  Code,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  const communityStats = [
    { number: "10,000+", label: "Active Members" },
    { number: "50,000+", label: "Applications Built" },
    { number: "1,000+", label: "Templates Shared" },
    { number: "24/7", label: "Community Support" },
  ];

  const platforms = [
    {
      name: "Discord",
      description: "Real-time chat and collaboration",
      icon: <Discord className="h-8 w-8 text-indigo-600" />,
      members: "5,000+",
      features: [
        "Real-time chat",
        "Voice channels",
        "Screen sharing",
        "Bot integrations",
      ],
    },
    {
      name: "GitHub",
      description: "Open source projects and code sharing",
      icon: <Github className="h-8 w-8 text-gray-800" />,
      members: "2,500+",
      features: [
        "Code repositories",
        "Issue tracking",
        "Pull requests",
        "Documentation",
      ],
    },
    {
      name: "Twitter",
      description: "Updates and community highlights",
      icon: <Twitter className="h-8 w-8 text-blue-500" />,
      members: "15,000+",
      features: [
        "Latest updates",
        "Community highlights",
        "Tips & tricks",
        "Networking",
      ],
    },
  ];

  const events = [
    {
      title: "Weekly Build Sessions",
      description: "Join us every Friday for collaborative building sessions",
      date: "Every Friday, 2 PM PST",
      type: "Virtual",
    },
    {
      title: "Monthly Showcase",
      description:
        "Show off your creations and get feedback from the community",
      date: "First Saturday of each month",
      type: "Virtual",
    },
    {
      title: "Rockket Conference 2025",
      description:
        "Annual conference featuring talks, workshops, and networking",
      date: "March 15-17, 2025",
      type: "In-Person",
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
              Join Our <span className="gradient-text">Community</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with thousands of developers, designers, and creators
              building amazing applications with Rockket. Share knowledge, get
              help, and grow together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="https://discord.gg/rockket" target="_blank">
                  <Discord className="h-4 w-4 mr-2" />
                  Join Discord
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/rockket" target="_blank">
                  <Github className="h-4 w-4 mr-2" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {communityStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Platforms */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Where We Connect
              </h2>
              <p className="text-xl text-muted-foreground">
                Join our community across multiple platforms
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {platforms.map((platform, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-6">
                    {platform.icon}
                    <div className="ml-4">
                      <h3 className="text-2xl font-semibold">
                        {platform.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {platform.members} members
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {platform.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {platform.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">Join {platform.name}</Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Community Events
              </h2>
              <p className="text-xl text-muted-foreground">
                Regular events and activities for our community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {event.date}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        event.type === "Virtual"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Community Guidelines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Users className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Be Respectful
                      </h3>
                      <p className="text-muted-foreground">
                        Treat all community members with respect and kindness.
                        We're all here to learn and grow together.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MessageCircle className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Help Others
                      </h3>
                      <p className="text-muted-foreground">
                        Share your knowledge and help fellow community members.
                        We all benefit when we help each other succeed.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Code className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Share Your Work
                      </h3>
                      <p className="text-muted-foreground">
                        Show off your creations and inspire others. Share
                        templates, code snippets, and lessons learned.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Zap className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Stay Positive
                      </h3>
                      <p className="text-muted-foreground">
                        Keep discussions constructive and positive. Focus on
                        solutions and learning opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Become part of our growing community of creators and developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="https://discord.gg/rockket" target="_blank">
                  <Discord className="h-4 w-4 mr-2" />
                  Join Discord
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
