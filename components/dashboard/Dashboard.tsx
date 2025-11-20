'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, Moon, Heart, ScrollText } from 'lucide-react';
import PrayerTimesWidget from '@/components/dashboard/PrayerTimesWidget';
import DhikrWidget from '@/components/dashboard/DhikrWidget';
import QiblaWidget from '@/components/dashboard/QiblaWidget';

gsap.registerPlugin(useGSAP);

export default function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.dashboard-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 font-amiri">Sajdah</h1>
        <p className="text-gray-500">Your Personal Deen Companion</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Prayer Times and Qibla Widgets */}
        <div className="dashboard-card md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prayer Times Widget */}
          <Link href="/nimaz" className="block h-full">
            <Card className="h-full bg-[#E3F2FD] border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock className="w-24 h-24 text-[#1E88E5]" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1565C0]">
                  <Clock className="w-5 h-5" />
                  Prayer Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PrayerTimesWidget />
              </CardContent>
            </Card>
          </Link>

          {/* Qibla Widget */}
          <Link href="/qibla" className="block h-full">
            <Card className="h-full bg-[#F0F4C3] border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ScrollText className="w-24 h-24 text-[#AFB42B]" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#827717]">
                  <ScrollText className="w-5 h-5" />
                  Qibla Direction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QiblaWidget />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quran Widget - Pastel Green */}
        <Link href="/quran" className="dashboard-card block h-full">
          <Card className="h-full bg-[#E8F5E9] border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen className="w-24 h-24 text-[#43A047]" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2E7D32]">
                <BookOpen className="w-5 h-5" />
                Quran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">Read and listen to the Holy Quran with translation.</p>
              <div className="bg-white/50 rounded-lg p-3 text-sm text-gray-600">
                <span className="font-bold">Last Read:</span> Surah Al-Fatiha
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Hadith Widget - Pastel Purple */}
        <Link href="/hadith" className="dashboard-card block h-full">
          <Card className="h-full bg-[#F3E5F5] border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Moon className="w-24 h-24 text-[#8E24AA]" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#6A1B9A]">
                <Moon className="w-5 h-5" />
                Daily Hadith
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 italic">&quot;Actions are judged by intentions...&quot;</p>
              <p className="text-xs text-gray-500 mt-2 text-right">- Sahih Bukhari</p>
            </CardContent>
          </Card>
        </Link>

        {/* Dhikr Widget - Pastel Peach/Orange */}
        <Link href="/dhikr" className="dashboard-card block h-full">
          <Card className="h-full bg-[#FFF3E0] border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Heart className="w-24 h-24 text-[#FB8C00]" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#EF6C00]">
                <Heart className="w-5 h-5" />
                Dhikr Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DhikrWidget />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
