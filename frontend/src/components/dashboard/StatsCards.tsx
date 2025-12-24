import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Car, Users, Eye, DollarSign, Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Cars",
    value: "1,284",
    change: "+12%",
    trend: "up",
    icon: Car,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    description: "vehicles in inventory"
  },
  {
    label: "Active Customers",
    value: "2,847",
    change: "+23%",
    trend: "up",
    icon: Users,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    description: "registered users"
  },
  {
    label: "Total Revenue",
    value: "₦892M",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "text-primary",
    bgColor: "bg-primary/20",
    description: "this month"
  },
  {
    label: "Page Views",
    value: "45.2K",
    change: "+31%",
    trend: "up",
    icon: Eye,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    description: "monthly visits"
  },
  {
    label: "Saved Cars",
    value: "3,921",
    change: "+15%",
    trend: "up",
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/20",
    description: "wishlisted items"
  },
  {
    label: "Enquiries",
    value: "156",
    change: "-8%",
    trend: "down",
    icon: MessageSquare,
    color: "text-violet-400",
    bgColor: "bg-violet-500/20",
    description: "pending responses"
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const isPositive = stat.trend === "up";
        
        return (
          <Card 
            key={stat.label} 
            variant="premium" 
            className={cn(
              "p-4 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in group cursor-pointer"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-3">
                <div className={cn(
                  "p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110",
                  stat.bgColor
                )}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1",
                  isPositive 
                    ? "text-emerald-400 bg-emerald-500/20" 
                    : "text-rose-400 bg-rose-500/20"
                )}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-0.5 transition-colors duration-300 group-hover:text-primary">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-foreground/80">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
