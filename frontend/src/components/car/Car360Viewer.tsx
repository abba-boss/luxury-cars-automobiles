import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, RotateCw, Play, Pause } from 'lucide-react';

interface Car360ViewerProps {
  images: string[];
  carName: string;
  className?: string;
  autoplay?: boolean;
  autoplaySpeed?: number;
  showControls?: boolean;
}

const Car360Viewer: React.FC<Car360ViewerProps> = ({
  images,
  carName,
  className = '',
  autoplay = false,
  autoplaySpeed = 100,
  showControls = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset currentIndex when images change
  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  // Handle autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, autoplaySpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, images.length, autoplaySpeed]);

  // Handle drag interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || images.length <= 1) return;

    const diff = e.clientX - startX;
    if (Math.abs(diff) > 5) { // Threshold to prevent accidental drags
      const direction = diff > 0 ? -1 : 1; // Positive diff means moving right, so go backward
      const newIndex = (currentIndex + direction + images.length) % images.length;

      setCurrentIndex(newIndex);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || images.length <= 1) return;

    const diff = e.touches[0].clientX - startX;
    if (Math.abs(diff) > 5) {
      const direction = diff > 0 ? -1 : 1;
      const newIndex = (currentIndex + direction + images.length) % images.length;

      setCurrentIndex(newIndex);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove as any);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove as any);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startX, currentIndex, images.length]);

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No 360° images available</p>
      </div>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative w-full aspect-square bg-gray-100 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {images[currentIndex] && currentIndex < images.length ? (
            <img
              src={images[currentIndex]}
              alt={`360° view - angle ${currentIndex + 1}`}
              className="w-full h-full object-contain"
              draggable={false}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== '/placeholder-car.svg') {
                  console.error('Failed to load image:', images?.[currentIndex] || 'undefined');
                  target.src = '/placeholder-car.svg';
                }
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', images[currentIndex]);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p>Loading image...</p>
            </div>
          )}

          {/* Overlay controls */}
          {showControls && (
            <>
              <div className="absolute top-4 left-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white/80 hover:bg-white text-black"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={goToPrev}
                  className="bg-white/80 hover:bg-white text-black"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={goToNext}
                  className="bg-white/80 hover:bg-white text-black"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 px-4">
            <div className="flex gap-1 bg-black/50 rounded-lg p-2 max-w-[90%] overflow-x-auto">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-8 h-8 rounded-md overflow-hidden border-2 transition-all ${
                    index === currentIndex ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img
                    src={images[index]}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg'; // fallback image
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Car360Viewer;