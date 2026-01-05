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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Saved Vehicles"
          value={stats.savedVehicles}
          icon={<Heart className="h-4 w-4" />}
        />
        <KPICard
          title="Active Bookings"
          value={stats.activeBookings}
          icon={<Calendar className="h-4 w-4" />}
        />
        <KPICard
          title="Total Views"
          value={stats.totalViews}
          icon={<Eye className="h-4 w-4" />}
        />
        <KPICard
          title="Cart Items"
          value={getItemCount()}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === 'new' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
