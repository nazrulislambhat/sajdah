'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import AudioPlayer from '@/components/ui/AudioPlayer';
import StickyAudioPlayer from '@/components/quran/StickyAudioPlayer';
import QuranSettings, { QuranSettingsData } from '@/components/quran/QuranSettings';

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  audio: string;
  translation: string;
  transliteration: string;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export default function SurahDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [surah, setSurah] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAyahIndex, setActiveAyahIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Settings State
  const [settings, setSettings] = useState<QuranSettingsData>({
    layout: 'list',
    fontSize: 32,
    theme: 'light',
    showTranslation: true,
  });

  // Refs for auto-scroll
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load settings from local storage
  useEffect(() => {
    const savedSettings = localStorage.getItem('quran_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to local storage
  const handleSettingsChange = (newSettings: QuranSettingsData) => {
    setSettings(newSettings);
    localStorage.setItem('quran_settings', JSON.stringify(newSettings));
  };

  useEffect(() => {
    const fetchSurah = async () => {
      if (!id) return;
      try {
        // Fetching Arabic text, Audio, Urdu Translation (97), and Transliteration (13)
        // Using api.quran.com v4 is better but requires complex params. 
        // Sticking to alquran.cloud for simplicity if possible, but it separates editions.
        // Let's try to fetch multiple editions and merge them.
        
        // 1. Arabic Text (quran-uthmani)
        const arabicRes = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
        const arabicData = await arabicRes.json();

        // 2. Audio (ar.alafasy)
        const audioRes = await fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`);
        const audioData = await audioRes.json();

        // 3. Urdu Translation (ur.jalandhry - ID might vary, using identifier)
        const urduRes = await fetch(`https://api.alquran.cloud/v1/surah/${id}/ur.jalandhry`);
        const urduData = await urduRes.json();

        // 4. Transliteration (en.transliteration)
        const transRes = await fetch(`https://api.alquran.cloud/v1/surah/${id}/en.transliteration`);
        const transData = await transRes.json();

        if (arabicData.code === 200 && audioData.code === 200 && urduData.code === 200 && transData.code === 200) {
          const mergedAyahs = arabicData.data.ayahs.map((ayah: any, index: number) => ({
            ...ayah,
            audio: audioData.data.ayahs[index].audio,
            translation: urduData.data.ayahs[index].text,
            transliteration: transData.data.ayahs[index].text
          }));

          setSurah({
            ...arabicData.data,
            ayahs: mergedAyahs
          });
        }
      } catch (error) {
        console.error('Error fetching Surah:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [id]);

  // Auto-scroll effect
  useEffect(() => {
    if (activeAyahIndex !== null && ayahRefs.current[activeAyahIndex]) {
      ayahRefs.current[activeAyahIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeAyahIndex]);

  const handlePlayPause = (index: number) => {
    if (activeAyahIndex === index) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveAyahIndex(index);
      setIsPlaying(true);
    }
  };

  const handleAyahEnded = (index: number) => {
    if (surah && index < surah.ayahs.length - 1) {
      setActiveAyahIndex(index + 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-lightSajdah">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-darkSajdah"></div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="flex justify-center items-center h-screen bg-lightSajdah">
        <p>Surah not found.</p>
      </div>
    );
  }

  // Theme Styles
  const themeStyles = {
    light: 'bg-lightSajdah text-gray-900',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]',
    dark: 'bg-[#1a1a1a] text-gray-100',
  };

  const cardThemeStyles = {
    light: 'bg-white border-gray-100',
    sepia: 'bg-[#fdf6e3] border-[#eaddcf]',
    dark: 'bg-[#2a2a2a] border-[#333]',
  };

  return (
    <main className={`min-h-screen py-8 px-4 md:px-8 transition-colors duration-300 ${themeStyles[settings.theme]}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between sticky top-4 z-40 bg-inherit/80 backdrop-blur-sm p-2 rounded-xl">
          <Link href="/quran">
            <Button variant="ghost" className="gap-2 hover:bg-darkSajdah/10">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
             <h1 className="font-amiri text-2xl hidden md:block">{surah.name}</h1>
             <QuranSettings settings={settings} onSettingsChange={handleSettingsChange} />
          </div>
        </div>

        {/* Surah Info Card */}
        <Card className={`mb-8 border-none shadow-lg transition-colors duration-300 rounded-3xl overflow-hidden ${cardThemeStyles[settings.theme]}`}>
          <div className="bg-primarySajdah/10 p-6 flex flex-col items-center justify-center border-b border-primarySajdah/5">
             <h1 className="text-5xl font-bold text-primarySajdah mb-2 font-amiri">
              {surah.name}
            </h1>
            <h2 className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
              {surah.englishName}
            </h2>
            <p className="text-gray-500 text-sm font-medium">{surah.englishNameTranslation}</p>
          </div>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center gap-6 text-sm text-gray-400 font-medium tracking-wide uppercase">
              <span className="bg-gray-100 px-3 py-1 rounded-full">{surah.revelationType}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">{surah.numberOfAyahs} Ayahs</span>
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className={settings.layout === 'page' ? 'bg-transparent pb-24' : 'space-y-6'}>
          
          {/* Page Layout (Mushaf Style) */}
          {settings.layout === 'page' && (
             <div className={`p-8 rounded-3xl shadow-sm leading-[2.5] text-justify ${cardThemeStyles[settings.theme]}`} dir="rtl">
                {surah.ayahs.map((ayah, index) => (
                  <span 
                    key={ayah.number} 
                    ref={(el) => { ayahRefs.current[index] = el as HTMLDivElement }}
                    className={`inline transition-all duration-300 ${activeAyahIndex === index ? 'bg-primarySajdah/20 rounded px-1 box-decoration-clone' : ''}`}
                  >
                    <span 
                      className="font-amiri cursor-pointer hover:text-primarySajdah transition-colors"
                      style={{ fontSize: `${settings.fontSize}px` }}
                      onClick={() => handlePlayPause(index)}
                    >
                      {ayah.text}
                    </span>
                    <span className="relative inline-flex items-center justify-center w-12 h-12 mx-1 align-middle select-none">
                       <span className="text-primarySajdah font-amiri text-5xl leading-none">۝</span>
                       <span className="absolute text-[0.5em] font-bold text-primarySajdah pt-2">{ayah.numberInSurah.toLocaleString('ar-EG')}</span>
                    </span>
                  </span>
                ))}
             </div>
          )}

          {/* Sticky Audio Player for Page Mode */}
          {settings.layout === 'page' && activeAyahIndex !== null && (
            <StickyAudioPlayer
              src={surah.ayahs[activeAyahIndex].audio}
              isPlaying={isPlaying}
              onPlayPause={() => handlePlayPause(activeAyahIndex)}
              onEnded={() => handleAyahEnded(activeAyahIndex)}
              onNext={() => {
                if (activeAyahIndex < surah.ayahs.length - 1) {
                  setActiveAyahIndex(activeAyahIndex + 1);
                  setIsPlaying(true);
                }
              }}
              onPrev={() => {
                if (activeAyahIndex > 0) {
                  setActiveAyahIndex(activeAyahIndex - 1);
                  setIsPlaying(true);
                }
              }}
              ayahNumber={surah.ayahs[activeAyahIndex].numberInSurah}
              surahName={surah.name}
              translation={surah.ayahs[activeAyahIndex].translation}
              transliteration={surah.ayahs[activeAyahIndex].transliteration}
              onClose={() => {
                setIsPlaying(false);
                setActiveAyahIndex(null);
              }}
            />
          )}

          {/* List Layout (Ayah by Ayah) */}
          {settings.layout === 'list' && surah.ayahs.map((ayah, index) => (
            <div key={ayah.number} ref={(el) => { ayahRefs.current[index] = el as HTMLDivElement }}>
              <Card className={`border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden ${cardThemeStyles[settings.theme]} ${activeAyahIndex === index ? 'ring-2 ring-primarySajdah scale-[1.01]' : ''}`}>
                <div className={`px-6 py-4 border-b flex items-center justify-between ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                    <span className="bg-primarySajdah/10 text-primarySajdah text-sm font-bold px-4 py-1.5 rounded-full">
                        {surah.number}:{ayah.numberInSurah}
                    </span>
                    <div className="flex items-center gap-3">
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-full hover:bg-primarySajdah/10 hover:text-primarySajdah"
                            onClick={() => handlePlayPause(index)}
                        >
                            {activeAyahIndex === index && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-8">
                    
                    {/* Arabic Text */}
                    <p 
                      className={`text-right font-amiri leading-[2.5] ${settings.theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`} 
                      dir="rtl"
                      style={{ fontSize: `${settings.fontSize}px` }}
                    >
                      {ayah.text}
                    </p>
                    
                    <div className="space-y-4">
                        {/* Transliteration */}
                        {settings.showTranslation && (
                        <p className="text-primarySajdah font-medium text-sm tracking-wide">
                            {ayah.transliteration}
                        </p>
                        )}

                        {/* Urdu Translation */}
                        {settings.showTranslation && (
                        <p 
                            className={`text-right font-noto-nastaliq text-xl leading-loose ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} 
                            dir="rtl"
                        >
                            {ayah.translation}
                        </p>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Floating Audio Controls for Page Mode? 
            Actually, for Page mode, user clicks text to play. 
            Maybe we need a sticky player at bottom if playing in page mode?
            For now, let's stick to click-to-play. 
            But wait, if auto-play is on, we need to stop it easily.
            The Navbar is there, but maybe a mini-player would be good.
            Let's keep it simple: Clicking the highlighted text toggles play/pause.
        */}
      </div>
    </main>
  );
}
