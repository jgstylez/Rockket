"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Sparkles,
  Code,
  Database,
  Zap,
  CheckCircle,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface BusinessApplication {
  name: string;
  description: string;
  industry: string;
  techStack: string[];
  features: string[];
  architecture: {
    frontend: string;
    backend: string;
    database: string;
    deployment: string;
  };
  code: {
    frontend: string;
    backend: string;
    database: string;
    configuration: string;
  };
  integrations: {
    payments: string;
    cms: string;
    auth: string;
    analytics: string;
  };
  deployment: {
    instructions: string;
    environment: string;
    secrets: string[];
  };
  businessLogic: {
    workflows: string[];
    rules: string[];
    automations: string[];
  };
}

interface BusinessGeneratorProps {
  onApplicationGenerated?: (application: BusinessApplication) => void;
}

export function BusinessGenerator({
  onApplicationGenerated,
}: BusinessGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<BusinessApplication | null>(
    null
  );
  const [formData, setFormData] = useState({
    type: "ecommerce",
    name: "",
    description: "",
    industry: "",
    features: [] as string[],
    userTypes: [] as string[],
    paymentRequired: true,
    contentManagement: true,
    userAccounts: true,
    integrations: [] as string[],
    deployment: "cloudflare",
  });

  const businessTypes = [
    {
      id: "ecommerce",
      name: "E-commerce Store",
      description: "Complete online store with payments and inventory",
      icon: "🛒",
      features: [
        "Product catalog",
        "Shopping cart",
        "Payment processing",
        "Order management",
      ],
    },
    {
      id: "saas",
      name: "SaaS Application",
      description: "Software as a Service platform with subscriptions",
      icon: "💼",
      features: [
        "User management",
        "Subscription billing",
        "Multi-tenancy",
        "API access",
      ],
    },
    {
      id: "content",
      name: "Content Platform",
      description: "Content management and publishing platform",
      icon: "📝",
      features: [
        "Content creation",
        "Publishing workflow",
        "SEO optimization",
        "Analytics",
      ],
    },
    {
      id: "custom",
      name: "Custom Application",
      description: "Tailored business application based on your requirements",
      icon: "⚙️",
      features: ["Custom features based on requirements"],
    },
  ];

  const industries = [
    "Retail",
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Media",
    "Real Estate",
    "Manufacturing",
    "Services",
    "Non-profit",
  ];

  const availableFeatures = [
    "User authentication",
    "Payment processing",
    "Content management",
    "Analytics dashboard",
    "Email notifications",
    "File uploads",
    "Search functionality",
    "User roles",
    "API endpoints",
    "Mobile responsive",
  ];

  const availableIntegrations = [
    "Stripe",
    "PayPal",
    "Auth0",
    "Firebase",
    "SendGrid",
    "Twilio",
    "Google Analytics",
    "Mixpanel",
    "Intercom",
    "Zapier",
  ];

  const handleGenerate = async () => {
    if (!formData.name || !formData.description) {
      toast.error("Please provide application name and description");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/business-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedApp(result.application);
        onApplicationGenerated?.(result.application);
        toast.success("Business application generated successfully!");
      } else {
        throw new Error(result.error || "Failed to generate application");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate application"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleIntegrationToggle = (integration: string) => {
    setFormData((prev) => ({
      ...prev,
      integrations: prev.integrations.includes(integration)
        ? prev.integrations.filter((i) => i !== integration)
        : [...prev.integrations, integration],
    }));
  };

  const downloadCode = (
    type: "frontend" | "backend" | "database" | "configuration"
  ) => {
    if (!generatedApp) return;

    const content = generatedApp.code[type];
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedApp.name.toLowerCase().replace(/\s+/g, "-")}-${type}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 text-foreground">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Business Application Generator
        </h1>
        <p className="text-muted-foreground">
          Generate complete business applications with pre-configured payments,
          CMS, and user accounts
        </p>
      </div>

      <Tabs defaultValue="configure" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Application Type */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Application Type
                </CardTitle>
                <CardDescription>
                  Choose the type of business application to generate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {businessTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.type === type.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/20"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type: type.id }))
                      }
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <h3 className="font-semibold text-foreground">
                        {type.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Provide details about your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">
                    Application Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="My Business App"
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe what your application should do..."
                    rows={3}
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="industry" className="text-foreground">
                    Industry
                  </Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, industry: value }))
                    }
                  >
                    <SelectTrigger className="bg-card border-border text-foreground">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Features</CardTitle>
              <CardDescription>
                Select the features you want in your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {availableFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                      className="border-border"
                    />
                    <Label
                      htmlFor={feature}
                      className="text-sm text-foreground"
                    >
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Integrations</CardTitle>
              <CardDescription>
                Choose third-party services to integrate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {availableIntegrations.map((integration) => (
                  <div
                    key={integration}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={integration}
                      checked={formData.integrations.includes(integration)}
                      onCheckedChange={() =>
                        handleIntegrationToggle(integration)
                      }
                      className="border-border"
                    />
                    <Label
                      htmlFor={integration}
                      className="text-sm text-foreground"
                    >
                      {integration}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deployment */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Deployment</CardTitle>
              <CardDescription>Choose your deployment target</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.deployment}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, deployment: value }))
                }
              >
                <SelectTrigger className="bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloudflare">Cloudflare Workers</SelectItem>
                  <SelectItem value="vercel">Vercel</SelectItem>
                  <SelectItem value="aws">AWS</SelectItem>
                  <SelectItem value="docker">Docker</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Generate Your Application
              </CardTitle>
              <CardDescription>
                Review your configuration and generate the complete business
                application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Application Details
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-foreground">
                      <strong>Name:</strong> {formData.name || "Not specified"}
                    </p>
                    <p className="text-foreground">
                      <strong>Type:</strong>{" "}
                      {businessTypes.find((t) => t.id === formData.type)?.name}
                    </p>
                    <p className="text-foreground">
                      <strong>Industry:</strong>{" "}
                      {formData.industry || "Not specified"}
                    </p>
                    <p className="text-foreground">
                      <strong>Features:</strong> {formData.features.length}{" "}
                      selected
                    </p>
                    <p className="text-foreground">
                      <strong>Integrations:</strong>{" "}
                      {formData.integrations.length} selected
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Selected Features
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="bg-card-hover border-border"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={
                  isGenerating || !formData.name || !formData.description
                }
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Application...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Complete Business Application
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {generatedApp ? (
            <div className="space-y-6">
              {/* Application Overview */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <CheckCircle className="h-5 w-5 text-success" />
                    {generatedApp.name}
                  </CardTitle>
                  <CardDescription>{generatedApp.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {generatedApp.techStack.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="bg-card-hover border-border"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">
                        Features
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {generatedApp.features.map((feature) => (
                          <Badge
                            key={feature}
                            variant="secondary"
                            className="bg-card-hover border-border"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">
                        Business Logic
                      </h4>
                      <div className="space-y-1 text-sm text-foreground">
                        <p>
                          <strong>Workflows:</strong>{" "}
                          {generatedApp.businessLogic.workflows.length}
                        </p>
                        <p>
                          <strong>Rules:</strong>{" "}
                          {generatedApp.businessLogic.rules.length}
                        </p>
                        <p>
                          <strong>Automations:</strong>{" "}
                          {generatedApp.businessLogic.automations.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Code Downloads */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Generated Code
                  </CardTitle>
                  <CardDescription>
                    Download the complete application code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => downloadCode("frontend")}
                      className="flex items-center gap-2 bg-card border-border hover:bg-card-hover"
                    >
                      <Code className="h-4 w-4" />
                      Frontend
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadCode("backend")}
                      className="flex items-center gap-2 bg-card border-border hover:bg-card-hover"
                    >
                      <Database className="h-4 w-4" />
                      Backend
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadCode("database")}
                      className="flex items-center gap-2 bg-card border-border hover:bg-card-hover"
                    >
                      <Database className="h-4 w-4" />
                      Database
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadCode("configuration")}
                      className="flex items-center gap-2 bg-card border-border hover:bg-card-hover"
                    >
                      <Zap className="h-4 w-4" />
                      Config
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Deployment Instructions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Deployment Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-card-hover border border-border rounded-lg p-4">
                    <pre className="text-sm whitespace-pre-wrap text-foreground">
                      {generatedApp.deployment.instructions}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="text-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  No Application Generated Yet
                </h3>
                <p className="text-muted-foreground">
                  Configure your application and generate it to see the results
                  here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
