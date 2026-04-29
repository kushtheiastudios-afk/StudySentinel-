import { useListAchievements, getListAchievementsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Zap, Clock, Brain, Flame, Medal, Shield, Sword } from "lucide-react";

const iconMap: Record<string, any> = {
  Trophy, Star, Target, Zap, Clock, Brain, Flame, Medal, Shield, Sword
};

export default function Achievements() {
  const { data: achievementsData, isLoading } = useListAchievements({ query: { queryKey: getListAchievementsQueryKey() } });

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const data = achievementsData;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-center bg-gradient-to-r from-primary/20 via-accent/10 to-background border border-primary/20 p-8 rounded-2xl">
        <div className="bg-background p-4 rounded-full shadow-xl shadow-primary/20">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground mt-1">Unlock badges as you build your study habits.</p>
        </div>
        <div className="flex gap-8 text-center md:text-right">
          <div>
            <div className="text-3xl font-bold">{data?.totalUnlocked} <span className="text-lg text-muted-foreground font-normal">/ {data?.totalAvailable}</span></div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Unlocked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{data?.totalXp}</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total XP</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((achievement) => {
          const Icon = iconMap[achievement.icon] || Trophy;
          const isUnlocked = achievement.unlocked;

          return (
            <Card key={achievement.id} className={`glass overflow-hidden transition-all duration-300 ${isUnlocked ? 'border-primary/30 shadow-lg shadow-primary/5 hover:-translate-y-1' : 'opacity-60 grayscale-[0.5]'}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-1 font-bold text-primary bg-primary/10 px-2 py-1 rounded-md text-sm">
                    <Star className="w-3 h-3 fill-current" /> {achievement.xpReward}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 h-10">{achievement.description}</p>
                
                {isUnlocked ? (
                  <div className="text-xs font-medium text-emerald-500 bg-emerald-500/10 inline-flex px-2 py-1 rounded">
                    Unlocked
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-1.5" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}