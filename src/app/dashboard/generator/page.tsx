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
  Loader2,
  Play,
  Pause,
  Square,
} from "lucide-react";

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
  url?: string;
}

interface GenerationStatus {
  id: string;
  status: "pending" | "generating" | "completed" | "failed";
  progress: number;
  phase: string;
  result?: GeneratedApp;
  error?: string;
}

export default function GeneratorPage() {
  const { user, tenant, isLoading } = useAuth();
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] =
    useState<GenerationStatus | null>(null);
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
  const [copiedSection, setCopiedSection] = useState<string>("");
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check if there's a prompt from the homepage
    const storedPrompt = sessionStorage.getItem("generationPrompt");
    if (storedPrompt) {
      setPrompt(storedPrompt);
      sessionStorage.removeItem("generationPrompt");
    }
  }, []);

  // Retry mechanism for authentication
  useEffect(() => {
    if (!isLoading && !user && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`Retrying authentication... attempt ${retryCount + 1}`);
        setRetryCount((prev) => prev + 1);
        // Force a page reload to retry authentication
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, user, retryCount]);

  useEffect(() => {
    // Cleanup WebSocket connection on unmount
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a description of your application");
      return;
    }

    setIsGenerating(true);
    setGenerationStatus({
      id: "",
      status: "pending",
      progress: 0,
      phase: "Starting generation...",
    });

    try {
      // Start code generation using VibeSDK
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          options: {
            framework: "react",
            styling: "tailwind",
            features: ["responsive", "modern-ui", "interactive"],
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generationId = data.generationId;

        // Set up WebSocket connection for real-time updates
        setupWebSocketConnection(generationId);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to start generation");
      }
    } catch (error) {
      console.error("Generation error:", error);
      setGenerationStatus({
        id: "",
        status: "failed",
        progress: 0,
        phase: "Generation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      setIsGenerating(false);
    }
  };

  const setupWebSocketConnection = (generationId: string) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/generation/${generationId}`;

    const ws = new WebSocket(wsUrl);
    setWsConnection(ws);

    ws.onopen = () => {
      console.log("WebSocket connected for generation:", generationId);
    };

    ws.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        setGenerationStatus(update);

        if (update.status === "completed" && update.result) {
          setGeneratedApp(update.result);
          setIsGenerating(false);
        } else if (update.status === "failed") {
          setIsGenerating(false);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setWsConnection(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsGenerating(false);
    };
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

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading generator...</p>
          <p className="text-sm text-gray-500 mt-2">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authentication failed</p>
          <p className="text-sm text-gray-500 mt-2">
            {retryCount < 3
              ? `Retrying... (${retryCount + 1}/3)`
              : "Please try logging in again"}
          </p>
          {retryCount >= 3 && (
            <button
              onClick={() => (window.location.href = "/auth/login")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Code Generator
          </h1>
          <p className="text-gray-600">
            Describe your application and we'll generate the complete code for
            you
          </p>
        </div>

        {/* Prompt Input */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Describe your application
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a todo list app with drag and drop functionality, dark mode, and local storage..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Generate App
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Generation Status */}
        {generationStatus && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Generation Status
              </h3>
              <div className="flex items-center gap-2">
                {generationStatus.status === "generating" && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">In Progress</span>
                  </div>
                )}
                {generationStatus.status === "completed" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm">Completed</span>
                  </div>
                )}
                {generationStatus.status === "failed" && (
                  <div className="flex items-center gap-2 text-red-600">
                    <Square className="h-4 w-4" />
                    <span className="text-sm">Failed</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{generationStatus.phase}</span>
                <span>{generationStatus.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationStatus.progress}%` }}
                />
              </div>
            </div>

            {generationStatus.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{generationStatus.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Generated App */}
        {generatedApp && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {generatedApp.name}
                </h3>
                <p className="text-gray-600">{generatedApp.description}</p>
              </div>
              {generatedApp.url && (
                <Button
                  onClick={() => window.open(generatedApp.url, "_blank")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  View Live App
                </Button>
              )}
            </div>

            {/* Tech Stack */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {generatedApp.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {generatedApp.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Code Sections */}
            <div className="space-y-6">
              {/* Frontend Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Frontend Code
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(generatedApp.code.frontend, "frontend")
                      }
                    >
                      {copiedSection === "frontend" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        downloadCode(generatedApp.code.frontend, "frontend.jsx")
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generatedApp.code.frontend}</code>
                </pre>
              </div>

              {/* Backend Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Backend Code
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(generatedApp.code.backend, "backend")
                      }
                    >
                      {copiedSection === "backend" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        downloadCode(generatedApp.code.backend, "backend.js")
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generatedApp.code.backend}</code>
                </pre>
              </div>

              {/* Database Schema */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Database Schema
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(generatedApp.code.database, "database")
                      }
                    >
                      {copiedSection === "database" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        downloadCode(generatedApp.code.database, "schema.sql")
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generatedApp.code.database}</code>
                </pre>
              </div>

              {/* Deployment Instructions */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Deployment Instructions
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                    {generatedApp.deployment}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
