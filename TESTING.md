# 🧪 Rockket Platform Testing Guide

## Overview

This document provides comprehensive testing guidelines for the Rockket platform, including unit tests, integration tests, and end-to-end tests.

## 🎯 Testing Strategy

### Testing Pyramid

```
    E2E Tests (10%)
   ┌─────────────────┐
  │  Integration     │
  │  Tests (20%)     │
 ┌─────────────────────┐
│   Unit Tests (70%)   │
└─────────────────────┘
```

### Test Categories

1. **Unit Tests (70%)** - Individual functions, components, utilities
2. **Integration Tests (20%)** - API endpoints, database interactions, service integrations
3. **End-to-End Tests (10%)** - Complete user journeys across multiple pages

## 🚀 Quick Start

### Setup Testing Environment

```bash
# Install testing dependencies
npm install

# Run test setup script
npm run test:setup

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Available Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only E2E tests
npm run test:e2e
```

## 📁 Test Structure

```
src/
├── __tests__/                    # Global test utilities
├── lib/
│   ├── __tests__/               # Unit tests for utilities
│   │   ├── auth/
│   │   │   ├── password.test.ts
│   │   │   └── jwt.test.ts
│   │   ├── ai/
│   │   │   └── business-generator.test.ts
│   │   └── db/
│   │       └── client.test.ts
├── components/
│   ├── __tests__/               # Component tests
│   │   └── builder/
│   │       └── visual-builder.test.tsx
└── app/
    └── api/
        └── __tests__/           # API route tests
            └── ai-generate.test.ts
```

## 🧪 Unit Testing

### Authentication Tests

**File**: `src/lib/auth/__tests__/password.test.ts`

Tests password hashing and verification utilities:

```typescript
describe("Password Utilities", () => {
  it("should hash a password successfully", async () => {
    const hash = await hashPassword("testPassword123");
    expect(hash).toBeDefined();
    expect(typeof hash).toBe("string");
  });

  it("should verify correct password", async () => {
    const hash = await hashPassword("testPassword123");
    const isValid = await verifyPassword("testPassword123", hash);
    expect(isValid).toBe(true);
  });
});
```

**File**: `src/lib/auth/__tests__/jwt.test.ts`

Tests JWT token creation and verification:

```typescript
describe("JWT Utilities", () => {
  it("should create a valid JWT token", async () => {
    const token = await signToken(mockPayload);
    expect(token).toBeDefined();
    expect(token.split(".")).toHaveLength(3);
  });

  it("should verify a valid token", async () => {
    const token = await signToken(mockPayload);
    const decoded = await verifyToken(token);
    expect(decoded?.userId).toBe(mockPayload.userId);
  });
});
```

### AI Generation Tests

**File**: `src/lib/ai/__tests__/business-generator.test.ts`

Tests AI-powered business application generation:

```typescript
describe("BusinessApplicationGenerator", () => {
  it("should generate a business application successfully", async () => {
    const result = await generator.generateBusinessApp(mockRequirements);
    expect(result).toBeDefined();
    expect(result.name).toBe("Test E-commerce Store");
    expect(result.features).toContain("Product catalog");
  });
});
```

### Database Tests

**File**: `src/lib/db/__tests__/client.test.ts`

Tests database operations with mocked Prisma client:

```typescript
describe("Database Client", () => {
  it("should create a tenant successfully", async () => {
    const result = await mockPrisma.tenant.create({
      data: tenantData,
    });
    expect(result).toEqual(mockTenant);
  });
});
```

## 🎨 Component Testing

### Visual Builder Tests

**File**: `src/components/builder/__tests__/visual-builder.test.tsx`

Tests the drag-and-drop visual builder component:

```typescript
describe("VisualBuilder", () => {
  it("should render the visual builder interface", () => {
    render(<VisualBuilder />);
    expect(screen.getByText("Component Library")).toBeInTheDocument();
  });

  it("should handle component selection", async () => {
    const user = userEvent.setup();
    render(<VisualBuilder />);
    // Test drag and drop functionality
  });
});
```

## 🔌 API Testing

### AI Generation API Tests

**File**: `src/app/api/__tests__/ai-generate.test.ts`

Tests the AI generation API endpoint:

```typescript
describe("/api/ai/generate", () => {
  it("should generate app with prompt successfully", async () => {
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result).toBeDefined();
  });
});
```

## 🛠️ Test Utilities

