import { motion } from 'framer-motion';

const ChartSkeleton = ({ width = "100%", height = "200px" }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800/20 to-gray-900/10 border border-border/10 rounded-2xl p-4"
      style={{ width, height }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Simulated chart axes */}
      <div className="flex flex-col h-full">
        {/* Y-axis lines */}
        <div className="flex-1 flex flex-col justify-between py-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-px bg-border/20 w-full" />
          ))}
        </div>
        
        {/* X-axis line */}
        <div className="h-px bg-border/20 w-full mt-2" />
        
        {/* Simulated bars/lines */}
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="w-8 bg-gradient-to-t from-gray-700/30 to-gray-800/20 rounded-t-md"
              style={{ height: `${Math.random() * 60 + 20}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ChartSkeleton;