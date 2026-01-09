import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { KPICard } from '../../components/analytics/KPICard';
import { SalesChart } from '../../components/analytics/SalesChart';
import { BrandChart } from '../../components/analytics/BrandChart';
import { StatusChart } from '../../components/analytics/StatusChart';
import { UserGrowthChart } from '../../components/analytics/UserGrowthChart';
import { analyticsService } from '../../services';
import {
  Car,
  Users,
  DollarSign,
  Calendar,
  Activity,
  Plus
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [salesData, setSalesData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, salesRes, inventoryRes, userRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getSalesAnalytics(),
        analyticsService.getInventoryAnalytics(),
        analyticsService.getUserAnalytics()
      ]);

      setOverview(overviewRes.data);
      setSalesData(salesRes.data);
      setInventoryData(inventoryRes.data);
      setUserData(userRes.data);
      setIsDemo(overviewRes.isDemo || salesRes.isDemo || inventoryRes.isDemo || userRes.isDemo);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your dealership.
            </p>
          </div>
          <Button onClick={fetchAnalytics} variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* KPI Cards */}
        {overview && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Total Revenue"
              value={overview.totalRevenue}
              icon={<DollarSign className="h-4 w-4" />}
              format="currency"
              isDemo={isDemo}
            />
            <KPICard
              title="Total Vehicles"
              value={overview.totalVehicles}
              icon={<Car className="h-4 w-4" />}
              isDemo={isDemo}
            />
            <KPICard
              title="Total Users"
              value={overview.totalUsers}
              icon={<Users className="h-4 w-4" />}
              isDemo={isDemo}
            />
            <KPICard
              title="Total Bookings"
              value={overview.totalBookings}
              icon={<Calendar className="h-4 w-4" />}
              isDemo={isDemo}
            />
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Sales Revenue Chart */}
          {salesData && (
            <SalesChart
              data={salesData.salesByMonth || []}
              loading={!salesData}
            />
          )}

          {/* Vehicle Status Distribution */}
          {inventoryData && (
            <StatusChart
              data={inventoryData.statusDistribution || []}
              loading={!inventoryData}
            />
          )}

          {/* Top Selling Brands */}
          {salesData && (
            <BrandChart
              data={salesData.topBrands || []}
              loading={!salesData}
              title="Top Selling Brands"
              dataKey="sales_count"
              color="#3b82f6"
            />
          )}

          {/* User Growth */}
          {userData && (
            <UserGrowthChart
              data={userData.userGrowth || []}
              loading={!userData}
            />
          )}
        </div>

        {/* Inventory by Brand */}
        {inventoryData && (
          <div className="grid gap-6">
            <BrandChart
              data={inventoryData.vehiclesByBrand || []}
              loading={!inventoryData}
              title="Inventory by Brand"
              dataKey="count"
              color="hsl(var(--primary))"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link to="/admin/add-car">
                  <Car className="w-4 h-4 mr-2" />
                  Add New Vehicle
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link to="/admin/bookings">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Bookings
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link to="/admin/users">
                  <Users className="w-4 h-4 mr-2" />
                  View Users
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {userData?.recentActivity && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">New Bookings (30d)</span>
                    <Badge variant="secondary">{userData.recentActivity.bookings}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">New Reviews (30d)</span>
                    <Badge variant="secondary">{userData.recentActivity.reviews}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Status</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
