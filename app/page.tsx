'use client';
import TasbeehCounter from '@/components/tasbeeh';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen ">
      <div className="bg-PastelGreenSalahSync">
        <h1>Color 12</h1>
        <TasbeehCounter />
      </div>
      
    </main>
  );
}
