import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/vehicles`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setCars(result.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch featured cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedCars();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading featured cars...</div>;
  }

  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-8">Featured Vehicles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car.id} className="border rounded-lg p-4">
            <Link to={`/cars/${car.id}`}>
              <h3 className="text-xl font-semibold">
                {car.year} {car.make} {car.model}
              </h3>
              <p className="text-lg font-bold text-blue-600">
                ₦{parseFloat(car.price).toLocaleString()}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
