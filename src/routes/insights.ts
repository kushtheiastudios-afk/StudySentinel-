import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  GetAiInsightsResponse,
  GetWeeklyForecastResponse,
} from "@workspace/api-zod";
import { getUserId } from "../lib/getUserId";
import {
  loadAllSessions,
  loadSessions,
  loadTasks,
  bucketByDay,
} from "../lib/analytics";

const router: IRouter = Router();

function hourLabel(h: number): string {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

router.get("/insights", async (_req, res): Promise<void> => {
  const userId = getUserId();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  const dailyGoal = user?.dailyGoalMinutes ?? 180;

  const sessions28 = await loadSessions(userId, 28);
  const sessions14 = await loadSessions(userId, 14);
  const tasks = await loadTasks(userId);

  // Best study hour: hour with highest sum of (minutes * focusScore/100)
  const hourScores = new Array(24).fill(0);
  for (const s of sessions28) {
    const h = s.startedAt.getHours();
    hourScores[h] += s.durationMinutes * (s.focusScore / 100);
  }
  let bestHour: number | null = null;
  let bestVal = 0;
  for (let h = 0; h < 24; h++) {
    if (hourScores[h] > bestVal) {
      bestVal = hourScores[h];
      bestHour = h;
    }
  }

  // Burnout: high recent volume with declining focus = high risk
  const last7 = sessions14.filter(
    (s) => s.startedAt.getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000,
  );
  const prev7 = sessions14.filter(
    (s) => s.startedAt.getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000,
  );
  const last7Min = last7.reduce((a, s) => a + s.durationMinutes, 0);
  const prev7Min = prev7.reduce((a, s) => a + s.durationMinutes, 0);
  const last7Focus =
    last7.length === 0 ? 0 : last7.reduce((a, s) => a + s.focusScore, 0) / last7.length;
  const prev7Focus =
    prev7.length === 0 ? 0 : prev7.reduce((a, s) => a + s.focusScore, 0) / prev7.length;

  let burnoutScore = 0;
  if (last7Min > dailyGoal * 7 * 1.2) burnoutScore += 30;
  if (last7Min > dailyGoal * 7 * 1.5) burnoutScore += 25;
  if (prev7Focus > 0 && last7Focus < prev7Focus - 8) burnoutScore += 25;
  if (last7.length >= 4 && last7Focus < 60) burnoutScore += 20;
  burnoutScore = Math.min(100, burnoutScore);
  const burnoutRisk = burnoutScore >= 60 ? "high" : burnoutScore >= 30 ? "medium" : "low";

  // Weekly trend
  const weekly14 = bucketByDay(sessions14, tasks, 14, dailyGoal);
  const lastWeek = weekly14.slice(7);
  const prevWeek = weekly14.slice(0, 7);
  const lastAvg = lastWeek.reduce((a, d) => a + d.productivityScore, 0) / 7;
  const prevAvg = prevWeek.reduce((a, d) => a + d.productivityScore, 0) / 7;
  const diff = lastAvg - prevAvg;
  const weeklyTrend = diff > 4 ? "up" : diff < -4 ? "down" : "flat";
  const weeklyTrendPct = prevAvg > 0 ? Math.round((diff / prevAvg) * 100) : 0;

  // Recommended focus block & break
  let recommendedFocusBlockMinutes = 25;
  if (last7Focus >= 85) recommendedFocusBlockMinutes = 50;
  else if (last7Focus >= 70) recommendedFocusBlockMinutes = 35;
  const recommendedBreakMinutes = Math.max(5, Math.round(recommendedFocusBlockMinutes / 5));

  // Motivation
  let motivationMessage = "Every focused minute compounds. Start small today.";
  if (weeklyTrend === "up")
    motivationMessage = "You're trending upward. Ride the momentum and protect your focus blocks.";
  else if (weeklyTrend === "down")
    motivationMessage =
      "Last week dipped — that's information, not failure. One short session restarts the streak.";
  else if (lastAvg > 70)
    motivationMessage = "You're holding steady at a strong cadence. Stay consistent.";

  // Insight cards
  const insights: Array<{
    id: string;
    type: string;
    title: string;
    body: string;
    priority: number;
  }> = [];

  if (bestHour !== null) {
    insights.push({
      id: "best-hour",
      type: "tip",
      title: `Your peak focus hour is ${hourLabel(bestHour)}`,
      body: `Based on the last 28 days, you do your sharpest work around ${hourLabel(
        bestHour,
      )}. Block this hour for your hardest subject.`,
      priority: 1,
    });
  }

  if (burnoutRisk === "high") {
    insights.push({
      id: "burnout",
      type: "warning",
      title: "Burnout risk is elevated",
      body: "You're studying significantly above your usual cadence and focus is starting to slip. Schedule a recovery day this week.",
      priority: 0,
    });
  } else if (burnoutRisk === "medium") {
    insights.push({
      id: "burnout-mid",
      type: "warning",
      title: "Pace is climbing — keep an eye on it",
      body: "Your study volume has spiked. Add a deliberate break between long sessions to keep focus quality high.",
      priority: 2,
    });
  }

  if (weeklyTrend === "up") {
    insights.push({
      id: "trend-up",
      type: "praise",
      title: `Productivity up ${Math.abs(weeklyTrendPct)}% week over week`,
      body: "Your routines are compounding. Don't change what's working — protect your study windows.",
      priority: 3,
    });
  } else if (weeklyTrend === "down") {
    insights.push({
      id: "trend-down",
      type: "recommendation",
      title: "Energy dipped — rebuild with one easy win",
      body: "Try a single 25 minute pomodoro on your easiest subject. Momentum returns faster than you expect.",
      priority: 2,
    });
  }

  // Subject suggestion: subject with most minutes but lowest avg focus = needs strategy change
  const subjectMap = new Map<string, { minutes: number; focusSum: number; n: number }>();
  for (const s of sessions28) {
    const cur = subjectMap.get(s.subject) ?? { minutes: 0, focusSum: 0, n: 0 };
    cur.minutes += s.durationMinutes;
    cur.focusSum += s.focusScore;
    cur.n += 1;
    subjectMap.set(s.subject, cur);
  }
  let weakest: { subject: string; avg: number; minutes: number } | null = null;
  for (const [subject, v] of subjectMap.entries()) {
    if (v.n < 2) continue;
    const avg = v.focusSum / v.n;
    if (!weakest || avg < weakest.avg) weakest = { subject, avg, minutes: v.minutes };
  }
  if (weakest && weakest.avg < 70) {
    insights.push({
      id: "weak-subject",
      type: "recommendation",
      title: `${weakest.subject} sessions are losing focus`,
      body: `Your average focus on ${weakest.subject} is ${Math.round(
        weakest.avg,
      )}/100. Try shorter blocks or studying it earlier in the day.`,
      priority: 2,
    });
  }

  // Distractions
  const totalDistractions = sessions28.reduce((a, s) => a + s.distractions, 0);
  if (sessions28.length >= 5 && totalDistractions / sessions28.length >= 2) {
    insights.push({
      id: "distractions",
      type: "tip",
      title: "Distractions are creeping in",
      body: "You're averaging 2+ distractions per session. Try silencing notifications and using Focus Mode for the next three sessions.",
      priority: 2,
    });
  }

  // Pending tasks
  const pending = tasks.filter((t) => t.status !== "completed");
  if (pending.length >= 5) {
    insights.push({
      id: "task-pile",
      type: "recommendation",
      title: `${pending.length} tasks open — chip away early`,
      body: "Pick the smallest pending task and finish it before lunch. A clean win unlocks momentum.",
      priority: 3,
    });
  }

  insights.sort((a, b) => a.priority - b.priority);

  res.json(
    GetAiInsightsResponse.parse({
      bestStudyHour: bestHour,
      bestStudyHourLabel: bestHour !== null ? hourLabel(bestHour) : null,
      burnoutRisk,
      burnoutScore,
      motivationMessage,
      weeklyTrend,
      weeklyTrendPct,
      insights,
      recommendedBreakMinutes,
      recommendedFocusBlockMinutes,
    }),
  );
});

router.get("/insights/forecast", async (_req, res): Promise<void> => {
  const userId = getUserId();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  const dailyGoal = user?.dailyGoalMinutes ?? 180;

  const sessions = await loadSessions(userId, 28);
  const tasks = await loadTasks(userId);
  const days = bucketByDay(sessions, tasks, 28, dailyGoal);

  // Per day-of-week average
  const dowMinutes: number[][] = Array.from({ length: 7 }, () => []);
  const dowScore: number[][] = Array.from({ length: 7 }, () => []);
  for (const d of days) {
    const date = new Date(d.date + "T00:00:00");
    const dow = date.getDay();
    dowMinutes[dow]!.push(d.focusMinutes);
    dowScore[dow]!.push(d.productivityScore);
  }
  function avg(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: Array<{
    date: string;
    predictedFocusMinutes: number;
    predictedProductivityScore: number;
    confidence: number;
  }> = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dow = d.getDay();
    const samples = dowMinutes[dow]!.length;
    const confidence = Math.min(95, 30 + samples * 15);
    out.push({
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`,
      predictedFocusMinutes: Math.round(avg(dowMinutes[dow]!)),
      predictedProductivityScore: Math.round(avg(dowScore[dow]!)),
      confidence,
    });
  }
  res.json(GetWeeklyForecastResponse.parse(out));
});

export default router;
