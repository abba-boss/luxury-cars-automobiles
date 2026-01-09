import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { saleService } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/contexts/ChatContext";
import OrderChat from "@/components/chat/OrderChat";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
          setOrders(response.data || []);
          // Auto-select first order if available
          if (response.data && response.data.length > 0) {
            setSelectedOrder(response.data[0]);
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

  // Listen for order message updates
  useEffect(() => {
    if (!socket) return;

    const handleOrderMessageUpdate = (data: any) => {
      console.log('Order message update:', data);
      // Refresh orders to show updated message count
      if (user) {
        const fetchOrders = async () => {
          let response;
          if (user.role === 'admin') {
            response = await saleService.getSales();
          } else {
            response = await saleService.getMyOrders();
          }
          
          if (response.success) {
            setOrders(response.data || []);
            // Update selected order if it matches
            if (selectedOrder && selectedOrder.id === data.orderId) {
              const updatedOrder = response.data.find((o: any) => o.id === data.orderId);
              if (updatedOrder) {
                setSelectedOrder(updatedOrder);
              }
            }
          }
        };
        fetchOrders();
      }
    };

    socket.on('order_message_update', handleOrderMessageUpdate);

    return () => {
      socket.off('order_message_update', handleOrderMessageUpdate);
    };
  }, [socket, user, selectedOrder]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
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
        return null;
    }
  };

  const getLastMessage = (order: any) => {
    const messages = order.orderConversation?.conversation?.messages;
    if (messages && messages.length > 0) {
      return messages[0];
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
      <div className="space-y-6">
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

        {/* Orders and Chat Layout */}
        {orders.length === 0 ? (
          <Card variant="premium" className="p-12">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground">
                You haven't placed any orders yet. Browse our collection to find your dream car!
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-350px)]">
            {/* Orders List */}
            <Card variant="premium" className="lg:col-span-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Your Orders
                </h3>
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
                          "p-3 cursor-pointer hover:bg-secondary/50 transition-colors rounded-lg border-l-2",
                          selectedOrder?.id === order.id
                            ? "border-primary bg-secondary/30"
                            : "border-transparent"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={order.vehicle?.images?.[0] || '/placeholder-car.jpg'}
                              alt={`${order.vehicle?.make} ${order.vehicle?.model}`}
                              className="w-full h-full object-cover"
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
                                  {lastMessage.sender_id === user?.id ? 'You: ' : 'Admin: '}
                                  {lastMessage.content.substring(0, 30)}...
                                </p>
                                {unread && (
                                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2"></div>
                                )}
                              </div>
                            )}
                            {!lastMessage && (
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Order Chat */}
            <div className="lg:col-span-2">
              {selectedOrder && selectedOrder.orderConversation?.conversation ? (
                <OrderChat
                  order={selectedOrder}
                  conversationId={selectedOrder.orderConversation.conversation.id.toString()}
                  className="h-full"
                />
              ) : (
                <Card variant="premium" className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-8">
                    {selectedOrder ? (
                      <>
                        <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                        <p>Chat is being set up for this order...</p>
                        <p className="text-sm mt-2">Please refresh the page if this persists.</p>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-12 h-12 mx-auto mb-3" />
                        <p>Select an order to view chat</p>
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
