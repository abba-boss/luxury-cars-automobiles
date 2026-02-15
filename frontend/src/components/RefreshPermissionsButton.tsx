import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface RefreshPermissionsButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const RefreshPermissionsButton = ({ 
  className, 
  variant = 'outline', 
  size = 'sm' 
}: RefreshPermissionsButtonProps) => {
  const { refreshPermissions, user } = useAuth();

  const handleRefresh = async () => {
    try {
      await refreshPermissions();
      toast.success('Permissions refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing permissions:', error);
      toast.error('Failed to refresh permissions');
    }
  };

  if (!user) {
    return null; // Don't show button if not logged in
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleRefresh}
      title="Refresh permissions"
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      Refresh Permissions
    </Button>
  );
};