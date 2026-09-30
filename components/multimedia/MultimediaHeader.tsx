'use client';

import React from 'react';

interface MultimediaHeaderProps {
  isCinemaMode: boolean;
  onToggleCinemaMode: () => void;
  totalMediaCount: number;
}

export const MultimediaHeader: React.FC<MultimediaHeaderProps> = ({
  isCinemaMode,
  onToggleCinemaMode,
  totalMediaCount,
}) => {
  return (
    <div 
      className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-2 transition-colors duration-200 ${
        isCinemaMode ? 'border-neutral-800' : 'border-black'
      }`}
    >
      <div>
        {/* Eyebrow Label with Y2K Neo-Brutalist Colored Squares */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-[#ff2e93] border-2 border-black" />
          <div className="w-12 h-[3px] bg-[#00f0ff]" />
          <div className="w-3 h-3 bg-[#ffd60a] border-2 border-black" />
          <span 
            className={`font-mono text-xs font-bold uppercase tracking-widest ml-2 ${
              isCinemaMode ? 'text-neutral-400' : 'text-neutral-700'
            }`}
          >
            SECTION 04 // AUDIO-VISUAL ARCHIVE &amp; BROADCAST
          </span>
        </div>

        {/* Section Heading with Playfair Display & Hot Pink Accent */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight">
          Cinematheque &amp;{' '}
          <em className="font-serif italic font-normal text-[#ff2e93] drop-shadow-[1px_1px_0px_#000000]">
            Sound Lab
          </em>
        </h2>

        {/* Subtitle / Description */}
        <p 
          className={`font-serif text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed ${
            isCinemaMode ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          Official cinematic trailers, lossless 24-bit sound recordings, studio podcasts, and live broadcast feeds from authorized creators.
        </p>

        {/* Y2K Quick Feature Metric Badges */}
        <div className="flex items-center gap-2 mt-4 flex-wrap font-mono text-[10px]">
          <span 
            style={{ borderRadius: '0px' }}
            className={`px-2.5 py-1 border-2 font-black uppercase tracking-wider ${
              isCinemaMode 
                ? 'bg-neutral-900 text-[#ffd60a] border-[#ffd60a]' 
                : 'bg-[#fefce8] text-black border-black shadow-[2px_2px_0px_#000000]'
            }`}
          >
            ★ {totalMediaCount} TITLES ARCHIVED
          </span>
          <span 
            style={{ borderRadius: '0px' }}
            className={`px-2.5 py-1 border-2 font-black uppercase tracking-wider ${
              isCinemaMode 
                ? 'bg-neutral-900 text-[#00f0ff] border-[#00f0ff]' 
                : 'bg-[#ecfeff] text-[#0284c7] border-black shadow-[2px_2px_0px_#000000]'
            }`}
          >
            ⚡ 24-BIT / 96KHZ MASTER AUDIO
          </span>
          <span 
            style={{ borderRadius: '0px' }}
            className={`px-2.5 py-1 border-2 font-black uppercase tracking-wider ${
              isCinemaMode 
                ? 'bg-neutral-900 text-[#ff2e93] border-[#ff2e93]' 
                : 'bg-[#fdf2f8] text-[#ff2e93] border-black shadow-[2px_2px_0px_#000000]'
            }`}
          >
            ● REALTIME SYNC TELETEXT
          </span>
        </div>
      </div>

      {/* Mode Switcher / Cinema Toggle */}
      <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
        <button
          onClick={onToggleCinemaMode}
          type="button"
          style={{ borderRadius: '0px' }}
          className={`px-5 py-3 font-mono text-xs font-black uppercase tracking-widest cursor-pointer transition-all border-2 ${
            isCinemaMode
              ? 'bg-[#00f0ff] text-black border-black shadow-[3px_3px_0px_#ffffff] hover:bg-[#38bdf8]'
              : 'bg-[#ffd60a] text-black border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#ff2e93] hover:text-white hover:translate-x-[-1px] hover:translate-y-[-1px]'
          }`}
          title="Toggle Cinema Mode Lighting"
        >
          {isCinemaMode ? '[☀ LIGHTS ON // DAY MODE]' : '[☾ CINEMA MODE // LIGHTS OFF]'}
        </button>
      </div>
    </div>
  );
};
