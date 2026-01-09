import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Car } from "@/types/car";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Gauge, Calendar, Fuel, CheckCircle, Scale, Plus, Star, Eye, ShoppingCart } from "lucide-react";
import { formatPrice, formatMileage } from "@/data/cars";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { useAuth } from "@/hooks/useAuth";
import { favoriteService } from "@/services";

interface CarCardProps {
  car: Car;
  className?: string;
}

export function CarCard({ car, className }: CarCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();

  // Check favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !car.id) return;
      
      try {
        const response = await favoriteService.checkFavorite(car.id);
        if (response.success) {
          setIsFavorite(response.data.isFavorite);
        }
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [car.id, user]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    toast.success(`${!isFavorite ? 'Added to' : 'Removed from'} favorites`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      image: (car.images && car.images[0]) || `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}/uploads/placeholder-car.svg`
    });
  };

  return (
    <Card
      variant="premium"
      className={cn("group overflow-hidden relative transition-all duration-500 hover:shadow-lg hover:shadow-primary/10", className)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/2] sm:aspect-[4/3] md:aspect-[16/10] overflow-hidden">
        <img
          src={imageError || !car.images[0] ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}/uploads/placeholder-car.svg` : car.images[0]}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={handleImageError}
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
        {user && (
          <FavoriteButton
            vehicleId={car.id}
            isFavorite={isFavorite}
            onToggle={setIsFavorite}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary/20 hover:text-primary transition-all duration-300 group-hover:opacity-100 opacity-0"
          />
        )}

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
            {car.year} {car.brand?.name || car.make} {car.model}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {car.condition} {car.bodyType && `• ${car.bodyType}`}
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
          {car.bodyType && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Scale className="h-3.5 w-3.5" />
              <span>{car.bodyType}</span>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={isInCart(car.id)}
            className={cn(
              "flex-1",
              isInCart(car.id) ? "bg-green-600 hover:bg-green-700" : "btn-luxury"
            )}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInCart(car.id) ? 'In Cart' : 'Add to Cart'}
          </Button>
          <Link to={`/cars/${car.id}`}>
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
