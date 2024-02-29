'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
  Button,
} from '@nextui-org/react';

interface Hadith {
  title: string;
  reference: string;
  english: string;
}
import { UNSPLASH_CLIENT_ID } from '../../api';

export default function App() {
  const [imageUrls, setImageUrls] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);
  const [modalPlacement, setModalPlacement] = React.useState('auto');

  useEffect(() => {
    fetchIslamicImages();
    fetchHadiths();
  }, []);

  const fetchIslamicImages = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=islamic&count=99&client_id=${UNSPLASH_CLIENT_ID}`
      );
      const data = await response.json();
      const urls = data.map((item: any) => item.urls.regular);
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

  const shuffleArray = (array: any) => {
    // Shuffling the array using Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledHadiths = shuffleArray(hadiths);

  const handleCardClick = (index: any) => {
    setSelectedHadith(shuffledHadiths[index]);
    onOpen();
  };

  console.log('selectedHadith:', selectedHadith);

  return (
    <div className="border-PrimarySalahSync px-8 py-12 border-2 w-fit xl:w-full bg-WhiteSalahSync rounded-lg flex flex-col items-center justify-center pt-6">
      <h2 className="text-PrimarySalahSync font-bold text-4xl flex flex-col items-center gap-4">
        Daily Hadiths{' '}
        <span className="text-xs text-PrimarySalahSync">
          Click the card to read the full hadith
        </span>
      </h2>
      <div className="gap-4 grid xl:grid-cols-4 sm:grid-cols-4 xl:px-12 xl:pb-12 pt-10">
        {shuffledHadiths
          .slice(0, 16)
          .map(
            (hadith: { title: string; reference: string }, index: number) => (
              <Card
                shadow="lg"
                key={index}
                isPressable
                onPress={() => handleCardClick(index)}
                className="max-w-full min-w-[200px] xl:max-w-[300px] h-full flex flex-col"
              >
                <CardBody className="overflow-visible p-1">
                  <Image
                    shadow="none"
                    radius="none"
                    width="100%"
                    height="100%"
                    alt={hadith.title}
                    className="w-full h-[150px] max-h-[180px] min-h-[150px] object-cover rounded-tr-xl rounded-tl-xl"
                    src={imageUrls[index % imageUrls.length]}
                  />
                </CardBody>
                <CardFooter className="text-small justify-between flex flex-col items-center bg-LightSalahSync p-b-8">
                  <p className="text-xs font-bold py-2 text-TerinarySalahSync">
                    {hadith.title}
                  </p>
                  <p className="text-xs py-2 text-TerinarySalahSync">
                    {hadith.reference}
                  </p>
                </CardFooter>
              </Card>
            )
          )}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="hadith-modal absolute"
      >
        <ModalContent>
          <ModalBody className="bg-LightSalahSync p-4 rounded-xl">
            <p className="text-xs text-PrimarySalahSync p-4">
              {selectedHadith ? selectedHadith.english : ''}
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
