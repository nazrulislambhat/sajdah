'use client';
import Footer from '@/components/footer';
import Image from 'next/image';
import Header from '@/components/header';
import Link from 'next/link';
import Hero from '@/components/hero';
import { MacbookScroll } from '@/components/ui/macbook';
export default function Home() {
  return (
    <main className="min-h-screen boxed bg-LightSalahSync flex flex-col gap-4 xl:gap-8 items-center ">
      <MacbookScroll />
    </main>
  );
}
