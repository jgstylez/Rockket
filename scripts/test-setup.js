#!/usr/bin/env node

/**
 * Test Setup Script for Rockket Platform
 *
 * This script sets up the testing environment and runs all tests
 * with proper configuration and coverage reporting.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🧪 Setting up Rockket Platform Testing Environment...\n");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ Error: package.json not found. Please run this script from the project root."
  );
  process.exit(1);
}

// Check if Jest is installed
try {
  require("jest");
  console.log("✅ Jest is already installed");
} catch (error) {
  console.log("📦 Installing Jest and testing dependencies...");
  try {
    execSync(
      "npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom",
      { stdio: "inherit" }
    );
    console.log("✅ Testing dependencies installed successfully");
  } catch (error) {
    console.error("❌ Failed to install testing dependencies:", error.message);
    process.exit(1);
  }
}

// Create test directories if they don't exist
const testDirs = [
  "src/__tests__",
  "src/lib/__tests__",
  "src/components/__tests__",
  "src/app/api/__tests__",
  "coverage",
];

testDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Create .gitignore entry for coverage if it doesn't exist
const gitignorePath = ".gitignore";
let gitignoreContent = "";

if (fs.existsSync(gitignorePath)) {
  gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
}

if (!gitignoreContent.includes("coverage/")) {
  gitignoreContent += "\n# Test coverage\ncoverage/\n";
  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log("📝 Updated .gitignore for coverage directory");
}

// Create test environment file
const testEnvContent = `# Test Environment Variables
NODE_ENV=test
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Rockket Test
JWT_SECRET=test-jwt-secret-key-for-testing-only
DATABASE_URL="file:./test.db"
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=test-token
MEDUSA_URL=http://localhost:9000
MEDUSA_TOKEN=test-token
OPENAI_API_KEY=test-openai-key
ANTHROPIC_API_KEY=test-anthropic-key
GOOGLE_AI_API_KEY=test-google-key
STRIPE_SECRET_KEY=test-stripe-key
STRIPE_PUBLISHABLE_KEY=test-stripe-publishable-key
RESEND_API_KEY=test-resend-key
SENTRY_DSN=test-sentry-dsn
POSTHOG_KEY=test-posthog-key
FEATURE_FLAGS_ENABLED=true
CACHE_ENABLED=false
RATE_LIMIT_ENABLED=false
`;

if (!fs.existsSync(".env.test")) {
  fs.writeFileSync(".env.test", testEnvContent);
  console.log("📝 Created .env.test file");
}

console.log("\n🎯 Running tests...\n");

try {
  // Run tests with coverage
  execSync("npm test -- --coverage --watchAll=false", { stdio: "inherit" });
  console.log("\n✅ All tests completed successfully!");
} catch (error) {
  console.error(
    "\n❌ Some tests failed. Please check the output above for details."
  );
  process.exit(1);
}

console.log("\n📊 Test Summary:");
console.log("- Unit tests for authentication utilities");
console.log("- Unit tests for AI generation services");
console.log("- Component tests for Visual Builder");
console.log("- API route tests for AI generation");
console.log("- Database operation tests");
console.log("- Integration tests for core functionality");

console.log("\n🚀 Testing environment is ready!");
console.log("\nTo run tests:");
console.log("  npm test                 # Run all tests");
console.log("  npm test -- --watch      # Run tests in watch mode");
console.log("  npm test -- --coverage   # Run tests with coverage");
console.log("  npm run test:ci          # Run tests for CI/CD");
