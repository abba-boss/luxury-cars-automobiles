import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Car as CarIcon, Settings, Home, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
  showNavigation?: boolean;
  showCategories?: boolean;
}

const imageCategories = [
  { key: 'exterior', label: 'Exterior', icon: CarIcon },
  { key: 'interior', label: 'Interior', icon: Home },
  { key: 'engine', label: 'Engine', icon: Settings },
  { key: 'dashboard', label: 'Dashboard', icon: Gauge }
];

export function ImageGallery({ 
  images, 
  alt, 
  className, 
  showNavigation = true, 
  showCategories = true 
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('exterior');
  const [imageError, setImageError] = useState(false);

  const nextImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectCategory = (category: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!images || images.length === 0) {
    return (
      <div className={cn("relative aspect-[16/10] bg-muted flex items-center justify-center", className)}>
        <CarIcon className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted group", className)}>
      <img
        src={imageError ? '/placeholder-car.svg' : images[currentIndex]}
        alt={`${alt} - ${activeCategory}`}
        className="w-full h-full object-cover transition-transform duration-500"
        onError={handleImageError}
      />

      {/* Navigation arrows */}
      {showNavigation && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </Button>
        </>
      )}

      {/* Category navigation */}
      {showCategories && (
        <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {imageCategories.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2 text-xs rounded-full backdrop-blur-sm transition-all duration-200",
                activeCategory === key 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-white/80 text-gray-700 hover:bg-white"
              )}
              onClick={(e) => selectCategory(key, e)}
            >
              <Icon className="h-3 w-3 mr-1" />
              {label}
            </Button>
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
