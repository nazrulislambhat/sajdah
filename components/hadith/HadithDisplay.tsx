'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, BookOpen } from 'lucide-react';

interface Hadith {
  hadithNumber: string;
  englishNarrator: string;
  text: string;
  bookSlug: string;
  volume: string;
  bookName: string;
}

export default function HadithDisplay() {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomHadith = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetching a random hadith from Sahih Bukhari
      // The API structure is a bit complex, so we'll fetch a random number between 1 and 7000 (approx range of Bukhari)
      // Using a more reliable endpoint if possible, or just a random one from a large collection.
      // fawazahmed0/hadith-api on GitHub serves JSON files.
      // Let's try to fetch a specific book's random hadith.
      
      // Strategy: Get a random number and try to fetch it.
      const randomNum = Math.floor(Math.random() * 7000) + 1;
      const response = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari/${randomNum}.json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Hadith');
      }

      const data = await response.json();
      setHadith(data.hadiths[0]);
    } catch (err) {
      console.error('Error fetching Hadith:', err);
      setError('Failed to load a Hadith. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomHadith();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Primarysajdah"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-white shadow-lg border-none">
        <CardHeader className="bg-Primarysajdah/5 border-b border-Primarysajdah/10">
          <CardTitle className="flex items-center gap-2 text-Primarysajdah">
            <BookOpen className="h-5 w-5" />
            <span>Sahih Bukhari</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            hadith && (
              <div className="space-y-6">
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  Hadith #{hadith.hadithNumber}
                </div>
                <blockquote className="text-xl text-gray-800 leading-relaxed font-serif italic border-l-4 border-Primarysajdah pl-4">
                  "{hadith.text}"
                </blockquote>
                {/* Note: The API response structure might vary. Adjusting based on common schema. 
                    The fawazahmed0 API usually returns 'text' for the hadith content.
                */}
                <div className="text-right text-sm text-gray-600 font-medium">
                  — {hadith.englishNarrator || 'Narrated by the Prophet (ﷺ)'}
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={fetchRandomHadith}
          className="bg-Primarysajdah hover:bg-Primarysajdah/90 text-white gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Read Another Hadith
        </Button>
      </div>
    </div>
  );
}
