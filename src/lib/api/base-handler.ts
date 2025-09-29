/**
 * Base API Handler for Rockket Platform
 *
 * This module provides standardized API route handling
 * with authentication, validation, and error handling.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { withErrorHandling, handleAPIError } from "@/lib/api/error-handler";
import { createSuccessResponse } from "@/lib/api/response";
import {
  APIError,
  ValidationError,
  ForbiddenError,
} from "@/lib/errors/api-error";
import { z } from "zod";

export interface APIHandlerOptions {
  requireAuth?: boolean;
  requireTenant?: boolean;
  validateBody?: z.ZodSchema<any>;
  validateQuery?: z.ZodSchema<any>;
}

export function createAPIHandler<T = any>(
  handler: (request: NextRequest, context?: any) => Promise<T>,
  options: APIHandlerOptions = {}
) {
  return withErrorHandling(async (request: NextRequest, context?: any) => {
    // Apply authentication middleware
    if (options.requireAuth) {
      return withAuth(request, async (req) => {
        // Apply tenant validation
        if (options.requireTenant && !req.user?.tenantId) {
          throw new ForbiddenError("Tenant required");
        }

        // Validate request body
        if (options.validateBody && request.method !== "GET") {
          try {
            const body = await request.json();
            const validatedBody = options.validateBody.parse(body);
            // Add validated body to request context
            (req as any).validatedBody = validatedBody;
          } catch (error) {
            if (error instanceof z.ZodError) {
              throw new ValidationError("Invalid request body", {
                errors: error.errors,
              });
            }
            throw error;
          }
        }

        // Validate query parameters
        if (options.validateQuery) {
          try {
            const url = new URL(request.url);
            const queryParams = Object.fromEntries(url.searchParams.entries());
            const validatedQuery = options.validateQuery.parse(queryParams);
            // Add validated query to request context
            (req as any).validatedQuery = validatedQuery;
          } catch (error) {
            if (error instanceof z.ZodError) {
              throw new ValidationError("Invalid query parameters", {
                errors: error.errors,
              });
            }
            throw error;
          }
        }

        const result = await handler(req, context);
        return NextResponse.json(createSuccessResponse(result));
      });
    }

    const result = await handler(request, context);
    return NextResponse.json(createSuccessResponse(result));
  });
}

export function createAsyncAPIHandler<T = any>(
  handler: (request: NextRequest, context?: any) => Promise<T>,
  options: APIHandlerOptions = {}
) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await createAPIHandler(handler, options)(request, context);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

// Common validation schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const SearchSchema = z.object({
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const TenantSchema = z.object({
  tenantId: z.string().uuid(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["admin", "user", "viewer"]),
});
