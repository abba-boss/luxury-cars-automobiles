import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { staffService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { 
  Car, 
  Package, 
  Users, 
  MessageSquare, 
  BarChart3, 
  ShoppingCart, 
  Star,
  Calendar,
  Eye,
  Edit,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any>(null);
  const [quickStats, setQuickStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    pendingOrders: 0,
    pendingInquiries: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load reports
      const reportsResponse = await staffService.getReports();
      if (reportsResponse.success) {
        setReports(reportsResponse.data);
      }
      
      // Load quick stats based on permissions
      if (await checkPermission('manage_inventory')) {
        // Load vehicle stats
        const vehiclesResponse = await staffService.getVehicles({ limit: 100 });
        if (vehiclesResponse.success) {
          const allVehicles = vehiclesResponse.data || [];
          const availableVehicles = allVehicles.filter(v => v.status === 'available');
          
          setQuickStats(prev => ({
            ...prev,
            totalVehicles: allVehicles.length,
            availableVehicles: availableVehicles.length
          }));
        }
      }
      
      if (await checkPermission('view_orders')) {
        // Load order stats
        const ordersResponse = await staffService.getOrders({ limit: 100, status: 'pending' });
        if (ordersResponse.success) {
          setQuickStats(prev => ({
            ...prev,
            pendingOrders: ordersResponse.data?.length || 0
          }));
        }
      }
      
      if (await checkPermission('respond_to_inquiries')) {
        // Load inquiry stats
        const inquiriesResponse = await staffService.getInquiries({ limit: 100, status: 'pending' });
        if (inquiriesResponse.success) {
          setQuickStats(prev => ({
            ...prev,
            pendingInquiries: inquiriesResponse.data?.length || 0
          }));
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = async (permission: string): Promise<boolean> => {
    // This would typically call an API to check if the user has a specific permission
    // For now, we'll assume the user has the permission if they can access this page
    return true;
  };

  const canManageInventory = user?.role === 'staff' || user?.role === 'admin';
  const canViewOrders = user?.role === 'staff' || user?.role === 'admin';
  const canManageInquiries = user?.role === 'staff' || user?.role === 'admin';
  const canManageReviews = user?.role === 'staff' || user?.role === 'admin';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.full_name}. Manage your assigned tasks and responsibilities.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {canManageInventory && (
            <Card variant="premium">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Vehicles</p>
                    <p className="text-2xl font-bold">{quickStats.totalVehicles}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Car className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {canManageInventory && (
            <Card variant="premium">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold text-emerald-400">{quickStats.availableVehicles}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Package className="h-5 w-5 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {canViewOrders && (
            <Card variant="premium">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="text-2xl font-bold text-amber-400">{quickStats.pendingOrders}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {canManageInquiries && (
            <Card variant="premium">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Inquiries</p>
                    <p className="text-2xl font-bold text-purple-400">{quickStats.pendingInquiries}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {canManageInventory && (
            <Card variant="premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/vehicles'}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Inventory
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/vehicles/new'}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Add New Vehicle
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/vehicles/manage'}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Vehicle Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {canViewOrders && (
            <Card variant="premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/orders'}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/orders/pending'}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Pending Orders
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/orders/update-status'}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {canManageInquiries && (
            <Card variant="premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Customer Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/inquiries'}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Inquiries
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/inquiries/respond'}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Respond to Inquiries
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/test-drives'}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Test Drives
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {canManageReviews && (
            <Card variant="premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Review Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/reviews'}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Reviews
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/reviews/moderate'}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Moderate Reviews
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => window.location.href = '/staff/reports'}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card variant="premium">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New vehicle added</p>
                    <p className="text-sm text-muted-foreground">Toyota Camry 2024 added to inventory</p>
                  </div>
                </div>
                <Badge variant="secondary">2 hours ago</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">Order updated</p>
                    <p className="text-sm text-muted-foreground">Order #123 status changed to confirmed</p>
                  </div>
                </div>
                <Badge variant="secondary">4 hours ago</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Inquiry responded</p>
                    <p className="text-sm text-muted-foreground">Replied to inquiry about BMW X5</p>
                  </div>
                </div>
                <Badge variant="secondary">6 hours ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StaffDashboard;