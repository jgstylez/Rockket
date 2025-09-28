import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Rocket, Users, Target, Award, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description:
        "We're constantly pushing the boundaries of what's possible with AI and no-code development.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community",
      description:
        "We believe in the power of community and collaboration to drive innovation forward.",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from our products to our customer support.",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Passion",
      description:
        "We're passionate about empowering creators and democratizing access to technology.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-founder",
      image: "/api/placeholder/200/200",
      bio: "Former Google engineer with 10+ years in AI and machine learning.",
    },
    {
      name: "Mike Chen",
      role: "CTO & Co-founder",
      image: "/api/placeholder/200/200",
      bio: "Full-stack developer and open source contributor with expertise in scalable systems.",
    },
    {
      name: "Emma Wilson",
      role: "Head of Product",
      image: "/api/placeholder/200/200",
      bio: "Product strategist with experience building developer tools at Microsoft and GitHub.",
    },
    {
      name: "Alex Rodriguez",
      role: "Head of Engineering",
      image: "/api/placeholder/200/200",
      bio: "Senior engineer specializing in distributed systems and cloud architecture.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50,000+", label: "Applications Built" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="gradient-text">Rockket</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We're on a mission to democratize application development by
              making it accessible to everyone, regardless of technical
              background.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe that everyone should have the power to build
                  amazing applications, regardless of their technical
                  background. Our platform combines the power of AI with
                  intuitive visual tools to make application development
                  accessible to all.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  From entrepreneurs with big ideas to established businesses
                  looking to innovate, Rockket empowers creators to turn their
                  visions into reality without the traditional barriers of
                  coding and technical complexity.
                </p>
                <Button size="lg" asChild>
                  <Link href="/auth/register">Join Our Mission</Link>
                </Button>
              </div>
              <div className="bg-card rounded-lg border p-8">
                <h3 className="text-2xl font-semibold mb-6">Our Vision</h3>
                <p className="text-muted-foreground mb-6">
                  To create a world where anyone can build the applications they
                  need, when they need them, without barriers.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-3" />
                    <span>Democratize technology access</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-3" />
                    <span>Accelerate innovation</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-3" />
                    <span>Empower creators worldwide</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Values
              </h2>
              <p className="text-xl text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                By the Numbers
              </h2>
              <p className="text-xl text-muted-foreground">
                Our impact in the developer community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
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

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Meet Our Team
              </h2>
              <p className="text-xl text-muted-foreground">
                The passionate people behind Rockket
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
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
              Join thousands of creators who are already building the future
              with Rockket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Get Started Free</Link>
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
