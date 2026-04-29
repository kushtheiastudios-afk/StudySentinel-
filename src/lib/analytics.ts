import { eq, gte, and, desc } from "drizzle-orm";
import { db, focusSessionsTable, tasksTable, usersTable, goalsTable } from "@workspace/db";

export interface DayBucket {
  date: string;
  focusMinutes: number;
  productivityScore: number;
  sessions: number;
  tasksCompleted: number;
}

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function loadUserContext(userId: number) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  return user;
}

export async function loadSessions(userId: number, sinceDays = 28) {
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);
  return db
    .select()
    .from(focusSessionsTable)
    .where(and(eq(focusSessionsTable.userId, userId), gte(focusSessionsTable.startedAt, since)))
    .orderBy(desc(focusSessionsTable.startedAt));
}

export async function loadAllSessions(userId: number) {
  return db
    .select()
    .from(focusSessionsTable)
    .where(eq(focusSessionsTable.userId, userId))
    .orderBy(desc(focusSessionsTable.startedAt));
}

export async function loadTasks(userId: number) {
  return db.select().from(tasksTable).where(eq(tasksTable.userId, userId));
}

export async function loadGoals(userId: number) {
  return db.select().from(goalsTable).where(eq(goalsTable.userId, userId));
}

/**
 * Compute a "productivity score" 0-100 for a given day's sessions and task completions.
 * Combines focus minutes (capped at goal), avg focus score, and tasks completed.
 */
export function dayProductivityScore(
  focusMinutes: number,
  avgFocus: number,
  tasksCompleted: number,
  dailyGoalMinutes: number,
): number {
  const minuteRatio = Math.min(1, focusMinutes / Math.max(15, dailyGoalMinutes));
  const focusComponent = avgFocus / 100;
  const taskComponent = Math.min(1, tasksCompleted / 5);
  const score = minuteRatio * 0.5 + focusComponent * 0.35 + taskComponent * 0.15;
  return Math.round(score * 100);
}

export function bucketByDay(
  sessions: Array<{ startedAt: Date; durationMinutes: number; focusScore: number }>,
  tasks: Array<{ completedAt: Date | null }>,
  days: number,
  dailyGoalMinutes: number,
): DayBucket[] {
  const out: DayBucket[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = ymd(day);
    const dayStart = day.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;

    const daySessions = sessions.filter(
      (s) => s.startedAt.getTime() >= dayStart && s.startedAt.getTime() < dayEnd,
    );
    const focusMinutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const avgFocus =
      daySessions.length === 0
        ? 0
        : Math.round(
            daySessions.reduce((acc, s) => acc + s.focusScore, 0) / daySessions.length,
          );
    const tasksCompleted = tasks.filter(
      (t) =>
        t.completedAt &&
        t.completedAt.getTime() >= dayStart &&
        t.completedAt.getTime() < dayEnd,
    ).length;

    out.push({
      date: dateStr,
      focusMinutes,
      productivityScore: dayProductivityScore(
        focusMinutes,
        avgFocus,
        tasksCompleted,
        dailyGoalMinutes,
      ),
      sessions: daySessions.length,
      tasksCompleted,
    });
  }
  return out;
}

export function computeStreak(
  sessions: Array<{ startedAt: Date }>,
): { currentStreak: number; bestStreak: number; lastActiveDate: string | null } {
  if (sessions.length === 0) {
    return { currentStreak: 0, bestStreak: 0, lastActiveDate: null };
  }
  const dayKeys = new Set(sessions.map((s) => ymd(s.startedAt)));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Compute current streak (allow today missing — count back from yesterday if needed)
  let current = 0;
  const startOffset = dayKeys.has(ymd(today)) ? 0 : 1;
  for (let i = startOffset; i < 365; i++) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    if (dayKeys.has(ymd(d))) {
      current++;
    } else {
      break;
    }
  }

  // Compute best streak across recorded history (last 365 days window)
  let best = 0;
  let run = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    if (dayKeys.has(ymd(d))) {
      run++;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }

  // Last active date
  let last: string | null = null;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    if (dayKeys.has(ymd(d))) {
      last = ymd(d);
      break;
    }
  }

  return { currentStreak: current, bestStreak: best, lastActiveDate: last };
}
