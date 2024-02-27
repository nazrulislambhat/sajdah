'use client';
import { useState, useEffect, useCallback } from 'react';
import Tasbih from '../public/Tasbih.png';
import Image from 'next/image';
import { motion } from 'framer-motion'; // Import motion from Framer Motion

export default function TasbeehCounter() {
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState('');

  useEffect(() => {
    const storedCount = localStorage.getItem('tasbeehCount');
    if (storedCount) {
      setCount(parseInt(storedCount, 10));
    }
  }, []);

  useEffect(() => {
    if (count === 33 || count === 66 || count === 100) {
      playSoundAndVibrate();
    }
  }, [count]);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('tasbeehCount', newCount.toString());
  };

  const resetCount = () => {
    setCount(0);
    localStorage.removeItem('tasbeehCount');
  };

  const handleDhikrChange = (event: any) => {
    setSelectedDhikr(event.target.value);
  };

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
      navigator.vibrate([200, 100, 200]); // Vibrate pattern (milliseconds)
    }
  };

  const countVariants = {
    hidden: { opacity: 0, scale: 0.5, rotateY: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }} // Initial animation when component loads
      animate={{ opacity: 1, scale: 1 }} // Animation when component is rendered
      className="min-w-96 w-96 px-48 py-12 flex items-center flex-col justify-center border-2 border-BlueSalahSync rounded"
    >
      <select
        value={selectedDhikr}
        onChange={handleDhikrChange}
        className="mb-4 text-xs bg-transparent py-2 px-2 text-BlueSalahSync border-2 border-BlueSalahSync rounded focus-visible:border-SecondarySalahSync"
      >
        <option value="">Select Dhikr</option>
        <option value="Alhamdulillah - الحمد لله">
          Alhamdulillah - الحمد لله
        </option>
        <option value="Allahu Akbar - الله أكبر">
          Allahu Akbar - الله أكبر
        </option>
        <option value="La aaaaaaaaaasasaasqawqwesasassdfaaaaaaaaa ilaha illallah - لا إله إلا الله">
          La ilaha illallah - لا إله إلا الله
        </option>
        <option value="Astaghfirullah - أستغفر الله">
          Astaghfirullah - أستغفر الله
        </option>
      </select>

      <h2 className="text-2xl min-w-80 w-80 mb-4 text-wrap text-GreenSalahSync break-words">
        {selectedDhikr}
      </h2>
      <motion.h2
        className="flex items-center flex-col justify-center w-24 min-w-24 text-8xl mb-4 text-BlueSalahSync"
        variants={countVariants}
        initial="hidden"
        animate="visible"
        key={count}
      >
        {count}
      </motion.h2>
      <motion.button
        className={`text-6xl border-2 rounded-full p-16 max-h-10 max-w-10 text-LightSalahSync flex items-center flex-col justify-center bg-GreenSalahSync hover:bg-BlueSalahSync hover:text-SkySalahSync transition duration-300 ease-in-out transform hover:scale-105 mb-6 ${
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
        className={`box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-semibold text-LightSalahSync transition-all duration-300 bg-SecondarySalahSync rounded-md cursor-pointer group ring-offset-2 ring-1 ring-PastelRedSalahSync ring-offset-PastelRedSalahSync hover:ring-offset-PastelRedSalahSync ease focus:outline-none${
          !count && 'opacity-50'
        }`}
      >
        <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-LightSalahSync opacity-10 group-hover:translate-x-0"></span>
        <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-LightSalahSync opacity-10 group-hover:translate-x-0"></span>
        <span className="relative z-20 flex items-center text-sm">
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
