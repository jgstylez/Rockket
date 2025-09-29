/**
 * Error Handler Middleware for Rockket Platform
 *
 * This module provides centralized error handling
 * and standardized error responses.
 */

import { NextRequest, NextResponse } from "next/server";
import { APIError } from "@/lib/errors/api-error";
import { createErrorResponse } from "@/lib/api/response";
import { ErrorTracker } from "@/lib/monitoring/sentry";

export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Log error for monitoring
      if (typeof window === "undefined") {
        // Server-side error tracking
        ErrorTracker.captureException(error as Error);
      }

      // Handle different error types
      if (error instanceof APIError) {
        throw error;
      }

      // Convert unknown errors to APIError
      throw new APIError(
        500,
        error instanceof Error ? error.message : "Unknown error",
        "INTERNAL_ERROR"
      );
    }
  };
}

export function handleAPIError(error: unknown): NextResponse {
  if (error instanceof APIError) {
    return NextResponse.json(
      createErrorResponse({
        code: error.code || "UNKNOWN_ERROR",
        message: error.message,
        details: error.details,
      }),
      { status: error.statusCode }
    );
  }

  // Handle unknown errors
  const apiError = new APIError(500, "Internal server error", "INTERNAL_ERROR");
  return NextResponse.json(
    createErrorResponse({
      code: apiError.code || "INTERNAL_ERROR",
      message: apiError.message,
    }),
    { status: 500 }
  );
}

export function withAsyncErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Log error for monitoring
      if (typeof window === "undefined") {
        ErrorTracker.captureException(error as Error);
      }

      // Re-throw APIError instances
      if (error instanceof APIError) {
        throw error;
      }

      // Convert unknown errors to APIError
      throw new APIError(
        500,
        error instanceof Error ? error.message : "Unknown error",
        "INTERNAL_ERROR"
      );
    }
  };
}
