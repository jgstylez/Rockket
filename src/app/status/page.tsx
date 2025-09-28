import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

export default function StatusPage() {
  const services = [
    {
      name: "API Services",
      status: "operational",
      uptime: "99.9%",
      responseTime: "120ms",
    },
    {
      name: "AI Generation",
      status: "operational",
      uptime: "99.8%",
      responseTime: "2.1s",
    },
    {
      name: "Visual Builder",
      status: "operational",
      uptime: "99.9%",
      responseTime: "85ms",
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.95%",
      responseTime: "45ms",
    },
    {
      name: "Authentication",
      status: "operational",
      uptime: "99.9%",
      responseTime: "95ms",
    },
    {
      name: "File Storage",
      status: "operational",
      uptime: "99.9%",
      responseTime: "180ms",
    },
  ];

  const incidents = [
    {
      title: "Scheduled Maintenance",
      status: "resolved",
      date: "December 10, 2024",
      description: "Planned maintenance window for database optimization",
    },
    {
      title: "API Rate Limiting Issue",
      status: "resolved",
      date: "December 5, 2024",
      description:
        "Temporary issue with rate limiting affecting some API endpoints",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "outage":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              System <span className="gradient-text">Status</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Real-time status of all Rockket services and infrastructure. We're
              committed to providing 99.9% uptime for our platform.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                All Systems Operational
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Last updated: 2 minutes ago
              </div>
            </div>
          </div>
        </section>

        {/* Overall Status */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Overall Status
              </h2>
              <div className="inline-flex items-center gap-4 p-6 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-green-600">
                    All Systems Operational
                  </div>
                  <div className="text-green-600">No incidents reported</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Status */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Service Status
              </h2>
              <p className="text-xl text-muted-foreground">
                Detailed status of all platform services
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    {getStatusIcon(service.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span
                        className={`font-medium ${getStatusColor(service.status)}`}
                      >
                        {service.status.charAt(0).toUpperCase() +
                          service.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uptime:</span>
                      <span className="font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Response Time:
                      </span>
                      <span className="font-medium">
                        {service.responseTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Recent Incidents
              </h2>
              <p className="text-xl text-muted-foreground">
                Past incidents and maintenance windows
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              {incidents.length > 0 ? (
                <div className="space-y-6">
                  {incidents.map((incident, index) => (
                    <div key={index} className="p-6 bg-card rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {incident.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            incident.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {incident.status.charAt(0).toUpperCase() +
                            incident.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {incident.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {incident.date}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Recent Incidents
                  </h3>
                  <p className="text-muted-foreground">
                    All systems have been running smoothly with no reported
                    issues.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get notified about service status updates and incidents via email
              or RSS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="lg">Subscribe</Button>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <a href="/status.rss" className="hover:text-primary">
                RSS Feed
              </a>{" "}
              •
              <a href="/status.json" className="hover:text-primary ml-2">
                JSON API
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
