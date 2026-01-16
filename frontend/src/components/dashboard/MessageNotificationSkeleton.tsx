import { motion } from 'framer-motion';

const MessageSkeleton = () => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800/20 to-gray-900/10 border border-border/10 rounded-2xl p-4 mb-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700/30 to-gray-800/20" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="h-4 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-24" />
            <div className="h-3 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-16" />
          </div>
          <div className="h-3 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-full mb-2" />
          <div className="h-3 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-5/6" />
        </div>
      </div>
    </motion.div>
  );
};

const NotificationSkeleton = () => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800/20 to-gray-900/10 border border-border/10 rounded-2xl p-4 mb-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600/20 to-red-800/10 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-red-500/30" />
        </div>
        <div className="flex-1">
          <div className="h-4 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-full mb-2" />
          <div className="h-3 bg-gradient-to-r from-gray-700/30 to-gray-800/20 rounded w-2/3" />
        </div>
      </div>
    </motion.div>
  );
};

export { MessageSkeleton, NotificationSkeleton };