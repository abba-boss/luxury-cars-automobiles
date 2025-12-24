import { useState } from 'react';
import {
  Bell,
  Check,
  Trash2,
  MoreVertical,
  Mail,
  MessageSquare,
  Calendar,
  Car,
  Star,
  User,
  Settings,
  CheckCheck,
  Filter,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'inquiry' | 'booking' | 'review' | 'sale' | 'user' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'inquiry',
    title: 'New Inquiry',
    message: 'John Doe is interested in 2024 Mercedes-Benz S-Class',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'booking',
    title: 'Test Drive Booked',
    message: 'Sarah Williams booked a test drive for BMW X7',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'review',
    title: 'New Review',
    message: 'Michael Chen left a 5-star review',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'sale',
    title: 'Car Sold!',
    message: '2023 Range Rover Sport has been marked as sold',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'user',
    title: 'New User Registration',
    message: 'Emma Johnson created an account',
    time: '5 hours ago',
    read: true,
  },
  {
    id: '6',
    type: 'system',
    title: 'Storage Warning',
    message: 'You are using 78% of your storage quota',
    time: '1 day ago',
    read: true,
  },
];

const notificationSettings = [
  { key: 'email_inquiries', label: 'Email notifications for new inquiries', enabled: true },
  { key: 'email_bookings', label: 'Email notifications for new bookings', enabled: true },
  { key: 'email_reviews', label: 'Email notifications for new reviews', enabled: false },
  { key: 'email_sales', label: 'Email notifications for car sales', enabled: true },
  { key: 'push_all', label: 'Push notifications (browser)', enabled: true },
  { key: 'weekly_digest', label: 'Weekly activity digest', enabled: true },
];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState(notificationSettings);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const toggleSetting = (key: string) => {
    setSettings(settings.map(s => s.key === key ? { ...s, enabled: !s.enabled } : s));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'inquiry': return <MessageSquare className="w-5 h-5" />;
      case 'booking': return <Calendar className="w-5 h-5" />;
      case 'review': return <Star className="w-5 h-5" />;
      case 'sale': return <Car className="w-5 h-5" />;
      case 'user': return <User className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'inquiry': return 'bg-blue-500/20 text-blue-400';
      case 'booking': return 'bg-amber-500/20 text-amber-400';
      case 'review': return 'bg-purple-500/20 text-purple-400';
      case 'sale': return 'bg-emerald-500/20 text-emerald-400';
      case 'user': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-8 h-8 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
              <p className="text-muted-foreground">Stay updated with your platform activity</p>
            </div>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 rounded-xl" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4" />
                Mark All Read
              </Button>
              <Button variant="outline" className="gap-2 rounded-xl text-destructive" onClick={clearAll}>
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-card border border-border rounded-xl p-1">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* All Notifications */}
          <TabsContent value="all" className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification, idx) => (
                <div
                  key={notification.id}
                  className={cn(
                    'rounded-2xl bg-card border p-5 transition-all animate-fade-in cursor-pointer',
                    notification.read 
                      ? 'border-border hover:border-border/80' 
                      : 'border-primary/30 bg-primary/5 hover:border-primary/50'
                  )}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getIconColor(notification.type))}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="rounded-lg flex-shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!notification.read && (
                          <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                            <Check className="w-4 h-4 mr-2" /> Mark as Read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Unread Notifications */}
          <TabsContent value="unread" className="space-y-3">
            {notifications.filter(n => !n.read).length === 0 ? (
              <div className="text-center py-12">
                <Check className="w-16 h-16 mx-auto text-emerald-400 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
                <p className="text-muted-foreground">No unread notifications</p>
              </div>
            ) : (
              notifications.filter(n => !n.read).map((notification, idx) => (
                <div
                  key={notification.id}
                  className="rounded-2xl bg-card border border-primary/30 bg-primary/5 p-5 transition-all animate-fade-in cursor-pointer hover:border-primary/50"
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getIconColor(notification.type))}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {settings.map((setting) => (
                  <div 
                    key={setting.key}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30"
                  >
                    <Label className="text-foreground cursor-pointer">{setting.label}</Label>
                    <Switch 
                      checked={setting.enabled} 
                      onCheckedChange={() => toggleSetting(setting.key)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Email Delivery</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Email notifications will be sent to your admin email address.
              </p>
              <div className="p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">admin@sarkinmota.com</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
