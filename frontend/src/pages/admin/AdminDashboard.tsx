import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  MessageSquare,
  ShoppingCart,
  Package,
  Activity,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminService } from '@/services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalSales: 0,
    totalInquiries: 0,
    revenue: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data.stats);
        setRecentSales(response.data.recentSales || []);
        setRecentInquiries(response.data.recentInquiries || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      confirmed: "secondary",
      completed: "default",
      cancelled: "destructive",
      new: "outline",
      in_progress: "secondary",
      resolved: "default",
      closed: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/admin/add-car">
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                  <p className="text-2xl font-bold">{loading ? '...' : stats.totalVehicles}</p>
                </div>
                <Car className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-2">
                <Link to="/admin/inventory" className="text-sm text-blue-600 hover:underline">
                  View inventory →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{loading ? '...' : stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2">
                <Link to="/admin/users" className="text-sm text-green-600 hover:underline">
                  Manage users →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{loading ? '...' : stats.totalSales}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-muted-foreground">
                  Revenue: {loading ? '...' : formatCurrency(stats.revenue)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inquiries</p>
                  <p className="text-2xl font-bold">{loading ? '...' : stats.totalInquiries}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-orange-500" />
              </div>
              <div className="mt-2">
                <Link to="/admin/messages" className="text-sm text-orange-600 hover:underline">
                  View messages →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Sales</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/bookings">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : recentSales.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No recent sales
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSales.slice(0, 5).map((sale: any, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {sale.vehicle?.make} {sale.vehicle?.model}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.customer?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(parseFloat(sale.sale_price))}</p>
                        {getStatusBadge(sale.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Inquiries</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/messages">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : recentInquiries.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No recent inquiries
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInquiries.slice(0, 5).map((inquiry: any, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{inquiry.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {inquiry.name} • {inquiry.email}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(inquiry.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link to="/admin/add-car">
                  <Plus className="w-6 h-6 mb-2" />
                  Add Vehicle
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link to="/admin/inventory">
                  <Package className="w-6 h-6 mb-2" />
                  Manage Inventory
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link to="/admin/users">
                  <Users className="w-6 h-6 mb-2" />
                  User Management
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link to="/admin/messages">
                  <MessageSquare className="w-6 h-6 mb-2" />
                  View Messages
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
