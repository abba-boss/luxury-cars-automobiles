import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Car as CarIcon, Settings, Volume2, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarVideoSectionProps {
  carName: string;
  posterImage: string;
  videos?: string[];
}

const videoCategories = [
  { key: 'exterior', label: 'Exterior', icon: CarIcon },
  { key: 'interior', label: 'Interior', icon: Gauge },
  { key: 'engine', label: 'Engine / Sound', icon: Settings },
  { key: 'performance', label: 'Performance', icon: Volume2 }
];

export function CarVideoSection({ carName, posterImage, videos = [] }: CarVideoSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('exterior');
  const [videoError, setVideoError] = useState(false);

  // Don't render if no videos are available
  if (!videos || videos.length === 0) {
    console.log('No videos available:', videos);
    return null;
  }

  console.log('Videos available:', videos);

  const nextVideo = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const selectCategory = (category: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 border border-primary/40 text-primary text-xs font-semibold tracking-[0.3em] mb-6 rounded-full bg-primary/5">
            EXPERIENCE
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Feel the Power
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Immerse yourself in the driving experience with our cinematic showcase
          </p>
        </div>

        {/* Main Video Player - Using exact same styling as ImageGallery */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted group rounded-2xl">
          <video
            src={videos[currentIndex]}
            poster={posterImage}
            className="w-full h-full object-cover transition-transform duration-500"
            controls
            key={currentIndex}
            onError={handleVideoError}
          />

          {/* Navigation arrows - Exact same as ImageGallery */}
          {videos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={prevVideo}
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={nextVideo}
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </Button>
            </>
          )}

          {/* Category navigation - Exact same as ImageGallery */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            {videoCategories.map(({ key, label, icon: Icon }) => (
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

          {/* Video counter - Exact same as ImageGallery */}
          {videos.length > 1 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
              {currentIndex + 1} / {videos.length}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
