import { hashPassword, verifyPassword } from "../password";

describe("Password Utilities", () => {
  const testPassword = "testPassword123";
  const testHash =
    "$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdQvOQ5qOQ5qOQ5qOQ5qOQ5qOQ5qO";

  describe("hashPassword", () => {
    it("should hash a password successfully", async () => {
      const hash = await hashPassword(testPassword);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash.length).toBeGreaterThan(50); // bcrypt hashes are typically 60 chars
      expect(hash).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash format
    });

    it("should produce different hashes for the same password", async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);

      expect(hash1).not.toBe(hash2);
    });

    it("should handle empty password", async () => {
      const hash = await hashPassword("");

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
    });

    it("should handle special characters in password", async () => {
      const specialPassword = "test@#$%^&*()_+{}|:<>?[]\\;'\",./";
      const hash = await hashPassword(specialPassword);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      const hash = await hashPassword(testPassword);
      const isValid = await verifyPassword(testPassword, hash);

      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const hash = await hashPassword(testPassword);
      const isValid = await verifyPassword("wrongPassword", hash);

      expect(isValid).toBe(false);
    });

    it("should reject empty password", async () => {
      const hash = await hashPassword(testPassword);
      const isValid = await verifyPassword("", hash);

      expect(isValid).toBe(false);
    });

    it("should handle case sensitivity", async () => {
      const hash = await hashPassword(testPassword);
      const isValid = await verifyPassword(testPassword.toUpperCase(), hash);

      expect(isValid).toBe(false);
    });

    it("should handle null/undefined inputs", async () => {
      const hash = await hashPassword(testPassword);

      await expect(verifyPassword(null as any, hash)).rejects.toThrow();
      await expect(verifyPassword(testPassword, null as any)).rejects.toThrow();
      await expect(verifyPassword(undefined as any, hash)).rejects.toThrow();
      await expect(
        verifyPassword(testPassword, undefined as any)
      ).rejects.toThrow();
    });
  });

  describe("Password Security", () => {
    it("should use bcrypt with appropriate cost factor", async () => {
      const hash = await hashPassword(testPassword);

      // Extract cost factor from hash
      const costFactor = parseInt(hash.split("$")[2]);
      expect(costFactor).toBeGreaterThanOrEqual(10);
    });

    it("should take reasonable time to hash (not too fast)", async () => {
      const startTime = Date.now();
      await hashPassword(testPassword);
      const endTime = Date.now();

      // Should take at least 10ms for security
      expect(endTime - startTime).toBeGreaterThan(10);
    });

    it("should take reasonable time to verify (not too fast)", async () => {
      const hash = await hashPassword(testPassword);

      const startTime = Date.now();
      await verifyPassword(testPassword, hash);
      const endTime = Date.now();

      // Should take at least 5ms for security
      expect(endTime - startTime).toBeGreaterThan(5);
    });
  });
});
