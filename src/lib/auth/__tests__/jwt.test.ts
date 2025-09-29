import { signToken, verifyToken, type JWTPayload } from "../jwt";

describe("JWT Utilities", () => {
  const mockPayload: JWTPayload = {
    userId: "test-user-id",
    email: "test@example.com",
    role: "admin",
    tenantId: "test-tenant-id",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  };

  // Mock environment variable
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-only";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  describe("signToken", () => {
    it("should create a valid JWT token", async () => {
      const token = await signToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    it("should create different tokens for different payloads", async () => {
      const token1 = await signToken(mockPayload);
      const token2 = await signToken({
        ...mockPayload,
        userId: "different-user",
      });

      expect(token1).not.toBe(token2);
    });

    it("should include all payload fields in token", async () => {
      const token = await signToken(mockPayload);
      const decoded = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
      expect(decoded.tenantId).toBe(mockPayload.tenantId);
    });

    it("should handle missing JWT_SECRET", async () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      await expect(signToken(mockPayload)).rejects.toThrow();

      process.env.JWT_SECRET = originalSecret;
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid token", async () => {
      const token = await signToken(mockPayload);
      const decoded = await verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(mockPayload.userId);
      expect(decoded?.email).toBe(mockPayload.email);
      expect(decoded?.role).toBe(mockPayload.role);
      expect(decoded?.tenantId).toBe(mockPayload.tenantId);
    });

    it("should return null for invalid token", async () => {
      const invalidToken = "invalid.token.here";
      const decoded = await verifyToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it("should return null for malformed token", async () => {
      const malformedToken = "not-a-jwt-token";
      const decoded = await verifyToken(malformedToken);

      expect(decoded).toBeNull();
    });

    it("should return null for expired token", async () => {
      const expiredPayload = {
        ...mockPayload,
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      };
      const token = await signToken(expiredPayload);
      const decoded = await verifyToken(token);

      expect(decoded).toBeNull();
    });

    it("should return null for token with wrong secret", async () => {
      const token = await signToken(mockPayload);

      // Change secret
      process.env.JWT_SECRET = "different-secret";
      const decoded = await verifyToken(token);

      expect(decoded).toBeNull();

      // Restore original secret
      process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-only";
    });

    it("should handle empty token", async () => {
      const decoded = await verifyToken("");

      expect(decoded).toBeNull();
    });

    it("should handle null/undefined token", async () => {
      const decoded1 = await verifyToken(null as any);
      const decoded2 = await verifyToken(undefined as any);

      expect(decoded1).toBeNull();
      expect(decoded2).toBeNull();
    });
  });

  describe("Token Security", () => {
    it("should use secure algorithm", async () => {
      const token = await signToken(mockPayload);
      const header = JSON.parse(
        Buffer.from(token.split(".")[0], "base64").toString()
      );

      expect(header.alg).toBe("HS256");
    });

    it("should include expiration time", async () => {
      const token = await signToken(mockPayload);
      const decoded = await verifyToken(token);

      expect(decoded?.exp).toBeDefined();
      expect(decoded?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it("should include issued at time", async () => {
      const token = await signToken(mockPayload);
      const decoded = await verifyToken(token);

      expect(decoded?.iat).toBeDefined();
      expect(decoded?.iat).toBeLessThanOrEqual(Math.floor(Date.now() / 1000));
    });
  });

  describe("Error Handling", () => {
    it("should handle missing JWT_SECRET during verification", async () => {
      const token = await signToken(mockPayload);
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      const decoded = await verifyToken(token);
      expect(decoded).toBeNull();

      process.env.JWT_SECRET = originalSecret;
    });

    it("should handle corrupted token", async () => {
      const token = await signToken(mockPayload);
      const corruptedToken = token.slice(0, -5) + "xxxxx";

      const decoded = await verifyToken(corruptedToken);
      expect(decoded).toBeNull();
    });
  });
});
