'use client';
import Footer from '@/components/footer';
import Image from 'next/image';
import Header from '@/components/header';

import HadithCards from '@/components/hadithCards';
import PrayerTracker from '@/components/PrayerTracker';
export default function Home() {
  return (
    <main className="min-h-screen boxed bg-background flex flex-col gap-4 xl:gap-8 items-center">
      <PrayerTracker />
    </main>
  );
}
