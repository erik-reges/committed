import Elysia from "elysia";
import { auth } from "../plugins/auth";

// amazing dx
export const userRouter = new Elysia({ prefix: "/user" })
  .use(auth)
  .get("/sesh", ({ session }) => session)
  .get("/info", ({ user }) => user);
