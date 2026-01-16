import { motion } from 'framer-motion';

const AdminInventorySkeleton = () => {
  return (
    <div className="p-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="h-10 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded-xl w-64" />
        <div className="h-10 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded-xl w-32" />
        <div className="h-10 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded-xl w-32" />
      </div>

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
            <div className="bg-gradient-to-br from-gray-800/20 to-gray-900/10 border border-border/10 rounded-2xl p-6">
              <div className="h-4 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-24 mb-4" />
              <div className="h-8 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-32 mb-2" />
              <div className="h-3 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-40" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Inventory Table */}
      <motion.div
        className="bg-gradient-to-br from-gray-800/20 to-gray-900/10 border border-border/10 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.5,
          ease: "easeOut"
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-48" />
          <div className="h-10 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded-xl w-32" />
        </div>
        
        {/* Table Headers */}
        <div className="grid grid-cols-12 gap-4 mb-4 pb-2 border-b border-border/20">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className={`h-4 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded ${index === 0 ? 'col-span-4' : index === 5 ? 'col-span-2' : 'col-span-1'}`}
            />
          ))}
        </div>
        
        {/* Table Rows */}
        {[...Array(8)].map((_, rowIndex) => (
          <motion.div
            key={rowIndex}
            className="grid grid-cols-12 gap-4 py-4 border-b border-border/10 last:border-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.7 + rowIndex * 0.05,
              ease: "easeOut"
            }}
          >
            {[...Array(6)].map((_, cellIndex) => (
              <div 
                key={cellIndex} 
                className={`h-4 bg-gradient-to-r from-gray-700/20 to-gray-800/10 rounded ${cellIndex === 0 ? 'col-span-4' : cellIndex === 5 ? 'col-span-2' : 'col-span-1'}`}
              />
            ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminInventorySkeleton;