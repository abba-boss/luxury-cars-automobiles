import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { saleService } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Download,
  Filter,
  Search,
  CreditCard,
  DollarSign,
  User as UserIcon,
  MessageSquare,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateUtils";
import { toast } from "sonner";

const AdminAllOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    paymentStatus: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await saleService.getSales({
          status: filters.status || undefined,
          search: filters.search || undefined,
          date_from: filters.dateFrom || undefined,
          date_to: filters.dateTo || undefined,
          payment_status: filters.paymentStatus || undefined
        });

        if (response.success) {
          setOrders(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filters]);

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
      case "processing":
        return (
          <Badge variant="muted" className="gap-1">
            <Clock className="h-3 w-3" />
            Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="outline" className="gap-1">
            <Package className="h-3 w-3" />
            Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Delivered
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
      case "refunded":
        return (
          <Badge variant="outline" className="gap-1">
            <XCircle className="h-3 w-3" />
            Refunded
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="gap-1 bg-green-500">
            <CreditCard className="h-3 w-3" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="muted" className="gap-1">
            <DollarSign className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="outline" className="gap-1">
            <DollarSign className="h-3 w-3" />
            Refunded
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
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesPaymentStatus = !filters.paymentStatus || order.payment_status === filters.paymentStatus;
    const matchesSearch = !filters.search ||
      order.vehicle?.make?.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.vehicle?.model?.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.customer?.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.id.toString().includes(filters.search);
    const matchesDateFrom = !filters.dateFrom || new Date(order.created_at) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(order.created_at) <= new Date(filters.dateTo);

    return matchesStatus && matchesPaymentStatus && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await saleService.updateSale(orderId, { status: newStatus });
      if (response.success) {
        // Update the order in the local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        // Update selected order if it matches
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }

        toast.success(`Order status updated to ${newStatus}`);
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 h-full flex flex-col overflow-hidden">

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
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid Orders</p>
                  <p className="text-xl font-semibold">
                    {orders.filter(o => o.payment_status === "paid").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="premium" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
            <select
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.paymentStatus}
              onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
            >
              <option value="">All Payment Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
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
            <Button 
              className="w-full"
              onClick={() => {}}
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card variant="premium" className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">
                {orders.length === 0 ? "No orders have been placed yet." : "No orders match your current filters."}
              </p>
            </div>
          </Card>
        ) : (
          <Card variant="premium" className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto min-h-0">
              <table className="w-full">
                <thead className="bg-muted/50 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Order</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Payment</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-lg overflow-hidden border flex-shrink-0">
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
                          <div>
                            <div className="font-medium">{order.vehicle?.make} {order.vehicle?.model}</div>
                            <div className="text-xs text-muted-foreground">{order.vehicle?.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{order.customer?.full_name || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">{order.customer?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">${parseFloat(order.sale_price).toLocaleString()}</div>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-3">
                        {getPaymentStatusBadge(order.payment_status)}
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAllOrders;