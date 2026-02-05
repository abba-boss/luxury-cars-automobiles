import { useState, useEffect } from 'react';
import { userPermissionService, adminService } from '@/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { SearchIcon, ShieldCheckIcon, UserRoundIcon, PlusIcon, CalendarIcon } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading';
import { format } from 'date-fns';
import { UserPermissionManagement } from '@/components/admin/UserPermissionManagement';
import type { UserPermission, User } from '@/types/api';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminUserPermissionsPage() {
  const [users, setUsers] = useState<(User & { permissions: UserPermission[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<(User & { permissions: UserPermission[] }) | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openUserDialog, setOpenUserDialog] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userPermissionService.getAllUsersWithPermissions({
        page: currentPage,
        search: searchTerm
      });

      if (response.success) {
        // The API returns data in the format { data: users[], pagination: {...} }
        // So response.data contains the users array
        const userData = response.data || [];
        // Ensure each user has a permissions array
        const usersWithPermissions = userData.map(user => ({
          ...user,
          permissions: Array.isArray(user.permissions) ? user.permissions : []
        }));
        setUsers(usersWithPermissions as (User & { permissions: UserPermission[] })[]);
        setTotalPages(response.pagination?.pages || 1);
      } else {
        toast.error(response.message || 'Failed to load users');
        setUsers([]); // Reset users to empty array on error
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User & { permissions: UserPermission[] }) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheckIcon className="w-8 h-8 text-primary" />
            User Permission Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage specific access rights for users across the platform
          </p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>User Permissions Overview</CardTitle>
          <CardDescription>
            View and manage permissions for all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="mb-6 flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-4">
              {users && Array.isArray(users) && users.length > 0 ? (
                users.map((user: User & { permissions: UserPermission[] }) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-primary/10">
                            <UserRoundIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{user.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span>Role: <Badge variant="outline">{user.role}</Badge></span>
                              <span>Status: <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge></span>
                              <span>Joined: {formatDate(user.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {user.permissions?.length || 0} permission{user.permissions?.length !== 1 ? 's' : ''}
                            </p>
                            {user.permissions && Array.isArray(user.permissions) && user.permissions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {user.permissions.slice(0, 3).map((perm: UserPermission) => (
                                  <Badge key={perm?.id} variant="secondary" className="text-xs">
                                    {perm?.permission_key?.replace(/_/g, ' ') || 'N/A'}
                                  </Badge>
                                ))}
                                {user.permissions.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{user.permissions.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserSelect(user)}
                          >
                            Manage Permissions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <ShieldCheckIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No users found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search terms' : 'No users in the system yet'}
                  </p>
                </div>
              )}
            </div>
          )}


          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-2 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Permission Management Dialog */}
      {selectedUser && (
        <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Permissions for {selectedUser.full_name}</DialogTitle>
              <DialogDescription>
                Grant or revoke specific access rights for this user
              </DialogDescription>
            </DialogHeader>
            <UserPermissionManagement 
              userId={selectedUser.id} 
              userName={selectedUser.full_name} 
              userEmail={selectedUser.email} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  </AdminLayout>
  );
}