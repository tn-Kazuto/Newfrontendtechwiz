'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockTourEvents } from '../data/mockData';
import { useCartWishlist } from '../context/CartWishlistContext';
import { TourEvent } from '../types';

interface WorldTourShowcaseProps {
  onSelectEvent?: (event: TourEvent) => void;
}

export const WorldTourShowcase: React.FC<WorldTourShowcaseProps> = () => {
  const { formatPrice } = useCartWishlist();
  const [activeCity, setActiveCity] = useState<string>('all');

  // Featured stadium concerts
  const featuredTours = useMemo(() => {
    const ids = ['tour-bp-hanoi', 'tour-bts-wembley', 'tour-atsh-hn', 'tour-conan-m27', 'tour-atvncg-hanoi', 'tour-ive-world'];
    let items = mockTourEvents.filter(e => ids.includes(e.id));
    if (items.length < 3) items = mockTourEvents.slice(0, 4);

    if (activeCity !== 'all') {
      return items.filter(e => e.city.toLowerCase() === activeCity.toLowerCase());
    }
    return items.slice(0, 3);
  }, [activeCity]);

  const cities = [
    { id: 'all', label: 'ALL ARENAS' },
    { id: 'hanoi', label: 'HANOI (MY DINH)' },
    { id: 'london', label: 'LONDON (WEMBLEY)' },
    { id: 'tokyo', label: 'TOKYO (DOME)' },
  ];

  return (
    <section 
      id="tours"
      style={{
        paddingTop: '80px',
        paddingBottom: '96px',
      }}
      className="w-full py-20 md:py-28 bg-white text-black border-b-4 border-black relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b-2 border-black gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-black" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600">
                SECTION 06 // GLOBAL LIVE STAGES &amp; ARENA CALENDAR
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-black leading-tight tracking-tight">
              World Tour &amp;{' '}
              <em className="font-serif italic font-normal text-[#d91470] drop-shadow-[1px_1px_0px_#000000]">
                Stadium Arenas
              </em>
            </h2>
            <p className="font-serif text-xs sm:text-sm text-neutral-600 mt-2 max-w-xl leading-relaxed">
              Official stadium tour passes, soundcheck priority access, and anti-scalp encrypted tickets guaranteed direct from global partner networks.
            </p>
          </div>

          {/* City filter tabs & View All Button (Vibrant Y2K Pop) */}
          <div className="flex items-center gap-3 flex-wrap font-mono text-xs">
            <div className="flex items-center border-2 border-black p-0.5 shadow-[2px_2px_0px_#000000] bg-white">
              {cities.map((c) => {
                const isActive = activeCity === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCity(c.id)}
                    type="button"
                    style={{ borderRadius: '0px' }}
                    className={`px-3.5 py-2 font-black uppercase tracking-wider cursor-pointer transition-all duration-100 ${
                      isActive 
                        ? 'bg-[#d91470] text-white shadow-[2px_2px_0px_#000]' 
                        : 'bg-white text-black hover:bg-[#fefce8]'
                    }`}
                  >
                    {isActive && <span>★ </span>}
                    {c.label}
                  </button>
                );
              })}
            </div>

            <Link
              href="/event"
              style={{ borderRadius: '0px' }}
              className="px-5 py-2.5 bg-[#ffd60a] text-black hover:bg-[#ff2e93] hover:text-white border-2 border-black font-black uppercase tracking-widest transition-colors duration-100 shadow-[3px_3px_0px_#000000]"
            >
              [FULL TOUR SCHEDULE →]
            </Link>
          </div>
        </div>

        {/* 3-Card Stadium Tour Grid (Vibrant Y2K Pop Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTours.map((tour) => {
            return (
              <div
                key={tour.id}
                style={{ borderRadius: '0px' }}
                className="group bg-white border-2 border-black flex flex-col justify-between shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#ff2e93] transition-all duration-100"
              >
                {/* Image Container with Badges */}
                <div>
                  <div 
                    style={{ borderRadius: '0px' }}
                    className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border-b-2 border-black"
                  >
                    <Image
                      src={tour.coverImage || '/banners/banner_stadium_live.webp'}
                      alt={tour.tourTitle || 'World Tour Event'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />

                    {/* Top-Left Category Badge */}
                    <div className="absolute top-3 left-3 z-10 font-mono">
                      <span 
                        style={{ borderRadius: '0px' }}
                        className="px-2.5 py-1 bg-[#d91470] text-white border-2 border-black text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#000]"
                      >
                        ★ {tour.badgeText || tour.category}
                      </span>
                    </div>

                    {/* Top-Right Status Badge */}
                    <div className="absolute top-3 right-3 z-10 font-mono">
                      <span 
                        style={{ borderRadius: '0px' }}
                        className="px-2.5 py-1 bg-[#ffd60a] text-black border-2 border-black text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#000]"
                      >
                        {tour.status === 'Sold Out' ? 'VIP ALLOCATION' : tour.status}
                      </span>
                    </div>

                    {/* Bottom Venue Pin */}
                    <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between font-mono text-[10px] bg-[#00f0ff] text-black px-2.5 py-1 border-2 border-black font-black shadow-[2px_2px_0px_#000]">
                      <span className="truncate max-w-[65%]">
                        LOC // {tour.venue}
                      </span>
                      <span className="uppercase">
                        {tour.city}, {tour.country}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6">
                    {/* Date and Time Line */}
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <span className="font-black uppercase tracking-wider text-[#d91470]">
                        DATE // {tour.date} · {tour.time}
                      </span>
                      <span className="bg-[#fefce8] border border-black px-1.5 py-0.5 font-bold text-black text-[10px]">
                        [GUARANTEED]
                      </span>
                    </div>

                    {/* Tour Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug line-clamp-2 mb-2 text-black">
                      {tour.tourName}
                    </h3>

                    {/* Artist and Description */}
                    <p className="font-serif text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                      {tour.description}
                    </p>

                    {/* Perks preview chips */}
                    {tour.perks && tour.perks.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px]">
                        {tour.perks.slice(0, 2).map((perk, pIdx) => (
                          <span
                            key={pIdx}
                            style={{ borderRadius: '0px' }}
                            className="px-2 py-0.5 border border-black bg-[#ecfeff] text-black font-black uppercase truncate max-w-[200px]"
                          >
                            // {perk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Pricing & Action */}
                <div className="p-6 pt-4 border-t-2 border-black flex items-center justify-between gap-3 font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">
                      PASS FROM
                    </span>
                    <div className="text-lg font-black tracking-tight text-black">
                      {formatPrice(tour.ticketPriceFromUSD, tour.ticketPriceFromVND)}
                    </div>
                  </div>

                  <Link
                    href="/event"
                    style={{ borderRadius: '0px' }}
                    className="px-5 py-2.5 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black border-2 border-black text-xs font-black uppercase tracking-widest transition-colors shadow-[2px_2px_0px_#000000]"
                  >
                    [BOOK PASS →]
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner (Vibrant Y2K Pop 3-Column Protocol) */}
        <div 
          style={{ borderRadius: '0px', marginTop: '48px' }}
          className="mt-12 sm:mt-16 p-8 border-2 border-black bg-[#ecfeff] grid grid-cols-1 md:grid-cols-3 gap-8 text-black font-mono text-xs shadow-[5px_5px_0px_#000000]"
        >
          <div className="space-y-1.5">
            <span className="font-black text-sm block text-[#d91470]">01 // ANTI-SCALPER PROTOCOL</span>
            <p className="text-neutral-700 text-[11px] leading-relaxed font-semibold">
              Encrypted biometric barcode directly bound to verified Global Pass ID to eliminate speculative resale.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-black text-sm block text-[#d91470]">02 // SOUNDCHECK ALLOCATION</span>
            <p className="text-neutral-700 text-[11px] leading-relaxed font-semibold">
              First-entry priority into arena staging areas with official soundcheck rehearsing laminate pass.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-black text-sm block text-[#d91470]">03 // OFFICIAL HAN/CIRCLE COUNT</span>
            <p className="text-neutral-700 text-[11px] leading-relaxed font-semibold">
              Live concert box packages counted 100% directly towards verified Hanteo and Circle Music Charts.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
