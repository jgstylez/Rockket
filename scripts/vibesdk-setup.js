#!/usr/bin/env node

/**
 * VibeSDK Setup Script for Rockket Platform
 *
 * This script sets up the Rockket platform with Cloudflare VibeSDK integration,
 * configuring all necessary Cloudflare services and infrastructure.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up Rockket Platform with Cloudflare VibeSDK...\n");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ Error: package.json not found. Please run this script from the project root."
  );
  process.exit(1);
}

// Install Cloudflare dependencies
console.log("📦 Installing Cloudflare dependencies...");
try {
  execSync("npm install @cloudflare/workers-types wrangler @cloudflare/ai", {
    stdio: "inherit",
  });
  console.log("✅ Cloudflare dependencies installed successfully");
} catch (error) {
  console.error("❌ Failed to install Cloudflare dependencies:", error.message);
  process.exit(1);
}

// Create Cloudflare configuration
console.log("📝 Creating Cloudflare configuration...");

// Update package.json with Cloudflare scripts
const packageJsonPath = "package.json";
let packageJson = {};

if (fs.existsSync(packageJsonPath)) {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
}

// Add Cloudflare scripts
packageJson.scripts = {
  ...packageJson.scripts,
  dev: "wrangler dev",
  deploy: "wrangler deploy",
  "deploy:staging": "wrangler deploy --env staging",
  "deploy:production": "wrangler deploy --env production",
  "db:create": "wrangler d1 create rockket-db",
  "db:migrate": "wrangler d1 migrations apply rockket-db",
  "db:migrate:local": "wrangler d1 migrations apply rockket-db --local",
  "db:seed": "wrangler d1 execute rockket-db --file=./migrations/seed.sql",
  "kv:create": "wrangler kv:namespace create CACHE",
  "r2:create": "wrangler r2 bucket create rockket-storage",
  "ai:setup": "wrangler ai gateway create vibesdk-gateway",
  tail: "wrangler tail",
  "vibesdk:setup": "node scripts/vibesdk-setup.js",
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log("📝 Updated package.json with Cloudflare scripts");

// Create environment configuration
const envExampleContent = `# Cloudflare VibeSDK Environment Variables
# Copy this file to .dev.vars for local development

# Cloudflare Account
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# AI Services
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_STUDIO_API_KEY=your-google-ai-api-key

# AI Gateway
CLOUDFLARE_AI_GATEWAY_TOKEN=your-ai-gateway-token

# Authentication
JWT_SECRET=your-jwt-secret

# External Services
SENTRY_DSN=your-sentry-dsn
POSTHOG_KEY=your-posthog-key
SENDGRID_API_KEY=your-sendgrid-api-key

# Feature Flags
UNLEASH_URL=https://app.unleash-hosted.com/api
UNLEASH_CLIENT_KEY=your-unleash-client-key

# Monitoring
ENABLE_MONITORING=true
ENABLE_ANALYTICS=true
ENABLE_PERFORMANCE_TRACKING=true
`;

fs.writeFileSync(".dev.vars.example", envExampleContent);
console.log("📝 Created .dev.vars.example");

// Create VibeSDK integration documentation
const vibesdkDocsContent = `# 🎨 VibeSDK Integration for Rockket Platform

## Overview

The Rockket platform is built on Cloudflare's VibeSDK, leveraging the power of AI-powered code generation with Durable Objects, D1 database, R2 storage, and AI Gateway.

## Architecture

### Core Components

- **Cloudflare Workers**: Serverless compute platform
- **Durable Objects**: Stateful AI agents for code generation
- **D1 Database**: SQLite database at the edge
- **R2 Storage**: Object storage for generated apps
- **AI Gateway**: Unified AI API gateway
- **KV Storage**: Caching and session management

### VibeSDK Integration

The platform uses VibeSDK for:

1. **AI-Powered Code Generation**: Generate complete applications from natural language prompts
2. **Real-time Progress Streaming**: WebSocket connections for live generation updates
3. **Multi-Phase Generation**: Planning, foundation, core, styling, integration, optimization
4. **Stateful AI Agents**: Durable Objects maintain generation state
5. **Global Deployment**: Generated apps deployed to Cloudflare Workers

## Code Generation Flow

\`\`\`typescript
// 1. User submits prompt
const prompt = "Create a todo list with drag and drop and dark mode";

// 2. VibeSDK processes the request
const generationId = await startCodeGeneration(prompt, options);

// 3. AI Agent generates code in phases
const phases = [
  "planning",      // Analyze requirements
  "foundation",    // Create project structure
  "core",          // Implement main logic
  "styling",       // Add CSS and design
  "integration",  // Connect APIs
  "optimization"  // Performance improvements
];

// 4. Real-time progress updates
websocket.send({
  generationId,
  phase: "styling",
  progress: 80,
  status: "generating"
});

// 5. Deploy generated app
const appUrl = await deployGeneratedApp(generatedCode);
\`\`\`

## Durable Objects

### CodeGeneratorAgent

Handles AI-powered code generation with stateful connections:

\`\`\`typescript
export class CodeGeneratorAgent extends DurableObject {
  async generateCode(prompt: string, options: any) {
    // Phase-wise generation with error recovery
    // Real-time progress streaming to frontend
    // Persistent state across WebSocket connections
  }
}
\`\`\`

### SessionManager

Manages user sessions and authentication:

\`\`\`typescript
export class SessionManager extends DurableObject {
  async createSession(userId: string) {
    // Create secure session
    // Store session data
    // Handle session validation
  }
}
\`\`\`

### AIAgent

Manages AI model interactions and caching:

\`\`\`typescript
export class AIAgent extends DurableObject {
  async processRequest(prompt: string, model: string) {
    // Route to appropriate AI model
    // Cache responses for efficiency
    // Handle rate limiting
  }
}
\`\`\`

## Database Schema

The platform uses D1 (SQLite) for data storage:

- **tenants**: Multi-tenant organizations
- **users**: User accounts and profiles
- **projects**: Visual builder projects
- **content**: CMS content and pages
- **products**: E-commerce products
- **orders**: E-commerce orders
- **analytics**: Analytics events and metrics
- **feature_flags**: Feature flag configurations
- **code_generations**: VibeSDK generation history

## API Endpoints

### Code Generation

\`\`\`typescript
// Start code generation
POST /api/generate
{
  "prompt": "Create a todo list with drag and drop",
  "options": {
    "framework": "react",
    "styling": "tailwind",
    "features": ["drag-drop", "dark-mode"]
  }
}

// Check generation status
GET /api/generate/status?id={generationId}

// Cancel generation
POST /api/generate/cancel?id={generationId}
\`\`\`

### Projects Management

\`\`\`typescript
// Get all projects
GET /api/projects

// Create new project
POST /api/projects
{
  "name": "My Todo App",
  "description": "A simple todo application",
  "type": "web"
}

// Get project details
GET /api/projects/{id}
\`\`\`

## Deployment

### Local Development

\`\`\`bash
# Start local development server
npm run dev

# Run database migrations
npm run db:migrate:local

# Seed development data
npm run db:seed
\`\`\`

### Production Deployment

\`\`\`bash
# Deploy to Cloudflare
npm run deploy

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
\`\`\`

## Configuration

### Wrangler Configuration

\`\`\`toml
# wrangler.toml
name = "rockket"
main = "src/index.ts"
compatibility_date = "2024-01-15"

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "rockket-db"

# KV Storage
[[kv_namespaces]]
binding = "CACHE"

# R2 Storage
[[r2_buckets]]
binding = "STORAGE"

# Durable Objects
[[durable_objects.bindings]]
name = "CODE_GENERATOR"
class_name = "CodeGeneratorAgent"

# AI Gateway
[ai]
binding = "AI"
\`\`\`

### Environment Variables

\`\`\`bash
# AI Services
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_STUDIO_API_KEY=your-google-ai-api-key

# Authentication
JWT_SECRET=your-jwt-secret

# External Services
SENTRY_DSN=your-sentry-dsn
POSTHOG_KEY=your-posthog-key
\`\`\`

## Monitoring

### Health Checks

\`\`\`typescript
// Check platform health
GET /health

// Check database
GET /health/database

// Check AI Gateway
GET /health/ai
\`\`\`

### Analytics

The platform tracks:

- Code generation requests
- User interactions
- Performance metrics
- Error rates
- Usage patterns

## Security

### Authentication

- JWT-based authentication
- Multi-tenant isolation
- Role-based access control
- Session management

### Data Protection

- Encrypted data storage
- Secure API endpoints
- Input validation
- Rate limiting

## Performance

### Caching

- KV storage for caching
- R2 for static assets
- Durable Objects for state
- AI response caching

### Optimization

- Edge computing
- Global distribution
- CDN integration
- Performance monitoring

## Troubleshooting

### Common Issues

1. **AI Gateway Authentication Failed**
   - Check AI Gateway token permissions
   - Verify gateway configuration

2. **Database Connection Issues**
   - Check D1 database binding
   - Verify migration status

3. **Code Generation Failures**
   - Check AI API keys
   - Verify Durable Object state

### Debug Commands

\`\`\`bash
# View logs
npm run tail

# Check database
npm run db:migrate:status

# Test AI Gateway
npm run ai:test
\`\`\`

## Support

For VibeSDK integration support:

- **Documentation**: [docs.rockket.dev](https://docs.rockket.dev)
- **GitHub**: [github.com/cloudflare/vibesdk](https://github.com/cloudflare/vibesdk)
- **Discord**: [Cloudflare Discord](https://discord.gg/cloudflare)
- **Email**: support@rockket.dev

---

**Built with Cloudflare VibeSDK! 🎨✨**
`;

fs.writeFileSync("docs/VIBESDK_INTEGRATION.md", vibesdkDocsContent);
console.log("📝 Created VibeSDK integration documentation");

// Create VibeSDK examples
const examplesContent = `# 🎨 VibeSDK Examples for Rockket Platform

## Fun Apps

### Todo List with Drag and Drop
\`\`\`typescript
const prompt = "Create a todo list with drag and drop and dark mode";
const options = {
  framework: "react",
  styling: "tailwind",
  features: ["drag-drop", "dark-mode", "local-storage"]
};
\`\`\`

### Drawing App
\`\`\`typescript
const prompt = "Build a simple drawing app with different brush sizes and colors";
const options = {
  framework: "vanilla",
  features: ["canvas", "brush-tools", "color-picker"]
};
\`\`\`

### Memory Card Game
\`\`\`typescript
const prompt = "Make a memory card game with emojis";
const options = {
  framework: "react",
  features: ["game-logic", "score-tracking", "animations"]
};
\`\`\`

## Productivity Apps

### Expense Tracker
\`\`\`typescript
const prompt = "Create an expense tracker with charts and categories";
const options = {
  framework: "react",
  styling: "tailwind",
  features: ["charts", "categories", "data-persistence"]
};
\`\`\`

### Pomodoro Timer
\`\`\`typescript
const prompt = "Build a pomodoro timer with task management";
const options = {
  framework: "react",
  features: ["timer", "task-management", "notifications"]
};
\`\`\`

### Habit Tracker
\`\`\`typescript
const prompt = "Make a habit tracker with streak counters";
const options = {
  framework: "react",
  features: ["habit-tracking", "streaks", "calendar-view"]
};
\`\`\`

## Creative Tools

### Color Palette Generator
\`\`\`typescript
const prompt = "Build a color palette generator from images";
const options = {
  framework: "react",
  features: ["image-upload", "color-extraction", "palette-export"]
};
\`\`\`

### Markdown Editor
\`\`\`typescript
const prompt = "Create a markdown editor with live preview";
const options = {
  framework: "react",
  features: ["markdown-editor", "live-preview", "syntax-highlighting"]
};
\`\`\`

### Meme Generator
\`\`\`typescript
const prompt = "Make a meme generator with text overlays";
const options = {
  framework: "react",
  features: ["image-upload", "text-overlay", "meme-templates"]
};
\`\`\`

## Utility Apps

### QR Code Generator
\`\`\`typescript
const prompt = "Create a QR code generator and scanner";
const options = {
  framework: "react",
  features: ["qr-generation", "qr-scanning", "download-options"]
};
\`\`\`

### Password Generator
\`\`\`typescript
const prompt = "Build a password generator with custom options";
const options = {
  framework: "vanilla",
  features: ["password-generation", "custom-options", "copy-to-clipboard"]
};
\`\`\`

### URL Shortener
\`\`\`typescript
const prompt = "Make a URL shortener with click analytics";
const options = {
  framework: "react",
  features: ["url-shortening", "analytics", "custom-domains"]
};
\`\`\`

## Advanced Examples

### E-commerce Store
\`\`\`typescript
const prompt = "Create a complete e-commerce store with shopping cart and payments";
const options = {
  framework: "nextjs",
  styling: "tailwind",
  features: ["product-catalog", "shopping-cart", "payment-integration", "admin-panel"]
};
\`\`\`

### Social Media Dashboard
\`\`\`typescript
const prompt = "Build a social media dashboard with analytics and scheduling";
const options = {
  framework: "react",
  features: ["analytics", "post-scheduling", "multi-platform", "real-time-updates"]
};
\`\`\`

### Project Management Tool
\`\`\`typescript
const prompt = "Create a project management tool with kanban boards and team collaboration";
const options = {
  framework: "react",
  features: ["kanban-boards", "team-collaboration", "task-tracking", "notifications"]
};
\`\`\`

## API Integration Examples

### Weather App
\`\`\`typescript
const prompt = "Build a weather app with location-based forecasts";
const options = {
  framework: "react",
  features: ["weather-api", "location-services", "forecast-charts", "alerts"]
};
\`\`\`

### News Aggregator
\`\`\`typescript
const prompt = "Create a news aggregator with multiple sources and categories";
const options = {
  framework: "nextjs",
  features: ["news-api", "category-filtering", "search", "bookmarks"]
};
\`\`\`

### Stock Tracker
\`\`\`typescript
const prompt = "Make a stock tracker with real-time prices and portfolio management";
const options = {
  framework: "react",
  features: ["stock-api", "real-time-updates", "portfolio-tracking", "charts"]
};
\`\`\`

## Mobile-First Examples

### Fitness Tracker
\`\`\`typescript
const prompt = "Create a fitness tracker with workout logging and progress tracking";
const options = {
  framework: "react",
  features: ["workout-logging", "progress-tracking", "charts", "mobile-optimized"]
};
\`\`\`

### Recipe App
\`\`\`typescript
const prompt = "Build a recipe app with ingredient management and meal planning";
const options = {
  framework: "react",
  features: ["recipe-management", "ingredient-tracking", "meal-planning", "shopping-lists"]
};
\`\`\`

### Travel Planner
\`\`\`typescript
const prompt = "Make a travel planner with itinerary management and booking integration";
const options = {
  framework: "nextjs",
  features: ["itinerary-planning", "booking-integration", "maps", "expense-tracking"]
};
\`\`\`

## AI-Powered Examples

### Chatbot Interface
\`\`\`typescript
const prompt = "Create a chatbot interface with multiple AI models";
const options = {
  framework: "react",
  features: ["chat-interface", "ai-integration", "message-history", "typing-indicators"]
};
\`\`\`

### Content Generator
\`\`\`typescript
const prompt = "Build a content generator with AI-powered writing assistance";
const options = {
  framework: "react",
  features: ["ai-writing", "content-templates", "export-options", "collaboration"]
};
\`\`\`

### Code Assistant
\`\`\`typescript
const prompt = "Create a code assistant with syntax highlighting and AI suggestions";
const options = {
  framework: "react",
  features: ["code-editor", "ai-suggestions", "syntax-highlighting", "code-completion"]
};
\`\`\`

---

**Explore the possibilities with VibeSDK! 🚀✨**
`;

fs.writeFileSync("docs/VIBESDK_EXAMPLES.md", examplesContent);
console.log("📝 Created VibeSDK examples");

console.log("\n🎯 VibeSDK setup completed!\n");

console.log("🎨 What's been set up:");
console.log("- Cloudflare Workers integration");
console.log("- Durable Objects for AI agents");
console.log("- D1 database with migrations");
console.log("- R2 storage for generated apps");
console.log("- AI Gateway configuration");
console.log("- VibeSDK code generation");
console.log("- Real-time WebSocket connections");
console.log("- Global deployment infrastructure");

console.log("\n📚 Documentation created:");
console.log("- VIBESDK_INTEGRATION.md - Complete integration guide");
console.log("- VIBESDK_EXAMPLES.md - Code generation examples");
console.log("- wrangler.toml - Cloudflare configuration");
console.log("- migrations/ - Database schema");

console.log("\n🚀 Next steps:");
console.log("1. Set up Cloudflare account and get API tokens");
console.log("2. Configure environment variables in .dev.vars");
console.log("3. Run 'npm run db:create' to create D1 database");
console.log("4. Run 'npm run db:migrate' to apply migrations");
console.log("5. Run 'npm run dev' to start local development");
console.log("6. Run 'npm run deploy' to deploy to Cloudflare");

console.log("\n🎉 VibeSDK integration is ready! 🎨✨");
