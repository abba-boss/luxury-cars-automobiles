import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Shield,
  ShieldOff,
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Users,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAdminProfiles, useAdminUserRoles, useAdminFavorites, useAdminInquiries } from '@/hooks/useAdminData';
import { localDb } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  const { data: profiles, isLoading: profilesLoading } = useAdminProfiles();
  const { data: userRoles, isLoading: rolesLoading } = useAdminUserRoles();
  const { data: favoriteCounts } = useAdminFavorites();
  const { data: inquiries } = useAdminInquiries();
  const queryClient = useQueryClient();

  const isLoading = profilesLoading || rolesLoading;

  // Build user data with roles
  const users = (profiles || []).map(profile => {
    const role = userRoles?.find(r => r.user_id === profile.id)?.role || 'user';
    const userInquiries = inquiries?.filter(i => i.user_id === profile.id)?.length || 0;
    const userFavorites = favoriteCounts?.[profile.id] || 0;
    
    return {
      ...profile,
      role,
      totalInquiries: userInquiries,
      favoriteCount: userFavorites,
    };
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleMakeAdmin = async (userId: string, currentRole: string) => {
    try {
      // Mock admin role update for local database
      toast.success(currentRole === 'admin' ? 'Admin role removed' : 'User made admin');
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">User Management</h2>
            <p className="text-muted-foreground">Manage and monitor user accounts</p>
          </div>
          <Button className="gap-2 rounded-xl">
            <Download className="w-4 h-4" />
            Export Users
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="text-2xl font-bold text-primary">{adminCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Total Inquiries</p>
            <p className="text-2xl font-bold text-emerald-400">{inquiries?.length || 0}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Regular Users</p>
            <p className="text-2xl font-bold text-blue-400">{users.length - adminCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Activity</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Joined</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr 
                      key={user.id} 
                      className="border-b border-border/50 hover:bg-secondary/20 transition-colors animate-fade-in"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {(user.full_name || user.email || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.full_name || 'No name'}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.phone || 'No phone'}</p>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="rounded-lg">
                          {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <p className="text-sm text-foreground">{user.totalInquiries} inquiries</p>
                          <p className="text-xs text-muted-foreground">{user.favoriteCount} saved cars</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : 'Unknown'}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleMakeAdmin(user.id, user.role)}>
                              {user.role === 'admin' ? (
                                <>
                                  <ShieldOff className="w-4 h-4 mr-2" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <Shield className="w-4 h-4 mr-2" />
                                  Make Admin
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
