"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  initSentry,
  ErrorTracker,
  PerformanceMonitor,
} from "@/lib/monitoring/sentry";
import {
  initPostHog,
  AnalyticsTracker,
  BusinessAnalytics,
} from "@/lib/monitoring/posthog";

interface MonitoringContextType {
  // Sentry
  captureException: (error: Error, context?: Record<string, any>) => void;
  captureMessage: (
    message: string,
    level?: "info" | "warning" | "error"
  ) => void;
  setUser: (user: {
    id: string;
    email: string;
    tenantId: string;
    role: string;
  }) => void;
  setTenant: (tenantId: string) => void;

  // PostHog Analytics
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (user: {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: string;
    plan?: string;
  }) => void;
  page: (pageName: string, properties?: Record<string, any>) => void;

  // Business Analytics
  trackUserRegistration: (user: any) => void;
  trackTenantCreation: (tenant: any) => void;
  trackAIGeneration: (
    userId: string,
    tenantId: string,
    prompt: string,
    provider: string,
    result: any
  ) => void;
  trackVisualBuilderUsage: (
    userId: string,
    tenantId: string,
    action: string,
    component?: string,
    projectId?: string
  ) => void;
  trackContentCreation: (
    userId: string,
    tenantId: string,
    contentType: string,
    contentId: string
  ) => void;
  trackEcommerceActivity: (
    userId: string,
    tenantId: string,
    activity: string,
    productId?: string,
    orderId?: string,
    amount?: number
  ) => void;
  trackPaymentEvent: (
    userId: string,
    tenantId: string,
    event: string,
    amount: number,
    currency: string,
    plan?: string
  ) => void;
  trackFeatureUsage: (
    userId: string,
    tenantId: string,
    feature: string,
    action: string,
    metadata?: Record<string, any>
  ) => void;

  // Performance
  trackPageLoad: (
    pageName: string,
    loadTime: number,
    metadata?: Record<string, any>
  ) => void;
  trackComponentRender: (
    componentName: string,
    renderTime: number,
    props?: Record<string, any>
  ) => void;

  // Loading states
  isSentryReady: boolean;
  isPostHogReady: boolean;
}

const MonitoringContext = createContext<MonitoringContextType | undefined>(
  undefined
);

export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error("useMonitoring must be used within a MonitoringProvider");
  }
  return context;
}

interface MonitoringProviderProps {
  children: React.ReactNode;
  user?: {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: string;
    plan?: string;
  };
}

