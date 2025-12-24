import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

import heroImage from "@/assets/hero-car.jpg";
import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";

const heroSlides = [
  {
    id: "1",
    image: heroImage,
    title: "Lexus RX 350",
    subtitle: "Luxury Redefined",
    category: "Luxury SUV",
    stats: { power: "335 hp", acceleration: "5.8s", topSpeed: "155 mph" },
    description: "Experience unparalleled luxury with advanced safety features and premium comfort."
  },
  {
    id: "2",
    image: car1,
    title: "Toyota Camry",
    subtitle: "Elegance in Motion",
    category: "Executive Sedan",
    stats: { power: "301 hp", acceleration: "5.8s", topSpeed: "145 mph" },
    description: "The perfect blend of reliability, efficiency, and sophisticated design."
  },
  {
    id: "3",
    image: car2,
    title: "Range Rover Sport",
    subtitle: "Command the Road",
    category: "Performance SUV",
    stats: { power: "395 hp", acceleration: "5.5s", topSpeed: "162 mph" },
    description: "Uncompromising performance meets ultimate off-road capability."
  },
  {
    id: "4",
    image: car3,
    title: "Mercedes E-Class",
    subtitle: "Timeless Sophistication",
    category: "Luxury Sedan",
    stats: { power: "362 hp", acceleration: "5.1s", topSpeed: "155 mph" },
    description: "Where innovation meets elegance in the ultimate driving machine."
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    // Reset the auto-play timer when user interacts
    setIsAutoPlaying(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  };

  // Auto-play functionality with pause on user interaction
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  const slide = heroSlides[currentSlide];

  return (
    <section
      className="relative h-screen min-h-[800px] overflow-hidden bg-background"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Images with Parallax */}
      {heroSlides.map((s, index) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-out",
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
          )}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent/30" />
        </div>
      ))}

      {/* Animated Glow Effect */}
      <div className="absolute inset-0 gradient-radial animate-glow-pulse pointer-events-none" />

      {/* Content */}
      <div className="relative h-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 flex items-center">
        <div className="max-w-3xl">
          {/* Category Badge */}
          <div
            key={`cat-${currentSlide}`}
            className="animate-fade-in-down"
          >
            <span className="inline-block px-5 py-2 border border-primary/60 text-primary text-sm font-semibold tracking-[0.2em] mb-4 backdrop-blur-sm bg-background/30 rounded-full">
              {slide.category}
            </span>
          </div>

          {/* Title */}
          <h1
            key={`title-${currentSlide}`}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-3 animate-fade-in-up leading-tight"
            style={{ animationDelay: "0.1s" }}
          >
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p
            key={`sub-${currentSlide}`}
            className="text-xl md:text-2xl text-muted-foreground mb-5 animate-fade-in-up font-light max-w-2xl"
            style={{ animationDelay: "0.2s" }}
          >
            {slide.subtitle}
          </p>

          {/* Description */}
          <p
            key={`description-${currentSlide}`}
            className="text-base md:text-lg text-muted-foreground mb-8 animate-fade-in-up max-w-2xl"
            style={{ animationDelay: "0.3s" }}
          >
            {slide.description}
          </p>

          {/* Quick Stats */}
          <div
            key={`stats-${currentSlide}`}
            className="flex flex-wrap gap-6 md:gap-8 mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            {Object.entries(slide.stats).map(([key, value]) => (
              <div key={key} className="text-center min-w-[80px]">
                <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            key={`cta-${currentSlide}`}
            className="flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <Link to={`/cars/${slide.id}`}>
              <Button className="btn-tesla group px-8 py-5 text-base">
                View Car Details
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/book-inspection">
              <Button className="btn-tesla-outline group px-8 py-5 text-base">
                <Play className="mr-2 h-4 w-4" />
                Book Test Drive
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls - Tesla Style */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-10">
        {/* Arrow Controls */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-foreground/20 hover:border-foreground hover:bg-foreground/10 transition-all duration-300 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === currentSlide
                  ? "w-8 bg-primary shadow-glow"
                  : "w-3 bg-foreground/30 hover:bg-foreground/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-foreground/20 hover:border-foreground hover:bg-foreground/10 transition-all duration-300 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Additional Controls */}
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        {/* Mute/Unmute Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full border border-foreground/20 backdrop-blur-sm"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 left-6 hidden md:block z-10">
        <div className="flex flex-col items-center gap-1 text-sm">
          <span className="text-foreground font-bold text-xl">{String(currentSlide + 1).padStart(2, "0")}</span>
          <div className="w-8 h-px bg-foreground/30" />
          <span className="text-muted-foreground text-sm">{String(heroSlides.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Auto-play indicator */}
      <div className="absolute bottom-8 right-8 hidden md:block z-10">
        <div className="flex flex-col items-center">
          <div className="w-8 h-1 bg-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-8000 ease-linear"
              style={{ width: isAutoPlaying ? '100%' : '0%' }}
            />
          </div>
          <span className="text-xs text-muted-foreground mt-1">AUTO</span>
        </div>
      </div>
    </section>
  );
}
