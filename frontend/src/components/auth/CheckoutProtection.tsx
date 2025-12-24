import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface CheckoutProtectionProps {
  children: React.ReactNode;
}

const CheckoutProtection = ({ children }: CheckoutProtectionProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location, message: "Please sign in to proceed with checkout" }} replace />;
  }

  return <>{children}</>;
};

export default CheckoutProtection;
