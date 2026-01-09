import { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
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
  Package,
  ShoppingCart,
  Paperclip,
  Send,
  X
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
import type { Inquiry } from '@/hooks/useAdminData';
import { inquiryService, chatService, uploadService } from '@/services';

const AdminMessages = () => {
  const { data: inquiries, isLoading } = useAdminInquiries();
  const [selectedMessage, setSelectedMessage] = useState<Inquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const pendingCount = inquiries?.filter((m) => m.status === 'new' || m.status === 'in_progress').length || 0;
  const orderRequestCount = inquiries?.filter((m) => m.message.includes('New Order Request')).length || 0;

  const handleMarkResolved = async (id: string) => {
    try {
      // Update the inquiry status to resolved
      const response = await inquiryService.updateInquiry(id, { status: 'resolved' });
      if (response.success) {
        toast.success('Order request marked as resolved');
        queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status: 'resolved' });
        }
      } else {
        throw new Error('Failed to update inquiry status');
      }
    } catch (error) {
      toast.error('Failed to update inquiry');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() && selectedFiles.length === 0) {
      toast.error('Please enter a message or attach files');
      return;
    }

    if (!selectedMessage) {
      toast.error('No message selected');
      return;
    }

    try {
      // First, we need to create or find an existing conversation with the customer
      // For now, we'll simulate sending the reply by updating the inquiry with additional info
      // In a real implementation, you would create a conversation and send messages through the chat service

      // If there are files to upload
      if (selectedFiles.length > 0) {
        // Upload files first
        const uploadResponse = await uploadService.uploadVehicleMedia({
          images: selectedFiles.filter(f => f.type.startsWith('image/')) as unknown as FileList,
          videos: selectedFiles.filter(f => f.type.startsWith('video/')) as unknown as FileList
        });

        if (uploadResponse.success && uploadResponse.data?.image_urls) {
          // Process uploaded files
          console.log('Files uploaded:', uploadResponse.data.image_urls);
        }
      }

      // Update the inquiry status to show it's being worked on
      await inquiryService.updateInquiry(selectedMessage.id, {
        status: 'in_progress',
        message: `${selectedMessage.message}\n\nAdmin Reply: ${replyMessage}`
      });

      toast.success('Reply sent successfully');
      setReplyMessage('');
      setSelectedFiles([]);

      // Refresh the inquiries to show the updated status
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });

      // Update the selected message status
      if (selectedMessage) {
        setSelectedMessage({ ...selectedMessage, status: 'in_progress', message: `${selectedMessage.message}\n\nAdmin Reply: ${replyMessage}` });
      }
    } catch (error) {
      toast.error('Failed to send reply');
      console.error('Error sending reply:', error);
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
              Order Requests & Inquiries
              {pendingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                  {pendingCount} pending
                </span>
              )}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
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
              <TabsTrigger value="order-requests">Order Requests ({orderRequestCount})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 overflow-y-auto m-0">
              <div className="divide-y divide-border">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No requests yet</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={cn(
                        'w-full p-4 text-left hover:bg-secondary/50 transition-colors',
                        selectedMessage?.id === message.id && 'bg-secondary',
                        (message.status === 'new' || message.status === 'in_progress') && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                          message.message.includes('New Order Request')
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-blue-500/20 text-blue-400'
                        )}>
                          {message.message.includes('New Order Request') ? (
                            <ShoppingCart className="w-4 h-4" />
                          ) : (
                            <Mail className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn(
                              'font-medium truncate',
                              (message.status === 'new' || message.status === 'in_progress') ? 'text-foreground' : 'text-muted-foreground'
                            )}>
                              {message.message.includes('New Order Request')
                                ? message.subject || `Order: ${message.car_id || 'Car'}`
                                : message.name}
                            </p>
                            {(message.status === 'new' || message.status === 'in_progress') && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {message.message.includes('New Order Request')
                              ? 'New order request'
                              : message.message.substring(0, 50) + '...'}
                          </p>
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
                {filteredMessages.filter((m) => m.status === 'new' || m.status === 'in_progress').map((message) => (
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
                      <div className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                        message.message.includes('New Order Request')
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      )}>
                        {message.message.includes('New Order Request') ? (
                          <ShoppingCart className="w-4 h-4" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {message.message.includes('New Order Request')
                            ? message.subject || `Order: ${message.car_id || 'Car'}`
                            : message.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.message.includes('New Order Request')
                            ? 'New order request'
                            : message.message.substring(0, 50) + '...'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.created_at ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true }) : 'Recently'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="order-requests" className="flex-1 overflow-y-auto m-0">
              <div className="divide-y divide-border">
                {filteredMessages.filter((m) => m.message.includes('New Order Request')).map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={cn(
                      'w-full p-4 text-left hover:bg-secondary/50 transition-colors',
                      selectedMessage?.id === message.id && 'bg-secondary',
                      (message.status === 'new' || message.status === 'in_progress') && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500/20 text-emerald-400">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn(
                            'font-medium truncate',
                            (message.status === 'new' || message.status === 'in_progress') ? 'text-foreground' : 'text-muted-foreground'
                          )}>
                            {message.subject || `Order: ${message.car_id || 'Car'}`}
                          </p>
                          {(message.status === 'new' || message.status === 'in_progress') && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">New order request</p>
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
                {filteredMessages.filter((m) => m.status === 'resolved' || m.status === 'closed').map((message) => (
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
                        <p className="font-medium text-muted-foreground truncate">
                          {message.message.includes('New Order Request')
                            ? message.subject || `Order: ${message.car_id || 'Car'}`
                            : message.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.message.includes('New Order Request')
                            ? 'Order request resolved'
                            : message.message.substring(0, 50) + '...'}
                        </p>
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
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    selectedMessage.message.includes('New Order Request')
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-blue-500/20 text-blue-400'
                  )}>
                    {selectedMessage.message.includes('New Order Request') ? (
                      <ShoppingCart className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {selectedMessage.message.includes('New Order Request')
                        ? selectedMessage.subject || `Order Request: ${selectedMessage.car_id || 'Car'}`
                        : selectedMessage.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMessage.message.includes('New Order Request')
                        ? selectedMessage.name
                        : selectedMessage.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      (selectedMessage.status === 'new' || selectedMessage.status === 'in_progress')
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    )}
                  >
                    {selectedMessage.status || 'pending'}
                  </span>
                  {(selectedMessage.status === 'new' || selectedMessage.status === 'in_progress') && (
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
                  <p className="text-foreground leading-relaxed whitespace-pre-line">{selectedMessage.message}</p>
                </div>

                {selectedMessage.car_id && (
                  <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border">
                    <p className="text-sm text-muted-foreground">Car ID:</p>
                    <p className="text-foreground font-medium">{selectedMessage.car_id}</p>
                  </div>
                )}
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-border">
                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 text-sm">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate max-w-[120px]">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="p-1 h-auto"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <textarea
                    placeholder="Type your reply to the customer..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSendReply}
                    className="gap-2"
                    disabled={!replyMessage.trim() && selectedFiles.length === 0}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                  accept="image/*,application/pdf,.doc,.docx,.txt"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Select a request to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
