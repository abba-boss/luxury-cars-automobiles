import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Star, 
  BarChart3, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StaffLayoutProps {
  children: React.ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { 
      title: 'Dashboard', 
      path: '/staff', 
      icon: BarChart3,
      permissions: ['view_reports']
    },
    { 
      title: 'Inventory', 
      path: '/staff/vehicles', 
      icon: Car,
      permissions: ['manage_inventory']
    },
    { 
      title: 'Orders', 
      path: '/staff/orders', 
      icon: ShoppingCart,
      permissions: ['view_orders']
    },
    { 
      title: 'Inquiries', 
      path: '/staff/inquiries', 
      icon: MessageSquare,
      permissions: ['respond_to_inquiries']
    },
    { 
      title: 'Reviews', 
      path: '/staff/reviews', 
      icon: Star,
      permissions: ['manage_reviews']
    },
    { 
      title: 'Customers', 
      path: '/staff/customers', 
      icon: Users,
      permissions: ['manage_customers']
    },
    { 
      title: 'Reports', 
      path: '/staff/reports', 
      icon: BarChart3,
      permissions: ['view_reports']
    },
    { 
      title: 'Settings', 
      path: '/staff/settings', 
      icon: Settings,
      permissions: ['access_system_settings']
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-xl font-bold">Staff Portal</h1>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 w-full p-3 rounded-lg text-sm transition-colors",
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name || user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}