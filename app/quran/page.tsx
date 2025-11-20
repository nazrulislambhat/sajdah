import SurahList from '@/components/quran/SurahList';

export default function Quran() {
  return (
    <main className="min-h-screen bg-lightSajdah py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-primarySajdah mb-8">
          The Noble Quran
        </h1>
        <SurahList />
      </div>
    </main>
  );
}
