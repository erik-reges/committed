import { database } from "../lib/database";
import { Elysia } from "elysia";

export const db = new Elysia({
  name: "db",
})
  .decorate("db", database)
  .as("scoped");
