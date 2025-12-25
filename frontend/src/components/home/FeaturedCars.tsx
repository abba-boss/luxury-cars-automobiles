import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Eye, Heart, Gauge, Calendar, Fuel, Settings, Palette } from "lucide-react";
import { formatPrice, formatMileage } from "@/data/cars";
import { localDb } from "@/lib/database";
import { cn } from "@/lib/utils";

export function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/vehicles');
        const result = await response.json();
        
        if (result.success && result.data) {
          // Filter for featured cars and map to expected format
          const featuredVehicles = result.data
            .filter(vehicle => vehicle.is_featured)
            .slice(0, 6)
            .map(vehicle => ({
              id: vehicle.id.toString(),
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              price: parseFloat(vehicle.price),
              mileage: vehicle.mileage || 0,
              condition: vehicle.condition,
              transmission: vehicle.transmission,
              fuelType: vehicle.fuel_type,
              color: vehicle.color || '',
              images: vehicle.images && vehicle.images.length > 0 ? vehicle.images.map(img => 
                img.startsWith('http') ? img : `http://localhost:3001${img}`
              ) : [`http://localhost:3001/uploads/vehicles/placeholder.jpg`],
              description: vehicle.description || '',
              features: vehicle.features || [],
              isVerified: vehicle.is_verified || false,
              isFeatured: vehicle.is_featured || false,
              isHotDeal: vehicle.is_hot_deal || false,
              createdAt: vehicle.created_at || new Date().toISOString()
            }));
          setCars(featuredVehicles);
        }
      } catch (error) {
        console.error('Failed to fetch featured cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedCars();
  }, []);

  const displayCars = cars;

  const toggleFavorite = (carId: string) => {
    setFavorites(prev => ({
      ...prev,
      [carId]: !prev[carId]
    }));
  };

  return (
    <section className="section-padding bg-card">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <span className="inline-block px-5 py-2 border border-primary/60 text-primary text-xs font-semibold tracking-[0.2em] mb-4 backdrop-blur-sm bg-background/50 rounded-full">
              FEATURED VEHICLES
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Exceptional Vehicles
            </h2>
          </div>
          <Link to="/cars">
            <Button className="btn-tesla-outline gap-2">
              View All Inventory
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : displayCars.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No featured vehicles available at the moment.</p>
            </div>
          ) : (
            displayCars.map((car, index) => (
            <div
              key={car.id}
              className="group block card-luxury overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/10"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link to={`/cars/${car.id}`}>
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {car.isVerified && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                        Verified
                      </span>
                    )}
                    {car.isHotDeal && (
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full border border-orange-500/30">
                        Hot Deal
                      </span>
                    )}
                  </div>

                  {/* Condition Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={cn(
                      "px-3 py-1.5 text-xs font-semibold tracking-wide rounded-full",
                      car.condition === "Brand New"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/90 backdrop-blur-sm text-foreground border border-border/50"
                    )}>
                      {car.condition === "Brand New" ? "NEW" : car.condition.toUpperCase()}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-sm">
                    <p className="text-base font-bold text-foreground">
                      {formatPrice(car.price)}
                    </p>
                  </div>

                  {/* Favorite Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary/20 hover:text-primary transition-all duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(car.id);
                    }}
                    aria-label={favorites[car.id] ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      className={cn("h-4 w-4 transition-colors", favorites[car.id] ? "fill-primary text-primary" : "text-foreground")}
                    />
                  </Button>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-primary/90 hover:bg-primary text-primary-foreground"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(car.id);
                        }}
                      >
                        <Heart className={cn("h-4 w-4 mr-1", favorites[car.id] ? "fill-current" : "")} />
                        {favorites[car.id] ? 'Favorited' : 'Favorite'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-foreground/90 hover:bg-foreground text-background"
                        asChild
                      >
                        <Link to={`/cars/${car.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <span>{car.transmission}</span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span>{car.fuelType}</span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span>{car.color}</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Gauge className="h-3 w-3" />
                        <span>Mileage</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{formatMileage(car.mileage)}</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>Year</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{car.year}</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Fuel className="h-3 w-3" />
                        <span>Fuel</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{car.fuelType}</p>
                    </div>
                  </div>

                  {/* Additional Specs Row */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Settings className="h-3 w-3" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Palette className="h-3 w-3" />
                      <span>{car.color}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
