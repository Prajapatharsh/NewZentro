import Redis from "ioredis";

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  redis
    .on("connect", () => console.log("✅ Connected to Redis"))
    .on("error", (err) => {
      console.error("❌ Redis error (ignoring for local dev):", err.message);
    });
} else {
  console.log("⚠️ REDIS_URL not found, using MemoryStore for sessions.");
}

export default redis;
