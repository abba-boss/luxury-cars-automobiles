import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Maximize2, 
  Car, 
  Gauge, 
  Armchair,
  CircleDot,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface Car360ViewerProps {
  images: string[];
  carName: string;
}

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface ViewTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

const viewTabs: ViewTab[] = [
  { id: "exterior", label: "Exterior", icon: Car },
  { id: "interior", label: "Interior", icon: Armchair },
  { id: "engine", label: "Engine", icon: Gauge },
  { id: "wheels", label: "Wheels", icon: CircleDot },
];

const hotspots: Hotspot[] = [
  { id: "engine", x: 25, y: 40, label: "Engine", description: "V6 3.5L Twin-Turbo", icon: Gauge },
  { id: "interior", x: 50, y: 35, label: "Interior", description: "Premium Leather Seats", icon: Armchair },
  { id: "wheels", x: 20, y: 70, label: "Wheels", description: "21\" Alloy Wheels", icon: CircleDot },
  { id: "trunk", x: 80, y: 50, label: "Trunk", description: "68.6 cu ft Capacity", icon: Car },
];

export function Car360Viewer({ images, carName }: Car360ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [activeTab, setActiveTab] = useState("exterior");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handleTabChange = (tabId: string) => {
    setIsTransitioning(true);
    setActiveTab(tabId);
    setSelectedHotspot(null);
    // Simulate different views with different images
    const tabIndex = viewTabs.findIndex(t => t.id === tabId);
    setCurrentIndex(tabIndex % images.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const currentImage = images && images.length > 0 ? (images[currentIndex] || images[0]) : '/placeholder-car.svg';

  return (
    <div 
      className={cn(
        "relative bg-gradient-to-b from-card via-card/80 to-background overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50" : "rounded-2xl"
      )}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        {/* View Tabs */}
        <div className="flex gap-1 p-1 bg-background/60 backdrop-blur-xl rounded-full border border-border/50">
          {viewTabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-full px-4 transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
              onClick={() => handleTabChange(tab.id)}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </div>
        
        {/* Fullscreen Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background/60 backdrop-blur-xl border border-border/50 hover:bg-background/80 hover:border-primary/50 transition-all duration-300"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <X className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>

      {/* Main Viewer */}
      <div
        className={cn(
          "relative select-none",
          isFullscreen ? "h-full" : "aspect-video"
        )}
      >
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/60 backdrop-blur-xl border border-border/50 flex items-center justify-center text-foreground hover:bg-background/80 hover:border-primary/50 hover:scale-110 transition-all duration-300 group"
        >
          <ChevronLeft className="h-6 w-6 group-hover:text-primary transition-colors" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/60 backdrop-blur-xl border border-border/50 flex items-center justify-center text-foreground hover:bg-background/80 hover:border-primary/50 hover:scale-110 transition-all duration-300 group"
        >
          <ChevronRight className="h-6 w-6 group-hover:text-primary transition-colors" />
        </button>

        {/* Car Image with Smooth Transition */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full h-full">
            <img
              key={currentIndex}
              src={currentImage}
              alt={carName}
              className={cn(
                "w-full h-full object-contain transition-all duration-500",
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              )}
              draggable={false}
            />
            
            {/* Car Glow Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none opacity-50" />
          </div>
        </div>

        {/* Hotspots - Only on Exterior */}
        {activeTab === "exterior" && hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            className={cn(
              "absolute z-20 transition-all duration-300",
              selectedHotspot?.id === hotspot.id ? "scale-125" : "hover:scale-110"
            )}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            onClick={() => setSelectedHotspot(selectedHotspot?.id === hotspot.id ? null : hotspot)}
          >
            {/* Pulse Ring */}
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
            
            {/* Inner Dot */}
            <span className={cn(
              "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
              selectedHotspot?.id === hotspot.id 
                ? "bg-primary border-primary shadow-lg shadow-primary/50" 
                : "bg-background/80 border-primary/60 backdrop-blur-sm"
            )}>
              <Sparkles className={cn(
                "h-4 w-4 transition-colors",
                selectedHotspot?.id === hotspot.id ? "text-primary-foreground" : "text-primary"
              )} />
            </span>
          </button>
        ))}

        {/* Hotspot Info Card */}
        {selectedHotspot && (
          <div 
            className="absolute bg-card/95 backdrop-blur-xl border border-border/50 p-5 rounded-xl z-30 animate-scale-in min-w-56 shadow-2xl"
            style={{ 
              left: `${Math.min(selectedHotspot.x + 5, 65)}%`, 
              top: `${Math.min(selectedHotspot.y, 55)}%` 
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <selectedHotspot.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">{selectedHotspot.label}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{selectedHotspot.description}</p>
          </div>
        )}
      </div>

      {/* Footer - Image Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        {/* Thumbnail Dots */}
        <div className="flex items-center gap-2 p-2 bg-background/60 backdrop-blur-xl rounded-full border border-border/50">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 400);
              }}
              className={cn(
                "transition-all duration-300 rounded-full",
                currentIndex === index 
                  ? "w-8 h-2 bg-primary shadow-lg shadow-primary/50" 
                  : "w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground">
          Use arrows to navigate • Click hotspots for details
        </p>
      </div>
    </div>
  );
}

export default Car360Viewer;