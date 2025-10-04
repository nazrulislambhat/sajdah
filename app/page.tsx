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
    <main className="min-h-screen boxed bg-Lightsajdah flex flex-col gap-4 xl:gap-8 items-center ">
      <TasbeehCounter />
    </main>
  );
}
