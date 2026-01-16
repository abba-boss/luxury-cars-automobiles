import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { brandService } from "@/services";
import { Brand } from "@/types/api";
import { cn } from "@/lib/utils";
import BrandCarouselSkeleton from "./BrandCarouselSkeleton";

const PremiumBrandCarousel = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    loop: true,
    slidesToScroll: 1,
    dragFree: true,
    skipSnaps: false,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

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
    window.scrollTo(0, 0);
    navigate(`/cars?brandId=${brand.id}`);
  };

  if (loading || brands.length === 0) {
    return <BrandCarouselSkeleton />;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-800 mb-4">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3 font-sans">
            Shop By Brand
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm font-sans">
            Explore our curated collection of premium automobiles from the world's most prestigious manufacturers
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {brands.map((brand, index) => (
                <div
                  key={brand.id}
                  className="flex-[0_0_auto] px-2"
                  style={{
                    minWidth: '150px',
                    maxWidth: '170px'
                  }}
                >
                  <div
                    className="relative group cursor-pointer overflow-hidden rounded-2xl h-36 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex flex-col items-center justify-center transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/10"
                    onClick={() => handleBrandClick(brand)}
                  >
                    {/* Reflect Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 z-10 rounded-2xl" />

                    {/* Brand Image */}
                    <div className="relative z-20 flex flex-col items-center justify-center h-full w-full p-4">
                      {brand.image ? (
                        <div className="flex items-center justify-center w-full h-14 mb-2">
                          <img
                            src={brand.image}
                            alt={`${brand.name} logo`}
                            className="max-h-10 max-w-[80%] object-contain transition-transform duration-500 ease-out group-hover:scale-110 filter brightness-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex items-center justify-center w-full h-14 mb-2">
                                    <span class="text-xl font-bold text-gray-400">${brand.name.charAt(0)}</span>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-14 mb-2">
                          <span className="text-xl font-bold text-gray-400">{brand.name.charAt(0)}</span>
                        </div>
                      )}

                      <h3 className="text-xs font-bold text-white text-center font-sans truncate w-full">
                        {brand.name}
                      </h3>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-red-900/70 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                        <div className="flex items-center text-xs text-white font-sans">
                          <span>View Cars</span>
                          <ArrowRight className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>

                    {/* Glowing Border Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            className="absolute top-1/2 -left-4 -translate-y-1/2 z-30 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 border border-gray-700 rounded-full p-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-red-500/20"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          <button
            className="absolute top-1/2 -right-4 -translate-y-1/2 z-30 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 border border-gray-700 rounded-full p-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-red-500/20"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="hidden md:flex justify-center mt-8 space-x-2">
          {brands.map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full bg-gray-700 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 transition-all duration-300"
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/cars')}
            className="relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 transition-all duration-300 group font-sans text-sm overflow-hidden"
          >
            <span className="relative z-10 font-medium">View All Brands</span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-700/50 to-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PremiumBrandCarousel;