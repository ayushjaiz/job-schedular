export const envConfig = {
    jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    redisUrl: process.env.REDIS_URL || "",
};
