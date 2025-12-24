import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Gauge, Calendar, Fuel, Settings2, DollarSign } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ValuationResult {
  estimatedValue: number;
  min: number;
  max: number;
  conditionFactor: number;
}

const CarValuationTool = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    condition: 'tokunbo' as 'tokunbo' | 'nigerian' | 'new',
    transmission: 'automatic' as 'automatic' | 'manual',
    fuelType: 'petrol' as 'petrol' | 'diesel' | 'hybrid' | 'electric',
  });
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'mileage' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateValue = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      // Base values for different car types (in Naira)
      const baseValues: Record<string, number> = {
        toyota: 8000000,
        honda: 7500000,
        lexus: 15000000,
        bmw: 12000000,
        mercedes: 14000000,
        audi: 11000000,
        nissan: 6000000,
        volkswagen: 7000000,
        mazda: 6500000,
        default: 5000000
      };

      const baseValue = baseValues[formData.make.toLowerCase()] || baseValues.default;
      
      // Calculate depreciation based on year
      const yearDiff = new Date().getFullYear() - formData.year;
      let yearDepreciation = 1 - (yearDiff * 0.15); // 15% depreciation per year
      if (yearDepreciation < 0.1) yearDepreciation = 0.1; // Minimum 10% of original value
      
      // Calculate mileage depreciation (0.5% per 10,000km)
      let mileageDepreciation = 1 - (Number(formData.mileage) / 10000) * 0.005;
      if (mileageDepreciation < 0.1) mileageDepreciation = 0.1; // Minimum 10% of value
      
      // Condition factor
      const conditionFactor = formData.condition === 'new' ? 1.2 : 
                            formData.condition === 'tokunbo' ? 1.0 : 0.7;
      
      // Transmission factor
      const transmissionFactor = formData.transmission === 'automatic' ? 1.0 : 0.9;
      
      // Fuel type factor
      const fuelFactor = formData.fuelType === 'electric' ? 1.2 : 
                        formData.fuelType === 'hybrid' ? 1.1 : 1.0;
      
      const estimatedValue = baseValue * yearDepreciation * mileageDepreciation * conditionFactor * transmissionFactor * fuelFactor;
      
      setResult({
        estimatedValue: Math.round(estimatedValue),
        min: Math.round(estimatedValue * 0.9),
        max: Math.round(estimatedValue * 1.1),
        conditionFactor
      });
      
      setIsCalculating(false);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: '',
      condition: 'tokunbo',
      transmission: 'automatic',
      fuelType: 'petrol',
    });
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="card-luxury">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Car Valuation Tool</CardTitle>
              <p className="text-sm text-muted-foreground">
                Get an estimate of your car's current market value
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      placeholder="e.g., Toyota"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g., Camry"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                      min="1980"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Mileage (km)</Label>
                    <Input
                      id="mileage"
                      name="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={handleChange}
                      placeholder="e.g., 50000"
                    />
                  </div>
                </div>

                <div>
                  <Label>Condition</Label>
                  <RadioGroup
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange('condition', value)}
                    className="grid grid-cols-3 gap-4 mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">Brand New</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="tokunbo" id="tokunbo" />
                      <Label htmlFor="tokunbo">Tokunbo</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="nigerian" id="nigerian" />
                      <Label htmlFor="nigerian">Nigerian Used</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Transmission</Label>
                  <RadioGroup
                    value={formData.transmission}
                    onValueChange={(value) => handleSelectChange('transmission', value)}
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="automatic" id="automatic" />
                      <Label htmlFor="automatic">Automatic</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual">Manual</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Fuel Type</Label>
                  <RadioGroup
                    value={formData.fuelType}
                    onValueChange={(value) => handleSelectChange('fuelType', value)}
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="petrol" id="petrol" />
                      <Label htmlFor="petrol">Petrol</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="diesel" id="diesel" />
                      <Label htmlFor="diesel">Diesel</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="hybrid" id="hybrid" />
                      <Label htmlFor="hybrid">Hybrid</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="electric" id="electric" />
                      <Label htmlFor="electric">Electric</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={calculateValue} 
                  disabled={isCalculating}
                  className="btn-luxury flex-1"
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Value'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className="rounded-xl"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Result Section */}
            <div>
              {result ? (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20">
                    <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">Estimated Value</p>
                    <p className="text-4xl font-bold text-foreground">
                      ₦{result.estimatedValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Range: ₦{result.min.toLocaleString()} - ₦{result.max.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Vehicle Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Year:</span>
                        <span className="font-medium">{formData.year}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Mileage:</span>
                        <span className="font-medium">{formData.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Settings2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Transmission:</span>
                        <span className="font-medium capitalize">{formData.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Fuel:</span>
                        <span className="font-medium capitalize">{formData.fuelType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Condition:</span>
                      <Badge variant="outline" className="capitalize">
                        {formData.condition}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">This is an estimated value based on market data and may vary.</p>
                    <p>For an accurate appraisal, contact one of our certified dealers.</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground bg-secondary/20 rounded-2xl">
                  <Car className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Enter Vehicle Details</h3>
                  <p className="text-sm">
                    Provide your car's information to get an estimated market value
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarValuationTool;