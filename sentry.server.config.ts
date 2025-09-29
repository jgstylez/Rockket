import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  integrations: [Sentry.browserProfilingIntegration()],

  // Custom error filtering for server-side
  beforeSend(event, hint) {
    // Filter out development errors
    if (process.env.NODE_ENV === "development") {
      return null;
    }

    // Filter out common server errors that are not critical
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error) {
        // Filter out database connection errors during startup
        if (
          error.message.includes("ECONNREFUSED") &&
          error.message.includes("database")
        ) {
          return null;
        }

        // Filter out timeout errors that are expected
        if (error.message.includes("timeout") && error.message.includes("AI")) {
          return null;
        }
      }
    }

    return event;
  },
});
