import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingCart, 
  Star,
  Edit,
  Shield,
  Car
} from "lucide-react";
import { PremiumPublicLayout } from "@/components/layout/PremiumPublicLayout";

const PremiumProfilePage = () => {
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 800 000 0000",
    address: "123 Luxury Avenue, Victoria Island, Lagos",
    joinDate: "January 15, 2024",
    orders: 12,
    reviews: 5,
    verified: true
  });

  const [activeTab, setActiveTab] = useState('profile');

  const recentOrders = [
    { id: 1, vehicle: "Mercedes-Benz S-Class", date: "2024-01-10", status: "Delivered", amount: "$85,000" },
    { id: 2, vehicle: "BMW X7", date: "2024-01-05", status: "Delivered", amount: "$75,000" },
    { id: 3, vehicle: "Audi Q8", date: "2023-12-20", status: "Delivered", amount: "$80,000" },
    { id: 4, vehicle: "Porsche 911", date: "2023-12-10", status: "Processing", amount: "$120,000" },
  ];

  return (
    <PremiumPublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  {user.verified && (
                    <Badge variant="premium" className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified Customer
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Button 
                    variant={activeTab === 'profile' ? 'default' : 'ghost'} 
                    className={`w-full justify-start ${activeTab === 'profile' ? 'bg-gradient-to-r from-red-600 to-red-800' : 'text-gray-300 hover:text-white'}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === 'orders' ? 'default' : 'ghost'} 
                    className={`w-full justify-start ${activeTab === 'orders' ? 'bg-gradient-to-r from-red-600 to-red-800' : 'text-gray-300 hover:text-white'}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <ShoppingCart className="w-4 h-4 mr-3" />
                    My Orders
                  </Button>
                  <Button 
                    variant={activeTab === 'reviews' ? 'default' : 'ghost'} 
                    className={`w-full justify-start ${activeTab === 'reviews' ? 'bg-gradient-to-r from-red-600 to-red-800' : 'text-gray-300 hover:text-white'}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    <Star className="w-4 h-4 mr-3" />
                    My Reviews
                  </Button>
                  <Button 
                    variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                    className={`w-full justify-start ${activeTab === 'settings' ? 'bg-gradient-to-r from-red-600 to-red-800' : 'text-gray-300 hover:text-white'}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <Edit className="w-4 h-4 mr-3" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Full Name</h3>
                        <p className="text-white flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          {user.name}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                        <p className="text-white flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Phone</h3>
                        <p className="text-white flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          {user.phone}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Address</h3>
                        <p className="text-white flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          {user.address}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Member Since</h3>
                        <p className="text-white flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          {user.joinDate}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Account Status</h3>
                        <Badge variant="premium" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Account Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <div className="flex items-center">
                          <ShoppingCart className="w-8 h-8 text-red-500 mr-3" />
                          <div>
                            <p className="text-2xl font-bold text-white">{user.orders}</p>
                            <p className="text-sm text-gray-400">Orders</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <div className="flex items-center">
                          <Star className="w-8 h-8 text-amber-500 mr-3" />
                          <div>
                            <p className="text-2xl font-bold text-white">{user.reviews}</p>
                            <p className="text-sm text-gray-400">Reviews</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <div className="flex items-center">
                          <Car className="w-8 h-8 text-blue-500 mr-3" />
                          <div>
                            <p className="text-2xl font-bold text-white">VIP</p>
                            <p className="text-sm text-gray-400">Tier</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'orders' && (
              <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white">My Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 text-sm">
                          <th className="pb-4 font-medium">Order ID</th>
                          <th className="pb-4 font-medium">Vehicle</th>
                          <th className="pb-4 font-medium">Date</th>
                          <th className="pb-4 font-medium">Amount</th>
                          <th className="pb-4 font-medium">Status</th>
                          <th className="pb-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => (
                          <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="py-4 text-white">#ORD-{order.id.toString().padStart(4, '0')}</td>
                            <td className="py-4 text-white">{order.vehicle}</td>
                            <td className="py-4 text-gray-300">{order.date}</td>
                            <td className="py-4 text-white">{order.amount}</td>
                            <td className="py-4">
                              <Badge 
                                variant="premium" 
                                className={
                                  order.status === 'Delivered' 
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                }
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td className="py-4">
                              <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800 hover:border-red-500">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'reviews' && (
              <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white">My Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[1, 2].map(review => (
                      <div key={review} className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-white">Mercedes-Benz S-Class</h3>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                              ))}
                            </div>
                          </div>
                          <Badge variant="premium" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            Jan 10, 2024
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-4">
                          Exceptional vehicle with outstanding performance and comfort. The buying process was seamless and the customer service was top-notch.
                        </p>
                        <div className="flex justify-end">
                          <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 hover:border-red-500">
                            Edit Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        {[
                          { id: 'order_updates', label: 'Order Updates', checked: true },
                          { id: 'promotions', label: 'Promotional Offers', checked: false },
                          { id: 'newsletters', label: 'Newsletters', checked: true },
                          { id: 'reminders', label: 'Service Reminders', checked: true },
                        ].map(setting => (
                          <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <span className="text-gray-300">{setting.label}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                defaultChecked={setting.checked}
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-800">
                      <h3 className="text-lg font-medium text-white mb-4">Security Settings</h3>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start border-gray-700 text-white hover:bg-gray-800 hover:border-red-500">
                          Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start border-gray-700 text-white hover:bg-gray-800 hover:border-red-500">
                          Two-Factor Authentication
                        </Button>
                        <Button variant="outline" className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PremiumPublicLayout>
  );
};

export default PremiumProfilePage;