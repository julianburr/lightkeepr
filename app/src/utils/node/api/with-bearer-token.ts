import cache from "memory-cache";
import { NextApiRequest, NextApiResponse } from "next";

const LIMIT = 60;
const EXPIRE = 60 * 1000;

type WithBearerTokenHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  meta: { token: string }
) => any;

export function withBearerToken(handler: WithBearerTokenHandler) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const [, token] = req.headers?.authorization?.match?.(/Bearer (.+)/) || [];

    // Check if token is there
    if (!token) {
      return res.status(401).json({ message: "Invalid bearer token provided" });
    }

    // Rate limit
    const now = new Date();

    const fromCache = cache.get(`rateLimit/${token}`);
    const cacheResetTime = fromCache?.resetTime
      ? new Date(fromCache.resetTime)
      : undefined;

    const expired = !cacheResetTime || cacheResetTime < now;

    const resetTime = expired
      ? new Date(now.getTime() + EXPIRE)
      : new Date(fromCache.resetTime);

    let count = expired ? 0 : fromCache?.count || 0;

    if (++count > LIMIT) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    res.setHeader("X-RateLimit-Limit", LIMIT);
    res.setHeader("X-RateLimit-Remaining", LIMIT - count);
    res.setHeader("Date", now.toUTCString());
    res.setHeader("X-RateLimit-Reset", Math.ceil(resetTime.getTime() / 1000));

    cache.put(
      `rateLimit/${token}`,
      { count, resetTime: resetTime?.getTime() },
      EXPIRE
    );

    return handler?.(req, res, { token });
  };
}
