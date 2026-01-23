import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { chatService, saleService } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Send,
  Package,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  CheckCircle2,
  User as UserIcon,
  User as UserAvatarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading';
import { formatDate, formatTime, formatDateTime } from '@/utils/dateUtils';

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type: string;
  status: string;
  created_at?: string;
  sender: {
    id: number;
    full_name: string;
    role: string;
  };
  localId?: string;
}

interface OrderChatProps {
  order: any;
  conversationId: string;
  className?: string;
}

const OrderChat = ({ order, conversationId, className }: OrderChatProps) => {
  const { socket, joinConversation, leaveConversation } = useChat();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load conversation messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      loadMessages();
      joinConversation(conversationId);
    }

    return () => {
      if (conversationId) {
        leaveConversation(conversationId);
      }
    };
  }, [conversationId]);

  // Handle real-time messages
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.conversation_id.toString() === conversationId) {
        setMessages(prev => {
          const exists = prev.some(msg =>
            msg.id === newMessage.id || (msg.localId && msg.localId === newMessage.localId)
          );

          if (!exists) {
            return [...prev, newMessage];
          }
          return prev.map(msg =>
            msg.localId === newMessage.localId ? newMessage : msg
          );
        });
      }
    };

    const handleTypingStart = (data: { userId: number; userName: string; conversationId: string }) => {
      if (data.conversationId === conversationId && data.userId !== user?.id) {
        setIsTyping(true);
      }
    };

    const handleTypingStop = (data: { userId: number; conversationId: string }) => {
      if (data.conversationId === conversationId && data.userId !== user?.id) {
        setIsTyping(false);
      }
    };

    const handleMessageDelivered = (data: { messageId: number; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === data.messageId ? { ...msg, status: 'delivered' } : msg
          )
        );
      }
    };

    const handleMessageRead = (data: { messageId: number; userId: number; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === data.messageId ? { ...msg, status: 'read' } : msg
          )
        );
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTypingStart);
    socket.on('user_stopped_typing', handleTypingStop);
    socket.on('message_delivered', handleMessageDelivered);
    socket.on('message_read', handleMessageRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTypingStart);
      socket.off('user_stopped_typing', handleTypingStop);
      socket.off('message_delivered', handleMessageDelivered);
      socket.off('message_read', handleMessageRead);
    };
  }, [socket, conversationId, user]);

  const loadMessages = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      const response = await chatService.getConversationMessages(conversationId);
      if (response.success) {
        setMessages(response.data || []);

        // Mark messages as read
        if (socket && user) {
          // Mark all unread messages from other participants as read
          const unreadMessages = (response.data || []).filter(msg =>
            msg.sender_id !== user.id && msg.status !== 'read'
          );

          if (unreadMessages.length > 0) {
            // Mark the most recent message as read to update the conversation
            const lastUnreadMessage = unreadMessages[unreadMessages.length - 1];
            socket.emit('message_read', {
              conversationId,
              messageId: lastUnreadMessage.id
            });
          }
        }
      } else {
        console.error('Failed to load messages:', response.message);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !conversationId || !user) return;

    const localId = `local-${Date.now()}`;
    const optimisticMessage: Message = {
      id: 0,
      localId,
      conversation_id: parseInt(conversationId),
      sender_id: user.id,
      content: message,
      message_type: 'text',
      status: 'sent',
      created_at: new Date().toISOString(),
      sender: {
        id: user.id,
        full_name: user.full_name || user.email,
        role: user.role
      }
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setMessage('');

    try {
      const response = await chatService.sendMessage(conversationId, {
        content: message
      });

      if (response.success) {
        setMessages(prev =>
          prev.map(msg =>
            msg.localId === localId ? response.data : msg
          )
        );

      } else {
        setMessages(prev => prev.filter(msg => msg.localId !== localId));
        console.error('Failed to send message:', response.message);
      }
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.localId !== localId));
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTypingStart = () => {
    if (!conversationId || !socket) return;

    socket.emit('typing_start', { conversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { conversationId });
    }, 2000);
  };

  const handleTypingStop = () => {
    if (!conversationId || !socket) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit('typing_stop', { conversationId });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="muted" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge variant="verified" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Confirmed
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="gap-1 bg-emerald-500">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      const response = await saleService.updateSale(order.id, { status: newStatus });
      if (response.success) {
        // Update the order status in the component state
        setOrder(prevOrder => ({ ...prevOrder, status: newStatus }));
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Helper function to group messages by date
  const groupMessagesByDate = () => {
    const grouped: Record<string, Message[]> = {};

    // Sort messages by date (oldest first globally)
    const sortedMessages = [...messages].sort((a, b) =>
      new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
    );

    sortedMessages.forEach(msg => {
      const date = msg.created_at ? new Date(msg.created_at).toDateString() : 'Unknown Date';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  // Format date for display
  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return 'Just now';

    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <Card variant="premium" className="flex flex-col flex-1 min-h-0 h-full">
        {/* Order Header */}
        <CardHeader className="pb-3 border-b flex-shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={order.vehicle?.images?.[0] || '/placeholder-car.jpg'}
                alt={`${order.vehicle?.make} ${order.vehicle?.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="font-semibold text-lg">
                    {order.vehicle?.make} {order.vehicle?.model} {order.vehicle?.year}
                  </h3>
                  <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  {user?.role === 'admin' && (
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(e.target.value)}
                      className="text-xs border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  )}
                  {user?.role !== 'admin' && (
                    <span className="text-xs text-muted-foreground italic">
                      Status managed by admin
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold text-primary ml-1">
                    ${parseFloat(order.sale_price).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-1">
                    {formatDate(order.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Messages Area - Scrollable */}
        <CardContent className="flex-1 p-0 flex flex-col min-h-0 overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {isLoading && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Loading messages...</p>
                </div>
              )}

              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="space-y-3">
                  {/* Date separator */}
                  <div className="flex items-center justify-center my-4">
                    <div className="relative flex items-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex items-center justify-center px-4 py-1 bg-background text-xs text-muted-foreground">
                        {formatDateDisplay(date)}
                      </div>
                    </div>
                  </div>

                  {/* Messages for this date */}
                  {dateMessages.map((msg) => {
                    const isOwnMessage = msg.sender_id === user?.id;
                    const isSystemMessage = msg.message_type === 'system';
                    const messageDate = msg.created_at ? new Date(msg.created_at) : new Date();
                    const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    if (isSystemMessage) {
                      return (
                        <div key={msg.localId || msg.id} className="flex justify-center">
                          <div className="max-w-md px-4 py-2 rounded-lg bg-secondary/50 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Package className="w-4 h-4 text-primary" />
                              <span className="text-xs font-medium text-muted-foreground">
                                System Message
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-line">{msg.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {timeString}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.localId || msg.id}
                        className={cn(
                          'flex gap-3',
                          msg.sender_id === user?.id ? 'flex-row-reverse' : 'flex-row'
                        )}
                      >
                        {!isOwnMessage && (
                          <div className="flex-shrink-0">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${msg.sender.full_name}`} />
                              <AvatarFallback>
                                {msg.sender.role === 'admin' ? (
                                  <UserIcon className="w-4 h-4" />
                                ) : (
                                  msg.sender.full_name?.charAt(0)
                                )}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}

                        <div className="flex-1 max-w-[85%]">
                          <div className="flex items-center gap-2 mb-1">
                            {!isOwnMessage && (
                              <>
                                <span className="text-xs font-medium text-muted-foreground">
                                  {msg.sender.full_name}
                                </span>
                                {msg.sender.role === 'admin' && (
                                  <Badge variant="verified" className="text-xs py-0 px-1.5">
                                    Admin
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>

                          <div
                            className={cn(
                              'px-4 py-2.5 rounded-2xl text-sm break-words',
                              isOwnMessage
                                ? 'bg-primary text-primary-foreground rounded-br-md rounded-tr-md rounded-tl-md'
                                : 'bg-secondary text-foreground rounded-bl-md rounded-tl-md rounded-tr-md'
                            )}
                          >
                            {msg.content}
                          </div>

                          <div
                            className={cn(
                              'flex items-center gap-1 mt-1 text-xs text-muted-foreground',
                              isOwnMessage ? 'justify-end' : 'justify-start'
                            )}
                          >
                            <span>{timeString}</span>
                            {isOwnMessage && (
                              <>
                                {msg.status === 'sent' && <Check className="w-3 h-3" />}
                                {msg.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                                {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-primary" />}
                              </>
                            )}
                          </div>
                        </div>

                        {isOwnMessage && (
                          <div className="flex-shrink-0">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.full_name || user?.email}`} />
                              <AvatarFallback>
                                {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 mt-4">
                  <div className="flex-shrink-0">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <UserIcon className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl text-sm bg-secondary text-foreground rounded-bl-md rounded-tl-md rounded-tr-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input Area - Fixed at bottom */}
        <CardFooter className="p-4 border-t flex-shrink-0">
          <div className="flex gap-2 w-full">
            <Input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTypingStart();
              }}
              onBlur={handleTypingStop}
              onKeyDown={handleKeyDown}
              placeholder="Type your message to admin..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Chat with our team about your order. We'll respond as soon as possible.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderChat;
