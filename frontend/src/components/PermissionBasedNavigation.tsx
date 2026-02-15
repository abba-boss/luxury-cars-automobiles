import { useAuth } from '@/hooks/useAuth';
import { Car, Package, ShoppingCart, MessageSquare, Star, BarChart3, Users, Settings, ShieldCheckIcon, Home, Tag, Image, Calendar, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface PermissionBasedNavigationProps {
  variant?: 'sidebar' | 'mobile';
  className?: string;
}

export const PermissionBasedNavigation = ({ variant = 'sidebar', className = '' }: PermissionBasedNavigationProps) => {
  const { user, hasPermission, isAdmin, isStaff } = useAuth();
  const location = useLocation();

  // Define navigation items with required permissions
  const navigationItems = [
    // Admin-specific items
    {
      title: 'Dashboard',
      path: '/admin',
      icon: BarChart3,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'All Orders',
      path: '/admin/orders',
      icon: Package,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'Car Management',
      path: '/admin/cars',
      icon: Car,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'Add New Car',
      path: '/admin/add-car',
      icon: Car,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'Brand Management',
      path: '/admin/brands',
      icon: Tag,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'Media Manager',
      path: '/admin/media',
      icon: Image,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'User Management',
      path: '/admin/users',
      icon: Users,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'User Permissions',
      path: '/admin/user-permissions',
      icon: ShieldCheckIcon,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'Bookings',
      path: '/admin/bookings',
      icon: Calendar,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'Reviews',
      path: '/admin/reviews',
      icon: Star,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'Homepage Controls',
      path: '/admin/homepage',
      icon: Home,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'Notifications',
      path: '/admin/notifications',
      icon: Bell,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      permissions: [],
      roles: ['admin'],
      visible: isAdmin
    },
    // Staff-specific items with permission requirements
    {
      title: 'Dashboard',
      path: '/staff',
      icon: BarChart3,
      permissions: ['view_reports'],
      roles: ['staff'],
      visible: isStaff
    },
    {
      title: 'Inventory',
      path: '/staff/vehicles',
      icon: Car,
      permissions: ['manage_inventory'],
      roles: ['staff'],
      visible: isStaff
    },
    {
      title: 'Add Vehicle',
      path: '/staff/vehicles/new',
      icon: Car,
      permissions: ['manage_inventory'],
      roles: ['staff'],
      visible: isStaff
    },
    {
      title: 'Orders',
      path: '/staff/orders',
      icon: ShoppingCart,
      permissions: ['view_orders'],
      roles: ['staff'],
      visible: isStaff
    },
    {
      title: 'Inquiries',
      path: '/staff/inquiries',
      icon: MessageSquare,
      permissions: ['respond_to_inquiries'],
      roles: ['staff'],
      visible: isStaff
    },
    {
      title: 'Reviews',
      path: '/staff/reviews',
      icon: Star,
      permissions: ['manage_reviews'],
      roles: ['staff'],
      visible: isStaff
    },
    {
      title: 'Customers',
      path: '/staff/customers',
      icon: Users,
      permissions: ['manage_customers'],
      roles: ['staff'],
      visible: isStaff
    },
    {
      title: 'Reports',
      path: '/staff/reports',
      icon: BarChart3,
      permissions: ['view_reports'],
      roles: ['staff'],
      visible: isStaff
    },
    {
      title: 'Settings',
      path: '/staff/settings',
      icon: Settings,
      permissions: ['access_system_settings'],
      roles: ['staff'],
      visible: isStaff
    },
  ];

  // Filter items based on user permissions
  const filteredItems = navigationItems.filter(item => {
    // If user is not staff/admin, hide staff/admin items
    if (!item.visible) return false;
    
    // If item requires specific permissions, check if user has them
    if (item.permissions.length > 0) {
      return item.permissions.every(perm => hasPermission(perm));
    }
    
    // If no specific permissions required, just check role
    return true;
  });

  const isActive = (path: string) => location.pathname === path;

  if (variant === 'sidebar') {
    return (
      <nav className={`p-2 ${className}`}>
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  // For mobile navigation
  return (
    <nav className={`flex flex-wrap gap-2 p-2 ${className}`}>
      {filteredItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-colors ${
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};