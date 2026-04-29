import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  description?: string;
  trend?: { value: number; label: string };
}

export function StatCard({ title, value, icon: Icon, suffix = "", prefix = "", description, trend }: StatCardProps) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <Card className="glass relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-baseline gap-1">
          {prefix}
          <motion.span>{display}</motion.span>
          {suffix && <span className="text-sm font-normal text-muted-foreground">{suffix}</span>}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trend.value >= 0 ? "text-emerald-500" : "text-destructive"}`}>
            {trend.value > 0 ? "+" : ""}{trend.value}% <span className="text-muted-foreground font-normal">{trend.label}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}