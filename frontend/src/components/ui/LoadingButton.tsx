import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const LoadingButton = ({ 
  children, 
  loading = false, 
  loadingText = "Loading...",
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ...props 
}: LoadingButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/50",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-accent/50",
    ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-accent/50",
    link: "underline-offset-4 hover:underline text-primary focus:ring-primary/50"
  };
  
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-11 px-8 text-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <motion.span 
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <Loader2 className="w-4 h-4" />
          </motion.div>
          <span>{loadingText}</span>
        </motion.span>
      ) : (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {children}
        </motion.span>
      )}
    </button>
  );
};

export default LoadingButton;