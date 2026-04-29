import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const tasksTable = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().default(1),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("pending"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  estimatedMinutes: integer("estimated_minutes"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Task = typeof tasksTable.$inferSelect;
