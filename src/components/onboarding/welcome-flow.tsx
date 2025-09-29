"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Rocket,
  Sparkles,
  Palette,
  Code,
  ShoppingCart,
  Users,
  BookOpen,
  Zap,
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Brain,
  Globe,
  Smartphone,
  Laptop,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "input" | "choice" | "preview";
  options?: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    value: string;
  }>;
}

export function WelcomeFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [selectedApproach, setSelectedApproach] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedPath, setRecommendedPath] = useState("");

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "What do you want to build?",
      description:
        "Describe your idea in your own words. Don't worry about technical details - just tell us what you envision.",
      icon: <Rocket className="h-8 w-8 text-primary" />,
      type: "input",
    },
    {
      id: "approach",
      title: "Choose your approach",
      description:
        "Based on your description, here are the best ways to bring your idea to life:",
      icon: <Target className="h-8 w-8 text-primary" />,
      type: "choice",
      options: [
        {
          title: "AI Generation",
          description: "Describe what you want and I'll build it for you",
          icon: <Brain className="h-6 w-6 text-purple-600" />,
          value: "ai",
        },
        {
          title: "Visual Builder",
          description: "Drag and drop to create your interface",
          icon: <Palette className="h-6 w-6 text-blue-600" />,
          value: "visual",
        },
        {
          title: "Code Editor",
          description: "Write custom code with AI assistance",
          icon: <Code className="h-6 w-6 text-green-600" />,
          value: "code",
        },
      ],
    },
    {
      id: "preview",
      title: "Let's get started!",
      description: "Your project is ready to begin. Here's what we'll create:",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      type: "preview",
    },
  ];

  const inspirationExamples = [
    {
      title: "E-commerce Store",
      description:
        "Sell products online with payments, inventory, and customer management",
      icon: <ShoppingCart className="h-5 w-5" />,
      category: "Business",
    },
    {
      title: "Community Platform",
      description: "Connect people with forums, events, and member management",
      icon: <Users className="h-5 w-5" />,
      category: "Social",
    },
    {
      title: "Course Site",
      description:
        "Share knowledge with video lessons, quizzes, and progress tracking",
      icon: <BookOpen className="h-5 w-5" />,
      category: "Education",
    },
  ];

  const handleInputSubmit = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentStep(1);
    }, 2000);
  };

  const handleApproachSelect = (approach: string) => {
    setSelectedApproach(approach);
    setCurrentStep(2);
  };

  const getRecommendedFeatures = () => {
    if (
      userInput.toLowerCase().includes("sell") ||
      userInput.toLowerCase().includes("shop")
    ) {
      return [
        "Payment Processing",
        "Inventory Management",
        "Customer Accounts",
        "Order Tracking",
      ];
    }
    if (
      userInput.toLowerCase().includes("community") ||
      userInput.toLowerCase().includes("social")
    ) {
      return ["User Profiles", "Forums", "Event Management", "Messaging"];
    }
    if (
      userInput.toLowerCase().includes("course") ||
      userInput.toLowerCase().includes("learn")
    ) {
      return ["Video Player", "Progress Tracking", "Quizzes", "Certificates"];
    }
    return [
      "User Authentication",
      "Content Management",
      "Analytics",
      "Mobile Responsive",
    ];
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress
            value={(currentStep / (steps.length - 1)) * 100}
            className="h-2"
          />
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              {currentStepData.icon}
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              {currentStepData.title}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Input */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="I want to build a platform where people can..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[120px] text-lg"
                  />
                  <div className="text-sm text-muted-foreground text-center">
                    Be as specific or general as you'd like. The AI will
                    understand your vision.
                  </div>
                </div>

                {/* Inspiration Examples */}
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Need inspiration? Here are some popular ideas:
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inspirationExamples.map((example, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
                        onClick={() => setUserInput(example.description)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {example.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm mb-1">
                                {example.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mb-2">
                                {example.description}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {example.category}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleInputSubmit}
                    disabled={!userInput.trim()}
                    size="lg"
                    className="px-8"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Analyze My Idea
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Approach Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {isAnalyzing ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2">
                      Analyzing your idea...
                    </h3>
                    <p className="text-muted-foreground">
                      Our AI is understanding your vision and preparing the best
                      approach.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentStepData.options?.map((option, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50 group"
                        onClick={() => handleApproachSelect(option.value)}
                      >
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="flex justify-center mb-4">
                              <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                {option.icon}
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                              {option.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {option.description}
                            </p>
                            <Button
                              variant="outline"
                              className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                            >
                              Choose This
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Preview */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                    <CheckCircle className="h-4 w-4" />
                    Ready to Build
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Your Project Setup
                  </h3>
                  <p className="text-muted-foreground">
                    Based on your description, we'll create a{" "}
                    {selectedApproach === "ai"
                      ? "AI-generated"
                      : selectedApproach === "visual"
                        ? "visually designed"
                        : "code-based"}{" "}
                    solution with these features:
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getRecommendedFeatures().map((feature, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm font-medium">{feature}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep(0)}>
                    Start Over
                  </Button>
                  <Button size="lg" className="px-8">
                    <Rocket className="h-5 w-5 mr-2" />
                    Start Building
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Button variant="link" className="p-0 h-auto">
              View our guide
            </Button>{" "}
            or{" "}
            <Button variant="link" className="p-0 h-auto">
              Contact support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
