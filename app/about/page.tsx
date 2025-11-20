'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24 font-sans">
      <header className="mb-6 flex items-center gap-4 pt-4">
        <Link href="/more">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 font-amiri">About Sajdah</h1>
      </header>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-primarySajdah rounded-3xl flex items-center justify-center mb-4 shadow-lg rotate-3">
           <span className="text-4xl font-amiri text-white font-bold">س</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Sajdah</h2>
        <p className="text-gray-500">Version 1.0.0</p>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white mb-6">
        <CardContent className="p-6 space-y-4 text-gray-700 leading-relaxed">
          <p>
            <strong>Sajdah</strong> is your personal Deen companion, designed to help you stay connected with your faith in the modern world.
          </p>
          <p>
            Whether you need accurate prayer times, Qibla direction, or a digital Quran with translations, Sajdah is here to serve your daily spiritual needs.
          </p>
          <p>
            Our mission is to provide a beautiful, distraction-free, and privacy-focused Islamic app for Muslims worldwide.
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-6 text-center">
          <p className="text-gray-900 font-medium mb-2">Developed with <Heart className="inline h-4 w-4 text-red-500 fill-current" /> by</p>
          <p className="text-lg font-bold text-primarySajdah">Nazrul Islam Bhat</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              May Allah accept our efforts and make this app beneficial for the Ummah.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
