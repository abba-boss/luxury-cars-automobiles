import { useState, useEffect, useRef } from 'react';

interface MileageMeterProps {
  value: number;
  max: number;
  unit: string;
  label: string;
}

export const AnimatedMileageMeter = ({ value, max, unit, label }: MileageMeterProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [needlePulse, setNeedlePulse] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Calculate percentage for the gauge
  const percentage = Math.min((value / max) * 100, 100);

  // Calculate the rotation angle for the needle (0-180 degrees for 0-max range)
  const needleRotation = (percentage / 100) * 180;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);

          // Animate the number from 0 to the final value
          let start: number | null = null;
          const duration = 2500; // Slightly longer duration for more animation

          const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setAnimatedValue(Math.floor(progress * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // Add a slight pulse effect at the end of animation
              setTimeout(() => {
                setNeedlePulse(true);
                setTimeout(() => setNeedlePulse(false), 500);
              }, 300);
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
  }, [isVisible, value]);

  // Calculate the color based on percentage for visual feedback
  const getGaugeColor = () => {
    if (percentage < 30) return 'hsl(var(--primary))'; // Green for lower mileage
    if (percentage < 70) return 'hsl(var(--primary))'; // Yellow for medium
    return 'hsl(var(--destructive))'; // Red for high mileage
  };

  // Calculate redline position (e.g., 85% of max as the red zone)
  const redlinePercentage = 85; // Start redline at 85%
  const redlineStartAngle = (redlinePercentage / 100) * 180;
  const redlineStartX = 100 + 80 * Math.cos((redlineStartAngle - 90) * Math.PI / 180);
  const redlineStartY = 100 + 80 * Math.sin((redlineStartAngle - 90) * Math.PI / 180);

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
      }`}
    >
      <div className="relative w-48 h-28 mx-auto mb-4"> {/* Slightly larger for better detail */}
        {/* Gauge background */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="10"
          />

          {/* Redline section (high mileage warning) */}
          {percentage > 85 && (
            <path
              d={`M ${redlineStartX} ${redlineStartY} A 80 80 0 0 1 180 100`}
              fill="none"
              stroke="hsl(var(--destructive))"
              strokeWidth="10"
              strokeLinecap="round"
              className="animate-pulse"
            />
          )}

          {/* Active arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getGaugeColor()}
            strokeWidth="10"
            strokeDasharray="251.2" // Approximate circumference of half circle
            strokeDashoffset={251.2 - (percentage / 100) * 251.2}
            strokeLinecap="round"
            className="transition-all duration-2000 ease-out"
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tickPercent, index) => {
            const tickAngle = (tickPercent / 100) * 180;
            const tickX1 = 100 + 75 * Math.cos((tickAngle - 90) * Math.PI / 180);
            const tickY1 = 100 + 75 * Math.sin((tickAngle - 90) * Math.PI / 180);
            const tickX2 = 100 + 85 * Math.cos((tickAngle - 90) * Math.PI / 180);
            const tickY2 = 100 + 85 * Math.sin((tickAngle - 90) * Math.PI / 180);

            return (
              <line
                key={index}
                x1={tickX1}
                y1={tickY1}
                x2={tickX2}
                y2={tickY2}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                opacity={0.7}
              />
            );
          })}

          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="65"
            stroke="hsl(var(--foreground))"
            strokeWidth="4"
            transform={`rotate(${needleRotation - 90}, 100, 100)`}
            className={`transition-all duration-1000 ease-out origin-center ${
              needlePulse ? 'animate-pulse' : ''
            }`}
          />

          {/* Needle center */}
          <circle
            cx="100"
            cy="100"
            r="6"
            fill="hsl(var(--foreground))"
            className="animate-pulse"
          />

          {/* Needle tip */}
          <circle
            cx="100"
            cy="65"
            r="3"
            fill="hsl(var(--destructive))"
            transform={`rotate(${needleRotation - 90}, 100, 100)`}
          />
        </svg>

        {/* Value display */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          <span className={`text-2xl font-bold text-foreground transition-all duration-300 ${
            percentage > 85 ? 'text-destructive animate-pulse' : ''
          }`}>
            {isVisible ? animatedValue.toLocaleString() : '0'} {unit}
          </span>
          <span className="text-sm text-muted-foreground mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
};