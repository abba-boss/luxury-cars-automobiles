import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { useChatService } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Send, 
  Package,
  Clock, 
  Check, 
  CheckCheck,
  AlertCircle,
  CheckCircle2,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type: string;
  status: string;
  created_at: string;
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
  const chatService = useChatService();
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
            msg.id === newMessage.id || msg.localId === newMessage.localId
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
        setMessages(response.data);

        // Mark messages as read
        if (socket && user) {
          const lastMessage = response.data[response.data.length - 1];
          if (lastMessage && lastMessage.sender_id !== user.id) {
            socket.emit('message_read', {
              conversationId,
              messageId: lastMessage.id
            });
          }
        }
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
        full_name: user.full_name,
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
      }
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.localId !== localId));
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
        return null;
    }
  };

  return (
    <Card variant="premium" className={cn('flex flex-col h-full', className)}>
      {/* Order Header */}
      <CardHeader className="pb-3 border-b">
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
              {getStatusBadge(order.status)}
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
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {isLoading && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Loading messages...</p>
              </div>
            )}
            
            {messages.map((msg) => {
              const isOwnMessage = msg.sender_id === user?.id;
              const isSystemMessage = msg.message_type === 'system';
              
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
                        {new Date(msg.created_at).toLocaleString()}
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
                    isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
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
                  <div className="flex-1 max-w-[75%]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        'text-xs font-medium',
                        isOwnMessage ? 'text-right' : 'text-left'
                      )}>
                        {msg.sender.full_name}
                      </span>
                      {msg.sender.role === 'admin' && (
                        <Badge variant="verified" className="text-xs py-0 px-1.5">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div
                      className={cn(
                        'px-4 py-2.5 rounded-2xl text-sm break-words',
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-secondary text-foreground rounded-bl-md'
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
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {isOwnMessage && (
                        <>
                          {msg.status === 'sent' && <Check className="w-3 h-3" />}
                          {msg.status === 'delivered' && <Check className="w-3 h-3" />}
                          {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-primary" />}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <UserIcon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="px-4 py-2.5 rounded-2xl text-sm bg-secondary text-foreground rounded-bl-md">
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

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderChat;
