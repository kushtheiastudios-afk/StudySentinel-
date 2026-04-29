import { useGetMe, getGetMeQueryKey, useUpdateMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Save, Moon, Sun, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/theme-provider";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["school", "college", "exam", "self"]),
  dailyGoalMinutes: z.number().min(15).max(720),
  theme: z.enum(["light", "dark", "system"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();

  const { data: user, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const updateMe = useUpdateMe();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: user ? {
      name: user.name,
      role: user.role as any,
      dailyGoalMinutes: user.dailyGoalMinutes,
      theme: user.theme as any,
    } : undefined,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateMe.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      setTheme(data.theme);
      toast({ title: "Profile updated successfully" });
    } catch (e) {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and goals.</p>
      </div>

      <Card className="glass border-primary/10">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your personal information and study parameters.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Profile</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="school">School Student</SelectItem>
                        <SelectItem value="college">College / University</SelectItem>
                        <SelectItem value="exam">Exam Aspirant</SelectItem>
                        <SelectItem value="self">Self Learner</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Helps tailor AI insights to your needs.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dailyGoalMinutes"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      <span>Daily Focus Goal</span>
                      <span className="text-primary font-bold">{value} minutes</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={15}
                        max={720}
                        step={15}
                        value={[value]}
                        onValueChange={(vals) => onChange(vals[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormDescription>How many minutes do you want to focus each day?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appearance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light"><div className="flex items-center"><Sun className="w-4 h-4 mr-2"/> Light</div></SelectItem>
                        <SelectItem value="dark"><div className="flex items-center"><Moon className="w-4 h-4 mr-2"/> Dark</div></SelectItem>
                        <SelectItem value="system"><div className="flex items-center"><Monitor className="w-4 h-4 mr-2"/> System</div></SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full sm:w-auto" disabled={updateMe.isPending}>
                {updateMe.isPending ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}