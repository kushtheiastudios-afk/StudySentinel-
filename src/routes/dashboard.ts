import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetWeeklyAnalyticsResponse,
  GetProductivityHeatmapResponse,
  GetSubjectBreakdownResponse,
  GetStreakResponse,
} from "@workspace/api-zod";
import { getUserId } from "../lib/getUserId";
import {
  loadAllSessions,
  loadSessions,
  loadTasks,
  bucketByDay,
  computeStreak,
  dayProductivityScore,
} from "../lib/analytics";
import { levelForXp } from "./sessions";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const userId = getUserId();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const sessions = await loadAllSessions(userId);
  const tasks = await loadTasks(userId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayStart = today.getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;

  const todaySessions = sessions.filter(
    (s) => s.startedAt.getTime() >= dayStart && s.startedAt.getTime() < dayEnd,
  );
  const focusMinutesToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const avgFocusToday =
    todaySessions.length === 0
      ? 0
      : Math.round(
          todaySessions.reduce((acc, s) => acc + s.focusScore, 0) / todaySessions.length,
        );
  const tasksCompletedToday = tasks.filter(
    (t) =>
      t.completedAt &&
      t.completedAt.getTime() >= dayStart &&
      t.completedAt.getTime() < dayEnd,
  ).length;
  const tasksPendingTotal = tasks.filter((t) => t.status !== "completed").length;

  const productivityScore = dayProductivityScore(
    focusMinutesToday,
    avgFocusToday,
    tasksCompletedToday,
    user.dailyGoalMinutes,
  );

  const goalProgressPct = Math.min(
    100,
    Math.round((focusMinutesToday / Math.max(15, user.dailyGoalMinutes)) * 100),
  );

  const { currentStreak } = computeStreak(sessions);
  const { level, xpToNextLevel } = levelForXp(user.xp);

  res.json(
    GetDashboardSummaryResponse.parse({
      productivityScore,
      focusMinutesToday,
      sessionsToday: todaySessions.length,
      averageFocusScore: avgFocusToday,
      tasksCompletedToday,
      tasksPendingTotal,
      dailyGoalMinutes: user.dailyGoalMinutes,
      goalProgressPct,
      currentStreak,
      xp: user.xp,
      level,
      xpToNextLevel,
    }),
  );
});

router.get("/dashboard/weekly", async (_req, res): Promise<void> => {
  const userId = getUserId();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  const sessions = await loadSessions(userId, 7);
  const tasks = await loadTasks(userId);
  const buckets = bucketByDay(sessions, tasks, 7, user?.dailyGoalMinutes ?? 180);
  res.json(GetWeeklyAnalyticsResponse.parse(buckets));
});

router.get("/dashboard/heatmap", async (_req, res): Promise<void> => {
  const userId = getUserId();
  const sessions = await loadSessions(userId, 28);

  const cells = new Map<string, number>();
  for (const s of sessions) {
    const dow = s.startedAt.getDay(); // 0 = Sun
    const hour = s.startedAt.getHours();
    const key = `${dow}-${hour}`;
    cells.set(key, (cells.get(key) ?? 0) + s.durationMinutes);
  }

  const out: Array<{ dayOfWeek: number; hour: number; minutes: number }> = [];
  for (let dow = 0; dow < 7; dow++) {
    for (let hour = 0; hour < 24; hour++) {
      out.push({
        dayOfWeek: dow,
        hour,
        minutes: cells.get(`${dow}-${hour}`) ?? 0,
      });
    }
  }
  res.json(GetProductivityHeatmapResponse.parse(out));
});

router.get("/dashboard/subjects", async (_req, res): Promise<void> => {
  const userId = getUserId();
  const sessions = await loadSessions(userId, 30);

  const map = new Map<string, { minutes: number; sessions: number; focusSum: number }>();
  for (const s of sessions) {
    const cur = map.get(s.subject) ?? { minutes: 0, sessions: 0, focusSum: 0 };
    cur.minutes += s.durationMinutes;
    cur.sessions += 1;
    cur.focusSum += s.focusScore;
    map.set(s.subject, cur);
  }

  const out = Array.from(map.entries())
    .map(([subject, v]) => ({
      subject,
      minutes: v.minutes,
      sessions: v.sessions,
      averageFocusScore: Math.round(v.focusSum / v.sessions),
    }))
    .sort((a, b) => b.minutes - a.minutes);

  res.json(GetSubjectBreakdownResponse.parse(out));
});

router.get("/dashboard/streak", async (_req, res): Promise<void> => {
  const userId = getUserId();
  const sessions = await loadAllSessions(userId);
  res.json(GetStreakResponse.parse(computeStreak(sessions)));
});

export default router;
