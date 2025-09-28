import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Cookie, Settings, Shield, Eye, Database, Globe } from "lucide-react";

export default function CookiesPage() {
  const cookieTypes = [
    {
      title: "Essential Cookies",
      icon: <Shield className="h-6 w-6 text-primary" />,
      description:
        "These cookies are necessary for the website to function and cannot be switched off.",
      examples: [
        "Authentication cookies",
        "Session management",
        "Security tokens",
        "Load balancing",
      ],
      required: true,
    },
    {
      title: "Analytics Cookies",
      icon: <Eye className="h-6 w-6 text-primary" />,
      description:
        "These cookies help us understand how visitors interact with our website.",
      examples: [
        "Page views and traffic",
        "User behavior patterns",
        "Performance metrics",
        "Error tracking",
      ],
      required: false,
    },
    {
      title: "Functional Cookies",
      icon: <Settings className="h-6 w-6 text-primary" />,
      description:
        "These cookies enable enhanced functionality and personalization.",
      examples: [
        "User preferences",
        "Language settings",
        "Theme selection",
        "Feature flags",
      ],
      required: false,
    },
    {
      title: "Marketing Cookies",
      icon: <Globe className="h-6 w-6 text-primary" />,
      description:
        "These cookies are used to deliver relevant advertisements and marketing content.",
      examples: [
        "Ad targeting",
        "Campaign tracking",
        "Conversion measurement",
        "Social media integration",
      ],
      required: false,
    },
  ];

  const cookieDetails = [
    {
      name: "_rockket_session",
      purpose: "Maintains user session and authentication state",
      duration: "Session",
      type: "Essential",
    },
    {
      name: "_rockket_csrf",
      purpose: "Protects against cross-site request forgery attacks",
      duration: "Session",
      type: "Essential",
    },
    {
      name: "_rockket_preferences",
      purpose: "Stores user preferences and settings",
      duration: "1 year",
      type: "Functional",
    },
    {
      name: "_ga",
      purpose: "Google Analytics - tracks user interactions",
      duration: "2 years",
      type: "Analytics",
    },
    {
      name: "_gid",
      purpose: "Google Analytics - distinguishes users",
      duration: "24 hours",
      type: "Analytics",
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
              Cookie <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Learn about how we use cookies and similar technologies to improve
              your experience on our platform.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Cookie className="h-4 w-4 text-primary" />
                Last updated: December 15, 2024
              </div>
            </div>
          </div>
        </section>

        {/* What Are Cookies */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">What Are Cookies?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Cookies are small text files that are stored on your device when
                you visit a website. They help websites remember information
                about your visit, such as your preferred language and other
                settings, making your next visit easier and the site more useful
                to you.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Database className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      How We Use Cookies
                    </h3>
                    <p className="text-blue-700">
                      We use cookies to provide, protect, and improve our
                      services, such as by personalizing content, offering and
                      measuring advertisements, understanding user behavior, and
                      providing a safer experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cookie Types */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Types of Cookies We Use
              </h2>
              <p className="text-xl text-muted-foreground">
                We use different types of cookies for various purposes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cookieTypes.map((type, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-6">
                    {type.icon}
                    <h3 className="text-2xl font-semibold ml-4">
                      {type.title}
                    </h3>
                    {type.required && (
                      <span className="ml-auto px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {type.description}
                  </p>
                  <div>
                    <h4 className="font-semibold mb-3">Examples:</h4>
                    <ul className="space-y-2">
                      {type.examples.map((example, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cookie Details */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Specific Cookies We Use
              </h2>
              <p className="text-xl text-muted-foreground">
                Detailed information about the cookies we set
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-semibold">
                          Cookie Name
                        </th>
                        <th className="text-left p-4 font-semibold">Purpose</th>
                        <th className="text-left p-4 font-semibold">
                          Duration
                        </th>
                        <th className="text-left p-4 font-semibold">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cookieDetails.map((cookie, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-4 font-mono text-sm">
                            {cookie.name}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {cookie.purpose}
                          </td>
                          <td className="p-4 text-sm">{cookie.duration}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                cookie.type === "Essential"
                                  ? "bg-red-100 text-red-800"
                                  : cookie.type === "Functional"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {cookie.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Managing Your Cookie Preferences
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Cookie Settings
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You can control and manage cookies in various ways. Please
                    note that removing or blocking cookies can negatively impact
                    your user experience and parts of our website may no longer
                    be fully accessible.
                  </p>
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">Essential Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Required for basic website functionality
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-3">
                          Always Active
                        </span>
                        <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">Analytics Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Help us understand how you use our website
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-3">
                          Optional
                        </span>
                        <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center px-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Marketing Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Used to deliver relevant advertisements
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-3">
                          Optional
                        </span>
                        <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center px-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Browser Settings
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Most web browsers allow you to control cookies through their
                    settings preferences. However, limiting the ability of
                    websites to set cookies may worsen your overall user
                    experience.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-semibold mb-2">Chrome</h4>
                      <p className="text-sm text-muted-foreground">
                        Settings → Privacy and security → Cookies and other site
                        data
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-semibold mb-2">Firefox</h4>
                      <p className="text-sm text-muted-foreground">
                        Settings → Privacy & Security → Cookies and Site Data
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-semibold mb-2">Safari</h4>
                      <p className="text-sm text-muted-foreground">
                        Preferences → Privacy → Manage Website Data
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-semibold mb-2">Edge</h4>
                      <p className="text-sm text-muted-foreground">
                        Settings → Cookies and site permissions → Cookies and
                        site data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Questions About Cookies?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              If you have any questions about our use of cookies, please contact
              us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@rockket.dev"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Cookie className="h-4 w-4 mr-2" />
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
