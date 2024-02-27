'use client';
import Footer from '@/components/footer';
import TasbeehCounter from '@/components/tasbeeh';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen  bg-LightSalahSync ">
      <TasbeehCounter />
      <Footer />
    </main>
  );
}
