import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { FeatureFlagProvider } from "@/components/providers/feature-flag-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";

// Mock providers for testing
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock the fetch function for auth endpoints
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockImplementation((url: string) => {
    if (url.includes("/api/auth/me")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: "test-user-id",
              email: "test@example.com",
              name: "Test User",
              role: "admin",
              tenantId: "test-tenant-id",
            },
          }),
      });
    }
    return originalFetch(url);
  });

  return <AuthProvider>{children}</AuthProvider>;
};

const MockFeatureFlagProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Mock the fetch function for feature flags
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockImplementation((url: string) => {
    if (url.includes("/api/features/evaluate")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: {
              "ai-generator": { enabled: true },
              "visual-builder": { enabled: true },
              cms: { enabled: true },
              ecommerce: { enabled: true },
              analytics: { enabled: true },
              billing: { enabled: false },
              "multi-tenant": { enabled: true },
              "progressive-onboarding": { enabled: true },
            },
          }),
      });
    }
    return originalFetch(url);
  });

  return <FeatureFlagProvider>{children}</FeatureFlagProvider>;
};

const MockAnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock the fetch function for analytics
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockImplementation((url: string) => {
    if (url.includes("/api/analytics/track")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }
    return originalFetch(url);
  });

  return <AnalyticsProvider>{children}</AnalyticsProvider>;
};

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <MockAuthProvider>
        <MockFeatureFlagProvider>
          <MockAnalyticsProvider>{children}</MockAnalyticsProvider>
        </MockFeatureFlagProvider>
      </MockAuthProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock API responses
export const mockApiResponse = <T,>(data: T, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: jest.fn().mockResolvedValue(data),
  text: jest.fn().mockResolvedValue(JSON.stringify(data)),
});

// Mock fetch with default responses
export const mockFetch = (responses: Record<string, any> = {}) => {
  const defaultResponses = {
    "/api/auth/me": mockApiResponse({
      user: {
        id: "test-user-id",
        email: "test@example.com",
        name: "Test User",
        role: "admin",
        tenantId: "test-tenant-id",
      },
    }),
    "/api/features": mockApiResponse({
      flags: {
        "ai-generator": true,
        "visual-builder": true,
        cms: true,
        ecommerce: true,
      },
    }),
    "/api/ai/generate": mockApiResponse({
      success: true,
      result: {
        name: "Generated App",
        description: "AI-generated application",
        code: "console.log('Hello World');",
      },
    }),
  };

  const allResponses = { ...defaultResponses, ...responses };

  (global.fetch as jest.Mock).mockImplementation((url: string) => {
    const response =
      (allResponses as any)[url] ||
      mockApiResponse({ error: "Not found" }, 404);
    return Promise.resolve(response);
  });
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
  avatar: null,
  role: "admin",
  tenantId: "test-tenant-id",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
});

export const createMockTenant = (overrides = {}) => ({
  id: "test-tenant-id",
  name: "Test Tenant",
  slug: "test-tenant",
  domain: null,
  settings: {
    branding: {
      primaryColor: "#FF6B35",
      secondaryColor: "#1E3A8A",
    },
    features: {
      aiGenerator: true,
      visualBuilder: true,
      cms: true,
      ecommerce: true,
    },
  },
  plan: "professional",
  status: "active",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
});

export const createMockContent = (overrides = {}) => ({
  id: "test-content-id",
  title: "Test Content",
  slug: "test-content",
  type: "page",
  status: "published",
  content: "Test content body",
  metadata: {
    seo: {
      title: "Test Content",
      description: "Test content description",
    },
  },
  tenantId: "test-tenant-id",
  authorId: "test-user-id",
  publishedAt: new Date("2024-01-01"),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
});

export const createMockProduct = (overrides = {}) => ({
  id: "test-product-id",
  name: "Test Product",
  description: "Test product description",
  price: 99.99,
  currency: "USD",
  sku: "TEST-001",
  inventory: 100,
  images: ["https://example.com/image.jpg"],
  variants: [],
  tenantId: "test-tenant-id",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
});

// Utility functions for testing
export const waitForApiCall = (mockFn: jest.Mock, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (mockFn.mock.calls.length > 0) {
        clearInterval(checkInterval);
        resolve(mockFn.mock.calls);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error("API call timeout"));
      }
    }, 10);
  });
};

export const expectApiCall = (
  mockFn: jest.Mock,
  expectedUrl: string,
  expectedOptions?: any
) => {
  expect(mockFn).toHaveBeenCalledWith(
    expectedUrl,
    expect.objectContaining(expectedOptions || {})
  );
};

// Re-export everything from testing-library
export * from "@testing-library/react";
export { customRender as render };
