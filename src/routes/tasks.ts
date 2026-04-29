import { Router, type IRouter } from "express";
import { and, eq, desc } from "drizzle-orm";
import { db, tasksTable } from "@workspace/db";
import {
  ListTasksQueryParams,
  ListTasksResponse,
  CreateTaskBody,
  UpdateTaskParams,
  UpdateTaskBody,
  UpdateTaskResponse,
  DeleteTaskParams,
} from "@workspace/api-zod";
import { getUserId } from "../lib/getUserId";

const router: IRouter = Router();

function serialize(t: typeof tasksTable.$inferSelect) {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    subject: t.subject,
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate,
    estimatedMinutes: t.estimatedMinutes,
    completedAt: t.completedAt,
    createdAt: t.createdAt,
  };
}

router.get("/tasks", async (req, res): Promise<void> => {
  const params = ListTasksQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const userId = getUserId();
  const filters = [eq(tasksTable.userId, userId)];
  if (params.data.status) filters.push(eq(tasksTable.status, params.data.status));
  if (params.data.subject) filters.push(eq(tasksTable.subject, params.data.subject));

  const rows = await db
    .select()
    .from(tasksTable)
    .where(and(...filters))
    .orderBy(desc(tasksTable.createdAt));

  res.json(ListTasksResponse.parse(rows.map(serialize)));
});

router.post("/tasks", async (req, res): Promise<void> => {
  const parsed = CreateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = getUserId();
  const [row] = await db
    .insert(tasksTable)
    .values({
      userId,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      subject: parsed.data.subject,
      priority: parsed.data.priority,
      status: "pending",
      dueDate: parsed.data.dueDate ?? null,
      estimatedMinutes: parsed.data.estimatedMinutes ?? null,
    })
    .returning();

  res.status(201).json(serialize(row!));
});

router.patch("/tasks/:id", async (req, res): Promise<void> => {
  const params = UpdateTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Partial<typeof tasksTable.$inferInsert> = { ...parsed.data };
  if (parsed.data.status === "completed") {
    updates.completedAt = new Date();
  } else if (parsed.data.status && parsed.data.status !== "completed") {
    updates.completedAt = null;
  }

  const [row] = await db
    .update(tasksTable)
    .set(updates)
    .where(eq(tasksTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json(UpdateTaskResponse.parse(serialize(row)));
});

router.delete("/tasks/:id", async (req, res): Promise<void> => {
  const params = DeleteTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .delete(tasksTable)
    .where(eq(tasksTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
