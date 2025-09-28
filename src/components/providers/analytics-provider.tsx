"use client";

import { createContext, useContext, useEffect } from "react";
import { useAuth } from "./auth-provider";

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  page: (name: string, properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user, tenant } = useAuth();

  useEffect(() => {
    // Initialize analytics when user is available
    if (user) {
      // TODO: Initialize PostHog, Mixpanel, or other analytics
      console.log("Analytics initialized for user:", user.id);
    }
  }, [user]);

  const track = async (event: string, properties?: Record<string, any>) => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
          properties,
        }),
      });
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  };

  const identify = (userId: string, traits?: Record<string, any>) => {
    // TODO: Implement user identification
    console.log("Analytics identify:", userId, traits);
  };

  const page = (name: string, properties?: Record<string, any>) => {
    // TODO: Implement page tracking
    console.log("Analytics page:", name, properties);
  };

  const value: AnalyticsContextType = {
    track,
    identify,
    page,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
