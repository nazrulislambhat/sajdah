import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';

export default function App() {
  const [imageUrls, setImageUrls] = useState([]);
  const [hadiths, setHadiths] = useState([]);

  useEffect(() => {
    fetchIslamicImages();
    fetchHadiths();
  }, []);

  const fetchIslamicImages = async () => {
    try {
      const response = await fetch(
        'https://api.unsplash.com/photos/random?query=islamic&count=8&client_id=UM26ylfxkEFSGouPqOkDSL3eps9NPFHorVByglnKUYI'
      );
      const data = await response.json();
      const urls = data.map((item) => item.urls.regular);
      setImageUrls(urls);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchHadiths = async () => {
    try {
      const response = await fetch('/hadith.json');
      const data = await response.json();
      setHadiths(data);
    } catch (error) {
      console.error('Error fetching hadiths:', error);
    }
  };

  const shuffleArray = (array) => {
    // Shuffling the array using Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledHadiths = shuffleArray(hadiths);

  return (
    <div className="border-PrimarySalahSync border-2 bg-WhiteSalahSync rounded-lg flex flex-col items-center justify-center pt-6">
      <h2 className="text-PrimarySalahSync font-bold text-4xl">
        Daily Hadiths
      </h2>
      <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 px-16 pb-12 pt-10 ">
        {shuffledHadiths.map((hadith, index) => (
          <Card
            shadow="sm"
            key={index}
            isPressable
            onPress={() => console.log('item pressed')}
            className="w-[200px]"
          >
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="none"
                radius="none"
                width="100%"
                alt={hadith.title}
                className="w-full object-cover h-[120px] min-w-[200px] max-w-[200px]"
                src={imageUrls[index % imageUrls.length]}
              />
            </CardBody>
            <CardFooter className="text-small justify-between bg-LightSalahSync">
              <p className="text-xs font-bold py-2 text-TerinarySalahSync">
                {hadith.title}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
