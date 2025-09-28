import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Shield, Eye, Lock, User, Database, Globe } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="h-6 w-6 text-primary" />,
      content: [
        "Account information (name, email, company)",
        "Usage data and analytics",
        "Application data and content",
        "Payment and billing information",
        "Communication records",
      ],
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="h-6 w-6 text-primary" />,
      content: [
        "Provide and improve our services",
        "Process payments and billing",
        "Send important service updates",
        "Provide customer support",
        "Analyze usage patterns and trends",
      ],
    },
    {
      title: "Information Sharing",
      icon: <Globe className="h-6 w-6 text-primary" />,
      content: [
        "We do not sell your personal information",
        "Share with service providers (payment processors, analytics)",
        "Comply with legal requirements",
        "Protect our rights and prevent fraud",
        "With your explicit consent",
      ],
    },
    {
      title: "Data Security",
      icon: <Lock className="h-6 w-6 text-primary" />,
      content: [
        "Encryption in transit and at rest",
        "Regular security audits and updates",
        "Access controls and authentication",
        "Secure data centers and infrastructure",
        "Employee training and background checks",
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
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your personal information.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
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
                Rockket ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                platform and services.
              </p>
              <p className="text-lg text-muted-foreground">
                By using our services, you agree to the collection and use of
                information in accordance with this policy. If you do not agree
                with our policies and practices, do not use our services.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Sections */}
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

        {/* Your Rights */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Your Rights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Access and Portability
                      </h3>
                      <p className="text-muted-foreground">
                        You can access and download your data at any time
                        through your account settings.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Lock className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Data Correction
                      </h3>
                      <p className="text-muted-foreground">
                        You can update or correct your personal information in
                        your account settings.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Shield className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Data Deletion
                      </h3>
                      <p className="text-muted-foreground">
                        You can request deletion of your account and associated
                        data at any time.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Eye className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Opt-out</h3>
                      <p className="text-muted-foreground">
                        You can opt out of marketing communications while
                        keeping service notifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Cookies and Tracking</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Essential Cookies
                  </h3>
                  <p className="text-muted-foreground">
                    These cookies are necessary for the website to function and
                    cannot be switched off. They are usually only set in
                    response to actions made by you which amount to a request
                    for services.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Analytics Cookies
                  </h3>
                  <p className="text-muted-foreground">
                    These cookies allow us to count visits and traffic sources
                    so we can measure and improve the performance of our site.
                    They help us to know which pages are the most and least
                    popular.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Functional Cookies
                  </h3>
                  <p className="text-muted-foreground">
                    These cookies enable the website to provide enhanced
                    functionality and personalization. They may be set by us or
                    by third party providers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Questions About Privacy?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@rockket.dev"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Shield className="h-4 w-4 mr-2" />
                privacy@rockket.dev
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
