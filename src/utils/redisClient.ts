import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient: RedisClientType = createClient({ url });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// In-memory fallback cache when Redis is unavailable
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

let redisAvailable = false;

async function connect() {
  if (redisAvailable) return;
  try {
    if (!redisClient.isOpen) await redisClient.connect();
    redisAvailable = true;
    console.log('Connected to Redis');
  } catch (err) {
    redisAvailable = false;
    console.warn('Could not connect to Redis, using in-memory cache fallback');
  }
}

const client = {
  get: async (key: string) => {
    if (redisAvailable) return redisClient.get(key);
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return entry.value;
  },
  setEx: async (key: string, ttlSeconds: number, value: string) => {
    if (redisAvailable) return redisClient.setEx(key, ttlSeconds, value as any);
    const expiresAt = Date.now() + ttlSeconds * 1000;
    memoryCache.set(key, { value, expiresAt });
    return 'OK';
  },
  isOpen: () => redisAvailable,
};

async function flushAll() {
  try {
    if (redisAvailable) {
      if (typeof (redisClient as any).flushAll === 'function') {
        await (redisClient as any).flushAll();
      } else {
        await redisClient.sendCommand(['FLUSHALL']);
      }
    }
  } catch (err) {
    console.warn('Failed to flush Redis:', err);
  }
  memoryCache.clear();
}

export { client, connect, flushAll };
