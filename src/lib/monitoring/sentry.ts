import * as Sentry from "@sentry/nextjs";

// Initialize Sentry
export function initSentry() {
  if (typeof window !== "undefined") {
    // Client-side initialization
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      integrations: [
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
        Sentry.browserTracingIntegration(),
      ],
      beforeSend(event) {
        // Filter out development errors
        if (process.env.NODE_ENV === "development") {
          return null;
        }
        return event;
      },
    });
  } else {
    // Server-side initialization
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      integrations: [
        Sentry.nodeProfilingIntegration(),
      ],
    });
  }
}

// Error tracking utilities
export class ErrorTracker {
  static captureException(error: Error, context?: Record<string, any>) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext("error_context", context);
      }
      Sentry.captureException(error);
    });
  }

  static captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
    Sentry.captureMessage(message, level);
  }

  static setUser(user: {
    id: string;
    email: string;
    tenantId: string;
    role: string;
  }) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.email,
      extra: {
        tenantId: user.tenantId,
        role: user.role,
      },
    });
  }

  static setTenant(tenantId: string) {
    Sentry.setTag("tenant", tenantId);
  }

  static addBreadcrumb(message: string, category: string, level: Sentry.SeverityLevel = "info") {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now() / 1000,
    });
  }

  static setContext(key: string, context: Record<string, any>) {
    Sentry.setContext(key, context);
  }

  static setTag(key: string, value: string) {
    Sentry.setTag(key, value);
  }

  static startTransaction(name: string, op: string) {
    return Sentry.startTransaction({
      name,
      op,
    });
  }

  static finishTransaction(transaction: any) {
    transaction.finish();
  }
}

// Performance monitoring
export class PerformanceMonitor {
  static trackPageLoad(pageName: string) {
    const transaction = Sentry.startTransaction({
      name: `Page Load: ${pageName}`,
      op: "navigation",
    });

    return {
      finish: () => transaction.finish(),
      setData: (data: Record<string, any>) => {
        transaction.setData("page_data", data);
      },
    };
  }

  static trackApiCall(endpoint: string, method: string) {
    const transaction = Sentry.startTransaction({
      name: `API Call: ${method} ${endpoint}`,
      op: "http.client",
    });

    return {
      finish: () => transaction.finish(),
      setData: (data: Record<string, any>) => {
        transaction.setData("api_data", data);
      },
    };
  }

  static trackUserAction(action: string, component: string) {
    const transaction = Sentry.startTransaction({
      name: `User Action: ${action}`,
      op: "user.action",
    });

    transaction.setData("component", component);
    transaction.setData("action", action);

    return {
      finish: () => transaction.finish(),
      setData: (data: Record<string, any>) => {
        transaction.setData("action_data", data);
      },
    };
  }

  static trackAIGeneration(prompt: string, provider: string) {
    const transaction = Sentry.startTransaction({
      name: "AI Generation",
      op: "ai.generation",
    });

    transaction.setData("provider", provider);
    transaction.setData("prompt_length", prompt.length);

    return {
      finish: () => transaction.finish(),
      setData: (data: Record<string, any>) => {
        transaction.setData("generation_data", data);
      },
    };
  }
}

// Business metrics tracking
export class BusinessMetrics {
  static trackUserRegistration(userId: string, tenantId: string) {
    Sentry.addBreadcrumb({
      message: "User registered",
      category: "business",
      level: "info",
      data: { userId, tenantId },
    });

    Sentry.setTag("event_type", "user_registration");
    Sentry.captureMessage("User registration completed", "info");
  }

  static trackTenantCreation(tenantId: string, plan: string) {
    Sentry.addBreadcrumb({
      message: "Tenant created",
      category: "business",
      level: "info",
      data: { tenantId, plan },
    });

    Sentry.setTag("event_type", "tenant_creation");
    Sentry.setTag("plan", plan);
    Sentry.captureMessage("Tenant creation completed", "info");
  }

  static trackAIGenerationCompleted(
    userId: string,
    tenantId: string,
    provider: string,
    tokens: number,
    cost: number
  ) {
    Sentry.addBreadcrumb({
      message: "AI generation completed",
      category: "business",
      level: "info",
      data: { userId, tenantId, provider, tokens, cost },
    });

    Sentry.setTag("event_type", "ai_generation");
    Sentry.setTag("provider", provider);
    Sentry.setContext("generation_metrics", {
      tokens,
      cost,
      provider,
    });
    Sentry.captureMessage("AI generation completed", "info");
  }

  static trackVisualBuilderUsage(
    userId: string,
    tenantId: string,
    components: number,
    projectId: string
  ) {
    Sentry.addBreadcrumb({
      message: "Visual builder used",
      category: "business",
      level: "info",
      data: { userId, tenantId, components, projectId },
    });

    Sentry.setTag("event_type", "visual_builder_usage");
    Sentry.setContext("builder_metrics", {
      components,
      projectId,
    });
    Sentry.captureMessage("Visual builder usage tracked", "info");
  }

  static trackPaymentEvent(
    userId: string,
    tenantId: string,
    amount: number,
    currency: string,
    status: string
  ) {
    Sentry.addBreadcrumb({
      message: "Payment processed",
      category: "business",
      level: "info",
      data: { userId, tenantId, amount, currency, status },
    });

    Sentry.setTag("event_type", "payment");
    Sentry.setTag("payment_status", status);
    Sentry.setContext("payment_metrics", {
      amount,
      currency,
      status,
    });
    Sentry.captureMessage("Payment event tracked", "info");
  }
}

// Error boundaries for React components
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
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
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
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
        arguments: args,
      });
      throw error;
    }
  };
}

// Performance monitoring wrapper
export function withPerformanceTracking<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operationName: string
) {
  return async (...args: T): Promise<R> => {
    const transaction = Sentry.startTransaction({
      name: operationName,
      op: "function",
    });

    try {
      const result = await fn(...args);
      transaction.setStatus("ok");
      return result;
    } catch (error) {
      transaction.setStatus("internal_error");
      ErrorTracker.captureException(error as Error, {
        operation: operationName,
        arguments: args,
      });
      throw error;
    } finally {
      transaction.finish();
    }
  };
}

export default Sentry;
