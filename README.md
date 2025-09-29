# 🚀 Rockket Platform - Multi-Tenant SaaS with Cloudflare VibeSDK

**Launch your vision** — Turn your ideas into production-ready applications without the complexity, coding headaches, or months of development time.

## 🎨 Built with Cloudflare VibeSDK

Rockket is powered by [Cloudflare VibeSDK](https://github.com/cloudflare/vibesdk), leveraging AI-powered code generation with Durable Objects, D1 database, R2 storage, and AI Gateway for a truly serverless, global platform.

## ✨ Features

### 🎯 Core Platform

- **Multi-Tenant Architecture** - Isolated tenant data and configurations
- **Visual Builder** - Drag-and-drop page builder with real-time preview
- **CMS System** - Content management with AI-powered generation
- **E-commerce** - Online store with payment processing
- **Analytics** - Business intelligence with PostHog integration
- **AI Integration** - Multi-provider AI content generation

### 🎨 VibeSDK Integration

- **AI-Powered Code Generation** - Generate complete applications from natural language
- **Real-time Progress Streaming** - WebSocket connections for live generation updates
- **Multi-Phase Generation** - Planning, foundation, core, styling, integration, optimization
- **Stateful AI Agents** - Durable Objects maintain generation state
- **Global Deployment** - Generated apps deployed to Cloudflare Workers

### 🛠️ Technical Infrastructure

- **Cloudflare Workers** - Serverless compute platform
- **Durable Objects** - Stateful AI agents for code generation
- **D1 Database** - SQLite database at the edge
- **R2 Storage** - Object storage for generated apps
- **AI Gateway** - Unified AI API gateway
- **KV Storage** - Caching and session management

## 🚀 Quick Start

### Prerequisites

- Node.js 20.0.0 or higher
- npm 10.0.0 or higher
- Cloudflare account with Workers paid plan

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/rockket.git
cd rockket

# Install dependencies
npm install

# Setup VibeSDK integration
npm run vibesdk:setup

# Configure environment
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your Cloudflare API tokens and AI keys
```

### Local Development

```bash
# Start local development server
npm run cloudflare:dev

# Run database migrations
npm run d1:migrate:local

# Seed development data
npm run d1:seed
```

### Production Deployment

```bash
# Deploy to Cloudflare
npm run cloudflare:deploy

# Deploy to staging
npm run cloudflare:deploy:staging

# Deploy to production
npm run cloudflare:deploy:production
```

## 🎨 VibeSDK Code Generation

### Generate Apps with Natural Language

```typescript
// Example: Generate a todo list app
const prompt = "Create a todo list with drag and drop and dark mode";
const options = {
  framework: "react",
  styling: "tailwind",
  features: ["drag-drop", "dark-mode", "local-storage"],
};

const generationId = await startCodeGeneration(prompt, options);
```

### Real-time Progress Updates

```typescript
// WebSocket connection for live updates
const ws = new WebSocket("wss://rockket.dev/ws");
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log(`Phase: ${update.phase}, Progress: ${update.progress}%`);
};
```

### Generated App Examples

**🎮 Fun Apps**

- Todo list with drag and drop
- Drawing app with brush tools
- Memory card game with emojis

**📊 Productivity Apps**

- Expense tracker with charts
- Pomodoro timer with task management
- Habit tracker with streak counters

**🎨 Creative Tools**

- Color palette generator
- Markdown editor with live preview
- Meme generator with text overlays

**🛠️ Utility Apps**

- QR code generator and scanner
- Password generator with custom options
- URL shortener with click analytics

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Cloudflare    │    │   Durable       │
│   (Next.js)     │◄──►│   Workers       │◄──►│   Objects       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   D1 Database    │    │   AI Gateway    │
│   (CloudFlare)  │    │   (SQLite)       │    │   (Multi-Model) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Durable Objects

#### CodeGeneratorAgent

Handles AI-powered code generation with stateful connections:

```typescript
export class CodeGeneratorAgent extends DurableObject {
  async generateCode(prompt: string, options: any) {
    // Phase-wise generation with error recovery
    // Real-time progress streaming to frontend
    // Persistent state across WebSocket connections
  }
}
```

#### SessionManager

Manages user sessions and authentication:

```typescript
export class SessionManager extends DurableObject {
  async createSession(userId: string) {
    // Create secure session
    // Store session data
    // Handle session validation
  }
}
```

#### AIAgent

Manages AI model interactions and caching:

```typescript
export class AIAgent extends DurableObject {
  async processRequest(prompt: string, model: string) {
    // Route to appropriate AI model
    // Cache responses for efficiency
    // Handle rate limiting
  }
}
```

## 📊 Database Schema

The platform uses D1 (SQLite) for data storage:

- **tenants** - Multi-tenant organizations
- **users** - User accounts and profiles
- **projects** - Visual builder projects
- **content** - CMS content and pages
- **products** - E-commerce products
- **orders** - E-commerce orders
- **analytics** - Analytics events and metrics
- **feature_flags** - Feature flag configurations
- **code_generations** - VibeSDK generation history

## 🔧 Configuration

### Wrangler Configuration

```toml
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
```

### Environment Variables

```bash
# AI Services
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_STUDIO_API_KEY=your-google-ai-api-key

