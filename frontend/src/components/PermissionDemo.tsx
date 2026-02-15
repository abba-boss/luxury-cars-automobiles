import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheckIcon, Car, Package, Users, Star, BarChart3, Settings, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PermissionDemo = () => {
  const { user, hasPermission, isAdmin, isStaff, refreshPermissions } = useAuth();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5" />
            Permission Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p><strong>Current Role:</strong> {user?.role || 'Not logged in'}</p>
            <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
            <p><strong>Is Staff:</strong> {isStaff ? 'Yes' : 'No'}</p>
          </div>
          
          <Button onClick={refreshPermissions} className="mb-4">
            Refresh Permissions
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inventory Management */}
            <Card className={hasPermission('manage_inventory') ? 'border-green-500 bg-green-50' : 'opacity-50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Inventory Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {hasPermission('manage_inventory') ? 'ACCESS GRANTED' : 'NO ACCESS'}</p>
                {hasPermission('manage_inventory') && (
                  <Button asChild className="mt-2">
                    <Link to="/staff/vehicles">Go to Inventory</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Order Management */}
            <Card className={hasPermission('view_orders') ? 'border-green-500 bg-green-50' : 'opacity-50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {hasPermission('view_orders') ? 'ACCESS GRANTED' : 'NO ACCESS'}</p>
                {hasPermission('view_orders') && (
                  <Button asChild className="mt-2">
                    <Link to="/staff/orders">Go to Orders</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Customer Management */}
            <Card className={hasPermission('manage_customers') ? 'border-green-500 bg-green-50' : 'opacity-50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Customer Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {hasPermission('manage_customers') ? 'ACCESS GRANTED' : 'NO ACCESS'}</p>
                {hasPermission('manage_customers') && (
                  <Button asChild className="mt-2">
                    <Link to="/staff/customers">Go to Customers</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Review Management */}
            <Card className={hasPermission('manage_reviews') ? 'border-green-500 bg-green-50' : 'opacity-50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Review Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {hasPermission('manage_reviews') ? 'ACCESS GRANTED' : 'NO ACCESS'}</p>
                {hasPermission('manage_reviews') && (
                  <Button asChild className="mt-2">
                    <Link to="/staff/reviews">Go to Reviews</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Report Access */}
            <Card className={hasPermission('view_reports') ? 'border-green-500 bg-green-50' : 'opacity-50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {hasPermission('view_reports') ? 'ACCESS GRANTED' : 'NO ACCESS'}</p>
                {hasPermission('view_reports') && (
                  <Button asChild className="mt-2">
                    <Link to="/staff/reports">Go to Reports</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card className={hasPermission('access_system_settings') ? 'border-green-500 bg-green-50' : 'opacity-50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {hasPermission('access_system_settings') ? 'ACCESS GRANTED' : 'NO ACCESS'}</p>
                {hasPermission('access_system_settings') && (
                  <Button asChild className="mt-2">
                    <Link to="/staff/settings">Go to Settings</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Inquiry Management */}
            <Card className={hasPermission('respond_to_inquiries') ? 'border-green-500 bg-green-50' : 'opacity-50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Inquiry Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {hasPermission('respond_to_inquiries') ? 'ACCESS GRANTED' : 'NO ACCESS'}</p>
                {hasPermission('respond_to_inquiries') && (
                  <Button asChild className="mt-2">
                    <Link to="/staff/inquiries">Go to Inquiries</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};