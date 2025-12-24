import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize2, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarVideoSectionProps {
  carName: string;
  posterImage: string;
}

interface VideoCategory {
  id: string;
  title: string;
  duration: string;
  views: string;
  description: string;
}

const videoCategories: VideoCategory[] = [
  { 
    id: "driving", 
    title: "Driving Experience", 
    duration: "2:34",
    views: "12.5K",
    description: "Feel the road with premium suspension and handling"
  },
  { 
    id: "interior", 
    title: "Interior Tour", 
    duration: "1:45",
    views: "8.2K",
    description: "Explore the luxurious cabin and premium materials"
  },
  { 
    id: "engine", 
    title: "Engine Sound", 
    duration: "0:58",
    views: "25.1K",
    description: "Listen to the powerful V6 twin-turbo symphony"
  },
  { 
    id: "speed", 
    title: "Speed Test", 
    duration: "3:12",
    views: "45.3K",
    description: "0-60 in 4.5 seconds, witness the acceleration"
  },
];

export function CarVideoSection({ carName, posterImage }: CarVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoCategory>(videoCategories[0]);
  const [progress, setProgress] = useState(0);

  const handleVideoSelect = (video: VideoCategory) => {
    setActiveVideo(video);
    setIsPlaying(true);
    setProgress(0);
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 2;
      });
    }, 200);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 200);
    }
  };

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 border border-primary/40 text-primary text-xs font-semibold tracking-[0.3em] mb-6 rounded-full bg-primary/5">
            EXPERIENCE
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Feel the Power
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Immerse yourself in the driving experience with our cinematic showcase
          </p>
        </div>

        {/* Main Video Player */}
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 group bg-card border border-border/50">
          {/* Video Poster / Thumbnail */}
          <img
            src={posterImage}
            alt={`${carName} ${activeVideo.title}`}
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              isPlaying ? "scale-105 brightness-50" : "scale-100"
            )}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {/* Video Title Overlay */}
          <div className="absolute top-6 left-6 z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className={cn(
                "w-3 h-3 rounded-full transition-colors",
                isPlaying ? "bg-primary animate-pulse" : "bg-muted-foreground"
              )} />
              <span className="text-sm text-foreground/80 font-medium">
                {isPlaying ? "Now Playing" : "Ready"}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">{activeVideo.title}</h3>
            <p className="text-muted-foreground mt-1">{activeVideo.description}</p>
          </div>

          {/* Center Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center group/play z-10"
          >
            <div className="relative">
              {/* Outer Glow Ring */}
              <div className={cn(
                "absolute inset-0 rounded-full transition-all duration-500",
                isPlaying 
                  ? "bg-primary/20 scale-100" 
                  : "bg-primary/30 scale-150 animate-pulse"
              )} />
              
              {/* Button */}
              <div className={cn(
                "relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl",
                isPlaying 
                  ? "bg-foreground/20 backdrop-blur-xl border border-foreground/20" 
                  : "bg-primary group-hover/play:scale-110 shadow-primary/50"
              )}>
                {isPlaying ? (
                  <Pause className="h-8 w-8 md:h-10 md:w-10 text-foreground" />
                ) : (
                  <Play className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground ml-1" />
                )}
              </div>
            </div>
          </button>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-foreground/10 rounded-full mb-4 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-200 shadow-lg shadow-primary/50"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-foreground/10 backdrop-blur-xl border border-foreground/10 hover:bg-foreground/20 hover:border-primary/50 transition-all"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Clock className="h-4 w-4" />
                  <span>{activeVideo.duration}</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-foreground/10 backdrop-blur-xl border border-foreground/10 hover:bg-foreground/20 hover:border-primary/50 transition-all"
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videoCategories.map((video, index) => (
            <button
              key={video.id}
              onClick={() => handleVideoSelect(video)}
              className={cn(
                "group relative aspect-video rounded-xl overflow-hidden transition-all duration-500 border",
                activeVideo.id === video.id 
                  ? "border-primary/50 ring-2 ring-primary/20 scale-[1.02]" 
                  : "border-border/30 hover:border-primary/30 hover:scale-[1.02]"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={posterImage}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className={cn(
                "absolute inset-0 transition-all duration-300",
                activeVideo.id === video.id 
                  ? "bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" 
                  : "bg-gradient-to-t from-background via-background/50 to-transparent"
              )} />
              
              {/* Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  activeVideo.id === video.id 
                    ? "bg-primary-foreground/20 backdrop-blur-sm scale-110" 
                    : "bg-foreground/10 backdrop-blur-sm group-hover:bg-primary group-hover:scale-110"
                )}>
                  {activeVideo.id === video.id && isPlaying ? (
                    <div className="flex gap-1">
                      <span className="w-1 h-4 bg-primary-foreground rounded-full animate-pulse" />
                      <span className="w-1 h-4 bg-primary-foreground rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-4 bg-primary-foreground rounded-full animate-pulse delay-150" />
                    </div>
                  ) : (
                    <Play className={cn(
                      "h-5 w-5 ml-0.5 transition-colors",
                      activeVideo.id === video.id ? "text-primary-foreground" : "text-foreground group-hover:text-primary-foreground"
                    )} />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className={cn(
                  "text-sm font-semibold transition-colors",
                  activeVideo.id === video.id ? "text-primary-foreground" : "text-foreground"
                )}>{video.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-foreground/60 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </span>
                  <span className="text-xs text-foreground/60 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.views}
                  </span>
                </div>
              </div>

              {/* Active Indicator */}
              {activeVideo.id === video.id && (
                <div className="absolute top-2 right-2">
                  <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse block" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}