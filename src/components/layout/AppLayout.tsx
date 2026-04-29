import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { useGetMe, getGetMeQueryKey, useGetStreak, getGetStreakQueryKey } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BrainCircuit, 
  Flame, 
  Home, 
  Target, 
  CheckSquare, 
  BarChart3, 
  Lightbulb, 
  Trophy, 
  User, 
  Menu, 
  Moon, 
  Sun,
  Timer
} from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useGetMe({ 
    query: { queryKey: getGetMeQueryKey() } 
  });

  const { data: streak } = useGetStreak({
    query: { queryKey: getGetStreakQueryKey() }
  });

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/focus", label: "Focus", icon: Timer },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/insights", label: "Insights", icon: Lightbulb },
    { href: "/achievements", label: "Achievements", icon: Trophy },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border/50">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <span className="font-bold text-lg tracking-tight">FocusFlow AI</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        {isLoadingUser ? (
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : user ? (
          <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer group">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="bg-primary/5 text-primary">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm font-medium truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground">Lvl {user.level} • {user.xp} XP</span>
              </div>
              <User className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ) : null}
        <p className="mt-3 text-[11px] text-center text-muted-foreground/70 tracking-wide">
          Developed by Theia Studios &amp; Kush
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/40 glass z-10 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {/* Streak Badge */}
            {streak && (
              <div className="hidden sm:flex items-center gap-2 bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded-full text-sm font-medium border border-orange-500/20">
                <Flame className="w-4 h-4" />
                {streak.currentStreak} Day Streak
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            {location !== "/focus" && (
              <Link href="/focus">
                <Button className="hidden sm:flex gap-2 shadow-lg shadow-primary/25">
                  <Timer className="w-4 h-4" />
                  Quick Focus
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
          <div className="relative z-10 w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}