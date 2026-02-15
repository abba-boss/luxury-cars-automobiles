import { useState, useEffect } from 'react';
import { userPermissionService, adminService } from '@/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CalendarIcon, PlusIcon, TrashIcon, ShieldCheckIcon, ClockIcon, UserRoundIcon } from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading';
import { cn } from '@/lib/utils';
import type { UserPermission } from '@/types/api';

interface UserPermissionManagementProps {
  userId: number;
  userName: string;
  userEmail: string;
}

export const UserPermissionManagement = ({ userId, userName, userEmail }: UserPermissionManagementProps) => {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [openGrantDialog, setOpenGrantDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingPermission, setEditingPermission] = useState<UserPermission | null>(null);
  const [grantForm, setGrantForm] = useState<{
    permission_key: string;
    permission_value: string;
    expires_at: string;
  }>({
    permission_key: '',
    permission_value: '',
    expires_at: ''
  });
  const [availablePermissions] = useState<{ key: string; label: string }[]>([
    // Staff Permissions
    { key: 'manage_inventory', label: 'Manage Vehicle Inventory' },
    { key: 'update_vehicle_status', label: 'Update Vehicle Status' },
    { key: 'upload_vehicle_media', label: 'Upload Vehicle Media' },
    { key: 'verify_vehicles', label: 'Verify Vehicles' },
    { key: 'view_orders', label: 'View Orders' },
    { key: 'update_order_status', label: 'Update Order Status' },
    { key: 'manage_customers', label: 'Manage Customers' },
    { key: 'process_sales', label: 'Process Sales' },
    { key: 'manage_brand_images', label: 'Manage Brand Images' },
    { key: 'update_homepage_content', label: 'Update Homepage Content' },
    { key: 'manage_media_library', label: 'Manage Media Library' },
    { key: 'update_site_information', label: 'Update Site Information' },
    { key: 'respond_to_inquiries', label: 'Respond to Inquiries' },
    { key: 'manage_test_drives', label: 'Manage Test Drives' },
    { key: 'handle_customer_support', label: 'Handle Customer Support' },
    { key: 'manage_reviews', label: 'Manage Reviews' },
    { key: 'view_reports', label: 'View Reports' },
    { key: 'manage_own_profile', label: 'Manage Own Profile' },
    { key: 'access_system_settings', label: 'Access System Settings' },
    { key: 'send_notifications', label: 'Send Notifications' },
    { key: 'manage_messaging', label: 'Manage Messaging' },
    { key: 'access_live_chat', label: 'Access Live Chat' },
  ]);

  useEffect(() => {
    loadPermissions();
  }, [userId]);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const response = await userPermissionService.getUserPermissions(userId);
      if (response.success) {
        // The API returns data in the format { user: User, permissions: UserPermission[] }
        setPermissions(Array.isArray(response.data?.permissions) ? (response.data.permissions as UserPermission[]) : []);
      } else {
        toast.error(response.message || 'Failed to load user permissions');
        setPermissions([]); // Reset permissions to empty array on error
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      toast.error('Failed to load user permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantPermission = async () => {
    try {
      const response = await userPermissionService.grantUserPermission(userId, grantForm);
      if (response.success) {
        toast.success('Permission granted successfully. The user should refresh their permissions to see the changes.');
        setGrantForm({ permission_key: '', permission_value: '', expires_at: '' });
        setOpenGrantDialog(false);
        loadPermissions(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to grant permission');
      }
    } catch (error) {
      console.error('Error granting permission:', error);
      toast.error('Failed to grant permission');
    }
  };

  const handleRevokePermission = async (permissionId: number) => {
    try {
      const response = await userPermissionService.revokeUserPermission(userId, permissionId);
      if (response.success) {
        toast.success('Permission revoked successfully. The user should refresh their permissions to see the changes.');
        loadPermissions(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to revoke permission');
      }
    } catch (error) {
      console.error('Error revoking permission:', error);
      toast.error('Failed to revoke permission');
    }
  };

  const handleUpdatePermission = async (permissionId: number, updates: Partial<{ permission_value: string; expires_at: string; is_active: boolean }>) => {
    try {
      const response = await userPermissionService.updateUserPermission(userId, permissionId, updates);
      if (response.success) {
        toast.success('Permission updated successfully. The user should refresh their permissions to see the changes.');
        loadPermissions(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to update permission');
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5" />
            Permission Management for {userName}
          </CardTitle>
          <CardDescription>
            Manage specific access rights for {userEmail}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Current Permissions</h3>
            <Dialog open={openGrantDialog} onOpenChange={setOpenGrantDialog}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Grant Permission
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Grant New Permission</DialogTitle>
                  <DialogDescription>
                    Select a permission to grant to {userName}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="permission" className="text-right">
                      Permission
                    </Label>
                    <Select
                      value={grantForm.permission_key}
                      onValueChange={(value) => setGrantForm({...grantForm, permission_key: value})}
                      className="col-span-3"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a permission" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePermissions.map((perm) => (
                          <SelectItem key={perm.key} value={perm.key}>
                            {perm.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      Value
                    </Label>
                    <Input
                      id="value"
                      value={grantForm.permission_value}
                      onChange={(e) => setGrantForm({...grantForm, permission_value: e.target.value})}
                      placeholder="Optional value for this permission"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expires" className="text-right">
                      Expires
                    </Label>
                    <Input
                      id="expires"
                      type="date"
                      value={grantForm.expires_at}
                      onChange={(e) => setGrantForm({...grantForm, expires_at: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleGrantPermission}>Grant Permission</Button>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner />
            </div>
          ) : !Array.isArray(permissions) || permissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2" />
              <p>No permissions granted yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Array.isArray(permissions) ? permissions.map((permission: UserPermission) => (
                <div
                  key={permission?.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border",
                    permission?.is_active ? "bg-background" : "bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <ShieldCheckIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium capitalize">
                        {availablePermissions.find(p => p.key === permission?.permission_key)?.label || permission?.permission_key || 'N/A'}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          Granted: {formatDate(permission?.granted_at)}
                        </span>
                        {permission?.expires_at && (
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            Expires: {formatDate(permission?.expires_at)}
                          </span>
                        )}
                      </div>
                      {permission?.permission_value && (
                        <p className="text-sm mt-1">
                          <span className="font-medium">Value:</span> {permission?.permission_value}
                        </p>
                      )}
                      {permission?.grantingUser && (
                        <p className="text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <UserRoundIcon className="w-3 h-3" />
                            Granted by: {permission?.grantingUser?.full_name}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!permission?.is_active ? (
                      <Badge variant="secondary">Revoked</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPermission(permission);
                        setOpenEditDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokePermission(permission.id)}
                      disabled={!permission?.is_active}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )) : []}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Permission Dialog */}
      {editingPermission && (
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Permission</DialogTitle>
              <DialogDescription>
                Update the permission value or expiration for {editingPermission.permission_key}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-value" className="text-right">
                  Value
                </Label>
                <Input
                  id="edit-value"
                  value={editingPermission.permission_value || ''}
                  onChange={(e) => setEditingPermission({
                    ...editingPermission,
                    permission_value: e.target.value
                  })}
                  placeholder="Optional value for this permission"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-expires" className="text-right">
                  Expires
                </Label>
                <Input
                  id="edit-expires"
                  type="date"
                  value={editingPermission.expires_at || ''}
                  onChange={(e) => setEditingPermission({
                    ...editingPermission,
                    expires_at: e.target.value
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-active" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-active"
                    checked={editingPermission.is_active}
                    onChange={(e) => setEditingPermission({
                      ...editingPermission,
                      is_active: e.target.checked
                    })}
                  />
                  <Label htmlFor="edit-active">Permission is active</Label>
                </div>
              </div>
            </div>
            <Button onClick={() => {
              if (editingPermission) {
                handleUpdatePermission(editingPermission.id, {
                  permission_value: editingPermission.permission_value,
                  expires_at: editingPermission.expires_at,
                  is_active: editingPermission.is_active
                });
                setOpenEditDialog(false);
              }
            }}>
              Update Permission
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};