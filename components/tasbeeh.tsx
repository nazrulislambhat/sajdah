'use client';
import { useState, useEffect, useCallback } from 'react';
import Tasbih from '../public/Tasbih.png';
import Image from 'next/image';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import SpeakerIcon from '../public/Speaker.png';
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

  const playSound = useCallback(() => {
    const audio = new Audio('/ding.mp3');
    audio.play();
  }, []);

  const vibrate = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }, []);

  const playSoundAndVibrate = useCallback(() => {
    playSound();
    vibrate();
  }, [playSound, vibrate]);

  useEffect(() => {
    if (count === 33 || count === 66 || count === 100) {
      playSoundAndVibrate();
    }
  }, [count, playSoundAndVibrate]);

  // const readSelectedDhikr = () => {
  //   if ('speechSynthesis' in window) {
  //     const speech = new SpeechSynthesisUtterance(selectedDhikr);
  //     speech.lang = 'ar'; // Set the language to Arabic if needed
  //     speechSynthesis.speak(speech);
  //   } else {
  //     console.log('Text-to-speech not supported');
  //   }
  // };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }} // Initial animation when component loads
      animate={{ opacity: 1, scale: 1 }} // Animation when component is rendered
      className="bg-white relative flex items-center flex-col justify-between shadow-xl rounded-3xl w-full max-w-md overflow-hidden h-[600px]"
    >
      {/* Header Section */}
      <div className="w-full bg-primarySajdah/20 p-6 pb-12 rounded-b-[3rem] flex flex-col items-center relative z-10">
        <div className="w-full flex justify-between items-center mb-4">
             <span className="text-sm font-bold text-primarySajdah">Current Dhikr</span>
             <span className="text-xs text-gray-500 cursor-pointer hover:text-primarySajdah">Change</span>
        </div>
        
        <select
            value={selectedDhikr}
            onChange={handleDhikrChange}
            className="absolute opacity-0 w-full h-10 top-6 cursor-pointer"
        >
            <option value="">Select Dhikr</option>
            <option value="Alhamdulillah">Alhamdulillah</option>
            <option value="Allahu Akbar">Allahu Akbar</option>
            <option value="La Ilaha Illa Allah">La Ilaha Illa Allah</option>
            <option value="Astaghfirullah">Astaghfirullah</option>
        </select>

        <h2 className="text-3xl font-bold text-center text-gray-800 break-words font-amiri mb-2">
            {selectedDhikr || "Select Dhikr"}
        </h2>
        <p className="text-sm text-primarySajdah font-medium">
            &quot;Praise be to Allah&quot;
        </p>
      </div>

      {/* Counter Section */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        {/* Bead String Visualization (Simplified) */}
        <div className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 pointer-events-none opacity-20">
             <svg width="100%" height="100%" viewBox="0 0 400 100">
                 <path d="M0,50 Q200,100 400,50" fill="none" stroke="#35FF69" strokeWidth="2" />
             </svg>
        </div>

        <div className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-8">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        <motion.h2
            className="text-8xl font-bold text-gray-800 mb-8 font-mono"
            variants={countVariants}
            initial="hidden"
            animate="visible"
            key={count}
        >
            {count}
        </motion.h2>
      </div>

      {/* Controls Section */}
      <div className="w-full p-8 pb-12 flex flex-col items-center gap-4">
         <p className="text-xs text-gray-400 mb-2">Tap to count</p>
         
         <motion.button
            className={`w-20 h-20 rounded-full bg-primarySajdah shadow-lg shadow-primarySajdah/30 flex items-center justify-center text-white text-4xl transition-transform ${!selectedDhikr && 'opacity-50 cursor-not-allowed'}`}
            onClick={incrementCount}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!selectedDhikr}
         >
            +
         </motion.button>

         <motion.button
            onClick={resetCount}
            whileTap={{ scale: 0.95 }}
            className="text-xs text-gray-400 hover:text-redSajdah mt-4 flex items-center gap-1"
         >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reset Counter
         </motion.button>
      </div>
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
