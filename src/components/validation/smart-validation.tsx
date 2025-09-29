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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  Target,
  ArrowRight,
  Eye,
  Settings,
  Brain,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";

interface ValidationIssue {
  id: string;
  type: "error" | "warning" | "suggestion";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  fixAction: string;
  autoFixable: boolean;
  category: string;
}

interface SmartValidationProps {
  onIssueResolved?: (issueId: string) => void;
  onAutoFix?: (issueId: string) => void;
}

export function SmartValidation({
  onIssueResolved,
  onAutoFix,
}: SmartValidationProps) {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    // Simulate validation check
    setIsValidating(true);
    setTimeout(() => {
      setIssues([
        {
          id: "missing-submit",
          type: "error",
          title: "Form Missing Submit Button",
          description:
            "This form doesn't have a submit button. Users won't be able to submit it.",
          impact: "high",
          fixAction: "Add submit button",
          autoFixable: true,
          category: "Forms",
        },
        {
          id: "slow-images",
          type: "warning",
          title: "Large Images Detected",
          description:
            "Some images are over 1MB and may load slowly on mobile devices.",
          impact: "medium",
          fixAction: "Optimize images",
          autoFixable: true,
          category: "Performance",
        },
        {
          id: "missing-alt",
          type: "warning",
          title: "Images Missing Alt Text",
          description:
            "Some images don't have alt text, which affects accessibility.",
          impact: "medium",
          fixAction: "Add alt text",
          autoFixable: false,
          category: "Accessibility",
        },
        {
          id: "seo-opportunity",
          type: "suggestion",
          title: "SEO Optimization Opportunity",
          description:
            "Add meta description to improve search engine visibility.",
          impact: "low",
          fixAction: "Add meta description",
          autoFixable: true,
          category: "SEO",
        },
      ]);
      setIsValidating(false);
    }, 2000);
  }, []);

  const handleAutoFix = (issueId: string) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
    onAutoFix?.(issueId);
  };

  const handleManualFix = (issueId: string) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
    onIssueResolved?.(issueId);
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "suggestion":
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const errors = issues.filter((issue) => issue.type === "error");
  const warnings = issues.filter((issue) => issue.type === "warning");
  const suggestions = issues.filter((issue) => issue.type === "suggestion");

  if (isValidating) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="font-semibold mb-2">Analyzing your project...</h3>
            <p className="text-sm text-muted-foreground">
              Our AI is checking for potential issues and optimization
              opportunities
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (issues.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              All Good!
            </h3>
            <p className="text-green-700">
              No issues found. Your project is ready to go live!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Smart Validation Results
          </CardTitle>
          <CardDescription>
            Found {issues.length} issues that could affect your site's
            performance and user experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {errors.length}
              </div>
              <div className="text-xs text-red-700">Errors</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">
                {warnings.length}
              </div>
              <div className="text-xs text-yellow-700">Warnings</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {suggestions.length}
              </div>
              <div className="text-xs text-blue-700">Suggestions</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showSuggestions ? "Hide" : "Show"} Details
            </Button>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Fix All Auto-Fixable
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      {showSuggestions && (
        <div className="space-y-3">
          {issues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIssueIcon(issue.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{issue.title}</h4>
                      <Badge className={getImpactColor(issue.impact)}>
                        {issue.impact} impact
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {issue.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {issue.description}
                    </p>
                    <div className="flex items-center gap-2">
                      {issue.autoFixable ? (
                        <Button
                          size="sm"
                          onClick={() => handleAutoFix(issue.id)}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Auto Fix
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleManualFix(issue.id)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Fix Manually
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleManualFix(issue.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* AI Suggestions */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Based on your project, here are some additional optimizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">
                  Enable Performance Monitoring
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Track your site's performance and get alerts when issues arise
                </p>
                <Button size="sm" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Set Up Monitoring
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <Shield className="h-4 w-4 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">
                  Add Security Headers
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Protect your site with security headers and HTTPS
                </p>
                <Button size="sm" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Secure Site
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
