import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading';
import { staffService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  Star,
  Calendar,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

const StaffReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    loadReports();
  }, [dateRange, reportType]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would call the API with date range and report type
      // For now, we'll simulate the data
      const mockReports = {
        salesSummary: {
          totalSales: 42,
          revenue: 8500000,
          avgOrderValue: 202380,
          topSellingModels: [
            { model: 'Toyota Camry', sales: 8 },
            { model: 'BMW X5', sales: 7 },
            { model: 'Mercedes-Benz E-Class', sales: 6 }
          ]
        },
        inventoryStatus: {
          totalVehicles: 120,
          available: 78,
          sold: 32,
          reserved: 10,
          topBrands: [
            { brand: 'Toyota', count: 22 },
            { brand: 'BMW', count: 18 },
            { brand: 'Mercedes-Benz', count: 15 }
          ]
        },
        customerEngagement: {
          inquiries: 125,
          reviews: 89,
          testDrives: 67,
          conversionRate: 34.5
        }
      };
      
      setReports(mockReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">View business performance metrics</p>
          </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card variant="premium">
          <CardHeader className="p-4 bg-muted/5 rounded-t-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="reviews">Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-40"
                />
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-40"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Sales Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{reports?.salesSummary?.totalSales || 0}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(reports?.salesSummary?.revenue || 0)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {formatCurrency(reports?.salesSummary?.avgOrderValue || 0)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {reports?.customerEngagement?.conversionRate || 0}%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Models */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card variant="premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Top Selling Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports?.salesSummary?.topSellingModels?.map((model: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{model.model}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{model.sales}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {((model.sales / (reports?.salesSummary?.totalSales || 1)) * 100).toFixed(1)}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Top Brands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>% of Inventory</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports?.inventoryStatus?.topBrands?.map((brand: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{brand.brand}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{brand.count}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {((brand.count / (reports?.inventoryStatus?.totalVehicles || 1)) * 100).toFixed(1)}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Customer Engagement */}
        <Card variant="premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/30">
                <div className="text-2xl font-bold text-blue-400">
                  {reports?.customerEngagement?.inquiries || 0}
                </div>
                <div className="text-sm text-muted-foreground">Inquiries</div>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/30">
                <div className="text-2xl font-bold text-emerald-400">
                  {reports?.customerEngagement?.reviews || 0}
                </div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/30">
                <div className="text-2xl font-bold text-amber-400">
                  {reports?.customerEngagement?.testDrives || 0}
                </div>
                <div className="text-sm text-muted-foreground">Test Drives</div>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/30">
                <div className="text-2xl font-bold text-purple-400">
                  {reports?.customerEngagement?.conversionRate || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StaffReports;