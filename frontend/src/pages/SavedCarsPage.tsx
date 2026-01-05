import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CarCard } from "@/components/cars/CarCard";
import { LoadingSpinner } from '@/components/ui/loading';
import { favoriteService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { Heart } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SavedCarsPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await favoriteService.getUserFavorites();
        if (response.success) {
          // Transform favorites to car format
          const cars = response.data.map((fav: any) => ({
            id: fav.vehicle.id,
            make: fav.vehicle.make,
            model: fav.vehicle.model,
            year: fav.vehicle.year,
            price: fav.vehicle.price,
            images: fav.vehicle.images,
            status: fav.vehicle.status
          }));
          setFavorites(cars);
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout title="Saved Cars" subtitle="Your favorite vehicles">
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Saved Cars" subtitle="Your favorite vehicles">
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((car: any, index: number) => (
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
          <p className="text-muted-foreground mb-4">
            Start browsing and save your favorite vehicles
          </p>
          <Button asChild>
            <Link to="/cars">Browse Cars</Link>
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SavedCarsPage;
