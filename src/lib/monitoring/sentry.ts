import React from "react";

// Optional Sentry import - will be undefined if not available
let Sentry: any = null;
try {
  Sentry = require("@sentry/nextjs");
} catch (error) {
  console.warn("Sentry not available:", error);
}

// Initialize Sentry
export function initSentry() {
  if (!Sentry) {
    console.warn("Sentry not available - monitoring disabled");
    return;
  }

  if (typeof window !== "undefined") {
    // Client-side initialization
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === "development",
      beforeSend(event: any) {
        // Filter out non-error events in production
        if (process.env.NODE_ENV === "production" && event.level !== "error") {
          return null;
        }
        return event;
      },
    });
  }
}

// Error tracking utilities
export class ErrorTracker {
  static captureException(error: Error, context?: Record<string, any>) {
    if (!Sentry) {
      console.error("Error (Sentry not available):", error, context);
      return;
    }

    Sentry.captureException(error, {
      tags: context,
      extra: context,
    });
  }

  static captureMessage(
    message: string,
    level: "info" | "warning" | "error" = "error"
  ) {
    if (!Sentry) {
      console.log(
        `Message (Sentry not available): ${level.toUpperCase()} - ${message}`
      );
      return;
    }

    Sentry.captureMessage(message, level);
  }

  static setUser(user: {
    id: string;
    email: string;
    tenantId: string;
    role: string;
  }) {
    if (!Sentry) {
      console.log("Set user (Sentry not available):", user);
      return;
    }

    Sentry.setUser({
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    });
  }

  static setTenant(tenantId: string) {
    if (!Sentry) {
      console.log("Set tenant (Sentry not available):", tenantId);
      return;
    }

    Sentry.setTag("tenantId", tenantId);
  }

  static addBreadcrumb(
    message: string,
    category: string,
    level: "info" | "warning" | "error" = "info"
  ) {
    if (!Sentry) {
      console.log(
        `Breadcrumb (Sentry not available): ${level.toUpperCase()} - ${category}: ${message}`
      );
      return;
    }

    Sentry.addBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now() / 1000,
    });
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  static startTransaction(name: string, op: string) {
    if (!Sentry) {
      return {
        setTag: () => {},
        setData: () => {},
        finish: () => {},
      };
    }

    return Sentry.startTransaction({
      name,
      op,
    });
  }

  static startSpan(name: string, op: string, parentTransaction?: any) {
    if (!Sentry) {
      return {
        setTag: () => {},
        setData: () => {},
        finish: () => {},
      };
    }

    return Sentry.startSpan(
      {
        name,
        op,
      },
      parentTransaction
    );
  }
}

// API error handling wrapper
export function withErrorTracking<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      ErrorTracker.captureException(error as Error, {
        context,
        function: fn.name,
        args: args.length,
      });
      throw error;
    }
  };
}

// React Error Boundary
export class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
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
    ErrorTracker.captureException(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

// Export default for easy importing
export default ErrorTracker;
