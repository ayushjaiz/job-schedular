import Redis from "ioredis";
import { envConfig } from "./env";
import { initializeWorker } from "../services/email-queue/worker";

const redis = new Redis(envConfig.redisUrl, {
    maxRetriesPerRequest: null,
    tls: {
        rejectUnauthorized: false
    }
});


redis.on("connect", () => {
    // initializeWorker();
    console.log("✅ Connected to Redis")
});
redis.on("error", (err) => console.error("Redis Error:", err));

export { redis };