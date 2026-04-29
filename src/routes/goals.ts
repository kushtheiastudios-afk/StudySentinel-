import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, goalsTable } from "@workspace/db";
import {
  ListGoalsResponse,
  CreateGoalBody,
  UpdateGoalParams,
  UpdateGoalBody,
  UpdateGoalResponse,
  DeleteGoalParams,
} from "@workspace/api-zod";
import { getUserId } from "../lib/getUserId";

const router: IRouter = Router();

function serialize(g: typeof goalsTable.$inferSelect) {
  return {
    id: g.id,
    title: g.title,
    subject: g.subject,
    targetMinutes: g.targetMinutes,
    completedMinutes: g.completedMinutes,
    deadline: g.deadline,
    status: g.status,
    createdAt: g.createdAt,
  };
}

router.get("/goals", async (_req, res): Promise<void> => {
  const userId = getUserId();
  const rows = await db
    .select()
    .from(goalsTable)
    .where(eq(goalsTable.userId, userId))
    .orderBy(desc(goalsTable.createdAt));
  res.json(ListGoalsResponse.parse(rows.map(serialize)));
});

router.post("/goals", async (req, res): Promise<void> => {
  const parsed = CreateGoalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = getUserId();
  const [row] = await db
    .insert(goalsTable)
    .values({
      userId,
      title: parsed.data.title,
      subject: parsed.data.subject,
      targetMinutes: parsed.data.targetMinutes,
      deadline: parsed.data.deadline ?? null,
      status: "active",
    })
    .returning();
  res.status(201).json(serialize(row!));
});

router.patch("/goals/:id", async (req, res): Promise<void> => {
  const params = UpdateGoalParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateGoalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .update(goalsTable)
    .set(parsed.data)
    .where(eq(goalsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Goal not found" });
    return;
  }
  res.json(UpdateGoalResponse.parse(serialize(row)));
});

router.delete("/goals/:id", async (req, res): Promise<void> => {
  const params = DeleteGoalParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .delete(goalsTable)
    .where(eq(goalsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Goal not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
