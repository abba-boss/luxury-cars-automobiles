import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/data/cars";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const { items, getTotal } = useCart();

  return (
    <DashboardLayout title="Checkout" subtitle="Complete your purchase">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.images[0]}
                    alt={`${item.make} ${item.model}`}
                    className="w-16 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.year} {item.make} {item.model}</h4>
                    <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete your purchase by contacting our sales team. We'll arrange financing and delivery options.
              </p>
              <Button className="w-full">
                Contact Sales Team
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutPage;
