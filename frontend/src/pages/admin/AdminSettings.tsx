import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

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
            <div className="rounded-2xl bg-card border border-border p-6">
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
                  <Label>Email</Label>
                  <Input defaultValue="admin@sarkinmota.com" className="mt-1 rounded-xl" />
                  {/* Note: Email domain still uses original brand name - should be updated separately if needed */}
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input defaultValue="+234 801 234 5678" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input value="Administrator" disabled className="mt-1 rounded-xl bg-secondary/50" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-6">
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
                <Button className="rounded-xl">Update Password</Button>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Two-Factor Authentication</h3>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Active Sessions</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Chrome on MacOS</p>
                    <p className="text-xs text-muted-foreground">Lagos, Nigeria • Current session</p>
                  </div>
                  <span className="text-xs text-emerald-400">Active</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Safari on iPhone</p>
                    <p className="text-xs text-muted-foreground">Abuja, Nigeria • 2 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business" className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Business Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Business Name</Label>
                  <Input defaultValue="luxury car" className="mt-1 rounded-xl" />
                  {/* Replaced "Sarkin Mota" brand name with generic term */}
                </div>
                <div>
                  <Label>Registration Number</Label>
                  <Input defaultValue="RC123456" className="mt-1 rounded-xl" />
                </div>
                <div className="md:col-span-2">
                  <Label>Business Address</Label>
                  <Textarea 
                    defaultValue="Plot 123, Victoria Island, Lagos, Nigeria" 
                    className="mt-1 rounded-xl"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Primary Phone
                  </Label>
                  <Input defaultValue="+234 801 234 5678" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> WhatsApp
                  </Label>
                  <Input defaultValue="+234 801 234 5678" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Support Email
                  </Label>
                  <Input defaultValue="support@sarkinmota.com" className="mt-1 rounded-xl" />
                  {/* Note: Email domain still uses original brand name - should be updated separately if needed */}
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Sales Email
                  </Label>
                  <Input defaultValue="sales@sarkinmota.com" className="mt-1 rounded-xl" />
                  {/* Note: Email domain still uses original brand name - should be updated separately if needed */}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Showroom Locations</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Lagos Showroom</p>
                      <p className="text-sm text-muted-foreground">Plot 123, Victoria Island, Lagos</p>
                      <p className="text-xs text-muted-foreground mt-1">Mon-Sat: 9AM - 6PM</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Abuja Showroom</p>
                      <p className="text-sm text-muted-foreground">Plot 456, Maitama District, Abuja</p>
                      <p className="text-xs text-muted-foreground mt-1">Mon-Sat: 9AM - 6PM</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-xl">Add Location</Button>
              </div>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Theme Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Use dark theme for the admin panel</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Brand Colors</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Primary Color</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary" />
                    <Input defaultValue="#D72638" className="rounded-lg" />
                  </div>
                </div>
                <div>
                  <Label>Background</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-background border" />
                    <Input defaultValue="#0D0F12" className="rounded-lg" />
                  </div>
                </div>
                <div>
                  <Label>Success</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-success" />
                    <Input defaultValue="#22C55E" className="rounded-lg" />
                  </div>
                </div>
                <div>
                  <Label>Warning</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-warning" />
                    <Input defaultValue="#F59E0B" className="rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-6">
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
                    <p className="font-medium text-foreground">Currency</p>
                    <p className="text-sm text-muted-foreground">Default currency for pricing</p>
                  </div>
                  <Select defaultValue="ngn">
                    <SelectTrigger className="w-32 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ngn">NGN (₦)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Timezone</p>
                    <p className="text-sm text-muted-foreground">System timezone</p>
                  </div>
                  <Select defaultValue="wat">
                    <SelectTrigger className="w-48 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wat">West Africa Time (WAT)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Storage</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Used Space</span>
                  <span className="text-muted-foreground">2.4 GB / 10 GB</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[24%] bg-primary rounded-full" />
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Images: 1.8 GB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-muted-foreground">Videos: 0.5 GB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground">Other: 0.1 GB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-6">
              <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These actions are irreversible. Please proceed with caution.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                  Clear Cache
                </Button>
                <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                  Reset Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
