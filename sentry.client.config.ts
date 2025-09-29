import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Custom error filtering
  beforeSend(event, hint) {
    // Filter out development errors
    if (process.env.NODE_ENV === "development") {
      return null;
    }

    // Filter out common non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error) {
        // Filter out network errors that are not critical
        if (
          error.message.includes("NetworkError") &&
          error.message.includes("fetch")
        ) {
          return null;
        }

        // Filter out ResizeObserver errors
        if (error.message.includes("ResizeObserver loop limit exceeded")) {
          return null;
        }
      }
    }

    return event;
  },
});
