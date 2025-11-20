'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export default function SurahList() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
          setFilteredSurahs(data.data);
        }
      } catch (error) {
        console.error('Error fetching Surahs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  useEffect(() => {
    const filtered = surahs.filter(
      (surah) =>
        surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.englishNameTranslation
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        surah.number.toString().includes(searchTerm)
    );
    setFilteredSurahs(filtered);
  }, [searchTerm, surahs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-darkSajdah"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search Surah by name or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-darkSajdah/20 focus:border-darkSajdah"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map((surah) => (
          <Link href={`/quran/${surah.number}`} key={surah.number}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-darkSajdah/10 hover:border-darkSajdah/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-darkSajdah/10 text-darkSajdah font-bold w-10 h-10 rounded-full flex items-center justify-center text-sm">
                    {surah.number}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {surah.englishName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {surah.englishNameTranslation}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-amiri text-xl text-darkSajdah">
                    {surah.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {surah.numberOfAyahs} Ayahs
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
