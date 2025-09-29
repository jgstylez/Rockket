"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SignupModal } from "@/components/modals/signup-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
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
  const { user } = useAuth();
  const router = useRouter();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // If user is already logged in, redirect to generator with prompt
    if (user) {
      setIsGenerating(true);
      try {
        // Store the prompt in sessionStorage for the generator page
        sessionStorage.setItem("generationPrompt", prompt);
        router.push("/dashboard/generator");
      } catch (error) {
        console.error("Error redirecting to generator:", error);
        setIsGenerating(false);
      }
      return;
    }

    // If user is not logged in, show signup modal with prompt
    setShowSignupModal(true);
  };

  const handleSignupSuccess = () => {
    // Store the prompt for after signup
    sessionStorage.setItem("generationPrompt", prompt);
    setShowSignupModal(false);
    // Redirect will happen automatically after login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
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
                <Sparkles className="h-4 w-4 text-white/60" />
                <span className="text-sm text-white/60">
                  Press Enter to generate
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    Generate Platform
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Code className="h-6 w-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">
                  Visual Builder
                </h3>
              </div>
              <p className="text-white/70 text-sm">
                Drag-and-drop interface to build your platform visually
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Figma className="h-6 w-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">CMS</h3>
              </div>
              <p className="text-white/70 text-sm">
                Content management system with AI-powered generation
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Github className="h-6 w-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">E-commerce</h3>
              </div>
              <p className="text-white/70 text-sm">
                Complete online store with payment processing
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        prompt={prompt}
        onSignupSuccess={handleSignupSuccess}
      />
    </div>
  );
}
