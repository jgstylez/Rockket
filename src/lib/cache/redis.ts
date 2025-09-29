import Redis from "redis";

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || "0"),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
};

// Create Redis client
let redisClient: Redis.RedisClientType | null = null;

export function getRedisClient(): Redis.RedisClientType {
  if (!redisClient) {
    redisClient = Redis.createClient(redisConfig);

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    redisClient.on("connect", () => {
      console.log("Redis Client Connected");
    });

    redisClient.on("ready", () => {
      console.log("Redis Client Ready");
    });

    redisClient.on("end", () => {
      console.log("Redis Client Disconnected");
    });

    redisClient.connect().catch((err) => {
      console.error("Redis Connection Error:", err);
    });
  }

  return redisClient;
}

// Cache utility functions
export class CacheManager {
  private client: Redis.RedisClientType;
  private defaultTTL: number;

  constructor(ttl: number = 3600) {
    this.client = getRedisClient();
    this.defaultTTL = ttl;
  }

  // Set cache with TTL
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value);
      const expirationTime = ttl || this.defaultTTL;

      await this.client.setEx(key, expirationTime, serializedValue);
      return true;
    } catch (error) {
      console.error("Cache set error:", error);
      return false;
    }
  }

  // Get cache value
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  // Delete cache
  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      console.error("Cache delete error:", error);
      return false;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error("Cache exists error:", error);
      return false;
    }
  }

  // Set multiple keys
  async mset(
    keyValuePairs: Record<string, any>,
    ttl?: number
  ): Promise<boolean> {
    try {
      const serializedPairs: Record<string, string> = {};

      for (const [key, value] of Object.entries(keyValuePairs)) {
        serializedPairs[key] = JSON.stringify(value);
      }

      await this.client.mSet(serializedPairs);

      if (ttl) {
        const pipeline = this.client.multi();
        for (const key of Object.keys(keyValuePairs)) {
          pipeline.expire(key, ttl);
        }
        await pipeline.exec();
      }

      return true;
    } catch (error) {
      console.error("Cache mset error:", error);
      return false;
    }
  }

  // Get multiple keys
  async mget<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const values = await this.client.mGet(keys);
      const result: Record<string, T | null> = {};

      keys.forEach((key, index) => {
        result[key] = values[index] ? JSON.parse(values[index]!) : null;
      });

      return result;
    } catch (error) {
      console.error("Cache mget error:", error);
      return {};
    }
  }

  // Increment counter
  async incr(key: string, ttl?: number): Promise<number> {
    try {
      const result = await this.client.incr(key);

      if (ttl && result === 1) {
        await this.client.expire(key, ttl);
      }

      return result;
    } catch (error) {
      console.error("Cache incr error:", error);
      return 0;
    }
  }

  // Decrement counter
  async decr(key: string): Promise<number> {
    try {
      return await this.client.decr(key);
    } catch (error) {
      console.error("Cache decr error:", error);
      return 0;
    }
  }

  // Set hash field
  async hset(
    key: string,
    field: string,
    value: any,
    ttl?: number
  ): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.hSet(key, field, serializedValue);

      if (ttl) {
        await this.client.expire(key, ttl);
      }

      return true;
    } catch (error) {
      console.error("Cache hset error:", error);
      return false;
    }
  }

  // Get hash field
  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.client.hGet(key, field);
      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      console.error("Cache hget error:", error);
      return null;
    }
  }

  // Get all hash fields
  async hgetall<T>(key: string): Promise<Record<string, T>> {
    try {
      const hash = await this.client.hGetAll(key);
      const result: Record<string, T> = {};

      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value) as T;
      }

      return result;
    } catch (error) {
      console.error("Cache hgetall error:", error);
      return {};
    }
  }

  // Delete hash field
  async hdel(key: string, field: string): Promise<boolean> {
    try {
      const result = await this.client.hDel(key, field);
      return result > 0;
    } catch (error) {
      console.error("Cache hdel error:", error);
      return false;
    }
  }

  // Set with tags for cache invalidation
  async setWithTags(
    key: string,
    value: any,
    tags: string[],
    ttl?: number
  ): Promise<boolean> {
    try {
      // Set the main value
      await this.set(key, value, ttl);

      // Set tag associations
      for (const tag of tags) {
        await this.client.sAdd(`tag:${tag}`, key);
        if (ttl) {
          await this.client.expire(`tag:${tag}`, ttl);
        }
      }

      return true;
    } catch (error) {
      console.error("Cache setWithTags error:", error);
      return false;
    }
  }

  // Invalidate cache by tags
  async invalidateByTags(tags: string[]): Promise<boolean> {
    try {
      for (const tag of tags) {
        const keys = await this.client.sMembers(`tag:${tag}`);
        if (keys.length > 0) {
          await this.client.del(keys);
          await this.client.del(`tag:${tag}`);
        }
      }

      return true;
    } catch (error) {
      console.error("Cache invalidateByTags error:", error);
      return false;
    }
  }

  // Get cache statistics
  async getStats(): Promise<{
    memory: string;
    keyspace: Record<string, string>;
    connectedClients: number;
    uptime: number;
  }> {
    try {
      const info = await this.client.info();
      const stats = {
        memory: "",
        keyspace: {} as Record<string, string>,
        connectedClients: 0,
        uptime: 0,
      };

      const lines = info.split("\r\n");
      for (const line of lines) {
        if (line.startsWith("used_memory_human:")) {
          stats.memory = line.split(":")[1];
        } else if (line.startsWith("connected_clients:")) {
          stats.connectedClients = parseInt(line.split(":")[1]);
        } else if (line.startsWith("uptime_in_seconds:")) {
          stats.uptime = parseInt(line.split(":")[1]);
        } else if (line.startsWith("db")) {
          const [db, info] = line.split(":");
          stats.keyspace[db] = info;
        }
      }

      return stats;
    } catch (error) {
      console.error("Cache getStats error:", error);
      return {
        memory: "0B",
        keyspace: {},
        connectedClients: 0,
        uptime: 0,
      };
    }
  }

  // Clear all cache
  async flushAll(): Promise<boolean> {
    try {
      await this.client.flushAll();
      return true;
    } catch (error) {
      console.error("Cache flushAll error:", error);
      return false;
    }
  }

  // Close connection
  async close(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      console.error("Cache close error:", error);
    }
  }
}

