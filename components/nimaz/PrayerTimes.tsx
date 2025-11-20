'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar as CalendarIcon } from 'lucide-react';
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

interface PrayerTimingsResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTimesData;
    date: {
      readable: string;
      hijri: {
        date: string;
        day: string;
        month: {
          en: string;
          ar: string;
        };
        year: string;
      };
    };
    meta: {
      timezone: string;
    };
  };
}

export default function PrayerTimes() {
  const [timings, setTimings] = useState<PrayerTimesData | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [hijriDate, setHijriDate] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError('Location access denied. Using default location (Mecca).');
          setLocation({ lat: 21.4225, lng: 39.8262 }); // Default to Mecca
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchPrayerTimes(location.lat, location.lng);
    }
  }, [location]);

  const fetchPrayerTimes = async (lat: number, lng: number) => {
    try {
      const date = new Date();
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(
          date.getTime() / 1000
        )}?latitude=${lat}&longitude=${lng}&method=2`
      );
      const data: PrayerTimingsResponse = await response.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        setHijriDate(
          `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`
        );
        determineNextPrayer(data.data.timings);
      } else {
        setError('Failed to fetch prayer times.');
      }
    } catch (err) {
      setError('An error occurred while fetching prayer times.');
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Primarysajdah"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <Card className="bg-white shadow-lg rounded-2xl overflow-hidden border-none">
        <CardHeader className="bg-Primarysajdah text-white p-6 text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Clock className="h-6 w-6" />
            Prayer Times
          </CardTitle>
          <p className="text-sm opacity-90 mt-2 flex items-center justify-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {format(new Date(), 'EEEE, d MMMM yyyy')}
          </p>
          {hijriDate && <p className="text-xs opacity-75 mt-1">{hijriDate}</p>}
        </CardHeader>
        <CardContent className="p-6">
          {timings && (
            <div className="space-y-4">
              {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(
                (prayer) => (
                  <div
                    key={prayer}
                    className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
                      nextPrayer === prayer
                        ? 'bg-Primarysajdah/10 border-l-4 border-Primarysajdah'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        nextPrayer === prayer
                          ? 'text-Primarysajdah font-bold'
                          : 'text-gray-700'
                      }`}
                    >
                      {prayer}
                    </span>
                    <span className="font-mono text-gray-600">
                      {timings[prayer]}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
        <MapPin className="h-4 w-4" />
        <span>
          {location
            ? `Lat: ${location.lat.toFixed(2)}, Lng: ${location.lng.toFixed(2)}`
            : 'Locating...'}
        </span>
      </div>
    </div>
  );
}
