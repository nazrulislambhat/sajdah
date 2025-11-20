'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar as CalendarIcon, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { useLocation } from '@/hooks/useLocation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { coords, error, loading: locationLoading, requestLocation } = useLocation();
  const [timings, setTimings] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [hijriDate, setHijriDate] = useState<string | null>(null);
  const [school, setSchool] = useState<string>('0'); // 0 = Shafi (Standard), 1 = Hanafi

  useEffect(() => {
    const savedSchool = localStorage.getItem('nimaz_school');
    if (savedSchool) setSchool(savedSchool);
  }, []);

  const fetchPrayerTimes = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const date = new Date();
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(
          date.getTime() / 1000
        )}?latitude=${lat}&longitude=${lng}&method=2&school=${school}`
      );
      const data: PrayerTimingsResponse = await response.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        setHijriDate(
          `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`
        );
        determineNextPrayer(data.data.timings);
      }
    } catch (err) {
      console.error('Error fetching prayer times', err);
    } finally {
      setLoading(false);
    }
  }, [school]);

  useEffect(() => {
    if (coords) {
      fetchPrayerTimes(coords.latitude, coords.longitude);
    } else if (error) {
      setLoading(false);
    }
  }, [coords, error, school, fetchPrayerTimes]);

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

  const handleSchoolChange = (newSchool: string) => {
    setSchool(newSchool);
    localStorage.setItem('nimaz_school', newSchool);
  };

  if (locationLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primarySajdah"></div>
      </div>
    );
  }

  if (!coords) {
    return (
      <div className="w-full max-w-md mx-auto p-4 space-y-6 text-center">
         <Card className="p-8">
            <h2 className="text-xl font-bold mb-4">Enable Location</h2>
            <p className="text-gray-500 mb-6">Please enable location access to see accurate prayer times for your area.</p>
            <Button onClick={requestLocation} className="bg-primarySajdah text-white">
               <MapPin className="mr-2 h-4 w-4" /> Enable Location
            </Button>
         </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <Card className="bg-white shadow-lg rounded-2xl overflow-hidden border-none">
        <CardHeader className="bg-primarySajdah text-white p-6">
          <div className="flex justify-between items-start">
             <div className="text-center w-full">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Clock className="h-6 w-6" />
                    Prayer Times
                </CardTitle>
                <p className="text-sm opacity-90 mt-2 flex items-center justify-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(), 'EEEE, d MMMM yyyy')}
                </p>
                {hijriDate && <p className="text-xs opacity-75 mt-1">{hijriDate}</p>}
             </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 absolute right-4 top-4">
                      <Settings className="h-5 w-5" />
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                   <DropdownMenuLabel>Calculation Method</DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => handleSchoolChange('0')}>
                      Standard (Shafi, Maliki, Hanbali) {school === '0' && '✓'}
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleSchoolChange('1')}>
                      Hanafi {school === '1' && '✓'}
                   </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
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
                        ? 'bg-primarySajdah/10 border-l-4 border-primarySajdah'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        nextPrayer === prayer
                          ? 'text-primarySajdah font-bold'
                          : 'text-gray-700'
                      }`}
                    >
                      {prayer}
                    </span>
                    <span className="font-mono text-gray-600">
                      {formatTime12h(timings[prayer])}
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
           Lat: {coords.latitude.toFixed(2)}, Lng: {coords.longitude.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
