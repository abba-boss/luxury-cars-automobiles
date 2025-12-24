import { useState, useEffect, useRef } from 'react';

interface PerformanceCircleProps {
  value: number;
  label: string;
  unit: string;
  index?: number;
}

export const SimpleAnimatedPerformanceCircle = ({ value, label, unit, index = 0 }: PerformanceCircleProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (value / 100) * circumference;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Animate the number from 0 to the final value
          let start: number | null = null;
          const duration = 2000; // 2 seconds duration - slower animation
          
          const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setAnimatedValue(Math.floor(progress * value));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 } // Trigger when 10% is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]); // Only run once when component mounts

  // Calculate the offset based on the animated value
  const animatedOffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative w-28 h-28 mx-auto mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={isVisible ? animatedOffset : circumference}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out origin-center"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-foreground">
            {isVisible ? animatedValue === value ? unit : `${animatedValue}` : '0'}
          </span>
        </div>
      </div>
      <p className={`text-sm text-muted-foreground transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {label}
      </p>
    </div>
  );
};