import type { Metadata } from 'next';
import { Comfortaa, Rubik } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const comfortaa = Comfortaa({ subsets: ['latin'] });
const rubik = Rubik({ subsets: ['arabic'] });

export const metadata: Metadata = {
  title: 'SalahSync - Your Personal Deen Companion',
  description:
    'Welcome to the SalahSync App! This app is designed to assist you in various aspects of your daily spiritual practices. Below are the features and functionalities provided by this application',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light max-width bg-background">
      <body className={`${comfortaa.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
