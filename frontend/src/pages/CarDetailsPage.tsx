import { useParams, Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Car360Viewer } from "@/components/car/Car360Viewer";
import { CarVideoSection } from "@/components/car/CarVideoSection";
import { featuredCars, formatMileage } from "@/data/cars";
import { useCart } from "@/hooks/useCart";
import {
  ArrowLeft,
  Heart,
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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SimpleAnimatedPerformanceCircle } from "@/components/car/SimpleAnimatedPerformanceCircle";
import { AnimatedSpecItem } from "@/components/car/AnimatedSpecItem";
import { AnimatedMileageMeter } from "@/components/car/AnimatedMileageMeter";

// Tesla-style Spec Item
function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-border">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}


const CarDetailsPage = () => {
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const { addToCart, isInCart } = useCart();

  const car = featuredCars.find((c) => c.id === id);

  if (!car) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Vehicle Not Found</h1>
            <p className="text-muted-foreground mb-8">The vehicle you're looking for doesn't exist.</p>
            <Link to="/cars">
              <Button className="btn-tesla">Browse Collection</Button>
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const inCart = isInCart(car.id);

  const handleAddToCart = () => {
    addToCart(car);
    toast.success("Added to cart", {
      description: `${car.year} ${car.make} ${car.model} has been added to your cart.`,
    });
  };

  const specs = [
    { icon: Gauge, label: "Mileage", value: formatMileage(car.mileage), isMileage: true }, // Mark as mileage
    { icon: FuelIcon, label: "Fuel Type", value: car.fuelType },
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: Palette, label: "Exterior Color", value: car.color },
    { icon: Timer, label: "Year", value: car.year.toString() },
    { icon: Zap, label: "Condition", value: car.condition },
  ];

  const performanceData = [
    { value: 85, label: "0-60 mph", unit: "5.8s" },
    { value: 75, label: "Top Speed", unit: "155 mph" },
    { value: 90, label: "Power", unit: "335 hp" },
    { value: 80, label: "Torque", unit: "368 lb-ft" },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-20 bg-gradient-to-b from-card to-background">
        {/* Back Button */}
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-6">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Collection</span>
          </Link>
        </div>

        {/* Car Title */}
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 border border-primary/60 text-primary text-xs font-semibold tracking-[0.2em] mb-4">
                {car.condition.toUpperCase()}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                {car.year} {car.make} {car.model}
              </h1>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full border-border hover:border-primary hover:bg-primary/10"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart className={cn("h-5 w-5", isSaved && "fill-primary text-primary")} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full border-border hover:border-primary hover:bg-primary/10"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 360 Viewer */}
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 pb-16">
          <Car360Viewer images={car.images} carName={`${car.make} ${car.model}`} />
        </div>
      </section>

      {/* Quick Specs Bar */}
      <section className="bg-card border-y border-border">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {specs.map((spec, index) => (
              <div
                key={spec.label}
                className={`text-center transition-all duration-700 ease-out ${
                  spec.isMileage
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-100 translate-y-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {spec.isMileage ? (
                  <AnimatedMileageMeter
                    value={car.mileage} // Pass the raw mileage value in km
                    max={300000} // Set max to 300,000 km as a reasonable maximum for km
                    unit="km"
                    label={spec.label}
                  />
                ) : (
                  <div className="group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center transition-all duration-300 group-hover:bg-primary">
                      <spec.icon className="h-5 w-5 text-foreground transition-colors duration-300 group-hover:text-primary-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{spec.label}</p>
                    <p className="font-semibold text-foreground">{spec.value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-24">
            {/* Description */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground inline-block relative">
                  Overview
                  <span className="absolute bottom-0 left-0 w-1/4 h-0.5 bg-primary" />
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {car.description} This exceptional vehicle represents the pinnacle of automotive
                engineering, combining cutting-edge technology with refined luxury. Every detail
                has been meticulously crafted to deliver an unparalleled driving experience that
                exceeds expectations.
              </p>
            </section>

            {/* Performance Section - Tesla Style */}
            <section>
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-foreground inline-block relative">
                  Performance
                  <span className="absolute bottom-0 left-0 w-1/4 h-0.5 bg-primary" />
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {performanceData.map((item, index) => (
                  <SimpleAnimatedPerformanceCircle key={item.label} {...item} index={index} />
                ))}
              </div>
            </section>

            {/* Technical Specifications */}
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground inline-block relative">
                  Specifications
                  <span className="absolute bottom-0 left-0 w-1/4 h-0.5 bg-primary" />
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                <div>
                  <h3 className="text-sm font-medium text-primary tracking-wider mb-4">ENGINE</h3>
                  <AnimatedSpecItem label="Type" value="V6 3.5L Twin-Turbo" index={0} />
                  <AnimatedSpecItem label="Horsepower" value="335 hp @ 6,600 rpm" index={1} />
                  <AnimatedSpecItem label="Torque" value="368 lb-ft @ 4,400 rpm" index={2} />
                  <AnimatedSpecItem label="Fuel System" value="Direct Injection" index={3} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-primary tracking-wider mb-4">DIMENSIONS</h3>
                  <AnimatedSpecItem label="Length" value="192.9 in" index={4} />
                  <AnimatedSpecItem label="Width" value="75.6 in" index={5} />
                  <AnimatedSpecItem label="Height" value="68.1 in" index={6} />
                  <AnimatedSpecItem label="Wheelbase" value="112.2 in" index={7} />
                </div>
              </div>
            </section>

            {/* Features */}
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground inline-block relative">
                  Features
                  <span className="absolute bottom-0 left-0 w-1/4 h-0.5 bg-primary" />
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {car.features.map((feature, index) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg group hover:border-primary/50 transition-all duration-300 hover:shadow-sm"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <Check className="h-4 w-4 text-primary transition-colors duration-300" />
                    </div>
                    <span className="text-foreground transition-colors duration-300">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Action Card */}
          <div>
            <div className="sticky top-24 space-y-6">
              {/* Main CTA Card */}
              <div className="bg-card border border-border p-8 rounded-2xl">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Pricing</p>
                  <p className="text-xl font-semibold text-foreground">
                    Request price or add to cart
                  </p>
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  disabled={inCart}
                  className={cn(
                    "w-full btn-luxury mb-4",
                    inCart && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {inCart ? "Added to Cart" : "Add to Cart"}
                </Button>

                {inCart && (
                  <Link to="/cart">
                    <Button variant="outline" className="w-full btn-luxury-outline">
                      View Cart & See Price
                    </Button>
                  </Link>
                )}

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Price will be revealed in your cart
                </p>


                {/* Divider */}
                <div className="my-6 h-px bg-border" />

                {/* Book Actions */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-full border-border hover:border-primary hover:bg-primary/10"
                  >
                    <Calendar className="h-5 w-5 text-primary" />
                    Book Demo Drive
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-full border-border hover:border-primary hover:bg-primary/10"
                  >
                    <Shield className="h-5 w-5 text-primary" />
                    Book Inspection
                  </Button>
                </div>
              </div>

              {/* Contact Dealer */}
              <div className="bg-card border border-border p-8 rounded-2xl">
                <h3 className="font-semibold text-foreground mb-4">Contact Dealer</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-full border-border hover:border-primary hover:bg-primary/10"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    Call Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-full border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10"
                  >
                    <MessageCircle className="h-5 w-5 text-emerald-500" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              {/* Dealer Info */}
              <div className="bg-card border border-border p-8 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-foreground">
                      SM
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">luxury car</h4>
                    {/* Replaced "Sarkin Mota" brand name with generic term */}
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-emerald-500">Verified Dealer</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <CarVideoSection carName={`${car.make} ${car.model}`} posterImage={car.images[0]} />
    </PublicLayout>
  );
};

export default CarDetailsPage;
