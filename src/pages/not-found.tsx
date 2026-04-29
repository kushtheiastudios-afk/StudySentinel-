import { Link } from "wouter";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative bg-background p-6 rounded-3xl shadow-xl border border-border/50">
          <AlertCircle className="w-16 h-16 text-primary" />
        </div>
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8 text-lg">
        We couldn't find the study room you're looking for. It might have been moved or deleted.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-full gap-2 px-8">
          <Home className="w-5 h-5" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}