import { useState, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { useChatService, Conversation } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  MessageCircle,
  Users,
  Clock,
  Check,
  CheckCheck,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInboxProps {
  onConversationSelect: (conversation: Conversation) => void;
  selectedConversation?: Conversation;
}

const ChatInbox = ({ onConversationSelect, selectedConversation }: ChatInboxProps) => {
  const { user } = useAuth();
  const chatService = useChatService();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getUserConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    // In a real implementation, this would fetch users based on role rules
    // For now, we'll just show a placeholder
    try {
      // This would be an API call to get available users to chat with
      // based on the current user's role
    } catch (error) {
      console.error('Failed to load available users:', error);
    }
  };

  const handleStartNewChat = async (recipientId: number) => {
    try {
      const response = await chatService.createConversation({ recipientId });
      if (response.success) {
        // Reload conversations to include the new one
        loadConversations();
        // Select the new conversation
        if (response.data) {
          onConversationSelect(response.data);
        }
        setShowNewChatModal(false);
      }
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p.user_id !== user?.id)?.user;
    return otherParticipant?.full_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getLastMessage = (conversation: Conversation) => {
    if (conversation.messages && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      return lastMessage.content.length > 30 
        ? lastMessage.content.substring(0, 30) + '...' 
        : lastMessage.content;
    }
    return 'No messages yet';
  };

  const getLastMessageTime = (conversation: Conversation) => {
    if (conversation.messages && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      return new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  };

  return (
    <div className="w-80 h-[520px] bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNewChatModal(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary border-0"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center">
              <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start a new conversation</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(p => p.user_id !== user?.id)?.user;
              const lastMessage = conversation.messages && conversation.messages.length > 0
                ? conversation.messages[conversation.messages.length - 1]
                : null;

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    'p-3 rounded-lg cursor-pointer hover:bg-secondary transition-colors mb-2',
                    selectedConversation?.id === conversation.id && 'bg-secondary'
                  )}
                  onClick={() => onConversationSelect(conversation)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${otherParticipant?.full_name}`} />
                        <AvatarFallback>{otherParticipant?.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-foreground truncate">
                          {otherParticipant?.full_name}
                        </p>
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {getLastMessageTime(conversation)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {getLastMessage(conversation)}
                        </p>
                        {conversation.unread_count > 0 && (
                          <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="flex-1">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="flex-1">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="flex-1">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Start New Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select a user to start a conversation with
            </p>

            <div className="space-y-2">
              {/* Admin users - show all users */}
              {user?.role === 'admin' && (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-border">
                    <p className="font-medium">All Users</p>
                    <p className="text-sm text-muted-foreground">All users in the system</p>
                  </div>
                </div>
              )}

              {/* Regular users - can chat with admin and buyers */}
              {user?.role === 'user' && (
                <div className="space-y-2">
                  <div
                    className="p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary"
                    onClick={() => handleStartNewChat(1)} // Admin ID would come from API
                  >
                    <p className="font-medium">Admin Support</p>
                    <p className="text-sm text-muted-foreground">Available for chat</p>
                  </div>

                  <div className="p-3 rounded-lg border border-border">
                    <p className="font-medium">Buyers</p>
                    <p className="text-sm text-muted-foreground">Available buyers to chat with</p>
                  </div>
                </div>
              )}

              {/* Buyers - can chat with users who contacted them and admin */}
              {user?.role === 'buyer' && (
                <div className="space-y-2">
                  <div
                    className="p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary"
                    onClick={() => handleStartNewChat(1)} // Admin ID would come from API
                  >
                    <p className="font-medium">Admin Support</p>
                    <p className="text-sm text-muted-foreground">Available for chat</p>
                  </div>

                  <div className="p-3 rounded-lg border border-border">
                    <p className="font-medium">Users</p>
                    <p className="text-sm text-muted-foreground">Users who contacted you</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowNewChatModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInbox;