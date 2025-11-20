import HadithDisplay from '@/components/hadith/HadithDisplay';

export default function Hadith() {
  return (
    <main className="min-h-screen bg-Lightsajdah py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-Primarysajdah mb-4">
            Daily Hadith
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gain wisdom and guidance from the sayings of the Prophet Muhammad (peace be upon him).
          </p>
        </div>
        <HadithDisplay />
      </div>
    </main>
  );
}
