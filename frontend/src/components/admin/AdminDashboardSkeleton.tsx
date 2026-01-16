import { motion } from 'framer-motion';
import DashboardCardSkeleton from './DashboardCardSkeleton';
import ChartSkeleton from './ChartSkeleton';

const AdminDashboardSkeleton = () => {
  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <DashboardCardSkeleton />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: (index + 4) * 0.1,
              ease: "easeOut"
            }}
          >
            <ChartSkeleton height="300px" />
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <motion.div
        className="bg-gradient-to-br from-gray-800/20 to-gray-900/10 border border-border/10 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.6,
          ease: "easeOut"
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-40" />
          <div className="h-8 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-24" />
        </div>
        
        {/* Table Headers */}
        <div className="grid grid-cols-12 gap-4 mb-4 pb-2 border-b border-border/20">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              className="h-4 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded col-span-3"
            />
          ))}
        </div>
        
        {/* Table Rows */}
        {[...Array(5)].map((_, rowIndex) => (
          <motion.div
            key={rowIndex}
            className="grid grid-cols-12 gap-4 py-3 border-b border-border/10 last:border-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.7 + rowIndex * 0.05,
              ease: "easeOut"
            }}
          >
            {[...Array(4)].map((_, cellIndex) => (
              <div 
                key={cellIndex} 
                className="h-4 bg-gradient-to-r from-gray-700/20 to-gray-800/10 rounded col-span-3"
              />
            ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminDashboardSkeleton;