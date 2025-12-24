import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CarCard } from "@/components/cars/CarCard";
import { featuredCars } from "@/data/cars";
import { Heart } from "lucide-react";

const SavedCarsPage = () => {
  // For demo, show first 3 cars as "saved"
  const savedCars = featuredCars.slice(0, 3);

  return (
    <DashboardLayout title="Saved Cars" subtitle="Your favorite vehicles">
      {savedCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCars.map((car, index) => (
            <div
              key={car.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <CarCard car={car} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No saved cars</h3>
          <p className="text-muted-foreground">
            Start browsing and save your favorite vehicles
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SavedCarsPage;
