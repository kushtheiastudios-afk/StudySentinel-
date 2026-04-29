import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, focusSessionsTable, usersTable, goalsTable } from "@workspace/db";
import {
  ListSessionsQueryParams,
  ListSessionsResponse,
  CreateSessionBody,
} from "@workspace/api-zod";
import { getUserId } from "../lib/getUserId";

const router: IRouter = Router();

function serialize(s: typeof focusSessionsTable.$inferSelect) {
  return {
    id: s.id,
    subject: s.subject,
    durationMinutes: s.durationMinutes,
    focusScore: s.focusScore,
    sessionType: s.sessionType,
    distractions: s.distractions,
    notes: s.notes,
    startedAt: s.startedAt,
    endedAt: s.endedAt,
  };
}

function levelForXp(xp: number): { level: number; xpToNextLevel: number } {
  // Each level requires 250 * level xp
  let level = 1;
  let remaining = xp;
  while (remaining >= 250 * level) {
    remaining -= 250 * level;
    level += 1;
  }
  const xpToNextLevel = 250 * level - remaining;
  return { level, xpToNextLevel };
}

export { levelForXp };

router.get("/sessions", async (req, res): Promise<void> => {
  const params = ListSessionsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const limit = params.data.limit ?? 50;
  const userId = getUserId();
  const rows = await db
    .select()
    .from(focusSessionsTable)
    .where(eq(focusSessionsTable.userId, userId))
    .orderBy(desc(focusSessionsTable.startedAt))
    .limit(limit);

  res.json(ListSessionsResponse.parse(rows.map(serialize)));
});

router.post("/sessions", async (req, res): Promise<void> => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = getUserId();
  const [row] = await db
    .insert(focusSessionsTable)
    .values({
      userId,
      subject: parsed.data.subject,
      durationMinutes: parsed.data.durationMinutes,
      focusScore: parsed.data.focusScore,
      sessionType: parsed.data.sessionType,
      distractions: parsed.data.distractions,
      notes: parsed.data.notes ?? null,
      startedAt: parsed.data.startedAt,
      endedAt: parsed.data.endedAt,
    })
    .returning();

  // Award XP: 1 xp per minute + bonus for high focus
  const xpEarned =
    parsed.data.durationMinutes + (parsed.data.focusScore >= 90 ? 25 : parsed.data.focusScore >= 75 ? 10 : 0);

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (user) {
    const newXp = user.xp + xpEarned;
    const { level } = levelForXp(newXp);
    await db
      .update(usersTable)
      .set({ xp: newXp, level })
      .where(eq(usersTable.id, userId));
  }

  // Roll session minutes into matching active goal(s) for this subject
  const matching = await db
    .select()
    .from(goalsTable)
    .where(eq(goalsTable.userId, userId));
  for (const g of matching) {
    if (g.status === "active" && g.subject === parsed.data.subject) {
      await db
        .update(goalsTable)
        .set({
          completedMinutes: g.completedMinutes + parsed.data.durationMinutes,
          status:
            g.completedMinutes + parsed.data.durationMinutes >= g.targetMinutes
              ? "completed"
              : "active",
        })
        .where(eq(goalsTable.id, g.id));
    }
  }

  res.status(201).json(serialize(row!));
});

export default router;
