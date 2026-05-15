"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
let redis = null;
if (process.env.REDIS_URL) {
    redis = new ioredis_1.default(process.env.REDIS_URL);
    redis
        .on("connect", () => console.log("✅ Connected to Redis"))
        .on("error", (err) => {
        console.error("❌ Redis error (ignoring for local dev):", err.message);
    });
}
else {
    console.log("⚠️ REDIS_URL not found, using MemoryStore for sessions.");
}
exports.default = redis;
