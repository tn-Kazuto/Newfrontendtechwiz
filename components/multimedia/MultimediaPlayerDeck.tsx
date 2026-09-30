'use client';

import React from 'react';
import { MediaItem, MediaType } from '../../data/multimediaData';

interface MultimediaPlayerDeckProps {
  activeMedia: MediaItem;
  isCinemaMode: boolean;
  onSelectChapter?: (seconds: number) => void;
  getFormatLabel: (type: MediaType) => string;
}

export const MultimediaPlayerDeck: React.FC<MultimediaPlayerDeckProps> = ({
  activeMedia,
  isCinemaMode,
  onSelectChapter,
  getFormatLabel,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
      {/* 1. Screen View Area (8 columns) */}
      <div className="lg:col-span-8 relative bg-black flex flex-col justify-center items-center overflow-hidden border-b lg:border-b-0 lg:border-r-2 border-black">
        <div className="relative w-full aspect-video bg-black">
          {activeMedia.embedUrl ? (
            <iframe
              src={activeMedia.embedUrl}
              title={activeMedia.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={activeMedia.thumbnailUrl}
                alt={activeMedia.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  style={{ borderRadius: '0px' }}
                  className="font-mono text-xs font-black text-black border-2 border-black px-6 py-3 bg-[#ffd60a] shadow-[4px_4px_0px_#000000]"
                >
                  [▶ INITIATE PLAYBACK]
                </span>
              </div>
            </div>
          )}

          {/* Watermark & Quality Badges */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none font-mono">
            <span 
              style={{ borderRadius: '0px' }}
              className="px-2.5 py-1 bg-black text-[#ffd60a] border-2 border-black text-[10px] font-black tracking-widest uppercase shadow-[2px_2px_0px_#000]"
            >
              ★ {activeMedia.qualityBadge || '4K ULTRA HD • DOLBY ATMOS'}
            </span>
            <span 
              style={{ borderRadius: '0px' }}
              className="px-2 py-1 bg-[#ff2e93] text-white border-2 border-black text-[10px] font-black tracking-widest uppercase shadow-[2px_2px_0px_#000]"
            >
              {activeMedia.category}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Metadata, Chapter Index & Tags Sidebar (4 columns) */}
      <div 
        className={`lg:col-span-4 flex flex-col font-mono text-xs p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[500px] ${
          isCinemaMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'
        }`}
      >
        {/* Category Header Row */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black">
          <span className="font-mono font-black uppercase tracking-widest text-[11px] text-[#ff2e93] bg-[#fdf2f8] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
            {getFormatLabel(activeMedia.type)}
          </span>
          <span className="font-mono font-black text-[10px] bg-[#fefce8] text-black px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
            RUN: {activeMedia.duration}
          </span>
        </div>

        {/* Title & Artist */}
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold italic leading-snug mb-1">
            {activeMedia.title}
          </h3>
          <p className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
            ARTIST // PRODUCER: {activeMedia.artist}
          </p>
          {activeMedia.agency && (
            <p className="text-[10px] font-semibold text-neutral-500 mt-0.5">
              LABEL // DISTRIBUTOR: {activeMedia.agency}
            </p>
          )}
        </div>

        {/* Description */}
        <p className={`font-serif text-xs leading-relaxed ${
          isCinemaMode ? 'text-neutral-300' : 'text-neutral-700'
        }`}>
          {activeMedia.description}
        </p>

        {/* Chapters / Chronology List */}
        {activeMedia.chapters && activeMedia.chapters.length > 0 && (
          <div className="pt-3 border-t-2 border-black space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest block text-[#ff2e93]">
              TRACK CHRONOLOGY // INDEX:
            </span>
            <div className="space-y-1.5">
              {activeMedia.chapters.map((chap, idx) => (
                <button
                  key={idx}
                  type="button"
                  style={{ borderRadius: '0px' }}
                  className="w-full flex items-center justify-between p-2 border-2 border-black bg-neutral-50 hover:bg-[#ffd60a] text-black hover:text-black transition-all cursor-pointer text-[11px] shadow-[2px_2px_0px_#000] text-left"
                  onClick={() => onSelectChapter && onSelectChapter(chap.seconds)}
                >
                  <span className="font-bold truncate max-w-[80%]">{chap.title}</span>
                  <span className="font-mono text-[10px] ml-2 shrink-0 font-black bg-white px-1.5 py-0.5 border border-black">
                    {chap.time}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags Pills */}
        <div className="pt-3 border-t-2 border-black flex flex-wrap gap-1.5">
          {activeMedia.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{ borderRadius: '0px' }}
              className="px-2 py-0.5 bg-[#fefce8] text-black border border-black text-[9px] uppercase font-mono font-black shadow-[1px_1px_0px_#000]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
