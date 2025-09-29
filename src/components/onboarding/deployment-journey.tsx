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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Rocket,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  Shield,
  Zap,
  Target,
  Share2,
  Download,
  Sparkles,
  Award,
  TrendingUp,
  Users,
  Eye,
  ArrowRight,
  ExternalLink,
  Copy,
  Settings,
  BarChart3,
} from "lucide-react";

interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "error";
  duration: string;
  icon: React.ReactNode;
}

interface PreDeployCheck {
  id: string;
  title: string;
  description: string;
  status: "pass" | "fail" | "warning";
  fixAction?: string;
}

export function DeploymentJourney() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [deploymentComplete, setDeploymentComplete] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");

  const preDeployChecks: PreDeployCheck[] = [
    {
      id: "domain",
      title: "Domain Configuration",
      description: "Your custom domain is ready",
      status: "pass",
    },
    {
      id: "ssl",
      title: "SSL Certificate",
      description: "Secure connection enabled",
      status: "pass",
    },
    {
      id: "performance",
      title: "Performance Optimization",
      description: "Site is optimized for speed",
      status: "pass",
    },
    {
      id: "analytics",
      title: "Analytics Setup",
      description: "Visitor tracking configured",
      status: "warning",
      fixAction: "Add Google Analytics",
    },
    {
      id: "seo",
      title: "SEO Optimization",
      description: "Search engine optimization",
      status: "fail",
      fixAction: "Add meta tags",
    },
  ];

  const deploymentSteps: DeploymentStep[] = [
    {
      id: "preparation",
      title: "Preparing your site",
      description: "Optimizing assets and configurations",
      status: "completed",
      duration: "30s",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: "build",
      title: "Building your application",
      description: "Compiling and bundling your code",
      status: "in-progress",
      duration: "2m",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: "deploy",
      title: "Deploying to global CDN",
      description: "Making your site fast worldwide",
      status: "pending",
      duration: "1m",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      id: "verify",
      title: "Verifying deployment",
      description: "Running tests and health checks",
      status: "pending",
      duration: "30s",
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  const handleDeploy = async () => {
    setIsDeploying(true);
    setCurrentStep(0);

    // Simulate deployment process
    for (let i = 0; i < deploymentSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    setDeploymentComplete(true);
    setDeploymentUrl("https://your-awesome-site.rockket.app");
    setIsDeploying(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        );
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCheckStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "fail":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const passedChecks = preDeployChecks.filter(
    (check) => check.status === "pass"
  ).length;
  const totalChecks = preDeployChecks.length;
  const canDeploy = passedChecks >= totalChecks - 1; // Allow deployment with 1 warning

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Ready to Go Live?
        </h1>
        <p className="text-muted-foreground">
          Let's make sure everything is perfect before we launch your site to
          the world.
        </p>
      </div>

      {/* Pre-Deploy Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Pre-Deploy Checklist
          </CardTitle>
          <CardDescription>
            We've checked your site and found {passedChecks} of {totalChecks}{" "}
            requirements are ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress
            value={(passedChecks / totalChecks) * 100}
            className="h-2"
          />

          <div className="space-y-3">
            {preDeployChecks.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  {getCheckStatusIcon(check.status)}
                  <div>
                    <h4 className="font-medium text-sm">{check.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {check.description}
                    </p>
                  </div>
                </div>
                {check.fixAction && (
                  <Button variant="outline" size="sm">
                    {check.fixAction}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {!canDeploy && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please fix the issues above before deploying. Your site needs
                these requirements to work properly.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Deployment Process */}
      {isDeploying && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Deploying Your Site
            </CardTitle>
            <CardDescription>
              This usually takes 3-4 minutes. We'll notify you when it's ready!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress
              value={(currentStep / (deploymentSteps.length - 1)) * 100}
              className="h-2"
            />

            <div className="space-y-3">
              {deploymentSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(step.status)}
                    <div>
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {step.duration}
                    </span>
                    {step.status === "in-progress" && (
                      <div className="animate-pulse">
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Complete */}
      {deploymentComplete && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Award className="h-5 w-5" />
              🎉 Congratulations! Your site is live!
            </CardTitle>
            <CardDescription className="text-green-700">
              Your site has been successfully deployed and is now accessible
              worldwide.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-100 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Your Live Site</h4>
                  <p className="text-sm text-green-700">
                    Share this link with the world
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white rounded border text-sm font-mono">
                  {deploymentUrl}
                </code>
                <Button size="sm" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <Share2 className="h-5 w-5 mx-auto mb-2" />
                  <div className="font-medium text-sm">Share</div>
                  <div className="text-xs text-muted-foreground">
                    Tell the world
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <BarChart3 className="h-5 w-5 mx-auto mb-2" />
                  <div className="font-medium text-sm">Analytics</div>
                  <div className="text-xs text-muted-foreground">
                    Track visitors
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <Settings className="h-5 w-5 mx-auto mb-2" />
                  <div className="font-medium text-sm">Settings</div>
                  <div className="text-xs text-muted-foreground">
                    Customize more
                  </div>
                </div>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                🎊 Your first visitor will be celebrated with a notification!
              </p>
              <Button size="lg" className="px-8">
                <TrendingUp className="h-5 w-5 mr-2" />
                View Analytics
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deploy Button */}
      {!isDeploying && !deploymentComplete && (
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleDeploy}
            disabled={!canDeploy}
            className="px-8"
          >
            <Rocket className="h-5 w-5 mr-2" />
            Deploy to Production
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          {!canDeploy && (
            <p className="text-sm text-muted-foreground mt-2">
              Fix the issues above to enable deployment
            </p>
          )}
        </div>
      )}
    </div>
  );
}
