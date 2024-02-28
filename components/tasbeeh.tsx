'use client';
import { useState, useEffect, useCallback } from 'react';
import Tasbih from '../public/Tasbih.png';
import Image from 'next/image';
import { motion } from 'framer-motion'; // Import motion from Framer Motion

interface DhikrCounts {
  [key: string]: number;
}

export default function TasbeehCounter() {
  const [selectedDhikr, setSelectedDhikr] = useState('');
  const [dhikrCounts, setDhikrCounts] = useState({});

  useEffect(() => {
    const storedCountsString = localStorage.getItem('dhikrCounts');
    const storedCounts = storedCountsString
      ? JSON.parse(storedCountsString)
      : {};

    if (storedCounts) {
      setDhikrCounts(storedCounts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dhikrCounts', JSON.stringify(dhikrCounts));
  }, [dhikrCounts]);

  const incrementCount = () => {
    const newCounts: DhikrCounts = { ...dhikrCounts };
    newCounts[selectedDhikr] = (newCounts[selectedDhikr] || 0) + 1;
    setDhikrCounts(newCounts);
  };

  const resetCount = () => {
    const newCounts = { ...dhikrCounts };
    if (selectedDhikr && selectedDhikr in newCounts) {
      delete (newCounts as any)[selectedDhikr];
    }

    setDhikrCounts(newCounts);
  };

  const handleDhikrChange = (event: any) => {
    const selectedValue = event.target.value;
    setSelectedDhikr(selectedValue);
  };

  const count = (dhikrCounts as any)[selectedDhikr] || 0;

  useEffect(() => {
    if (count === 33 || count === 66 || count === 100) {
      playSoundAndVibrate();
    }
  }, [count]);

  const playSoundAndVibrate = () => {
    playSound();
    vibrate();
  };

  const playSound = () => {
    const audio = new Audio('/ding.mp3');
    audio.play();
  };

  const vibrate = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }} // Initial animation when component loads
      animate={{ opacity: 1, scale: 1 }} // Animation when component is rendered
      className="bg-WhiteSalahSync px-8 py-12 relative top-4 flex items-center boxed flex-col justify-center border-2 border-PrimarySalahSync rounded-lg w-fit xl:w-96 "
    >
      <select
        value={selectedDhikr}
        onChange={handleDhikrChange}
        className="mb-4 text-xs bg-transparent py-2 px-2 text-PrimarySalahSync border-2 border-PrimarySalahSync rounded focus-visible:border-SecondarySalahSync"
      >
        <option value="">Select Dhikr</option>
        <option value="Alhamdulillah - اَلْحَمْدُ لِلَّٰهِ">
          Alhamdulillah - اَلْحَمْدُ لِلَّٰهِ
        </option>
        <option value="Allahu Akbar - اللّٰهُ أَكْبَر">
          Allahu Akbar - اللّٰهُ أَكْبَر
        </option>
        <option value="La ilaha illallah - لَا إِلَٰهَ إِلَّا ٱللَّٰهُ">
          La ilaha illallah - لَا إِلَٰهَ إِلَّا ٱللَّٰهُ
        </option>
        <option value="Astaghfirullah - أَسْتَغْفِرُ ٱللّٰهَ">
          Astaghfirullah - أَسْتَغْفِرُ ٱللّٰهَ
        </option>
      </select>

      <h2 className="text-2xl min-w-80 w-80 mb-4 text-wrap text-center text-SecondarySalahSync break-words">
        {selectedDhikr}
      </h2>
      <motion.h2
        className="flex items-center flex-col justify-center w-24 min-w-24 text-8xl mb-4 text-PrimarySalahSync"
        variants={countVariants}
        initial="hidden"
        animate="visible"
        key={count}
      >
        {count}
      </motion.h2>
      <motion.button
        className={`text-6xl rounded-full p-12 max-h-8 max-w-8 text-LightSalahSync flex items-center flex-col justify-center bg-PrimarySalahSync transition duration-300 ease-in-out transform hover:scale-105 mb-6 ${
          !selectedDhikr && 'opacity-50'
        }`}
        onClick={incrementCount}
        whileHover={{ scale: 1.1 }} // Animation on hover
        whileTap={{ scale: 0.7 }} // Animation on tap/click
        disabled={!selectedDhikr}
        style={{ pointerEvents: selectedDhikr ? 'auto' : 'none' }}
      >
        +
      </motion.button>

      <motion.button
        onClick={resetCount}
        whileHover={{ scale: 1.1 }} // Animation on hover
        whileTap={{ scale: 0.7 }} // Animation on tap/click
        style={{ pointerEvents: count ? 'auto' : 'none' }}
        className={`box-border relative z-30 inline-flex items-center justify-center w-auto min-h-10 px-6 py-2 text-xs overflow-hidden font-semibold text-LightSalahSync transition-all duration-300 bg-RedSalahSync rounded-md cursor-pointer group ring-offset-2 ring-1 ring-LightSalahSync ring-offset-LightSalahSync hover:ring-offset-LightSalahSync ease focus:outline-none ${
          !count && 'opacity-50'
        }`}
      >
        <span className="relative z-20 flex items-center text-xs">
          <svg
            className="relative w-5 h-5 mr-2 text-LightSalahSync"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
          Clear
        </span>
      </motion.button>
    </motion.div>
  );
}

const countVariants = {
  hidden: { opacity: 0, scale: 0.5, rotateY: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { duration: 0.5 },
  },
};
