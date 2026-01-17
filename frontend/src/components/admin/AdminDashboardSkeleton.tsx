import { motion } from 'framer-motion';

const AdminDashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-card border border-border/50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <div className="w-6 h-6 bg-primary/30 rounded" />
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-700/20 to-gray-800/10 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-6 bg-gradient-to-r from-gray-700/20 to-gray-800/10 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-card border border-border/50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: (index + 4) * 0.1,
              ease: "easeOut"
            }}
          >
            <div className="h-6 bg-gradient-to-r from-gray-700/20 to-gray-800/10 rounded w-1/3 mb-6 animate-pulse" />
            <div className="aspect-video bg-gradient-to-br from-gray-800/10 to-gray-900/5 rounded-xl flex items-center justify-center">
              <div className="w-3/4 h-3/4 bg-gradient-to-r from-gray-800/20 to-gray-900/10 rounded-lg animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        className="bg-card border border-border/50 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.6,
          ease: "easeOut"
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gradient-to-r from-gray-700/20 to-gray-800/10 rounded w-1/4 animate-pulse" />
          <div className="h-8 bg-gradient-to-r from-gray-700/20 to-gray-800/10 rounded w-24 animate-pulse" />
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 py-3 border-b border-border/20 last:border-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: 0.7 + index * 0.05,
                ease: "easeOut"
              }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800/20 to-gray-900/10 flex items-center justify-center">
                <div className="w-5 h-5 bg-primary/30 rounded" />
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-700/20 to-gray-800/10 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-gray-700/20 to-gray-800/10 rounded w-1/2 animate-pulse" />
              </div>
              <div className="h-3 bg-gradient-to-r from-gray-700/20 to-gray-800/10 rounded w-16 animate-pulse" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardSkeleton;