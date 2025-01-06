import { cors } from "@elysiajs/cors";
import Elysia from "elysia";
import { config } from "./lib/config";
import { BETTER_AUTH_ACCEPT_METHODS, betterAuth } from "./lib/better-auth";
import { userRouter } from "./routes/user";
import { habitsRouter } from "./routes/habits";

export const api = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: config.isDev
        ? ["http://localhost:8080", "http://localhost:3000"]
        : ["https://committed.fly.dev", "https://committed-api.fly.dev"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cookie",
        "X-Forwarded-Proto",
        "Origin",
        "Accept",
      ],
      exposeHeaders: ["Set-Cookie", "Cookie"],
      maxAge: 86400,
      preflight: true,
    }),
  )
  .use(habitsRouter)

  .all("/auth/*", async ({ request, error }) =>
    !BETTER_AUTH_ACCEPT_METHODS.includes(request.method)
      ? error(405)
      : betterAuth.handler(request),
  )

  .get("/health", () => `healthy server`)
  .use(userRouter);

api.listen(config.port);

console.log(`🍣 api is ready: ${config.apiBaseUrl}/api`);

export type App = typeof api;
