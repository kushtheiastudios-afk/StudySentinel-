import { useGetAiInsights, getGetAiInsightsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Brain, Clock, Battery, AlertTriangle, Lightbulb, Trophy, ArrowUpRight, ArrowRight, ArrowDownRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Insights() {
  const { data: insights, isLoading } = useGetAiInsights({ query: { queryKey: getGetAiInsightsQueryKey() } });

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[150px] rounded-xl" />
          <Skeleton className="h-[150px] rounded-xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!insights) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-emerald-500 bg-emerald-500/10";
      case "medium": return "text-orange-500 bg-orange-500/10";
      case "high": return "text-destructive bg-destructive/10";
      default: return "text-primary bg-primary/10";
    }
  };

  const getRiskProgressColor = (risk: string) => {
    switch (risk) {
      case "low": return "[&>div]:bg-emerald-500";
      case "medium": return "[&>div]:bg-orange-500";
      case "high": return "[&>div]:bg-destructive";
      default: return "[&>div]:bg-primary";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "tip": return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "praise": return <Trophy className="w-5 h-5 text-emerald-500" />;
      case "recommendation": return <Brain className="w-5 h-5 text-purple-500" />;
      default: return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  const TrendIcon = insights.weeklyTrend === "up" ? ArrowUpRight : insights.weeklyTrend === "down" ? ArrowDownRight : ArrowRight;
  const trendColor = insights.weeklyTrend === "up" ? "text-emerald-500" : insights.weeklyTrend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" /> AI Insights
        </h1>
        <p className="text-muted-foreground mt-1">Personalized recommendations based on your study habits.</p>
      </div>

      <Card className="glass border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden relative">
        <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
          <Brain className="w-64 h-64" />
        </div>
        <CardContent className="p-8 relative z-10">
          <h2 className="text-2xl font-semibold mb-2">"{insights.motivationMessage}"</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <TrendIcon className={`w-5 h-5 ${trendColor}`} />
            Productivity is trending <strong className="text-foreground">{insights.weeklyTrend}</strong> by {insights.weeklyTrendPct}% this week.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="w-5 h-5" /> Burnout Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-4xl font-bold">{insights.burnoutScore}</span>
                  <span className="text-muted-foreground ml-1">/ 100</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRiskColor(insights.burnoutRisk)}`}>
                  {insights.burnoutRisk} Risk
                </div>
              </div>
              <Progress value={insights.burnoutScore} className={`h-3 ${getRiskProgressColor(insights.burnoutRisk)}`} />
              <p className="text-sm text-muted-foreground">
                {insights.burnoutRisk === 'high' ? "Take a break. You're pushing too hard." : 
                 insights.burnoutRisk === 'medium' ? "Pacing is okay, but consider more short breaks." :
                 "Great pacing! Your study rhythm is sustainable."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" /> Optimal Routine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Best Study Time</div>
              <div className="text-2xl font-bold">{insights.bestStudyHourLabel || "Not enough data"}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-sm text-primary mb-1">Focus Block</div>
                <div className="text-xl font-semibold">{insights.recommendedFocusBlockMinutes}m</div>
              </div>
              <div className="p-4 rounded-lg bg-secondary border border-border">
                <div className="text-sm text-muted-foreground mb-1">Rest Period</div>
                <div className="text-xl font-semibold">{insights.recommendedBreakMinutes}m</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Key Observations</h3>
        <div className="grid gap-4">
          {insights.insights.map((insight) => (
            <Card key={insight.id} className="glass hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{insight.title}</h4>
                  <p className="text-muted-foreground mt-1">{insight.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}