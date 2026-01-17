import { motion } from 'framer-motion';

const VideoPlayerSkeleton = () => {
  return (
    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/80 rounded-2xl flex items-center justify-center">
      {/* Blurred Poster Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/10 opacity-60 backdrop-blur-sm"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      {/* Play Button with Animated Ring */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Animated Loading Ring */}
          <motion.div
            className="w-24 h-24 rounded-full border-4 border-primary/30"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          
          {/* Inner Ring */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary/20"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, -360]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
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
        
        {/* Loading Text */}
        <motion.p 
          className="mt-6 text-lg text-white font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Loading Video...
        </motion.p>
        
        <motion.p 
          className="text-gray-300 mt-2 text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Preparing high-quality video stream
        </motion.p>
      </div>
      
      {/* Simulated Video Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-24 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
          <span className="text-xs text-gray-300">1:24 / 4:32</span>
        </div>
        
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-300 rounded" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerSkeleton;