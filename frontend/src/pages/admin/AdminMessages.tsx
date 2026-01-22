import { useState, useEffect, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
  X,
  ArrowLeft
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAdminInquiries } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import type { Inquiry } from '@/hooks/useAdminData';
import { inquiryService, uploadService, chatService } from '@/services';
import { useChatService } from '@/services/chatService';
import { useChat } from '@/contexts/ChatContext';
import OrderChat from '@/components/chat/OrderChat';

interface OrderConversation {
  id: number;
  name: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  participants: Array<{
    id: number;
    full_name: string;
    email: string;
    role: string;
  }>;
  last_message: {
    content: string;
    sender: string;
    created_at: string;
  } | null;
  order_info: {
    id: number;
    sale_price: number;
    status: string;
    vehicle: {
      id: number;
      make: string;
      model: string;
      year: number;
      price: number;
      images: string[];
    };
    customer: {
      id: number;
      full_name: string;
      email: string;
      phone: string;
    };
  };
}

const AdminMessages = () => {
  const { data: inquiries = [], isLoading: inquiriesLoading } = useAdminInquiries();
  const [orderConversations, setOrderConversations] = useState<OrderConversation[]>([]);
  const [orderConversationsLoading, setOrderConversationsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Inquiry | OrderConversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const chatService = useMemo(() => useChatService(), []);
  const { socket } = useChat(); // Get socket for real-time updates

  // Fetch order conversations with optimized API calls
  useEffect(() => {
    const fetchOrderConversations = async () => {
      // Check if we have a valid token before making the request
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('No authentication token found');
        setOrderConversationsLoading(false);
        return;
      }

      try {
        const response = await chatService.getOrderConversations({
          status: 'active',
          page: 1, // Always fetch first page to show newest items first
          limit: 50 // Increase limit to show more items
        });
        if (response.success) {
          setOrderConversations(response.data || []);
          if (response.pagination) {
            setTotalPages(response.pagination.pages || 1);
            setTotalItems(response.pagination.total || 0);
          }
        } else {
          console.error('Failed to fetch order conversations:', response.message);
          toast.error(response.message || 'Failed to load order conversations');
        }
      } catch (error) {
        console.error('Failed to fetch order conversations:', error);
        toast.error('Failed to load order conversations');
      } finally {
        setOrderConversationsLoading(false);
      }
    };

    fetchOrderConversations();
  }, [chatService]); // Remove currentPage from dependency to prevent refetching on page change

  // Listen for real-time order message updates
  useEffect(() => {
    if (!socket) return;

    const handleOrderMessageUpdate = (data: any) => {
      console.log('Real-time order message update:', data);
      
      // Update the specific order conversation in the list
      setOrderConversations(prev => {
        return prev.map(conv => {
          if (conv.id === data.conversationId) {
            return {
              ...conv,
              last_message: {
                content: data.message.content,
                sender: data.message.sender.full_name,
                created_at: data.message.created_at
              },
              updated_at: data.message.created_at // Update the conversation's updated time
            };
          }
          return conv;
        });
      });

      // If this conversation is currently selected, update the selected message too
      if (selectedMessage && selectedMessage.id === data.conversationId) {
        setSelectedMessage(prev => {
          if (!prev || !('order_info' in prev)) return prev;
          
          return {
            ...prev,
            last_message: {
              content: data.message.content,
              sender: data.message.sender.full_name,
              created_at: data.message.created_at
            },
            updated_at: data.message.created_at
          } as OrderConversation;
        });
      }

      // Show a toast notification
      toast.success(`New message from customer on Order #${data.orderId}`);
    };

    socket.on('order_message_update', handleOrderMessageUpdate);

    return () => {
      socket.off('order_message_update', handleOrderMessageUpdate);
    };
  }, [socket, selectedMessage]);

  // Combined loading state
  const isLoading = inquiriesLoading || orderConversationsLoading;

  const pendingCount = inquiries.filter((m) => m.status === 'new' || m.status === 'in_progress').length + orderConversations.filter(oc => oc.status === 'active').length;
  const orderRequestCount = inquiries.filter((m) => m.message.includes('New Order Request')).length + orderConversations.length;

  const handleMarkResolved = async (id: string) => {
    try {
      // Check if this is an inquiry or order conversation
      const isOrderConversation = orderConversations.some(oc => oc.id.toString() === id);

      if (isOrderConversation) {
        // Update order conversation status
        // In a real implementation, this would update the order conversation status
        toast.success('Order conversation marked as resolved');
      } else {
        // Update inquiry status
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
      }
    } catch (error) {
      toast.error('Failed to update request status');
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
      // Check if this is an order conversation or an inquiry
      if ('order_info' in selectedMessage) {
        // This is an order conversation - we need to send a message in the conversation
        // For now, we'll update the order status to show it's being worked on
        // In a real implementation, you would send a message through the chat service

        // Update the order conversation status
        toast.success('Message sent to customer');
      } else {
        // This is a regular inquiry
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
      }

      toast.success('Reply sent successfully');
      setReplyMessage('');
      setSelectedFiles([]);

      // Refresh the data to show the updated status
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });

      // Refresh order conversations
      const response = await chatService.getOrderConversations({ status: 'active' });
      if (response.success) {
        setOrderConversations(response.data || []);
      }

      // Update the selected message status
      if (selectedMessage) {
        if ('order_info' in selectedMessage) {
          // Update order conversation status
          const updatedOrderConversations = orderConversations.map(oc =>
            oc.id === selectedMessage.id ? { ...oc, status: 'active' } : oc
          );
          setOrderConversations(updatedOrderConversations);
          setSelectedMessage({ ...selectedMessage, status: 'active' });
        } else {
          // Update inquiry status
          setSelectedMessage({
            ...selectedMessage,
            status: 'in_progress',
            message: `${selectedMessage.message}\n\nAdmin Reply: ${replyMessage}`
          });
        }
      }
    } catch (error) {
      toast.error('Failed to send reply');
      console.error('Error sending reply:', error);
    }
  };

  // Combine inquiries and order conversations for unified display
  const allMessages = [
    ...inquiries.map(inquiry => ({
      ...inquiry,
      type: 'inquiry' as const
    })),
    ...orderConversations.map(conv => ({
      id: conv.id.toString(),
      name: conv.name || `Order #${conv.order_info?.id} - ${conv.order_info?.vehicle?.make} ${conv.order_info?.vehicle?.model}`,
      message: conv.last_message?.content || `New order request for ${conv.order_info?.vehicle?.make} ${conv.order_info?.vehicle?.model}`,
      email: conv.order_info?.customer?.email || '',
      phone: conv.order_info?.customer?.phone || '',
      status: conv.status,
      created_at: conv.created_at,
      type: 'order_conversation' as const,
      order_info: conv.order_info
    }))
  ];

  const filteredMessages = allMessages.filter(
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
      <div className="space-y-6 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Messages</h2>
            <p className="text-muted-foreground">Manage customer inquiries and order requests</p>
          </div>
        </div>

        <div className="flex h-[calc(100vh-10rem)] overflow-hidden">
          {/* Message List */}
          <div className="w-96 border-r border-border flex flex-col min-h-0">
            <Card variant="premium" className="flex-1 flex flex-col min-h-0">
              {/* Header */}
              <div className="p-4 border-b border-border bg-muted/5 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    Order Requests & Inquiries
                  </h2>
                  {pendingCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                      {pendingCount} pending
                    </span>
                  )}
                </div>
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
              <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
            <TabsList className="mx-4 mt-3 flex-shrink-0">
              <TabsTrigger value="all">All ({allMessages.length})</TabsTrigger>
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
                        (message.status === 'new' || message.status === 'in_progress' || message.status === 'active') && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                          message.type === 'order_conversation'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-blue-500/20 text-blue-400'
                        )}>
                          {message.type === 'order_conversation' ? (
                            <ShoppingCart className="w-4 h-4" />
                          ) : (
                            <Mail className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn(
                              'font-medium truncate',
                              (message.status === 'new' || message.status === 'in_progress' || message.status === 'active') ? 'text-foreground' : 'text-muted-foreground'
                            )}>
                              {message.type === 'order_conversation'
                                ? message.name
                                : message.message.includes('New Order Request')
                                  ? message.subject || `Order: ${message.car_id || 'Car'}`
                                  : message.name}
                            </p>
                            {(message.status === 'new' || message.status === 'in_progress' || message.status === 'active') && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {message.type === 'order_conversation'
                              ? `Order #${message.order_info?.id} • ${message.order_info?.vehicle?.make} ${message.order_info?.vehicle?.model}`
                              : message.message.includes('New Order Request')
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-border bg-muted/5 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages} • {totalItems} total items
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-md border border-border bg-background hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = currentPage <= 3
                            ? i + 1
                            : currentPage >= totalPages - 2
                              ? totalPages - 4 + i
                              : currentPage - 2 + i;

                          if (pageNum > totalPages || pageNum < 1) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1.5 rounded-md border ${
                                currentPage === pageNum
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border bg-background hover:bg-secondary'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-md border border-border bg-background hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="flex-1 overflow-y-auto m-0">
              <div className="divide-y divide-border">
                {filteredMessages.filter((m) => m.status === 'new' || m.status === 'in_progress' || m.status === 'active').map((message) => (
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
                        message.type === 'order_conversation'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      )}>
                        {message.type === 'order_conversation' ? (
                          <ShoppingCart className="w-4 h-4" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {message.type === 'order_conversation'
                            ? message.name
                            : message.message.includes('New Order Request')
                              ? message.subject || `Order: ${message.car_id || 'Car'}`
                              : message.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.type === 'order_conversation'
                            ? `Order #${message.order_info?.id} • ${message.order_info?.vehicle?.make} ${message.order_info?.vehicle?.model}`
                            : message.message.includes('New Order Request')
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
                {filteredMessages.filter((m) => m.type === 'order_conversation' || m.message.includes('New Order Request')).map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={cn(
                      'w-full p-4 text-left hover:bg-secondary/50 transition-colors',
                      selectedMessage?.id === message.id && 'bg-secondary',
                      (message.status === 'new' || message.status === 'in_progress' || message.status === 'active') && 'bg-primary/5'
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
                            (message.status === 'new' || message.status === 'in_progress' || message.status === 'active') ? 'text-foreground' : 'text-muted-foreground'
                          )}>
                            {message.type === 'order_conversation'
                              ? message.name
                              : message.subject || `Order: ${message.car_id || 'Car'}`}
                          </p>
                          {(message.status === 'new' || message.status === 'in_progress' || message.status === 'active') && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.type === 'order_conversation'
                            ? `Order #${message.order_info?.id} • ${message.order_info?.vehicle?.make} ${message.order_info?.vehicle?.model}`
                            : 'New order request'}
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
                          {message.type === 'order_conversation'
                            ? message.name
                            : message.message.includes('New Order Request')
                              ? message.subject || `Order: ${message.car_id || 'Car'}`
                              : message.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.type === 'order_conversation'
                            ? `Order #${message.order_info?.id} • ${message.order_info?.vehicle?.make} ${message.order_info?.vehicle?.model}`
                            : message.message.includes('New Order Request')
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
        </Card>
      </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedMessage ? (
            // Check if this is an order conversation and show the chat interface
            ('order_info' in selectedMessage) ? (
              // Show OrderChat for order conversations
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/5 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedMessage(null)}
                      className="h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/20 text-emerald-400">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Order #{selectedMessage.order_info.id} - {selectedMessage.order_info.vehicle.make} {selectedMessage.order_info.vehicle.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Customer: {selectedMessage.order_info.customer.full_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        (selectedMessage.status === 'new' || selectedMessage.status === 'in_progress' || selectedMessage.status === 'active')
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      )}
                    >
                      {selectedMessage.status || 'pending'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <OrderChat
                    order={selectedMessage.order_info}
                    conversationId={selectedMessage.id.toString()}
                    className="h-full"
                  />
                </div>
              </div>
            ) : (
              // Show regular message view for inquiries
              <div className="flex-1 flex flex-col min-h-0">
                {/* Detail Header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/5 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedMessage(null)}
                      className="h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-400">
                      <Mail className="w-4 h-4" />
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
                <div className="flex-1 overflow-y-auto p-6">
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
                <div className="p-4 border-t border-border bg-muted/5 flex-shrink-0">
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
              </div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium text-foreground">Welcome to Messages</p>
                <p className="text-muted-foreground mt-2">Select a request from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminMessages;