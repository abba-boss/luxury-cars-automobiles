import { useState } from 'react';
import {
  Search,
  Mail,
  MessageSquare,
  Phone,
  Star,
  Archive,
  Trash2,
  Reply,
  MoreVertical,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAdminInquiries } from '@/hooks/useAdminData';
import { localDb } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import type { Inquiry } from '@/hooks/useAdminData';

const AdminMessages = () => {
  const { data: inquiries, isLoading } = useAdminInquiries();
  const [selectedMessage, setSelectedMessage] = useState<Inquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const pendingCount = inquiries?.filter((m) => m.status === 'pending').length || 0;

  const handleMarkResolved = async (id: string) => {
    try {
      // Mock resolve for local database
      toast.success('Marked as resolved');
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
    } catch (error) {
      toast.error('Failed to update inquiry');
    }
  };

  const filteredMessages = (inquiries || []).filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-10rem)]">
        {/* Message List */}
        <div className="w-[400px] border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Inquiries
              {pendingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                  {pendingCount} pending
                </span>
              )}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search inquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-3">
              <TabsTrigger value="all">All ({inquiries?.length || 0})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 overflow-y-auto m-0">
              <div className="divide-y divide-border">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No inquiries yet</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={cn(
                        'w-full p-4 text-left hover:bg-secondary/50 transition-colors',
                        selectedMessage?.id === message.id && 'bg-secondary',
                        message.status === 'pending' && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500/20 text-blue-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn(
                              'font-medium truncate', 
                              message.status === 'pending' ? 'text-foreground' : 'text-muted-foreground'
                            )}>
                              {message.name}
                            </p>
                            {message.status === 'pending' && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">{message.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.created_at ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true }) : 'Recently'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="flex-1 overflow-y-auto m-0">
              <div className="divide-y divide-border">
                {filteredMessages.filter((m) => m.status === 'pending').map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={cn(
                      'w-full p-4 text-left hover:bg-secondary/50 transition-colors',
                      selectedMessage?.id === message.id && 'bg-secondary',
                      'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500/20 text-blue-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{message.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.created_at ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true }) : 'Recently'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resolved" className="flex-1 overflow-y-auto m-0">
              <div className="divide-y divide-border">
                {filteredMessages.filter((m) => m.status === 'resolved').map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={cn(
                      'w-full p-4 text-left hover:bg-secondary/50 transition-colors',
                      selectedMessage?.id === message.id && 'bg-secondary'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500/20 text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-muted-foreground truncate">{message.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.created_at ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true }) : 'Recently'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Detail Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{selectedMessage.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMessage.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      selectedMessage.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    )}
                  >
                    {selectedMessage.status || 'pending'}
                  </span>
                  {selectedMessage.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMarkResolved(selectedMessage.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>

              {/* Detail Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <span>
                    {selectedMessage.created_at ? formatDistanceToNow(new Date(selectedMessage.created_at), { addSuffix: true }) : 'Recently'}
                  </span>
                  {selectedMessage.phone && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selectedMessage.phone}
                      </span>
                    </>
                  )}
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed">{selectedMessage.message}</p>
                </div>

                {selectedMessage.car_id && (
                  <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border">
                    <p className="text-sm text-muted-foreground">Inquiry about car:</p>
                    <p className="text-foreground font-medium">{selectedMessage.car_id}</p>
                  </div>
                )}
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-3">
                  <Input placeholder="Type your reply..." className="flex-1" />
                  <Button className="gap-2">
                    <Reply className="w-4 h-4" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Select an inquiry to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
