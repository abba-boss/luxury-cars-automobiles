import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = '/placeholder-car.svg',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = () => {
    if (fallbackSrc && src !== fallbackSrc) {
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Determine the actual source to use
  const imageSrc = hasError ? fallbackSrc : src;

  // Generate srcSet for responsive images
  const generateSrcSet = (src: string) => {
    if (!src) return undefined;

    // Extract base filename without extension
    const baseSrc = src.replace(/\.[^/.]+$/, '');
    const extension = src.split('.').pop();

    if (!extension) return undefined;

    return `${baseSrc}-300.${extension} 300w, ${baseSrc}-600.${extension} 600w, ${baseSrc}-1200.${extension} 1200w`;
  };

  const srcSet = generateSrcSet(imageSrc);

  return (
    <div className={cn("relative overflow-hidden rounded-none", className)}>
      <img
        ref={imgRef}
        src={imageSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          props.className
        )}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
          <div className="animate-pulse bg-muted rounded-full w-12 h-12" />
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;