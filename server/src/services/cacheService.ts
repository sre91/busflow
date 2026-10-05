import redisClient from "../config/redis.js";

export const getCache = async <T>(key: string): Promise<T | null> => {
  const cached = await redisClient.get(key);

  if (!cached) {
    return null;
  }

  return JSON.parse(cached) as T;
};

export const setCache = async <T>(
  key: string,
  value: T,
  ttlSeconds = 60,
): Promise<void> => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttlSeconds,
  });
};

export const deleteCache = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
  const keys = await redisClient.keys(pattern);

  if (keys.length === 0) {
    return;
  }

  await redisClient.del(keys);
};
