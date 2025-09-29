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

interface StepCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  steps: string[];
  href?: string;
  stepNumber?: number;
  className?: string;
}

export function StepCard({
  title,
  description,
  icon,
  steps,
  href,
  stepNumber,
  className = "",
}: StepCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {stepNumber && <Badge variant="outline">Step {stepNumber}</Badge>}
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            <CardDescription className="text-base">
              {description}
            </CardDescription>
          </div>
          {href && (
            <Button variant="outline" size="sm" asChild>
              <Link href={href}>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ol className="space-y-2">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
