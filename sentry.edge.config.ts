import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Filter out development errors
  beforeSend(event) {
    if (process.env.NODE_ENV === "development") {
      return null;
    }
    return event;
  },

  // Custom error filtering for edge runtime
  beforeSend(event, hint) {
    // Filter out common edge runtime errors
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error) {
        // Filter out Cloudflare Worker timeout errors
        if (
          error.message.includes("timeout") &&
          error.message.includes("worker")
        ) {
          return null;
        }
      }
    }

    return event;
  },
});
