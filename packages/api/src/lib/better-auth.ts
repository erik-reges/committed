import { betterAuth as bAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  user,
  session,
  verification,
  account,
} from "@committed/db/drizzle/schema.ts";
import { config } from "./config";
import { database } from "../lib/database";
import { randomUUIDv7 } from "bun";

export const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

const Domains: Record<string, string> = {
  development: "localhost",
  production: "committed-api.fly.dev",
};

export const betterAuth = bAuth({
  appName: "committed-auth",
  schema: {
    user,
    session,
    verification,
    account,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  basePath: "/api/auth",
  trustedOrigins: [`${process.env.FRONTEND_URL}`],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
  },
  advanced: {
    generateId: () => randomUUIDv7(),
    defaultCookieAttributes: {
      sameSite: config.env === "production" ? "None" : "Lax",
      secure: config.env === "production",
      httpOnly: config.env === "production",
      domain: Domains[config.env],
    },
    useSecureCookies: config.env === "production",
    crossSubDomainCookies: {
      enabled: config.env === "production",
      domain: Domains[config.env],
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  logger: {
    disabled: false,
    level: "debug",
    log(level, message, ...args) {
      const timestamp = new Date().toISOString();
      const prefix = `[BetterAuth] ${timestamp} ${level.toUpperCase()}:`;
      if (level === "error") {
        console.error(prefix, message, ...args);
      } else {
        console.log(prefix, message, ...args);
      }
    },
  },
  database: drizzleAdapter(database, {
    provider: "pg",
  }),
});
