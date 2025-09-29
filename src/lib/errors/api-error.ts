/**
 * Centralized Error Handling for Rockket Platform
 *
 * This module provides standardized error classes and handling
 * for consistent API responses across the platform.
 */

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(400, message, "VALIDATION_ERROR", details);
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string) {
    super(404, `${resource} not found`, "NOT_FOUND");
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = "Unauthorized") {
    super(401, message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends APIError {
  constructor(message = "Forbidden") {
    super(403, message, "FORBIDDEN");
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super(409, message, "CONFLICT");
  }
}

export class RateLimitError extends APIError {
  constructor(message = "Rate limit exceeded") {
    super(429, message, "RATE_LIMIT");
  }
}

export class InternalServerError extends APIError {
  constructor(message = "Internal server error") {
    super(500, message, "INTERNAL_ERROR");
  }
}

export class ServiceUnavailableError extends APIError {
  constructor(message = "Service unavailable") {
    super(503, message, "SERVICE_UNAVAILABLE");
  }
}
