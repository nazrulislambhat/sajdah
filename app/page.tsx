'use client';
import Footer from '@/components/footer';
import TasbeehCounter from '@/components/tasbeeh';
import Image from 'next/image';
import Header from '@/components/header';

export default function Home() {
  return (
    <main className="min-h-screen boxed bg-LightSalahSync">
      <TasbeehCounter />
      <Footer />
    </main>
  );
}
