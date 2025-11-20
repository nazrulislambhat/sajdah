'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/Navbar';
import { cn } from '@/lib/utils';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a simple full-width version during SSR/hydration to avoid mismatch
    return (
      <div className="min-h-screen bg-background">
        {children}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
           <Navbar />
        </div>
      </div>
    );
  }

  // Logic:
  // Mobile devices (< md): Always full screen, native feel.
  // Desktop devices (>= md):
  //    If !isDesktopMode (default): Show Phone Shell.
  //    If isDesktopMode: Show Full Screen.

  const isPhoneView = !isDesktopMode;

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      // On desktop, if phone view, use gray background and center content
      "md:bg-gray-100 md:flex md:items-center md:justify-center",
      isDesktopMode && "md:bg-background md:block"
    )}>
      
      {/* Main Container */}
      <div
        className={cn(
          "w-full h-full transition-all duration-500 ease-in-out bg-background",
          // Phone View Styles (Desktop Only)
          isPhoneView && [
            "md:w-[400px] md:h-[850px] md:max-h-[90vh]",
            "md:rounded-[3rem] md:shadow-2xl md:border-[8px] md:border-gray-900",
            "md:relative md:overflow-hidden"
          ]
        )}
      >
        {/* Notch (Visual only for phone mode on desktop) */}
        <div className={cn(
            "hidden",
            isPhoneView && "md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-[60] pointer-events-none"
        )}></div>

        {/* Content Scroll Area */}
        <div className={cn(
            "h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide pb-24", // pb-24 for navbar space
            isPhoneView && "md:scrollbar-hide"
        )}>
            {children}
        </div>

        {/* Navbar Positioning */}
        <div className={cn(
            "flex justify-center w-full z-50 px-4 pointer-events-none", // pointer-events-none wrapper, enable on child
            // Mobile: Fixed at bottom
            "fixed bottom-6 left-0 right-0",
            // Desktop Phone View: Absolute at bottom of container
            isPhoneView && "md:absolute md:bottom-6 md:left-0 md:right-0"
        )}>
            <div className="pointer-events-auto">
                <Navbar />
            </div>
        </div>
      </div>

      {/* Desktop Toggle Button (Visible only on MD+ screens) */}
      <div className="fixed bottom-8 right-8 hidden md:block z-[100]">
        <Button
          onClick={() => setIsDesktopMode(!isDesktopMode)}
          className="rounded-full h-14 w-14 shadow-xl bg-gray-900 hover:bg-gray-800 text-white border-2 border-white/20"
          size="icon"
          title={isDesktopMode ? "Switch to Mobile View" : "Switch to Desktop View"}
        >
          {isDesktopMode ? <Smartphone className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
}
