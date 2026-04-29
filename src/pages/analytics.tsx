import { useGetWeeklyAnalytics, getGetWeeklyAnalyticsQueryKey, useGetProductivityHeatmap, getGetProductivityHeatmapQueryKey, useGetSubjectBreakdown, getGetSubjectBreakdownQueryKey, useGetWeeklyForecast, getGetWeeklyForecastQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { format, parseISO } from "date-fns";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Analytics() {
  const { data: weeklyData, isLoading: isLoadingWeekly } = useGetWeeklyAnalytics({ query: { queryKey: getGetWeeklyAnalyticsQueryKey() } });
  const { data: heatmapData, isLoading: isLoadingHeatmap } = useGetProductivityHeatmap({ query: { queryKey: getGetProductivityHeatmapQueryKey() } });
  const { data: subjectData, isLoading: isLoadingSubject } = useGetSubjectBreakdown({ query: { queryKey: getGetSubjectBreakdownQueryKey() } });
  const { data: forecastData, isLoading: isLoadingForecast } = useGetWeeklyForecast({ query: { queryKey: getGetWeeklyForecastQueryKey() } });

  const formatChartDate = (dateStr: string) => format(parseISO(dateStr), "EEE");

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your study patterns and performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Focus Time Trend</CardTitle>
            <CardDescription>Your daily study minutes over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoadingWeekly ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    labelFormatter={(label) => format(parseISO(label as string), "MMM d, yyyy")}
                  />
                  <Area type="monotone" dataKey="focusMinutes" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Subject Breakdown</CardTitle>
            <CardDescription>Where your time goes</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {isLoadingSubject ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="minutes"
                    nameKey="subject"
                  >
                    {subjectData?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    formatter={(value: number) => [`${value} min`, 'Focus Time']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="glass md:col-span-2">
          <CardHeader>
            <CardTitle>Forecast</CardTitle>
            <CardDescription>Predicted study time for the upcoming week based on your habits</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoadingForecast ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    labelFormatter={(label) => format(parseISO(label as string), "MMM d, yyyy")}
                  />
                  <Line type="monotone" dataKey="predictedFocusMinutes" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}