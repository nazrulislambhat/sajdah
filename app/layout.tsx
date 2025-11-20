import type { Metadata } from 'next';
import { Comfortaa, Rubik, Amiri } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SpeedInsights } from '@vercel/speed-insights/next';

const comfortaa = Comfortaa({ subsets: ['latin'] });
const rubik = Rubik({ subsets: ['arabic'] });
const amiri = Amiri({ 
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
export const metadata: Metadata = {
  title: 'Sajdah - Your Personal Deen Companion',
  description:
    'Welcome to the Sajdah App! This app is designed to assist you in various aspects of your daily spiritual practices. Below are the features and functionalities provided by this application',
};
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light max-width bg-background">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          amiri.variable
        )}
      >
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
