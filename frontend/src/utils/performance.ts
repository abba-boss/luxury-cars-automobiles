// Performance and loading utilities for low bandwidth optimization

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical images
  const criticalImages = [
    '/uploads/logo.png',
    '/uploads/hero-bg.jpg',
    // Add other critical images here
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Debounced loading function
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function (...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy loading with intersection observer
export const lazyLoadImage = (image: HTMLImageElement) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });
  
  observer.observe(image);
};

// Network-aware loading
export const getNetworkEffectiveType = () => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (connection) {
    return connection.effectiveType;
  }
  return '4g'; // Default assumption
};

// Conditional loading based on network
export const shouldLoadHighResContent = () => {
  const effectiveType = getNetworkEffectiveType();
  return effectiveType === '4g' || effectiveType === '3g';
};

// Optimized loading indicators
export const showPerceivedProgress = (callback: (progress: number) => void) => {
  let progress = 0;
  const interval = setInterval(() => {
    if (progress < 90) {
      progress += Math.random() * 10;
      callback(Math.min(progress, 90));
    } else {
      clearInterval(interval);
    }
  }, 200);
  
  return () => clearInterval(interval);
};