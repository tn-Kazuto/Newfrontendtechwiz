'use client';

import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, X } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const { currentAlbum, currentTrack, isPlaying, togglePlay, closePlayer, progress } = usePlayer();

  if (!currentAlbum || !currentTrack) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white border shadow-2xl p-3"
      style={{ borderColor: '#d4d4d4', borderRadius: '8px', boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.2)' }}
    >
      <div className="flex items-center gap-3">
        
        {/* Album Cover with animated equalizer */}
        <div 
          className="relative overflow-hidden bg-slate-900 shrink-0 border border-slate-200"
          style={{ width: '48px', height: '48px', borderRadius: '8px' }}
        >
          <img
            src={currentAlbum.coverImage}
            alt={currentAlbum.title}
            className={`w-full h-full object-cover ${isPlaying ? 'scale-105' : 'opacity-80'} transition-all`}
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
              <span className="equalizer-bar" />
              <span className="equalizer-bar" />
              <span className="equalizer-bar" />
              <span className="equalizer-bar" />
            </div>
          )}
        </div>

        {/* Track & Album Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span 
              className="text-[10px] font-bold px-1 rounded uppercase tracking-wider"
              style={{ backgroundColor: '#f4f4f5', color: '#1c1c1c' }}
            >
              Now Playing
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 truncate">
            {currentTrack.title}
          </h4>
          <p className="text-[11px] text-slate-500 truncate">
            {currentAlbum.artist} • {currentAlbum.title}
          </p>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="text-white flex items-center justify-center shadow-xs cursor-pointer shrink-0"
          style={{ backgroundColor: '#000000', borderRadius: '8px', width: '36px', height: '36px' }}
          type="button"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Close Button */}
        <button
          onClick={closePlayer}
          className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 transition-colors cursor-pointer"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: '#000000' }}
        />
      </div>
    </div>
  );
};
