import { PublicLayout } from "@/components/layout/PublicLayout";
import CarValuationTool from "@/components/tools/CarValuationTool";
import { Scale } from "lucide-react";

const ValuationPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen pt-32 pb-16">
        <div className="max-w-[1800px] mx-auto section-padding">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full mb-6">
              <Scale className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary tracking-wider">VALUATION TOOL</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Estimate Your Car's Value
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get an instant estimate of your car's current market value based on condition, mileage, and other factors.
            </p>
          </div>

          {/* Valuation Tool */}
          <CarValuationTool />
        </div>
      </div>
    </PublicLayout>
  );
};

export default ValuationPage;