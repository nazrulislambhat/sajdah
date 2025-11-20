import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useLocation } from '@/hooks/useLocation';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export default function PrayerTimesWidget() {
  const { coords, error, loading, requestLocation } = useLocation();
  const [timings, setTimings] = useState<PrayerTimesData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [widgetLoading, setWidgetLoading] = useState(true);

  const fetchPrayerTimes = useCallback(async (lat: number, lng: number) => {
    try {
      const date = new Date();
      // Get school from localStorage or default to 0 (Shafi)
      const school = localStorage.getItem('nimaz_school') || '0';
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(
          date.getTime() / 1000
        )}?latitude=${lat}&longitude=${lng}&method=2&school=${school}`
      );
      const data = await response.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        determineNextPrayer(data.data.timings);
      }
    } catch (err) {
      console.error('Error fetching prayer times', err);
    } finally {
      setWidgetLoading(false);
    }
  }, []);

  useEffect(() => {
    if (coords) {
      fetchPrayerTimes(coords.latitude, coords.longitude);
    } else if (error) {
      setWidgetLoading(false);
    }
  }, [coords, error, fetchPrayerTimes]);

  const determineNextPrayer = (timings: PrayerTimesData) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let next = prayers[0];

    for (const prayer of prayers) {
      const [hours, minutes] = timings[prayer].split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      if (prayerTime > currentTime) {
        next = prayer;
        break;
      }
    }
    setNextPrayer(next);
  };

  const formatTime12h = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (loading || widgetLoading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (!coords) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2">
         <p className="text-xs text-gray-500">Enable location for prayer times</p>
         <Button onClick={requestLocation} size="sm" variant="outline" className="h-8 text-xs">
            <MapPin className="h-3 w-3 mr-1" /> Enable
         </Button>
      </div>
    );
  }

  if (!timings) {
    return <div className="text-sm text-red-500">Unavailable</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Next Prayer:</span>
        <span className="font-bold text-[#1565C0]">{nextPrayer}</span>
      </div>
      <div className="text-2xl font-bold text-center text-gray-800">
        {nextPrayer && formatTime12h(timings[nextPrayer])}
      </div>
      <div className="text-xs text-center text-gray-400">
        {format(new Date(), 'd MMMM yyyy')}
      </div>
    </div>
  );
}
