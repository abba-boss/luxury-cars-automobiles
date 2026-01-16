import { motion } from 'framer-motion';

const Car360ViewerSkeleton = () => {
  return (
    <div className="relative bg-gradient-to-b from-card via-card/80 to-background overflow-hidden rounded-2xl aspect-video flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Loading Spinner */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
        />
        
        {/* Microcopy */}
        <motion.p 
          className="mt-6 text-lg text-foreground font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Loading 360° view...
        </motion.p>
        
        <motion.p 
          className="text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Preparing immersive experience
        </motion.p>
      </div>

      {/* Simulated Navigation Elements */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/60 backdrop-blur-xl border border-border/50 flex items-center justify-center text-foreground animate-pulse" />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/60 backdrop-blur-xl border border-border/50 flex items-center justify-center text-foreground animate-pulse" />
      
      {/* Simulated View Tabs */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        <div className="flex gap-1 p-1 bg-background/60 backdrop-blur-xl rounded-full border border-border/50">
          {Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              className="h-9 px-4 rounded-full bg-background/60 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Car360ViewerSkeleton;