"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type FeatureFlag, type FeatureFlagContext } from "@/types";

interface FeatureFlagProviderProps {
  children: React.ReactNode;
  tenantId?: string;
  userId?: string;
}

const FeatureFlagContext = createContext<FeatureFlagContext | undefined>(
  undefined
);

export function FeatureFlagProvider({
  children,
  tenantId,
  userId,
}: FeatureFlagProviderProps) {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeatureFlags = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/features/evaluate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flags: [
              "ai-generator",
              "visual-builder",
              "cms",
              "ecommerce",
              "analytics",
              "billing",
              "multi-tenant",
              "progressive-onboarding",
            ],
            context: {
              tenantId,
              userId,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const flagResults: Record<string, boolean> = {};

          Object.entries(data.results).forEach(
            ([flagName, result]: [string, any]) => {
              flagResults[flagName] = result.enabled;
            }
          );

          setFlags(flagResults);
        } else {
          // Fallback to default flags if API fails
          const defaultFlags = {
            "ai-generator": true,
            "visual-builder": false,
            cms: false,
            ecommerce: false,
            analytics: true,
            billing: false,
            "multi-tenant": true,
            "progressive-onboarding": true,
          };
          setFlags(defaultFlags);
        }
      } catch (error) {
        console.error("Failed to load feature flags:", error);
        // Fallback to default flags
        const defaultFlags = {
          "ai-generator": true,
          "visual-builder": false,
          cms: false,
          ecommerce: false,
          analytics: true,
          billing: false,
          "multi-tenant": true,
          "progressive-onboarding": true,
        };
        setFlags(defaultFlags);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatureFlags();
  }, [tenantId, userId]);

  const isEnabled = (flagName: string): boolean => {
    return flags[flagName] ?? false;
  };

  const getVariant = (flagName: string): string => {
    // TODO: Implement A/B testing variants
    return "control";
  };

  const value: FeatureFlagContext = {
    flags,
    isLoading,
    isEnabled,
    getVariant,
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error("useFeatureFlag must be used within a FeatureFlagProvider");
  }
  return context;
}
