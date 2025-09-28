import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      value: "hello@rockket.dev",
      description: "Send us an email anytime",
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm PST",
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Office",
      value: "San Francisco, CA",
      description: "Visit our headquarters",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Response Time",
      value: "< 24 hours",
      description: "We'll get back to you quickly",
    },
  ];

  const departments = [
    {
      title: "Sales",
      email: "sales@rockket.dev",
      description: "Questions about pricing, plans, or enterprise solutions",
    },
    {
      title: "Support",
      email: "support@rockket.dev",
      description: "Technical support and troubleshooting",
    },
    {
      title: "Partnerships",
      email: "partnerships@rockket.dev",
      description: "Business partnerships and integrations",
    },
    {
      title: "Press",
      email: "press@rockket.dev",
      description: "Media inquiries and press releases",
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
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">{info.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                  <p className="text-primary font-medium mb-2">{info.value}</p>
                  <p className="text-sm text-muted-foreground">
                    {info.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium mb-2"
                    >
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    ></textarea>
                  </div>
                  <Button size="lg" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Contact by Department
                </h3>
                <div className="space-y-6">
                  {departments.map((dept, index) => (
                    <div key={index} className="p-6 bg-card rounded-lg border">
                      <h4 className="text-lg font-semibold mb-2">
                        {dept.title}
                      </h4>
                      <p className="text-primary font-medium mb-2">
                        {dept.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dept.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-muted rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">
                    Need Immediate Help?
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    For urgent technical issues, check our documentation or join
                    our community Discord.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm">
                      View Docs
                    </Button>
                    <Button variant="outline" size="sm">
                      Join Discord
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">
                  How quickly do you respond?
                </h3>
                <p className="text-muted-foreground">
                  We typically respond to all inquiries within 24 hours. For
                  urgent issues, we have priority support channels available.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">
                  Do you offer custom solutions?
                </h3>
                <p className="text-muted-foreground">
                  Yes! We offer custom development and enterprise solutions.
                  Contact our sales team to discuss your specific requirements.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">
                  Can I schedule a demo?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely! We'd love to show you how Rockket can help your
                  team. Schedule a personalized demo with our team.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">
                  Do you have a partner program?
                </h3>
                <p className="text-muted-foreground">
                  Yes, we have a comprehensive partner program for agencies,
                  consultants, and technology partners.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
