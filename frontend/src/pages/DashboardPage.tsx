import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/analytics/KPICard";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { favoriteService, bookingService } from "@/services";
import {
  Car,
  Heart,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const { getItemCount } = useCart();
  const [stats, setStats] = useState({
    savedVehicles: 0,
    activeBookings: 0,
    messages: 3,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch favorites count
      const favoritesResponse = await favoriteService.getFavorites();
      if (favoritesResponse.success) {
        setStats(prev => ({ ...prev, savedVehicles: favoritesResponse.data.length }));
      }

      // Fetch bookings count
      const bookingsResponse = await bookingService.getUserBookings();
      if (bookingsResponse.success) {
        const activeCount = bookingsResponse.data.filter(
          (booking: any) => booking.status === 'pending' || booking.status === 'confirmed'
        ).length;
        setStats(prev => ({ ...prev, activeBookings: activeCount }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentActivity = [
    {
      id: 1,
      type: "saved",
      title: "Saved 2023 BMW X5",
      time: "2 hours ago",
      status: "new"
    },
    {
      id: 2,
      type: "inquiry",
      title: "Inquiry about Toyota Camry",
      time: "1 day ago",
      status: "replied"
    },
    {
      id: 3,
      type: "order",
      title: "Order #12345 confirmed",
      time: "3 days ago",
      status: "confirmed"
    }
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${user?.full_name || 'Customer'}`}>
      <div className="space-y-6 h-full flex flex-col overflow-hidden">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card variant="premium">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Saved Vehicles</p>
                  <p className="text-lg sm:text-xl font-bold">{stats.savedVehicles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active Bookings</p>
                  <p className="text-lg sm:text-xl font-bold">{stats.activeBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Views</p>
                  <p className="text-lg sm:text-xl font-bold">{stats.totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Cart Items</p>
                  <p className="text-lg sm:text-xl font-bold">{getItemCount()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 flex-1 min-h-0">
          {/* Recent Activity */}
          <Card variant="premium" className="flex-1 flex flex-col min-h-0">
            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 pt-2 sm:pt-0">
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg bg-secondary/30">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      {activity.type === 'saved' && <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
                      {activity.type === 'inquiry' && <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
                      {activity.type === 'order' && <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant={activity.status === 'new' ? 'default' : 'secondary'} className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="premium" className="flex-1 flex flex-col min-h-0">
            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3 sm:p-4 pt-2 sm:pt-0">
              <div className="space-y-2 sm:space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/cars">
                    <Car className="w-4 h-4 mr-2" />
                    Browse Vehicles
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/saved-cars">
                    <Heart className="w-4 h-4 mr-2" />
                    View Saved Cars
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/bookings">
                    <Calendar className="w-4 h-4 mr-2" />
                    My Bookings
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/orders">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    My Orders
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
