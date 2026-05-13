import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

export const cacheEnabled = redis !== null;

const TTL_SECONDS = 60;

/**
 * Get a value from cache. Returns null on miss, parse error, or if Redis is disabled.
 * Never throws — cache layer must never break the request path.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const value = await redis.get<T>(key);
    return value ?? null;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = TTL_SECONDS): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {
    // swallow — cache is best-effort
  }
}

export async function cacheInvalidate(...keys: string[]): Promise<void> {
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch {
    // swallow
  }
}

export const cacheKeys = {
  cards: (userId: number) => `sb:cards:u${userId}`,
  movementsLast: (userId: number) => `sb:movements:last:u${userId}`,
};
