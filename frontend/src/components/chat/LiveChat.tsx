import { useState } from 'react';
import { MessageCircle, X, Send, Minimize2, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ChatInbox from './ChatInbox';
import Chat from './Chat';
import { useChatService, Conversation } from '@/services/chatService';
import { useAuth } from '@/hooks/useAuth';

const LiveChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const chatService = useChatService();

  const handleStartNewChat = async () => {
    // For now, we'll just open the chat interface
    // In a real implementation, you might want to create a new conversation with an admin
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleStartNewChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 bg-card border border-border rounded-2xl shadow-lg overflow-hidden transition-all duration-300',
        isMinimized ? 'w-80 h-14' : 'w-[700px] h-[520px]'
      )}
    >
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between bg-secondary border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {selectedConversation
                ? selectedConversation.participants
                    .find(p => p.user_id !== user?.id)
                    ?.user.full_name || 'Chat'
                : 'Messages'}
            </p>
            <p className="text-xs text-emerald-400">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setIsOpen(false);
              setSelectedConversation(null);
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex h-[calc(100%-3.5rem)]">
          {/* Chat Inbox - Left Panel */}
          <ChatInbox
            onConversationSelect={(conversation) => {
              setSelectedConversation(conversation);
            }}
            selectedConversation={selectedConversation || undefined}
          />

          {/* Chat Window - Right Panel */}
          <div className="flex-1 border-l border-border">
            {selectedConversation ? (
              <Chat
                conversation={selectedConversation}
                onClose={() => setSelectedConversation(null)}
                onConversationSelect={setSelectedConversation}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center p-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-sm">Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
