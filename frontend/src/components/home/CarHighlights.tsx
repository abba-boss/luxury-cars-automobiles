import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Shield, Zap, Timer, Gauge, Fuel, Settings2 } from "lucide-react";

const highlights = [
  {
    icon: Zap,
    title: "Instant Power",
    value: "0-60 in 4.8s",
    description: "Lightning-fast acceleration",
  },
  {
    icon: Gauge,
    title: "Top Speed",
    value: "175 mph",
    description: "Unleash the beast",
  },
  {
    icon: Timer,
    title: "Range",
    value: "450+ miles",
    description: "Go the distance",
  },
  {
    icon: Shield,
    title: "Safety",
    value: "5-Star",
    description: "NCAP rated protection",
  },
  {
    icon: Fuel,
    title: "Efficiency",
    value: "28 MPG",
    description: "Optimized performance",
  },
  {
    icon: Settings2,
    title: "Warranty",
    value: "5 Years",
    description: "Complete peace of mind",
  },
];

export function CarHighlights() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-card overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />

      <div className="relative max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 border border-primary/60 text-primary text-xs font-semibold tracking-[0.3em] mb-6">
            PERFORMANCE
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Built for Excellence
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every vehicle in our collection represents the pinnacle of automotive engineering
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {highlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className={cn(
                "group relative p-6 text-center border border-border bg-background/50 backdrop-blur-sm transition-all duration-500 hover:border-primary hover:bg-primary/5",
                isVisible ? "animate-fade-in-up" : "opacity-0"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:shadow-glow">
                <highlight.icon className="h-5 w-5 text-foreground transition-colors duration-500 group-hover:text-primary-foreground" />
              </div>

              {/* Value */}
              <p className="text-2xl font-bold text-foreground mb-1">{highlight.value}</p>
              
              {/* Title */}
              <p className="text-sm font-medium text-foreground mb-1">{highlight.title}</p>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground">{highlight.description}</p>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom Line Animation */}
        <div className="mt-16 relative">
          <div className="h-px bg-border w-full" />
          <div 
            className={cn(
              "absolute top-0 left-0 h-px bg-primary transition-all duration-1000",
              isVisible ? "w-full" : "w-0"
            )}
            style={{ transitionDelay: "0.5s" }}
          />
        </div>
      </div>
    </section>
  );
}
