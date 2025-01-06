import Elysia, { t } from "elysia";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "../plugins/db";
import { auth } from "../plugins/auth";
import { habitEntries, habits, streaks } from "@committed/db/drizzle/schema";

export const habitSchema = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
  targetFrequency: t.Enum({
    daily: "daily",
    weekly: "weekly",
    monthly: "monthly",
  }),
});

export const streakSchema = t.Object({
  habitId: t.String(),
  startDate: t.String(),
  endDate: t.Optional(t.String()),
  length: t.Number(),
});

export const progressGridSchema = t.Object({
  userId: t.String(),
  habitId: t.String(),
  date: t.String(),
  completionStatus: t.Boolean(),
});

export const analyticsSchema = t.Object({
  userId: t.String(),
  habitId: t.String(),
  totalCompleted: t.Number(),
  totalSkipped: t.Number(),
  completionRate: t.Number(),
  longestStreak: t.Number(),
});

export const habitsRouter = new Elysia({ prefix: "/habits" })
  .use(db)
  .use(auth)
  .post(
    "",
    async ({ db, user, body }) => {
      return (
        (await db
          .insert(habits)
          .values({
            ...body,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()) ?? []
      );
    },
    {
      body: habitSchema,
    },
  )
  .patch(
    "/entry",
    async ({ db, user }) => {
      const res = await db.update(habitEntries);
    },
    {
      // body: t.Partial(habitEntrySchema),
    },
  )
  .get("/all", async ({ db, user }) => {
    const results = await db
      .select({
        habit: habits,
        entries: sql<
          (typeof habitEntries.$inferSelect)[]
        >`json_agg(habit_entries)`,
        streaks: sql<(typeof streaks.$inferSelect)[]>`json_agg(streaks)`,
      })
      .from(habits)
      .leftJoin(habitEntries, eq(habitEntries.habitId, habits.id))
      .leftJoin(streaks, eq(streaks.habitId, habits.id))
      .where(eq(habits.userId, user.id))
      .groupBy(habits.id)
      .orderBy(desc(habits.createdAt))
      .limit(10);

    return results.map((row) => ({
      ...row.habit,
      entries: row.entries?.filter(Boolean) || [],
      streaks: row.streaks?.filter(Boolean) || [],
    }));
  })
  .get("", async ({ db, user }) => {
    return await db
      .select()
      .from(habits)
      .where(eq(habits.userId, user.id))
      .orderBy(asc(habits.createdAt))

      .limit(10);
  });
