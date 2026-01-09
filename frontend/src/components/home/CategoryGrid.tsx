import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { vehicleService } from "@/services";

import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import car5 from "@/assets/car-5.jpg";
import car6 from "@/assets/car-6.jpg";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "suv", name: "SUV", description: "Commanding presence on any terrain", image: car2, count: 0 },
    { id: "sedan", name: "Sedan", description: "Refined elegance meets performance", image: car1, count: 0 },
    { id: "sports", name: "Sports", description: "Pure adrenaline, pure performance", image: car3, count: 0 },
    { id: "luxury", name: "Luxury", description: "Ultimate comfort and prestige", image: car4, count: 0 },
    { id: "tokunbo", name: "Tokunbo", description: "Premium foreign used vehicles", image: car5, count: 0 },
    { id: "brand-new", name: "Brand New", description: "Factory fresh with full warranty", image: car6, count: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch category counts
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        // Fetch counts for each category
        const categoryCounts = await Promise.all(categories.map(async (category) => {
          let filterParams = {};

          switch (category.id) {
            case 'suv':
              filterParams = { body_type: 'SUV' };
              break;
            case 'sedan':
              filterParams = { body_type: 'Sedan' };
              break;
            case 'luxury':
              filterParams = { body_type: 'Luxury' };
              break;
            case 'sports':
              filterParams = { body_type: 'Sports' };
              break;
            case 'tokunbo':
              filterParams = { condition: 'Tokunbo' };
              break;
            case 'brand-new':
              filterParams = { condition: 'Brand New' };
              break;
            default:
              filterParams = {};
          }

          const response = await vehicleService.getVehicles({
            ...filterParams,
            limit: 1, // We only need the count, not the actual data
            page: 1
          });

          if (response.success && response.pagination) {
            return { ...category, count: response.pagination.total };
          }
          return { ...category, count: 0 };
        }));

        setCategories(categoryCounts);
      } catch (error) {
        console.error('Failed to fetch category counts:', error);
        // Keep the original categories with 0 counts if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <span className="inline-block px-5 py-2 border border-primary/60 text-primary text-xs font-semibold tracking-[0.3em] mb-6">
              CATEGORIES
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Explore by Style
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Find your perfect vehicle from our curated collection of premium automobiles across all categories
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "group relative overflow-hidden car-glow animate-pulse",
                  index === 0 && "lg:col-span-2 lg:row-span-2",
                  index === 0 ? "aspect-square lg:aspect-auto min-h-[400px]" : "aspect-[4/3]"
                )}
              >
                <div className="absolute inset-0 bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/cars?category=${category.id}`}
                className={cn(
                  "group relative overflow-hidden car-glow",
                  index === 0 && "lg:col-span-2 lg:row-span-2",
                  index === 0 ? "aspect-square lg:aspect-auto min-h-[400px]" : "aspect-[4/3]"
                )}
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs text-primary font-semibold tracking-wider mb-2 block">
                      {category.count} VEHICLES
                    </span>
                    <h3 className={cn(
                      "font-bold text-foreground mb-2",
                      index === 0 ? "text-3xl md:text-4xl" : "text-2xl"
                    )}>
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                      {category.description}
                    </p>

                    {/* View Button */}
                    <div className="flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <span>Explore</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 transform rotate-45 translate-x-16 -translate-y-16 group-hover:bg-primary/40 transition-colors duration-500" />
                </div>

                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-700" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
