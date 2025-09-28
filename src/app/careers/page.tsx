import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Heart, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Full-Stack Engineer",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      department: "Engineering",
      description:
        "Join our engineering team to build the next generation of AI-powered development tools.",
    },
    {
      title: "Product Manager",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      department: "Product",
      description:
        "Lead product strategy and work with cross-functional teams to deliver amazing user experiences.",
    },
    {
      title: "AI/ML Engineer",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      department: "Engineering",
      description:
        "Work on cutting-edge AI features and help integrate multiple AI providers into our platform.",
    },
    {
      title: "Frontend Developer",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      department: "Engineering",
      description:
        "Build beautiful, responsive user interfaces using React, Next.js, and modern web technologies.",
    },
    {
      title: "DevOps Engineer",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      department: "Engineering",
      description:
        "Manage our cloud infrastructure and ensure high availability and performance of our platform.",
    },
    {
      title: "Customer Success Manager",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      department: "Customer Success",
      description:
        "Help our customers succeed and grow with our platform through onboarding and ongoing support.",
    },
  ];

  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Health & Wellness",
      description:
        "Comprehensive health, dental, and vision coverage for you and your family",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Learning & Development",
      description:
        "Annual learning budget and conference attendance to help you grow",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Remote Work",
      description:
        "Work from anywhere with flexible hours and home office stipend",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Team Events",
      description: "Regular team building events and company retreats",
    },
  ];

  const values = [
    "Innovation and creativity in everything we do",
    "Collaboration and open communication",
    "Continuous learning and personal growth",
    "Work-life balance and flexibility",
    "Diversity and inclusion",
    "Customer-centric approach",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Help us build the future of application development. We're looking
              for passionate, talented individuals who want to make a
              difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#open-positions">View Open Positions</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Join Rockket?
              </h2>
              <p className="text-xl text-muted-foreground">
                Be part of a mission-driven team building the future
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Open Positions
              </h2>
              <p className="text-xl text-muted-foreground">
                Find your next opportunity with us
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {openPositions.map((position, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {position.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {position.department}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {position.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Apply Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Values
              </h2>
              <p className="text-xl text-muted-foreground">
                The principles that guide our work and culture
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-6 bg-card rounded-lg border text-center"
                >
                  <div className="w-3 h-3 bg-primary rounded-full mx-auto mb-4"></div>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Application Process
              </h2>
              <p className="text-xl text-muted-foreground">
                How we hire and what to expect
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Apply</h3>
                <p className="text-sm text-muted-foreground">
                  Submit your application with resume and cover letter
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Initial Call</h3>
                <p className="text-sm text-muted-foreground">
                  Brief phone call to discuss the role and your background
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Technical Interview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Technical assessment and coding challenge
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Final Interview</h3>
                <p className="text-sm text-muted-foreground">
                  Meet the team and discuss culture fit
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Don't See Your Role?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always looking for talented people. Send us your resume and
              tell us how you'd like to contribute to our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Send Resume</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
