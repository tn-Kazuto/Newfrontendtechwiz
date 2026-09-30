'use client';

import React from 'react';
import { MediaItem, MediaType } from '../../data/multimediaData';

interface MultimediaCardGridProps {
  filteredMediaList: MediaItem[];
  activeMediaId: string;
  onSelectMedia: (id: string) => void;
  onResetFilters: () => void;
  getFormatLabel: (type: MediaType) => string;
}

export const MultimediaCardGrid: React.FC<MultimediaCardGridProps> = ({
  filteredMediaList,
  activeMediaId,
  onSelectMedia,
  onResetFilters,
  getFormatLabel,
}) => {
  return (
    <div className="pt-10 sm:pt-14 space-y-10">
      {/* Catalog Header */}
      <div className="flex items-center justify-between font-mono text-xs pb-5 border-b-4 border-black mb-10 sm:mb-12">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-[#ff2e93] border-2 border-black" />
          <span className="w-10 h-[3px] bg-[#00f0ff]" />
          <span className="w-3 h-3 bg-[#ffd60a] border-2 border-black" />
          <span className="font-mono font-black uppercase tracking-widest text-black">
            CATALOG INDEX // {filteredMediaList.length} TITLES
          </span>
        </div>
        <span 
          style={{ borderRadius: '0px' }}
          className="px-3 py-1.5 bg-[#fefce8] text-black border-2 border-black uppercase tracking-wider font-black text-[10px] shadow-[2px_2px_0px_#000]"
        >
          [CLICK ENTRY TO INITIALIZE SCREEN]
        </span>
      </div>

      {filteredMediaList.length === 0 ? (
        /* Empty State */
        <div 
          style={{ borderRadius: '0px' }}
          className="py-16 text-center bg-white border-3 border-black p-8 space-y-4 font-mono shadow-[4px_4px_0px_#000000]"
        >
          <div className="w-12 h-12 mx-auto bg-[#fefce8] border-2 border-black flex items-center justify-center font-bold text-2xl">
            ∅
          </div>
          <h4 className="text-base font-black uppercase">NO ARCHIVE MATCHES YOUR FILTER</h4>
          <p className="text-xs text-neutral-600 font-bold">Reset query parameters to view available broadcasts.</p>
          <button
            type="button"
            onClick={onResetFilters}
            style={{ borderRadius: '0px' }}
            className="px-6 py-2.5 bg-[#ff2e93] hover:bg-[#e11d48] text-white text-xs font-mono font-black uppercase tracking-widest cursor-pointer border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-all"
          >
            [RESET ALL FILTERS]
          </button>
        </div>
      ) : (
        /* Media Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMediaList.map((item) => {
            const isSelected = item.id === activeMediaId;

            return (
              <div
                key={item.id}
                onClick={() => onSelectMedia(item.id)}
                style={{ borderRadius: '0px' }}
                className={`group bg-white border-2 border-black p-4 flex flex-col justify-between cursor-pointer shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#ff2e93] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 ${
                  isSelected
                    ? 'ring-4 ring-[#00f0ff] bg-[#ecfeff]'
                    : 'hover:bg-[#fffdf0]'
                }`}
              >
                <div>
                  {/* Thumbnail Container */}
                  <div 
                    style={{ borderRadius: '0px' }}
                    className="relative aspect-video w-full overflow-hidden bg-neutral-100 mb-3 border-2 border-black shadow-[2px_2px_0px_#000]"
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      loading="lazy"
                    />

                    {/* Format Badge Overlay */}
                    <div className="absolute top-2 left-2 z-10 font-mono">
                      <span 
                        style={{ borderRadius: '0px' }}
                        className="px-2 py-0.5 bg-[#ffd60a] text-black text-[9px] font-mono font-black uppercase tracking-widest border border-black shadow-[1px_1px_0px_#000]"
                      >
                        {getFormatLabel(item.type)}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    <span 
                      style={{ borderRadius: '0px' }}
                      className="absolute bottom-2 right-2 z-10 px-1.5 py-0.5 bg-black text-white text-[10px] font-mono font-bold border border-black"
                    >
                      {item.duration}
                    </span>

                    {/* Active State Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-[#ff2e93] text-white border border-black text-[9px] font-mono font-black uppercase tracking-widest shadow-[1px_1px_0px_#000]">
                        ★ NOW PLAYING
                      </div>
                    )}
                  </div>

                  {/* Card Content Area */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase tracking-widest text-[#ff2e93] mb-1">
                      <span className="truncate max-w-[65%]">{item.artist}</span>
                      <span className="bg-[#fdf2f8] px-1 border border-black text-black">
                        {item.category}
                      </span>
                    </div>

                    <h4 className="font-sans text-sm font-black leading-snug line-clamp-2 text-black group-hover:text-[#ff2e93] transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 mt-3 border-t-2 border-black flex items-center justify-between font-mono text-[11px]">
                  <span className="font-black text-[#ff2e93] flex items-center gap-1">
                    <span>★</span>
                    <span>{item.rating.average.toFixed(1)}</span>
                  </span>
                  <span className="text-black font-black uppercase bg-[#ecfeff] px-1.5 py-0.5 border border-black text-[10px] shadow-[1px_1px_0px_#000]">
                    {(item.views / 1000000).toFixed(1)}M VIEWS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
