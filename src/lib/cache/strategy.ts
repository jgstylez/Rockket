import { CacheManager, CacheKeys } from "./redis";

// Cache strategies for different data types
export class CacheStrategy {
  private cache: CacheManager;

  constructor() {
    this.cache = new CacheManager();
  }

  // User caching strategy
  async cacheUser(user: any): Promise<boolean> {
    const key = CacheKeys.user(user.id);
    const emailKey = CacheKeys.userByEmail(user.email);

    // Cache user data
    await this.cache.set(key, user, 3600); // 1 hour
    await this.cache.set(emailKey, user.id, 3600); // 1 hour

    return true;
  }

  async getUser(id: string): Promise<any | null> {
    const key = CacheKeys.user(id);
    return await this.cache.get(key);
  }

  async getUserByEmail(email: string): Promise<any | null> {
    const emailKey = CacheKeys.userByEmail(email);
    const userId = await this.cache.get<string>(emailKey);

    if (!userId) return null;

    return await this.getUser(userId);
  }

  async invalidateUser(userId: string, email: string): Promise<boolean> {
    const userKey = CacheKeys.user(userId);
    const emailKey = CacheKeys.userByEmail(email);

    await this.cache.delete(userKey);
    await this.cache.delete(emailKey);

    return true;
  }

  // Tenant caching strategy
  async cacheTenant(tenant: any): Promise<boolean> {
    const key = CacheKeys.tenant(tenant.id);
    const slugKey = CacheKeys.tenantBySlug(tenant.slug);

    // Cache tenant data
    await this.cache.set(key, tenant, 7200); // 2 hours
    await this.cache.set(slugKey, tenant.id, 7200); // 2 hours

    return true;
  }

  async getTenant(id: string): Promise<any | null> {
    const key = CacheKeys.tenant(id);
    return await this.cache.get(key);
  }

  async getTenantBySlug(slug: string): Promise<any | null> {
    const slugKey = CacheKeys.tenantBySlug(slug);
    const tenantId = await this.cache.get<string>(slugKey);

    if (!tenantId) return null;

    return await this.getTenant(tenantId);
  }

  async invalidateTenant(tenantId: string, slug: string): Promise<boolean> {
    const tenantKey = CacheKeys.tenant(tenantId);
    const slugKey = CacheKeys.tenantBySlug(slug);

    await this.cache.delete(tenantKey);
    await this.cache.delete(slugKey);

    return true;
  }

  // AI Generation caching strategy
  async cacheAIGeneration(generation: any): Promise<boolean> {
    const key = CacheKeys.aiGeneration(generation.id);

    // Cache for 24 hours (AI generations are expensive)
    await this.cache.set(key, generation, 86400);

    return true;
  }

  async getAIGeneration(id: string): Promise<any | null> {
    const key = CacheKeys.aiGeneration(id);
    return await this.cache.get(key);
  }

  // Visual Builder caching strategy
  async cacheVisualBuilderProject(project: any): Promise<boolean> {
    const key = CacheKeys.visualBuilderProject(project.id);

    // Cache for 2 hours
    await this.cache.set(key, project, 7200);

    return true;
  }

  async getVisualBuilderProject(id: string): Promise<any | null> {
    const key = CacheKeys.visualBuilderProject(id);
    return await this.cache.get(key);
  }

  async invalidateVisualBuilderProject(projectId: string): Promise<boolean> {
    const key = CacheKeys.visualBuilderProject(projectId);
    await this.cache.delete(key);
    return true;
  }

  // Content caching strategy
  async cacheContent(content: any): Promise<boolean> {
    const key = CacheKeys.content(content.id);

    // Cache for 1 hour
    await this.cache.set(key, content, 3600);

    return true;
  }

  async getContent(id: string): Promise<any | null> {
    const key = CacheKeys.content(id);
    return await this.cache.get(key);
  }

  async invalidateContent(contentId: string): Promise<boolean> {
    const key = CacheKeys.content(contentId);
    await this.cache.delete(key);
    return true;
  }

  // Product caching strategy
  async cacheProduct(product: any): Promise<boolean> {
    const key = CacheKeys.product(product.id);

    // Cache for 30 minutes (products change frequently)
    await this.cache.set(key, product, 1800);

    return true;
  }

  async getProduct(id: string): Promise<any | null> {
    const key = CacheKeys.product(id);
    return await this.cache.get(key);
  }

  async invalidateProduct(productId: string): Promise<boolean> {
    const key = CacheKeys.product(productId);
    await this.cache.delete(key);
    return true;
  }

  // Order caching strategy
  async cacheOrder(order: any): Promise<boolean> {
    const key = CacheKeys.order(order.id);

    // Cache for 1 hour
    await this.cache.set(key, order, 3600);

    return true;
  }

  async getOrder(id: string): Promise<any | null> {
    const key = CacheKeys.order(id);
    return await this.cache.get(key);
  }

  async invalidateOrder(orderId: string): Promise<boolean> {
    const key = CacheKeys.order(orderId);
    await this.cache.delete(key);
    return true;
  }

