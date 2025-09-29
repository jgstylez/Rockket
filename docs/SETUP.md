# 🛠️ Rockket Platform Setup Guide

## Overview

This comprehensive setup guide will help you get the Rockket multi-tenant SaaS platform up and running quickly, whether for local development, staging, or production environments.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [External Services](#external-services)
- [Testing Setup](#testing-setup)
- [Monitoring Setup](#monitoring-setup)
- [Security Setup](#security-setup)
- [Performance Setup](#performance-setup)
- [Troubleshooting](#troubleshooting)

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/rockket.git
cd rockket

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis
npm run services:start

# Run database migrations
npm run db:migrate

# Seed development data
npm run db:seed
```

### 4. Start Development

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your Rockket platform!

## Prerequisites

### System Requirements

**Minimum Requirements:**

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **PostgreSQL**: 14.0 or higher
- **Redis**: 6.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 20GB minimum, 50GB recommended

### Required Software

#### Node.js Installation

**Using Node Version Manager (Recommended):**

```bash
# Install nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 20
nvm use 20
```

**Direct Installation:**

```bash
# macOS (using Homebrew)
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# Download from https://nodejs.org/
```

#### PostgreSQL Installation

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**

```bash
# Download from https://www.postgresql.org/download/windows/
```

#### Redis Installation

**macOS:**

```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**

```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**Windows:**

```bash
# Download from https://github.com/microsoftarchive/redis/releases
```

## Local Development Setup

### 1. Repository Setup

```bash
# Clone repository
git clone https://github.com/your-org/rockket.git
cd rockket

# Install dependencies
npm install

# Install development dependencies
npm install --save-dev
```

### 2. Environment Configuration

Create environment files for different environments:

#### `.env.local` (Local Development)

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/rockket_dev"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-for-development"
NEXTAUTH_SECRET="your-nextauth-secret-for-development"
NEXTAUTH_URL="http://localhost:3000"

# External Services (Optional for development)
SENTRY_DSN=""
POSTHOG_KEY=""
POSTHOG_HOST="https://app.posthog.com"

# Storage (Optional for development)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_S3_BUCKET="rockket-dev-storage"

# Email (Optional for development)
SENDGRID_API_KEY=""
FROM_EMAIL="noreply@localhost"

# AI Services (Required for AI features)
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Feature Flags
UNLEASH_URL="https://app.unleash-hosted.com/api"
UNLEASH_CLIENT_KEY="your-unleash-client-key"

# Development Settings
NODE_ENV="development"
ENABLE_MONITORING=false
ENABLE_ANALYTICS=false
ENABLE_PERFORMANCE_TRACKING=false
```

### 3. Database Setup

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE rockket_dev;
CREATE USER rockket_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rockket_dev TO rockket_user;
\q
```

#### Run Migrations

```bash
# Run database migrations
npm run db:migrate

# Verify migrations
npm run db:migrate:status
```

#### Seed Development Data

```bash
# Seed development data
npm run db:seed

# Verify seeded data
npm run db:seed:verify
```

### 4. Redis Setup

```bash
# Start Redis server
redis-server

# Test Redis connection
redis-cli ping
# Should return: PONG
```

### 5. Start Development Server

```bash
# Start development server
npm run dev

# Or start with specific port
npm run dev -- -p 3001
```

### 6. Verify Setup

```bash
# Check application health
curl http://localhost:3000/api/health

# Check database connection
curl http://localhost:3000/api/health/database

# Check Redis connection
curl http://localhost:3000/api/health/redis
```

## Environment Configuration

### 1. Environment Variables Reference

#### Core Configuration

```bash
# Application
NODE_ENV="development|staging|production"
PORT=3000
HOSTNAME="0.0.0.0"

# Database
DATABASE_URL="postgresql://username:password@host:port/database"
REDIS_URL="redis://host:port"

# Authentication
JWT_SECRET="your-jwt-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"
```

#### External Services

```bash
# Monitoring
SENTRY_DSN="your-sentry-dsn"
POSTHOG_KEY="your-posthog-key"
POSTHOG_HOST="https://app.posthog.com"

# Storage
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-s3-bucket"

# Email
SENDGRID_API_KEY="your-sendgrid-api-key"
FROM_EMAIL="noreply@your-domain.com"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Feature Flags
UNLEASH_URL="https://app.unleash-hosted.com/api"
UNLEASH_CLIENT_KEY="your-unleash-client-key"
```

### 2. Environment Validation

```bash
# Validate environment configuration
npm run env:validate

# Check required environment variables
npm run env:check
```

## Database Setup

### 1. Database Schema

The Rockket platform uses the following main database tables:

- **users**: User accounts and profiles
- **tenants**: Multi-tenant organizations
- **projects**: Visual builder projects
- **content**: CMS content and pages
- **products**: E-commerce products
- **orders**: E-commerce orders
- **analytics**: Analytics events and metrics
- **feature_flags**: Feature flag configurations

### 2. Database Migrations

```bash
# Create new migration
npm run db:migrate:create -- --name add_new_feature

# Run migrations
npm run db:migrate

# Rollback migration
npm run db:migrate:rollback

# Reset database
npm run db:reset
```

### 3. Database Seeding

```bash
# Seed development data
npm run db:seed

# Seed specific data
npm run db:seed:users
npm run db:seed:tenants
npm run db:seed:projects

# Clear seeded data
npm run db:seed:clear
```

### 4. Database Backup and Restore

```bash
# Backup database
npm run db:backup

# Restore database
npm run db:restore -- --file backup.sql

# Schedule automated backups
npm run db:backup:schedule
```

## External Services

### 1. Sentry (Error Tracking)

```bash
# Setup Sentry
npm run monitoring:setup

# Configure Sentry DSN
export SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
```

### 2. PostHog (Analytics)

```bash
# Setup PostHog
npm run analytics:setup

# Configure PostHog
export POSTHOG_KEY="your-posthog-key"
export POSTHOG_HOST="https://app.posthog.com"
```

### 3. AWS S3 (Storage)

```bash
# Setup AWS S3
npm run storage:setup

# Configure AWS credentials
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"
export AWS_S3_BUCKET="your-bucket-name"
```

### 4. SendGrid (Email)

```bash
# Setup SendGrid
npm run email:setup

# Configure SendGrid
export SENDGRID_API_KEY="your-sendgrid-api-key"
export FROM_EMAIL="noreply@your-domain.com"
```

### 5. AI Services

```bash
# Setup AI services
npm run ai:setup

# Configure OpenAI
export OPENAI_API_KEY="your-openai-api-key"

# Configure Anthropic
export ANTHROPIC_API_KEY="your-anthropic-api-key"

# Configure Google AI
export GOOGLE_AI_API_KEY="your-google-ai-api-key"
```

## Testing Setup

### 1. Test Environment

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Setup test environment
npm run test:setup
```

### 2. Test Database

```bash
# Create test database
npm run db:test:create

# Run test migrations
npm run db:test:migrate

# Seed test data
npm run db:test:seed
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### 4. Test Data

```bash
# Generate test data
npm run test:data:generate

# Clear test data
npm run test:data:clear
```

## Monitoring Setup

### 1. Performance Monitoring

```bash
# Setup performance monitoring
npm run performance:setup

# Configure performance tracking
npm run performance:configure
```

### 2. Error Tracking

```bash
# Setup error tracking
npm run monitoring:setup

# Configure error tracking
npm run monitoring:configure
```

### 3. Analytics

```bash
# Setup analytics
npm run analytics:setup

# Configure analytics
npm run analytics:configure
```

### 4. Health Checks

```bash
# Setup health checks
npm run health:setup

# Test health checks
npm run health:test
```

## Security Setup

### 1. Security Audit

```bash
# Run security audit
npm run security:audit

# Fix security issues
npm run security:fix
```

### 2. Penetration Testing

```bash
# Run penetration tests
npm run security:test

# Generate security report
npm run security:report
```

### 3. Security Headers

```bash
# Setup security headers
npm run security:headers

# Configure security headers
npm run security:configure
```

### 4. Rate Limiting

```bash
# Setup rate limiting
npm run security:rate-limit

# Configure rate limiting
npm run security:rate-limit:configure
```

## Performance Setup

### 1. Caching

```bash
# Setup caching
npm run performance:cache:setup

# Configure caching
npm run performance:cache:configure
```

### 2. Image Optimization

```bash
# Setup image optimization
npm run performance:images:setup

# Configure image optimization
npm run performance:images:configure
```

### 3. Bundle Optimization

```bash
# Analyze bundle
npm run performance:bundle:analyze

# Optimize bundle
npm run performance:bundle:optimize
```

### 4. Database Optimization

```bash
# Optimize database
npm run performance:db:optimize

# Create indexes
npm run performance:db:indexes
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database connection
npm run db:check

# Test database connection
npm run db:test

# Reset database connection
npm run db:reset:connection
```

#### 2. Redis Connection Issues

```bash
# Check Redis connection
npm run redis:check

# Test Redis connection
npm run redis:test

# Reset Redis connection
npm run redis:reset
```

#### 3. Build Issues

```bash
# Clear build cache
npm run build:clear

# Rebuild application
npm run build:rebuild

# Check build configuration
npm run build:check
```

#### 4. Environment Issues

```bash
# Validate environment
npm run env:validate

# Check environment variables
npm run env:check

# Reset environment
npm run env:reset
```

### Debug Mode

```bash
# Enable debug mode
DEBUG=rockket:* npm run dev

# Enable specific debug modules
DEBUG=rockket:database,rockket:redis npm run dev
```

### Logs

```bash
# View application logs
npm run logs:app

# View error logs
npm run logs:error

# View performance logs
npm run logs:performance

# Clear logs
npm run logs:clear
```

## Next Steps

After completing the setup:

1. **Explore the Platform**: Visit `http://localhost:3000` and explore the features
2. **Read the Documentation**: Check out the comprehensive documentation
3. **Run Tests**: Ensure everything is working correctly
4. **Configure Services**: Set up external services as needed
5. **Deploy**: Follow the deployment guide for production

## Support

If you encounter any issues during setup:

- **Documentation**: [docs.rockket.dev](https://docs.rockket.dev)
- **Issues**: [GitHub Issues](https://github.com/your-org/rockket/issues)
- **Discord**: [Rockket Community](https://discord.gg/rockket)
- **Email**: support@rockket.dev

---

**Happy Building! 🚀✨**
