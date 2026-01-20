import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { saleService, chatService } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/contexts/ChatContext";
import OrderChat from "@/components/chat/OrderChat";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertCircle,
  Download,
  Edit,
  Filter,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateUtils";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const { user } = useAuth();
  const { socket } = useChat();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders based on user role
        let response;
        if (user?.role === 'admin') {
          // Admin sees all orders
          response = await saleService.getSales();
        } else {
          // Customer sees only their orders
          response = await saleService.getMyOrders();
        }

        if (response.success) {
          let orders = response.data || [];

          // For each order, fetch its conversation if it exists
          const ordersWithConversations = await Promise.all(
            orders.map(async (order) => {
              try {
                // Try to get the order conversation
                const orderConversationsResponse = await chatService.getOrderConversations();
                if (orderConversationsResponse.success) {
                  const orderConversation = orderConversationsResponse.data.find(
                    (oc: any) => oc.sale_id === order.id
                  );

                  if (orderConversation) {
                    // Get the full conversation details
                    const conversationDetails = await chatService.getConversationMessages(
                      orderConversation.conversation_id.toString()
                    );

                    return {
                      ...order,
                      orderConversation: {
                        ...orderConversation,
                        conversation: {
                          id: orderConversation.conversation_id,
                          messages: conversationDetails.success ? conversationDetails.data : []
                        }
                      }
                    };
                  }
                }
              } catch (err) {
                console.error(`Error fetching conversation for order ${order.id}:`, err);
              }

              // Return order without conversation if there's an error
              return order;
            })
          );

          setOrders(ordersWithConversations);
          // Auto-select first order if available
          if (ordersWithConversations && ordersWithConversations.length > 0) {
            setSelectedOrder(ordersWithConversations[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Listen for real-time order message updates
  useEffect(() => {
    if (!socket) return;

    const handleOrderMessageUpdate = (data: any) => {
      console.log('Order message update:', data);
      // Update the specific order in the list if it exists
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === data.orderId
            ? { ...order, orderConversation: data.orderDetails.orderConversation }
            : order
        )
      );

      // Update selected order if it matches
      if (selectedOrder && selectedOrder.id === data.orderId) {
        setSelectedOrder(prevOrder => ({
          ...prevOrder,
          orderConversation: data.orderDetails.orderConversation
        }));
      }
    };

    socket.on('order_message_update', handleOrderMessageUpdate);

    return () => {
      socket.off('order_message_update', handleOrderMessageUpdate);
    };
  }, [socket, selectedOrder]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="muted" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="verified" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Confirmed
          </Badge>
        );
      case "completed":
        return (
          <Badge className="gap-1 bg-emerald-500">
            <CheckCircle className="h-3 w-3" />
            Completed
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

  const getLastMessage = (order: any) => {
    const messages = order.orderConversation?.conversation?.messages;
    if (messages && messages.length > 0) {
      return messages[messages.length - 1]; // Last message in the array
    }
    return null;
  };

  const hasUnreadMessages = (order: any) => {
    const lastMessage = getLastMessage(order);
    return lastMessage && lastMessage.sender_id !== user?.id && lastMessage.status !== 'read';
  };

  return (
    <DashboardLayout
      title={user?.role === 'admin' ? "All Orders" : "My Orders"}
      subtitle={user?.role === 'admin' ? "Manage customer orders and chat with them" : "Track your car orders and chat with our team"}
    >
      <div className="space-y-6 h-[calc(100vh-20rem)] flex flex-col overflow-hidden">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-xl font-semibold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-semibold">
                    {orders.filter(o => o.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-xl font-semibold">
                    {orders.filter(o => o.status === "confirmed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                  <p className="text-xl font-semibold">
                    {orders.filter(o => o.status === "cancelled").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="premium" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <select
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            />
            <input
              type="date"
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            />
          </div>
        </Card>

        {/* Orders and Chat Layout */}
        {orders.length === 0 ? (
          <Card variant="premium" className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground">
                You haven't placed any orders yet. Browse our collection to find your dream car!
              </p>
            </div>
          </Card>
        ) : (
          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Orders List - Fixed width with independent scroll */}
            <div className="w-96 border-r border-border flex flex-col min-h-0">
              <Card variant="premium" className="flex-1 flex flex-col shadow-sm min-h-0">
                <div className="p-4 border-b bg-muted/5 rounded-t-xl flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Your Orders
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-1 p-2">
                    {orders.map((order) => {
                      const lastMessage = getLastMessage(order);
                      const unread = hasUnreadMessages(order);

                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={cn(
                            "p-3 cursor-pointer transition-all duration-200 rounded-lg border-l-2 hover:shadow-sm",
                            selectedOrder?.id === order.id
                              ? "border-primary bg-primary/5 ring-1 ring-primary/10"
                              : "border-transparent hover:bg-accent/30"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border">
                              <img
                                src={order.vehicle?.images?.[0] || '/placeholder-car.jpg'}
                                alt={`${order.vehicle?.make} ${order.vehicle?.model}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-car.jpg';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-sm truncate">
                                  {order.vehicle?.make} {order.vehicle?.model}
                                </h4>
                                {getStatusBadge(order.status)}
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-1">
                                Order #{order.id} • ${parseFloat(order.sale_price).toLocaleString()}
                              </p>
                              {lastMessage && (
                                <div className="flex items-center justify-between">
                                  <p className={cn(
                                    "text-xs truncate",
                                    unread ? "font-semibold text-foreground" : "text-muted-foreground"
                                  )}>
                                    <span className={lastMessage.sender_id === user?.id ? "text-primary" : ""}>
                                      {lastMessage.sender_id === user?.id ? 'You: ' : 'Admin: '}
                                    </span>
                                    {lastMessage.content.substring(0, 30)}...
                                  </p>
                                  {unread && (
                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2" title="Unread message"></div>
                                  )}
                                </div>
                              )}
                              {!lastMessage && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(order.created_at)}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Order Actions */}
                          <div className="flex gap-1 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Update order status to confirmed
                                saleService.updateSale(order.id, { status: 'confirmed' })
                                  .then(response => {
                                    if (response.success) {
                                      setOrders(prev => prev.map(o => 
                                        o.id === order.id ? {...o, status: 'confirmed'} : o
                                      ));
                                      if (selectedOrder?.id === order.id) {
                                        setSelectedOrder({...selectedOrder, status: 'confirmed'});
                                      }
                                    }
                                  });
                              }}
                              className="text-xs px-2 py-1 border rounded hover:bg-accent"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Update order status to completed
                                saleService.updateSale(order.id, { status: 'completed' })
                                  .then(response => {
                                    if (response.success) {
                                      setOrders(prev => prev.map(o => 
                                        o.id === order.id ? {...o, status: 'completed'} : o
                                      ));
                                      if (selectedOrder?.id === order.id) {
                                        setSelectedOrder({...selectedOrder, status: 'completed'});
                                      }
                                    }
                                  });
                              }}
                              className="text-xs px-2 py-1 border rounded hover:bg-accent"
                            >
                              Complete
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Update order status to cancelled
                                saleService.updateSale(order.id, { status: 'cancelled' })
                                  .then(response => {
                                    if (response.success) {
                                      setOrders(prev => prev.map(o => 
                                        o.id === order.id ? {...o, status: 'cancelled'} : o
                                      ));
                                      if (selectedOrder?.id === order.id) {
                                        setSelectedOrder({...selectedOrder, status: 'cancelled'});
                                      }
                                    }
                                  });
                              }}
                              className="text-xs px-2 py-1 border rounded hover:bg-destructive/20"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Chat - Fixed width with independent scroll */}
            <div className="flex-1 flex flex-col min-h-0">
              {selectedOrder && selectedOrder.orderConversation?.conversation ? (
                <OrderChat
                  order={selectedOrder}
                  conversationId={selectedOrder.orderConversation.conversation.id.toString()}
                  className="flex-1"
                />
              ) : (
                <Card variant="premium" className="flex-1 flex items-center justify-center shadow-sm">
                  <div className="text-center text-muted-foreground p-8 max-w-sm mx-auto">
                    {selectedOrder ? (
                      <>
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                        <h4 className="font-semibold mb-2">Setting up chat...</h4>
                        <p className="text-sm">Our team is preparing the chat for this order.</p>
                        <p className="text-xs mt-2 text-muted-foreground">Please refresh the page if this persists.</p>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                        <h4 className="font-semibold mb-2">Select an order to chat</h4>
                        <p className="text-sm">Choose an order from the list to start a conversation with our team.</p>
                      </>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;