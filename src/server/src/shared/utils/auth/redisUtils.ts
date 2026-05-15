import redisClient from "@/infra/cache/redis";

// Blacklist token in Redis
export const blacklistToken = async (
  token: string,
  ttl: number
): Promise<void> => {
  if (redisClient) {
    await redisClient.set(`blacklist:${token}`, "blacklisted", "EX", ttl);
  }
};

// Check if token is blacklisted
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  if (!redisClient) return false;
  try {
    const result = await redisClient.get(`blacklist:${token}`);
    return result !== null;
  } catch (error) {
    console.error("Redis error:", error);
    return false;
  }
};
