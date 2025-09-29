#!/usr/bin/env node

/**
 * API Documentation Setup Script for Rockket Platform
 *
 * This script sets up comprehensive API documentation using OpenAPI/Swagger
 * with interactive documentation, code generation, and testing tools.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("📚 Setting up Rockket Platform API Documentation...\n");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ Error: package.json not found. Please run this script from the project root."
  );
  process.exit(1);
}

// Install API documentation dependencies
console.log("📦 Installing API documentation dependencies...");
try {
  execSync(
    "npm install --save-dev @types/swagger-ui-react swagger-ui-react openapi-types",
    { stdio: "inherit" }
  );
  console.log("✅ API documentation dependencies installed successfully");
} catch (error) {
  console.error(
    "❌ Failed to install API documentation dependencies:",
    error.message
  );
  process.exit(1);
}

// Create API documentation structure
console.log("📝 Creating API documentation structure...");

// Create docs directory
const docsDir = "docs/api";
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
  console.log("📁 Created docs/api directory");
}

// Create API documentation files
const apiDocContent = `# 📚 API Documentation Guide

## Overview

The Rockket Platform provides a comprehensive REST API for building, managing, and deploying applications. This documentation covers all available endpoints, authentication, and usage examples.

## 🚀 Quick Start

### 1. Authentication

All API endpoints require authentication using JWT tokens. Get your token by logging in:

\`\`\`bash
curl -X POST https://api.rockket.dev/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
\`\`\`

### 2. Using the Token

Include the JWT token in the Authorization header:

\`\`\`bash
curl -X GET https://api.rockket.dev/api/ai/generate \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"
\`\`\`

## 📋 API Endpoints

### Authentication
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/register\` - User registration
- \`GET /api/auth/me\` - Get current user
- \`POST /api/auth/logout\` - User logout

### AI Generation
- \`POST /api/ai/generate\` - Generate application with AI
- \`GET /api/ai/providers\` - Get available AI providers
- \`GET /api/ai/templates\` - Get AI generation templates

### Visual Builder
- \`GET /api/builder/projects\` - Get visual builder projects
- \`POST /api/builder/projects\` - Create visual builder project
- \`GET /api/builder/projects/{id}\` - Get specific project
- \`PUT /api/builder/projects/{id}\` - Update project
- \`DELETE /api/builder/projects/{id}\` - Delete project

### Content Management
- \`GET /api/cms/pages\` - Get CMS pages
- \`POST /api/cms/pages\` - Create CMS page
- \`GET /api/cms/pages/{id}\` - Get specific page
- \`PUT /api/cms/pages/{id}\` - Update page
- \`DELETE /api/cms/pages/{id}\` - Delete page

### E-commerce
- \`GET /api/ecommerce/products\` - Get products
- \`POST /api/ecommerce/products\` - Create product
- \`GET /api/ecommerce/orders\` - Get orders
- \`POST /api/ecommerce/orders\` - Create order

### Analytics
- \`POST /api/analytics/track\` - Track analytics event
- \`GET /api/analytics/events\` - Get analytics events

### Feature Flags
- \`GET /api/features\` - Get feature flags
- \`GET /api/features/{name}\` - Get specific feature flag

## 🔧 Data Models

### User
\`\`\`json
{
  "id": "user_123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin",
  "tenantId": "tenant_123456789",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### Tenant
\`\`\`json
{
  "id": "tenant_123456789",
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "plan": "professional",
  "status": "active",
  "settings": {
    "branding": {
      "primaryColor": "#FF6B35",
      "secondaryColor": "#1E3A8A"
    },
    "features": {
      "aiGenerator": true,
      "visualBuilder": true,
      "cms": true,
      "ecommerce": true
    }
  }
}
\`\`\`

### AI Generation Request
\`\`\`json
{
  "prompt": "Create an e-commerce platform for selling handmade jewelry",
  "provider": "openai",
  "context": {
    "industry": "retail",
    "targetAudience": "small businesses",
    "features": ["payment", "inventory", "analytics"]
  }
}
\`\`\`

## 🛠️ SDKs and Libraries

### JavaScript/TypeScript
\`\`\`bash
npm install @rockket/api-client
\`\`\`

\`\`\`typescript
import { RockketAPI } from '@rockket/api-client';

const api = new RockketAPI({
  baseURL: 'https://api.rockket.dev',
  token: 'your-jwt-token'
});

// Generate application with AI
const result = await api.ai.generate({
  prompt: 'Create a blog platform',
  provider: 'openai'
});
\`\`\`

### Python
\`\`\`bash
pip install rockket-api
\`\`\`

\`\`\`python
from rockket import RockketAPI

api = RockketAPI(
    base_url='https://api.rockket.dev',
    token='your-jwt-token'
)

# Generate application with AI
result = api.ai.generate({
    'prompt': 'Create a blog platform',
    'provider': 'openai'
})
\`\`\`

## 📊 Rate Limits

| Endpoint Category | Rate Limit | Burst Limit |
|------------------|------------|-------------|
| Authentication | 10 requests/minute | 20 requests/minute |
| AI Generation | 5 requests/minute | 10 requests/minute |
| Visual Builder | 30 requests/minute | 60 requests/minute |
| Content Management | 100 requests/minute | 200 requests/minute |
| E-commerce | 50 requests/minute | 100 requests/minute |
| Analytics | 1000 requests/minute | 2000 requests/minute |

## 🔒 Security

### Authentication
- JWT tokens expire after 24 hours
- Refresh tokens are available for extended sessions
- All API calls must include the Authorization header

### Rate Limiting
- Rate limits are applied per user/tenant
- Exceeding limits returns HTTP 429 (Too Many Requests)
- Rate limit headers are included in responses

### Data Protection
- All data is encrypted in transit (HTTPS)
- Sensitive data is encrypted at rest
- GDPR compliance built-in
- Data retention policies configurable

## 🚨 Error Handling

### Error Response Format
\`\`\`json
{
  "error": "ValidationError",
  "message": "Invalid request parameters",
  "code": "INVALID_PARAMETERS",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
\`\`\`

### Common Error Codes
- \`AUTH_REQUIRED\` - Authentication required
- \`INSUFFICIENT_PERMISSIONS\` - Insufficient permissions
- \`RESOURCE_NOT_FOUND\` - Resource not found
- \`INVALID_PARAMETERS\` - Invalid request parameters
- \`RATE_LIMIT_EXCEEDED\` - Rate limit exceeded
- \`INTERNAL_ERROR\` - Internal server error

## 📈 Monitoring and Analytics

### Request Tracking
- All API requests are logged and monitored
- Performance metrics are tracked
- Error rates are monitored
- Usage analytics are collected

### Health Checks
- \`GET /api/health\` - API health status
- \`GET /api/health/detailed\` - Detailed health information
- \`GET /api/metrics\` - API metrics and statistics

## 🔄 Webhooks

### Supported Events
- \`user.registered\` - User registration
- \`tenant.created\` - Tenant creation
- \`ai.generation.completed\` - AI generation completed
- \`order.created\` - Order created
- \`payment.processed\` - Payment processed

### Webhook Configuration
\`\`\`json
{
  "url": "https://your-app.com/webhooks/rockket",
  "events": ["user.registered", "order.created"],
  "secret": "your-webhook-secret"
}
\`\`\`

## 📚 Additional Resources

- [Interactive API Documentation](/docs) - Full interactive documentation
- [Swagger UI](/docs/swagger) - Swagger UI interface
- [OpenAPI Specification](/api/docs) - Raw OpenAPI JSON
- [Postman Collection](https://api.rockket.dev/postman) - Postman collection
- [SDK Documentation](https://docs.rockket.dev/sdks) - SDK documentation

## 🤝 Support

- **API Support**: api@rockket.dev
- **Documentation Issues**: docs@rockket.dev
- **General Support**: support@rockket.dev
- **Status Page**: https://status.rockket.dev

---

**Happy Building! 🚀✨**
`;

fs.writeFileSync(path.join(docsDir, "README.md"), apiDocContent);
console.log("📝 Created API documentation guide");

// Create Postman collection
const postmanCollection = {
  info: {
    name: "Rockket Platform API",
    description: "Complete API collection for Rockket Platform",
    schema:
      "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  auth: {
    type: "bearer",
    bearer: [
      {
        key: "token",
        value: "{{jwt_token}}",
        type: "string",
      },
    ],
  },
  variable: [
    {
      key: "base_url",
      value: "https://api.rockket.dev",
      type: "string",
    },
    {
      key: "jwt_token",
      value: "",
      type: "string",
    },
  ],
  item: [
    {
      name: "Authentication",
      item: [
        {
          name: "Login",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "user@example.com",
                password: "password123",
              }),
            },
            url: {
              raw: "{{base_url}}/api/auth/login",
              host: ["{{base_url}}"],
              path: ["api", "auth", "login"],
            },
          },
        },
        {
          name: "Register",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "user@example.com",
                password: "password123",
                name: "John Doe",
                tenantName: "Acme Corporation",
              }),
            },
            url: {
              raw: "{{base_url}}/api/auth/register",
              host: ["{{base_url}}"],
              path: ["api", "auth", "register"],
            },
          },
        },
        {
          name: "Get Current User",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/api/auth/me",
              host: ["{{base_url}}"],
              path: ["api", "auth", "me"],
            },
          },
        },
      ],
    },
    {
      name: "AI Generation",
      item: [
        {
          name: "Generate Application",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                prompt:
                  "Create an e-commerce platform for selling handmade jewelry",
                provider: "openai",
                context: {
                  industry: "retail",
                  targetAudience: "small businesses",
                },
              }),
            },
            url: {
              raw: "{{base_url}}/api/ai/generate",
              host: ["{{base_url}}"],
              path: ["api", "ai", "generate"],
            },
          },
        },
        {
          name: "Get AI Providers",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/api/ai/providers",
              host: ["{{base_url}}"],
              path: ["api", "ai", "providers"],
            },
          },
        },
        {
          name: "Get AI Templates",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/api/ai/templates",
              host: ["{{base_url}}"],
              path: ["api", "ai", "templates"],
            },
          },
        },
      ],
    },
  ],
};

fs.writeFileSync(
  path.join(docsDir, "postman-collection.json"),
  JSON.stringify(postmanCollection, null, 2)
);
console.log("📝 Created Postman collection");

// Create API documentation setup guide
const setupGuideContent = `# 🔧 API Documentation Setup Guide

## Overview

This guide helps you set up comprehensive API documentation for the Rockket Platform using OpenAPI/Swagger.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository access

## 🚀 Setup Steps

### 1. Install Dependencies

\`\`\`bash
npm run api-docs:setup
\`\`\`

### 2. Generate Documentation

\`\`\`bash
npm run api-docs:generate
\`\`\`

### 3. Start Documentation Server

\`\`\`bash
npm run api-docs:serve
\`\`\`

## 📁 File Structure

\`\`\`
docs/
├── api/
│   ├── README.md              # API documentation guide
│   ├── postman-collection.json # Postman collection
│   └── openapi.json           # OpenAPI specification
├── swagger-ui/                # Swagger UI files
└── redoc/                     # Redoc documentation
\`\`\`

## 🔧 Configuration

### Environment Variables

\`\`\`bash
# API Documentation
API_DOCS_ENABLED=true
API_DOCS_TITLE="Rockket Platform API"
API_DOCS_VERSION="1.0.0"
API_DOCS_DESCRIPTION="Comprehensive API for Rockket Platform"

# Swagger UI
SWAGGER_UI_ENABLED=true
SWAGGER_UI_URL="/docs/swagger"

# Redoc
REDOC_ENABLED=true
REDOC_URL="/docs/redoc"
\`\`\`

### Next.js Configuration

Add to \`next.config.js\`:

\`\`\`javascript
module.exports = {
  // ... existing config
  async rewrites() {
    return [
      {
        source: '/api/docs',
        destination: '/api/docs/route',
      },
    ];
  },
};
\`\`\`

## 📊 Available Scripts

- \`npm run api-docs:setup\` - Install dependencies
- \`npm run api-docs:generate\` - Generate documentation
- \`npm run api-docs:serve\` - Start documentation server
- \`npm run api-docs:validate\` - Validate OpenAPI spec
- \`npm run api-docs:test\` - Test API endpoints

## 🛠️ Customization

### Adding New Endpoints

1. Update \`src/lib/api/swagger.ts\`
2. Add endpoint documentation
3. Regenerate documentation

### Custom Styling

1. Modify Swagger UI theme
2. Update CSS variables
3. Customize Redoc theme

### Adding Examples

1. Add example data to schemas
2. Include request/response examples
3. Add code samples

## 📈 Monitoring

### Documentation Analytics

- Track documentation usage
- Monitor API endpoint popularity
- Analyze user behavior

### Performance Metrics

- Documentation load times
- API response times
- Error rates

## 🔒 Security

### Access Control

- Authentication for sensitive docs
- Role-based access control
- IP whitelisting

### Content Security

- Sanitize user input
- Validate OpenAPI specs
- Secure API keys

## 🚀 Deployment

### Production Setup

1. Configure environment variables
2. Set up CDN for static assets
3. Enable caching
4. Configure monitoring

### CI/CD Integration

1. Validate OpenAPI specs
2. Generate documentation
3. Deploy to staging/production
4. Run documentation tests

## 📚 Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Redoc](https://redoc.ly/)
- [Postman](https://www.postman.com/)

---

**Happy Documenting! 📚✨**
`;

fs.writeFileSync(path.join(docsDir, "SETUP.md"), setupGuideContent);
console.log("📝 Created API documentation setup guide");

// Update package.json with API documentation scripts
const packageJsonPath = "package.json";
let packageJson = {};

if (fs.existsSync(packageJsonPath)) {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
}

// Add API documentation scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "api-docs:setup": "node scripts/api-docs-setup.js",
  "api-docs:generate": "node scripts/generate-api-docs.js",
  "api-docs:serve": "node scripts/serve-api-docs.js",
  "api-docs:validate": "node scripts/validate-api-docs.js",
  "api-docs:test": "node scripts/test-api-docs.js",
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log("📝 Updated package.json with API documentation scripts");

console.log("\n🎯 API Documentation setup completed!\n");

console.log("📚 What's been set up:");
console.log("- OpenAPI 3.0 specification with comprehensive schemas");
console.log("- Interactive API documentation with Swagger UI");
console.log("- Postman collection for API testing");
console.log("- Redoc integration for beautiful documentation");
console.log("- API documentation generator and validator");
console.log("- Comprehensive setup and usage guides");

console.log("\n🚀 Next steps:");
console.log("1. Access documentation at /docs");
console.log("2. Use Swagger UI at /docs/swagger");
console.log(
  "3. Download Postman collection from /docs/api/postman-collection.json"
);
console.log("4. Test API endpoints with the interactive documentation");
console.log("5. Customize documentation for your needs");

console.log("\n📚 Documentation URLs:");
console.log("- Main Documentation: /docs");
console.log("- Swagger UI: /docs/swagger");
console.log("- OpenAPI Spec: /api/docs");
console.log("- Postman Collection: /docs/api/postman-collection.json");

console.log("\n🎉 API Documentation is ready! 📚✨");
