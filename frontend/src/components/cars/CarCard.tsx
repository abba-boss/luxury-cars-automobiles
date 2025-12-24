import { useState } from "react";
import { Link } from "react-router-dom";
import { Car } from "@/types/car";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Gauge, Calendar, Fuel, CheckCircle, Scale, Plus, Star, Eye } from "lucide-react";
import { formatPrice, formatMileage } from "@/data/cars";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CarCardProps {
  car: Car;
  className?: string;
}

export function CarCard({ car, className }: CarCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    toast.success(`${!isFavorite ? 'Added to' : 'Removed from'} favorites`);
  };

  return (
    <Card
      variant="premium"
      className={cn("group overflow-hidden relative transition-all duration-500 hover:shadow-lg hover:shadow-primary/10", className)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {car.isVerified && (
            <Badge variant="verified" className="gap-1 px-2 py-1 text-xs">
              <CheckCircle className="h-3 w-3" />
              Verified
            </Badge>
          )}
          {car.isHotDeal && (
            <Badge variant="hot" className="px-2 py-1 text-xs">
              Hot Deal
            </Badge>
          )}
          {car.condition === "Brand New" && (
            <Badge variant="new" className="px-2 py-1 text-xs">
              Brand New
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary/20 hover:text-primary transition-all duration-300 group-hover:opacity-100 opacity-0"
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn("h-4 w-4 transition-colors", isFavorite ? "fill-primary text-primary" : "text-foreground")}
          />
        </Button>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-sm">
          <p className="text-lg font-bold text-foreground">
            {formatPrice(car.price)}
          </p>
        </div>

        {/* Quick View Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm bg-background/70 hover:bg-primary/20 hover:text-primary"
          asChild
        >
          <Link to={`/cars/${car.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            Quick View
          </Link>
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {car.condition}
            {car.condition === "Brand New" && (
              <>
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span>Excellent</span>
              </>
            )}
          </p>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gauge className="h-3.5 w-3.5" />
            <span>{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Fuel className="h-3.5 w-3.5" />
            <span>{car.fuelType}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2">
          <Link to={`/cars/${car.id}`}>
            <Button className="w-full btn-luxury">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
