export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  // progress(stats) returns 0-100
  progress: (stats: AchievementStats) => number;
}

export interface AchievementStats {
  totalSessions: number;
  totalMinutes: number;
  bestStreak: number;
  currentStreak: number;
  highFocusSessions: number; // focusScore >= 90
  uniqueSubjects: number;
  tasksCompleted: number;
  deepWorkSessions: number;
  earlyBirdSessions: number; // started before 9am
  nightOwlSessions: number; // started after 9pm
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_focus",
    title: "First Focus",
    description: "Complete your first focus session",
    icon: "Sparkles",
    xpReward: 25,
    progress: (s) => (s.totalSessions >= 1 ? 100 : 0),
  },
  {
    id: "ten_sessions",
    title: "Getting in the Zone",
    description: "Finish 10 focus sessions",
    icon: "Flame",
    xpReward: 75,
    progress: (s) => Math.min(100, Math.round((s.totalSessions / 10) * 100)),
  },
  {
    id: "fifty_sessions",
    title: "Deep Diver",
    description: "Finish 50 focus sessions",
    icon: "Anchor",
    xpReward: 200,
    progress: (s) => Math.min(100, Math.round((s.totalSessions / 50) * 100)),
  },
  {
    id: "ten_hours",
    title: "Hour Hunter",
    description: "Log 10 hours of focused study",
    icon: "Hourglass",
    xpReward: 100,
    progress: (s) => Math.min(100, Math.round((s.totalMinutes / 600) * 100)),
  },
  {
    id: "fifty_hours",
    title: "Iron Mind",
    description: "Log 50 hours of focused study",
    icon: "Mountain",
    xpReward: 300,
    progress: (s) => Math.min(100, Math.round((s.totalMinutes / 3000) * 100)),
  },
  {
    id: "streak_3",
    title: "Three Day Spark",
    description: "Maintain a 3 day study streak",
    icon: "Zap",
    xpReward: 50,
    progress: (s) => Math.min(100, Math.round((s.bestStreak / 3) * 100)),
  },
  {
    id: "streak_7",
    title: "Weekly Warrior",
    description: "Maintain a 7 day study streak",
    icon: "Award",
    xpReward: 150,
    progress: (s) => Math.min(100, Math.round((s.bestStreak / 7) * 100)),
  },
  {
    id: "streak_30",
    title: "Unstoppable",
    description: "Maintain a 30 day study streak",
    icon: "Crown",
    xpReward: 500,
    progress: (s) => Math.min(100, Math.round((s.bestStreak / 30) * 100)),
  },
  {
    id: "laser_focus",
    title: "Laser Focus",
    description: "Score 90+ focus on 5 sessions",
    icon: "Target",
    xpReward: 80,
    progress: (s) => Math.min(100, Math.round((s.highFocusSessions / 5) * 100)),
  },
  {
    id: "polymath",
    title: "Polymath",
    description: "Study 5 different subjects",
    icon: "BookOpen",
    xpReward: 100,
    progress: (s) => Math.min(100, Math.round((s.uniqueSubjects / 5) * 100)),
  },
  {
    id: "task_master",
    title: "Task Master",
    description: "Complete 20 tasks",
    icon: "CheckCircle2",
    xpReward: 150,
    progress: (s) => Math.min(100, Math.round((s.tasksCompleted / 20) * 100)),
  },
  {
    id: "deep_worker",
    title: "Deep Worker",
    description: "Finish 10 deep work sessions",
    icon: "Brain",
    xpReward: 120,
    progress: (s) => Math.min(100, Math.round((s.deepWorkSessions / 10) * 100)),
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Start 5 sessions before 9am",
    icon: "Sunrise",
    xpReward: 80,
    progress: (s) => Math.min(100, Math.round((s.earlyBirdSessions / 5) * 100)),
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Start 5 sessions after 9pm",
    icon: "Moon",
    xpReward: 80,
    progress: (s) => Math.min(100, Math.round((s.nightOwlSessions / 5) * 100)),
  },
];
