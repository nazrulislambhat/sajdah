'use client';

import { useState, useEffect } from 'react';
import { Compass, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/useLocation';

export default function QiblaWidget() {
  const { coords, error, loading, requestLocation, permissionStatus } = useLocation();
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);

  // Calculate Qibla direction
  useEffect(() => {
    if (coords) {
      const { latitude, longitude } = coords;
      const kaabaLat = 21.422487;
      const kaabaLng = 39.826206;

      const y = Math.sin(kaabaLng * (Math.PI / 180) - longitude * (Math.PI / 180));
      const x =
        Math.cos(latitude * (Math.PI / 180)) * Math.tan(kaabaLat * (Math.PI / 180)) -
        Math.sin(latitude * (Math.PI / 180)) * Math.cos(kaabaLng * (Math.PI / 180) - longitude * (Math.PI / 180));

      let qibla = Math.atan2(y, x) * (180 / Math.PI);
      qibla = (qibla + 360) % 360;
      setQiblaDirection(qibla);
    }
  }, [coords]);

  // Handle Device Orientation for Compass
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // alpha is the compass direction (0-360)
      // webkitCompassHeading is for iOS
      let heading = 0;
      if ((event as any).webkitCompassHeading) {
        heading = (event as any).webkitCompassHeading;
      } else if (event.alpha) {
        heading = 360 - event.alpha;
      }
      setCompassHeading(heading);
    };

    if (typeof window !== 'undefined') {
        // Check if DeviceOrientationEvent is defined
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }

    return () => {
      if (typeof window !== 'undefined') {
          window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const getRotation = () => {
    if (qiblaDirection === null) return 0;
    // If we have compass heading, we rotate the compass rose so North matches real North
    // Then the Qibla arrow (which is fixed relative to the rose at qiblaDirection) will point correctly?
    // Actually, usually we rotate the whole dial so North is up, and show an arrow.
    // Or we rotate the arrow.
    
    // Let's rotate the arrow to point to Qibla relative to North (0deg).
    // If we have compass heading, we subtract it to make it relative to device.
    return qiblaDirection - compassHeading;
  };

  if (loading) {
    return (
      <Card className="h-full bg-white/50 backdrop-blur-sm border-none shadow-sm">
        <CardContent className="flex items-center justify-center h-full p-6">
           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primarySajdah"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !coords) {
    return (
      <Card className="h-full bg-white/50 backdrop-blur-sm border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-gray-700 flex items-center gap-2">
            <Compass className="h-5 w-5 text-primarySajdah" />
            Qibla
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <p className="text-sm text-gray-500">Enable location to see Qibla direction.</p>
          <Button onClick={requestLocation} size="sm" className="bg-primarySajdah hover:bg-primarySajdah/90 text-white">
            <Navigation className="h-4 w-4 mr-2" />
            Enable Location
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-white/50 backdrop-blur-sm border-none shadow-sm overflow-hidden relative">
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-lg font-bold text-gray-700 flex items-center gap-2">
          <Compass className="h-5 w-5 text-primarySajdah" />
          Qibla
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-4 relative z-10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Compass Rose / Background */}
          <div 
            className="absolute inset-0 border-4 border-gray-200 rounded-full transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${-compassHeading}deg)` }}
          >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-xs font-bold text-gray-400">N</div>
          </div>

          {/* Qibla Arrow */}
          <div 
            className="absolute w-1 h-16 bg-transparent origin-bottom transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${qiblaDirection ? qiblaDirection - compassHeading : 0}deg) translateY(-50%)` }}
          >
             <div className="w-full h-full relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[16px] border-b-primarySajdah"></div>
             </div>
          </div>
          
          {/* Center Dot */}
          <div className="w-2 h-2 bg-gray-800 rounded-full z-20"></div>
        </div>
        
        <div className="mt-4 text-center">
           <p className="text-2xl font-bold text-primarySajdah">{qiblaDirection?.toFixed(0)}°</p>
           <p className="text-xs text-gray-500">from North</p>
        </div>
      </CardContent>
    </Card>
  );
}
