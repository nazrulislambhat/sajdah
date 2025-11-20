'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Since I don't have a Slider component, I'll use a standard input range.

interface StickyAudioPlayerProps {
  src: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onEnded: () => void;
  onNext: () => void;
  onPrev: () => void;
  ayahNumber: number;
  surahName: string;
  translation?: string;
  transliteration?: string;
  onClose?: () => void;
}

export default function StickyAudioPlayer({
  src,
  isPlaying,
  onPlayPause,
  onEnded,
  onNext,
  onPrev,
  ayahNumber,
  surahName,
  onClose,
  translation,
  transliteration
}: StickyAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  return (
    <div className="fixed bottom-24 left-0 right-0 flex justify-center z-50 px-4">
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-3xl w-full max-w-md p-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
        <audio
          ref={audioRef}
          src={src}
          onEnded={onEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />

        {/* Top Row: Info & Close */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 mr-4">
             <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primarySajdah bg-primarySajdah/10 px-2 py-0.5 rounded-full">
                  {surahName}
                </span>
                <span className="text-xs text-gray-400">Ayah {ayahNumber}</span>
             </div>
             
             {/* Translation Display */}
             <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <p className={`text-sm font-medium text-gray-800 leading-snug ${!isExpanded && 'line-clamp-2'}`}>
                  {translation}
                </p>
                {transliteration && (
                  <p className={`text-xs text-gray-500 mt-1 italic ${!isExpanded && 'truncate'}`}>
                    {transliteration}
                  </p>
                )}
             </div>
          </div>
          
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-redSajdah transition-colors p-1">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-gray-500 w-8 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primarySajdah"
          />
          <span className="text-[10px] text-gray-500 w-8">{formatTime(duration)}</span>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Speed Control */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs font-bold text-primarySajdah hover:bg-primarySajdah/10 h-8 px-2 min-w-[3rem]"
            onClick={toggleSpeed}
          >
            {playbackRate}x
          </Button>

          {/* Main Controls */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onPrev} className="hover:text-primarySajdah">
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              size="icon" 
              className="h-10 w-10 rounded-full bg-primarySajdah hover:bg-primarySajdah/90 shadow-md"
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white ml-1" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={onNext} className="hover:text-primarySajdah">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Placeholder for symmetry or extra feature (e.g. repeat) */}
          <div className="w-12"></div> 
        </div>
      </div>
    </div>
  );
}
