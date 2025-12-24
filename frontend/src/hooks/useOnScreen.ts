import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that detects when an element comes into view
 * @param options Intersection Observer options
 * @returns boolean indicating if element is on screen
 */
export const useOnScreen = (options?: IntersectionObserverInit) => {
  const ref = useRef<Element | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false); // Track if animation has already triggered

  useEffect(() => {
    const element = ref.current;
    if (!element) return; // Stop if element doesn't exist

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsOnScreen(true);
          setHasAnimated(true); // Set flag to prevent re-animation
        } else if (!entry.isIntersecting && !hasAnimated) {
          setIsOnScreen(false);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options, hasAnimated]); // Add hasAnimated to dependency array

  return { ref, isOnScreen, hasAnimated };
};