import { Link, useNavigate } from "react-router-dom";
import { PremiumPublicLayout } from "@/components/layout/PremiumPublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag, ArrowRight, Car, User, CreditCard, Shield } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/data/cars";

const PremiumCartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart, getTotalPrice, getItemCount, getUserInfo } = useCart();
  const userInfo = getUserInfo();

  if (items.length === 0) {
    return (
      <PremiumPublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Browse our premium collection and add some vehicles to your cart
            </p>
            <Button 
              asChild 
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 px-8 py-6 text-lg rounded-2xl"
            >
              <Link to="/cars">
                Browse Premium Collection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </PremiumPublicLayout>
    );
  }

  return (
    <PremiumPublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Premium Cart</h1>
            <p className="text-gray-400">
              {getItemCount()} {getItemCount() === 1 ? 'vehicle' : 'vehicles'} in your cart
            </p>
            {userInfo && (
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Shopping as: {userInfo.name} ({userInfo.email})
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="border-gray-700 text-white hover:bg-red-500/10 hover:border-red-500"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={item.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={`${item.make} ${item.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                          <Car className="w-10 h-10 text-gray-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-xl text-white">
                            {item.year} {item.make} {item.model}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            Added on {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          {formatPrice(item.price)}
                        </p>
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="border-gray-700 text-white hover:bg-gray-800 hover:border-red-500"
                          asChild
                        >
                          <Link to={`/cars/${item.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4 bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span className="text-white font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Processing Fee
                    </span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Tax
                    </span>
                    <span>Included</span>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                <div className="space-y-4 pt-4">
                  <Button 
                    className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                    size="lg" 
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full py-4 text-lg rounded-2xl border-gray-700 text-white hover:bg-gray-800 hover:border-red-500"
                    asChild
                  >
                    <Link to="/cars">Continue Shopping</Link>
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500 text-center">
                    Your purchase is protected by our premium security guarantee. 
                    All transactions are encrypted and secure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PremiumPublicLayout>
  );
};

export default PremiumCartPage;