import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FileText, Scale, Shield, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <FileText className="h-6 w-6 text-primary" />,
      content: [
        "By accessing and using Rockket, you accept and agree to be bound by these terms",
        "If you do not agree to these terms, you may not use our services",
        "We reserve the right to modify these terms at any time",
        "Continued use after changes constitutes acceptance of new terms",
      ],
    },
    {
      title: "Use of Services",
      icon: <Scale className="h-6 w-6 text-primary" />,
      content: [
        "You may use our services for lawful purposes only",
        "You are responsible for all content you create and share",
        "You must not violate any applicable laws or regulations",
        "You may not attempt to gain unauthorized access to our systems",
      ],
    },
    {
      title: "User Accounts",
      icon: <Shield className="h-6 w-6 text-primary" />,
      content: [
        "You must provide accurate and complete information",
        "You are responsible for maintaining account security",
        "You must notify us immediately of any unauthorized use",
        "We may suspend or terminate accounts that violate these terms",
      ],
    },
    {
      title: "Intellectual Property",
      icon: <FileText className="h-6 w-6 text-primary" />,
      content: [
        "You retain ownership of content you create",
        "You grant us a license to use your content to provide services",
        "We own all rights to our platform and technology",
        "You may not copy, modify, or distribute our software",
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
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              These terms govern your use of Rockket and our services. Please
              read them carefully before using our platform.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Last updated: December 15, 2024
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Overview</h2>
              <p className="text-lg text-muted-foreground mb-6">
                These Terms of Service ("Terms") govern your use of Rockket's
                platform, services, and applications. By using our services, you
                agree to be bound by these terms and our Privacy Policy.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">
                      Important Notice
                    </h3>
                    <p className="text-amber-700">
                      These terms contain important information about your
                      rights and obligations. Please read them carefully and
                      contact us if you have any questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-6">
                    {section.icon}
                    <h3 className="text-2xl font-semibold ml-4">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Terms */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Payment and Billing</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Subscription Fees
                  </h3>
                  <p className="text-muted-foreground">
                    Subscription fees are billed in advance on a monthly or
                    annual basis. All fees are non-refundable except as required
                    by law.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Price Changes</h3>
                  <p className="text-muted-foreground">
                    We may change our prices at any time. We will provide at
                    least 30 days notice before any price changes take effect.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Cancellation</h3>
                  <p className="text-muted-foreground">
                    You may cancel your subscription at any time. Cancellation
                    takes effect at the end of your current billing period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Limitation of Liability
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Service Availability
                  </h3>
                  <p className="text-muted-foreground">
                    We strive to maintain high service availability, but we do
                    not guarantee uninterrupted access to our services. We are
                    not liable for any downtime or service interruptions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Data Loss</h3>
                  <p className="text-muted-foreground">
                    While we implement robust backup and security measures, you
                    are responsible for backing up your data. We are not liable
                    for any data loss.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Third-Party Services
                  </h3>
                  <p className="text-muted-foreground">
                    Our services may integrate with third-party services. We are
                    not responsible for the availability or functionality of
                    these services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Governing Law and Disputes
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Governing Law</h3>
                  <p className="text-muted-foreground">
                    These terms are governed by the laws of the State of
                    California, United States, without regard to conflict of law
                    principles.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Dispute Resolution
                  </h3>
                  <p className="text-muted-foreground">
                    Any disputes arising from these terms or your use of our
                    services will be resolved through binding arbitration in San
                    Francisco, California.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Severability</h3>
                  <p className="text-muted-foreground">
                    If any provision of these terms is found to be
                    unenforceable, the remaining provisions will remain in full
                    force and effect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Questions About Terms?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service, please
              contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@rockket.dev"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Scale className="h-4 w-4 mr-2" />
                legal@rockket.dev
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Contact Form
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
