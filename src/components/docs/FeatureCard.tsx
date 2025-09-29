"use client";

import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  features?: string[];
  benefits?: string[];
  href?: string;
  category?: string;
  status?: "ready" | "beta" | "coming-soon";
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  features = [],
  benefits = [],
  href,
  category,
  status = "ready",
  className = "",
}: FeatureCardProps) {
  const statusConfig = {
    ready: {
      color: "bg-green-50 border-green-200 text-green-800",
      label: "Ready",
    },
    beta: {
      color: "bg-yellow-50 border-yellow-200 text-yellow-800",
      label: "Beta",
    },
    "coming-soon": {
      color: "bg-gray-50 border-gray-200 text-gray-800",
      label: "Coming Soon",
    },
  };

  const cardContent = (
    <Card
      className={`hover:shadow-lg transition-all duration-300 h-full ${className}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {category && (
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`text-xs ${statusConfig[status].color}`}
            >
              {statusConfig[status].label}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features list */}
        {features.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Features:
            </h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits list */}
        {benefits.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Benefits:
            </h4>
            <ul className="space-y-1">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action button */}
        {href && status === "ready" && (
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href={href}>
              Learn More
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}

        {href && status !== "ready" && (
          <Button variant="outline" className="w-full mt-4" disabled>
            {status === "beta" ? "Try Beta" : "Coming Soon"}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (href && status === "ready") {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
