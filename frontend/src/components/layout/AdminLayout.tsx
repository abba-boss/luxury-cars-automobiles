import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Image,
  Calendar,
  Star,
  Home,
  Bell,
  Search,
  Tag,
  Menu,
  ShieldCheckIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { PermissionBasedNavigation } from '@/components/PermissionBasedNavigation';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const currentPage = navItems.find((item) => item.href === location.pathname);

  return (
    <div className="min-h-screen bg-background flex w-full overflow-x-hidden">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-50 transition-all duration-300',
          collapsed ? 'w-16 sm:w-20' : 'w-60 max-w-[80%]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={cn(
          'h-14 sm:h-16 px-3 sm:px-4 flex items-center border-b border-border',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          <Link to="/admin" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-red">
              <span className="text-primary-foreground font-bold text-xs sm:text-sm">SM</span>
            </div>
            {!collapsed && (
              <div className="animate-fade-in hidden sm:block">
                <span className="font-bold text-foreground text-base sm:text-lg">Sarkin Mota</span>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Admin Panel</p>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn('hidden lg:flex', collapsed && 'hidden sm:block')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <PermissionBasedNavigation variant="sidebar" />

        {/* Footer */}
        <div className="p-2 sm:p-3 border-t border-border space-y-1">
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(false)}
              className="w-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
          <Link
            to="/"
            className={cn(
              'flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors',
              collapsed && 'justify-center'
            )}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            {!collapsed && <span className="font-medium text-xs sm:text-sm">Back to Website</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className={cn(
              'flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full',
              collapsed && 'justify-center'
            )}
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            {!collapsed && <span className="font-medium text-xs sm:text-sm">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        'flex-1 transition-all duration-300',
        collapsed ? 'lg:ml-16 lg:sm:ml-20' : 'lg:ml-60 lg:sm:ml-64'
      )}>
        {/* Top Bar */}
        <header className="h-14 sm:h-16 px-3 sm:px-4 lg:px-8 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-foreground">
                {currentPage?.label || 'Dashboard'}
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                Manage your automotive business
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-32 sm:w-64 pl-8 sm:pl-9 bg-secondary border-border focus:border-primary text-xs sm:text-sm py-2"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse" />
            </Button>

            {/* User */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-border">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-semibold text-primary">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:block text-xs sm:text-sm">
                <p className="font-medium text-foreground">{user?.email?.split('@')[0] || 'Admin'}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-3 sm:p-4 lg:p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
