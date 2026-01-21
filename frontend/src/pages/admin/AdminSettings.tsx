import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  Database,
  Shield,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  Eye,
  EyeOff,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Settings</h2>
            <p className="text-muted-foreground">Manage your platform settings and preferences</p>
          </div>
          <Button className="gap-2 rounded-xl" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-card border border-border rounded-xl p-1 flex-wrap h-auto">
            <TabsTrigger value="profile" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="business" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe className="w-4 h-4" />
              Business
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="system" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Database className="w-4 h-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Admin Profile</h3>

              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">AD</span>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="rounded-xl gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Full Name</Label>
                  <Input defaultValue="Admin User" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input defaultValue="admin@sarkimmota.com" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input defaultValue="+234 801 234 5678" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input defaultValue="Administrator" className="mt-1 rounded-xl" readOnly />
                </div>
              </div>
            </Card>

            <Card variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Address</Label>
                  <Textarea defaultValue="123 Luxury Avenue, Abuja, Nigeria" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Biography</Label>
                  <Textarea defaultValue="Experienced admin managing luxury car sales and customer relations." className="mt-1 rounded-xl h-32" />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Change Password</h3>

              <div className="space-y-4 max-w-md">
                <div>
                  <Label>Current Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      className="rounded-xl pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input type="password" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input type="password" className="mt-1 rounded-xl" />
                </div>
                <Button className="mt-4 rounded-xl gap-2" onClick={handleSave}>
                  <Shield className="w-4 h-4" />
                  Update Password
                </Button>
              </div>
            </Card>

            <Card variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Security Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Login Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email notifications for new logins</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                  </div>
                  <Select defaultValue="24h">
                    <SelectTrigger className="w-32 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="6h">6 Hours</SelectItem>
                      <SelectItem value="12h">12 Hours</SelectItem>
                      <SelectItem value="24h">24 Hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Business Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Business Name</Label>
                  <Input defaultValue="Sarkin Mota" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Registration Number</Label>
                  <Input defaultValue="RC-1234567" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Business Email</Label>
                  <Input defaultValue="info@sarkimmota.com" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Business Phone</Label>
                  <Input defaultValue="+234 801 234 5678" className="mt-1 rounded-xl" />
                </div>
                <div className="md:col-span-2">
                  <Label>Business Address</Label>
                  <Textarea defaultValue="123 Luxury Avenue, Abuja, Nigeria" className="mt-1 rounded-xl" />
                </div>
                <div className="md:col-span-2">
                  <Label>Business Description</Label>
                  <Textarea defaultValue="Premium luxury car dealership offering the finest vehicles and exceptional customer service." className="mt-1 rounded-xl h-32" />
                </div>
              </div>
            </Card>

            <Card variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Tax & Legal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Tax ID Number</Label>
                  <Input defaultValue="TAX-7654321" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>VAT Registration</Label>
                  <Input defaultValue="VAT-123456789" className="mt-1 rounded-xl" />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Theme Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Use dark theme for the admin panel</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">Use compact layout for more content</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Large Text</p>
                    <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>

            <Card variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Customization</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    {['red', 'blue', 'green', 'purple', 'orange'].map(color => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded-full bg-${color}-500 cursor-pointer border-2 ${
                          color === 'blue' ? 'border-primary' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Logo Upload</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">SM</span>
                    </div>
                    <Button variant="outline" className="rounded-xl gap-2">
                      <Upload className="w-4 h-4" />
                      Change Logo
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">System Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Send email notifications for system events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Backup Schedule</p>
                    <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            <Card variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Performance Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Caching</p>
                    <p className="text-sm text-muted-foreground">Enable caching for better performance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Compression</p>
                    <p className="text-sm text-muted-foreground">Enable compression for faster loading</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Image Optimization</p>
                    <p className="text-sm text-muted-foreground">Automatically optimize uploaded images</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;