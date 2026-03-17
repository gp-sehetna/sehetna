import { Duration, Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()


export const globalLimiter = (
    points: number= 100,
    duration: Duration = "1 m",
    ip: string = "0.0.0.0"
) => {
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(points, duration),
    }).limit(ip)
}
