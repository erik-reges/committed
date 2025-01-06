export const config = {
  env: process.env.ENV || "development",
  isDev: process.env.ENV === "development",
  port: process.env.PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:8000",
  apiBaseUrl: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? "very-secret-token",
} as const;
