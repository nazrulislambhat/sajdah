'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  src: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onEnded?: () => void;
}

export default function AudioPlayer({ src, isPlaying: externalIsPlaying, onPlayPause, onEnded }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, src]);

  const togglePlay = () => {
    if (onPlayPause) {
      onPlayPause();
    } else {
      // Internal state management fallback
      if (audioRef.current) {
        if (internalIsPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setInternalIsPlaying(!internalIsPlaying);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleEnded = () => {
    if (onEnded) {
      onEnded();
    }
    if (externalIsPlaying === undefined) {
       setInternalIsPlaying(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
      <audio ref={audioRef} src={src} onEnded={handleEnded} />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-primarySajdah/10 text-primarySajdah"
        onClick={togglePlay}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      {/* Volume control can be added if needed, keeping it simple for now */}
    </div>
  );
}
