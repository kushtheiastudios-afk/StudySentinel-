import { useGetDashboardSummary, getGetDashboardSummaryQueryKey, useListTasks, getListTasksQueryKey, useListSessions, getListSessionsQueryKey, useGetStreak, getGetStreakQueryKey } from "@workspace/api-client-react";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { format } from "date-fns";
import { Brain, CheckCircle2, Clock, Flame, Sparkles, Target, Timer, Trophy } from "lucide-react";

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });
  const { data: tasks, isLoading: isLoadingTasks } = useListTasks({ status: "pending" }, { query: { queryKey: getListTasksQueryKey({ status: "pending" }) } });
  const { data: sessions, isLoading: isLoadingSessions } = useListSessions({ limit: 3 }, { query: { queryKey: getListSessionsQueryKey({ limit: 3 }) } });
  const { data: streak } = useGetStreak({ query: { queryKey: getGetStreakQueryKey() } });

  const pendingTasks = tasks || [];
  const recentSessions = sessions || [];

  if (isLoadingSummary) {
    return (
      <div className="p-4 md:p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Here's your productivity overview for today.</p>
        </div>
        <Link href="/focus">
          <Button size="lg" className="shadow-lg shadow-primary/25 gap-2 rounded-full px-6">
            <Timer className="w-5 h-5" />
            Start Focus Session
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Productivity Score"
          value={summary?.productivityScore || 0}
          icon={Brain}
          description="Based on focus and tasks"
        />
        <StatCard
          title="Focus Time Today"
          value={summary?.focusMinutesToday || 0}
          suffix="m"
          icon={Clock}
          description={`Daily goal: ${summary?.dailyGoalMinutes || 0}m`}
        />
        <StatCard
          title="Current Streak"
          value={streak?.currentStreak || 0}
          suffix=" days"
          icon={Flame}
          description={`Best: ${streak?.bestStreak || 0} days`}
        />
        <StatCard
          title="XP Earned"
          value={summary?.xp || 0}
          icon={Trophy}
          description={`Level ${summary?.level || 1}`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Pending Tasks</CardTitle>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="text-primary">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : pendingTasks.length > 0 ? (
              <div className="space-y-3">
                {pendingTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="font-medium text-sm truncate">{task.title}</span>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize ml-2 flex-shrink-0">{task.subject}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="All caught up!"
                description="Your study slate is clean. Take a break or add a new task."
                action={
                  <Link href="/tasks">
                    <Button variant="outline" size="sm">Add Task</Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Sessions</CardTitle>
            <Link href="/analytics">
              <Button variant="ghost" size="sm" className="text-primary">Analytics</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoadingSessions ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                    <div>
                      <div className="font-medium text-sm capitalize">{session.subject}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(session.startedAt), "MMM d, h:mm a")}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{session.durationMinutes}m</div>
                      <div className="text-xs text-primary">{session.focusScore} score</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Timer}
                title="No recent sessions"
                description="Start a focus session to track your study time."
                action={
                  <Link href="/focus">
                    <Button variant="outline" size="sm">Start Focus</Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Quick AI Insights Teaser */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-transparent border-primary/20">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-background p-3 rounded-full shadow-sm">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Productivity Insights</h3>
              <p className="text-sm text-muted-foreground">Discover your optimal study hours and avoid burnout.</p>
            </div>
          </div>
          <Link href="/insights">
            <Button variant="secondary" className="whitespace-nowrap">View Insights</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}