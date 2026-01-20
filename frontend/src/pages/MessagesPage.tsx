import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/contexts/ChatContext";
import { chatService, inquiryService } from "@/services";
import { formatDate } from "@/utils/dateUtils";
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  ShoppingCart,
  Send,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import OrderChat from "@/components/chat/OrderChat";

interface OrderInfo {
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
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
  type: 'inquiry' | 'order_conversation';
  order_info?: OrderInfo;
  car_id?: string;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useChat();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch inquiries for the user
        const inquiriesResponse = await inquiryService.getInquiries();
        const inquiries = inquiriesResponse.success ? inquiriesResponse.data || [] : [];

        // Fetch order conversations for the user
        const orderConversationsResponse = await chatService.getOrderConversations({
          status: 'active',
          page: 1,
          limit: 50
        });
        const orderConversations = orderConversationsResponse.success ? orderConversationsResponse.data || [] : [];

        // Combine and format messages
        const formattedMessages: Message[] = [
          ...inquiries.map((inquiry: any) => ({
            id: inquiry.id.toString(),
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            subject: inquiry.subject,
            message: inquiry.message,
            status: inquiry.status,
            created_at: inquiry.created_at,
            type: 'inquiry' as const,
            car_id: inquiry.car_id
          })),
          ...orderConversations.map((oc: any) => ({
            id: oc.id.toString(),
            name: `Order #${oc.sale_id} - ${oc.sale?.vehicle?.make} ${oc.sale?.vehicle?.model}`,
            email: oc.sale?.customer?.email || '',
            phone: oc.sale?.customer?.phone,
            message: `Chat about order #${oc.sale_id}`,
            status: oc.status,
            created_at: oc.created_at,
            type: 'order_conversation' as const,
            order_info: oc.sale
          }))
        ];

        // Sort messages by created_at (newest first)
        formattedMessages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMessages();
    }
  }, [user]);

  // Listen for real-time message updates
  useEffect(() => {
    if (!socket) return;

    const handleOrderMessageUpdate = (data: any) => {
      // Update the specific message in the list if it exists
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === data.conversationId
            ? { ...msg, status: 'in_progress' }
            : msg
        )
      );

      // Update selected message if it matches
      if (selectedMessage && selectedMessage.id === data.conversationId) {
        setSelectedMessage(prevMessage => ({
          ...prevMessage!,
          status: 'in_progress'
        }));
      }
    };

    socket.on('order_message_update', handleOrderMessageUpdate);

    return () => {
      socket.off('order_message_update', handleOrderMessageUpdate);
    };
  }, [socket, selectedMessage]);

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
      case "active":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            New
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case "resolved":
      case "closed":
        return (
          <Badge className="gap-1 bg-emerald-500">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Messages" subtitle="Your conversations with our team">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Messages" subtitle="Your conversations with our team">
      <div className="flex h-[calc(100vh-20rem)] overflow-hidden">
        {/* Message List - Fixed width with independent scroll */}
        <div className="w-96 border-r border-border flex flex-col h-full min-h-0">
          {/* Header */}
          <div className="p-4 border-b border-border bg-muted/5 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">
                Your Conversations
              </h2>
              {messages.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                  {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                </span>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
            <TabsList className="mx-4 mt-3 flex-shrink-0">
              <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({messages.filter(m => m.status === 'new' || m.status === 'in_progress').length})</TabsTrigger>
              <TabsTrigger value="order-chats">Order Chats ({messages.filter(m => m.type === 'order_conversation').length})</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries ({messages.filter(m => m.type === 'inquiry').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 overflow-y-auto m-0">
              <div className="divide-y divide-border">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No conversations yet</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={cn(
                        "w-full p-4 text-left hover:bg-secondary/50 transition-colors",
                        selectedMessage?.id === message.id && 'bg-secondary',
                        (message.status === 'new' || message.status === 'in_progress' || message.status === 'active') && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
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
                              "font-medium truncate",
                              (message.status === 'new' || message.status === 'in_progress' || message.status === 'active') ? 'text-foreground' : 'text-muted-foreground'
                            )}>
                              {message.type === 'order_conversation'
                                ? message.name
                                : message.subject || message.name}
                            </p>
                            {(message.status === 'new' || message.status === 'in_progress' || message.status === 'active') && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {message.type === 'order_conversation'
                              ? `Order conversation`
                              : message.message.substring(0, 50) + '...'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(message.created_at)}
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
                {filteredMessages.filter(m => m.status === 'new' || m.status === 'in_progress').map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-secondary/50 transition-colors",
                      selectedMessage?.id === message.id && 'bg-secondary',
                      'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
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
                            : message.subject || message.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.type === 'order_conversation'
                            ? `Order conversation`
                            : message.message.substring(0, 50) + '...'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="order-chats" className="flex-1 overflow-y-auto m-0">
              <div className="divide-y divide-border">
                {filteredMessages.filter(m => m.type === 'order_conversation').map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-secondary/50 transition-colors",
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
                            "font-medium truncate",
                            (message.status === 'new' || message.status === 'in_progress' || message.status === 'active') ? 'text-foreground' : 'text-muted-foreground'
                          )}>
                            {message.name}
                          </p>
                          {(message.status === 'new' || message.status === 'in_progress' || message.status === 'active') && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          Order conversation
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inquiries" className="flex-1 overflow-y-auto m-0">
              <div className="divide-y divide-border">
                {filteredMessages.filter(m => m.type === 'inquiry').map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-secondary/50 transition-colors",
                      selectedMessage?.id === message.id && 'bg-secondary'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500/20 text-blue-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-muted-foreground truncate">
                          {message.subject || message.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.message.substring(0, 50) + '...'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Message Detail - Only this area scrolls for chat */}
        <div className="flex-1 flex flex-col h-full min-h-0">
          {selectedMessage ? (
            // Check if this is an order conversation and show the chat interface
            (selectedMessage.type === 'order_conversation' && selectedMessage.order_info) ? (
              // Show OrderChat for order conversations
              <div className="flex-1 flex flex-col h-full">
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
                    conversationId={selectedMessage.id}
                    className="h-full"
                  />
                </div>
              </div>
            ) : (
              // Show regular message view for inquiries
              <div className="flex-1 flex flex-col h-full">
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
                        {selectedMessage.subject || selectedMessage.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMessage.email}
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
                  </div>
                </div>

                {/* Detail Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                    <span>
                      {formatDate(selectedMessage.created_at)}
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
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Type your reply to the team..."
                      className="flex-1 border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                      rows={3}
                    />
                    <Button className="gap-2">
                      <Send className="w-4 h-4" />
                      Send
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Contact our team directly through the order chat for faster responses.
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium text-foreground">Welcome to Messages</p>
                <p className="text-muted-foreground mt-2">Select a conversation from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;