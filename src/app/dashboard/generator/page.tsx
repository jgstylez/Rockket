"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Wand2,
  Code,
  Download,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

interface AppTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  techStack: string[];
  features: string[];
  complexity: string;
  estimatedTime: string;
}

interface GeneratedApp {
  name: string;
  description: string;
  techStack: string[];
  features: string[];
  code: {
    frontend: string;
    backend: string;
    database: string;
  };
  deployment: string;
}

export default function GeneratorPage() {
  const { user, tenant } = useAuth();
  const [templates, setTemplates] = useState<AppTemplate[]>([]);
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("openai");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
  const [copiedSection, setCopiedSection] = useState<string>("");

  useEffect(() => {
    loadTemplates();
    loadProviders();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch("/api/ai/templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  const loadProviders = async () => {
    try {
      const response = await fetch("/api/ai/providers");
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers);
      }
    } catch (error) {
      console.error("Failed to load providers:", error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate && !customPrompt.trim()) {
      alert("Please select a template or enter a custom prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplate || undefined,
          prompt: customPrompt || undefined,
          provider: selectedProvider,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedApp(data.result.data);
      } else {
        const error = await response.json();
        alert(`Generation failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate application");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(""), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading generator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Rockket</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">AI App Generator</h1>
            <p className="text-muted-foreground">
              Generate complete applications using AI. Choose a template or
              describe your idea.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generator Form */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Generate Your App
                </h2>

                {/* AI Provider Selection */}
                <div className="mb-4">
                  <label className="form-label">AI Provider</label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="input-field"
                  >
                    {providers.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider.charAt(0).toUpperCase() + provider.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Template Selection */}
                <div className="mb-4">
                  <label className="form-label">
                    Choose a Template (Optional)
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select a template...</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} - {template.complexity}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Prompt */}
                <div className="mb-6">
                  <label className="form-label">Custom Prompt (Optional)</label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="input-field min-h-[120px]"
                    placeholder="Describe your application idea in detail..."
                    disabled={!!selectedTemplate}
                  />
                  {selectedTemplate && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Custom prompt is disabled when a template is selected.
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={
                    isGenerating || (!selectedTemplate && !customPrompt.trim())
                  }
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="loading-spinner mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate App
                    </>
                  )}
                </Button>
              </div>

              {/* Templates Grid */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Popular Templates
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {templates.slice(0, 4).map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <span className="text-xs px-2 py-1 bg-muted rounded-full">
                          {template.complexity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated App Display */}
            <div className="space-y-6">
              {generatedApp ? (
                <>
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">
                        {generatedApp.name}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          AI Generated
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {generatedApp.description}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedApp.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Features</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {generatedApp.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Code Sections */}
                  <div className="space-y-4">
                    <div className="bg-card rounded-lg border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Frontend Code</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              generatedApp.code.frontend,
                              "frontend"
                            )
                          }
                        >
                          {copiedSection === "frontend" ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedSection === "frontend" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{generatedApp.code.frontend}</code>
                      </pre>
                    </div>

                    <div className="bg-card rounded-lg border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Backend Code</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              generatedApp.code.backend,
                              "backend"
                            )
                          }
                        >
                          {copiedSection === "backend" ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedSection === "backend" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{generatedApp.code.backend}</code>
                      </pre>
                    </div>

                    <div className="bg-card rounded-lg border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          Database Schema
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              generatedApp.code.database,
                              "database"
                            )
                          }
                        >
                          {copiedSection === "database" ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedSection === "database" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{generatedApp.code.database}</code>
                      </pre>
                    </div>

                    <div className="bg-card rounded-lg border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          Deployment Instructions
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              generatedApp.deployment,
                              "deployment"
                            )
                          }
                        >
                          {copiedSection === "deployment" ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedSection === "deployment" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">
                          {generatedApp.deployment}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-card rounded-lg border p-8 text-center">
                  <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No App Generated Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Select a template or enter a custom prompt to generate your
                    application.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
