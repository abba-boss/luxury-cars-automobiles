import { motion } from 'framer-motion';

const CarCardSkeleton = () => {
  return (
    <motion.div 
      className="card-luxury overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Skeleton */}
      <div className="relative aspect-[3/2] sm:aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 animate-shimmer" />
        
        {/* Badges Skeleton */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <div className="px-2 py-1 bg-gray-700 rounded-full w-16 h-5 animate-pulse"></div>
          <div className="px-2 py-1 bg-gray-700 rounded-full w-16 h-5 animate-pulse"></div>
        </div>

        {/* Condition Badge Skeleton */}
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1.5 bg-gray-700 rounded-full w-12 h-5 animate-pulse"></div>
        </div>

        {/* Price Skeleton */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-gray-700 w-20 h-5 animate-pulse"></div>

        {/* Favorite Button Skeleton */}
        <div className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-gray-700 animate-pulse"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        <div>
          <div className="h-5 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="flex items-center gap-1">
            <div className="h-3 bg-gray-700 rounded w-16"></div>
            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
            <div className="h-3 bg-gray-700 rounded w-12"></div>
            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
            <div className="h-3 bg-gray-700 rounded w-10"></div>
          </div>
        </div>

        {/* Specs Skeleton */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1 mb-1">
              <div className="h-3 w-3 bg-gray-700 rounded-full"></div>
              <div className="h-2 bg-gray-700 rounded w-12"></div>
            </div>
            <div className="h-3 bg-gray-700 rounded w-8"></div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1 mb-1">
              <div className="h-3 w-3 bg-gray-700 rounded-full"></div>
              <div className="h-2 bg-gray-700 rounded w-8"></div>
            </div>
            <div className="h-3 bg-gray-700 rounded w-8"></div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1 mb-1">
              <div className="h-3 w-3 bg-gray-700 rounded-full"></div>
              <div className="h-2 bg-gray-700 rounded w-10"></div>
            </div>
            <div className="h-3 bg-gray-700 rounded w-8"></div>
          </div>
        </div>

        {/* Additional Specs Row Skeleton */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-gray-700 rounded-full"></div>
            <div className="h-2 bg-gray-700 rounded w-16"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-gray-700 rounded-full"></div>
            <div className="h-2 bg-gray-700 rounded w-12"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CarListingSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <CarCardSkeleton key={index} />
      ))}
    </div>
  );
};

export { CarCardSkeleton, CarListingSkeleton };