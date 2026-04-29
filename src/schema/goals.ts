import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const goalsTable = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().default(1),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  targetMinutes: integer("target_minutes").notNull(),
  completedMinutes: integer("completed_minutes").notNull().default(0),
  deadline: timestamp("deadline", { withTimezone: true }),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Goal = typeof goalsTable.$inferSelect;
