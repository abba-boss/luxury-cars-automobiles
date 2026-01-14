import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Car, 
  ShoppingCart, 
  MessageCircle, 
  TrendingUp, 
  DollarSign, 
  Eye,
  BarChart3,
  Package,
  Calendar,
  MapPin,
  Star,
  Plus,
  Activity,
  Filter,
  Download
} from "lucide-react";
import { PremiumPublicLayout } from "@/components/layout/PremiumPublicLayout";

const PremiumAdminDashboard = () => {
  const [stats] = useState({
    totalUsers: 1242,
    totalVehicles: 89,
    totalSales: 245,
    totalRevenue: 4567890,
    newUsers: 24,
    newVehicles: 5,
    pendingOrders: 12,
    avgRating: 4.8
  });

  const recentActivities = [
    { id: 1, type: 'sale', user: 'John Doe', vehicle: 'Mercedes-Benz S-Class', amount: '$85,000', time: '2 mins ago' },
    { id: 2, type: 'inquiry', user: 'Jane Smith', vehicle: 'BMW X7', message: 'Interested in test drive', time: '15 mins ago' },
    { id: 3, type: 'review', user: 'Robert Johnson', vehicle: 'Audi Q8', rating: 5, time: '1 hour ago' },
    { id: 4, type: 'booking', user: 'Emily Davis', vehicle: 'Porsche 911', type: 'test drive', time: '2 hours ago' },
    { id: 5, type: 'user', user: 'Michael Wilson', action: 'New registration', time: '3 hours ago' },
  ];

  const topVehicles = [
    { id: 1, name: 'Mercedes-Benz S-Class', views: 1240, inquiries: 42, sales: 8 },
    { id: 2, name: 'BMW X7', views: 980, inquiries: 38, sales: 6 },
    { id: 3, name: 'Audi Q8', views: 870, inquiries: 35, sales: 5 },
    { id: 4, name: 'Porsche 911', views: 760, inquiries: 30, sales: 4 },
    { id: 5, name: 'Land Rover Defender', views: 650, inquiries: 28, sales: 3 },
  ];

  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 45 },
    { month: 'Feb', sales: 52 },
    { month: 'Mar', sales: 48 },
    { month: 'Apr', sales: 61 },
    { month: 'May', sales: 55 },
    { month: 'Jun', sales: 67 },
  ];

  return (
    <PremiumPublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome back, Administrator. Here's what's happening today.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 hover:border-red-500">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
              <Users className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-gray-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                +{stats.newUsers} this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Vehicles</CardTitle>
              <Car className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalVehicles}</div>
              <p className="text-xs text-gray-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                +{stats.newVehicles} added
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Sales</CardTitle>
              <ShoppingCart className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalSales}</div>
              <p className="text-xs text-gray-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${Math.round(stats.totalRevenue / 1000)}K
              </div>
              <p className="text-xs text-gray-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                +8.5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white">Sales Overview</CardTitle>
                  <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800 hover:border-red-500">
                    View Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      {salesData.map((data, index) => (
                        <span key={index}>{data.month}</span>
                      ))}
                    </div>
                    <div className="flex items-end justify-between h-64">
                      {salesData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center w-10">
                          <div 
                            className="w-6 bg-gradient-to-t from-red-600 to-red-800 rounded-t-lg"
                            style={{ height: `${(data.sales / 70) * 100}%` }}
                          ></div>
                          <span className="text-xs text-gray-400 mt-2">{data.sales}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div>
            <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800 h-full">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                        <Activity className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Active Users</p>
                        <p className="text-sm text-gray-400">Online now</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-white">124</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <MessageCircle className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Pending Inquiries</p>
                        <p className="text-sm text-gray-400">Awaiting response</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-white">{stats.pendingOrders}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                        <Star className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Avg. Rating</p>
                        <p className="text-sm text-gray-400">Customer satisfaction</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-white">{stats.avgRating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activities and Top Vehicles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activities */}
          <div>
            <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white">Recent Activities</CardTitle>
                  <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800 hover:border-red-500">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center">
                        {activity.type === 'sale' && (
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
                            <ShoppingCart className="h-5 w-5 text-emerald-500" />
                          </div>
                        )}
                        {activity.type === 'inquiry' && (
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                          </div>
                        )}
                        {activity.type === 'review' && (
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-4">
                            <Star className="h-5 w-5 text-amber-500" />
                          </div>
                        )}
                        {activity.type === 'booking' && (
                          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mr-4">
                            <Calendar className="h-5 w-5 text-violet-500" />
                          </div>
                        )}
                        {activity.type === 'user' && (
                          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
                            <Users className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                        
                        <div>
                          <p className="font-medium text-white">
                            {activity.user} {activity.type === 'sale' && 'completed a purchase'}
                            {activity.type === 'inquiry' && 'sent an inquiry'}
                            {activity.type === 'review' && 'left a review'}
                            {activity.type === 'booking' && 'booked a ' + activity.type}
                            {activity.type === 'user' && activity.action}
                          </p>
                          <p className="text-sm text-gray-400">
                            {activity.vehicle && `for ${activity.vehicle}`}
                            {activity.message && activity.message}
                            {activity.rating && `Rating: ${activity.rating}/5`}
                            {activity.amount && activity.amount}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Vehicles */}
          <div>
            <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white">Top Performing Vehicles</CardTitle>
                  <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800 hover:border-red-500">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVehicles.map(vehicle => (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div>
                        <p className="font-medium text-white">{vehicle.name}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-400">
                          <span>{vehicle.views} views</span>
                          <span>{vehicle.inquiries} inquiries</span>
                          <span>{vehicle.sales} sales</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800 hover:border-red-500">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button className="flex flex-col items-center justify-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 py-6 rounded-2xl">
                  <Plus className="h-6 w-6 mb-2" />
                  <span>Add Vehicle</span>
                </Button>
                <Button className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-6 rounded-2xl">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Manage Users</span>
                </Button>
                <Button className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-6 rounded-2xl">
                  <Package className="h-6 w-6 mb-2" />
                  <span>View Orders</span>
                </Button>
                <Button className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-6 rounded-2xl">
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <span>Messages</span>
                </Button>
                <Button className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-6 rounded-2xl">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Analytics</span>
                </Button>
                <Button className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-6 rounded-2xl">
                  <Car className="h-6 w-6 mb-2" />
                  <span>Inventory</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PremiumPublicLayout>
  );
};

export default PremiumAdminDashboard;