import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminOrders = () => {
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
        // Admin sees all orders
        const response = await saleService.getSales(filters);
        
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

    if (user?.role === 'admin') {
      fetchOrders();
    }
  }, [user, filters]);

  // Listen for order updates
  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = (data: any) => {
      console.log('Order update received:', data);
      // Update the specific order in the list if it exists
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === data.orderId
            ? { ...order, ...data.updatedFields }
            : order
        )
      );

      // Update selected order if it matches
      if (selectedOrder && selectedOrder.id === data.orderId) {
        setSelectedOrder(prevOrder => ({
          ...prevOrder,
          ...data.updatedFields
        }));
      }
    };

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

    socket.on('order_update', handleOrderUpdate);
    socket.on('order_message_update', handleOrderMessageUpdate);

    return () => {
      socket.off('order_update', handleOrderUpdate);
      socket.off('order_message_update', handleOrderMessageUpdate);
    };
  }, [socket, selectedOrder]);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await saleService.updateSale(orderId, { status: newStatus });
      if (response.success) {
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, status: newStatus }
              : order
          )
        );

        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }

        // Emit socket event for real-time update
        if (socket) {
          socket.emit('order_update', {
            orderId,
            updatedFields: { status: newStatus },
            updatedBy: user?.id
          });

          // Emit order status update event for notifications
          socket.emit('order_status_update', {
            orderId,
            status: newStatus,
            updatedBy: user?.id,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

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
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Order Management"
      subtitle="Manage customer orders and communicate with buyers"
    >
      <div className="space-y-6">
        {/* Filters and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
          <Card variant="premium" className="p-12">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">
                There are no orders matching your current filters.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-400px)]">
            {/* Orders List */}
            <Card variant="premium" className="lg:col-span-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  All Orders ({orders.length})
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
                            <p className="text-xs text-muted-foreground">
                              {order.customer?.full_name || 'Customer'} • {new Date(order.sale_date).toLocaleDateString()}
                            </p>
                            {lastMessage && (
                              <div className="flex items-center justify-between mt-1">
                                <p className={cn(
                                  "text-xs truncate",
                                  unread ? "font-semibold text-foreground" : "text-muted-foreground"
                                )}>
                                  {lastMessage.sender_id === user?.id ? 'You: ' : 'Customer: '}
                                  {lastMessage.content.substring(0, 30)}...
                                </p>
                                {unread && (
                                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2"></div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Order Actions */}
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, 'confirmed');
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, 'completed');
                            }}
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, 'cancelled');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Order Details & Chat */}
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <div className="h-full flex flex-col">
                  {/* Order Details Header */}
                  <Card variant="premium" className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Order #{selectedOrder.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedOrder.customer?.full_name || 'Customer'} • {new Date(selectedOrder.sale_date).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Invoice
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Vehicle</p>
                          <p className="font-medium">{selectedOrder.vehicle?.make} {selectedOrder.vehicle?.model}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Price</p>
                          <p className="font-medium">${parseFloat(selectedOrder.sale_price).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <div>{getStatusBadge(selectedOrder.status)}</div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Payment</p>
                          <p className="font-medium capitalize">{selectedOrder.payment_status || 'N/A'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Order Chat */}
                  <div className="flex-1">
                    {selectedOrder.orderConversation?.conversation ? (
                      <OrderChat
                        order={selectedOrder}
                        conversationId={selectedOrder.orderConversation.conversation.id.toString()}
                        className="h-full"
                      />
                    ) : (
                      <Card variant="premium" className="h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground p-8">
                          <MessageSquare className="w-12 h-12 mx-auto mb-3" />
                          <p>No conversation found for this order</p>
                          <p className="text-sm mt-2">Communication will appear here once initiated.</p>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <Card variant="premium" className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-8">
                    <Package className="w-12 h-12 mx-auto mb-3" />
                    <p>Select an order to view details</p>
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

export default AdminOrders;