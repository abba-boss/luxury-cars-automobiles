import { useState, useEffect } from 'react';
import { useOnScreen } from '@/hooks/useOnScreen';

interface PerformanceCircleProps {
  value: number;
  label: string;
  unit: string;
  index?: number;
}

export const AnimatedPerformanceCircle = ({ value, label, unit, index = 0 }: PerformanceCircleProps) => {
  const { ref, isOnScreen } = useOnScreen();
  const [animatedValue, setAnimatedValue] = useState(0);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (value / 100) * circumference;

  // Animate the value when the element comes into view
  useEffect(() => {
    if (isOnScreen) {
      // Animate from 0 to target value
      let start: number | null = null;
      const duration = 1000; // 1 second animation

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
  }, [isOnScreen, value]);

  // Calculate the offset based on the animated value
  const animatedOffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ease-out ${
        isOnScreen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
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
            strokeDashoffset={isOnScreen ? animatedOffset : circumference}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out origin-center"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-foreground">
            {isOnScreen ? animatedValue === value ? unit : animatedValue : '0'}
          </span>
        </div>
      </div>
      <p className={`text-sm text-muted-foreground transition-opacity duration-500 ${
        isOnScreen ? 'opacity-100' : 'opacity-0'
      }`}>
        {label}
      </p>
    </div>
  );
};