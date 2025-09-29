import { NextRequest, NextResponse } from "next/server";
import { ErrorTracker, PerformanceMonitor } from "./sentry";
import { AnalyticsTracker } from "./posthog";

// API monitoring middleware
export function withMonitoring(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    operationName: string;
    trackPerformance?: boolean;
    trackAnalytics?: boolean;
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    let transaction: any = null;

    try {
      // Start performance tracking
      if (options.trackPerformance) {
        transaction = PerformanceMonitor.trackApiCall(
          request.nextUrl.pathname,
          request.method
        );
      }

      // Add request context to Sentry
      ErrorTracker.setContext("request", {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
        userAgent: request.headers.get("user-agent"),
      });

      // Execute the handler
      const response = await handler(request);

      // Track successful API call
      if (options.trackAnalytics) {
        const duration = Date.now() - startTime;
        const userId = request.headers.get("x-user-id");
        const tenantId = request.headers.get("x-tenant-id");

        if (userId && tenantId) {
          AnalyticsTracker.track("api_call", {
            endpoint: request.nextUrl.pathname,
            method: request.method,
            status_code: response.status,
            duration,
            user_id: userId,
            tenant_id: tenantId,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Set performance data
      if (transaction) {
        transaction.setData("response", {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        });
        transaction.finish();
      }

      return response;
    } catch (error) {
      // Track error
      ErrorTracker.captureException(error as Error, {
        operation: options.operationName,
        method: request.method,
        url: request.url,
        duration: Date.now() - startTime,
      });

      // Track failed API call
      if (options.trackAnalytics) {
        const duration = Date.now() - startTime;
        const userId = request.headers.get("x-user-id");
        const tenantId = request.headers.get("x-tenant-id");

        if (userId && tenantId) {
          AnalyticsTracker.track("api_error", {
            endpoint: request.nextUrl.pathname,
            method: request.method,
            error: (error as Error).message,
            duration,
            user_id: userId,
            tenant_id: tenantId,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Finish transaction with error status
      if (transaction) {
        transaction.setStatus("internal_error");
        transaction.finish();
      }

      // Return error response
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

// Database monitoring wrapper
export function withDatabaseMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  queryName: string
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    let transaction: any = null;

    try {
      transaction = PerformanceMonitor.startTransaction(
        `Database Query: ${queryName}`,
        "db.query"
      );

      const result = await fn(...args);

      const duration = Date.now() - startTime;

      // Track successful database query
      AnalyticsTracker.track("database_query", {
        query_name: queryName,
        duration,
        success: true,
        timestamp: new Date().toISOString(),
      });

      transaction.setStatus("ok");
      transaction.finish();

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Track failed database query
      AnalyticsTracker.track("database_error", {
        query_name: queryName,
        duration,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });

      ErrorTracker.captureException(error as Error, {
        query: queryName,
        duration,
      });

      transaction?.setStatus("internal_error");
      transaction?.finish();

      throw error;
    }
  };
}

// AI generation monitoring wrapper
export function withAIMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  provider: string
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    let transaction: any = null;

    try {
      transaction = PerformanceMonitor.trackAIGeneration(
        args[0] || "", // Assuming first arg is prompt
        provider
      );

      const result = await fn(...args);

      const duration = Date.now() - startTime;

      // Track successful AI generation
      AnalyticsTracker.track("ai_generation", {
        provider,
        duration,
        success: true,
        timestamp: new Date().toISOString(),
      });

      transaction.setData("result", {
        success: true,
        duration,
        provider,
      });
      transaction.finish();

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Track failed AI generation
      AnalyticsTracker.track("ai_generation_error", {
        provider,
        duration,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });

      ErrorTracker.captureException(error as Error, {
        provider,
        duration,
        prompt: args[0] || "",
      });

      transaction?.setData("result", {
        success: false,
        duration,
        provider,
        error: (error as Error).message,
      });
      transaction?.finish();

      throw error;
    }
  };
}

// User action monitoring
export function trackUserAction(
  action: string,
  component: string,
  metadata?: Record<string, any>
) {
  const transaction = PerformanceMonitor.trackUserAction(action, component);

  AnalyticsTracker.track("user_action", {
    action,
    component,
    metadata,
    timestamp: new Date().toISOString(),
  });

  return {
    finish: () => {
      transaction.setData("action_metadata", metadata);
      transaction.finish();
    },
  };
}

// Feature usage monitoring
export function trackFeatureUsage(
  feature: string,
  action: string,
  userId?: string,
  tenantId?: string,
  metadata?: Record<string, any>
) {
  AnalyticsTracker.track("feature_usage", {
    feature,
    action,
    user_id: userId,
    tenant_id: tenantId,
    metadata,
    timestamp: new Date().toISOString(),
  });
}

// Business metrics tracking
export function trackBusinessMetric(
  metric: string,
  value: number,
  userId?: string,
  tenantId?: string,
  metadata?: Record<string, any>
) {
  AnalyticsTracker.track("business_metric", {
    metric,
    value,
    user_id: userId,
    tenant_id: tenantId,
    metadata,
    timestamp: new Date().toISOString(),
  });
}

// Performance metrics tracking
export function trackPerformanceMetric(
  metric: string,
  value: number,
  metadata?: Record<string, any>
) {
  AnalyticsTracker.track("performance_metric", {
    metric,
    value,
    metadata,
    timestamp: new Date().toISOString(),
  });
}

// Error rate monitoring
export function trackErrorRate(
  endpoint: string,
  errorCount: number,
  totalRequests: number,
  timeWindow: number
) {
  const errorRate = (errorCount / totalRequests) * 100;

  AnalyticsTracker.track("error_rate", {
    endpoint,
    error_count: errorCount,
    total_requests: totalRequests,
    error_rate: errorRate,
    time_window: timeWindow,
    timestamp: new Date().toISOString(),
  });

  // Alert if error rate is high
  if (errorRate > 5) {
    ErrorTracker.captureMessage(
      `High error rate detected for ${endpoint}: ${errorRate.toFixed(2)}%`,
      "warning"
    );
  }
}

// Memory usage monitoring
export function trackMemoryUsage() {
  if (typeof window !== "undefined" && "memory" in performance) {
    const memory = (performance as any).memory;

    AnalyticsTracker.track("memory_usage", {
      used_js_heap_size: memory.usedJSHeapSize,
      total_js_heap_size: memory.totalJSHeapSize,
      js_heap_size_limit: memory.jsHeapSizeLimit,
      timestamp: new Date().toISOString(),
    });
  }
}

// Network monitoring
export function trackNetworkPerformance(
  url: string,
  duration: number,
  size: number,
  status: number
) {
  AnalyticsTracker.track("network_performance", {
    url,
    duration,
    size,
    status,
    timestamp: new Date().toISOString(),
  });
}

// Custom event tracking
export function trackCustomEvent(
  eventName: string,
  properties: Record<string, any>
) {
  AnalyticsTracker.track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

// Health check monitoring
export function trackHealthCheck(
  service: string,
  status: "healthy" | "degraded" | "unhealthy",
  responseTime: number,
  metadata?: Record<string, any>
) {
  AnalyticsTracker.track("health_check", {
    service,
    status,
    response_time: responseTime,
    metadata,
    timestamp: new Date().toISOString(),
  });

  if (status === "unhealthy") {
    ErrorTracker.captureMessage(`Service ${service} is unhealthy`, "error");
  }
}

export default {
  withMonitoring,
  withDatabaseMonitoring,
  withAIMonitoring,
  trackUserAction,
  trackFeatureUsage,
  trackBusinessMetric,
  trackPerformanceMetric,
  trackErrorRate,
  trackMemoryUsage,
  trackNetworkPerformance,
  trackCustomEvent,
  trackHealthCheck,
};