### Custom Render Function

**File**: `src/lib/test-utils.tsx`

Provides custom render function with all necessary providers:

```typescript
import { render } from "@testing-library/react";
import { AllTheProviders } from "./test-utils";

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
```

### Mock Data Factories

```typescript
export const createMockUser = (overrides = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
  role: "admin",
  tenantId: "test-tenant-id",
  ...overrides,
});

export const createMockTenant = (overrides = {}) => ({
  id: "test-tenant-id",
  name: "Test Tenant",
  slug: "test-tenant",
  plan: "professional",
  status: "active",
  ...overrides,
});
```

## 📊 Coverage Requirements

### Coverage Thresholds

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

### Coverage Reports

- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Report**: `coverage/lcov.info`
- **JSON Report**: `coverage/coverage-final.json`

## 🔧 Configuration

### Jest Configuration

**File**: `jest.config.js`

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Test Setup

**File**: `jest.setup.js`

```javascript
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      push: jest.fn(),
    };
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.JWT_SECRET = "test-jwt-secret";
```

## 🚀 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run test:ci
      - run: npm run build
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --bail --findRelatedTests"
    ]
  }
}
```

## 📝 Writing Tests

### Best Practices

1. **Arrange-Act-Assert Pattern**

   ```typescript
   it("should do something", () => {
     // Arrange
     const input = "test input";
     const expected = "expected output";

     // Act
     const result = functionUnderTest(input);

     // Assert
     expect(result).toBe(expected);
   });
   ```

2. **Descriptive Test Names**

   ```typescript
   // Good
   it("should return user data when valid email is provided");

   // Bad
   it("should work");
   ```

3. **Test One Thing at a Time**

   ```typescript
   // Good - focused test
   it("should hash password with bcrypt", async () => {
     const hash = await hashPassword("password");
     expect(hash).toMatch(/^\$2[aby]\$\d+\$/);
   });
   ```

4. **Use Mocks Appropriately**
   ```typescript
   // Mock external dependencies
   jest.mock("@/lib/ai/providers", () => ({
     AIGenerationService: jest.fn().mockImplementation(() => ({
       generateApp: jest.fn(),
     })),
   }));
   ```

### Test Data Management

```typescript
// Use factories for consistent test data
const createUser = (overrides = {}) => ({
  id: "user-id",
  email: "user@example.com",
  name: "User Name",
  ...overrides,
});

// Use builders for complex objects
const userBuilder = () => ({
  withEmail: (email) => ({ ...userBuilder(), email }),
  withRole: (role) => ({ ...userBuilder(), role }),
  build: () => createUser(),
});
```

## 🐛 Debugging Tests

### Debug Mode

```bash
# Run tests in debug mode
npm test -- --verbose

# Run specific test file
npm test -- src/lib/auth/__tests__/password.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should hash password"
```

### Common Issues

1. **Async/Await Issues**

   ```typescript
   // Always await async operations
   it("should handle async operation", async () => {
     const result = await asyncFunction();
     expect(result).toBeDefined();
   });
   ```

2. **Mock Cleanup**

   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

3. **Environment Variables**
   ```typescript
   // Set test environment variables
   process.env.JWT_SECRET = "test-secret";
   ```

## 📈 Performance Testing

### Load Testing

```typescript
describe("Performance Tests", () => {
  it("should handle multiple concurrent requests", async () => {
    const promises = Array(100)
      .fill(null)
      .map(() =>
        fetch("/api/ai/generate", {
          method: "POST",
          body: JSON.stringify({ prompt: "test" }),
        })
      );

    const results = await Promise.all(promises);
    expect(results.every((r) => r.ok)).toBe(true);
  });
});
```

## 🔒 Security Testing

### Authentication Tests

```typescript
describe("Security Tests", () => {
  it("should reject requests without authentication", async () => {
    const response = await fetch("/api/protected", {
      method: "GET",
    });

    expect(response.status).toBe(401);
  });

  it("should validate JWT tokens", async () => {
    const invalidToken = "invalid.jwt.token";
    const response = await fetch("/api/protected", {
      headers: { Authorization: `Bearer ${invalidToken}` },
    });

    expect(response.status).toBe(401);
  });
});
```

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing](https://nextjs.org/docs/testing)

## 🤝 Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain coverage thresholds
4. Update this documentation

---

**Happy Testing! 🧪✨**
