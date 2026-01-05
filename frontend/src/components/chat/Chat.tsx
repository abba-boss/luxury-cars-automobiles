import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { useChatService, Message, Conversation } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Users, 
  Clock, 
  Check, 
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatProps {
  conversation?: Conversation;
  onClose?: () => void;
  onConversationSelect?: (conversation: Conversation) => void;
}

interface MessageWithStatus extends Message {
  localId?: string; // For optimistic updates
}

const Chat = ({ conversation, onClose, onConversationSelect }: ChatProps) => {
  const { socket, joinConversation, leaveConversation } = useChat();
  const { user } = useAuth();
  const chatService = useChatService();
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load conversation messages when conversation changes
  useEffect(() => {
    if (conversation) {
      loadMessages();
      joinConversation(conversation.id.toString());
    }

    return () => {
      if (conversation) {
        leaveConversation(conversation.id.toString());
      }
    };
  }, [conversation]);

  // Handle real-time messages
  useEffect(() => {
    if (!socket || !conversation) return;

    const handleNewMessage = (newMessage: Message) => {
      setMessages(prev => {
        // Check if message already exists (optimistic update)
        const exists = prev.some(msg => 
          msg.id === newMessage.id || msg.localId === newMessage.localId
        );
        
        if (!exists) {
          return [...prev, newMessage];
        }
        // Update existing message with server response
        return prev.map(msg => 
          msg.localId === newMessage.localId ? newMessage : msg
        );
      });
    };

    const handleTypingStart = (data: { userId: number; userName: string; conversationId: string }) => {
      if (data.conversationId === conversation?.id.toString() && data.userId !== user?.id) {
        setIsTyping(true);
      }
    };

    const handleTypingStop = (data: { userId: number; conversationId: string }) => {
      if (data.conversationId === conversation?.id.toString() && data.userId !== user?.id) {
        setIsTyping(false);
      }
    };

    const handleMessageDelivered = (data: { messageId: number; conversationId: string }) => {
      if (data.conversationId === conversation?.id.toString()) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === data.messageId ? { ...msg, status: 'delivered' } : msg
          )
        );
      }
    };

    const handleMessageRead = (data: { messageId: number; userId: number; conversationId: string }) => {
      if (data.conversationId === conversation?.id.toString()) {
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
  }, [socket, conversation, user]);

  const loadMessages = async () => {
    if (!conversation) return;

    setIsLoading(true);
    try {
      const response = await chatService.getConversationMessages(conversation.id.toString());
      if (response.success) {
        setMessages(response.data);

        // Mark messages as read
        if (socket && user) {
          socket.emit('message_read', {
            conversationId: conversation.id,
            messageId: response.data[response.data.length - 1]?.id
          });
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
    if (!message.trim() || !conversation || !user) return;

    // Create optimistic message
    const localId = `local-${Date.now()}`;
    const optimisticMessage: MessageWithStatus = {
      id: 0, // Will be updated with server response
      localId,
      conversation_id: conversation.id,
      sender_id: user.id,
      content: message,
      message_type: 'text',
      status: 'sent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender: {
        id: user.id,
        full_name: user.full_name,
        role: user.role
      }
    };

    // Add optimistic message to UI
    setMessages(prev => [...prev, optimisticMessage]);
    setMessage('');

    try {
      // Send to server
      const response = await chatService.sendMessage(conversation.id.toString(), {
        content: message
      });

      if (response.success) {
        // Update with server response
        setMessages(prev => 
          prev.map(msg => 
            msg.localId === localId ? response.data : msg
          )
        );
      } else {
        // Remove optimistic message if failed
        setMessages(prev => prev.filter(msg => msg.localId !== localId));
      }
    } catch (error) {
      // Remove optimistic message if failed
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
    if (!conversation || !socket) return;
    
    socket.emit('typing_start', { conversationId: conversation.id });
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { conversationId: conversation.id });
    }, 2000);
  };

  const handleTypingStop = () => {
    if (!conversation || !socket) return;
    
    // Clear timeout and emit stop typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit('typing_stop', { conversationId: conversation.id });
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <Send className="w-6 h-6" />
      </button>
    );
  }

  if (!conversation) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  // Get other participant in the conversation
  const otherParticipant = conversation.participants.find(p => p.user_id !== user?.id)?.user;
  const isOnline = otherParticipant && onlineUsers.includes(otherParticipant.id);

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 bg-card border border-border rounded-2xl shadow-lg overflow-hidden transition-all duration-300',
        isMinimized ? 'w-80 h-14' : 'w-[380px] h-[520px]'
      )}
    >
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between bg-secondary border-b border-border">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${otherParticipant?.full_name}`} />
              <AvatarFallback>{otherParticipant?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card"></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {otherParticipant?.full_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[340px] flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {isLoading && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Loading messages...</p>
                  </div>
                )}
                
                {messages.map((msg) => (
                  <div
                    key={msg.localId || msg.id}
                    className={cn(
                      'flex gap-2',
                      msg.sender_id === user?.id ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                        msg.sender_id === user?.id
                          ? 'bg-primary/20'
                          : 'bg-secondary'
                      )}
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${msg.sender.full_name}`} />
                        <AvatarFallback>{msg.sender.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 max-w-[75%]">
                      <div
                        className={cn(
                          'px-3 py-2 rounded-xl text-sm break-words',
                          msg.sender_id === user?.id
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-secondary text-foreground rounded-bl-md'
                        )}
                      >
                        {msg.content}
                      </div>
                      <div
                        className={cn(
                          'flex items-center gap-1 mt-1 text-xs text-muted-foreground',
                          msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.sender_id === user?.id && (
                          <>
                            {msg.status === 'delivered' && <Check className="w-3 h-3" />}
                            {msg.status === 'read' && <CheckCheck className="w-3 h-3" />}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="px-3 py-2 rounded-xl text-sm bg-secondary text-foreground rounded-bl-md">
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

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="h-9 w-9">
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
                  placeholder="Type a message..."
                  className="flex-1 bg-secondary border-0"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;