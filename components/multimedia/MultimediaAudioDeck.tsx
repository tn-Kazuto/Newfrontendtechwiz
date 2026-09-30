'use client';

import React from 'react';
import { MediaItem } from '../../data/multimediaData';

interface MultimediaAudioDeckProps {
  activeMedia: MediaItem;
  isPlayingAudio: boolean;
  audioProgress: number;
  audioSpeed: number;
  isMuted: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  toggleAudioPlay: () => void;
  handleAudioSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSkipTime: (deltaSeconds: number) => void;
  handleChangePlaybackSpeed: (speed: number) => void;
  toggleMute: () => void;
}

export const MultimediaAudioDeck: React.FC<MultimediaAudioDeckProps> = ({
  activeMedia,
  isPlayingAudio,
  audioProgress,
  audioSpeed,
  isMuted,
  audioRef,
  toggleAudioPlay,
  handleAudioSeek,
  handleSkipTime,
  handleChangePlaybackSpeed,
  toggleMute,
}) => {
  return (
    <div className="relative w-full min-h-[460px] aspect-video bg-neutral-950 flex flex-col items-center justify-center p-6 sm:p-10 overflow-hidden">
      {/* Dynamic Background Noise / Glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ff2e93_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Main Track Presentation */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 max-w-2xl w-full">
        {/* Square Cover Frame with Y2K Neo-brutalist Shadow */}
        <div 
          style={{ borderRadius: '0px' }}
          className="relative w-36 h-36 sm:w-48 sm:h-48 border-3 border-black overflow-hidden shrink-0 bg-black shadow-[6px_6px_0px_#ff2e93]"
        >
          <img
            src={activeMedia.thumbnailUrl}
            alt={activeMedia.title}
            className="w-full h-full object-cover contrast-105"
          />
          <span 
            style={{ borderRadius: '0px' }}
            className="absolute bottom-0 inset-x-0 bg-[#ffd60a] text-black text-center font-mono text-[9px] font-black py-1 uppercase tracking-widest border-t-2 border-black"
          >
            {activeMedia.type === 'podcast' ? '★ AUDIO LOG' : '★ STUDIO LP'}
          </span>
        </div>

        {/* Audio Track Metadata */}
        <div className="flex-1 text-center sm:text-left space-y-2 text-white font-mono">
          <div 
            style={{ borderRadius: '0px' }}
            className="inline-block px-3 py-1 bg-[#ffd60a] text-black border-2 border-black text-[10px] uppercase font-black tracking-wider shadow-[2px_2px_0px_#000000]"
          >
            ★ {activeMedia.qualityBadge || '24-BIT / 96KHZ LOSSLESS'}
          </div>

          <h3 className="font-serif text-xl sm:text-3xl font-normal italic text-white line-clamp-2 drop-shadow-[2px_2px_0px_#000]">
            {activeMedia.title}
          </h3>

          <p className="text-xs uppercase font-black tracking-widest text-[#00f0ff]">
            {activeMedia.artist}
          </p>

          {activeMedia.soundtrackMeta?.albumName && (
            <p className="text-[11px] text-neutral-300 font-bold">
              CATALOG: {activeMedia.soundtrackMeta.albumName} // TRACK #{activeMedia.soundtrackMeta.trackNumber}
            </p>
          )}

          {activeMedia.podcastMeta && (
            <p className="text-[11px] text-[#ffd60a] font-bold">
              HOST: {activeMedia.podcastMeta.host} • S{activeMedia.podcastMeta.season} E{activeMedia.podcastMeta.episode}
            </p>
          )}

          {/* Y2K Pop Rainbow Equalizer Bars */}
          <div className="flex items-center gap-1.5 pt-2 justify-center sm:justify-start">
            {['#ff2e93', '#00f0ff', '#ffd60a', '#a3e635', '#c084fc', '#ff6b4a', '#38bdf8'].map((color, cIdx) => (
              <span 
                key={cIdx}
                style={{
                  backgroundColor: color,
                  height: isPlayingAudio ? `${10 + (cIdx % 4) * 8}px` : '8px',
                  width: '5px',
                  borderRadius: '0px',
                  border: '1px solid #000000',
                  transition: 'height 0.2s ease',
                }}
              />
            ))}
            <span className="text-[10px] font-black text-[#ffd60a] ml-2 uppercase">
              {isPlayingAudio ? '● BROADCASTING LIVE' : '○ DECK STANDBY'}
            </span>
          </div>
        </div>
      </div>

      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={activeMedia.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
        preload="metadata"
      />

      {/* Studio Audio Controls Console */}
      <div 
        style={{ borderRadius: '0px' }}
        className="relative z-10 w-full max-w-2xl mt-8 bg-neutral-900 border-3 border-black p-5 sm:p-6 space-y-4 font-mono text-xs shadow-[6px_6px_0px_#000000]"
      >
        {/* Scrubber Timeline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-[#00f0ff]">
              {audioRef.current?.currentTime
                ? new Date(audioRef.current.currentTime * 1000).toISOString().slice(14, 19)
                : '00:00'}
            </span>
            <span className="text-[#ffd60a] font-black">{activeMedia.duration}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={audioProgress}
            onChange={handleAudioSeek}
            className="w-full h-2 bg-neutral-800 appearance-none cursor-pointer accent-[#ff2e93] border border-black"
          />
        </div>

        {/* Button Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Playback Speed Selectors */}
          <div className="flex items-center gap-1">
            {[0.75, 1, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => handleChangePlaybackSpeed(speed)}
                style={{ borderRadius: '0px' }}
                className={`px-2.5 py-1 text-[10px] font-black transition-all cursor-pointer border-2 border-black ${
                  audioSpeed === speed
                    ? 'bg-[#ff2e93] text-white shadow-[2px_2px_0px_#000]'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-[#00f0ff] hover:text-black'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Main Controls (Skip & Play/Pause) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSkipTime(-10)}
              style={{ borderRadius: '0px' }}
              className="px-3 py-1.5 border-2 border-black bg-[#00f0ff] text-black font-black hover:bg-[#38bdf8] transition-all cursor-pointer text-[10px] shadow-[2px_2px_0px_#000] active:translate-y-0.5"
            >
              [-10S]
            </button>

            <button
              type="button"
              onClick={toggleAudioPlay}
              style={{ borderRadius: '0px' }}
              className="px-6 py-2.5 bg-[#ffd60a] text-black font-black uppercase tracking-wider hover:bg-[#ff2e93] hover:text-white transition-all cursor-pointer text-xs border-2 border-black shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0 active:translate-y-0"
            >
              {isPlayingAudio ? '❚❚ PAUSE' : '▶ PLAY TRACK'}
            </button>

            <button
              type="button"
              onClick={() => handleSkipTime(10)}
              style={{ borderRadius: '0px' }}
              className="px-3 py-1.5 border-2 border-black bg-[#00f0ff] text-black font-black hover:bg-[#38bdf8] transition-all cursor-pointer text-[10px] shadow-[2px_2px_0px_#000] active:translate-y-0.5"
            >
              [+10S]
            </button>
          </div>

          {/* Volume / Mute Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              style={{ borderRadius: '0px' }}
              className="px-3 py-1 border-2 border-neutral-700 text-[10px] font-black text-neutral-300 hover:text-black hover:bg-[#ffd60a] hover:border-black transition-colors cursor-pointer"
            >
              {isMuted ? '🔊 [UNMUTE]' : '🔇 [MUTE]'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
