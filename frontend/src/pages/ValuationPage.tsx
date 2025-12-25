import { PublicLayout } from "@/components/layout/PublicLayout";

export default function ValuationPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Car Valuation</h1>
        <p className="text-muted-foreground">Get your car valued by our experts.</p>
      </div>
    </PublicLayout>
  );
}
