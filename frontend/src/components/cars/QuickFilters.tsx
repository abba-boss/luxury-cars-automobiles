import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Car, 
  Flame, 
  Sparkles, 
  Truck, 
  Gauge, 
  Zap,
  Crown,
  Globe
} from "lucide-react";

const categories = [
  { id: "all", label: "All Cars", icon: Car },
  { id: "hot-deals", label: "Hot Deals", icon: Flame },
  { id: "new-arrivals", label: "New Arrivals", icon: Sparkles },
  { id: "suv", label: "SUV", icon: Truck },
  { id: "sports", label: "Sports", icon: Gauge },
  { id: "electric", label: "Electric", icon: Zap },
  { id: "luxury", label: "Luxury", icon: Crown },
  { id: "tokunbo", label: "Tokunbo", icon: Globe },
];

interface QuickFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function QuickFilters({ activeFilter, onFilterChange }: QuickFiltersProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
      {categories.map((category, index) => {
        const Icon = category.icon;
        const isActive = activeFilter === category.id;
        
        return (
          <Button
            key={category.id}
            variant={isActive ? "default" : "secondary"}
            size="sm"
            className={cn(
              "whitespace-nowrap rounded-full px-5 py-2.5 gap-2 transition-all duration-300 transform hover:scale-105 flex items-center",
              isActive && "shadow-glow bg-primary hover:bg-primary/90 text-primary-foreground",
              !isActive && "hover:bg-secondary/80 hover:border-primary/30 text-foreground"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => onFilterChange(category.id)}
          >
            <Icon className={cn(
              "h-4 w-4 transition-transform duration-300",
              isActive && "animate-bounce"
            )} />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
