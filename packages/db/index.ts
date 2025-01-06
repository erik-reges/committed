import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schemas from "./drizzle/schema";

export function createDB(url: string) {
  const pool = new Pool({
    connectionString: url,
  });

  return drizzle(pool, { schema: schemas, casing: "snake_case" });
}
