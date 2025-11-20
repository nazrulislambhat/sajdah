'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

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
  const [timings, setTimings] = useState<PrayerTimesData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Default to Mecca if location denied
          fetchPrayerTimes(21.4225, 39.8262);
        }
      );
    } else {
      fetchPrayerTimes(21.4225, 39.8262);
    }
  }, []);

  const fetchPrayerTimes = async (lat: number, lng: number) => {
    try {
      const date = new Date();
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(
          date.getTime() / 1000
        )}?latitude=${lat}&longitude=${lng}&method=2`
      );
      const data = await response.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        determineNextPrayer(data.data.timings);
      }
    } catch (err) {
      console.error('Error fetching prayer times', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
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
        {nextPrayer && timings[nextPrayer]}
      </div>
      <div className="text-xs text-center text-gray-400">
        {format(new Date(), 'd MMMM yyyy')}
      </div>
    </div>
  );
}
