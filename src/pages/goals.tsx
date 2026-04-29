import { useState } from "react";
import { useListGoals, getListGoalsQueryKey, useCreateGoal, useDeleteGoal } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Target, Plus, Trash2, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";

const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  targetMinutes: z.coerce.number().min(15, "Target must be at least 15 mins"),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export default function Goals() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useListGoals({ query: { queryKey: getListGoalsQueryKey() } });
  const createGoal = useCreateGoal();
  const deleteGoal = useDeleteGoal();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: { title: "", subject: "", targetMinutes: 120 },
  });

  const onSubmit = async (data: GoalFormValues) => {
    try {
      await createGoal.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
      setIsSheetOpen(false);
      form.reset();
      toast({ title: "Goal created" });
    } catch (e) {
      toast({ title: "Failed to create goal", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteGoal.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
      toast({ title: "Goal deleted" });
    } catch (e) {
      toast({ title: "Failed to delete goal", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Goals</h1>
          <p className="text-muted-foreground mt-1">Set specific time targets for your subjects.</p>
        </div>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> New Goal
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Goal</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl><Input placeholder="Master Calculus..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl><Input placeholder="Math" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target (Minutes)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full mt-4" disabled={createGoal.isPending}>
                    {createGoal.isPending ? "Creating..." : "Create Goal"}
                  </Button>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="glass"><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))
        ) : goals?.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Target}
              title="No active goals"
              description="Set a study goal to keep yourself accountable."
            />
          </div>
        ) : (
          goals?.map((goal) => {
            const progress = Math.min(100, (goal.completedMinutes / goal.targetMinutes) * 100);
            const isCompleted = progress >= 100;
            
            return (
              <Card key={goal.id} className={`glass overflow-hidden relative ${isCompleted ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg font-semibold">{goal.title}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize mt-1">{goal.subject}</p>
                  </div>
                  {isCompleted ? (
                    <Trophy className="w-5 h-5 text-primary" />
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive -mt-2 -mr-2" onClick={() => handleDelete(goal.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{goal.completedMinutes}m / {goal.targetMinutes}m</span>
                      <span className="text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className={`h-2 ${isCompleted ? '[&>div]:bg-primary' : ''}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}