  // Feature flag caching strategy
  async cacheFeatureFlag(flag: any): Promise<boolean> {
    const key = CacheKeys.featureFlag(flag.name);

    // Cache for 5 minutes (feature flags change frequently)
    await this.cache.set(key, flag, 300);

    return true;
  }

  async getFeatureFlag(name: string): Promise<any | null> {
    const key = CacheKeys.featureFlag(name);
    return await this.cache.get(key);
  }

  async invalidateFeatureFlag(flagName: string): Promise<boolean> {
    const key = CacheKeys.featureFlag(flagName);
    await this.cache.delete(key);
    return true;
  }

  // API response caching strategy
  async cacheAPIResponse(
    endpoint: string,
    params: string,
    response: any,
    ttl: number = 300
  ): Promise<boolean> {
    const key = CacheKeys.apiResponse(endpoint, params);

    await this.cache.set(key, response, ttl);

    return true;
  }

  async getAPIResponse(endpoint: string, params: string): Promise<any | null> {
    const key = CacheKeys.apiResponse(endpoint, params);
    return await this.cache.get(key);
  }

  // Session caching strategy
  async cacheSession(sessionId: string, sessionData: any): Promise<boolean> {
    const key = CacheKeys.session(sessionId);

    // Cache for 24 hours
    await this.cache.set(key, sessionData, 86400);

    return true;
  }

  async getSession(sessionId: string): Promise<any | null> {
    const key = CacheKeys.session(sessionId);
    return await this.cache.get(key);
  }

  async invalidateSession(sessionId: string): Promise<boolean> {
    const key = CacheKeys.session(sessionId);
    await this.cache.delete(key);
    return true;
  }

  // Rate limiting caching strategy
  async checkRateLimit(
    identifier: string,
    window: string,
    limit: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = CacheKeys.rateLimit(identifier, window);
    const current = await this.cache.incr(key, 3600); // 1 hour window

    const remaining = Math.max(0, limit - current);
    const allowed = current <= limit;
    const resetTime = Date.now() + 3600000; // 1 hour from now

    return { allowed, remaining, resetTime };
  }

  // Cache warming strategy
  async warmCache(): Promise<boolean> {
    try {
      // This would be called during application startup
      // to pre-populate frequently accessed data

      console.log("Warming cache...");

      // Add cache warming logic here
      // For example, pre-load feature flags, common configurations, etc.

      return true;
    } catch (error) {
      console.error("Cache warming error:", error);
      return false;
    }
  }

  // Cache invalidation by pattern
  async invalidateByPattern(pattern: string): Promise<boolean> {
    try {
      // This would require Redis SCAN command
      // For now, we'll implement a simple approach
      console.log(`Invalidating cache by pattern: ${pattern}`);
      return true;
    } catch (error) {
      console.error("Cache invalidation by pattern error:", error);
      return false;
    }
  }

  // Cache statistics
  async getCacheStats(): Promise<any> {
    return await this.cache.getStats();
  }

  // Clear all cache
  async clearAllCache(): Promise<boolean> {
    return await this.cache.flushAll();
  }
}

// Cache middleware for Next.js API routes
export function withCacheMiddleware(
  keyGenerator: (req: any) => string,
  ttl: number = 300,
  tags: string[] = []
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    const cache = new CacheManager(ttl);

    descriptor.value = async function (req: any, res: any, ...args: any[]) {
      const cacheKey = keyGenerator(req);

      // Try to get from cache
      const cached = await cache.get(cacheKey);
      if (cached !== null) {
        res.setHeader("X-Cache", "HIT");
        return res.json(cached);
      }

      // Execute method and cache result
      const originalJson = res.json;
      res.json = function (data: any) {
        // Cache the response
        cache.setWithTags(cacheKey, data, tags, ttl);
        res.setHeader("X-Cache", "MISS");
        return originalJson.call(this, data);
      };

      return method.apply(this, [req, res, ...args]);
    };
  };
}

// Cache decorator for database queries
export function cacheQuery(
  keyGenerator: (...args: any[]) => string,
  ttl: number = 3600,
  tags: string[] = []
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    const cache = new CacheManager(ttl);

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator(...args);

      // Try to get from cache
      const cached = await cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Execute query and cache result
      const result = await method.apply(this, args);
      await cache.setWithTags(cacheKey, result, tags, ttl);

      return result;
    };
  };
}

// Cache invalidation decorator
export function invalidateCache(
  keyGenerator: (...args: any[]) => string[],
  tags: string[] = []
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    const cache = new CacheManager();

    descriptor.value = async function (...args: any[]) {
      // Execute method first
      const result = await method.apply(this, args);

      // Invalidate cache
      const keys = keyGenerator(...args);
      for (const key of keys) {
        await cache.delete(key);
      }

      if (tags.length > 0) {
        await cache.invalidateByTags(tags);
      }

      return result;
    };
  };
}

export default CacheStrategy;
