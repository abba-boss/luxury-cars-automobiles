import { motion } from 'framer-motion';

const CarDetailsSkeleton = () => {
  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Hero Section Skeleton */}
      <section className="relative pt-20 bg-gradient-to-b from-card to-background">
        <div className="max-w-full mx-auto px-6 md:px-12 lg:px-24 py-6">
          <div
            className="h-6 w-32 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded"
            style={{
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
        </div>

        <div className="max-w-full mx-auto px-6 md:px-12 lg:px-24 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div
                className="h-4 w-24 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded mb-4"
                style={{
                  animation: 'pulse 1.5s ease-in-out infinite 0.2s',
                }}
              ></div>
              <div
                className="h-8 w-64 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded"
                style={{
                  animation: 'pulse 1.5s ease-in-out infinite 0.4s',
                }}
              ></div>
            </div>
            <div className="flex gap-3">
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-800/30 to-gray-900/20"
                style={{
                  animation: 'pulse 1.5s ease-in-out infinite 0.6s',
                }}
              ></div>
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-800/30 to-gray-900/20"
                style={{
                  animation: 'pulse 1.5s ease-in-out infinite 0.8s',
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* 360 Viewer Skeleton */}
        <div className="max-w-full mx-auto px-6 md:px-12 lg:px-24 pb-16">
          <div
            className="aspect-video bg-gradient-to-br from-gray-800/30 to-gray-900/20 rounded-2xl"
            style={{
              animation: 'pulse 1.5s ease-in-out infinite 1.0s',
            }}
          ></div>
        </div>
      </section>

      {/* Quick Specs Bar Skeleton */}
      <section className="bg-card border-y border-border">
        <div className="max-w-full mx-auto px-6 md:px-12 lg:px-24 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-800/30 to-gray-900/20"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite ' + (1.2 + index * 0.1) + 's',
                  }}
                ></div>
                <div
                  className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-16 mx-auto mb-1"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite ' + (1.4 + index * 0.1) + 's',
                  }}
                ></div>
                <div
                  className="h-4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-12 mx-auto"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite ' + (1.6 + index * 0.1) + 's',
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <div className="max-w-full mx-auto px-6 md:px-12 lg:px-24 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-24">
            {/* Description Skeleton */}
            <section>
              <div className="mb-6">
                <div
                  className="h-6 w-32 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded mb-2"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 1.8s',
                  }}
                ></div>
                <div
                  className="h-0.5 w-1/4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 2.0s',
                  }}
                ></div>
              </div>
              <div className="space-y-3">
                <div
                  className="h-4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-full"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 2.2s',
                  }}
                ></div>
                <div
                  className="h-4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-5/6"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 2.4s',
                  }}
                ></div>
                <div
                  className="h-4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-4/6"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 2.6s',
                  }}
                ></div>
              </div>
            </section>

            {/* Performance Section Skeleton */}
            <section>
              <div className="mb-10">
                <div
                  className="h-6 w-32 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded mb-2"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 2.8s',
                  }}
                ></div>
                <div
                  className="h-0.5 w-1/4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 3.0s',
                  }}
                ></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-gray-800/30 to-gray-900/20"
                      style={{
                        animation: 'pulse 1.5s ease-in-out infinite ' + (3.2 + index * 0.2) + 's',
                      }}
                    ></div>
                    <div
                      className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-12 mx-auto mb-1"
                      style={{
                        animation: 'pulse 1.5s ease-in-out infinite ' + (3.4 + index * 0.2) + 's',
                      }}
                    ></div>
                    <div
                      className="h-4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-16 mx-auto"
                      style={{
                        animation: 'pulse 1.5s ease-in-out infinite ' + (3.6 + index * 0.2) + 's',
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Specifications Skeleton */}
            <section>
              <div className="mb-8">
                <div
                  className="h-6 w-40 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded mb-2"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 4.0s',
                  }}
                ></div>
                <div
                  className="h-0.5 w-1/4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 4.2s',
                  }}
                ></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                <div>
                  <div
                    className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-24 mb-4"
                    style={{
                      animation: 'pulse 1.5s ease-in-out infinite 4.4s',
                    }}
                  ></div>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="py-4 border-b border-border/30 flex justify-between">
                      <div
                        className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-20"
                        style={{
                          animation: 'pulse 1.5s ease-in-out infinite ' + (4.6 + index * 0.2) + 's',
                        }}
                      ></div>
                      <div
                        className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-16"
                        style={{
                          animation: 'pulse 1.5s ease-in-out infinite ' + (4.8 + index * 0.2) + 's',
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div>
                  <div
                    className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-24 mb-4"
                    style={{
                      animation: 'pulse 1.5s ease-in-out infinite 5.0s',
                    }}
                  ></div>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="py-4 border-b border-border/30 flex justify-between">
                      <div
                        className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-20"
                        style={{
                          animation: 'pulse 1.5s ease-in-out infinite ' + (5.2 + index * 0.2) + 's',
                        }}
                      ></div>
                      <div
                        className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-16"
                        style={{
                          animation: 'pulse 1.5s ease-in-out infinite ' + (5.4 + index * 0.2) + 's',
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Skeleton */}
            <section>
              <div className="mb-8">
                <div
                  className="h-6 w-24 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded mb-2"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 5.6s',
                  }}
                ></div>
                <div
                  className="h-0.5 w-1/4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 5.8s',
                  }}
                ></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-card/30 border border-border/30 rounded-lg"
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-800/30 to-gray-900/20"
                      style={{
                        animation: 'pulse 1.5s ease-in-out infinite ' + (6.0 + index * 0.2) + 's',
                      }}
                    ></div>
                    <div
                      className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-24"
                      style={{
                        animation: 'pulse 1.5s ease-in-out infinite ' + (6.2 + index * 0.2) + 's',
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Action Card */}
          <div>
            <div className="sticky top-24 space-y-6">
              {/* Main CTA Card */}
              <div className="bg-card/30 border border-border/30 p-8 rounded-2xl">
                <div className="mb-6">
                  <div
                    className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-16 mb-2"
                    style={{
                      animation: 'pulse 1.5s ease-in-out infinite 6.4s',
                    }}
                  ></div>
                  <div
                    className="h-5 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-32"
                    style={{
                      animation: 'pulse 1.5s ease-in-out infinite 6.6s',
                    }}
                  ></div>
                </div>

                <div
                  className="h-12 w-full bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-lg mb-4"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 6.8s',
                  }}
                ></div>
                <div
                  className="h-10 w-full bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-lg"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 7.0s',
                  }}
                ></div>

                <div
                  className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-32 mx-auto mt-4"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 7.2s',
                  }}
                ></div>

                <div
                  className="my-6 h-px bg-gradient-to-r from-gray-800/30 to-gray-900/20"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 7.4s',
                  }}
                ></div>

                <div className="space-y-3">
                  <div
                    className="h-12 w-full bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-full"
                    style={{
                      animation: 'pulse 1.5s ease-in-out infinite 7.6s',
                    }}
                  ></div>
                  <div
                    className="h-12 w-full bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-full"
                    style={{
                      animation: 'pulse 1.5s ease-in-out infinite 7.8s',
                    }}
                  ></div>
                </div>
              </div>

              {/* Contact Dealer */}
              <div className="bg-card/30 border border-border/30 p-8 rounded-2xl">
                <div
                  className="h-5 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-24 mb-4"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 8.0s',
                  }}
                ></div>
                <div className="space-y-3">
                  <div
                    className="h-12 w-full bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-full"
                    style={{
                      animation: 'pulse 1.5s ease-in-out infinite 8.2s',
                    }}
                  ></div>
                  <div
                    className="h-12 w-full bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-full"
                    style={{
                      animation: 'pulse 1.5s ease-in-out infinite 8.4s',
                    }}
                  ></div>
                </div>
              </div>

              {/* Dealer Info */}
              <div className="bg-card/30 border border-border/30 p-8 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-full"
                    style={{
                      animation: 'pulse 1.5s ease-in-out infinite 8.6s',
                    }}
                  ></div>
                  <div>
                    <div
                      className="h-4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-20 mb-2"
                      style={{
                        animation: 'pulse 1.5s ease-in-out infinite 8.8s',
                      }}
                    ></div>
                    <div
                      className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-28"
                      style={{
                        animation: 'pulse 1.5s ease-in-out infinite 9.0s',
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  className="h-3 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded w-16"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite 9.2s',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarDetailsSkeleton;