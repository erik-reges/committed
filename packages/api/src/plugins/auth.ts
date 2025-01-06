import { Elysia } from "elysia";
import type { Session, User } from "better-auth";
import { betterAuth } from "../lib/better-auth";

type Auth = {
  session: Session;
  user: User;
} | null;
export const auth = new Elysia({
  name: "auth",
}).derive({ as: "scoped" }, async ({ request, error }) => {
  const auth: Auth = await betterAuth.api.getSession({
    headers: request.headers,
  });

  if (!auth) {
    return error(401, "Unauthorized");
  }

  return auth;
});
