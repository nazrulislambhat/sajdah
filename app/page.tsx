'use client';
import Footer from '@/components/footer';
import RamadanModeSwitch from '@/components/ramadanSwitch';
import TasbeehCounter from '@/components/tasbeeh';
import Image from 'next/image';
import Header from '@/components/header';

export default function Home() {
  return (
    <main className="min-h-screen boxed bg-LightSalahSync flex flex-col items-center">
      <RamadanModeSwitch />
      <TasbeehCounter />
    </main>
  );
}
