import { motion } from 'framer-motion';

const GlobalAppLoader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0f0f] backdrop-blur-xl"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center">
        {/* Brand Logo with Subtle Glow */}
        <motion.div
          className="mb-10 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "circOut" }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/20">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Animated Car Silhouette */}
        <motion.div
          className="relative mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        >
          <svg
            width="160"
            height="60"
            viewBox="0 0 160 60"
            className="text-gray-400"
          >
            {/* Car Body */}
            <motion.rect
              x="10"
              y="20"
              width="140"
              height="25"
              rx="8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.6,
                ease: "easeInOut"
              }}
            />

            {/* Windows */}
            <motion.rect
              x="30"
              y="15"
              width="40"
              height="15"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.8,
                ease: "easeInOut"
              }}
            />

            <motion.rect
              x="80"
              y="15"
              width="50"
              height="15"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                delay: 1.0,
                ease: "easeInOut"
              }}
            />

            {/* Wheels */}
            <motion.circle
              cx="30"
              cy="45"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                delay: 1.2,
                ease: "easeInOut"
              }}
            />

            <motion.circle
              cx="130"
              cy="45"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                delay: 1.4,
                ease: "easeInOut"
              }}
            />

            {/* Wheel details */}
            <motion.circle
              cx="30"
              cy="45"
              r="4"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                delay: 1.6,
                ease: "easeInOut"
              }}
            />

            <motion.circle
              cx="130"
              cy="45"
              r="4"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                delay: 1.8,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="text-gray-400 text-sm font-medium mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5, ease: "easeInOut" }}
          aria-live="polite"
          aria-label="Loading application, preparing your drive experience"
        >
          Preparing your drive experience...
        </motion.p>

        {/* Progress Ring */}
        <motion.div
          className="relative w-32 h-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 to-red-800 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.5,
              delay: 2.4,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GlobalAppLoader;