// Cache key generators
export class CacheKeys {
  static user(id: string): string {
    return `user:${id}`;
  }

  static tenant(id: string): string {
    return `tenant:${id}`;
  }

  static userByEmail(email: string): string {
    return `user:email:${email}`;
  }

  static tenantBySlug(slug: string): string {
    return `tenant:slug:${slug}`;
  }

  static aiGeneration(id: string): string {
    return `ai:generation:${id}`;
  }

  static visualBuilderProject(id: string): string {
    return `builder:project:${id}`;
  }

  static content(id: string): string {
    return `content:${id}`;
  }

  static product(id: string): string {
    return `product:${id}`;
  }

  static order(id: string): string {
    return `order:${id}`;
  }

  static featureFlag(name: string): string {
    return `feature:${name}`;
  }

  static analyticsEvent(id: string): string {
    return `analytics:event:${id}`;
  }

  static apiResponse(endpoint: string, params: string): string {
    return `api:response:${endpoint}:${params}`;
  }

  static session(sessionId: string): string {
    return `session:${sessionId}`;
  }

  static rateLimit(identifier: string, window: string): string {
    return `rate:limit:${identifier}:${window}`;
  }
}

// Cache decorator for functions
export function cached(
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

      // Execute method and cache result
      const result = await method.apply(this, args);
      await cache.setWithTags(cacheKey, result, tags, ttl);

      return result;
    };
  };
}

// Cache middleware for API routes
export function withCache(
  keyGenerator: (req: any) => string,
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

    descriptor.value = async function (req: any, ...args: any[]) {
      const cacheKey = keyGenerator(req);

      // Try to get from cache
      const cached = await cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Execute method and cache result
      const result = await method.apply(this, [req, ...args]);
      await cache.setWithTags(cacheKey, result, tags, ttl);

      return result;
    };
  };
}

export default CacheManager;
