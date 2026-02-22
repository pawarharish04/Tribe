import { Redis } from 'ioredis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL;
let redis: Redis | null = null;

if (redisUrl) {
    try {
        redis = new Redis(redisUrl);
    } catch (error) {
        console.error('Failed to initialize Redis:', error);
    }
}

const fallbackCache = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = async (identifier: string, limit: number, windowMs: number): Promise<boolean> => {
    const now = Date.now();

    if (redis) {
        try {
            const current = await redis.incr(identifier);
            if (current === 1) {
                await redis.pexpire(identifier, windowMs);
            }
            return current <= limit;
        } catch {
            // Fallback to local memory cache if Redis fails
        }
    }

    // Local fallback
    let record = fallbackCache.get(identifier);
    if (!record || record.resetTime < now) {
        record = { count: 1, resetTime: now + windowMs };
        fallbackCache.set(identifier, record);
        return true;
    }

    record.count += 1;
    return record.count <= limit;
};
