import { useParams, Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { vehicleService, favoriteService } from "@/services";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import type { Vehicle } from "@/types/api";
import {
  ArrowLeft,
  Share2,
  Phone,
  MessageCircle,
  ShoppingCart,
  Check,
  Gauge,
  Zap,
  Timer,
  Fuel as FuelIcon,
  Settings2,
  Palette,
  Calendar,
  Shield,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { BookingForm } from "@/components/booking/BookingForm";
import { useAuth } from "@/hooks/useAuth";
import { PremiumFavoriteButton } from "@/components/ui/PremiumFavoriteButton";


const PremiumCarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const inCart = isInCart(parseInt(id || '0'));

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await vehicleService.getVehicle(Number(id));
        if (response.success && response.data) {
          setVehicle(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  // Check favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !id) return;

      try {
        const response = await favoriteService.checkFavorite(Number(id));
        if (response.success) {
          setIsFavorite(response.data.isFavorite);
        }
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [id, user]);

  const handleAddToCart = () => {
    if (!vehicle) return;
    
    addToCart({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      image: (vehicle.images && vehicle.images[0]) || `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}/uploads/placeholder-car.svg`
    });
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
              <LoadingSpinner className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Loading vehicle details...</h3>
            <p className="text-gray-400">Please wait while we fetch the details.</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!vehicle) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-4xl">🚗</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Vehicle not found</h3>
            <p className="text-gray-400 mb-6">The vehicle you're looking for doesn't exist.</p>
            <Link to="/cars">
              <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
                Browse All Cars
              </Button>
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const performanceData = [
    { label: "0-100 km/h", value: vehicle.acceleration || "5.2s", icon: Zap, color: "from-red-500 to-red-600" },
    { label: "Top Speed", value: vehicle.top_speed || "250 km/h", icon: Timer, color: "from-blue-500 to-blue-600" },
    { label: "Power", value: vehicle.power || "450 HP", icon: Gauge, color: "from-purple-500 to-purple-600" },
    { label: "Torque", value: vehicle.torque || "600 Nm", icon: Zap, color: "from-green-500 to-green-600" },
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/cars">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Inventory</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden mb-8 group">
              <img
                src={vehicle.images?.[0] || `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}/uploads/placeholder-car.svg`}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                {vehicle.is_verified && (
                  <span className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
                    Verified
                  </span>
                )}
                {vehicle.is_hot_deal && (
                  <span className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold">
                    Hot Deal
                  </span>
                )}
                {vehicle.is_featured && (
                  <span className="px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-semibold">
                    Featured
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              {user && (
                <div className="absolute top-6 right-6">
                  <PremiumFavoriteButton
                    vehicleId={vehicle.id}
                    isFavorite={isFavorite}
                    onToggle={setIsFavorite}
                  />
                </div>
              )}

              {/* Price */}
              <div className="absolute bottom-6 left-6 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(vehicle.price)}
                </p>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {vehicle.images?.slice(1, 5).map((image, index) => (
                <div 
                  key={index} 
                  className="aspect-square rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500 transition-colors duration-300 cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`${vehicle.make} ${vehicle.model} view ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 inline-block relative">
                Description
                <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-red-600 to-red-800" />
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {vehicle.description || "Experience the pinnacle of automotive excellence with this exceptional vehicle. Meticulously sourced and prepared by Sarkin Mota Autos, it combines cutting-edge technology with timeless design to deliver an unparalleled driving experience."}
              </p>
            </section>

            {/* Performance */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 inline-block relative">
                Performance
                <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-red-600 to-red-800" />
              </h2>
              <div className="grid grid-cols-2 gap-8">
                {performanceData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.label}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-red-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{item.label}</h3>
                      </div>
                      <p className="text-2xl font-bold text-white">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Technical Specifications */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 inline-block relative">
                Specifications
                <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-red-600 to-red-800" />
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-red-500 tracking-wider mb-1">YEAR</p>
                  <p className="text-white font-semibold text-sm">{vehicle.year}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-red-500 tracking-wider mb-1">MILEAGE</p>
                  <p className="text-white font-semibold text-sm">{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : "N/A"}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-red-500 tracking-wider mb-1">FUEL</p>
                  <p className="text-white font-semibold text-sm">{vehicle.fuel_type || "N/A"}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-red-500 tracking-wider mb-1">TRANS</p>
                  <p className="text-white font-semibold text-sm">{vehicle.transmission || "N/A"}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-red-500 tracking-wider mb-1">BODY</p>
                  <p className="text-white font-semibold text-sm">{vehicle.body_type || "N/A"}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-red-500 tracking-wider mb-1">BRAND</p>
                  <p className="text-white font-semibold text-sm">{vehicle.brand?.name || vehicle.make}</p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 inline-block relative">
                Features
                <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-red-600 to-red-800" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(vehicle.features || []).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-800 rounded-2xl group hover:border-red-500/30 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500 transition-colors duration-300">
                      <Check className="h-5 w-5 text-red-500 transition-colors duration-300" />
                    </div>
                    <span className="text-white transition-colors duration-300">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 inline-block relative">
                Reviews
                <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-red-600 to-red-800" />
              </h2>
              <ReviewForm vehicleId={vehicle.id} />
              <ReviewList vehicleId={vehicle.id} />
            </section>

            {/* Booking */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 inline-block relative">
                Book a Visit
                <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-red-600 to-red-800" />
              </h2>
              <BookingForm vehicleId={vehicle.id} vehicleName={`${vehicle.make} ${vehicle.model}`} />
            </section>
          </div>

          {/* Right Column - Action Card */}
          <div>
            <div className="sticky top-24 space-y-8">
              {/* Main CTA Card */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-800 p-8 rounded-3xl">
                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-3">Pricing</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(vehicle.price)}
                  </p>
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  disabled={inCart}
                  className={cn(
                    "w-full py-6 rounded-2xl text-lg font-bold transition-all duration-300 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 border border-red-500/30 shadow-lg hover:shadow-xl hover:shadow-red-500/30",
                    inCart && "opacity-70 cursor-not-allowed"
                  )}
                >
                  <ShoppingCart className="mr-3 h-5 w-5" />
                  {inCart ? "Added to Cart" : "Add to Cart"}
                </Button>

                {inCart && (
                  <Link to="/cart">
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 py-6 rounded-2xl text-lg font-bold border-gray-700 hover:bg-gray-800 hover:border-red-500/30 text-white"
                    >
                      View Cart & Checkout
                    </Button>
                  </Link>
                )}

                <p className="text-sm text-gray-400 text-center mt-4">
                  Price will be revealed in your cart
                </p>

                {/* Divider */}
                <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                {/* Book Actions */}
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-4 rounded-2xl border-gray-700 hover:border-red-500/30 hover:bg-red-500/10 text-white py-6"
                  >
                    <Calendar className="h-5 w-5 text-red-500" />
                    Book Demo Drive
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-4 rounded-2xl border-gray-700 hover:border-red-500/30 hover:bg-red-500/10 text-white py-6"
                  >
                    <Shield className="h-5 w-5 text-red-500" />
                    Book Inspection
                  </Button>
                </div>
              </div>

              {/* Contact Dealer */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-800 p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-6">Contact Dealer</h3>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-4 rounded-2xl border-gray-700 hover:border-red-500/30 hover:bg-red-500/10 text-white py-6"
                  >
                    <Phone className="h-5 w-5 text-red-500" />
                    Call Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-4 rounded-2xl border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10 text-white py-6"
                  >
                    <MessageCircle className="h-5 w-5 text-emerald-500" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              {/* Dealer Info */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-800 p-8 rounded-3xl">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {vehicle.brand?.name?.charAt(0) || vehicle.make.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{vehicle.brand?.name || vehicle.make}</h4>
                    <p className="text-gray-400">Official Dealer</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="text-red-500">📍</span>
                    <span>Lagos, Nigeria</span>
                  </p>
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="text-red-500">📞</span>
                    <span>+234 800 000 0000</span>
                  </p>
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="text-red-500">✉️</span>
                    <span>info@dealer.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PremiumCarDetailsPage;