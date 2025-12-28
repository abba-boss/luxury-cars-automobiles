import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { saleService } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Eye
} from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await saleService.getMyOrders();
        if (response.success) {
          setOrders(response.data || []);
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
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="My Orders" subtitle="Track your car bookings and purchases">
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
                  <p className="text-xl font-semibold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} variant="premium" className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={order.carImage}
                  alt={order.carName}
                  className="w-full md:w-32 h-24 rounded-lg object-cover"
                />
                
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{order.carName}</h3>
                      <p className="text-muted-foreground">Order ID: {order.id}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-semibold text-lg text-primary">{order.price}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Order Date</p>
                      <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Contact Admin
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
