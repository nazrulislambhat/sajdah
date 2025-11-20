'use client';

import React from 'react';
import { Settings, Type, Layout, Palette, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// Wait, I don't see slider.tsx in the list. I'll use a standard input range for now or check if I can quickly create one.
// Standard input range is fine for now.

export interface QuranSettingsData {
  layout: 'list' | 'page';
  fontSize: number;
  theme: 'light' | 'sepia' | 'dark';
  showTranslation: boolean;
}

interface QuranSettingsProps {
  settings: QuranSettingsData;
  onSettingsChange: (newSettings: QuranSettingsData) => void;
}

export default function QuranSettings({ settings, onSettingsChange }: QuranSettingsProps) {
  const handleChange = (key: keyof QuranSettingsData, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reading Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Layout */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Layout className="h-4 w-4" /> Layout</Label>
            <div className="flex gap-2">
              <Button 
                variant={settings.layout === 'list' ? 'default' : 'outline'} 
                onClick={() => handleChange('layout', 'list')}
                className="flex-1"
              >
                List (Ayah)
              </Button>
              <Button 
                variant={settings.layout === 'page' ? 'default' : 'outline'} 
                onClick={() => handleChange('layout', 'page')}
                className="flex-1"
              >
                Page (Mushaf)
              </Button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Type className="h-4 w-4" /> Font Size</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm">A</span>
              <input 
                type="range" 
                min="18" 
                max="48" 
                value={settings.fontSize} 
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-Primarysajdah"
              />
              <span className="text-xl font-bold">A</span>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Palette className="h-4 w-4" /> Theme</Label>
            <div className="flex gap-2">
              <button 
                onClick={() => handleChange('theme', 'light')}
                className={`w-8 h-8 rounded-full bg-white border-2 ${settings.theme === 'light' ? 'border-Primarysajdah ring-2 ring-Primarysajdah/30' : 'border-gray-200'}`}
                title="Light"
              />
              <button 
                onClick={() => handleChange('theme', 'sepia')}
                className={`w-8 h-8 rounded-full bg-[#f4ecd8] border-2 ${settings.theme === 'sepia' ? 'border-Primarysajdah ring-2 ring-Primarysajdah/30' : 'border-transparent'}`}
                title="Sepia"
              />
              <button 
                onClick={() => handleChange('theme', 'dark')}
                className={`w-8 h-8 rounded-full bg-[#1a1a1a] border-2 ${settings.theme === 'dark' ? 'border-Primarysajdah ring-2 ring-Primarysajdah/30' : 'border-transparent'}`}
                title="Dark"
              />
            </div>
          </div>

          {/* Translation Toggle */}
          <div className="flex items-center justify-between">
             <Label className="flex items-center gap-2"><Eye className="h-4 w-4" /> Show Translation</Label>
             <input 
                type="checkbox"
                checked={settings.showTranslation}
                onChange={(e) => handleChange('showTranslation', e.target.checked)}
                className="w-5 h-5 accent-Primarysajdah rounded"
             />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
