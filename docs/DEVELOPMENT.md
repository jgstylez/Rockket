# 👨‍💻 Rockket Platform Development Guide

## Overview

This comprehensive development guide covers all aspects of developing with the Rockket multi-tenant SaaS platform, including architecture, coding standards, best practices, and development workflows.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Development Environment](#development-environment)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)
- [API Development](#api-development)
- [Frontend Development](#frontend-development)
- [Database Development](#database-development)
- [Testing](#testing)
- [Performance](#performance)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Architecture Overview

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Next.js API) │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Cache         │    │   Storage       │
│   (CloudFlare)  │    │   (Redis)       │    │   (AWS S3)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Context + Zustand
- **Forms**: React Hook Form + Zod

**Backend:**

- **Runtime**: Node.js 20
- **Framework**: Next.js API Routes
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: NextAuth.js

**Infrastructure:**

- **Hosting**: Vercel, AWS, or Google Cloud
- **Database**: PostgreSQL (AWS RDS, Google Cloud SQL)
- **Cache**: Redis (AWS ElastiCache, Google Memorystore)
- **Storage**: AWS S3, Google Cloud Storage
- **CDN**: CloudFlare, AWS CloudFront

## Development Environment

### 1. Prerequisites

```bash
# Required software
node --version  # v20.0.0+
npm --version   # v10.0.0+
git --version   # v2.30.0+

# Optional but recommended
docker --version
```

### 2. Environment Setup

```bash
# Clone repository
git clone https://github.com/your-org/rockket.git
cd rockket

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
```

### 3. Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm test

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Coding Standards

### 1. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2. ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### 3. Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 4. Code Style Guidelines

#### TypeScript

```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  email: string;
  name: string;
}

// Use type aliases for unions
type Status = "pending" | "approved" | "rejected";

// Use enums for constants
enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

// Use generics for reusable components
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

#### React Components

```typescript
// Use functional components with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

#### API Routes

```typescript
// Use proper HTTP methods and status codes
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json({ data, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createData(body);
    return NextResponse.json({ data: result, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
```

## Project Structure

```
rockket/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes
│   │   ├── dashboard/         # Dashboard routes
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   └── features/         # Feature components
│   ├── lib/                  # Utility libraries
│   │   ├── auth/            # Authentication
│   │   ├── database/        # Database utilities
│   │   ├── cache/           # Caching utilities
│   │   ├── monitoring/      # Monitoring utilities
│   │   ├── security/        # Security utilities
│   │   └── performance/     # Performance utilities
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── public/                   # Static assets
├── docs/                    # Documentation
├── scripts/                 # Build and deployment scripts
├── tests/                   # Test files
├── .env.example         # Environment variables template
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
└── README.md              # Project documentation
```

## API Development

### 1. API Route Structure

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["admin", "user"]),
});

export async function GET(request: NextRequest) {
  // Get all users
}

export async function POST(request: NextRequest) {
  // Create new user
  const body = await request.json();
  const validatedData = createUserSchema.parse(body);

  // Create user logic
}
```

### 2. Database Operations

```typescript
// lib/database/users.ts
import { prisma } from "@/lib/database/prisma";

export async function createUser(data: CreateUserData) {
  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role,
    },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      tenant: true,
      projects: true,
    },
  });
}
```

### 3. Error Handling

```typescript
// lib/errors/api-error.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Usage in API routes
export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

## Frontend Development

### 1. Component Development

```typescript
// components/ui/button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
            'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'underline-offset-4 hover:underline text-primary': variant === 'link',
          },
          {
            'h-10 py-2 px-4': size === 'default',
            'h-9 px-3 rounded-md': size === 'sm',
            'h-11 px-8 rounded-md': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

### 2. Custom Hooks

```typescript
// hooks/use-api.ts
import { useState, useEffect } from "react";

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(url: string, options: UseApiOptions<T> = {}) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}
```

### 3. Form Handling

```typescript
// components/forms/user-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user']),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: Partial<UserFormData>;
}

export function UserForm({ onSubmit, initialData }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save User'}
      </button>
    </form>
  );
}
```

## Database Development

### 1. Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole @default(USER)
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users     User[]

  @@map("tenants")
}

enum UserRole {
  ADMIN
  USER
  GUEST
}
```

