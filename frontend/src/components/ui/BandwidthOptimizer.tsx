import { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

// Component to handle low bandwidth optimizations
const BandwidthOptimizer = () => {
  const { isOnline, effectiveType } = useNetworkStatus();
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);

  useEffect(() => {
    // Determine if we're on a slow network
    setIsLowBandwidth(effectiveType === 'slow-2g' || effectiveType === '2g');
  }, [effectiveType]);

  return (
    <div className="fixed top-4 right-4 z-50 p-3 bg-background border border-border rounded-lg shadow-lg">
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{isOnline ? 'Online' : 'Offline'}</span>
        {isLowBandwidth && (
          <span className="text-yellow-500">Slow connection detected</span>
        )}
      </div>
    </div>
  );
};

export default BandwidthOptimizer;