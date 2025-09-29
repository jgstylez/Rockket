/**
 * Cache Service for Rockket Platform
 *
 * This service provides in-memory caching with TTL support
 * and cache invalidation strategies.
 */

export class CacheService {
  private cache: Map<string, { value: any; expires: number }> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private maxSize = 1000; // Maximum number of cached items

  constructor(options?: { defaultTTL?: number; maxSize?: number }) {
    if (options?.defaultTTL) {
      this.defaultTTL = options.defaultTTL;
    }
    if (options?.maxSize) {
      this.maxSize = options.maxSize;
    }
  }

  set(key: string, value: any, ttl?: number): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expires });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Cache with function
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const value = await fetcher();
    this.set(key, value, ttl);
    return value;
  }

  // Cache with function (synchronous)
  getOrSetSync<T>(key: string, fetcher: () => T, ttl?: number): T {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const value = fetcher();
    this.set(key, value, ttl);
    return value;
  }

  // Invalidate by pattern
  invalidatePattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let count = 0;

    for (const key of Array.from(this.cache.keys())) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const [key, item] of Array.from(this.cache.entries())) {
      if (now > item.expires) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize) * 100,
    };
  }

  // Clean expired entries
  cleanExpired(): number {
    const now = Date.now();
    let count = 0;

    for (const [key, item] of Array.from(this.cache.entries())) {
      if (now > item.expires) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }
}

// Global cache instance
export const cache = new CacheService({
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000,
});
