'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { INITIAL_MEDIA_ITEMS } from '../data/multimediaData';

export const MultimediaTeaserSection: React.FC = () => {
  // Grab top featured item (NewJeans MV) and 3 highlights
  const featuredItem = INITIAL_MEDIA_ITEMS[0];
  const highlightItems = INITIAL_MEDIA_ITEMS.slice(1, 4);

  return (
    <section 
      id="multimedia-teaser"
      style={{
        paddingTop: '80px',
        paddingBottom: '96px',
      }}
      className="relative w-full pt-20 sm:pt-28 pb-20 sm:pb-28 bg-[#fdfbf7] text-black border-b-4 border-black"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col gap-10 sm:gap-14">
        
        {/* ========================================================= */}
        {/* 1. EDITORIAL SECTION HEADER                               */}
        {/* ========================================================= */}
        <div>
          {/* Eyebrow with Y2K Neo-brutalist Colored Squares */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff2e93] border-2 border-black" />
              <div className="w-12 h-[3px] bg-[#00f0ff]" />
              <div className="w-3 h-3 bg-[#ffd60a] border-2 border-black" />
              <span className="font-mono text-xs font-black uppercase tracking-widest text-neutral-700 ml-2">
                SECTION 04 // AUDIO-VISUAL ARCHIVE &amp; BROADCAST
              </span>
            </div>

            {/* Quick Live Indicators */}
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span 
                style={{ borderRadius: '0px' }}
                className="px-2.5 py-1 bg-[#fefce8] text-black border-2 border-black font-black uppercase shadow-[2px_2px_0px_#000]"
              >
                ★ {INITIAL_MEDIA_ITEMS.length} TITLES
              </span>
              <span 
                style={{ borderRadius: '0px' }}
                className="px-2.5 py-1 bg-[#ecfeff] text-[#0369a1] border-2 border-black font-black uppercase shadow-[2px_2px_0px_#000]"
              >
                ⚡ LOSSLESS 24-BIT
              </span>
            </div>
          </div>

          {/* Section Heading & Subtitle Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b-2 border-black gap-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight">
                Cinematheque &amp;{' '}
                <em className="font-serif italic font-normal text-[#d91470] drop-shadow-[1px_1px_0px_#000000]">
                  Sound Lab
                </em>
              </h2>
              <p className="font-serif text-xs sm:text-sm text-neutral-600 max-w-2xl mt-2 leading-relaxed">
                Official cinematic trailers, lossless 24-bit sound recordings, studio podcasts, and live broadcast feeds from authorized creators.
              </p>
            </div>

            {/* Direct Link to Dedicated Multimedia Page */}
            <Link
              href="/multimedia"
              style={{ borderRadius: '0px' }}
              className="px-5 py-3 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black font-mono text-xs font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#000000] transition-colors shrink-0 inline-flex items-center gap-2"
            >
              <span>[OPEN MULTIMEDIA CENTER]</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. SPOTLIGHT SHOWCASE & HIGHLIGHT GRID                    */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Featured Highlight (7 Cols) */}
          {featuredItem && (
            <div className="lg:col-span-7 flex flex-col">
              <div 
                style={{ borderRadius: '0px' }}
                className="group relative flex-1 bg-white border-3 border-black p-5 flex flex-col justify-between shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ff2e93] transition-all"
              >
                <div>
                  {/* Thumbnail / Screen Poster */}
                  <Link 
                    href={`/multimedia?id=${featuredItem.id}`}
                    className="block relative aspect-video w-full overflow-hidden bg-black border-2 border-black shadow-[2px_2px_0px_#000] mb-4"
                  >
                    <Image 
                      src={featuredItem.thumbnailUrl} 
                      alt={featuredItem.title} 
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 opacity-90 group-hover:opacity-100"
                    />

                    {/* Stickers & Badges */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2 font-mono">
                      <span 
                        style={{ borderRadius: '0px' }}
                        className="px-2.5 py-1 bg-black text-[#ffd60a] border border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]"
                      >
                        ★ FEATURED SPOTLIGHT
                      </span>
                      <span 
                        style={{ borderRadius: '0px' }}
                        className="px-2 py-0.5 bg-[#d91470] text-white border border-black text-[10px] font-black uppercase"
                      >
                        {featuredItem.category}
                      </span>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        style={{ borderRadius: '0px' }}
                        className="w-14 h-14 bg-[#ffd60a] text-black border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] group-hover:scale-110 group-hover:bg-[#ff2e93] group-hover:text-white transition-all text-xl"
                      >
                        ▶
                      </div>
                    </div>

                    {/* Duration badge */}
                    <span 
                      style={{ borderRadius: '0px' }}
                      className="absolute bottom-3 right-3 z-10 px-2 py-0.5 bg-black text-white text-[10px] font-mono font-black border border-black"
                    >
                      {featuredItem.duration}
                    </span>
                  </Link>

                  {/* Metadata */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-black text-[#d91470] uppercase tracking-wider">
                      <span>{featuredItem.artist}</span>
                      <span className="text-black bg-[#fefce8] px-2 py-0.5 border border-black">
                        {featuredItem.agency || 'OFFICIAL RELEASE'}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold italic leading-snug text-black group-hover:text-[#ff2e93] transition-colors">
                      <Link href={`/multimedia?id=${featuredItem.id}`}>
                        {featuredItem.title}
                      </Link>
                    </h3>

                    <p className="font-serif text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {featuredItem.description}
                    </p>
                  </div>
                </div>

                {/* Rating & Launch Action */}
                <div className="pt-4 mt-4 border-t-2 border-black flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-[#d91470]">
                      ★ {featuredItem.rating.average.toFixed(1)} / 5.0
                    </span>
                    <span className="text-neutral-500 font-bold hidden sm:inline">
                      ({featuredItem.rating.count.toLocaleString()} AUDIT LOGS)
                    </span>
                  </div>

                  <Link
                    href={`/multimedia?id=${featuredItem.id}`}
                    style={{ borderRadius: '0px' }}
                    className="px-4 py-2 bg-black text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#ff2e93] transition-colors border-2 border-black"
                  >
                    WATCH NOW ↵
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Highlight Cards (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black font-mono text-xs">
              <span className="font-black uppercase tracking-widest text-[#d91470]">
                TRENDING BROADCASTS // HIGHLIGHTS
              </span>
              <Link href="/multimedia" className="underline hover:text-[#ff2e93] font-bold text-[10px]">
                VIEW ALL (12)
              </Link>
            </div>

            {highlightItems.map((item) => (
              <Link
                key={item.id}
                href={`/multimedia?id=${item.id}`}
                style={{ borderRadius: '0px' }}
                className="group p-3.5 bg-white border-2 border-black flex gap-4 items-center shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#00f0ff] transition-all"
              >
                {/* Thumbnail */}
                <div 
                  style={{ borderRadius: '0px' }}
                  className="relative w-28 sm:w-32 aspect-video bg-black border-2 border-black shrink-0 overflow-hidden shadow-[1px_1px_0px_#000]"
                >
                  <Image 
                    src={item.thumbnailUrl} 
                    alt={item.title} 
                    fill
                    sizes="(max-width: 640px) 112px, 128px"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-200"
                  />
                  <span 
                    style={{ borderRadius: '0px' }}
                    className="absolute bottom-1 right-1 px-1 py-0.2 bg-black text-white text-[9px] font-mono font-bold z-10"
                  >
                    {item.duration}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1 font-mono">
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider">
                    <span className="text-[#d91470] truncate">{item.artist}</span>
                    <span>•</span>
                    <span className="bg-[#fefce8] px-1 border border-black text-black">{item.category}</span>
                  </div>

                  <h4 className="font-sans text-xs font-black text-black truncate group-hover:text-[#0284c7] transition-colors">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
                    <span className="text-[#d91470] font-black">★ {item.rating.average.toFixed(1)}</span>
                    <span className="font-bold">{(item.views / 1000000).toFixed(1)}M VIEWS</span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Fast-Travel Category Chips */}
            <div className="pt-3 border-t-2 border-black font-mono text-[11px] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
                ONLINE CATALOG DIRECTORY:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: '🎬 TRAILERS & MV', href: '/multimedia' },
                  { label: '🎙 PODCAST RADIO', href: '/multimedia' },
                  { label: '🔴 LIVESTREAMS', href: '/multimedia' },
                  { label: '🎵 SOUNDTRACK OST', href: '/multimedia' },
                ].map((cat, idx) => (
                  <Link
                    key={idx}
                    href={cat.href}
                    style={{ borderRadius: '0px' }}
                    className="px-2.5 py-1 bg-white hover:bg-[#ffd60a] text-black border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_#000] transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* 3. FULL-WIDTH CALL TO ACTION DOCK                         */}
        {/* ========================================================= */}
        <div 
          style={{ borderRadius: '0px', marginTop: '28px' }}
          className="mt-6 sm:mt-10 p-6 sm:p-8 bg-[#ffd60a] text-black border-3 border-black shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start font-mono text-[10px]">
              <span 
                style={{ borderRadius: '0px' }}
                className="bg-[#d91470] text-white px-2 py-0.5 border border-black font-black uppercase tracking-widest shadow-[1px_1px_0px_#000]"
              >
                LOSSLESS HUB // 2026 ARCHIVE
              </span>
              <span className="font-black text-black">HANTEO &amp; CIRCLE CERTIFIED</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-black tracking-tight">
              Explore Full Cinematheque &amp; Sound Lab
            </h3>
            <p className="font-sans text-xs sm:text-sm font-semibold text-neutral-800 max-w-2xl leading-relaxed">
              Experience 4K HDR video streaming, 24-bit audiophile Lossless soundstage, real-time teletext chat rooms, and community audit polls.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/multimedia"
              style={{ borderRadius: '0px' }}
              className="px-8 py-4 bg-[#d91470] hover:bg-[#be185d] text-white text-xs sm:text-sm font-mono font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#000000] transition-colors inline-flex items-center gap-3"
            >
              <span>[▶ EXPLORE MULTIMEDIA CENTER]</span>
              <span>→</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
