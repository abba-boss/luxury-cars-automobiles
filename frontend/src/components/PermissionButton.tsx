import { Button, ButtonProps } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { RequirePermission } from '@/hooks/useRBAC';

interface PermissionButtonProps extends ButtonProps {
  permission: string;
  fallback?: React.ReactNode;
}

export const PermissionButton = ({ permission, children, fallback = null, ...props }: PermissionButtonProps) => {
  return (
    <RequirePermission permission={permission} fallback={fallback}>
      <Button {...props}>
        {children}
      </Button>
    </RequirePermission>
  );
};