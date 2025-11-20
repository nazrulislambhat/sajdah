'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ScrollText, Heart, Clock, Menu } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Nimaz', href: '/nimaz', icon: Clock },
    { name: 'Quran', href: '/quran', icon: BookOpen },
    { name: 'Dhikr', href: '/dhikr', icon: Heart },
    { name: 'More', href: '/more', icon: Menu },
  ];

  useGSAP(() => {
    // Animate the active tab indicator or icon
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
      gsap.to(activeItem, {
        scale: 1.1,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
      gsap.to('.nav-item:not(.active)', {
        scale: 1,
        duration: 0.3,
      });
    }
  }, { scope: navRef, dependencies: [pathname] });

  return (
    <nav 
      ref={navRef}
      className="bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-full px-6 py-3 flex items-center gap-2 md:gap-6"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className={`nav-item flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 ${isActive ? 'active text-primarySajdah bg-primarySajdah/10' : 'text-gray-500 hover:text-primarySajdah hover:bg-gray-50'}`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
            <span className="sr-only">{item.name}</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1 h-1 bg-primarySajdah rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
