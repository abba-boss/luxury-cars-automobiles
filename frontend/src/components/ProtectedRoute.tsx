import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  permission?: string;
  permissions?: string[]; // At least one of these permissions required
  allPermissions?: string[]; // All of these permissions required
  role?: 'admin' | 'staff' | 'user';
  fallbackPath?: string;
}

export const ProtectedRoute = ({
  children,
  permission,
  permissions,
  allPermissions,
  role,
  fallbackPath = '/auth'
}: ProtectedRouteProps) => {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions, loading } = useAuth();
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to load
      if (loading) {
        return;
      }

      // Check role if specified
      if (role && user?.role !== role) {
        setHasAccess(false);
        return;
      }

      // Check single permission if specified
      if (permission && !hasPermission(permission)) {
        setHasAccess(false);
        return;
      }

      // Check any of the permissions if specified
      if (permissions && !hasAnyPermission(permissions)) {
        setHasAccess(false);
        return;
      }

      // Check all of the permissions if specified
      if (allPermissions && !hasAllPermissions(allPermissions)) {
        setHasAccess(false);
        return;
      }

      // If we got here, user has access
      setHasAccess(true);
    };

    checkAccess();
  }, [user, loading, permission, permissions, allPermissions, role, hasPermission, hasAnyPermission, hasAllPermissions]);

  // While loading, show nothing or a spinner
  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user doesn't have access, redirect
  if (!hasAccess) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // If user has access, render the child component
  return children;
};