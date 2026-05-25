import Redis from "ioredis";
import { env } from "./env.js";

export const isRedisEnabled = env.REDIS_ENABLED;

function createRedisClient(): Redis {
  const redisOptions = {
    maxRetriesPerRequest: null as null,
    lazyConnect: true,
    retryStrategy: (times: number) => {
      if (times > 3) {
        console.warn(
          "⚠️  Redis connection failed after 3 retries. Running without Redis cache."
        );
        return null;
      }
      return Math.min(times * 200, 2000);
    },
  };

  return env.REDIS_URL
    ? new Redis(env.REDIS_URL, {
        ...redisOptions,
        tls: env.REDIS_URL.startsWith("rediss://") ? {} : undefined,
      })
    : new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD || undefined,
        ...redisOptions,
      });
}

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!isRedisEnabled) {
    throw new Error("Redis is disabled (REDIS_ENABLED=false)");
  }
  if (!redisClient) {
    redisClient = createRedisClient();
    redisClient.on("connect", () => {
      console.log("✅ Redis connected successfully");
    });
    redisClient.on("error", (err) => {
      console.error("Redis error:", err.message);
    });
    void redisClient.connect().catch((err) => {
      console.error("Redis connect failed:", err.message);
    });
  }
  return redisClient;
}

export const CACHE_TTL = 3600;

export async function getCache<T>(key: string): Promise<T | null> {
  if (!isRedisEnabled) {
    return null;
  }
  try {
    const data = await getRedisClient().get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setCache(
  key: string,
  data: unknown,
  ttl: number = CACHE_TTL
): Promise<void> {
  if (!isRedisEnabled) {
    return;
  }
  try {
    await getRedisClient().set(key, JSON.stringify(data), "EX", ttl);
  } catch (err) {
    console.warn("Cache set failed:", err);
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (!isRedisEnabled) {
    return;
  }
  try {
    await getRedisClient().del(key);
  } catch (err) {
    console.warn("Cache delete failed:", err);
  }
}
