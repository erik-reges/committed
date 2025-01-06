// import { Elysia } from "elysia";
// import { Redis } from "@upstash/redis";
// import { config } from "../lib/config";

// interface RedisConfig {
//   url?: string;
//   token?: string;
//   ttl?: number;
// }

// export const redis = (redisConfig?: RedisConfig) => {
//   const client = new Redis({
//     url: redisConfig?.url || config.redisUrl,
//     token: redisConfig?.token || config.redisToken,
//   });

//   const defaultTTL = redisConfig?.ttl || 3600;

//   return new Elysia({
//     name: "redis",
//     seed: redisConfig,
//   })
//     .decorate("redis", {
//       async get(key: string) {
//         try {
//           const value = await client.get(key);
//           return value;
//         } catch (error) {
//           console.error("Redis get error:", error);
//           throw error;
//         }
//       },

//       async set(key: string, value: string, ttl: number = defaultTTL) {
//         try {
//           return await client.setex(key, ttl, value);
//         } catch (error) {
//           console.error("Redis set error:", error);
//           throw error;
//         }
//       },

//       async del(key: string) {
//         try {
//           return await client.del(key);
//         } catch (error) {
//           console.error("Redis del error:", error);
//           throw error;
//         }
//       },

//       async exists(key: string) {
//         try {
//           return await client.exists(key);
//         } catch (error) {
//           console.error("Redis exists error:", error);
//           throw error;
//         }
//       },
//     })
//     .as("scoped");
// };
