# FocusFlow AI

AI-powered productivity & focus management web app for students.

## Stack

- **Frontend** (`artifacts/focusflow`): React + Vite + Tailwind, dark/light themes, glassmorphism, framer-motion, recharts, wouter, react-query (via generated `@workspace/api-client-react` hooks).
- **Backend** (`artifacts/api-server`): Express + Pino logging, Drizzle ORM on Postgres.
- **Contract**: OpenAPI spec at `lib/api-spec/openapi.yaml`. Codegen produces React Query hooks (`@workspace/api-client-react`) and Zod schemas (`@workspace/api-zod`).
- **DB schema**: `lib/db/src/schema/` — `users`, `tasks`, `focus_sessions`, `goals`, `achievement_unlocks`.

## Routes (api-server)

`/api/me` (GET/PATCH), `/api/tasks` (CRUD), `/api/sessions` (list/create — XP + goal rollup),
`/api/goals` (CRUD), `/api/dashboard/{summary,weekly,heatmap,subjects,streak}`,
`/api/insights` (+ `/forecast`), `/api/achievements`.

## Pages (focusflow)

Dashboard, Focus (Pomodoro/Deep Work timer), Tasks, Goals, Analytics, Insights, Achievements, Profile, 404.

## Conventions

- Single-user MVP: `getUserId()` returns 1.
- XP per session = `durationMinutes + (focusScore≥90 ? 25 : ≥75 ? 10 : 0)`. Level threshold = `250*level` cumulative.
- Productivity score blends minute ratio (vs daily goal), avg focus, tasks completed.
- Burnout risk uses week-over-week minutes & focus delta.
- Achievements are catalog-driven (`achievementsCatalog.ts`); unlocks persisted in `achievement_unlocks`.
- Seed data (`ensureSeed`) generates 28 days of focus sessions, tasks, and goals on first boot.
- Run codegen after editing OpenAPI: `pnpm --filter @workspace/api-spec run codegen`.
- After lib changes: `pnpm run typecheck:libs` before app typecheck.
