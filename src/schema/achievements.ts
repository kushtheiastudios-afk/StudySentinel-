import { pgTable, serial, integer, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const achievementUnlocksTable = pgTable(
  "achievement_unlocks",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().default(1),
    achievementId: text("achievement_id").notNull(),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("achievement_unlocks_user_ach_uniq").on(t.userId, t.achievementId),
  }),
);

export type AchievementUnlock = typeof achievementUnlocksTable.$inferSelect;
