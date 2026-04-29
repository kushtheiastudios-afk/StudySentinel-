import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AchievementsResponse, AiInsights, CreateGoalBody, CreateSessionBody, CreateTaskBody, DailyStat, DashboardSummary, FocusSession, ForecastDay, Goal, HealthStatus, HeatmapCell, ListSessionsParams, ListTasksParams, StreakInfo, SubjectTotal, Task, UpdateGoalBody, UpdateTaskBody, UpdateUserBody, User } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get current user profile
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<User>;
export declare const getGetMeQueryKey: () => readonly ["/api/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<unknown>;
/**
 * @summary Get current user profile
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update user profile
 */
export declare const getUpdateMeUrl: () => string;
export declare const updateMe: (updateUserBody: UpdateUserBody, options?: RequestInit) => Promise<User>;
export declare const getUpdateMeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
    data: BodyType<UpdateUserBody>;
}, TContext>;
export type UpdateMeMutationResult = NonNullable<Awaited<ReturnType<typeof updateMe>>>;
export type UpdateMeMutationBody = BodyType<UpdateUserBody>;
export type UpdateMeMutationError = ErrorType<unknown>;
/**
 * @summary Update user profile
 */
export declare const useUpdateMe: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMe>>, TError, {
    data: BodyType<UpdateUserBody>;
}, TContext>;
/**
 * @summary List all tasks
 */
