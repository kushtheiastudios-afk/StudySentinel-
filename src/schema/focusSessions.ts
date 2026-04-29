import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const focusSessionsTable = pgTable("focus_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().default(1),
  subject: text("subject").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  focusScore: integer("focus_score").notNull(),
  sessionType: text("session_type").notNull(),
  distractions: integer("distractions").notNull().default(0),
  notes: text("notes"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }).notNull(),
});

export type FocusSession = typeof focusSessionsTable.$inferSelect;
