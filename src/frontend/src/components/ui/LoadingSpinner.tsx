import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  fullPage?: boolean;
}

const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-7 h-7 border-2",
  lg: "w-12 h-12 border-3",
};

export function LoadingSpinner({
  size = "md",
  className,
  label,
  fullPage = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      aria-label={label ?? "Loading"}
      aria-busy="true"
      className={cn(
        "flex flex-col items-center gap-2",
        fullPage && "justify-center",
        className,
      )}
    >
      <div
        className={cn(
          sizes[size],
          "rounded-full border-border border-t-primary animate-spin",
        )}
      />
      {label && (
        <p className="text-sm text-muted-foreground animate-pulse-gentle">
          {label}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="loading_state"
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse bg-muted rounded-md", className)}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div
      className="bg-card rounded-lg shadow-md p-4 space-y-3"
      data-ocid="loading_state"
    >
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
