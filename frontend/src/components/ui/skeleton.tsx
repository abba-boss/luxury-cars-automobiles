import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-border/30",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
