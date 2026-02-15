import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Component to ensure user permissions are loaded when mounted
export const EnsurePermissionsLoaded = () => {
  const { user, refreshPermissions, getActivePermissions } = useAuth();

  useEffect(() => {
    const loadPermissions = async () => {
      // Only refresh if user exists and doesn't have permissions loaded yet
      if (user && (!user.permissions || user.permissions.length === 0)) {
        await refreshPermissions();
      }
    };

    loadPermissions();
  }, [user, refreshPermissions]);

  return null; // This component doesn't render anything
};