import { motion } from 'framer-motion';

interface VehicleCardSkeletonProps {
  count?: number;
}

const VehicleCardSkeleton = ({ count = 4 }: VehicleCardSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Image Skeleton */}
          <div className="aspect-[4/3] bg-gradient-to-br from-gray-800/20 to-gray-900/10 animate-pulse" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gradient-to-r from-gray-800/20 to-gray-900/10 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-800/20 to-gray-900/10 rounded w-1/2 animate-pulse" />
            
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-3 bg-gradient-to-r from-gray-800/20 to-gray-900/10 rounded animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-gray-800/20 to-gray-900/10 rounded animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-gray-800/20 to-gray-900/10 rounded animate-pulse" />
            </div>
            
            <div className="h-6 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg mt-2 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VehicleCardSkeleton;