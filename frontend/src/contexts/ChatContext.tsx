import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

interface ChatContextType {
  socket: Socket | null;
  isConnected: boolean;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !token) return;

    // Initialize Socket.IO connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });

    // Handle new messages
    newSocket.on('new_message', (message) => {
      console.log('New message received:', message);
      // Update unread count if message is not from current user
      if (message.sender.id !== user.id) {
        setUnreadCount(prev => prev + 1);
      }
    });

    // Handle new order requests
    newSocket.on('new_order_request', (orderRequest) => {
      console.log('New order request received:', orderRequest);
      // Update unread count for order requests
      setUnreadCount(prev => prev + 1);
    });

    // Handle message delivery
    newSocket.on('message_delivered', (data) => {
      console.log('Message delivered:', data);
    });

    // Handle message read receipts
    newSocket.on('message_read', (data) => {
      console.log('Message read by user:', data);
    });

    // Handle typing indicators
    newSocket.on('user_typing', (data) => {
      console.log('User typing:', data);
    });

    newSocket.on('user_stopped_typing', (data) => {
      console.log('User stopped typing:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user, token]);

  const joinConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('join_conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('leave_conversation', conversationId);
    }
  };

  const value = {
    socket,
    isConnected,
    unreadCount,
    setUnreadCount,
    joinConversation,
    leaveConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}