import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, Percent, Calendar, CreditCard } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface FinancingResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  apr: number;
}

const FinancingCalculator = () => {
  const [formData, setFormData] = useState({
    carPrice: 50000000, // Default to 50 million naira
    downPayment: 10000000, // Default to 10 million naira
    loanTerm: 48, // Default to 48 months
    interestRate: 12, // Default to 12% annually
  });
  const [result, setResult] = useState<FinancingResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const calculateFinancing = () => {
    const { carPrice, downPayment, loanTerm, interestRate } = formData;
    
    const principal = carPrice - downPayment;
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm;
    
    // Calculate monthly payment using the loan formula
    const monthlyPayment = principal * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    setResult({
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      apr: interestRate
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const resetForm = () => {
    setFormData({
      carPrice: 50000000,
      downPayment: 10000000,
      loanTerm: 48,
      interestRate: 12,
    });
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="card-luxury">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Financing Calculator</CardTitle>
              <p className="text-sm text-muted-foreground">
                Calculate your monthly payments for financing your dream car
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="carPrice" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Car Price (₦)
                  </Label>
                  <Input
                    id="carPrice"
                    name="carPrice"
                    type="number"
                    value={formData.carPrice}
                    onChange={handleChange}
                    min="0"
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Total price of the vehicle
                  </div>
                </div>

                <div>
                  <Label htmlFor="downPayment" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Down Payment (₦)
                  </Label>
                  <Input
                    id="downPayment"
                    name="downPayment"
                    type="number"
                    value={formData.downPayment}
                    onChange={handleChange}
                    min="0"
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Amount paid upfront
                  </div>
                </div>

                <div>
                  <Label htmlFor="loanTerm" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Loan Term (Months)
                  </Label>
                  <Input
                    id="loanTerm"
                    name="loanTerm"
                    type="number"
                    value={formData.loanTerm}
                    onChange={handleChange}
                    min="6"
                    max="84"
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Duration of the loan (6 to 84 months)
                  </div>
                </div>

                <div>
                  <Label htmlFor="interestRate" className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Annual Interest Rate (%)
                  </Label>
                  <Input
                    id="interestRate"
                    name="interestRate"
                    type="number"
                    value={formData.interestRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Annual percentage rate (APR)
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={calculateFinancing} 
                  className="btn-luxury flex-1"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
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
                    <p className="text-sm text-muted-foreground mb-2">Monthly Payment</p>
                    <p className="text-4xl font-bold text-foreground">
                      {formatCurrency(result.monthlyPayment)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      over {formData.loanTerm} months
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/20 rounded-xl">
                      <p className="text-sm text-muted-foreground">Total Interest</p>
                      <p className="font-semibold text-foreground">
                        {formatCurrency(result.totalInterest)}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/20 rounded-xl">
                      <p className="text-sm text-muted-foreground">Total Payment</p>
                      <p className="font-semibold text-foreground">
                        {formatCurrency(result.totalPayment)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Loan Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Principal:</span>
                        <span className="font-medium">
                          {formatCurrency(formData.carPrice - formData.downPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Down Payment:</span>
                        <span className="font-medium">
                          {formatCurrency(formData.downPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Interest Rate:</span>
                        <span className="font-medium">
                          {result.apr}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Loan Term:</span>
                        <span className="font-medium">
                          {formData.loanTerm} months
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>This calculator provides estimates only. Actual terms may vary based on lender and credit approval.</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground bg-secondary/20 rounded-2xl">
                  <Calculator className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calculate Financing</h3>
                  <p className="text-sm">
                    Enter your loan details to see your estimated monthly payment
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

export default FinancingCalculator;