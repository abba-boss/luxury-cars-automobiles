import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheckIcon, ClockIcon, UserRoundIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { RefreshPermissionsButton } from '@/components/RefreshPermissionsButton';

export const UserPermissionsDisplay = () => {
  const { user, getActivePermissions } = useAuth();

  const permissions = user?.permissions || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5" />
          My Permissions
        </CardTitle>
        <RefreshPermissionsButton variant="outline" size="sm" />
      </CardHeader>
      <CardContent>
        {permissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>You don't have any special permissions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <ShieldCheckIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium capitalize">
                      {permission.permission_key}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        Granted: {formatDate(permission.granted_at)}
                      </span>
                      {permission.expires_at && (
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          Expires: {formatDate(permission.expires_at)}
                        </span>
                      )}
                    </div>
                    {permission.permission_value && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Value:</span> {permission.permission_value}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {permission.is_active ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};