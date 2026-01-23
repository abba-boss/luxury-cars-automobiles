import { useState, useEffect, useCallback } from 'react';
import { Bell, X, Car, MessageSquare, Calendar, Info, Check, CheckCheck, Filter, Settings, Mail, User, CreditCard, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { notificationService } from '@/services';
import { toast } from 'sonner';
import type { Notification as NotificationType } from '@/types/api';

interface Notification extends NotificationType {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const EnhancedNotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'order' | 'message' | 'payment'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getUserNotifications({ limit: 50 });
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let result = [...notifications];
    
    // Apply type filter
    if (filter !== 'all') {
      switch(filter) {
        case 'order':
          result = result.filter(n => n.type.includes('order'));
          break;
        case 'message':
          result = result.filter(n => n.type.includes('message'));
          break;
        case 'payment':
          result = result.filter(n => n.type.includes('payment'));
          break;
        case 'unread':
          result = result.filter(n => !n.is_read);
          break;
        case 'read':
          result = result.filter(n => n.is_read);
          break;
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredNotifications(result);
  }, [notifications, filter, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      toast.success("Notification marked as read");
    } catch (error: any) {
      toast.error(error.message || "Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read");
    } catch (error: any) {
      toast.error(error.message || "Failed to mark all notifications as read");
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (error: any) {
      toast.error(error.message || "Failed to clear notifications");
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Notification deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete notification");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order_new':
      case 'order_update':
        return <Package className="w-4 h-4" />;
      case 'order_message':
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'payment_update':
      case 'payment':
        return <CreditCard className="w-4 h-4" />;
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
      case 'order_pending':
        return <Clock className="w-4 h-4" />;
      case 'order_confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'order_cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'order_new':
      case 'order_update':
        return 'bg-blue-500/20 text-blue-400';
      case 'order_message':
      case 'message':
        return 'bg-indigo-500/20 text-indigo-400';
      case 'payment_update':
      case 'payment':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'appointment':
        return 'bg-amber-500/20 text-amber-400';
      case 'order_pending':
        return 'bg-amber-500/20 text-amber-400';
      case 'order_confirmed':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'order_cancelled':
        return 'bg-destructive/20 text-destructive';
      case 'user':
        return 'bg-violet-500/20 text-violet-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[420px] p-0 bg-card border-border"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
              className="text-xs h-7"
            >
              {sortBy === 'newest' ? 'Oldest' : 'Newest'}
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-7"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-border">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'order', label: 'Orders', count: notifications.filter(n => n.type.includes('order')).length },
            { key: 'message', label: 'Messages', count: notifications.filter(n => n.type.includes('message')).length },
            { key: 'payment', label: 'Payments', count: notifications.filter(n => n.type.includes('payment')).length },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex-1 py-2 text-xs font-medium capitalize ${filter === tab.key ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setFilter(tab.key as any)}
            >
              {tab.label} {tab.count > 0 && <span className="ml-1">({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1">All caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'p-4 border-b border-border/50 transition-colors hover:bg-secondary/50',
                  !notification.is_read && 'bg-primary/5'
                )}
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                      getIconColor(notification.type)
                    )}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-foreground truncate">
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(notification.created_at)}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 w-6 p-0 text-xs"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-6 w-6 p-0 text-xs text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Clear all
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default EnhancedNotificationCenter;