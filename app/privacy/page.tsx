'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24 font-sans">
      <header className="mb-6 flex items-center gap-4 pt-4">
        <Link href="/more">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 font-amiri">Privacy Policy</h1>
      </header>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4 text-green-600">
             <ShieldCheck className="h-8 w-8" />
             <span className="font-bold text-lg">Your Privacy Matters</span>
          </div>
          <p className="text-gray-700 mb-4">
            At Sajdah, we take your privacy seriously. We believe that your spiritual journey is personal, and your data should remain yours.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 space-y-2">
            <h3 className="font-bold text-gray-900">1. Location Data</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use your location solely to calculate accurate prayer times and Qibla direction. This data is processed locally on your device and is not stored on our servers.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 space-y-2">
            <h3 className="font-bold text-gray-900">2. User Data</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you choose to sign in, we use Firebase Authentication to securely manage your account. Your Dhikr counts and preferences may be synced to the cloud to allow access across devices, but we do not share this data with third parties.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 space-y-2">
            <h3 className="font-bold text-gray-900">3. Local Storage</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use local storage on your device to save your settings (like theme, font size) and offline data. You can clear this data at any time from the Settings page.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 space-y-2">
            <h3 className="font-bold text-gray-900">4. Contact Us</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you have any questions about our privacy practices, please contact us at support@sajdah.app.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
