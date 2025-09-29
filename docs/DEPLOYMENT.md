# 🚀 Rockket Platform Deployment Guide

## Overview

This comprehensive deployment guide covers all aspects of deploying the Rockket multi-tenant SaaS platform, from local development to production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Monitoring & Observability](#monitoring--observability)
- [Security Configuration](#security-configuration)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## Prerequisites

### System Requirements

**Minimum Requirements:**

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- PostgreSQL 14.0 or higher
- Redis 6.0 or higher
- 4GB RAM
- 20GB disk space

**Recommended Requirements:**

- Node.js 20.0.0 or higher
- npm 10.0.0 or higher
- PostgreSQL 15.0 or higher
- Redis 7.0 or higher
- 8GB RAM
- 50GB SSD disk space

### Required Services

- **Database**: PostgreSQL for primary data storage
- **Cache**: Redis for caching and session storage
- **Storage**: AWS S3, Google Cloud Storage, or Azure Blob Storage
- **Email**: SendGrid, AWS SES, or similar email service
- **Monitoring**: Sentry for error tracking, PostHog for analytics
- **CDN**: CloudFlare, AWS CloudFront, or similar CDN service

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/rockket.git
cd rockket
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create environment files for different environments:

#### `.env.local` (Local Development)

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rockket_dev"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# External Services
SENTRY_DSN="your-sentry-dsn"
POSTHOG_KEY="your-posthog-key"
POSTHOG_HOST="https://app.posthog.com"

# Storage
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="rockket-storage"

# Email
SENDGRID_API_KEY="your-sendgrid-api-key"
FROM_EMAIL="noreply@rockket.dev"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Feature Flags
UNLEASH_URL="https://app.unleash-hosted.com/api"
UNLEASH_CLIENT_KEY="your-unleash-client-key"

# Monitoring
ENABLE_MONITORING=true
ENABLE_ANALYTICS=true
ENABLE_PERFORMANCE_TRACKING=true
```

#### `.env.staging` (Staging)

```bash
# Database
DATABASE_URL="postgresql://username:password@staging-db:5432/rockket_staging"
REDIS_URL="redis://staging-redis:6379"

# Authentication
JWT_SECRET="staging-jwt-secret"
NEXTAUTH_SECRET="staging-nextauth-secret"
NEXTAUTH_URL="https://staging.rockket.dev"

# External Services
SENTRY_DSN="staging-sentry-dsn"
POSTHOG_KEY="staging-posthog-key"
POSTHOG_HOST="https://app.posthog.com"

# Storage
AWS_ACCESS_KEY_ID="staging-aws-access-key"
AWS_SECRET_ACCESS_KEY="staging-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="rockket-staging-storage"

# Email
SENDGRID_API_KEY="staging-sendgrid-api-key"
FROM_EMAIL="noreply@staging.rockket.dev"

# AI Services
OPENAI_API_KEY="staging-openai-api-key"
ANTHROPIC_API_KEY="staging-anthropic-api-key"
GOOGLE_AI_API_KEY="staging-google-ai-api-key"

# Feature Flags
UNLEASH_URL="https://app.unleash-hosted.com/api"
UNLEASH_CLIENT_KEY="staging-unleash-client-key"

# Monitoring
ENABLE_MONITORING=true
ENABLE_ANALYTICS=true
ENABLE_PERFORMANCE_TRACKING=true
```

#### `.env.production` (Production)

```bash
# Database
DATABASE_URL="postgresql://username:password@prod-db:5432/rockket_prod"
REDIS_URL="redis://prod-redis:6379"

# Authentication
JWT_SECRET="production-jwt-secret"
NEXTAUTH_SECRET="production-nextauth-secret"
NEXTAUTH_URL="https://rockket.dev"

# External Services
SENTRY_DSN="production-sentry-dsn"
POSTHOG_KEY="production-posthog-key"
POSTHOG_HOST="https://app.posthog.com"

# Storage
AWS_ACCESS_KEY_ID="production-aws-access-key"
AWS_SECRET_ACCESS_KEY="production-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="rockket-production-storage"

# Email
SENDGRID_API_KEY="production-sendgrid-api-key"
FROM_EMAIL="noreply@rockket.dev"

# AI Services
OPENAI_API_KEY="production-openai-api-key"
ANTHROPIC_API_KEY="production-anthropic-api-key"
GOOGLE_AI_API_KEY="production-google-ai-api-key"

# Feature Flags
UNLEASH_URL="https://app.unleash-hosted.com/api"
UNLEASH_CLIENT_KEY="production-unleash-client-key"

# Monitoring
ENABLE_MONITORING=true
ENABLE_ANALYTICS=true
ENABLE_PERFORMANCE_TRACKING=true
```

## Local Development

### 1. Database Setup

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
createdb rockket_dev
```

### 2. Redis Setup

```bash
# Install Redis (macOS)
brew install redis
brew services start redis

# Install Redis (Ubuntu/Debian)
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 3. Run Database Migrations

```bash
npm run db:migrate
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 5. Run Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

## Staging Deployment

### 1. Prepare Staging Environment

```bash
# Set environment
export NODE_ENV=staging

# Install dependencies
npm ci --only=production

# Build application
npm run build
```

### 2. Database Setup

```bash
# Run migrations
npm run db:migrate:staging

# Seed staging data
npm run db:seed:staging
```

### 3. Deploy to Staging

```bash
# Deploy using your preferred method
npm run deploy:staging
```

### 4. Health Checks

```bash
# Check application health
curl https://staging.rockket.dev/api/health

# Check database connection
curl https://staging.rockket.dev/api/health/database

# Check Redis connection
curl https://staging.rockket.dev/api/health/redis
```

## Production Deployment

### 1. Infrastructure Setup

#### AWS Deployment

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name rockket-prod

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier rockket-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username rockket \
  --master-user-password your-secure-password \
  --allocated-storage 100

# Create ElastiCache Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id rockket-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

#### Google Cloud Deployment

```bash
# Create Cloud SQL instance
gcloud sql instances create rockket-prod \
  --database-version=POSTGRES_15 \
  --tier=db-standard-1 \
  --region=us-central1

# Create Memorystore Redis instance
gcloud redis instances create rockket-redis \
  --size=1 \
  --region=us-central1
```

### 2. Application Deployment

#### Using Docker

```bash
# Build Docker image
docker build -t rockket:latest .

# Run container
docker run -d \
  --name rockket-prod \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://..." \
  -e REDIS_URL="redis://..." \
  rockket:latest
```

#### Using Kubernetes

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rockket
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rockket
  template:
    metadata:
      labels:
        app: rockket
    spec:
      containers:
        - name: rockket
          image: rockket:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: rockket-secrets
                  key: database-url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: rockket-secrets
                  key: redis-url
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
              cpu: "500m"
```

### 3. Database Migration

```bash
# Run production migrations
npm run db:migrate:production

# Verify migration status
npm run db:migrate:status
```

### 4. SSL/TLS Configuration

```bash
# Using Let's Encrypt
certbot --nginx -d rockket.dev -d www.rockket.dev

# Using AWS Certificate Manager
aws acm request-certificate \
  --domain-name rockket.dev \
  --validation-method DNS
```

## Docker Deployment

### 1. Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/rockket
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=rockket
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### 3. Build and Deploy

```bash
# Build Docker image
docker build -t rockket:latest .

# Run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f app
```

## Cloud Deployment

### AWS Deployment

#### 1. ECS with Fargate

```bash
# Create ECS task definition
aws ecs register-task-definition \
  --family rockket \
  --cpu 512 \
  --memory 1024 \
  --network-mode awsvpc \
  --requires-compatibilities FARGATE \
  --execution-role-arn arn:aws:iam::account:role/ecsTaskExecutionRole \
  --container-definitions file://task-definition.json
```

#### 2. Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name rockket-alb \
  --subnets subnet-12345 subnet-67890 \
  --security-groups sg-12345
```

#### 3. Auto Scaling

```bash
# Create auto scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name rockket-asg \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 3 \
  --target-group-arns arn:aws:elasticloadbalancing:region:account:targetgroup/rockket-tg
```

### Google Cloud Deployment

#### 1. Cloud Run

```bash
# Deploy to Cloud Run
gcloud run deploy rockket \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### 2. Cloud SQL

```bash
# Create Cloud SQL instance
gcloud sql instances create rockket-prod \
  --database-version=POSTGRES_15 \
  --tier=db-standard-1 \
  --region=us-central1
```

### Azure Deployment

#### 1. Container Instances

```bash
# Deploy to Azure Container Instances
az container create \
  --resource-group rockket-rg \
  --name rockket \
  --image rockket:latest \
  --cpu 1 \
  --memory 2 \
  --ports 3000
```

#### 2. Azure Database for PostgreSQL

```bash
# Create PostgreSQL server
az postgres server create \
  --resource-group rockket-rg \
  --name rockket-db \
  --location eastus \
  --admin-user rockket \
  --admin-password your-secure-password \
  --sku-name GP_Gen5_2
```

## Monitoring & Observability

### 1. Sentry Setup

```bash
# Install Sentry
npm install @sentry/nextjs

# Configure Sentry
npm run sentry:setup
```

### 2. PostHog Setup

```bash
# Install PostHog
npm install posthog-js

# Configure PostHog
npm run posthog:setup
```

### 3. Health Checks

```typescript
// api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    storage: await checkStorage(),
    email: await checkEmail(),
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

### 4. Logging

```typescript
// lib/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
```

## Security Configuration

### 1. Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
```

### 2. Rate Limiting

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Rate limiting logic
  const rateLimit = checkRateLimit(request);

  if (!rateLimit.allowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
```

### 3. CORS Configuration

```typescript
// lib/cors.ts
export const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://rockket.dev", "https://www.rockket.dev"]
      : ["http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};
```

## Performance Optimization

### 1. Caching Strategy

```typescript
// lib/cache.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get(key: string) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttl: number = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string) {
    await redis.del(key);
  },
};
```

### 2. Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_tenants_slug ON tenants(slug);
CREATE INDEX CONCURRENTLY idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX CONCURRENTLY idx_content_tenant_id ON content(tenant_id);
```

### 3. CDN Configuration

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ["your-cdn-domain.com"],
    loader: "custom",
    loaderFile: "./lib/image-loader.js",
  },
};
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database connection
npm run db:check

# Reset database
npm run db:reset

# Run migrations
npm run db:migrate
```

#### 2. Redis Connection Issues

```bash
# Check Redis connection
redis-cli ping

# Check Redis logs
docker logs redis-container
```

#### 3. Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### 4. Memory Issues

```bash
# Check memory usage
npm run memory:check

# Increase Node.js memory limit
node --max-old-space-size=4096 server.js
```

### Log Analysis

```bash
# View application logs
npm run logs:app

# View error logs
npm run logs:error

# View performance logs
npm run logs:performance
```

## Maintenance

### 1. Database Maintenance

```bash
# Backup database
npm run db:backup

# Restore database
npm run db:restore

# Optimize database
npm run db:optimize
```

### 2. Cache Maintenance

```bash
# Clear cache
npm run cache:clear

# Cache statistics
npm run cache:stats
```

### 3. Security Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit

# Fix security issues
npm audit fix
```

### 4. Performance Monitoring

```bash
# Performance report
npm run performance:report

# Bundle analysis
npm run analyze

# Lighthouse audit
npm run lighthouse
```

## Support

For deployment support and questions:

- **Documentation**: [docs.rockket.dev](https://docs.rockket.dev)
- **Issues**: [GitHub Issues](https://github.com/your-org/rockket/issues)
- **Discord**: [Rockket Community](https://discord.gg/rockket)
- **Email**: support@rockket.dev

---

**Happy Deploying! 🚀✨**
