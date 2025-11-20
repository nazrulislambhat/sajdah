'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User as UserIcon, 
  Settings, 
  Info, 
  Shield, 
  Users, 
  LogOut, 
  ChevronRight,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Reuse config (should be in a shared file, but for now duplicating or importing if possible. 
// To be safe and quick, I'll just use the auth instance if I can import it, 
// but `getAuth()` works if app is initialized elsewhere. 
// Actually, `DhikrWidget` initializes it. It's better to have a shared firebase.ts.
// For now, I'll re-initialize to ensure it works standalone.)

const firebaseConfig = {
  apiKey: 'AIzaSyAErADCm3oV3mZft9DlLo69H1kbwUXxuYc',
  authDomain: 'prayertracker-1e48e.firebaseapp.com',
  projectId: 'prayertracker-1e48e',
  storageBucket: 'prayertracker-1e48e.appspot.com',
  messagingSenderId: '1085385987618',
  appId: '1:1085385987618:web:5b51af94a37e6e1bcb1c7b',
  measurementId: 'G-V087D89QKG',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function MorePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', href: '/settings' }, // We might need to create this or just a placeholder
    { icon: Info, label: 'About Sajdah', href: '/about' },
    { icon: Shield, label: 'Privacy Policy', href: '/privacy' },
    { icon: Users, label: 'Community', href: '/community' },
    { icon: Moon, label: 'Daily Hadith', href: '/hadith' }, // Moved here from navbar
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24 font-sans">
      <header className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-gray-900 font-amiri">More</h1>
      </header>

      {/* Profile Section */}
      <Card className="mb-6 border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primarySajdah/10 flex items-center justify-center text-primarySajdah overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-8 w-8" />
            )}
          </div>
          <div className="flex-1">
            {user ? (
              <>
                <h2 className="text-lg font-bold text-gray-900">{user.displayName}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900">Guest User</h2>
                <p className="text-sm text-gray-500">Sign in to sync your data</p>
              </>
            )}
          </div>
        </CardContent>
        <div className="bg-gray-50 p-4 flex justify-center border-t border-gray-100">
           {user ? (
             <Button onClick={signOut} variant="destructive" className="w-full rounded-full bg-redSajdah hover:bg-red-600 text-white">
               <LogOut className="mr-2 h-4 w-4" /> Sign Out
             </Button>
           ) : (
             <Button onClick={signIn} className="w-full rounded-full bg-primarySajdah hover:bg-primarySajdah/90 text-white">
               <UserIcon className="mr-2 h-4 w-4" /> Sign In
             </Button>
           )}
        </div>
      </Card>

      {/* Menu List */}
      <div className="space-y-3">
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white mb-3">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        <p>Sajdah App v1.0.0</p>
        <p>Made with ❤️ for the Ummah</p>
      </div>
    </div>
  );
}
