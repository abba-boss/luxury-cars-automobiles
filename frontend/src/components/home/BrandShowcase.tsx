import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { brandService } from "@/services";
import { Brand } from "@/types/api";

export function BrandShowcase() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await brandService.getBrands({ limit: 24 });
        if (response.success) {
          setBrands(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandClick = (brand: Brand) => {
    navigate(`/cars?brand=${brand.name}&brandId=${brand.id}`);
  };

  if (loading) {
    return (
      <section className="section-padding bg-card/50">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2 border border-primary/40 text-primary text-xs font-semibold tracking-[0.3em] mb-6 rounded-full bg-primary/5">
              BRANDS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop By Brand
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of premium automobiles from the world's most prestigious manufacturers
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-card/50">
      <div className="max-w-[1800px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 border border-primary/40 text-primary text-xs font-semibold tracking-[0.3em] mb-6 rounded-full bg-primary/5">
            BRANDS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop By Brand
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of premium automobiles from the world's most prestigious manufacturers
          </p>
        </div>

        {/* Brand Grid - Smaller, Cleaner */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 md:gap-4">
          {brands.map((brand, index) => (
            <button
              key={brand.id}
              onClick={() => handleBrandClick(brand)}
              className={cn(
                "group relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl",
                "transition-all duration-300 ease-out",
                "hover:scale-105 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
              )}
              style={{ animationDelay: `${index * 20}ms` }}
            >
              {/* Background Glow on Hover */}
              <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/5 transition-all duration-300" />
              
              {/* Soft Glow Effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-radial from-primary/20 via-transparent to-transparent blur-xl" />
              </div>

              {/* Logo Container */}
              <div className={cn(
                "relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center",
                "transition-all duration-300 ease-out",
                "group-hover:scale-110"
              )}>
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={`${brand.name} logo`}
                    className={cn(
                      "w-full h-full object-contain",
                      "filter brightness-75 contrast-125",
                      "group-hover:brightness-100 group-hover:drop-shadow-[0_0_8px_rgba(215,38,56,0.4)]",
                      "transition-all duration-300"
                    )}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-lg font-bold text-muted-foreground group-hover:text-primary transition-colors">${brand.name.charAt(0)}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-lg font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    {brand.name.charAt(0)}
                  </span>
                )}
              </div>
              
              {/* Brand Name - Only on Hover */}
              <span className={cn(
                "mt-2 text-[10px] md:text-xs font-medium text-center leading-tight",
                "text-muted-foreground/60 group-hover:text-foreground",
                "transition-all duration-300",
                "opacity-70 group-hover:opacity-100"
              )}>
                {brand.name}
              </span>

              {/* Pulse Effect on Hover */}
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-primary/20 transition-all duration-300" />
            </button>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/cars')}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full",
              "bg-transparent border border-primary/30 text-primary",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary",
              "transition-all duration-300 ease-out",
              "group"
            )}
          >
            <span className="font-medium">View All Brands</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}