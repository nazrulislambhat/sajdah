// pages/index.js
'use client';
import { useState, useEffect } from 'react';

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
    <div>
      <h1>Tasbeeh Counter</h1>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increase Count</button>
      <button onClick={resetCount}>Reset Count</button>
    </div>
  );
}
