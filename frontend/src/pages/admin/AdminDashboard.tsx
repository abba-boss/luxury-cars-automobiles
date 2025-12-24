import { Link } from 'react-router-dom';
import {
  Car,
  Users,
  MessageSquare,
  Eye,
  ArrowRight,
  Calendar,
  Upload,
  Star,
  Activity,
  Package,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import AdminChart from '@/components/admin/AdminChart';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminDashboardStats } from '@/hooks/useAdminData';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
  const { 
    stats, 
    categoryData, 
    brandData, 
    recentCars, 
    recentInquiries,
    isLoading 
  } = useAdminDashboardStats();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      label: 'Total Cars',
      value: stats.totalCars.toString(),
      change: `${stats.publishedCars} published`,
      trend: 'up' as const,
      icon: Car,
      color: 'bg-primary/20 text-primary',
    },
    {
      label: 'Active Users',
      value: stats.totalUsers.toString(),
      change: 'Registered users',
      trend: 'up' as const,
      icon: Users,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      label: 'Inquiries',
      value: stats.totalInquiries.toString(),
      change: `${stats.pendingInquiries} pending`,
      trend: 'up' as const,
      icon: MessageSquare,
      color: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      label: 'Featured',
      value: stats.featuredCars.toString(),
      change: 'Featured cars',
      trend: 'up' as const,
      icon: Star,
      color: 'bg-amber-500/20 text-amber-400',
    },
    {
      label: 'New Arrivals',
      value: stats.newArrivals.toString(),
      change: 'New listings',
      trend: 'up' as const,
      icon: Package,
      color: 'bg-purple-500/20 text-purple-400',
    },
    {
      label: 'Sold',
      value: stats.soldCars.toString(),
      change: 'Vehicles sold',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'bg-yellow-500/20 text-yellow-400',
    },
  ];

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <StatCard key={stat.label} {...stat} delay={idx * 100} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AdminChart 
          title="Category Distribution" 
          subtitle="Cars by category"
          data={categoryData.length > 0 ? categoryData : [{ name: 'No data', value: 0 }]}
          type="bar"
        />
        <AdminChart 
          title="Top Brands" 
          subtitle="Inventory by brand"
          data={brandData.slice(0, 6)}
          type="pie"
          height={250}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quick Actions Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/add-car">
              <Button className="w-full gap-2 h-auto py-4 rounded-xl" size="lg">
                <Upload className="w-5 h-5" />
                <span>Add New Car</span>
              </Button>
            </Link>
            <Link to="/admin/messages">
              <Button variant="outline" className="w-full gap-2 h-auto py-4 rounded-xl" size="lg">
                <MessageSquare className="w-5 h-5" />
                <span>Messages</span>
              </Button>
            </Link>
            <Link to="/admin/inventory">
              <Button variant="outline" className="w-full gap-2 h-auto py-4 rounded-xl" size="lg">
                <Car className="w-5 h-5" />
                <span>Inventory</span>
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="outline" className="w-full gap-2 h-auto py-4 rounded-xl" size="lg">
                <Users className="w-5 h-5" />
                <span>Users</span>
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">System Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <span className="text-sm text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Records</span>
                <span className="text-sm text-muted-foreground">{stats.totalCars + stats.totalUsers + stats.totalInquiries}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Inquiries</h2>
            <Link to="/admin/messages">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentInquiries.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No inquiries yet</p>
            ) : (
              recentInquiries.map((inquiry, idx) => (
                <div 
                  key={inquiry.id} 
                  className="flex items-start gap-3 animate-fade-in" 
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{inquiry.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {inquiry.created_at ? formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true }) : 'Recently'}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      inquiry.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    )}
                  >
                    {inquiry.status || 'pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Listings</h2>
          <Link to="/admin/inventory">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        {recentCars.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No cars in inventory</p>
            <Link to="/admin/add-car">
              <Button className="mt-4">Add Your First Car</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Condition</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentCars.map((car, idx) => (
                  <tr 
                    key={car.id} 
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {car.images && car.images.length > 0 ? (
                          <img 
                            src={car.images[0]} 
                            alt={car.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                            <Car className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{car.title}</p>
                          <p className="text-xs text-muted-foreground">{car.brand} {car.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground capitalize">{car.category}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground capitalize">{car.condition}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          car.is_published
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        )}
                      >
                        {car.is_sold ? 'Sold' : car.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link to={`/cars/${car.id}`}>
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
