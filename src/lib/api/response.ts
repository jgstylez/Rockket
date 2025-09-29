/**
 * Standardized API Response Format for Rockket Platform
 *
 * This module provides consistent response formatting
 * for all API endpoints across the platform.
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export function createSuccessResponse<T>(
  data: T,
  meta?: Partial<APIResponse<T>["meta"]>
): APIResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      ...meta,
    },
  };
}

export function createErrorResponse(
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  },
  requestId?: string
): APIResponse {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: requestId || crypto.randomUUID(),
    },
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  requestId?: string
): APIResponse<T[]> {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: requestId || crypto.randomUUID(),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
  };
}
