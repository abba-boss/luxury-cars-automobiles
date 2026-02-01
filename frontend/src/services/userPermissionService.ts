import { api } from '@/lib/api';
import type { ApiResponse, User } from '@/types/api';

export interface UserPermission {
  id: number;
  user_id: number;
  permission_key: string;
  permission_value?: string;
  granted_by: number;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  grantingUser?: User;
}

export interface PermissionGrantRequest {
  permission_key: string;
  permission_value?: string;
  expires_at?: string;
}

export const userPermissionService = {
  async getUserPermissions(userId: number): Promise<ApiResponse<{ user: User; permissions: UserPermission[] }>> {
    try {
      return await api.get<ApiResponse<{ user: User; permissions: UserPermission[] }>>(
        `/admin/user-permissions/users/${userId}/permissions`
      );
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return {
        success: false,
        message: 'Failed to load user permissions',
        data: { user: {} as User, permissions: [] }
      };
    }
  },

  async grantUserPermission(userId: number, data: PermissionGrantRequest): Promise<ApiResponse<UserPermission>> {
    try {
      return await api.post<ApiResponse<UserPermission>>(
        `/admin/user-permissions/users/${userId}/permissions`,
        data
      );
    } catch (error) {
      console.error('Error granting user permission:', error);
      return {
        success: false,
        message: 'Failed to grant permission',
        data: {} as UserPermission
      };
    }
  },

  async updateUserPermission(userId: number, permissionId: number, data: Partial<PermissionGrantRequest> & { is_active?: boolean }): Promise<ApiResponse<UserPermission>> {
    try {
      return await api.put<ApiResponse<UserPermission>>(
        `/admin/user-permissions/users/${userId}/permissions/${permissionId}`,
        data
      );
    } catch (error) {
      console.error('Error updating user permission:', error);
      return {
        success: false,
        message: 'Failed to update permission',
        data: {} as UserPermission
      };
    }
  },

  async revokeUserPermission(userId: number, permissionId: number): Promise<ApiResponse<null>> {
    try {
      return await api.delete<ApiResponse<null>>(
        `/admin/user-permissions/users/${userId}/permissions/${permissionId}`
      );
    } catch (error) {
      console.error('Error revoking user permission:', error);
      return {
        success: false,
        message: 'Failed to revoke permission',
        data: null
      };
    }
  },

  async getAllUsersWithPermissions(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<{ data: (User & { permissions: UserPermission[] })[]; pagination?: any }>> {
    try {
      return await api.get<ApiResponse<{ data: (User & { permissions: UserPermission[] })[]; pagination?: any }>>(
        '/admin/user-permissions/users-with-permissions',
        params
      );
    } catch (error) {
      console.error('Error getting all users with permissions:', error);
      return {
        success: false,
        message: 'Failed to load users',
        data: { data: [], pagination: { total: 0, page: 1, limit: 10, pages: 1 } }
      };
    }
  },

  async checkUserPermission(userId: number, permissionKey: string): Promise<ApiResponse<{ has_permission: boolean; permission: UserPermission | null }>> {
    try {
      return await api.get<ApiResponse<{ has_permission: boolean; permission: UserPermission | null }>>(
        `/admin/user-permissions/users/${userId}/check-permission?permission_key=${permissionKey}`
      );
    } catch (error) {
      console.error('Error checking user permission:', error);
      return {
        success: false,
        message: 'Failed to check permission',
        data: { has_permission: false, permission: null }
      };
    }
  }
};