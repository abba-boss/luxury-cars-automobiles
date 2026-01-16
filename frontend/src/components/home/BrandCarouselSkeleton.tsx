import { motion } from 'framer-motion';

const BrandCarouselSkeleton = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-800 mb-4 opacity-50">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded w-48 mx-auto mb-3 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded w-64 mx-auto animate-pulse"></div>
        </div>

        {/* Carousel Skeleton */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-[0_0_auto] px-2"
                  style={{
                    minWidth: '150px',
                    maxWidth: '170px'
                  }}
                >
                  <div className="relative group cursor-pointer overflow-hidden rounded-2xl h-36 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex flex-col items-center justify-center animate-pulse">
                    {/* Brand Image Placeholder */}
                    <div className="flex items-center justify-center w-full h-14 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                    </div>
                    
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons Skeleton */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-30 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full p-2.5 opacity-50">
            <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
          </div>

          <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-30 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full p-2.5 opacity-50">
            <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Dots Indicator Skeleton */}
        <div className="hidden md:flex justify-center mt-8 space-x-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-700 animate-pulse"
            />
          ))}
        </div>

        {/* View All Button Skeleton */}
        <div className="text-center mt-10">
          <div className="relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 animate-pulse">
            <span className="font-medium">View All Brands</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarouselSkeleton;