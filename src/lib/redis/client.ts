import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

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

    // Connect to Redis
    redisClient.connect().catch(console.error);
  }

  return redisClient;
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

// Cache utilities
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const client = getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);

    if (ttl) {
      await client.setEx(key, ttl, serialized);
    } else {
      await client.set(key, serialized);
    }
  },

  async del(key: string): Promise<void> {
    const client = getRedisClient();
    await client.del(key);
  },

  async exists(key: string): Promise<boolean> {
    const client = getRedisClient();
    const result = await client.exists(key);
    return result === 1;
  },

  async keys(pattern: string): Promise<string[]> {
    const client = getRedisClient();
    return await client.keys(pattern);
  },

  async flush(): Promise<void> {
    const client = getRedisClient();
    await client.flushAll();
  },
};

// Session utilities
export const session = {
  async get(sessionId: string): Promise<any> {
    return await cache.get(`session:${sessionId}`);
  },

  async set(sessionId: string, data: any, ttl: number = 86400): Promise<void> {
    await cache.set(`session:${sessionId}`, data, ttl);
  },

  async del(sessionId: string): Promise<void> {
    await cache.del(`session:${sessionId}`);
  },
};

// Feature flag cache
export const featureFlags = {
  async get(tenantId: string, flagName: string): Promise<any> {
    return await cache.get(`feature_flag:${tenantId}:${flagName}`);
  },

  async set(
    tenantId: string,
    flagName: string,
    value: any,
    ttl: number = 3600
  ): Promise<void> {
    await cache.set(`feature_flag:${tenantId}:${flagName}`, value, ttl);
  },

  async del(tenantId: string, flagName: string): Promise<void> {
    await cache.del(`feature_flag:${tenantId}:${flagName}`);
  },

  async getAll(tenantId: string): Promise<Record<string, any>> {
    const keys = await cache.keys(`feature_flag:${tenantId}:*`);
    const flags: Record<string, any> = {};

    for (const key of keys) {
      const flagName = key.split(":").pop();
      if (flagName) {
        flags[flagName] = await cache.get(key);
      }
    }

    return flags;
  },
};
