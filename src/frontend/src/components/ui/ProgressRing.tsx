import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  variant?: "blue" | "green" | "yellow" | "red";
  label?: string;
  sublabel?: string;
  className?: string;
  animated?: boolean;
}

const ringColors = {
  blue: "stroke-primary",
  green: "stroke-accent",
  yellow: "stroke-yellow-500",
  red: "stroke-destructive",
};

const textColors = {
  blue: "text-primary",
  green: "text-accent",
  yellow: "text-yellow-600",
  red: "text-destructive",
};

export function ProgressRing({
  value,
  size = 96,
  strokeWidth = 8,
  variant = "blue",
  label,
  sublabel,
  className,
  animated = true,
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-label={`Progress: ${clampedValue}%`}
          role="img"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={cn(
              ringColors[variant],
              animated && "transition-all duration-700 ease-out",
            )}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {/* Center label */}
        {label && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "font-display font-bold text-sm",
                textColors[variant],
              )}
            >
              {label}
            </span>
          </div>
        )}
      </div>
      {sublabel && (
        <p className="text-xs text-muted-foreground text-center">{sublabel}</p>
      )}
    </div>
  );
}
