import { createDB } from "@committed/db";

export const database = createDB(process.env.DATABASE_URL!);
