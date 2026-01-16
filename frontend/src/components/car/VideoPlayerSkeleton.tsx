import { motion } from 'framer-motion';

const VideoPlayerSkeleton = () => {
  return (
    <motion.div
      className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Blurred Video Poster */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-gray-900/20 opacity-80"
        style={{
          backdropFilter: 'blur(10px)',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      ></div>

      {/* Play Button with Animated Ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Animated Loading Ring - Engine-style */}
          <motion.div
            className="w-24 h-24 rounded-full border-4 border-primary/30"
            animate={{
              scale: [1, 1.1, 1],
              rotate: 360
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear"
            }}
          />

          {/* Inner ring */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary/20"
            animate={{
              scale: [1, 1.05, 1],
              rotate: -360
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "linear"
            }}
          />

          {/* Play Button */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-primary/60 to-primary/40 backdrop-blur-sm rounded-full flex items-center justify-center z-10 shadow-lg">
            <motion.div
              className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-black/50 to-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-border/20"
        style={{
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        <p className="text-white text-sm font-medium">Loading video...</p>
      </div>
    </motion.div>
  );
};

export default VideoPlayerSkeleton;