# Authentication
JWT_SECRET=your-jwt-secret

# External Services
SENTRY_DSN=your-sentry-dsn
POSTHOG_KEY=your-posthog-key
```

## 📚 Documentation

- [Setup Guide](./docs/SETUP.md) - Complete setup instructions
- [Development Guide](./docs/DEVELOPMENT.md) - Development best practices
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [VibeSDK Integration](./docs/VIBESDK_INTEGRATION.md) - VibeSDK integration guide
- [VibeSDK Examples](./docs/VIBESDK_EXAMPLES.md) - Code generation examples

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security

- **Authentication** - JWT-based authentication
- **Multi-tenant Isolation** - Secure tenant data separation
- **Input Validation** - Comprehensive input sanitization
- **Rate Limiting** - API rate limiting and abuse prevention
- **Security Headers** - Security headers for all responses

## 📈 Performance

- **Edge Computing** - Global distribution with Cloudflare Workers
- **Caching** - KV storage for caching and session management
- **CDN Integration** - Static asset delivery via Cloudflare CDN
- **Performance Monitoring** - Real-time performance tracking

## 🚀 Deployment

### Cloudflare Workers

```bash
# Deploy to Cloudflare
npm run cloudflare:deploy

# Deploy to staging
npm run cloudflare:deploy:staging

# Deploy to production
npm run cloudflare:deploy:production
```

### Database Management

```bash
# Create D1 database
npm run d1:create

# Run migrations
npm run d1:migrate

# Seed data
npm run d1:seed
```

### Storage Setup

```bash
# Create KV namespace
npm run kv:create

# Create R2 bucket
npm run r2:create

# Setup AI Gateway
npm run ai:setup
```

## 🔍 Monitoring

### Health Checks

```bash
# Check platform health
curl https://rockket.dev/health

# Check database
curl https://rockket.dev/health/database

# Check AI Gateway
curl https://rockket.dev/health/ai
```

### Logs

```bash
# View real-time logs
npm run tail

# View specific logs
wrangler tail --format=pretty
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cloudflare VibeSDK](https://github.com/cloudflare/vibesdk) for AI-powered code generation
- [Cloudflare Workers](https://workers.cloudflare.com/) for serverless compute
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

- **Documentation**: [docs.rockket.dev](https://docs.rockket.dev)
- **GitHub Issues**: [github.com/your-org/rockket/issues](https://github.com/your-org/rockket/issues)
- **Discord**: [discord.gg/rockket](https://discord.gg/rockket)
- **Email**: support@rockket.dev

---

**Built with Cloudflare VibeSDK! 🎨✨**

**Launch your vision today! 🚀**
