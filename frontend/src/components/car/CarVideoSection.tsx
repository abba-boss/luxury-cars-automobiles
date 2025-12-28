import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarVideoSectionProps {
  carName: string;
  posterImage: string;
  videos?: string[]; // Add videos prop
}

export function CarVideoSection({ carName, posterImage, videos = [] }: CarVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // If no videos available, don't render the section
  if (!videos || videos.length === 0) {
    return null;
  }

  const currentVideo = videos[activeVideoIndex];

  const handleVideoSelect = (index: number) => {
    setActiveVideoIndex(index);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlay = () => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
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
          {/* Actual Video Element */}
          <video
            src={currentVideo}
            poster={posterImage}
            className="w-full h-full object-cover"
            controls={isPlaying}
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Gradient Overlay (only when not playing) */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          )}

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
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">{carName} Video</h3>
            <p className="text-muted-foreground mt-1">Experience the vehicle in action</p>
          </div>

          {/* Center Play Button (only when not playing) */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center group/play z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/30 scale-150 animate-pulse" />
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-primary group-hover/play:scale-110 shadow-primary/50 transition-all duration-300 shadow-2xl">
                  <Play className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground ml-1" />
                </div>
              </div>
            </button>
          )}

        </div>

        {/* Video Grid - Only show if multiple videos */}
        {videos.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videos.map((videoUrl, index) => (
              <button
                key={index}
                onClick={() => handleVideoSelect(index)}
                className={cn(
                  "group relative aspect-video rounded-xl overflow-hidden transition-all duration-500 border",
                  activeVideoIndex === index 
                    ? "border-primary/50 ring-2 ring-primary/20 scale-[1.02]" 
                    : "border-border/30 hover:border-primary/30 hover:scale-[1.02]"
                )}
              >
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  muted
                />
                
                {/* Gradient Overlay */}
                <div className={cn(
                  "absolute inset-0 transition-all duration-300",
                  activeVideoIndex === index 
                    ? "bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" 
                    : "bg-gradient-to-t from-background via-background/50 to-transparent"
                )} />
                
                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    activeVideoIndex === index 
                      ? "bg-primary-foreground/20 backdrop-blur-sm scale-110" 
                      : "bg-foreground/10 backdrop-blur-sm group-hover:bg-primary group-hover:scale-110"
                  )}>
                    <Play className={cn(
                      "h-5 w-5 ml-0.5 transition-colors",
                      activeVideoIndex === index ? "text-primary-foreground" : "text-foreground group-hover:text-primary-foreground"
                    )} />
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className={cn(
                    "text-sm font-semibold transition-colors",
                    activeVideoIndex === index ? "text-primary-foreground" : "text-foreground"
                  )}>Video {index + 1}</p>
                </div>

                {/* Active Indicator */}
                {activeVideoIndex === index && (
                  <div className="absolute top-2 right-2">
                    <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse block" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}