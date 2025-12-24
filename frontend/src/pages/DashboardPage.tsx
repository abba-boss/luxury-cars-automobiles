import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { featuredCars, formatPrice } from "@/data/cars";
import {
  Car,
  Eye,
  MessageSquare,
  TrendingUp,
  Plus,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const recentEnquiries = [
    {
      id: 1,
      carName: "2022 Toyota Camry",
      customerName: "Adebayo Johnson",
      message: "Is this car still available?",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      carName: "2021 Lexus RX 350",
      customerName: "Chioma Okonkwo",
      message: "Can I schedule a test drive?",
      time: "5 hours ago",
      status: "replied",
    },
    {
      id: 3,
      carName: "2020 Mercedes E-Class",
      customerName: "Emeka Nwachukwu",
      message: "What's the lowest price?",
      time: "1 day ago",
      status: "pending",
    },
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back, Admin">
      {/* Stats */}
      <section className="mb-8">
        <StatsCards />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inventory */}
        <div className="lg:col-span-2">
          <Card variant="premium" className="p-6">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Recent Inventory
                </CardTitle>
                <Link to="/add-car">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Car
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {featuredCars.slice(0, 4).map((car) => (
                  <div
                    key={car.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <img
                      src={car.images[0]}
                      alt={`${car.make} ${car.model}`}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {car.year} {car.make} {car.model}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(car.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {car.isVerified ? (
                        <Badge variant="verified" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="muted" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Enquiries */}
        <div>
          <Card variant="premium" className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Recent Enquiries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground text-sm">
                        {enquiry.customerName}
                      </h4>
                      {enquiry.status === "pending" ? (
                        <Badge variant="hot" className="text-xs">New</Badge>
                      ) : (
                        <Badge variant="muted" className="text-xs">Replied</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {enquiry.carName}
                    </p>
                    <p className="text-sm text-foreground/80 truncate">
                      "{enquiry.message}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {enquiry.time}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View All Enquiries
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/add-car">
            <Card variant="premium" className="p-4 hover:border-primary/50 transition-all cursor-pointer">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <span className="font-medium text-foreground text-sm">Add New Car</span>
              </div>
            </Card>
          </Link>
          <Link to="/cars">
            <Card variant="premium" className="p-4 hover:border-primary/50 transition-all cursor-pointer">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Car className="h-6 w-6 text-blue-400" />
                </div>
                <span className="font-medium text-foreground text-sm">Manage Inventory</span>
              </div>
            </Card>
          </Link>
          <Card variant="premium" className="p-4 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Eye className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="font-medium text-foreground text-sm">View Analytics</span>
            </div>
          </Card>
          <Card variant="premium" className="p-4 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-400" />
              </div>
              <span className="font-medium text-foreground text-sm">Promotions</span>
            </div>
          </Card>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default DashboardPage;
