import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PremiumPublicLayout } from "@/components/layout/PremiumPublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/data/cars";
import { CreditCard, MapPin, User, Lock, Shield, Truck, Clock } from "lucide-react";

const PremiumCheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria'
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    // In a real app, this would process the order
    clearCart();
    navigate('/orders'); // Redirect to orders page after successful checkout
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.075; // 7.5% tax
  const shipping = subtotal > 100000 ? 0 : 5000; // Free shipping over 100k
  const total = subtotal + tax + shipping;

  return (
    <PremiumPublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Premium Checkout</h1>
          <p className="text-gray-400">Complete your vehicle purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-10">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= num 
                        ? 'bg-gradient-to-r from-red-600 to-red-800 text-white' 
                        : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {num}
                  </div>
                  {num < 3 && (
                    <div className={`w-16 h-1 ${step > num ? 'bg-gradient-to-r from-red-600 to-red-800' : 'bg-gray-800'}`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleInputChange}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-300">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="123 Luxury Avenue"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-300">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="Lagos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-gray-300">State</Label>
                      <Select name="state" value={shippingInfo.state} onValueChange={(value) => setShippingInfo({...shippingInfo, state: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="Lagos">Lagos</SelectItem>
                          <SelectItem value="Abuja">Abuja</SelectItem>
                          <SelectItem value="Rivers">Rivers</SelectItem>
                          <SelectItem value="Kano">Kano</SelectItem>
                          <SelectItem value="Ogun">Ogun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-gray-300">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="100001"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-gray-300">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      readOnly
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="pt-6 flex justify-end">
                    <Button 
                      onClick={() => setStep(2)}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 px-8 py-6 text-lg rounded-2xl"
                    >
                      Continue to Payment
                      <Truck className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-red-500" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="text-gray-300">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="text-gray-300">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="text-gray-300">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === 'card' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={handleCardChange}
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate" className="text-gray-300">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={cardInfo.expiryDate}
                            onChange={handleCardChange}
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={handleCardChange}
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                            placeholder="123"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardholderName" className="text-gray-300">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          name="cardholderName"
                          value={cardInfo.cardholderName}
                          onChange={handleCardChange}
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-6 flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="border-gray-700 text-white hover:bg-gray-800 hover:border-red-500"
                    >
                      Back to Shipping
                    </Button>
                    <Button 
                      onClick={() => setStep(3)}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 px-8 py-6 text-lg rounded-2xl"
                    >
                      Review Order
                      <Lock className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <Shield className="w-5 h-5 text-red-500" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Shipping Information</h3>
                    <div className="bg-gray-800/50 rounded-xl p-6 space-y-2">
                      <p className="text-gray-300"><span className="text-white">Name:</span> {shippingInfo.fullName}</p>
                      <p className="text-gray-300"><span className="text-white">Email:</span> {shippingInfo.email}</p>
                      <p className="text-gray-300"><span className="text-white">Address:</span> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <p className="text-gray-300 capitalize">
                        <span className="text-white">Method:</span> {paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-6 flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="border-gray-700 text-white hover:bg-gray-800 hover:border-red-500"
                    >
                      Back to Payment
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 px-8 py-6 text-lg rounded-2xl"
                    >
                      Place Order
                      <Clock className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 bg-gradient-to-b from-gray-800 to-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-800">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 border border-gray-700 flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={`${item.make} ${item.model}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{item.year} {item.make} {item.model}</h4>
                        <p className="text-gray-400 text-xs">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-800" />

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span className="text-white">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-white">{formatPrice(shipping)}</span>
                  </div>
                  <Separator className="bg-gray-800" />
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" className="mt-1" />
                    <Label htmlFor="terms" className="text-sm text-gray-400">
                      I agree to the terms and conditions and privacy policy. I understand that this is a binding agreement for the purchase of premium vehicles.
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PremiumPublicLayout>
  );
};

export default PremiumCheckoutPage;