import Redis, { RedisOptions } from "ioredis";

export const redisClient = new Redis(
  "redis://default:da18b2e7d3c949868c1a5b349b8fcb37@apn1-pretty-joey-33367.upstash.io:33367"
);
