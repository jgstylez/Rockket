"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  Lightbulb, 
  CheckCircle, 
  X,
  MessageSquare,
  Zap,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  type: "proactive" | "reactive" | "educational";
  title: string;
  description: string;
  action?: string;
  icon?: React.ReactNode;
  priority: "low" | "medium" | "high";
  category: string;
}

interface AICopilotProps {
  suggestions?: Suggestion[];
  onSuggestionClick?: (suggestion: Suggestion) => void;
  onDismiss?: (suggestionId: string) => void;
  isVisible?: boolean;
  className?: string;
}

export function AICopilot({ 
  suggestions = [], 
  onSuggestionClick, 
  onDismiss,
  isVisible = true,
  className 
}: AICopilotProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [hasNewSuggestions, setHasNewSuggestions] = React.useState(false);

  // Simulate new suggestions appearing
  React.useEffect(() => {
    if (suggestions.length > 0) {
      setHasNewSuggestions(true);
      const timer = setTimeout(() => setHasNewSuggestions(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [suggestions.length]);

  const getIcon = (type: string) => {
    switch (type) {
      case "proactive":
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case "reactive":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "educational":
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isVisible) return null;

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {/* Main Copilot Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "relative h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105",
          hasNewSuggestions && "animate-pulse"
        )}
        size="icon"
      >
        <Bot className="h-6 w-6" />
        {suggestions.length > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            variant="destructive"
          >
            {suggestions.length}
          </Badge>
        )}
      </Button>

      {/* Expanded Suggestions Panel */}
      {isExpanded && (
        <Card className="absolute bottom-16 right-0 w-80 shadow-xl border-0 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {suggestions.length === 0 ? (
              <div className="text-center py-6">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  I'm here to help! Start building and I'll suggest ways to improve your project.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="group relative p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => onSuggestionClick?.(suggestion)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {suggestion.icon || getIcon(suggestion.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium truncate">
                            {suggestion.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getPriorityColor(suggestion.priority))}
                          >
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {suggestion.description}
                        </p>
                        {suggestion.action && (
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <Zap className="h-3 w-3" />
                            <span>{suggestion.action}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDismiss?.(suggestion.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  // Open chat interface
                  console.log("Open chat");
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask me anything
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Hook for managing AI suggestions
export function useAICopilot() {
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [isVisible, setIsVisible] = React.useState(true);

  const addSuggestion = (suggestion: Omit<Suggestion, "id">) => {
    const newSuggestion: Suggestion = {
      ...suggestion,
      id: Math.random().toString(36).substr(2, 9),
    };
    setSuggestions(prev => [...prev, newSuggestion]);
  };

  const removeSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const clearAllSuggestions = () => {
    setSuggestions([]);
  };

  // Simulate contextual suggestions based on user activity
  const generateContextualSuggestions = (context: string) => {
    const contextualSuggestions: Record<string, Suggestion[]> = {
      "ecommerce": [
        {
          id: "ecommerce-payment",
          type: "proactive",
          title: "Add Payment Processing",
          description: "I noticed you're building an e-commerce site. Want me to set up Stripe payments?",
          action: "Set up in 2 clicks",
          priority: "high",
          category: "payments"
        },
        {
          id: "ecommerce-optimization",
          type: "educational",
          title: "Optimize for Conversions",
          description: "Learn how to increase your sales with proven e-commerce strategies.",
          action: "Start learning",
          priority: "medium",
          category: "optimization"
        }
      ],
      "blog": [
        {
          id: "blog-seo",
          type: "proactive",
          title: "Add SEO Optimization",
          description: "Make your blog posts discoverable with automatic SEO optimization.",
          action: "Enable SEO",
          priority: "medium",
          category: "seo"
        }
      ],
      "auth": [
        {
          id: "auth-social",
          type: "proactive",
          title: "Add Social Login",
          description: "Let users sign in with Google, GitHub, or other social accounts.",
          action: "Add social login",
          priority: "low",
          category: "authentication"
        }
      ]
    };

    return contextualSuggestions[context] || [];
  };

  return {
    suggestions,
    isVisible,
    setIsVisible,
    addSuggestion,
    removeSuggestion,
    clearAllSuggestions,
    generateContextualSuggestions
  };
}
