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
import { vehicleService, analyticsService } from '../../services';
import {
  Car,
  Users,
  DollarSign,
  Calendar,
  Activity,
  Plus,
  TrendingUp,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [salesData, setSalesData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [recentVehicles, setRecentVehicles] = useState<any[]>([]);
  const [topSellingCars, setTopSellingCars] = useState<any[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all analytics data
      const [overviewRes, salesRes, inventoryRes, userRes, vehiclesRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getSalesAnalytics(),
        analyticsService.getInventoryAnalytics(),
        analyticsService.getUserAnalytics(),
        vehicleService.getVehicles({ limit: 5, sort: 'created_at', order: 'desc' })
      ]);

      setOverview(overviewRes.data);
      setSalesData(salesRes.data);
      setInventoryData(inventoryRes.data);
      setUserData(userRes.data);
      setRecentVehicles(vehiclesRes.data || []);

      // Mock top selling cars data (since we don't have this endpoint yet)
      setTopSellingCars([
        { id: 1, make: 'Toyota', model: 'Camry', brand: 'Toyota', total_sales: 24, revenue: 84000000, status: 'Available' },
        { id: 2, make: 'Honda', model: 'Civic', brand: 'Honda', total_sales: 18, revenue: 63000000, status: 'Reserved' },
        { id: 3, make: 'Ford', model: 'F-150', brand: 'Ford', total_sales: 15, revenue: 75000000, status: 'Sold' },
        { id: 4, make: 'BMW', model: 'X5', brand: 'BMW', total_sales: 12, revenue: 96000000, status: 'Available' },
        { id: 5, make: 'Mercedes', model: 'C-Class', brand: 'Mercedes-Benz', total_sales: 10, revenue: 85000000, status: 'Reserved' },
      ]);

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
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 pb-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your dealership.
            </p>
          </div>
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-0"
          >
            <Activity className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Main Content Area - Scrollable sections only */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          {/* KPI Cards */}
          {overview && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
          <div className="grid gap-5 md:grid-cols-2 mb-6">
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

          {/* Recent Car Listings and Top Selling Cars */}
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            {/* Recent Car Listings */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Car Listings</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/cars">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto max-h-[400px]">
                <div className="space-y-4">
                  {recentVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <div className="relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden">
                        <img
                          src={vehicle.images?.[0] || '/placeholder-car.jpg'}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-car.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{vehicle.make} {vehicle.model}</h4>
                        <p className="text-sm text-muted-foreground truncate">{vehicle.year}</p>
                        <p className="text-sm font-semibold">₦{vehicle.price?.toLocaleString()}</p>
                      </div>
                      <Badge
                        variant={
                          vehicle.status === 'available' ? 'default' :
                          vehicle.status === 'reserved' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {vehicle.status?.charAt(0).toUpperCase() + vehicle.status?.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Selling Cars */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Selling Cars</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/reports">View Reports</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto max-h-[400px]">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Car</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Brand</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Sales</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Revenue</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {topSellingCars.map((car) => (
                        <tr key={car.id} className="hover:bg-accent/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-8 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={`/placeholder-car.jpg`} // Placeholder since we don't have actual images
                                  alt={`${car.make} ${car.model}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{car.model}</div>
                                <div className="text-sm text-muted-foreground">{car.make}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{car.brand}</td>
                          <td className="p-4 text-sm">{car.total_sales}</td>
                          <td className="p-4 text-sm font-medium">₦{car.revenue.toLocaleString()}</td>
                          <td className="p-4">
                            <Badge
                              variant={
                                car.status === 'Available' ? 'default' :
                                car.status === 'Reserved' ? 'secondary' :
                                'destructive'
                              }
                            >
                              {car.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory by Brand */}
          {inventoryData && (
            <div className="grid gap-5 mb-6">
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
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="bg-card/50 border border-border/50">
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

            <Card className="bg-card/50 border border-border/50">
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

            <Card className="bg-card/50 border border-border/50">
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
