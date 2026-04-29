import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateSession } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Square, Music, Volume2, Trophy } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type SessionType = "pomodoro" | "deep_work" | "short";

const SESSION_DURATIONS: Record<SessionType, number> = {
  pomodoro: 25 * 60,
  deep_work: 50 * 60,
  short: 15 * 60,
};

export default function Focus() {
  const [sessionType, setSessionType] = useState<SessionType>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATIONS[sessionType]);
  const [isActive, setIsActive] = useState(false);
  const [subject, setSubject] = useState("");
  const [distractions, setDistractions] = useState(0);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createSession = useCreateSession();

  useEffect(() => {
    setTimeLeft(SESSION_DURATIONS[sessionType]);
    setIsActive(false);
    setDistractions(0);
    setIsCompleted(false);
  }, [sessionType]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleStart = () => {
    if (!subject) {
      toast({ title: "Subject required", description: "Please enter a subject to study.", variant: "destructive" });
      return;
    }
    setIsActive(true);
    if (!startedAt) setStartedAt(new Date().toISOString());
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(SESSION_DURATIONS[sessionType]);
    setStartedAt(null);
    setDistractions(0);
  };

  const handleDistraction = () => {
    setDistractions((prev) => prev + 1);
    toast({ title: "Distraction logged", description: "Stay focused! You got this.", duration: 2000 });
  };

  const handleComplete = async () => {
    setIsActive(false);
    setIsCompleted(true);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#8b5cf6', '#06b6d4']
    });

    const durationMinutes = SESSION_DURATIONS[sessionType] / 60;
    const focusScore = Math.max(0, Math.min(100, 100 - distractions * 5));

    try {
      await createSession.mutateAsync({
        data: {
          subject,
          durationMinutes,
          focusScore,
          sessionType,
          distractions,
          startedAt: startedAt || new Date().toISOString(),
          endedAt: new Date().toISOString(),
        }
      });
      queryClient.invalidateQueries();
      toast({
        title: "Session Completed!",
        description: `Great job! You scored ${focusScore}/100 focus.`,
      });
    } catch (error) {
      toast({ title: "Error saving session", variant: "destructive" });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = ((SESSION_DURATIONS[sessionType] - timeLeft) / SESSION_DURATIONS[sessionType]) * 100;

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <Card className="glass text-center p-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
            <Trophy className="w-16 h-16 text-primary mx-auto mb-4 relative z-10" />
            <h2 className="text-3xl font-bold mb-2 relative z-10">Session Complete!</h2>
            <p className="text-muted-foreground mb-6 relative z-10">
              You focused on <span className="font-semibold text-foreground capitalize">{subject}</span> for {SESSION_DURATIONS[sessionType] / 60} minutes.
            </p>
            <div className="flex justify-center gap-4 relative z-10">
              <Button onClick={() => { setIsCompleted(false); handleStop(); }}>Back to Timer</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 max-w-3xl mx-auto w-full">
      <div className="w-full mb-8 flex justify-center">
        <Tabs value={sessionType} onValueChange={(v) => !isActive && setSessionType(v as SessionType)} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pomodoro" disabled={isActive}>Pomodoro</TabsTrigger>
            <TabsTrigger value="deep_work" disabled={isActive}>Deep Work</TabsTrigger>
            <TabsTrigger value="short" disabled={isActive}>Short Break</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full items-center justify-center">
        {/* Timer UI */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              className="fill-none stroke-muted stroke-[4]"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="48%"
              className="fill-none stroke-primary stroke-[8]"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5, ease: "linear" }}
              style={{ strokeDasharray: "100 100" }} // Placeholder, handled by framer-motion pathLength natively well enough for circles if configured right, but SVG circumference is better.
              strokeDasharray={2 * Math.PI * (144)} // approx radius for 300px
              strokeDashoffset={2 * Math.PI * (144) * (1 - progress/100)}
            />
          </svg>
          <div className="text-center z-10">
            <motion.div 
              key={timeLeft}
              initial={{ opacity: 0.8, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold font-mono tracking-tighter"
            >
              {formatTime(timeLeft)}
            </motion.div>
            <p className="text-muted-foreground mt-2 capitalize">{sessionType.replace("_", " ")}</p>
          </div>
        </div>

        {/* Controls */}
        <Card className="glass w-full max-w-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input 
                placeholder="What are you working on?" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isActive && startedAt !== null}
              />
            </div>

            <div className="flex justify-center gap-4">
              {!isActive ? (
                <Button size="lg" className="w-24 rounded-full" onClick={handleStart}>
                  <Play className="w-5 h-5 mr-2" /> Start
                </Button>
              ) : (
                <Button size="lg" variant="secondary" className="w-24 rounded-full" onClick={handlePause}>
                  <Pause className="w-5 h-5 mr-2" /> Pause
                </Button>
              )}
              <Button size="lg" variant="outline" className="w-24 rounded-full" onClick={handleStop}>
                <Square className="w-5 h-5 mr-2" /> Stop
              </Button>
            </div>

            {isActive && (
              <div className="pt-4 border-t border-border/50">
                <Button variant="destructive" className="w-full" onClick={handleDistraction}>
                  Log Distraction ({distractions})
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Ambient Sound</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={soundEnabled ? "text-primary" : "text-muted-foreground"}
              >
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}