import type { User } from '@/types/api';

/**
 * Check if a user has a specific permission
 * @param user The user object
 * @param permissionKey The permission key to check
 * @returns Boolean indicating if the user has the permission
 */
export const hasPermission = (user: User | null, permissionKey: string): boolean => {
  if (!user || !user.permissions) {
    return false;
  }

  const now = new Date();
  
  return user.permissions.some(permission => 
    permission.permission_key === permissionKey &&
    permission.is_active === true &&
    (!permission.expires_at || new Date(permission.expires_at) > now)
  );
};

/**
 * Check if a user has any of the specified permissions
 * @param user The user object
 * @param permissionKeys Array of permission keys to check
 * @returns Boolean indicating if the user has at least one of the permissions
 */
export const hasAnyPermission = (user: User | null, permissionKeys: string[]): boolean => {
  if (!user || !user.permissions) {
    return false;
  }

  const now = new Date();
  
  return user.permissions.some(permission => 
    permissionKeys.includes(permission.permission_key) &&
    permission.is_active === true &&
    (!permission.expires_at || new Date(permission.expires_at) > now)
  );
};

/**
 * Check if a user has all of the specified permissions
 * @param user The user object
 * @param permissionKeys Array of permission keys to check
 * @returns Boolean indicating if the user has all of the permissions
 */
export const hasAllPermissions = (user: User | null, permissionKeys: string[]): boolean => {
  if (!user || !user.permissions) {
    return false;
  }

  const now = new Date();
  
  return permissionKeys.every(permissionKey => 
    user.permissions!.some(permission => 
      permission.permission_key === permissionKey &&
      permission.is_active === true &&
      (!permission.expires_at || new Date(permission.expires_at) > now)
    )
  );
};

/**
 * Get all active permissions for a user
 * @param user The user object
 * @returns Array of active permissions
 */
export const getActivePermissions = (user: User | null): string[] => {
  if (!user || !user.permissions) {
    return [];
  }

  const now = new Date();
  
  return user.permissions
    .filter(permission => 
      permission.is_active === true &&
      (!permission.expires_at || new Date(permission.expires_at) > now)
    )
    .map(permission => permission.permission_key);
};