export function MonitoringProvider({
  children,
  user,
}: MonitoringProviderProps) {
  const [isSentryReady, setIsSentryReady] = useState(false);
  const [isPostHogReady, setIsPostHogReady] = useState(false);

  useEffect(() => {
    // Initialize Sentry
    try {
      initSentry();
      setIsSentryReady(true);
    } catch (error) {
      console.error("Failed to initialize Sentry:", error);
    }

    // Initialize PostHog (optional)
    try {
      const posthog = initPostHog();
      if (posthog) {
        setIsPostHogReady(true);
      }
    } catch (error) {
      console.warn("PostHog not configured or failed to initialize:", error);
      setIsPostHogReady(false);
    }
  }, []);

  useEffect(() => {
    if (user && isSentryReady) {
      // Set user context in Sentry
      ErrorTracker.setUser({
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
        role: user.role,
      });

      ErrorTracker.setTenant(user.tenantId);

      // Set user context in PostHog if available
      if (isPostHogReady) {
        AnalyticsTracker.identify({
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: user.tenantId,
          role: user.role,
          plan: user.plan,
        });
      }
    }
  }, [user, isSentryReady, isPostHogReady]);

  const contextValue: MonitoringContextType = {
    // Sentry methods
    captureException: ErrorTracker.captureException,
    captureMessage: ErrorTracker.captureMessage,
    setUser: ErrorTracker.setUser,
    setTenant: ErrorTracker.setTenant,

    // PostHog methods (with fallback)
    track: (event: string, properties?: Record<string, any>) => {
      if (isPostHogReady) {
        AnalyticsTracker.track(event, properties);
      }
    },
    identify: (user: any) => {
      if (isPostHogReady) {
        AnalyticsTracker.identify(user);
      }
    },
    page: (pageName: string, properties?: Record<string, any>) => {
      if (isPostHogReady) {
        AnalyticsTracker.page(pageName, properties);
      }
    },

    // Business Analytics methods (with fallback)
    trackUserRegistration: (user: any) => {
      if (isPostHogReady) {
        BusinessAnalytics.trackUserRegistration(user);
      }
    },
    trackTenantCreation: (tenant: any) => {
      if (isPostHogReady) {
        BusinessAnalytics.trackTenantCreation(tenant);
      }
    },
    trackAIGeneration: (userId: string, tenantId: string, prompt: string, provider: string, result: any) => {
      if (isPostHogReady) {
        BusinessAnalytics.trackAIGeneration(userId, tenantId, prompt, provider, result);
      }
    },
    trackVisualBuilderUsage: (userId: string, tenantId: string, action: string, component?: string, projectId?: string) => {
      if (isPostHogReady) {
        BusinessAnalytics.trackVisualBuilderUsage(userId, tenantId, action, component, projectId);
      }
    },
    trackContentCreation: (userId: string, tenantId: string, contentType: string, contentId: string) => {
      if (isPostHogReady) {
        BusinessAnalytics.trackContentCreation(userId, tenantId, contentType, contentId);
      }
    },
    trackEcommerceActivity: (userId: string, tenantId: string, activity: string, productId?: string, orderId?: string, amount?: number) => {
      if (isPostHogReady) {
        BusinessAnalytics.trackEcommerceActivity(userId, tenantId, activity, productId, orderId, amount);
      }
    },
    trackPaymentEvent: (userId: string, tenantId: string, event: string, amount: number, currency: string, plan?: string) => {
      if (isPostHogReady) {
        BusinessAnalytics.trackPaymentEvent(userId, tenantId, event, amount, currency, plan);
      }
    },
    trackFeatureUsage: (userId: string, tenantId: string, feature: string, action: string, metadata?: Record<string, any>) => {
      if (isPostHogReady) {
        BusinessAnalytics.trackFeatureUsage(userId, tenantId, feature, action, metadata);
      }
    },

    // Performance methods (with fallback)
    trackPageLoad: (
      pageName: string,
      loadTime: number,
      metadata?: Record<string, any>
    ) => {
      if (isPostHogReady) {
        AnalyticsTracker.track("page_load", {
          page_name: pageName,
          load_time: loadTime,
          ...metadata,
          timestamp: new Date().toISOString(),
        });
      }
    },
    trackComponentRender: (
      componentName: string,
      renderTime: number,
      props?: Record<string, any>
    ) => {
      if (isPostHogReady) {
        AnalyticsTracker.track("component_render", {
          component_name: componentName,
          render_time: renderTime,
          props,
          timestamp: new Date().toISOString(),
        });
      }
    },

    // Loading states
    isSentryReady,
    isPostHogReady,
  };

  return (
    <MonitoringContext.Provider value={contextValue}>
      {children}
    </MonitoringContext.Provider>
  );
}

// Performance tracking hook
export function usePerformanceTracking() {
  const { trackPageLoad, trackComponentRender } = useMonitoring();

  const trackPage = React.useCallback(
    (pageName: string, metadata?: Record<string, any>) => {
      const startTime = performance.now();

      return {
        finish: () => {
          const loadTime = performance.now() - startTime;
          trackPageLoad(pageName, loadTime, metadata);
        },
      };
    },
    [trackPageLoad]
  );

  const trackComponent = React.useCallback(
    (componentName: string, props?: Record<string, any>) => {
      const startTime = performance.now();

      return {
        finish: () => {
          const renderTime = performance.now() - startTime;
          trackComponentRender(componentName, renderTime, props);
        },
      };
    },
    [trackComponentRender]
  );

  return {
    trackPage,
    trackComponent,
  };
}

// Error boundary with monitoring
export function MonitoredErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { captureException } = useMonitoring();

  return (
    <ErrorBoundaryWrapper onError={captureException} fallback={fallback}>
      {children}
    </ErrorBoundaryWrapper>
  );
}

// Error boundary wrapper component
class ErrorBoundaryWrapper extends React.Component<
  {
    children: React.ReactNode;
    onError: (error: Error, context?: Record<string, any>) => void;
    fallback?: React.ReactNode;
  },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-8">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Our team has
                been notified.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
