'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch'; // Assuming we have a Switch component or need to make one. I'll use a simple button toggle if not.
import { Bell, MapPin, Moon, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Simple Switch Component if not available in UI library yet
const SimpleSwitch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) => (
  <button
    onClick={() => onCheckedChange(!checked)}
    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${checked ? 'bg-primarySajdah' : 'bg-gray-300'}`}
  >
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load settings from local storage
  useEffect(() => {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setNotifications(parsed.notifications ?? true);
      setLocation(parsed.location ?? true);
      setDarkMode(parsed.darkMode ?? false);
    }
  }, []);

  // Save settings
  const saveSettings = (key: string, value: boolean) => {
    const newSettings = {
      notifications: key === 'notifications' ? value : notifications,
      location: key === 'location' ? value : location,
      darkMode: key === 'darkMode' ? value : darkMode,
    };
    localStorage.setItem('app_settings', JSON.stringify(newSettings));
    
    if (key === 'notifications') setNotifications(value);
    if (key === 'location') setLocation(value);
    if (key === 'darkMode') setDarkMode(value);
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.clear();
      alert('Data cleared. The app will reload.');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24 font-sans">
      <header className="mb-6 flex items-center gap-4 pt-4">
        <Link href="/more">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 font-amiri">Settings</h1>
      </header>

      <div className="space-y-6">
        {/* General Settings */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">General</h2>
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-0">
              
              {/* Notifications */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-xs text-gray-500">Prayer times & reminders</p>
                  </div>
                </div>
                <SimpleSwitch checked={notifications} onCheckedChange={(c) => saveSettings('notifications', c)} />
              </div>

              {/* Location */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Location Services</p>
                    <p className="text-xs text-gray-500">For Qibla & Prayer Times</p>
                  </div>
                </div>
                <SimpleSwitch checked={location} onCheckedChange={(c) => saveSettings('location', c)} />
              </div>

              {/* Appearance */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dark Mode</p>
                    <p className="text-xs text-gray-500">Adjust app appearance</p>
                  </div>
                </div>
                <SimpleSwitch checked={darkMode} onCheckedChange={(c) => saveSettings('darkMode', c)} />
              </div>

            </CardContent>
          </Card>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Data & Storage</h2>
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-0">
              <button onClick={clearData} className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Clear Local Data</p>
                    <p className="text-xs text-red-400">Reset all app data on this device</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-red-300" />
              </button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
