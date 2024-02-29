'use client';
import Footer from '@/components/footer';
import RamadanModeSwitch from '@/components/ramadanSwitch';
import TasbeehCounter from '@/components/tasbeeh';
import Image from 'next/image';
import Header from '@/components/header';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen boxed bg-LightSalahSync flex flex-col gap-4 xl:gap-8 items-center ">
      <RamadanModeSwitch />
      <TasbeehCounter />
      <Link
        href="/hadith"
        className="border-2 gap-1 flex items-center justify-between border-PrimarySalahSync text-PrimarySalahSync font-bold bg-WhiteSalahSync text-xs px-6 py-3 rounded-md hover:border-WhiteSalahSync hover:bg-PrimarySalahSync transition duration-300 ease-in-out hover:text-WhiteSalahSync hover:border-2"
      >
        Hadith
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6 "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
      </Link>
    </main>
  );
}
