import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Share2, 
  Phone, 
  Mail, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  Palette,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  ShoppingCart,
  Play,
  Zap,
  Shield,
  Award,
  Star,
  Eye,
  Camera,
  Video,
  Download,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { formatPrice, formatMileage } from "@/data/cars";
import VehicleInquiry from "@/components/vehicles/VehicleInquiry";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: string;
  transmission: string;
  fuelType: string;
  color: string;
  images: string[];
  videos?: string[];
  description: string;
  features: string[];
  isVerified: boolean;
  isFeatured: boolean;
  isHotDeal: boolean;
  engineSize?: string;
  bodyType?: string;
  driveType?: string;
  doors?: number;
  seats?: number;
  vin?: string;
}

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/vehicles/${id}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const vehicleData = result.data;
        setVehicle({
          id: vehicleData.id.toString(),
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          price: parseFloat(vehicleData.price),
          mileage: vehicleData.mileage || 0,
          condition: vehicleData.condition,
          transmission: vehicleData.transmission,
          fuelType: vehicleData.fuel_type,
          color: vehicleData.color || '',
          images: vehicleData.images ? vehicleData.images.map(img => 
            img.startsWith('http') ? img : `http://localhost:3001/uploads/${img}`
          ) : [`http://localhost:3001/uploads/placeholder-car.svg`],
          videos: vehicleData.videos ? vehicleData.videos.map(video =>
            video.startsWith('http') ? video : `http://localhost:3001/uploads/${video}`
          ) : [],
          description: vehicleData.description || '',
          features: vehicleData.features || [],
          isVerified: vehicleData.is_verified || false,
          isFeatured: vehicleData.is_featured || false,
          isHotDeal: vehicleData.is_hot_deal || false
        });
      } else {
        toast({
          title: "Error",
          description: "Vehicle not found",
          variant: "destructive"
        });
        navigate('/cars');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load vehicle details",
        variant: "destructive"
      });
      navigate('/cars');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${vehicle?.make} ${vehicle?.model} ${isFavorite ? 'removed from' : 'added to'} your favorites`
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle?.make} ${vehicle?.model}`,
        text: `Check out this ${vehicle?.year} ${vehicle?.make} ${vehicle?.model}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Vehicle link copied to clipboard"
      });
    }
  };

  const handleAddToCart = () => {
    if (vehicle) {
      addToCart({
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        image: vehicle.images[0] || ''
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading vehicle details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!vehicle) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600">Vehicle Not Found</h1>
          <Button onClick={() => navigate('/cars')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cars
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate('/cars')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cars
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                {vehicle.images.length > 0 ? (
                  <img
                    src={vehicle.images[selectedImageIndex]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No images available</p>
                  </div>
                )}
              </div>

              {vehicle.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {vehicle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${vehicle.make} ${vehicle.model} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {vehicle.isVerified && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
                {vehicle.isFeatured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
                {vehicle.isHotDeal && (
                  <Badge variant="destructive">Hot Deal</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              
              <p className="text-2xl font-bold text-primary mt-2">
                {formatPrice(vehicle.price)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleFavorite} variant="outline" className="flex-1">
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Key Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-medium">{formatMileage(vehicle.mileage)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-medium">{vehicle.transmission}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-medium">{vehicle.fuelType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Color</p>
                      <p className="font-medium">{vehicle.color}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Condition</p>
                      <p className="font-medium">{vehicle.condition}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <VehicleInquiry 
                vehicleId={vehicle.id} 
                vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              />
              
              <Button onClick={handleAddToCart} variant="outline" className="w-full" size="lg">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
                <Button variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {vehicle.description || 'No description available for this vehicle.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              {vehicle.features.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No features listed for this vehicle.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CarDetailsPage;
