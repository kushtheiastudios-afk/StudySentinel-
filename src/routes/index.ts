import { Router, type IRouter } from "express";
import healthRouter from "./health";
import userRouter from "./user";
import tasksRouter from "./tasks";
import sessionsRouter from "./sessions";
import goalsRouter from "./goals";
import dashboardRouter from "./dashboard";
import insightsRouter from "./insights";
import achievementsRouter from "./achievements";

const router: IRouter = Router();

router.use(healthRouter);
router.use(userRouter);
router.use(tasksRouter);
router.use(sessionsRouter);
router.use(goalsRouter);
router.use(dashboardRouter);
router.use(insightsRouter);
router.use(achievementsRouter);

export default router;
