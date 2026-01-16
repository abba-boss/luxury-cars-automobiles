import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-gray-800/20 to-gray-900/10 border border-border/10",
        className
      )}
      style={{
        backgroundSize: '200% 200%',
        animation: 'shimmer 2.5s ease-in-out infinite',
      }}
      {...props}
    />
  );
}

export { Skeleton };
