import { motion } from 'framer-motion';

const GlobalAppLoader = () => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a] backdrop-blur-sm"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        {/* Brand Logo */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
        </motion.div>

        {/* Animated Car Outline */}
        <motion.div 
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          <svg 
            width="120" 
            height="60" 
            viewBox="0 0 120 60" 
            className="text-gray-300"
          >
            <motion.path
              d="M10 20 L20 10 L100 10 L110 20 L110 40 L100 50 L20 50 L10 40 Z M30 30 L40 25 L80 25 L90 30 L90 40 L80 45 L40 45 L30 40 Z M40 10 L40 25 M90 10 L90 25 M40 45 L40 50 M90 45 L90 50"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 1.5, 
                delay: 0.6,
                ease: "easeInOut"
              }}
            />
            
            {/* Wheels */}
            <motion.circle
              cx="30"
              cy="45"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 1.5, 
                delay: 0.8,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx="90"
              cy="45"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 1.5, 
                delay: 0.8,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>

        {/* Loading Text */}
        <motion.p 
          className="text-gray-400 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          Loading Luxury Experience...
        </motion.p>

        {/* Progress Bar */}
        <motion.div 
          className="mt-6 w-48 h-0.5 bg-gray-700 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-red-600 to-red-800"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2, 
              delay: 1.6,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GlobalAppLoader;