'use client';
import Footer from '@/components/footer';
import Image from 'next/image';
import Header from '@/components/header';
import Link from 'next/link';
import Hero from '@/components/hero';
import TasbeehCounter from '@/components/tasbeeh';
import Duas from '@/components/duasCards';
export default function Home() {
  return (
    <main className="min-h-screen boxed bg-LightSalahSync flex flex-col gap-4 xl:gap-8 items-center ">
      <TasbeehCounter />
      <Link href="/tracker" className="text-blue-700 underline">
        Prayer Tracker (v0.1 alpha)
      </Link>
    </main>
  );
}
