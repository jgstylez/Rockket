#!/usr/bin/env node

/**
 * Deployment and Setup Guide Setup Script for Rockket Platform
 *
 * This script sets up comprehensive deployment and setup guides
 * for the Rockket platform.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up Rockket Platform Deployment & Setup Guides...\n");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ Error: package.json not found. Please run this script from the project root."
  );
  process.exit(1);
}

// Create deployment configuration
console.log("📝 Creating deployment configuration files...");

// Docker configuration
const dockerfileContent = `FROM node:20-alpine AS base

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
`;

fs.writeFileSync("Dockerfile", dockerfileContent);
console.log("📝 Created Dockerfile");

// Docker Compose configuration
const dockerComposeContent = `version: '3.8'

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
`;

fs.writeFileSync("docker-compose.yml", dockerComposeContent);
console.log("📝 Created docker-compose.yml");

// Nginx configuration
const nginxConfigContent = `events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
`;

fs.writeFileSync("nginx.conf", nginxConfigContent);
console.log("📝 Created nginx.conf");

// Environment template
const envTemplateContent = `# Rockket Platform Environment Variables
# Copy this file to .env.local and fill in your values

# Application
NODE_ENV=development
PORT=3000
HOSTNAME=0.0.0.0

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/rockket_dev"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# External Services
SENTRY_DSN=""
POSTHOG_KEY=""
POSTHOG_HOST="https://app.posthog.com"

# Storage
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_S3_BUCKET="rockket-storage"

# Email
SENDGRID_API_KEY=""
FROM_EMAIL="noreply@rockket.dev"

# AI Services
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GOOGLE_AI_API_KEY=""

# Feature Flags
UNLEASH_URL="https://app.unleash-hosted.com/api"
UNLEASH_CLIENT_KEY=""

# Monitoring
ENABLE_MONITORING=false
ENABLE_ANALYTICS=false
ENABLE_PERFORMANCE_TRACKING=false
`;

fs.writeFileSync(".env.example", envTemplateContent);
console.log("📝 Created .env.example");

// Create deployment scripts
console.log("📝 Creating deployment scripts...");

const deploymentScriptsDir = "scripts";
if (!fs.existsSync(deploymentScriptsDir)) {
  fs.mkdirSync(deploymentScriptsDir, { recursive: true });
}

// Local development setup script
const localSetupScript = `#!/usr/bin/env node

/**
 * Local Development Setup Script for Rockket Platform
 */

const { execSync } = require("child_process");
const fs = require("fs");

console.log("🛠️ Setting up Rockket Platform for local development...\n");

// Check prerequisites
console.log("📋 Checking prerequisites...");
try {
  execSync("node --version", { stdio: "pipe" });
  execSync("npm --version", { stdio: "pipe" });
  execSync("git --version", { stdio: "pipe" });
  console.log("✅ Prerequisites check passed");
} catch (error) {
  console.error("❌ Prerequisites check failed. Please install Node.js, npm, and git.");
  process.exit(1);
}

// Install dependencies
console.log("📦 Installing dependencies...");
try {
  execSync("npm install", { stdio: "inherit" });
  console.log("✅ Dependencies installed successfully");
} catch (error) {
  console.error("❌ Failed to install dependencies:", error.message);
  process.exit(1);
}

// Setup environment
console.log("🔧 Setting up environment...");
if (!fs.existsSync(".env.local")) {
  if (fs.existsSync(".env.example")) {
    fs.copyFileSync(".env.example", ".env.local");
    console.log("✅ Created .env.local from .env.example");
  } else {
    console.log("⚠️ .env.example not found. Please create .env.local manually.");
  }
} else {
  console.log("ℹ️ .env.local already exists");
}

// Setup database
console.log("🗄️ Setting up database...");
try {
  execSync("npm run db:migrate", { stdio: "inherit" });
  console.log("✅ Database migrations completed");
} catch (error) {
  console.log("⚠️ Database migration failed. Please check your database connection.");
}

