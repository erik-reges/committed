import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { decimal } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

// Existing tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// New tables for habit tracker
export const habits = pgTable("habits", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  description: text("description"),
  targetFrequency: text("targetFrequency").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const habitEntries = pgTable("habit_entries", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  habitId: text("habitId")
    .notNull()
    .references(() => habits.id),
  date: date("date").notNull(),
  status: text("status").notNull(),
  done: boolean("done").notNull().default(true),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const streaks = pgTable("streaks", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  habitId: text("habitId")
    .notNull()
    .references(() => habits.id),
  startDate: date("startDate").notNull(),
  endDate: date("endDate"),
  length: integer("length").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const progressGrid = pgTable("progress_grid", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  habitId: text("habitId")
    .notNull()
    .references(() => habits.id),
  date: date("date").notNull(),
  completionStatus: boolean("completionStatus").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const analytics = pgTable("analytics", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  habitId: text("habitId")
    .notNull()
    .references(() => habits.id),
  totalCompleted: integer("totalCompleted").notNull(),
  totalSkipped: integer("totalSkipped").notNull(),
  completionRate: decimal("completionRate").notNull(),
  longestStreak: integer("longestStreak").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});
