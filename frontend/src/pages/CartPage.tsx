import { Link, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/data/cars";
import { Trash2, ShoppingCart, ArrowRight, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const CartPage = () => {
  const { items, removeFromCart, clearCart, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: '/checkout' }, message: "Please sign in to proceed with checkout" } });
    } else {
      navigate('/checkout');
    }
  };

  const handleRemove = (carId: string, carName: string) => {
    removeFromCart(carId);
    toast.success("Removed from cart", {
      description: `${carName} has been removed from your cart.`,
    });
  };

  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="min-h-screen pt-20">
          <div className="max-w-[1800px] mx-auto section-padding">
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Explore our collection of premium vehicles and add your favorites to the cart.
              </p>
              <Link to="/cars">
                <Button className="btn-luxury">
                  Browse Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen pt-20">
        <div className="max-w-[1800px] mx-auto section-padding">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-block px-4 py-1.5 border border-primary/50 text-primary text-xs font-medium tracking-[0.2em] mb-4">
              YOUR CART
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {items.length} {items.length === 1 ? "Vehicle" : "Vehicles"} Selected
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((car) => (
                <div
                  key={car.id}
                  className="flex flex-col md:flex-row gap-6 border border-border p-6 animate-fade-in"
                >
                  {/* Image */}
                  <Link to={`/cars/${car.id}`} className="md:w-64 flex-shrink-0">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-primary font-medium tracking-wider mb-1">
                          {car.condition.toUpperCase()}
                        </p>
                        <Link to={`/cars/${car.id}`}>
                          <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                            {car.year} {car.make} {car.model}
                          </h3>
                        </Link>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(car.id, `${car.year} ${car.make} ${car.model}`)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{car.transmission}</span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span>{car.fuelType}</span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span>{car.color}</span>
                    </div>

                    {/* Price - NOW VISIBLE */}
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(car.price)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <Button
                variant="ghost"
                onClick={() => {
                  clearCart();
                  toast.success("Cart cleared");
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>

            {/* Summary */}
            <div>
              <div className="sticky top-24 space-y-6">
                {/* Order Summary */}
                <div className="border border-border p-8">
                  <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {items.map((car) => (
                      <div key={car.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {car.year} {car.make} {car.model}
                        </span>
                        <span className="font-medium text-foreground">
                          {formatPrice(car.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(getTotal())}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-6">
                    Prices are subject to inspection and final negotiation.
                  </p>

                  <Button className="w-full btn-luxury" onClick={handleCheckout}>
                    Checkout
                  </Button>
                </div>

                {/* Contact Options */}
                <div className="border border-border p-8">
                  <h3 className="font-semibold text-foreground mb-4">Need Assistance?</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 rounded-none border-border hover:border-primary hover:bg-primary/10"
                    >
                      <Phone className="h-5 w-5 text-primary" />
                      Call Us
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 rounded-none border-border hover:border-emerald-500 hover:bg-emerald-500/10"
                    >
                      <MessageCircle className="h-5 w-5 text-emerald-500" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CartPage;
