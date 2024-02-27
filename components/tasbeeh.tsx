'use client';
import { useState, useEffect, useCallback } from 'react';
import Tasbih from '../public/Tasbih.png';
import Image from 'next/image';

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
    <div className="min-w-96 w-96 px-48 py-8 flex items-center flex-col justify-center border-2 border-BlackSalahSync rounded">
      <h2 className="flex items-center flex-col justify-center w-24 min-w-24 text-8xl mb-4 text-BlueSalahSync">
        {count}
      </h2>
      <button
        className="text-6xl border-2 rounded-full p-12 max-h-10 max-w-10 text-LightSalahSync flex items-center flex-col justify-center hover:border-BlueSalahSync bg-SecondarySalahSync hover:bg-YellowSalahSync hover:text-BlueSalahSync transition duration-300 ease-in-out transform hover:scale-105 mb-4"
        onClick={incrementCount}
      >
        +
      </button>
      <button onClick={resetCount}>Reset</button>
    </div>
  );
}
