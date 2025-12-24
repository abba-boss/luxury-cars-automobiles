import { PublicLayout } from "@/components/layout/PublicLayout";
import FinancingCalculator from "@/components/tools/FinancingCalculator";
import { CreditCard } from "lucide-react";

const FinancingPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen pt-32 pb-16">
        <div className="max-w-[1800px] mx-auto section-padding">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full mb-6">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary tracking-wider">FINANCING CALCULATOR</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Financing Calculator
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Calculate your monthly payments and see how financing your dream car would impact your budget.
            </p>
          </div>

          {/* Financing Calculator */}
          <FinancingCalculator />
        </div>
      </div>
    </PublicLayout>
  );
};

export default FinancingPage;