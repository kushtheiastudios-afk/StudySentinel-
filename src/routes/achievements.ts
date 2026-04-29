import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, achievementUnlocksTable } from "@workspace/db";
import { ListAchievementsResponse } from "@workspace/api-zod";
import { getUserId } from "../lib/getUserId";
import {
  loadAllSessions,
  loadTasks,
  computeStreak,
} from "../lib/analytics";
import { ACHIEVEMENTS } from "../lib/achievementsCatalog";

const router: IRouter = Router();

router.get("/achievements", async (_req, res): Promise<void> => {
  const userId = getUserId();
  const sessions = await loadAllSessions(userId);
  const tasks = await loadTasks(userId);
  const { currentStreak, bestStreak } = computeStreak(sessions);

  const stats = {
    totalSessions: sessions.length,
    totalMinutes: sessions.reduce((a, s) => a + s.durationMinutes, 0),
    bestStreak,
    currentStreak,
    highFocusSessions: sessions.filter((s) => s.focusScore >= 90).length,
    uniqueSubjects: new Set(sessions.map((s) => s.subject)).size,
    tasksCompleted: tasks.filter((t) => t.status === "completed").length,
    deepWorkSessions: sessions.filter((s) => s.sessionType === "deep_work").length,
    earlyBirdSessions: sessions.filter((s) => s.startedAt.getHours() < 9).length,
    nightOwlSessions: sessions.filter((s) => s.startedAt.getHours() >= 21).length,
  };

  const existingUnlocks = await db
    .select()
    .from(achievementUnlocksTable)
    .where(eq(achievementUnlocksTable.userId, userId));
  const unlockedMap = new Map(existingUnlocks.map((u) => [u.achievementId, u.unlockedAt]));

  // Persist new unlocks
  const newlyUnlocked: string[] = [];
  for (const a of ACHIEVEMENTS) {
    const progress = a.progress(stats);
    if (progress >= 100 && !unlockedMap.has(a.id)) {
      newlyUnlocked.push(a.id);
    }
  }
  if (newlyUnlocked.length > 0) {
    await db
      .insert(achievementUnlocksTable)
      .values(newlyUnlocked.map((achievementId) => ({ userId, achievementId })))
      .onConflictDoNothing();
    const refreshed = await db
      .select()
      .from(achievementUnlocksTable)
      .where(eq(achievementUnlocksTable.userId, userId));
    for (const u of refreshed) {
      if (!unlockedMap.has(u.achievementId)) unlockedMap.set(u.achievementId, u.unlockedAt);
    }
  }

  const items = ACHIEVEMENTS.map((a) => {
    const progress = a.progress(stats);
    const unlocked = progress >= 100;
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon,
      xpReward: a.xpReward,
      unlocked,
      unlockedAt: unlockedMap.get(a.id) ?? null,
      progress: Math.min(100, progress),
    };
  });

  const totalUnlocked = items.filter((i) => i.unlocked).length;
  const totalXp = items.filter((i) => i.unlocked).reduce((a, i) => a + i.xpReward, 0);

  res.json(
    ListAchievementsResponse.parse({
      totalUnlocked,
      totalAvailable: items.length,
      totalXp,
      items,
    }),
  );
});

export default router;
