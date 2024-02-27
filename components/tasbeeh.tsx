'use client';
import { useState, useEffect, useCallback } from 'react';
import Tasbih from '../public/Tasbih.png';
import Image from 'next/image';
import { motion } from 'framer-motion'; // Import motion from Framer Motion

export default function TasbeehCounter() {
  const [count, setCount] = useState(0);

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }} // Initial animation when component loads
      animate={{ opacity: 1, scale: 1 }} // Animation when component is rendered
      className="min-w-96 w-96 px-48 py-8 flex items-center flex-col justify-center border-2 border-BlueSalahSync rounded"
    >
      <motion.h2
        className="flex items-center flex-col justify-center w-24 min-w-24 text-8xl mb-4 text-BlueSalahSync"
        animate={{ scale: [1, 1.1, 1] }} // Animation on every render
      >
        {count}
      </motion.h2>
      <motion.button
        className="text-6xl border-2 rounded-full p-12 max-h-10 max-w-10 text-LightSalahSync flex items-center flex-col justify-center hover:border-BlueSalahSync bg-SecondarySalahSync hover:bg-YellowSalahSync hover:text-BlueSalahSync transition duration-300 ease-in-out transform hover:scale-105 mb-4"
        onClick={incrementCount}
        whileHover={{ scale: 1.1 }} // Animation on hover
        whileTap={{ scale: 0.9 }} // Animation on tap/click
      >
        +
      </motion.button>
      <button onClick={resetCount}>Reset</button>
    </motion.div>
  );
}
