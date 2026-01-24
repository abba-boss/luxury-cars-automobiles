import { useState, useRef, useEffect, KeyboardEvent, useCallback, useMemo } from 'react';
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
  Paperclip,
  X,
  Image as ImageIcon,
  FileText,
  Download,
  Eye,
  Video,
  FileImage,
  File,
  FileAudio,
  FileVideo
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
  file_url?: string;
  file_name?: string;
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
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Handle online status updates
    const handleUserOnline = (data: { userId: number }) => {
      setOnlineUsers(prev => [...prev, data.userId]);
    };

    const handleUserOffline = (data: { userId: number }) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTypingStart);
    socket.on('user_stopped_typing', handleTypingStop);
    socket.on('message_delivered', handleMessageDelivered);
    socket.on('message_read', handleMessageRead);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTypingStart);
      socket.off('user_stopped_typing', handleTypingStop);
      socket.off('message_delivered', handleMessageDelivered);
      socket.off('message_read', handleMessageRead);
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if ((!message.trim() && selectedFiles.length === 0) || !conversationId || !user) return;

    // Validate file sizes before sending
    if (selectedFiles.length > 0) {
      const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > 50 * 1024 * 1024) { // 50MB limit
        toast.error('Total file size exceeds 50MB limit');
        return;
      }
    }

    const localId = `local-${Date.now()}`;
    const content = message.trim() || `[${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}]`;

    const optimisticMessage: Message = {
      id: 0,
      localId,
      conversation_id: parseInt(conversationId),
      sender_id: user.id,
      content,
      message_type: selectedFiles.length > 0 ? 'file' : 'text',
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
    setSelectedFiles([]);
    setIsUploading(true);

    try {
      const response = await chatService.sendMessage(conversationId, {
        content: message,
        files: selectedFiles.length > 0 ? selectedFiles : undefined
      });

      if (response.success) {
        setMessages(prev =>
          prev.map(msg =>
            msg.localId === localId ? response.data : msg
          )
        );
        toast.success('Message sent successfully');
      } else {
        setMessages(prev => prev.filter(msg => msg.localId !== localId));
        console.error('Failed to send message:', response.message);
        toast.error(response.message || 'Failed to send message');
      }
    } catch (error: any) {
      setMessages(prev => prev.filter(msg => msg.localId !== localId));
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTypingStart = useCallback(() => {
    if (!conversationId || !socket) return;

    socket.emit('typing_start', { conversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { conversationId });
    }, 2000);
  }, [conversationId, socket]);

  const handleTypingStop = useCallback(() => {
    if (!conversationId || !socket) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit('typing_stop', { conversationId });
    }
  }, [conversationId, socket]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Validate file count
      if (selectedFiles.length + files.length > 5) {
        toast.error('Maximum 5 files allowed per message');
        return;
      }

      // Validate individual file sizes
      for (const file of files) {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          toast.error(`File ${file.name} exceeds 50MB limit`);
          return;
        }
      }

      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
  const groupMessagesByDate = useCallback(() => {
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
  }, [messages]);

  const groupedMessages = groupMessagesByDate();

  // Format date for display
  const formatDateDisplay = useCallback((dateStr?: string) => {
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
  }, []);

  // Check if admin is online
  const isAdminOnline = onlineUsers.some(userId =>
    messages.some(msg => msg.sender_id === userId && msg.sender.role === 'admin')
  );

  // Function to determine file type and icon
  const getFileIcon = (fileName?: string, fileType?: string) => {
    if (fileType?.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    
    if (fileType?.startsWith('video/')) {
      return <Video className="w-4 h-4" />;
    }
    
    if (fileType?.startsWith('audio/')) {
      return <FileAudio className="w-4 h-4" />;
    }
    
    if (fileName) {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') return <FileText className="w-4 h-4" />;
      if (['doc', 'docx'].includes(ext)) return <FileText className="w-4 h-4" />;
      if (['xls', 'xlsx'].includes(ext)) return <FileText className="w-4 h-4" />;
      if (['ppt', 'pptx'].includes(ext)) return <FileText className="w-4 h-4" />;
      if (['zip', 'rar', '7z'].includes(ext)) return <File className="w-4 h-4" />;
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <FileImage className="w-4 h-4" />;
      if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return <FileVideo className="w-4 h-4" />;
    }
    
    return <File className="w-4 h-4" />;
  };

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to get file size from URL (approximate)
  const getFileSizeFromUrl = async (url: string): Promise<number> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : 0;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  };

  // Function to render file message
  const renderFileMessage = (msg: Message) => {
    if (!msg.file_url) return null;

    const isImage = msg.message_type === 'image' || (msg.file_name && /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.file_name));
    const isVideo = msg.message_type === 'video' || (msg.file_name && /\.(mp4|mov|avi|mkv)$/i.test(msg.file_name));

    if (isImage) {
      return (
        <div className="group relative">
          <img
            src={msg.file_url}
            alt={msg.file_name || 'Shared image'}
            className="max-w-[250px] max-h-[250px] object-cover rounded-2xl cursor-pointer bg-transparent"
            onClick={() => {
              setCurrentImage(msg.file_url || '');
              setImageModalOpen(true);
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg'; // fallback image
            }}
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
            <Eye className="w-8 h-8 text-white" />
          </div>
          {msg.content && (
            <p className="text-xs text-muted-foreground mt-1">{msg.content}</p>
          )}
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="relative group">
          <video
            src={msg.file_url}
            controls
            className="max-w-[250px] max-h-[250px] object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
            <PlayIcon className="w-8 h-8 text-white" />
          </div>
          {msg.content && (
            <p className="text-xs text-muted-foreground mt-1">{msg.content}</p>
          )}
        </div>
      );
    }

    // For other file types
    return (
      <div className="flex items-center gap-3 p-3 bg-secondary rounded-2xl max-w-[250px]">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          {getFileIcon(msg.file_name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{msg.file_name}</p>
          <p className="text-xs text-muted-foreground">
            {msg.file_url ? formatFileSize(0) /* Will implement actual file size retrieval */ : 'File'}
          </p>
        </div>
        <a
          href={msg.file_url}
          download={msg.file_name}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded-full hover:bg-primary/10 transition-colors"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    );
  };

  // Function to render message content
  const renderMessageContent = (msg: Message) => {
    if (msg.file_url) {
      return renderFileMessage(msg);
    }
    return msg.content;
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
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        isAdminOnline ? 'bg-green-500' : 'bg-gray-400'
                      )}></div>
                      <span className="text-xs text-muted-foreground italic">
                        {isAdminOnline ? 'Admin online' : 'Admin offline'}
                      </span>
                    </div>
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
                  {dateMessages.map((msg, index, arr) => {
                    const isOwnMessage = msg.sender_id === user?.id;
                    const isSystemMessage = msg.message_type === 'system';
                    const messageDate = msg.created_at ? new Date(msg.created_at) : new Date();
                    const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    // Check if we should show the sender name (when consecutive messages from same person)
                    const prevMsg = index > 0 ? arr[index - 1] : null;
                    const showSenderName = !prevMsg || prevMsg.sender_id !== msg.sender_id;

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
                          {showSenderName && !isOwnMessage && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-muted-foreground">
                                {msg.sender.full_name}
                              </span>
                              {msg.sender.role === 'admin' && (
                                <Badge variant="verified" className="text-xs py-0 px-1.5">
                                  Admin
                                </Badge>
                              )}
                            </div>
                          )}
                          <div
                            className={cn(
                              msg.file_url && (msg.message_type === 'image' || (msg.file_name && /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.file_name)))
                                ? 'px-1 py-1' // Minimal padding for images
                                : cn(
                                    'px-4 py-2.5 rounded-2xl text-sm break-words',
                                    isOwnMessage
                                      ? 'bg-primary text-primary-foreground rounded-br-md rounded-tr-md rounded-tl-md'
                                      : 'bg-secondary text-foreground rounded-bl-md rounded-tl-md rounded-tr-md'
                                  )
                            )}
                          >
                            {renderMessageContent(msg)}
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
        <CardFooter className="p-4 border-t flex-shrink-0 flex-col">
          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="w-full mb-3 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => {
                const isImage = file.type.startsWith('image/');
                
                return (
                  <div key={index} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 text-sm max-w-xs">
                    {isImage ? (
                      <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {getFileIcon(file.name, file.type)}
                      </div>
                    )}
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
                );
              })}
            </div>
          )}

          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
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
              disabled={(!message.trim() && selectedFiles.length === 0) || isUploading}
              className="gap-2"
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
            accept="image/*,video/*,application/pdf,.doc,.docx,.txt,.zip,.rar"
          />
          
          <p className="text-xs text-muted-foreground mt-2 w-full">
            Chat with our team about your order. We'll respond as soon as possible.
          </p>
        </CardFooter>
      </Card>

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <a
                href={currentImage}
                download
                className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="Download image"
              >
                <Download className="w-5 h-5" />
              </a>
              <button
                className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                onClick={() => setImageModalOpen(false)}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={currentImage}
              alt="Enlarged view"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
            />
          </div>
        </div>
      )}
    </div>
  );
};

// PlayIcon component for video files
const PlayIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

export default OrderChat;