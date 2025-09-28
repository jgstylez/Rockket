"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SignupModal } from "@/components/modals/signup-modal";
import {
  Rocket,
  Sparkles,
  ArrowRight,
  Github,
  Figma,
  Code,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowSignupModal(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rockket-blue via-rockket-blue-dark to-slate-900">
      <Header />

      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl font-semibold text-white/90 mb-4">
              Launch Your Vision
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-8">
              The complete business platform that AI coding should have been
              from the start
            </p>
          </div>

          {/* Prompt Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your business idea and we'll build the complete platform..."
                className="w-full h-32 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Figma className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Code className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="absolute bottom-4 right-4 bg-rockket-orange text-white hover:bg-rockket-orange-dark disabled:opacity-50"
                size="sm"
              >
                {isGenerating ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </div>

            <p className="text-sm text-white/60 mt-4">
              or import from <span className="text-white/80">Figma</span> •{" "}
              <span className="text-white/80">GitHub</span> •{" "}
              <span className="text-white/80">Existing Code</span>
            </p>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {[
              "E-commerce platform for subscription meal kits",
              "SaaS dashboard for project management",
              "Marketplace for local services",
              "Online course platform with payments",
              "Real estate portal with listings",
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(example)}
                className="text-white border-white/20 hover:bg-white/10 hover:border-white/40"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        prompt={prompt}
      />
    </div>
  );
}
