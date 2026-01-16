import { motion } from 'framer-motion';

const DashboardCardSkeleton = () => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800/20 to-gray-900/10 border border-border/10 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-24" />
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700/30 to-gray-800/20" />
      </div>
      <div className="h-8 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-32 mb-2" />
      <div className="h-3 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-40" />
    </motion.div>
  );
};

export default DashboardCardSkeleton;