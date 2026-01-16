import { motion } from 'framer-motion';

const VideoPlayerSkeleton = () => {
  return (
    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl">
      {/* Blurred Preview Thumbnail */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-60 backdrop-blur-sm"></div>
      
      {/* Play Button with Animated Ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Animated Loading Ring */}
          <motion.div
            className="w-20 h-20 rounded-full border-4 border-primary/30"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Play Button */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center z-10">
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
        <p className="text-white text-sm">Loading video...</p>
      </div>
    </div>
  );
};

export default VideoPlayerSkeleton;