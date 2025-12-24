import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import car5 from "@/assets/car-5.jpg";
import car6 from "@/assets/car-6.jpg";

const categories = [
  {
    id: "suv",
    name: "SUV",
    description: "Commanding presence on any terrain",
    image: car2,
    count: 24,
  },
  {
    id: "sedan",
    name: "Sedan",
    description: "Refined elegance meets performance",
    image: car1,
    count: 18,
  },
  {
    id: "sports",
    name: "Sports",
    description: "Pure adrenaline, pure performance",
    image: car3,
    count: 12,
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Ultimate comfort and prestige",
    image: car4,
    count: 15,
  },
  {
    id: "tokunbo",
    name: "Tokunbo",
    description: "Premium foreign used vehicles",
    image: car5,
    count: 45,
  },
  {
    id: "brand-new",
    name: "Brand New",
    description: "Factory fresh with full warranty",
    image: car6,
    count: 8,
  },
];

export function CategoryGrid() {
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
      </div>
    </section>
  );
}
