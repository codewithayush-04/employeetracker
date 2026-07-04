import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  gradient: "brand" | "success" | "warning" | "danger" | "info";
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, gradient, delay = 0 }: StatCardProps) {
  const gradients = {
    brand: "from-brand-500/20 to-brand-600/5 border-brand-500/20",
    success: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
    warning: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
    danger: "from-red-500/20 to-red-600/5 border-red-500/20",
    info: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
  };

  const iconColors = {
    brand: "text-brand-400 bg-brand-500/15",
    success: "text-emerald-400 bg-emerald-500/15",
    warning: "text-amber-400 bg-amber-500/15",
    danger: "text-red-400 bg-red-500/15",
    info: "text-blue-400 bg-blue-500/15",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in",
        gradients[gradient]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground/50">{title}</p>
          <p className="text-3xl font-bold text-foreground tracking-tight">
            {value}
          </p>
          {trend && (
            <p className="text-xs text-foreground/40">{trend}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconColors[gradient])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
