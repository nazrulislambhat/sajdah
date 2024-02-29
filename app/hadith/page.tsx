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

import Link from 'next/link';
interface Hadith {
  title: string;
  reference: string;
  english: string;
}
import { UNSPLASH_CLIENT_ID } from '@/config/unsplash';

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
    <div className="border-PrimarySalahSync px-8 py-12 border-2 h-fit w-fit xl:w-full bg-WhiteSalahSync rounded-lg flex flex-col items-center justify-center pt-6">
      <h2 className="text-PrimarySalahSync font-bold text-4xl flex flex-col items-center gap-4">
        Daily Hadiths{' '}
        <span className="text-xs text-PrimarySalahSync">
          Click the card to read the full hadith
        </span>
      </h2>
      <Link
        href="/"
        className="border-2 gap-1 flex items-center justify-between border-PrimarySalahSync text-PrimarySalahSync font-bold bg-LightSalahSync text-xs px-6 py-3 rounded-md hover:border-LightSalahSync hover:bg-PrimarySalahSync transition duration-300 ease-in-out hover:text-LightSalahSync hover:border-2 my-4"
      >
        Home
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </Link>
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
                className="max-w-full min-w-[200px] xl:max-w-[300px] h-fit flex flex-col hover:scale-105"
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
                  <p className="text-xs font-bold py-2 text-TertiarySalahSync">
                    {hadith.title}
                  </p>
                  <p className="text-xs py-2 text-TertiarySalahSync">
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
            <p className="text-xs text-TertiarySalahSync p-4">
              {selectedHadith ? selectedHadith.english : ''}
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