export declare const getListTasksUrl: (params?: ListTasksParams) => string;
export declare const listTasks: (params?: ListTasksParams, options?: RequestInit) => Promise<Task[]>;
export declare const getListTasksQueryKey: (params?: ListTasksParams) => readonly ["/api/tasks", ...ListTasksParams[]];
export declare const getListTasksQueryOptions: <TData = Awaited<ReturnType<typeof listTasks>>, TError = ErrorType<unknown>>(params?: ListTasksParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTasks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTasks>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTasksQueryResult = NonNullable<Awaited<ReturnType<typeof listTasks>>>;
export type ListTasksQueryError = ErrorType<unknown>;
/**
 * @summary List all tasks
 */
export declare function useListTasks<TData = Awaited<ReturnType<typeof listTasks>>, TError = ErrorType<unknown>>(params?: ListTasksParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTasks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a task
 */
export declare const getCreateTaskUrl: () => string;
export declare const createTask: (createTaskBody: CreateTaskBody, options?: RequestInit) => Promise<Task>;
export declare const getCreateTaskMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError, {
        data: BodyType<CreateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError, {
    data: BodyType<CreateTaskBody>;
}, TContext>;
export type CreateTaskMutationResult = NonNullable<Awaited<ReturnType<typeof createTask>>>;
export type CreateTaskMutationBody = BodyType<CreateTaskBody>;
export type CreateTaskMutationError = ErrorType<unknown>;
/**
 * @summary Create a task
 */
export declare const useCreateTask: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError, {
        data: BodyType<CreateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTask>>, TError, {
    data: BodyType<CreateTaskBody>;
}, TContext>;
/**
 * @summary Update a task
 */
export declare const getUpdateTaskUrl: (id: number) => string;
export declare const updateTask: (id: number, updateTaskBody: UpdateTaskBody, options?: RequestInit) => Promise<Task>;
export declare const getUpdateTaskMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError, {
        id: number;
        data: BodyType<UpdateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError, {
    id: number;
    data: BodyType<UpdateTaskBody>;
}, TContext>;
export type UpdateTaskMutationResult = NonNullable<Awaited<ReturnType<typeof updateTask>>>;
export type UpdateTaskMutationBody = BodyType<UpdateTaskBody>;
export type UpdateTaskMutationError = ErrorType<unknown>;
/**
 * @summary Update a task
 */
export declare const useUpdateTask: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError, {
        id: number;
        data: BodyType<UpdateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTask>>, TError, {
    id: number;
    data: BodyType<UpdateTaskBody>;
}, TContext>;
/**
 * @summary Delete a task
 */
export declare const getDeleteTaskUrl: (id: number) => string;
export declare const deleteTask: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteTaskMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError, {
    id: number;
}, TContext>;
export type DeleteTaskMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTask>>>;
export type DeleteTaskMutationError = ErrorType<unknown>;
/**
 * @summary Delete a task
 */
export declare const useDeleteTask: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteTask>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List focus sessions
 */
export declare const getListSessionsUrl: (params?: ListSessionsParams) => string;
export declare const listSessions: (params?: ListSessionsParams, options?: RequestInit) => Promise<FocusSession[]>;
export declare const getListSessionsQueryKey: (params?: ListSessionsParams) => readonly ["/api/sessions", ...ListSessionsParams[]];
export declare const getListSessionsQueryOptions: <TData = Awaited<ReturnType<typeof listSessions>>, TError = ErrorType<unknown>>(params?: ListSessionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSessions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSessions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSessionsQueryResult = NonNullable<Awaited<ReturnType<typeof listSessions>>>;
export type ListSessionsQueryError = ErrorType<unknown>;
/**
 * @summary List focus sessions
 */
export declare function useListSessions<TData = Awaited<ReturnType<typeof listSessions>>, TError = ErrorType<unknown>>(params?: ListSessionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSessions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Log a completed focus session
 */
export declare const getCreateSessionUrl: () => string;
export declare const createSession: (createSessionBody: CreateSessionBody, options?: RequestInit) => Promise<FocusSession>;
export declare const getCreateSessionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSession>>, TError, {
        data: BodyType<CreateSessionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createSession>>, TError, {
    data: BodyType<CreateSessionBody>;
}, TContext>;
export type CreateSessionMutationResult = NonNullable<Awaited<ReturnType<typeof createSession>>>;
export type CreateSessionMutationBody = BodyType<CreateSessionBody>;
export type CreateSessionMutationError = ErrorType<unknown>;
/**
 * @summary Log a completed focus session
 */
export declare const useCreateSession: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSession>>, TError, {
        data: BodyType<CreateSessionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createSession>>, TError, {
    data: BodyType<CreateSessionBody>;
}, TContext>;
/**
 * @summary List study goals
 */
export declare const getListGoalsUrl: () => string;
export declare const listGoals: (options?: RequestInit) => Promise<Goal[]>;
export declare const getListGoalsQueryKey: () => readonly ["/api/goals"];
export declare const getListGoalsQueryOptions: <TData = Awaited<ReturnType<typeof listGoals>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGoals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGoals>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGoalsQueryResult = NonNullable<Awaited<ReturnType<typeof listGoals>>>;
export type ListGoalsQueryError = ErrorType<unknown>;
/**
 * @summary List study goals
 */
export declare function useListGoals<TData = Awaited<ReturnType<typeof listGoals>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGoals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a goal
 */
export declare const getCreateGoalUrl: () => string;
export declare const createGoal: (createGoalBody: CreateGoalBody, options?: RequestInit) => Promise<Goal>;
export declare const getCreateGoalMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGoal>>, TError, {
        data: BodyType<CreateGoalBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGoal>>, TError, {
    data: BodyType<CreateGoalBody>;
}, TContext>;
export type CreateGoalMutationResult = NonNullable<Awaited<ReturnType<typeof createGoal>>>;
export type CreateGoalMutationBody = BodyType<CreateGoalBody>;
export type CreateGoalMutationError = ErrorType<unknown>;
/**
 * @summary Create a goal
 */
export declare const useCreateGoal: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGoal>>, TError, {
        data: BodyType<CreateGoalBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGoal>>, TError, {
    data: BodyType<CreateGoalBody>;
}, TContext>;
/**
 * @summary Update goal progress
 */
export declare const getUpdateGoalUrl: (id: number) => string;
export declare const updateGoal: (id: number, updateGoalBody: UpdateGoalBody, options?: RequestInit) => Promise<Goal>;
export declare const getUpdateGoalMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGoal>>, TError, {
        id: number;
        data: BodyType<UpdateGoalBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateGoal>>, TError, {
    id: number;
    data: BodyType<UpdateGoalBody>;
}, TContext>;
export type UpdateGoalMutationResult = NonNullable<Awaited<ReturnType<typeof updateGoal>>>;
export type UpdateGoalMutationBody = BodyType<UpdateGoalBody>;
export type UpdateGoalMutationError = ErrorType<unknown>;
/**
 * @summary Update goal progress
 */
export declare const useUpdateGoal: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGoal>>, TError, {
        id: number;
        data: BodyType<UpdateGoalBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateGoal>>, TError, {
    id: number;
    data: BodyType<UpdateGoalBody>;
}, TContext>;
/**
 * @summary Delete a goal
 */
export declare const getDeleteGoalUrl: (id: number) => string;
export declare const deleteGoal: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteGoalMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGoal>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGoal>>, TError, {
    id: number;
}, TContext>;
export type DeleteGoalMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGoal>>>;
export type DeleteGoalMutationError = ErrorType<unknown>;
/**
 * @summary Delete a goal
 */
export declare const useDeleteGoal: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGoal>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGoal>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get today's productivity summary
 */
export declare const getGetDashboardSummaryUrl: () => string;
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get today's productivity summary
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get last 7 days of focus minutes & productivity scores
 */
export declare const getGetWeeklyAnalyticsUrl: () => string;
export declare const getWeeklyAnalytics: (options?: RequestInit) => Promise<DailyStat[]>;
export declare const getGetWeeklyAnalyticsQueryKey: () => readonly ["/api/dashboard/weekly"];
export declare const getGetWeeklyAnalyticsQueryOptions: <TData = Awaited<ReturnType<typeof getWeeklyAnalytics>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWeeklyAnalytics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWeeklyAnalytics>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWeeklyAnalyticsQueryResult = NonNullable<Awaited<ReturnType<typeof getWeeklyAnalytics>>>;
export type GetWeeklyAnalyticsQueryError = ErrorType<unknown>;
/**
 * @summary Get last 7 days of focus minutes & productivity scores
 */
export declare function useGetWeeklyAnalytics<TData = Awaited<ReturnType<typeof getWeeklyAnalytics>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWeeklyAnalytics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get focus minutes by hour-of-day x day-of-week (last 28 days)
 */
export declare const getGetProductivityHeatmapUrl: () => string;
export declare const getProductivityHeatmap: (options?: RequestInit) => Promise<HeatmapCell[]>;
export declare const getGetProductivityHeatmapQueryKey: () => readonly ["/api/dashboard/heatmap"];
export declare const getGetProductivityHeatmapQueryOptions: <TData = Awaited<ReturnType<typeof getProductivityHeatmap>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProductivityHeatmap>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProductivityHeatmap>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProductivityHeatmapQueryResult = NonNullable<Awaited<ReturnType<typeof getProductivityHeatmap>>>;
export type GetProductivityHeatmapQueryError = ErrorType<unknown>;
/**
 * @summary Get focus minutes by hour-of-day x day-of-week (last 28 days)
 */
export declare function useGetProductivityHeatmap<TData = Awaited<ReturnType<typeof getProductivityHeatmap>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProductivityHeatmap>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Total minutes per subject (last 30 days)
 */
export declare const getGetSubjectBreakdownUrl: () => string;
export declare const getSubjectBreakdown: (options?: RequestInit) => Promise<SubjectTotal[]>;
export declare const getGetSubjectBreakdownQueryKey: () => readonly ["/api/dashboard/subjects"];
export declare const getGetSubjectBreakdownQueryOptions: <TData = Awaited<ReturnType<typeof getSubjectBreakdown>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSubjectBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSubjectBreakdown>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSubjectBreakdownQueryResult = NonNullable<Awaited<ReturnType<typeof getSubjectBreakdown>>>;
export type GetSubjectBreakdownQueryError = ErrorType<unknown>;
/**
 * @summary Total minutes per subject (last 30 days)
 */
export declare function useGetSubjectBreakdown<TData = Awaited<ReturnType<typeof getSubjectBreakdown>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSubjectBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Current and best study streaks
 */
export declare const getGetStreakUrl: () => string;
export declare const getStreak: (options?: RequestInit) => Promise<StreakInfo>;
export declare const getGetStreakQueryKey: () => readonly ["/api/dashboard/streak"];
export declare const getGetStreakQueryOptions: <TData = Awaited<ReturnType<typeof getStreak>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStreak>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStreak>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStreakQueryResult = NonNullable<Awaited<ReturnType<typeof getStreak>>>;
export type GetStreakQueryError = ErrorType<unknown>;
/**
 * @summary Current and best study streaks
 */
export declare function useGetStreak<TData = Awaited<ReturnType<typeof getStreak>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStreak>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary AI-generated insights and recommendations
 */
export declare const getGetAiInsightsUrl: () => string;
export declare const getAiInsights: (options?: RequestInit) => Promise<AiInsights>;
export declare const getGetAiInsightsQueryKey: () => readonly ["/api/insights"];
export declare const getGetAiInsightsQueryOptions: <TData = Awaited<ReturnType<typeof getAiInsights>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAiInsights>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAiInsights>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAiInsightsQueryResult = NonNullable<Awaited<ReturnType<typeof getAiInsights>>>;
export type GetAiInsightsQueryError = ErrorType<unknown>;
/**
 * @summary AI-generated insights and recommendations
 */
export declare function useGetAiInsights<TData = Awaited<ReturnType<typeof getAiInsights>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAiInsights>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Predicted productivity for next 7 days
 */
export declare const getGetWeeklyForecastUrl: () => string;
export declare const getWeeklyForecast: (options?: RequestInit) => Promise<ForecastDay[]>;
export declare const getGetWeeklyForecastQueryKey: () => readonly ["/api/insights/forecast"];
export declare const getGetWeeklyForecastQueryOptions: <TData = Awaited<ReturnType<typeof getWeeklyForecast>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWeeklyForecast>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWeeklyForecast>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWeeklyForecastQueryResult = NonNullable<Awaited<ReturnType<typeof getWeeklyForecast>>>;
export type GetWeeklyForecastQueryError = ErrorType<unknown>;
/**
 * @summary Predicted productivity for next 7 days
 */
export declare function useGetWeeklyForecast<TData = Awaited<ReturnType<typeof getWeeklyForecast>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWeeklyForecast>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary All available achievements with unlocked status
 */
export declare const getListAchievementsUrl: () => string;
export declare const listAchievements: (options?: RequestInit) => Promise<AchievementsResponse>;
export declare const getListAchievementsQueryKey: () => readonly ["/api/achievements"];
export declare const getListAchievementsQueryOptions: <TData = Awaited<ReturnType<typeof listAchievements>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAchievements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAchievements>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAchievementsQueryResult = NonNullable<Awaited<ReturnType<typeof listAchievements>>>;
export type ListAchievementsQueryError = ErrorType<unknown>;
/**
 * @summary All available achievements with unlocked status
 */
export declare function useListAchievements<TData = Awaited<ReturnType<typeof listAchievements>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAchievements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map