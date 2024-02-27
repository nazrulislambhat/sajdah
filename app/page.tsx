'use client';
import TasbeehCounter from '@/components/tasbeeh';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <main className="min-h-screen flex justify-center items-center flex-col bg-LightSalahSync ">
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      <TasbeehCounter />
    </main>
  );
}