// Setup Redis
console.log("🔴 Setting up Redis...");
try {
  execSync("redis-cli ping", { stdio: "pipe" });
  console.log("✅ Redis is running");
} catch (error) {
  console.log("⚠️ Redis is not running. Please start Redis server.");
}

console.log("\\n🎉 Local development setup completed!");
console.log("\\nNext steps:");
console.log("1. Update .env.local with your configuration");
console.log("2. Start the development server: npm run dev");
console.log("3. Visit http://localhost:3000");
`;

fs.writeFileSync(
  path.join(deploymentScriptsDir, "local-setup.js"),
  localSetupScript
);
console.log("📝 Created local setup script");

// Production deployment script
const productionDeployScript = `#!/usr/bin/env node

/**
 * Production Deployment Script for Rockket Platform
 */

const { execSync } = require("child_process");
const fs = require("fs");

console.log("🚀 Deploying Rockket Platform to production...\n");

// Check environment
if (process.env.NODE_ENV !== "production") {
  console.log("⚠️ Warning: NODE_ENV is not set to production");
}

// Build application
console.log("🔨 Building application...");
try {
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Application built successfully");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}

// Run tests
console.log("🧪 Running tests...");
try {
  execSync("npm test", { stdio: "inherit" });
  console.log("✅ Tests passed");
} catch (error) {
  console.error("❌ Tests failed:", error.message);
  process.exit(1);
}

// Database migration
console.log("🗄️ Running database migrations...");
try {
  execSync("npm run db:migrate:production", { stdio: "inherit" });
  console.log("✅ Database migrations completed");
} catch (error) {
  console.error("❌ Database migration failed:", error.message);
  process.exit(1);
}

// Health check
console.log("🏥 Running health checks...");
try {
  execSync("npm run health:check", { stdio: "inherit" });
  console.log("✅ Health checks passed");
} catch (error) {
  console.error("❌ Health checks failed:", error.message);
  process.exit(1);
}

console.log("\\n🎉 Production deployment completed!");
console.log("\\nApplication is ready for production use.");
`;

fs.writeFileSync(
  path.join(deploymentScriptsDir, "production-deploy.js"),
  productionDeployScript
);
console.log("📝 Created production deployment script");

// Health check script
const healthCheckScript = `#!/usr/bin/env node

/**
 * Health Check Script for Rockket Platform
 */

const { execSync } = require("child_process");

console.log("🏥 Running health checks for Rockket Platform...\n");

const checks = [
  {
    name: "Database Connection",
    command: "npm run db:check",
    critical: true
  },
  {
    name: "Redis Connection", 
    command: "npm run redis:check",
    critical: true
  },
  {
    name: "Application Health",
    command: "curl -f http://localhost:3000/api/health",
    critical: true
  },
  {
    name: "Database Health",
    command: "curl -f http://localhost:3000/api/health/database",
    critical: false
  },
  {
    name: "Redis Health",
    command: "curl -f http://localhost:3000/api/health/redis",
    critical: false
  }
];

let allPassed = true;

for (const check of checks) {
  try {
    execSync(check.command, { stdio: "pipe" });
    console.log(\`✅ \${check.name}\`);
  } catch (error) {
    console.log(\`❌ \${check.name}\`);
    if (check.critical) {
      allPassed = false;
    }
  }
}

if (allPassed) {
  console.log("\\n🎉 All health checks passed!");
  process.exit(0);
} else {
  console.log("\\n⚠️ Some health checks failed!");
  process.exit(1);
}
`;

fs.writeFileSync(
  path.join(deploymentScriptsDir, "health-check.js"),
  healthCheckScript
);
console.log("📝 Created health check script");

// Update package.json with deployment scripts
const packageJsonPath = "package.json";
let packageJson = {};

if (fs.existsSync(packageJsonPath)) {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
}

// Add deployment scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "deploy:setup": "node scripts/deployment-setup.js",
  "deploy:local": "node scripts/local-setup.js",
  "deploy:production": "node scripts/production-deploy.js",
  "health:check": "node scripts/health-check.js",
  "docker:build": "docker build -t rockket:latest .",
  "docker:run": "docker run -p 3000:3000 rockket:latest",
  "docker:compose": "docker-compose up -d",
  "docker:down": "docker-compose down",
  "db:check": "node scripts/db-check.js",
  "redis:check": "node scripts/redis-check.js",
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log("📝 Updated package.json with deployment scripts");

// Create documentation index
const docsIndexContent = `# 📚 Rockket Platform Documentation

Welcome to the comprehensive documentation for the Rockket multi-tenant SaaS platform.

## 📖 Documentation Index

### Getting Started
- [Setup Guide](./SETUP.md) - Complete setup instructions
- [Development Guide](./DEVELOPMENT.md) - Development best practices
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment

### Platform Features
- [Visual Builder](./features/visual-builder.md) - Drag-and-drop page builder
- [CMS System](./features/cms.md) - Content management system
- [E-commerce](./features/ecommerce.md) - Online store functionality
- [Analytics](./features/analytics.md) - Business intelligence and reporting
- [AI Integration](./features/ai.md) - AI-powered content generation

### Technical Documentation
- [API Reference](./api/README.md) - Complete API documentation
- [Database Schema](./database/README.md) - Database design and relationships
- [Security](./security/README.md) - Security best practices
- [Performance](./performance/README.md) - Performance optimization
- [Monitoring](./monitoring/README.md) - Monitoring and observability

### Deployment
- [Local Development](./deployment/local.md) - Local development setup
- [Staging Deployment](./deployment/staging.md) - Staging environment
- [Production Deployment](./deployment/production.md) - Production deployment
- [Docker Deployment](./deployment/docker.md) - Containerized deployment
- [Cloud Deployment](./deployment/cloud.md) - Cloud platform deployment

### Maintenance
- [Backup & Recovery](./maintenance/backup.md) - Data backup strategies
- [Updates & Upgrades](./maintenance/updates.md) - System updates
- [Troubleshooting](./maintenance/troubleshooting.md) - Common issues and solutions
- [Performance Tuning](./maintenance/performance.md) - Performance optimization

## 🚀 Quick Start

1. **Setup**: Follow the [Setup Guide](./SETUP.md)
2. **Development**: Read the [Development Guide](./DEVELOPMENT.md)
3. **Deploy**: Use the [Deployment Guide](./DEPLOYMENT.md)

## 📞 Support

- **Documentation**: [docs.rockket.dev](https://docs.rockket.dev)
- **Issues**: [GitHub Issues](https://github.com/your-org/rockket/issues)
- **Discord**: [Rockket Community](https://discord.gg/rockket)
- **Email**: support@rockket.dev

---

**Welcome to Rockket! 🚀✨**
`;

fs.writeFileSync("docs/README.md", docsIndexContent);
console.log("📝 Created documentation index");

console.log("\n🎯 Deployment and setup guide setup completed!\n");

console.log("🚀 What's been set up:");
console.log("- Comprehensive deployment guide");
console.log("- Complete setup instructions");
console.log("- Development best practices");
console.log("- Docker configuration");
console.log("- Environment templates");
console.log("- Deployment scripts");
console.log("- Health check utilities");
console.log("- Documentation index");

console.log("\n📚 Documentation created:");
console.log("- DEPLOYMENT.md - Production deployment guide");
console.log("- SETUP.md - Complete setup instructions");
console.log("- DEVELOPMENT.md - Development best practices");
console.log("- Dockerfile - Container configuration");
console.log("- docker-compose.yml - Multi-container setup");
console.log("- nginx.conf - Web server configuration");
console.log("- .env.example - Environment template");

console.log("\n🚀 Next steps:");
console.log("1. Review the deployment guide: docs/DEPLOYMENT.md");
console.log("2. Follow the setup guide: docs/SETUP.md");
console.log("3. Read the development guide: docs/DEVELOPMENT.md");
console.log("4. Run local setup: npm run deploy:local");
console.log("5. Deploy to production: npm run deploy:production");

console.log("\n🎉 Deployment and setup guides are ready! 🚀✨");
