import type { Metadata } from 'next';
import { Comfortaa, Rubik } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SpeedInsights } from '@vercel/speed-insights/next';
const comfortaa = Comfortaa({ subsets: ['latin'] });
const rubik = Rubik({ subsets: ['arabic'] });
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
export const metadata: Metadata = {
  title: 'SalahSync - Your Personal Deen Companion',
  description:
    'Welcome to the SalahSync App! This app is designed to assist you in various aspects of your daily spiritual practices. Below are the features and functionalities provided by this application',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light max-width bg-background">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
