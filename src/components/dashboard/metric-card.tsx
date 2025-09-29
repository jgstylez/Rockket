/**
 * Metric Card Component for Rockket Platform
 *
 * This component provides a consistent way to display
 * metrics and KPIs across dashboard pages.
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
  description?: string;
  status?: "good" | "warning" | "poor";
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  description,
  status = "good",
  loading = false,
}: MetricCardProps) {
  const statusColors = {
    good: "text-green-600",
    warning: "text-yellow-600",
    poor: "text-red-600",
  };

  const changeColors = {
    increase: "text-green-600",
    decrease: "text-red-600",
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">
            {title}
          </CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="h-4 bg-muted animate-pulse rounded mt-2"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground">{value}</div>
        {change && (
          <div
            className={`flex items-center text-xs ${changeColors[change.type]}`}
          >
            {change.type === "increase" ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(change.value)}%
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {status !== "good" && (
          <Badge
            variant={status === "warning" ? "secondary" : "destructive"}
            className="mt-2"
          >
            {status === "warning" ? "Warning" : "Critical"}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