### 2. Database Operations

```typescript
// lib/database/index.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 3. Migrations

```bash
# Create migration
npx prisma migrate dev --name add_user_table

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

## Testing

### 1. Unit Testing

```typescript
// tests/unit/utils.test.ts
import { formatDate, formatCurrency } from "@/lib/utils";

describe("Utils", () => {
  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2023-01-01");
      expect(formatDate(date)).toBe("Jan 1, 2023");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      expect(formatCurrency(1000)).toBe("$1,000.00");
    });
  });
});
```

### 2. Integration Testing

```typescript
// tests/integration/api/users.test.ts
import { createMocks } from "node-mocks-http";
import handler from "@/app/api/users/route";

describe("/api/users", () => {
  it("should create a new user", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        name: "John Doe",
        email: "john@example.com",
        role: "user",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toMatchObject({
      success: true,
      data: {
        name: "John Doe",
        email: "john@example.com",
        role: "user",
      },
    });
  });
});
```

### 3. E2E Testing

```typescript
// tests/e2e/user-flow.test.ts
import { test, expect } from "@playwright/test";

test("user can create and manage projects", async ({ page }) => {
  await page.goto("/dashboard");

  // Login
  await page.click('[data-testid="login-button"]');
  await page.fill('[data-testid="email-input"]', "test@example.com");
  await page.fill('[data-testid="password-input"]', "password");
  await page.click('[data-testid="submit-button"]');

  // Create project
  await page.click('[data-testid="create-project-button"]');
  await page.fill('[data-testid="project-name-input"]', "My Project");
  await page.click('[data-testid="save-project-button"]');

  // Verify project was created
  await expect(page.locator('[data-testid="project-list"]')).toContainText(
    "My Project"
  );
});
```

## Performance

### 1. Code Splitting

```typescript
// Lazy load components
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 2. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={200}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

### 3. Caching

```typescript
// lib/cache/index.ts
import { redis } from "@/lib/redis";

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}
```

## Security

### 1. Input Validation

```typescript
// lib/validation/schemas.ts
import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  age: z.number().min(0, "Age must be positive").max(120, "Age too high"),
});
```

### 2. Authentication

```typescript
// lib/auth/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    request.headers.set("user-id", payload.userId);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
```

### 3. Rate Limiting

```typescript
// lib/rate-limit/index.ts
import { NextRequest } from "next/server";
import { redis } from "@/lib/redis";

export async function rateLimit(
  request: NextRequest,
  limit: number = 100,
  window: number = 3600
): Promise<boolean> {
  const ip = request.ip || "unknown";
  const key = `rate-limit:${ip}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  return current <= limit;
}
```

## Deployment

### 1. Build Process

```bash
# Build for production
npm run build

# Start production server
npm run start

# Run production tests
npm run test:prod
```

### 2. Environment Variables

```bash
# Production environment
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-production-secret
```

### 3. Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    storage: await checkStorage(),
  };

  const healthy = Object.values(checks).every(
    (check) => check.status === "healthy"
  );

  return Response.json({
    status: healthy ? "healthy" : "unhealthy",
    checks,
    timestamp: new Date().toISOString(),
  });
}
```

## Contributing

### 1. Development Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ...

# Run tests
npm test

# Run linting
npm run lint

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push branch
git push origin feature/new-feature

# Create pull request
```

### 2. Code Review Process

1. **Create Pull Request**: Use the GitHub PR template
2. **Run Tests**: Ensure all tests pass
3. **Code Review**: Request review from team members
4. **Address Feedback**: Make necessary changes
5. **Merge**: Merge after approval

### 3. Commit Convention

```bash
# Format: type(scope): description
feat(auth): add OAuth2 integration
fix(api): resolve user creation bug
docs(readme): update installation instructions
style(ui): improve button styling
refactor(db): optimize user queries
test(api): add user endpoint tests
```

## Support

For development support:

- **Documentation**: [docs.rockket.dev](https://docs.rockket.dev)
- **Issues**: [GitHub Issues](https://github.com/your-org/rockket/issues)
- **Discord**: [Rockket Community](https://discord.gg/rockket)
- **Email**: dev@rockket.dev

---

**Happy Coding! 👨‍💻✨**
