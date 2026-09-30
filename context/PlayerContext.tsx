'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Album, Track } from '../types';

interface PlayerContextType {
  currentAlbum: Album | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (album: Album, track?: Track) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  closePlayer: () => void;
  progress: number;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synthesize fun K-pop upbeat synth chimes using Web Audio API
  const playSynthBeats = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Play pleasant musical chord progression
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C - E - G - C
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 0.6);
      });
    } catch {
      // ignore
    }
  };

  const playTrack = (album: Album, track?: Track) => {
    const selectedTrack = track || (album.tracks.length > 0 ? album.tracks[0] : {
      id: 1,
      title: `${album.title} (Official Audio Teaser)`,
      duration: '2:45',
      isTitleTrack: true,
    });
    setCurrentAlbum(album);
    setCurrentTrack(selectedTrack);
    setIsPlaying(true);
    setProgress(15);
    playSynthBeats();
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      setIsPlaying(true);
      playSynthBeats();
    }
  };

  const closePlayer = () => {
    setIsPlaying(false);
    setCurrentAlbum(null);
    setCurrentTrack(null);
    setProgress(0);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentAlbum,
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        togglePlay,
        closePlayer,
        progress,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
