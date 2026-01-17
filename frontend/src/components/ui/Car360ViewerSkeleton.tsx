import { motion } from 'framer-motion';

const Car360ViewerSkeleton = () => {
  return (
    <div className="relative bg-gradient-to-b from-card via-card/80 to-background overflow-hidden rounded-2xl aspect-video flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Speedometer-style Circular Loader */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Outer circle */}
        <div className="relative w-40 h-40">
          {/* Speedometer background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800/30 to-gray-900/20 border border-border/20" />
          
          {/* Speedometer arc */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(55, 65, 81, 0.3)" // gray-700/30
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Progress */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#dc2626" /> {/* red-600 */}
                <stop offset="100%" stopColor="#991b1b" /> {/* red-800 */}
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-border/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
        
        {/* Microcopy */}
        <motion.p 
          className="mt-8 text-lg text-foreground font-medium"
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
      <div 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/60 backdrop-blur-xl border border-border/50 flex items-center justify-center text-foreground"
        style={{
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/60 backdrop-blur-xl border border-border/50 flex items-center justify-center text-foreground"
        style={{
          animation: 'pulse 1.5s ease-in-out infinite 0.3s',
        }}
      />
      
      {/* Simulated View Tabs */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        <div className="flex gap-1 p-1 bg-background/60 backdrop-blur-xl rounded-full border border-border/50">
          {Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              className="h-9 px-4 rounded-full bg-background/60"
              style={{
                animation: 'pulse 1.5s ease-in-out infinite ' + (0.5 + index * 0.2) + 's',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Car360ViewerSkeleton;