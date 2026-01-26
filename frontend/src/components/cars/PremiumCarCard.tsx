import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Car } from "@/types/car";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge, Calendar, Fuel, CheckCircle, Scale, Plus, Star, Eye, ShoppingCart, Award, Zap, Gem } from "lucide-react";
import { formatPrice, formatMileage } from "@/data/cars";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { PremiumFavoriteButton } from "@/components/ui/PremiumFavoriteButton";
import { useAuth } from "@/hooks/useAuth";
import { favoriteService } from "@/services";

interface CarCardProps {
  car: Car;
  className?: string;
}

export function PremiumCarCard({ car, className }: CarCardProps) {
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
      image: (car.images && car.images[0]) || `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3002'}/uploads/placeholder-car.svg`
    });
  };

  return (
    <Card
      className={cn("group overflow-hidden relative transition-all duration-700 hover:shadow-2xl hover:shadow-red-500/20 border-0 bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl", className)}
    >
      {/* Premium Image Container */}
      <div className="relative aspect-[3/2] sm:aspect-[4/3] md:aspect-[16/10] overflow-hidden">
        <img
          src={imageError || !car.images[0] ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3002'}/uploads/placeholder-car.svg` : car.images[0]}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Premium Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {car.isVerified && (
            <Badge variant="premium" className="gap-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 backdrop-blur-sm">
              <CheckCircle className="h-3.5 w-3.5" />
              Verified
            </Badge>
          )}
          {car.isHotDeal && (
            <Badge variant="premium" className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" />
              Hot Deal
            </Badge>
          )}
          {car.isFeatured && (
            <Badge variant="premium" className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 backdrop-blur-sm">
              <Gem className="h-3.5 w-3.5" />
              Featured
            </Badge>
          )}
          {car.condition === "Brand New" && (
            <Badge variant="premium" className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 backdrop-blur-sm">
              <Award className="h-3.5 w-3.5" />
              Brand New
            </Badge>
          )}
        </div>

        {/* Premium Favorite Button */}
        {user && (
          <PremiumFavoriteButton
            vehicleId={car.id}
            isFavorite={isFavorite}
            onToggle={setIsFavorite}
            className="absolute top-4 right-4"
          />
        )}

        {/* Premium Price Tag */}
        <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
          <p className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {formatPrice(car.price)}
          </p>
        </div>

        {/* Premium Quick View Button */}
        <Button
          variant="premium"
          size="sm"
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-md bg-black/40 border border-white/10 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 hover:border-red-500"
          asChild
        >
          <Link to={`/cars/${car.id}`}>
            <Eye className="h-4 w-4 mr-1.5" />
            View Details
          </Link>
        </Button>
      </div>

      {/* Premium Content */}
      <div className="p-5">
        {/* Title */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors duration-500 line-clamp-1">
            {car.year} {car.brand?.name || car.make} {car.model}
          </h3>
          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
            <span className="capitalize">{car.condition}</span>
            {car.bodyType && <span>• {car.bodyType}</span>}
            {car.condition === "Brand New" && (
              <>
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 ml-1" />
                <span className="text-yellow-400">Sarkin Mota Certified</span>
              </>
            )}
          </p>
        </div>

        {/* Premium Specs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Gauge className="h-4 w-4 text-red-500" />
            <span>{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="h-4 w-4 text-red-500" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Fuel className="h-4 w-4 text-red-500" />
            <span>{car.fuelType}</span>
          </div>
          {car.bodyType && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Scale className="h-4 w-4 text-red-500" />
              <span>{car.bodyType}</span>
            </div>
          )}
        </div>

        {/* Premium CTA Buttons */}
        <div className="flex gap-2.5">
          <Button
            onClick={handleAddToCart}
            disabled={isInCart(car.id)}
            className={cn(
              "flex-1 py-5 rounded-xl font-semibold text-base transition-all duration-500 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 border border-red-500/30 shadow-lg hover:shadow-xl hover:shadow-red-500/30",
              isInCart(car.id) ? "bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900" : ""
            )}
          >
            <ShoppingCart className="h-4.5 w-4.5 mr-2" />
            {isInCart(car.id) ? 'In Cart' : 'Add to Cart'}
          </Button>
          <Link to={`/cars/${car.id}`}>
            <Button 
              variant="premium" 
              size="icon"
              className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 hover:border-red-500"
            >
              <Eye className="h-4.5 w-4.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export { PremiumCarCard };