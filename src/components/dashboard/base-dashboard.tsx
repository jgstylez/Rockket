/**
 * Base Dashboard Component for Rockket Platform
 *
 * This component provides a consistent layout and structure
 * for all dashboard pages across the platform.
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, AlertTriangle, Loader2 } from "lucide-react";

interface BaseDashboardProps {
  title: string;
  description?: string;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function BaseDashboard({
  title,
  description,
  loading = false,
  error,
  onRefresh,
  children,
  actions,
}: BaseDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onRefresh && (
            <Button
              onClick={onRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
