import { cn } from "@/lib/utils";
import type { ColorVariant } from "../../types";

interface MetricCardProps {
  emoji: string;
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: ColorVariant;
  trend?: "up" | "down" | "neutral";
  className?: string;
  "data-ocid"?: string;
}

const variantStyles: Record<ColorVariant, string> = {
  blue: "bg-primary/10 border-primary/20 text-primary",
  green: "bg-accent/10 border-accent/20 text-accent",
  yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600",
  red: "bg-destructive/10 border-destructive/20 text-destructive",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-600",
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-600",
};

const trendIcons = { up: "↑", down: "↓", neutral: "→" };
const trendColors = {
  up: "text-accent",
  down: "text-destructive",
  neutral: "text-muted-foreground",
};

export function MetricCard({
  emoji,
  title,
  value,
  subtitle,
  variant = "blue",
  trend,
  className,
  "data-ocid": ocid,
}: MetricCardProps) {
  return (
    <div
      data-ocid={ocid}
      className={cn(
        "bg-card rounded-lg shadow-md p-4 transition-smooth hover:shadow-lg border border-border/40 animate-slide-in-up",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "w-10 h-10 rounded-md border flex items-center justify-center text-xl shrink-0",
            variantStyles[variant],
          )}
        >
          {emoji}
        </div>
        {trend && (
          <span className={cn("text-sm font-bold", trendColors[trend])}>
            {trendIcons[trend]}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-display font-bold text-foreground leading-none">
          {value}
        </p>
        <p className="text-xs font-medium text-muted-foreground mt-1">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
