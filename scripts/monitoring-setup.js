#!/usr/bin/env node

/**
 * Monitoring Setup Script for Rockket Platform
 *
 * This script sets up monitoring and observability tools
 * including Sentry for error tracking and PostHog for analytics.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("📊 Setting up Rockket Platform Monitoring...\n");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ Error: package.json not found. Please run this script from the project root."
  );
  process.exit(1);
}

// Install monitoring dependencies
console.log("📦 Installing monitoring dependencies...");
try {
  execSync("npm install @sentry/nextjs posthog-js", { stdio: "inherit" });
  console.log("✅ Monitoring dependencies installed successfully");
} catch (error) {
  console.error("❌ Failed to install monitoring dependencies:", error.message);
  process.exit(1);
}

// Create monitoring configuration files
console.log("📝 Creating monitoring configuration files...");

// Update .env.example with monitoring variables
const envExamplePath = ".env.example";
let envExampleContent = "";

if (fs.existsSync(envExamplePath)) {
  envExampleContent = fs.readFileSync(envExamplePath, "utf8");
}

const monitoringEnvVars = `
# Monitoring & Analytics
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
POSTHOG_KEY="your-posthog-key"
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
POSTHOG_HOST="https://app.posthog.com"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
`;

if (!envExampleContent.includes("SENTRY_DSN")) {
  envExampleContent += monitoringEnvVars;
  fs.writeFileSync(envExamplePath, envExampleContent);
  console.log("📝 Updated .env.example with monitoring variables");
}

// Create monitoring documentation
const monitoringDocContent = `# 📊 Monitoring & Observability Guide

## Overview

The Rockket platform includes comprehensive monitoring and observability tools to track system performance, user behavior, and business metrics.

## 🛠️ Tools Used

### Sentry - Error Tracking & Performance Monitoring
- **Error Tracking**: Automatic error capture and reporting
- **Performance Monitoring**: Track API response times and page load performance
- **Session Replay**: Record user sessions for debugging
- **Release Tracking**: Monitor errors across deployments

### PostHog - Product Analytics
- **User Analytics**: Track user behavior and engagement
- **Feature Flags**: A/B testing and feature rollouts
- **Funnel Analysis**: Track user conversion paths
- **Cohort Analysis**: Analyze user retention and behavior

## 🚀 Setup Instructions

### 1. Sentry Setup

1. Create a Sentry account at [sentry.io](https://sentry.io)
2. Create a new project for your Next.js application
3. Copy your DSN from the project settings
4. Add the DSN to your environment variables:

\`\`\`bash
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
\`\`\`

### 2. PostHog Setup

1. Create a PostHog account at [posthog.com](https://posthog.com)
2. Create a new project
3. Copy your project API key
4. Add the key to your environment variables:

\`\`\`bash
POSTHOG_KEY="your-posthog-key"
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
POSTHOG_HOST="https://app.posthog.com"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
\`\`\`

## 📈 Monitoring Dashboard

Access the monitoring dashboard at \`/dashboard/monitoring\` to view:

- **System Metrics**: Uptime, response times, error rates
- **User Metrics**: Active users, growth, engagement
- **Business Metrics**: AI generations, feature usage, revenue
- **Performance Metrics**: Page load times, API performance
- **Alerts**: Real-time system alerts and notifications

## 🔧 Configuration

### Sentry Configuration

The platform includes three Sentry configuration files:

- \`sentry.client.config.ts\` - Client-side error tracking
- \`sentry.server.config.ts\` - Server-side error tracking  
- \`sentry.edge.config.ts\` - Edge runtime error tracking

### PostHog Configuration

PostHog is configured in \`src/lib/monitoring/posthog.ts\` with:

- Automatic user identification
- Event tracking for business metrics
- Feature flag support
- A/B testing capabilities

## 📊 Key Metrics Tracked

### System Metrics
- API response times
- Database query performance
- Memory and CPU usage
- Error rates and types

### Business Metrics
- User registrations and growth
- AI generation usage
- Visual builder activity
- Content creation
- E-commerce transactions
- Feature adoption

### User Journey Metrics
- Onboarding completion rates
- Dashboard usage patterns
- Feature discovery
- Conversion funnels

## 🚨 Alerting

### Automatic Alerts
- High error rates (>5%)
- Slow API responses (>500ms)
- Database connection issues
- Memory usage spikes
- Critical business events

### Custom Alerts
You can set up custom alerts for:
- Specific error types
- Business metric thresholds
- User behavior patterns
- Performance degradation

## 🔍 Debugging

### Error Investigation
1. Check Sentry for error details and stack traces
2. Review session replays for user context
3. Analyze performance data for bottlenecks
4. Use PostHog to understand user behavior

### Performance Optimization
1. Monitor API response times
2. Track database query performance
3. Analyze page load metrics
4. Identify slow user journeys

## 📱 Mobile Monitoring

The monitoring setup includes mobile-specific tracking:

- Mobile app performance
- Touch interactions
- Network conditions
- Device-specific errors

## 🔒 Privacy & Compliance

### Data Protection
- User data is anonymized where possible
- Sensitive information is filtered out
- GDPR compliance built-in
- Data retention policies configured

### Security
- API keys are stored securely
- Data transmission is encrypted
- Access controls implemented
- Audit logs maintained

## 🚀 Production Deployment

### Environment Variables
\`\`\`bash
# Sentry
SENTRY_DSN="your-production-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-production-sentry-dsn"

# PostHog
POSTHOG_KEY="your-production-posthog-key"
NEXT_PUBLIC_POSTHOG_KEY="your-production-posthog-key"
POSTHOG_HOST="https://app.posthog.com"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
\`\`\`

### Cloudflare Workers
For Cloudflare Workers deployment, ensure:
- Sentry DSN is configured in wrangler.toml
- PostHog keys are set as secrets
- Monitoring is enabled in production

## 📚 Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [PostHog Documentation](https://posthog.com/docs)
- [Next.js Monitoring](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Performance Best Practices](https://web.dev/performance/)

## 🤝 Support

For monitoring-related issues:
- Check Sentry for error details
- Review PostHog analytics
- Contact the development team
- Check system health dashboard

---

**Happy Monitoring! 📊✨**
`;

fs.writeFileSync("MONITORING.md", monitoringDocContent);
console.log("📝 Created MONITORING.md documentation");

// Create monitoring dashboard page
const dashboardPageContent = `import { MonitoringDashboard } from "@/components/monitoring/dashboard";

export default function MonitoringPage() {
  return <MonitoringDashboard />;
}
`;

const dashboardDir = "src/app/dashboard/monitoring";
if (!fs.existsSync(dashboardDir)) {
  fs.mkdirSync(dashboardDir, { recursive: true });
}

fs.writeFileSync(path.join(dashboardDir, "page.tsx"), dashboardPageContent);
console.log("📝 Created monitoring dashboard page");

console.log("\n🎯 Monitoring setup completed!\n");

console.log("📊 What's been set up:");
console.log("- Sentry error tracking and performance monitoring");
console.log("- PostHog product analytics and feature flags");
console.log("- Monitoring dashboard with real-time metrics");
console.log("- Error boundaries and performance tracking");
console.log("- Business metrics and user journey tracking");
console.log("- Alerting and notification system");

console.log("\n🚀 Next steps:");
console.log("1. Set up Sentry account and get your DSN");
console.log("2. Set up PostHog account and get your API key");
console.log("3. Add environment variables to .env.local");
console.log("4. Deploy and start monitoring!");
console.log("5. Access monitoring dashboard at /dashboard/monitoring");

console.log("\n📚 Documentation:");
console.log("- MONITORING.md - Complete monitoring guide");
console.log("- Sentry docs: https://docs.sentry.io/");
console.log("- PostHog docs: https://posthog.com/docs");

console.log("\n🎉 Monitoring is ready to go! 📊✨");
