import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

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
    <Loader2
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      style={{
        animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        animationDuration: '0.8s'
      }}
    />
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

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  success?: boolean;
  successText?: string;
}

export const LoadingButton = ({
  children,
  loading,
  success,
  loadingText = "Loading...",
  successText = "Success!",
  className,
  disabled,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      {...props}
      className={className}
      disabled={disabled || loading} // Disable when loading or explicitly disabled
      aria-busy={loading}
      aria-live="polite"
      style={{
        opacity: loading ? 0.9 : 1,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      {loading ? (
        <motion.span
          className="flex items-center gap-2"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingSpinner size="sm" aria-hidden="true" />
          <span>{loadingText}</span>
        </motion.span>
      ) : success ? (
        <motion.span
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            aria-hidden="true"
          >
            <motion.path
              d="M20 6L9 17L4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              aria-hidden="true"
            />
          </motion.svg>
          <span>{successText}</span>
        </motion.span>
      ) : (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      )}
    </Button>
  );
};
