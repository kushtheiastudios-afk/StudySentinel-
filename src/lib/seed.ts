import { db } from "@workspace/db";
import {
  usersTable,
  tasksTable,
  focusSessionsTable,
  goalsTable,
} from "@workspace/db";
import { logger } from "./logger";

export async function ensureSeed(): Promise<void> {
  const existing = await db.select().from(usersTable);
  if (existing.length > 0) return;

  logger.info("Seeding initial data");

  await db.insert(usersTable).values({
    id: 1,
    name: "Alex Rivera",
    email: "alex@focusflow.app",
    avatarUrl: null,
    role: "college",
    dailyGoalMinutes: 240,
    theme: "dark",
    xp: 1280,
    level: 4,
  });

  const subjects = ["Mathematics", "Physics", "Computer Science", "History", "English"];

  await db.insert(tasksTable).values([
    {
      title: "Linear algebra problem set 4",
      description: "Eigenvectors and diagonalization, problems 1-12",
      subject: "Mathematics",
      priority: "high",
      status: "pending",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      estimatedMinutes: 90,
    },
    {
      title: "Read chapter 7 — Quantum mechanics intro",
      subject: "Physics",
      priority: "medium",
      status: "in_progress",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      estimatedMinutes: 60,
    },
    {
      title: "Build CRUD API for assignment",
      subject: "Computer Science",
      priority: "high",
      status: "pending",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      estimatedMinutes: 120,
    },
    {
      title: "Essay outline — Industrial revolution",
      subject: "History",
      priority: "low",
      status: "pending",
      estimatedMinutes: 45,
    },
    {
      title: "Vocabulary review",
      subject: "English",
      priority: "low",
      status: "completed",
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      estimatedMinutes: 20,
    },
  ]);

  await db.insert(goalsTable).values([
    {
      title: "Master calculus before midterms",
      subject: "Mathematics",
      targetMinutes: 600,
      completedMinutes: 240,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      status: "active",
    },
    {
      title: "Finish Physics textbook",
      subject: "Physics",
      targetMinutes: 480,
      completedMinutes: 165,
      status: "active",
    },
    {
      title: "Build 3 portfolio projects",
      subject: "Computer Science",
      targetMinutes: 900,
      completedMinutes: 320,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      status: "active",
    },
  ]);

  // Generate 28 days of focus sessions to power analytics
  const sessions: Array<typeof focusSessionsTable.$inferInsert> = [];
  const now = Date.now();
  for (let dayAgo = 0; dayAgo < 28; dayAgo++) {
    // Skip a few days to create realistic gaps
    if (dayAgo === 6 || dayAgo === 17) continue;
    const sessionsThatDay = 1 + Math.floor(Math.random() * 4);
    for (let s = 0; s < sessionsThatDay; s++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)]!;
      // Bias toward 9-12 and 19-22 for "real" patterns
      const hourPool = [9, 10, 11, 14, 15, 19, 20, 21];
      const hour = hourPool[Math.floor(Math.random() * hourPool.length)]!;
      const startedAt = new Date(now - dayAgo * 24 * 60 * 60 * 1000);
      startedAt.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
      const sessionTypes = ["pomodoro", "deep_work", "short"] as const;
      const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)]!;
      const duration =
        sessionType === "pomodoro" ? 25 : sessionType === "deep_work" ? 50 : 15;
      const distractions = Math.floor(Math.random() * 4);
      const focusScore = Math.max(40, Math.min(100, 100 - distractions * 7 - Math.floor(Math.random() * 10)));
      const endedAt = new Date(startedAt.getTime() + duration * 60 * 1000);
      sessions.push({
        subject,
        durationMinutes: duration,
        focusScore,
        sessionType,
        distractions,
        startedAt,
        endedAt,
      });
    }
  }
  if (sessions.length > 0) {
    await db.insert(focusSessionsTable).values(sessions);
  }

  logger.info({ sessions: sessions.length }, "Seed complete");
}
