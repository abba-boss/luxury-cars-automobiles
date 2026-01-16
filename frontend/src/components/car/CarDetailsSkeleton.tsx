import { motion } from 'framer-motion';

const CarDetailsSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative pt-20 bg-gradient-to-b from-card to-background">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-6">
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="h-4 w-24 bg-gray-700 rounded mb-4 animate-pulse"></div>
              <div className="h-8 w-64 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
              <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* 360 Viewer Skeleton */}
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 pb-16">
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl animate-pulse"></div>
        </div>
      </section>

      {/* Quick Specs Bar Skeleton */}
      <section className="bg-card border-y border-border">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700 animate-pulse"></div>
                <div className="h-3 bg-gray-700 rounded w-16 mx-auto mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-12 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-24">
            {/* Description Skeleton */}
            <section>
              <div className="mb-6">
                <div className="h-6 w-32 bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-0.5 w-1/4 bg-primary rounded animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse"></div>
              </div>
            </section>

            {/* Performance Section Skeleton */}
            <section>
              <div className="mb-10">
                <div className="h-6 w-32 bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-0.5 w-1/4 bg-primary rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-700 animate-pulse"></div>
                    <div className="h-3 bg-gray-700 rounded w-12 mx-auto mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-16 mx-auto animate-pulse"></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Specifications Skeleton */}
            <section>
              <div className="mb-8">
                <div className="h-6 w-40 bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-0.5 w-1/4 bg-primary rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                <div>
                  <div className="h-3 bg-gray-700 rounded w-24 mb-4 animate-pulse"></div>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="py-4 border-b border-border flex justify-between">
                      <div className="h-3 bg-gray-700 rounded w-20 animate-pulse"></div>
                      <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="h-3 bg-gray-700 rounded w-24 mb-4 animate-pulse"></div>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="py-4 border-b border-border flex justify-between">
                      <div className="h-3 bg-gray-700 rounded w-20 animate-pulse"></div>
                      <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Skeleton */}
            <section>
              <div className="mb-8">
                <div className="h-6 w-24 bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-0.5 w-1/4 bg-primary rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg animate-pulse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <div className="h-3 bg-gray-700 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Action Card */}
          <div>
            <div className="sticky top-24 space-y-6">
              {/* Main CTA Card */}
              <div className="bg-card border border-border p-8 rounded-2xl">
                <div className="mb-6">
                  <div className="h-3 bg-gray-700 rounded w-16 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-gray-700 rounded w-32 animate-pulse"></div>
                </div>

                <div className="h-12 w-full bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-10 w-full bg-gray-700 rounded-lg animate-pulse"></div>

                <div className="h-3 bg-gray-700 rounded w-32 mx-auto mt-4 animate-pulse"></div>

                <div className="my-6 h-px bg-border animate-pulse"></div>

                <div className="space-y-3">
                  <div className="h-12 w-full bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Contact Dealer */}
              <div className="bg-card border border-border p-8 rounded-2xl">
                <div className="h-5 bg-gray-700 rounded w-24 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-12 w-full bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Dealer Info */}
              <div className="bg-card border border-border p-8 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-700 rounded w-28 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsSkeleton;