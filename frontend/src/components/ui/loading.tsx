import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className = "" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

export const LoadingPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export const LoadingButton = ({ children, loading, ...props }: any) => (
  <button {...props} disabled={loading || props.disabled}>
    {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
    {children}
  </button>
);
