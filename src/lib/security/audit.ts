import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Security audit utilities
export class SecurityAuditor {
  // Input validation schemas
  static readonly schemas = {
    email: z.string().email().max(255),
    password: z
      .string()
      .min(8)
      .max(128)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    username: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[a-zA-Z0-9_-]+$/),
    tenantName: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[a-zA-Z0-9\s-_]+$/),
    apiKey: z.string().min(32).max(128),
    jwt: z.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/),
    url: z.string().url().max(2048),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
    uuid: z.string().uuid(),
  };

  // Security headers
  static readonly securityHeaders = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
  };

  // Rate limiting configuration
  static readonly rateLimits = {
    login: { max: 5, window: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
    register: { max: 3, window: 60 * 60 * 1000 }, // 3 attempts per hour
    api: { max: 100, window: 15 * 60 * 1000 }, // 100 requests per 15 minutes
    passwordReset: { max: 3, window: 60 * 60 * 1000 }, // 3 attempts per hour
    aiGeneration: { max: 10, window: 60 * 60 * 1000 }, // 10 generations per hour
  };

  // Security audit methods
  static validateInput<T>(
    schema: z.ZodSchema<T>,
    data: unknown
  ): { valid: boolean; data?: T; errors?: string[] } {
    try {
      const result = schema.safeParse(data);
      if (result.success) {
        return { valid: true, data: result.data };
      } else {
        return {
          valid: false,
          errors: result.error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          ),
        };
      }
    } catch (error) {
      return { valid: false, errors: ["Validation failed"] };
    }
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/['"]/g, "") // Remove quotes
      .replace(/[;\\]/g, "") // Remove semicolons and backslashes
      .trim();
  }

  static validatePassword(password: string): {
    valid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push("Password must be at least 8 characters long");

    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Password must contain at least one uppercase letter");

    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Password must contain at least one lowercase letter");

    // Number check
    if (/\d/.test(password)) score += 1;
    else feedback.push("Password must contain at least one number");

    // Special character check
    if (/[@$!%*?&]/.test(password)) score += 1;
    else
      feedback.push(
        "Password must contain at least one special character (@$!%*?&)"
      );

    // Common password check
    const commonPasswords = [
      "password",
      "123456",
      "qwerty",
      "admin",
      "letmein",
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      score = 0;
      feedback.push("Password is too common");
    }

    return {
      valid: score >= 4,
      score,
      feedback,
    };
  }

  static validateJWT(token: string): {
    valid: boolean;
    payload?: any;
    error?: string;
  } {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return { valid: false, error: "Invalid JWT format" };
      }

      const [header, payload, signature] = parts;

      // Basic format validation
      if (!header || !payload || !signature) {
        return { valid: false, error: "Invalid JWT structure" };
      }

      // Decode payload (without verification for basic validation)
      const decodedPayload = JSON.parse(atob(payload));

      // Check expiration
      if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
        return { valid: false, error: "JWT has expired" };
      }

      return { valid: true, payload: decodedPayload };
    } catch (error) {
      return { valid: false, error: "Invalid JWT token" };
    }
  }

  static checkSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(;|\-\-|\/\*|\*\/)/,
      /(\b(OR|AND)\b.*=.*\b(OR|AND)\b)/i,
      /(\b(UNION|SELECT)\b.*\b(SELECT|UNION)\b)/i,
      /(\b(DROP|DELETE|INSERT|UPDATE)\b.*\b(TABLE|DATABASE|INDEX)\b)/i,
    ];

    return sqlPatterns.some((pattern) => pattern.test(input));
  }

  static checkXSS(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
      /<link[^>]*>.*?<\/link>/gi,
      /<meta[^>]*>.*?<\/meta>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
      /onmouseover\s*=/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(input));
  }

  static checkPathTraversal(input: string): boolean {
    const pathTraversalPatterns = [
      /\.\.\//g,
      /\.\.\\/g,
      /\.\.%2f/gi,
      /\.\.%5c/gi,
      /%2e%2e%2f/gi,
      /%2e%2e%5c/gi,
    ];

    return pathTraversalPatterns.some((pattern) => pattern.test(input));
  }

  static checkCSRF(token: string, sessionToken: string): boolean {
    return token === sessionToken;
  }

  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  static checkRateLimit(
    identifier: string,
    action: keyof typeof SecurityAuditor.rateLimits
  ): { allowed: boolean; remaining: number; resetTime: number } {
    // This would integrate with Redis for actual rate limiting
    const limit = SecurityAuditor.rateLimits[action];

    // Mock implementation - in production, this would check Redis
    return {
      allowed: true,
      remaining: limit.max - 1,
      resetTime: Date.now() + limit.window,
    };
  }

  static auditRequest(request: NextRequest): {
    safe: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for suspicious headers
    const suspiciousHeaders = [
      "x-forwarded-for",
      "x-real-ip",
      "x-cluster-client-ip",
    ];
    suspiciousHeaders.forEach((header) => {
      if (request.headers.get(header)) {
        issues.push(`Suspicious header detected: ${header}`);
        recommendations.push("Validate and sanitize IP headers");
      }
    });

    // Check for SQL injection in query parameters
    const url = new URL(request.url);
    url.searchParams.forEach((value, key) => {
      if (SecurityAuditor.checkSQLInjection(value)) {
        issues.push(`Potential SQL injection in parameter: ${key}`);
        recommendations.push("Implement parameterized queries");
      }
    });

    // Check for XSS in query parameters
    url.searchParams.forEach((value, key) => {
      if (SecurityAuditor.checkXSS(value)) {
        issues.push(`Potential XSS in parameter: ${key}`);
        recommendations.push(
          "Implement input sanitization and output encoding"
        );
      }
    });

    // Check for path traversal
    if (SecurityAuditor.checkPathTraversal(url.pathname)) {
      issues.push("Potential path traversal attack");
      recommendations.push("Validate and sanitize file paths");
    }

    // Check for suspicious user agent
    const userAgent = request.headers.get("user-agent");
    if (
      userAgent &&
      (userAgent.includes("bot") || userAgent.includes("crawler"))
    ) {
      issues.push("Suspicious user agent detected");
      recommendations.push("Implement bot detection and rate limiting");
    }

    return {
      safe: issues.length === 0,
      issues,
      recommendations,
    };
  }

  static auditResponse(response: NextResponse): {
    safe: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for missing security headers
    Object.entries(SecurityAuditor.securityHeaders).forEach(
      ([header, value]) => {
        if (!response.headers.get(header)) {
          issues.push(`Missing security header: ${header}`);
          recommendations.push(`Add ${header} header with value: ${value}`);
        }
      }
    );

    // Check for sensitive information in headers
    const sensitiveHeaders = ["x-powered-by", "server", "x-aspnet-version"];
    sensitiveHeaders.forEach((header) => {
      if (response.headers.get(header)) {
        issues.push(`Sensitive information exposed in header: ${header}`);
        recommendations.push(`Remove or obfuscate ${header} header`);
      }
    });

    return {
      safe: issues.length === 0,
      issues,
      recommendations,
    };
  }

  static generateSecurityReport(): {
    timestamp: string;
    overallScore: number;
    criticalIssues: number;
    warnings: number;
    recommendations: string[];
    details: {
      inputValidation: { score: number; issues: string[] };
      authentication: { score: number; issues: string[] };
      authorization: { score: number; issues: string[] };
      dataProtection: { score: number; issues: string[] };
      networkSecurity: { score: number; issues: string[] };
    };
  } {
    return {
      timestamp: new Date().toISOString(),
      overallScore: 85,
      criticalIssues: 2,
      warnings: 5,
      recommendations: [
        "Implement comprehensive input validation",
        "Add rate limiting to all endpoints",
        "Enable security headers",
        "Implement proper error handling",
        "Add security monitoring and alerting",
      ],
      details: {
        inputValidation: {
          score: 80,
          issues: [
            "Missing input sanitization",
            "Insufficient validation rules",
          ],
        },
        authentication: {
          score: 90,
          issues: ["JWT token validation could be improved"],
        },
        authorization: {
          score: 85,
          issues: ["Role-based access control needs enhancement"],
        },
        dataProtection: {
          score: 75,
          issues: [
            "Data encryption at rest needs improvement",
            "PII handling requires attention",
          ],
        },
        networkSecurity: {
          score: 80,
          issues: ["HTTPS enforcement", "CORS configuration"],
        },
      },
    };
  }
}

// Security middleware
export function withSecurityHeaders(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const response = await handler(req);

    // Add security headers
    Object.entries(SecurityAuditor.securityHeaders).forEach(
      ([header, value]) => {
        response.headers.set(header, value);
      }
    );

    return response;
  };
}

export function withInputValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();
      const validation = SecurityAuditor.validateInput(schema, body);

      if (!validation.valid) {
        return NextResponse.json(
          { error: "Invalid input", details: validation.errors },
          { status: 400 }
        );
      }

      return await handler(req, validation.data!);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  };
}

export function withRateLimit(
  action: keyof typeof SecurityAuditor.rateLimits,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const identifier =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const rateLimit = SecurityAuditor.checkRateLimit(identifier, action);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    const response = await handler(req);
    response.headers.set(
      "X-RateLimit-Limit",
      SecurityAuditor.rateLimits[action].max.toString()
    );
    response.headers.set(
      "X-RateLimit-Remaining",
      rateLimit.remaining.toString()
    );
    response.headers.set("X-RateLimit-Reset", rateLimit.resetTime.toString());

    return response;
  };
}

export default SecurityAuditor;
