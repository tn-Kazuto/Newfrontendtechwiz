'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { usePlayer } from '../context/PlayerContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useDomainTheme } from '../context/DomainContext';
import { filterAlbumsByDomain } from '../utils/domainFilters';
import { mockAlbums } from '../data/mockData';

interface HeroBannerProps {
  embedded?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ embedded = false }) => {
  const { playTrack, currentAlbum, isPlaying } = usePlayer();
  const { addToCart, formatPrice } = useCartWishlist();
  const { currentDomain, activeSubCategory } = useDomainTheme();

  const domainFilteredAlbums = useMemo(() => {
    const filtered = filterAlbumsByDomain(mockAlbums, currentDomain, activeSubCategory);
    return filtered.length >= 2 ? filtered : mockAlbums;
  }, [currentDomain, activeSubCategory]);

  const slides = useMemo(() => {
    return domainFilteredAlbums.slice(0, 5).map((alb) => ({
      album: alb,
      badgeText: alb.tag || 'FEATURED ARCHIVE',
      headline: alb.title,
      subheadline: `${alb.artist.toUpperCase()} // ${alb.type.toUpperCase()}`,
      description: alb.description,
      inclusions: alb.inclusions?.slice(0, 2).join(' • ') || 'Sealed Official Package',
    }));
  }, [domainFilteredAlbums]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reset index when domain/slides change
  useEffect(() => {
    setActiveIndex(0);
  }, [currentDomain, activeSubCategory]);

  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const current = slides[activeIndex] || slides[0];
  const album = current?.album || mockAlbums[0];
  const isThisPlaying = isPlaying && currentAlbum?.id === album.id;

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div
      style={{ borderRadius: '0px' }}
      className="relative w-full overflow-hidden bg-white text-black border-3 border-black shadow-[6px_6px_0px_#000000] flex flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Y2K Header Stripe */}
      <div className="p-3 sm:p-3.5 border-b-2 border-black bg-[#ffd60a] flex items-center justify-between flex-wrap gap-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base text-black">⚡</span>
          <span className="font-black uppercase tracking-wider text-black">
            FEATURED SPOTLIGHT // {current.badgeText}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span 
            style={{ borderRadius: '0px' }}
            className="bg-white border-2 border-black px-2.5 py-0.5 font-black text-[10px] text-black shadow-[1px_1px_0px_#000] uppercase"
          >
            ★ HANTEO &amp; CIRCLE CERTIFIED
          </span>
          <span 
            style={{ borderRadius: '0px' }}
            className="bg-[#00f0ff] border-2 border-black px-2 py-0.5 font-black text-[10px] text-black shadow-[1px_1px_0px_#000] uppercase hidden sm:inline-block"
          >
            100% AUTHENTIC FIRST-PRESS
          </span>
        </div>
      </div>

      {/* 2. Main Spotlight Body */}
      <div className="p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 bg-white">
        {/* Left Side: Typography & Actions */}
        <div className="flex-1 w-full max-w-[660px] flex flex-col items-start justify-center">
          {/* Subheadline Tag */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              style={{ borderRadius: '0px' }}
              className="bg-[#d91470] text-white px-2.5 py-1 text-[11px] font-mono font-black tracking-wider uppercase border-2 border-black shadow-[2px_2px_0px_#000]"
            >
              {current.subheadline}
            </span>
            <span 
              style={{ borderRadius: '0px' }}
              className="bg-[#fefce8] text-black px-2 py-1 text-[10px] font-mono font-black tracking-wider uppercase border-2 border-black"
            >
              YEAR // {album.releaseDate?.split('-')[0] || '2026'}
            </span>
          </div>

          {/* Main Title - Uses proper hierarchy (h3 when embedded under section h2) */}
          {embedded ? (
            <h3 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-black leading-tight uppercase mb-3">
              {current.headline}
            </h3>
          ) : (
            <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-black leading-tight uppercase mb-3">
              {current.headline}
            </h2>
          )}

          {/* Description */}
          <p className="font-sans font-medium text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-lg mb-4 line-clamp-3">
            {current.description || 'Authentic collector publication with complete photobook, exclusive unreleased photocards, and official holographic seal.'}
          </p>

          {/* Inclusions Panel */}
          <div 
            style={{ borderRadius: '0px' }}
            className="w-full bg-[#ecfeff] border-2 border-black p-3 mb-5 font-mono text-xs shadow-[2px_2px_0px_#000]"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-[#d91470] uppercase">INCLUDES //</span>
              <span className="font-bold text-black">{current.inclusions}</span>
            </div>
          </div>

          {/* Price display */}
          <div className="flex items-baseline gap-3 mb-6 font-mono">
            <span className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              {formatPrice(album.priceUSD, album.priceVND)}
            </span>
            {album.originalPriceUSD && (
              <span className="text-sm font-bold text-neutral-500 line-through">
                {formatPrice(album.originalPriceUSD, (album.priceVND || 600000) * 1.2)}
              </span>
            )}
            <span 
              style={{ borderRadius: '0px' }}
              className="bg-[#047857] text-white text-[11px] font-black px-2.5 py-1 uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_#000]"
            >
              OFFICIAL DROP
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-wrap font-mono w-full sm:w-auto">
            <button
              onClick={() => addToCart(album, album.versions[0]?.name)}
              style={{ borderRadius: '0px' }}
              className="flex-1 sm:flex-initial px-6 sm:px-8 py-3.5 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black border-2 border-black text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center cursor-pointer transition-colors duration-100 shadow-[3px_3px_0px_#000]"
              type="button"
            >
              [+ PRE-ORDER]
            </button>

            <button
              onClick={() => playTrack(album)}
              style={{ borderRadius: '0px' }}
              className={`flex-1 sm:flex-initial px-6 sm:px-8 py-3.5 border-2 border-black text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center cursor-pointer transition-colors duration-100 shadow-[3px_3px_0px_#000] ${
                isThisPlaying
                  ? 'bg-[#d91470] text-white font-black'
                  : 'bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-black'
              }`}
              type="button"
            >
              {isThisPlaying ? '[PLAYING //]' : '[PREVIEW AUDIO]'}
            </button>
          </div>

          {/* Carousel Navigation Bar */}
          <div className="flex items-center gap-4 font-mono text-xs pt-2">
            <span 
              style={{ borderRadius: '0px' }}
              className="font-black text-black bg-[#fefce8] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000]"
            >
              0{activeIndex + 1} / 0{slides.length}
            </span>

            <div className="flex items-center gap-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className="p-1.5 -m-1 flex items-center justify-center cursor-pointer min-w-[28px] min-h-[28px]"
                  title={`Slide ${idx + 1}`}
                  aria-label={`Go to slide ${idx + 1}`}
                  type="button"
                >
                  <span
                    style={{ borderRadius: '0px' }}
                    className={`block transition-all border-2 border-black ${
                      activeIndex === idx
                        ? 'w-7 h-3 bg-[#ff2e93] shadow-[1px_1px_0px_#000]'
                        : 'w-3 h-3 bg-white hover:bg-[#ffd60a]'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 ml-2 font-mono">
              <button
                onClick={handlePrev}
                style={{ borderRadius: '0px' }}
                className="w-9 h-9 min-w-[36px] min-h-[36px] bg-white hover:bg-[#ffd60a] text-black border-2 border-black flex items-center justify-center cursor-pointer transition-colors font-black text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                title="Previous Slide"
                aria-label="Previous Slide"
                type="button"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                style={{ borderRadius: '0px' }}
                className="w-9 h-9 min-w-[36px] min-h-[36px] bg-white hover:bg-[#ffd60a] text-black border-2 border-black flex items-center justify-center cursor-pointer transition-colors font-black text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                title="Next Slide"
                aria-label="Next Slide"
                type="button"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Album Cover Showcase */}
        <div className="flex-1 w-full max-w-[340px] sm:max-w-[400px] flex justify-center items-center relative">
          <div 
            style={{ borderRadius: '0px' }}
            className="relative w-full aspect-square border-3 border-black overflow-hidden group bg-neutral-100 shadow-[6px_6px_0px_#000000]"
          >
            <Image
              key={album.id}
              src={album.coverImage}
              alt={album.title}
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute top-3 left-3 z-10">
              <span 
                style={{ borderRadius: '0px' }}
                className="bg-[#d91470] text-white text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000000]"
              >
                ★ SPOTLIGHT // #{activeIndex + 1}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 z-10">
              <span 
                style={{ borderRadius: '0px' }}
                className="bg-[#ffd60a] text-black text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000]"
              >
                {album.type}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
