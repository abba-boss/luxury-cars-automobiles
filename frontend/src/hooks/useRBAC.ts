import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

// Define permission requirements for different routes/features
const PERMISSION_REQUIREMENTS = {
  // Admin routes
  '/admin': [],
  '/admin/orders': [],
  '/admin/cars': [],
  '/admin/add-car': [],
  '/admin/brands': [],
  '/admin/media': [],
  '/admin/users': [],
  '/admin/user-permissions': [],
  '/admin/bookings': [],
  '/admin/reviews': [],
  '/admin/homepage': [],
  '/admin/notifications': [],
  '/admin/settings': [],
  
  // Staff routes
  '/staff': ['view_reports'],
  '/staff/vehicles': ['manage_inventory'],
  '/staff/vehicles/new': ['manage_inventory'],
  '/staff/orders': ['view_orders'],
  '/staff/inquiries': ['respond_to_inquiries'],
  '/staff/reviews': ['manage_reviews'],
  '/staff/customers': ['manage_customers'],
  '/staff/reports': ['view_reports'],
  '/staff/settings': ['access_system_settings'],
  
  // Premium features
  '/premium': ['view_premium_inventory'],
  '/test-drive': ['schedule_test_drive'],
  '/promotions/exclusive': ['exclusive_promotions'],
};

// Hook to check if user has access to a specific route
export const useRoutePermission = (route: string) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, isStaff, user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRoutePermission = async () => {
      try {
        setLoading(true);

        // Check if route has specific permission requirements
        const requiredPermissions = PERMISSION_REQUIREMENTS[route as keyof typeof PERMISSION_REQUIREMENTS] || [];

        // If no specific permissions required, check basic role access
        if (requiredPermissions.length === 0) {
          // Admin routes - only for admins
          if (route.startsWith('/admin')) {
            setHasAccess(isAdmin);
          } 
          // Staff routes - only for staff or admins
          else if (route.startsWith('/staff')) {
            setHasAccess(isStaff);
          }
          // Other routes - check if user is authenticated
          else {
            setHasAccess(!!user);
          }
        } else {
          // Check if user has all required permissions
          const hasRequiredPermissions = requiredPermissions.every(perm => hasPermission(perm));
          setHasAccess(hasRequiredPermissions);
        }
      } catch (error) {
        console.error('Error checking route permission:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkRoutePermission();
    } else {
      setHasAccess(false);
      setLoading(false);
    }
  }, [route, user, hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, isStaff]);

  return { hasAccess, loading };
};

// Component to conditionally render content based on permissions
interface RequirePermissionProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequirePermission = ({ permission, children, fallback = null }: RequirePermissionProps) => {
  const { hasPermission } = useAuth();
  const hasPerm = hasPermission(permission);

  return hasPerm ? <>{children}</> : <>{fallback}</>;
};

// Component to conditionally render content based on any of multiple permissions
interface RequireAnyPermissionProps {
  permissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireAnyPermission = ({ permissions, children, fallback = null }: RequireAnyPermissionProps) => {
  const { hasAnyPermission } = useAuth();
  const hasPerm = hasAnyPermission(permissions);

  return hasPerm ? <>{children}</> : <>{fallback}</>;
};

// Component to conditionally render content based on all of multiple permissions
interface RequireAllPermissionsProps {
  permissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireAllPermissions = ({ permissions, children, fallback = null }: RequireAllPermissionsProps) => {
  const { hasAllPermissions } = useAuth();
  const hasPerm = hasAllPermissions(permissions);

  return hasPerm ? <>{children}</> : <>{fallback}</>;
};

// Function to get all available routes for a user based on their permissions
export const useAvailableRoutes = () => {
  const { user, hasPermission, isAdmin, isStaff } = useAuth();
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setAvailableRoutes([]);
      return;
    }

    const routes: string[] = [];

    // Add routes based on role
    if (isAdmin) {
      // Add all admin routes
      Object.keys(PERMISSION_REQUIREMENTS).forEach(route => {
        if (route.startsWith('/admin')) {
          routes.push(route);
        }
      });
      
      // Add staff routes for admins too
      Object.keys(PERMISSION_REQUIREMENTS).forEach(route => {
        if (route.startsWith('/staff')) {
          const requiredPerms = PERMISSION_REQUIREMENTS[route as keyof typeof PERMISSION_REQUIREMENTS] || [];
          if (requiredPerms.every((perm: string) => hasPermission(perm))) {
            routes.push(route);
          }
        }
      });
    } else if (isStaff) {
      // Add staff routes if user has required permissions
      Object.keys(PERMISSION_REQUIREMENTS).forEach(route => {
        if (route.startsWith('/staff')) {
          const requiredPerms = PERMISSION_REQUIREMENTS[route as keyof typeof PERMISSION_REQUIREMENTS] || [];
          if (requiredPerms.every((perm: string) => hasPermission(perm))) {
            routes.push(route);
          }
        }
      });
    }

    // Add other routes based on specific permissions
    Object.entries(PERMISSION_REQUIREMENTS).forEach(([route, perms]) => {
      if (!route.startsWith('/admin') && !route.startsWith('/staff')) {
        if (perms.length === 0) {
          routes.push(route);
        } else if (perms.every((perm: string) => hasPermission(perm))) {
          routes.push(route);
        }
      }
    });

    setAvailableRoutes(routes);
  }, [user, hasPermission, isAdmin, isStaff]);

  return availableRoutes;
};