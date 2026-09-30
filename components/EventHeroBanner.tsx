'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { TourEvent, FandomCategoryKey } from '../types';
import { mockTourEvents } from '../data/mockData';
import { useCartWishlist } from '../context/CartWishlistContext';
import { getActiveFandomTheme } from '../utils/fandomTheme';

export type HeroBannerCategory = FandomCategoryKey | 'all';

export interface EventHeroBannerProps {
  onSelectEvent?: (event: TourEvent) => void;
  activeCategory?: HeroBannerCategory;
  onSelectCategory?: (category: HeroBannerCategory) => void;
}

export interface GraphicBannerSlide {
  id: string;
  category: HeroBannerCategory;
  categoryLabel: string;
  heroWord: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  badge: string;
  dateText: string;
  locationText: string;
  priceText: string;
  ctaText: string;
  secondaryCtaText: string;
  targetAnchor: string;
  eventRefId?: string;
}

export const EventHeroBanner: React.FC<EventHeroBannerProps> = ({
  onSelectEvent,
  activeCategory: propActiveCategory,
  onSelectCategory,
}) => {
  const { formatPrice } = useCartWishlist();
  const [internalCategory, setInternalCategory] = useState<HeroBannerCategory>(() => {
    const th = getActiveFandomTheme();
    if (th === 'manga') return 'Manga';
    if (th === 'anime') return 'Anime';
    if (th === 'comics') return 'Comics';
    if (th === 'gaming') return 'Gaming';
    if (th === 'cinema') return 'Movies';
    if (th === 'tv') return 'TV Shows';
    return 'all';
  });

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e?.detail?.category) {
        setInternalCategory(e.detail.category);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('fandom-theme-change', handleThemeChange);
      return () => window.removeEventListener('fandom-theme-change', handleThemeChange);
    }
  }, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentCategory = propActiveCategory !== undefined ? propActiveCategory : internalCategory;
  const isGaming = currentCategory === 'Gaming';
  const isAnime = currentCategory === 'Anime';
  const isComics = currentCategory === 'Comics';
  const isCinema = currentCategory === 'Movies';
  const isTvShows = currentCategory === 'TV Shows';

  // 9 Masterpiece Graphic Banners - Minimalist Monochrome with Oversized Typography & Local Fast WebP Assets
  const BANNER_SLIDES: GraphicBannerSlide[] = [
    {
      id: 'slide-stadium-live',
      category: 'all',
      categoryLabel: 'All Fandoms',
      heroWord: 'STADIUM',
      title: 'Say Hi All-Stars Live Stadium Tour',
      subtitle: 'Monumental 30,000-seat stadium concert with pyrotechnics, laser displays & 100% verified soundcheck passes.',
      tag: 'STADIUM TOUR // LIVE ARENA',
      image: '/banners/banner_stadium_live.webp',
      badge: 'OFFICIAL STADIUM PASS',
      dateText: 'DECEMBER 07 - 09, 2026',
      locationText: 'National Stadium, Hanoi',
      priceText: 'From $32.00',
      ctaText: 'Get Official Tickets',
      secondaryCtaText: 'Explore Stadium Passes',
      targetAnchor: 'tours',
      eventRefId: 'tour-atsh-hn',
    },
    {
      id: 'slide-pixel-game',
      category: 'K-Pop',
      categoryLabel: 'K-Pop',
      heroWord: 'EDITION',
      title: 'ACT:TOMORROW in Tokyo • Game Start',
      subtitle: 'Y2K collector edition pass. Tokyo Dome 55,000 fan support stage with unreleased hologram photocards.',
      tag: 'COLLECTOR EDITION // TOKYO DOME',
      image: '/banners/banner_pixel_game.webp',
      badge: 'TOKYO DOME 2026',
      dateText: 'JANUARY 21 & 22, 2026',
      locationText: 'Tokyo Dome, Japan',
      priceText: 'Official Kit $42.00',
      ctaText: 'Claim Stage Pass',
      secondaryCtaText: 'View Album Drops',
      targetAnchor: 'upcoming-releases',
      eventRefId: 'tour-bts-wembley',
    },
    {
      id: 'slide-graffiti-hud',
      category: 'Gaming',
      categoryLabel: 'Gaming Arena',
      heroWord: 'ARCHIVE',
      title: 'Monochrome Arena // High-Contrast Audio & Editorial Vinyl',
      subtitle: 'Austere high-fidelity sound laboratory, architectural precision, editorial monograph releases & limited black vinyl boxsets.',
      tag: 'EDITORIAL MONOGRAPH // SOUND LAB',
      image: '/banners/banner_graffiti_hud.webp',
      badge: 'MONOCHROME VAULT',
      dateText: 'SEASON 2026 GLOBAL',
      locationText: 'Makuhari Messe & Tokyo Arena',
      priceText: 'Vinyl Boxset $48.00',
      ctaText: 'Explore Archive',
      secondaryCtaText: 'Browse Catalog',
      targetAnchor: 'albums',
      eventRefId: 'tour-bp-hanoi',
    },
    {
      id: 'slide-manga-tankobon',
      category: 'Manga',
      categoryLabel: 'Manga & Tankōbon Vault',
      heroWord: 'MANGA',
      title: 'TOKYO TANKŌBON ARCHIVE • Weekly Shonen Jump & Kodansha',
      subtitle: 'Authentic Japanese tankōbon releases, mangaka G-Pen manuscripts, screen-tone artwork & limited collector prints.',
      tag: 'MANGA ARCHIVE // TANKŌBON EDITION',
      image: '/banners/banner_doodle_blue.webp',
      badge: 'OFFICIAL MANGA VAULT',
      dateText: 'TANKŌBON 2026',
      locationText: 'Jimbocho & Akihabara, Tokyo, Japan',
      priceText: 'Tankōbon from $11.99',
      ctaText: 'Browse Manga Catalog',
      secondaryCtaText: 'Explore Mangaka Studio',
      targetAnchor: 'manga-catalog',
      eventRefId: 'tour-atvncg-hanoi',
    },
    {
      id: 'slide-monochrome-king',
      category: 'Cosplay',
      categoryLabel: 'Bauhaus & Cosplay Atelier',
      heroWord: 'BAUHAUS',
      title: 'Constructivist Modernism: Living Geometry Cosplay Expo 2026',
      subtitle: 'Form follows function — primary red, blue & yellow, stark black geometries and living architectural costume drops.',
      tag: 'BAUHAUS ATELIER // 2026',
      image: '/banners/banner_monochrome_king.webp',
      badge: 'BAUHAUS EXPO DROP',
      dateText: 'SPRING EXHIBIT 2026',
      locationText: 'Dessau Bauhaus & Berlin Modernist Hall',
      priceText: 'Atelier Pass $48.00',
      ctaText: 'Explore Bauhaus Atelier',
      secondaryCtaText: 'View Geometric Drops',
      targetAnchor: 'albums',
      eventRefId: 'tour-ive-world',
    },
    {
      id: 'slide-anime-streetwear',
      category: 'Anime',
      categoryLabel: 'Anime & Shonen Streetwear',
      heroWord: 'SHONEN',
      title: 'SHONEN STREET REVOLUTION: Acid Lime Halftone & Pedido Drop',
      subtitle: 'Manga halftone aesthetics, oversized boxy drop-shoulder graphics & limited Harajuku Shonen anime merchandise drop.',
      tag: 'SHONEN STREETWEAR // ACID LIME',
      image: '/banners/banner_pixel_anime_arcade.webp',
      badge: '★ SHONEN STREET DROP',
      dateText: 'SPRING STREETWEAR 2026',
      locationText: 'Akihabara & Harajuku Flagship',
      priceText: 'Streetwear Kit $56.00',
      ctaText: 'Shop Shonen Drop',
      secondaryCtaText: 'Explore Halftone Archive',
      targetAnchor: 'albums',
      eventRefId: 'tour-atvncg-hanoi',
    },
    {
      id: 'slide-comics-pop-art',
      category: 'Comics',
      categoryLabel: 'Pop-Art Comics & Graphic Novels',
      heroWord: 'COMICS',
      title: 'GOLDEN & MODERN AGE: Pop-Art Ben-Day Dots & Omnibus Vault',
      subtitle: 'First printings, virgin foil variants, Eisner-award masterpieces & CGC 9.8 graded slabs from Marvel, DC, Image & Vertigo.',
      tag: '★ POP-ART COMIC VAULT',
      image: '/banners/banner_pixel_newjeans.webp',
      badge: 'CGC 9.8 CERTIFIED',
      dateText: 'NEW COMIC BOOK DAY 2026',
      locationText: 'San Diego Comic-Con & Midtown Comics',
      priceText: 'From $22.99',
      ctaText: 'Browse Comics Catalog',
      secondaryCtaText: 'Explore Creator Imprints',
      targetAnchor: 'comic-catalog',
      eventRefId: 'comic-vault-drop',
    },
    {
      id: 'slide-cinema-swiss',
      category: 'Movies',
      categoryLabel: '70mm Cinema & Auteur Archive',
      heroWord: 'CINEMA',
      title: '70MM RESTORATION ARCHIVE • Auteur Retrospectives & 4K Masters',
      subtitle: 'Objective optical clarity, pristine photogram fidelity & director-supervised collector monographs for Denis Villeneuve, Christopher Nolan & Wong Kar-wai.',
      tag: '01. SWISS ARCHIVE // 70MM MASTER',
      image: '/banners/banner_pixel_aespa.webp',
      badge: '70MM RESTORATION',
      dateText: 'CRAFT SELECTION 2026',
      locationText: 'Zurich Cinémathèque & BFI Southbank',
      priceText: 'From $29.99',
      ctaText: 'Browse 70mm Catalog',
      secondaryCtaText: 'Explore Auteur Atelier',
      targetAnchor: 'cinema-catalog',
      eventRefId: 'cinema-swiss-drop',
    },
    {
      id: 'slide-tvshows-y2k',
      category: 'TV Shows',
      categoryLabel: 'TV Shows & K-Drama Vault',
      heroWord: 'BINGE',
      title: 'TV SHOWS & K-DRAMA VAULT // Y2K BINGE EDITION',
      subtitle: 'Certified television masterworks, exclusive holographic photocard inclusions, full screenplay monographs & deluxe 2LP soundtrack gatefolds.',
      tag: '★ BINGE NIGHT // TV SERIES',
      image: '/banners/banner_pixel_blackpink.webp',
      badge: '★ Y2K BINGE DROP',
      dateText: 'SEASON 2026 BROADCAST',
      locationText: 'Seoul, Hawkins & Zaun',
      priceText: 'From $24.99',
      ctaText: 'Explore TV Releases',
      secondaryCtaText: 'View Binge Catalog',
      targetAnchor: 'tv-catalog',
      eventRefId: 'tv-y2k-drop',
    },
  ];

  // All 9 Fandom Categories mapped to sharp rectangular dock
  const FANDOM_TABS: { id: HeroBannerCategory; label: string }[] = [
    { id: 'all', label: 'All Fandoms' },
    { id: 'K-Pop', label: 'K-Pop' },
    { id: 'Gaming', label: 'Gaming Arena' },
    { id: 'Manga', label: 'Manga' },
    { id: 'Cosplay', label: 'Cosplay & Street' },
    { id: 'Anime', label: 'Anime' },
    { id: 'Comics', label: 'Comics' },
    { id: 'Movies', label: 'Cinema' },
    { id: 'TV Shows', label: 'TV Shows' },
  ];

  // Filter slides by active category if selected, otherwise show all
  const filteredSlides = useMemo(() => {
    if (currentCategory === 'all') return BANNER_SLIDES;
    if (currentCategory === 'TV Shows') {
      const tvSlide = BANNER_SLIDES.find(s => s.category === 'TV Shows');
      const otherSlides = BANNER_SLIDES.filter(s => s.category !== 'TV Shows');
      return tvSlide ? [tvSlide, ...otherSlides] : BANNER_SLIDES;
    }
    if (currentCategory === 'Movies') {
      const cinemaSlide = BANNER_SLIDES.find(s => s.category === 'Movies');
      const otherSlides = BANNER_SLIDES.filter(s => s.category !== 'Movies');
      return cinemaSlide ? [cinemaSlide, ...otherSlides] : BANNER_SLIDES;
    }
    if (currentCategory === 'Gaming') {
      const gamingSlide = BANNER_SLIDES.find(s => s.category === 'Gaming');
      const otherSlides = BANNER_SLIDES.filter(s => s.category !== 'Gaming');
      return gamingSlide ? [gamingSlide, ...otherSlides] : BANNER_SLIDES;
    }
    if (currentCategory === 'K-Pop') {
      const kpopSlide = BANNER_SLIDES.find(s => s.category === 'K-Pop');
      const otherSlides = BANNER_SLIDES.filter(s => s.category !== 'K-Pop');
      return kpopSlide ? [kpopSlide, ...otherSlides] : BANNER_SLIDES;
    }
    if (currentCategory === 'Anime') {
      const animeSlide = BANNER_SLIDES.find(s => s.category === 'Anime');
      const otherSlides = BANNER_SLIDES.filter(s => s.category !== 'Anime');
      return animeSlide ? [animeSlide, ...otherSlides] : BANNER_SLIDES;
    }
    if (currentCategory === 'Comics') {
      const comicSlide = BANNER_SLIDES.find(s => s.category === 'Comics');
      const otherSlides = BANNER_SLIDES.filter(s => s.category !== 'Comics');
      return comicSlide ? [comicSlide, ...otherSlides] : BANNER_SLIDES;
    }
    const matched = BANNER_SLIDES.filter(s => s.category === currentCategory);
    return matched.length > 0 ? matched : BANNER_SLIDES;
  }, [currentCategory]);

  // Adjust activeIndex if filteredSlides length changes
  useEffect(() => {
    setActiveIndex(0);
  }, [currentCategory]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || filteredSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % filteredSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, filteredSlides.length]);

  const currentSlide = filteredSlides[activeIndex] || filteredSlides[0];

  const handleSelectTab = (cat: HeroBannerCategory) => {
    setInternalCategory(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  const handleNext = () => setActiveIndex(prev => (prev + 1) % filteredSlides.length);
  const handlePrev = () => setActiveIndex(prev => (prev - 1 + filteredSlides.length) % filteredSlides.length);

  const handleScrollToTarget = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMainCta = () => {
    if (currentSlide.eventRefId && onSelectEvent) {
      const foundEvent = mockTourEvents.find(e => e.id === currentSlide.eventRefId);
      if (foundEvent) {
        onSelectEvent(foundEvent);
        return;
      }
    }
    handleScrollToTarget(currentSlide.targetAnchor || 'upcoming-releases');
  };

  return (
    <section
      id="hero-banner"
      className="relative w-full select-none bg-black text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =========================================================================
          1. EDITORIAL FULL-BLEED HERO BANNER - TO MAX (82vh+ cinema scale)
      ========================================================================= */}
      <div className="relative w-full h-[620px] sm:h-[720px] md:h-[820px] lg:h-[890px] xl:h-[940px] min-h-[82vh] overflow-hidden bg-neutral-900 group border-b-4 border-black">
        {filteredSlides.map((slide, idx) => {
          const isVisible = slide.id === currentSlide.id;
          const shouldRenderImage = isVisible || idx === 0 || Math.abs(idx - activeIndex) <= 1;
          return (
            <div
              key={slide.id}
              onClick={handleMainCta}
              className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-linear cursor-pointer ${isVisible
                ? 'opacity-100 pointer-events-auto z-10'
                : 'opacity-0 pointer-events-none z-0'
                }`}
            >
              {/* Full-bleed background graphic banner - Next.js Image with high priority for LCP slide */}
              {shouldRenderImage && (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding={idx === 0 ? 'sync' : 'async'}
                  sizes="(max-width: 768px) 100vw, 100vw"
                  quality={75}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
                />
              )}

              {/* High-contrast Y2K Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              {/* Cyber Grid Texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(#00f0ff 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            </div>
          );
        })}

        {/* Minimalist Monochrome Hero Caption - PRESERVED EXACTLY AS ORIGINAL */}
        <div className="absolute left-6 sm:left-12 lg:left-20 bottom-10 sm:bottom-14 z-20 max-w-3xl text-white pointer-events-none">
          <div className="pointer-events-auto flex flex-col gap-4">

            {/* Tag & Metadata Bar */}
            <div className="flex items-center gap-3 flex-wrap font-mono">
              <span
                style={{ borderRadius: isAnime || isComics ? '8px' : '0px' }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 ${isGaming ? 'bg-black text-white border-2 border-white shadow-none' : isCinema ? 'bg-[#FF3000] text-white border-2 border-black shadow-none' : isAnime ? 'bg-[#a3e635] text-black border-2 border-black shadow-[3px_3px_0px_#000000]' : isComics ? 'bg-[#ef4444] text-white border-2 border-black shadow-[3px_3px_0px_#000000]' : 'bg-[#d91470] text-white border-2 border-black shadow-[3px_3px_0px_#000000]'} text-[11px] font-black uppercase tracking-widest`}
              >
                <span>★</span>
                <span>{currentSlide.tag}</span>
              </span>

              <span
                style={{ borderRadius: isAnime || isComics ? '8px' : '0px' }}
                className={`text-[11px] font-bold tracking-wider ${isGaming ? 'bg-white text-black border-2 border-black shadow-none' : isCinema ? 'bg-white text-black border-2 border-black shadow-none' : isAnime ? 'bg-[#ecfccb] text-black border-2 border-black shadow-[3px_3px_0px_#000000]' : isComics ? 'bg-[#fef08a] text-black border-2 border-black shadow-[3px_3px_0px_#000000]' : 'bg-[#00f0ff] text-black border-2 border-black shadow-[3px_3px_0px_#000000]'} flex items-center gap-1.5 px-3 py-1.5`}
              >
                <span className="text-black font-black font-mono">LOC //</span>
                <span>{currentSlide.locationText}</span>
              </span>

              {currentSlide.priceText && (
                <span
                  style={{ borderRadius: isAnime || isComics ? '8px' : '0px' }}
                  className={`text-[11px] font-black px-3.5 py-1.5 ${isGaming ? 'bg-black text-white border-2 border-white shadow-none' : isCinema ? 'bg-[#F2F2F2] text-black border-2 border-black shadow-none' : isAnime || isComics ? 'bg-white text-black border-2 border-black shadow-[3px_3px_0px_#000000]' : 'bg-[#ffd60a] text-black border-2 border-black shadow-[3px_3px_0px_#000000]'} tracking-widest uppercase`}
                >
                  {currentSlide.priceText}
                </span>
              )}
            </div>

            {/* Oversized Headline */}
            <div className="space-y-1">
              <div
                style={{ fontFamily: isComics ? "'Bangers', cursive, sans-serif" : isAnime ? "'Kalam', cursive, sans-serif" : isCinema ? "'Inter', sans-serif" : undefined }}
                className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase leading-none select-none ${isComics ? 'text-[#ef4444] opacity-40 drop-shadow-[3px_3px_0px_#000]' : isAnime ? 'text-[#a3e635] opacity-40 drop-shadow-[3px_3px_0px_#000]' : isCinema ? 'font-black text-white/30 tracking-tighter' : isGaming ? 'font-serif text-white/60 opacity-60' : 'font-serif text-[#ffd60a] opacity-40 drop-shadow-[2px_2px_0px_#000]'}`}
              >
                {currentSlide.heroWord}
              </div>
              <h1
                style={{ fontFamily: isComics ? "'Bangers', cursive, sans-serif" : isAnime ? "'Kalam', cursive, sans-serif" : isCinema ? "'Inter', sans-serif" : undefined }}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight -mt-4 sm:-mt-6 drop-shadow-[2px_2px_0px_#000] ${isAnime || isComics ? 'font-black tracking-tight text-white' : isCinema ? 'font-black tracking-tight uppercase text-white' : 'font-serif font-normal italic tracking-tight text-white'}`}
              >
                {currentSlide.title}
              </h1>
            </div>

            {/* Editorial Rule with Visual Punctuation Box */}
            <div className="flex items-center gap-2 max-w-md my-1">
              <div
                style={{ borderRadius: isAnime || isComics ? '3px' : '0px' }}
                className={`w-2.5 h-2.5 border-2 border-black shrink-0 ${isGaming ? 'bg-white' : isCinema ? 'bg-[#FF3000]' : isAnime ? 'bg-[#a3e635]' : isComics ? 'bg-[#ef4444]' : 'bg-[#d91470]'}`}
              />
              <div className={`flex-1 h-[2px] ${isGaming ? 'bg-white' : isCinema ? 'bg-[#FF3000]' : isAnime ? 'bg-[#84cc16]' : isComics ? 'bg-[#facc15]' : 'bg-[#00f0ff]'}`} />
              <div
                style={{ borderRadius: isAnime || isComics ? '3px' : '0px' }}
                className={`w-2.5 h-2.5 border-2 border-black shrink-0 ${isGaming ? 'bg-white' : isCinema ? 'bg-black' : isAnime ? 'bg-white' : isComics ? 'bg-[#38bdf8]' : 'bg-[#ffd60a]'}`}
              />
            </div>

            {/* Subtitle */}
            <p
              style={{ fontFamily: isAnime || isComics ? "'Patrick Hand', cursive, sans-serif" : isCinema ? "'Inter', sans-serif" : undefined }}
              className={`text-sm sm:text-base leading-relaxed max-w-xl line-clamp-2 drop-shadow-[1px_1px_0px_#000] ${isAnime || isComics ? 'text-neutral-100 font-bold text-base sm:text-lg' : isCinema ? 'text-neutral-200 font-medium text-sm sm:text-base' : 'font-serif text-neutral-200 font-normal'}`}
            >
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2 flex-wrap font-mono">
              <button
                type="button"
                onClick={handleMainCta}
                className={`px-8 sm:px-12 py-3.5 sm:py-4 min-w-[200px] sm:min-w-[240px] justify-center ${isGaming ? 'bg-black text-white hover:bg-white hover:text-black border-2 border-white shadow-none' : isCinema ? 'bg-[#FF3000] text-white hover:bg-black border-2 border-black shadow-none' : isAnime ? 'bg-[#a3e635] text-black hover:bg-[#84cc16] border-2 border-black shadow-[4px_4px_0px_#000000]' : isComics ? 'bg-[#ef4444] text-white hover:bg-[#dc2626] border-2 border-black shadow-[4px_4px_0px_#000000]' : 'bg-[#d91470] text-white hover:bg-[#be185d] border-2 border-black shadow-[4px_4px_0px_#000000]'} text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-100 select-none whitespace-nowrap active:translate-x-[2px] active:translate-y-[2px] hover:translate-y-[-2px]`}
                style={{ borderRadius: isAnime || isComics ? '12px' : '0px', fontFamily: isAnime || isComics ? "'Patrick Hand', cursive, sans-serif" : undefined, fontSize: isAnime || isComics ? '16px' : undefined }}
              >
                <span>{currentSlide.ctaText}</span>
                <span className="font-mono text-sm">→</span>
              </button>

              <button
                type="button"
                onClick={() => handleScrollToTarget(currentSlide.targetAnchor || 'albums')}
                className={`px-10 sm:px-14 py-3.5 sm:py-4 min-w-[240px] sm:min-w-[280px] justify-center ${isGaming ? 'bg-white text-black hover:bg-black hover:text-white border-2 border-black shadow-none' : isCinema ? 'bg-white text-black hover:bg-[#F2F2F2] border-2 border-black shadow-none' : isAnime ? 'bg-white text-black hover:bg-[#ecfccb] border-2 border-black shadow-[4px_4px_0px_#000000]' : isComics ? 'bg-[#fef08a] text-black hover:bg-white border-2 border-black shadow-[4px_4px_0px_#000000]' : 'bg-[#00f0ff] text-black hover:bg-[#38bdf8] border-2 border-black shadow-[4px_4px_0px_#000000]'} text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-100 select-none whitespace-nowrap active:translate-x-[2px] active:translate-y-[2px] hover:translate-y-[-2px]`}
                style={{ borderRadius: isAnime || isComics ? '12px' : '0px', fontFamily: isAnime || isComics ? "'Patrick Hand', cursive, sans-serif" : undefined, fontSize: isAnime || isComics ? '16px' : undefined }}
              >
                <span>{currentSlide.secondaryCtaText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Side Prev / Next Navigation Arrows with Accessible 48px touch targets */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 min-w-[48px] min-h-[48px] ${isGaming ? 'bg-white hover:bg-black text-black hover:text-white border-2 border-black shadow-none' : isCinema ? 'bg-white hover:bg-[#FF3000] text-black hover:text-white border-2 border-black shadow-none' : isAnime ? 'bg-[#a3e635] hover:bg-[#84cc16] text-black border-2 border-black shadow-[3px_3px_0px_#000]' : isComics ? 'bg-[#ef4444] hover:bg-[#fef08a] text-white hover:text-black border-2 border-black shadow-[3px_3px_0px_#000]' : 'bg-[#ffd60a] hover:bg-white text-black border-2 border-black shadow-[3px_3px_0px_#000]'} flex items-center justify-center transition-all duration-100 cursor-pointer active:translate-x-[2px] active:translate-y-[2px]`}
          style={{ borderRadius: isAnime || isComics ? '12px' : '0px' }}
          aria-label="Previous Slide"
          title="Previous Slide"
        >
          <span className="font-mono text-base font-black">←</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 min-w-[48px] min-h-[48px] ${isGaming ? 'bg-white hover:bg-black text-black hover:text-white border-2 border-black shadow-none' : isCinema ? 'bg-white hover:bg-[#FF3000] text-black hover:text-white border-2 border-black shadow-none' : isAnime ? 'bg-[#a3e635] hover:bg-[#84cc16] text-black border-2 border-black shadow-[3px_3px_0px_#000]' : isComics ? 'bg-[#ef4444] hover:bg-[#fef08a] text-white hover:text-black border-2 border-black shadow-[3px_3px_0px_#000]' : 'bg-[#ffd60a] hover:bg-white text-black border-2 border-black shadow-[3px_3px_0px_#000]'} flex items-center justify-center transition-all duration-100 cursor-pointer active:translate-x-[2px] active:translate-y-[2px]`}
          style={{ borderRadius: isAnime || isComics ? '12px' : '0px' }}
          aria-label="Next Slide"
          title="Next Slide"
        >
          <span className="font-mono text-base font-black">→</span>
        </button>

        {/* Bottom Right Slide Counter & Square Indicator Box */}
        <div
          style={{ borderRadius: isAnime || isComics ? '10px' : '0px' }}
          className={`absolute right-6 sm:right-12 bottom-8 sm:bottom-12 z-30 flex items-center gap-3 bg-white px-4 py-2 border-2 border-black ${isGaming || isCinema ? 'shadow-none' : isAnime ? 'shadow-[3px_3px_0px_#84cc16]' : isComics ? 'shadow-[3px_3px_0px_#ef4444]' : 'shadow-[3px_3px_0px_#000]'} text-xs font-mono text-black font-bold`}
        >
          <span className={`font-black text-sm ${isGaming ? 'text-black' : isCinema ? 'text-[#FF3000]' : isAnime ? 'text-[#65a30d]' : isComics ? 'text-[#ef4444]' : 'text-[#d91470]'}`}>0{activeIndex + 1}</span>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-700">0{filteredSlides.length}</span>

          <div className="flex items-center gap-1 ml-2">
            {filteredSlides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className="p-2 -m-1 flex items-center justify-center cursor-pointer min-w-[28px] min-h-[28px]"
                aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                title={`Slide ${idx + 1}`}
              >
                <span
                  className={`w-3 h-3 block transition-colors duration-100 border border-black ${idx === activeIndex
                    ? (isGaming ? 'bg-black' : isCinema ? 'bg-[#FF3000]' : isAnime ? 'bg-[#a3e635]' : isComics ? 'bg-[#ef4444]' : 'bg-[#d91470]')
                    : (isGaming ? 'bg-neutral-200 hover:bg-black' : isCinema ? 'bg-neutral-200 hover:bg-black' : isAnime ? 'bg-neutral-200 hover:bg-[#a3e635]' : isComics ? 'bg-neutral-200 hover:bg-[#ef4444]' : 'bg-neutral-200 hover:bg-[#ffd60a]')
                    }`}
                  style={{ borderRadius: isAnime || isComics ? '3px' : '0px' }}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(!isPaused);
            }}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ml-1 cursor-pointer font-mono text-xs font-black ${isGaming ? 'text-black hover:opacity-60' : isCinema ? 'text-black hover:text-[#FF3000]' : isAnime ? 'text-black hover:text-[#65a30d]' : isComics ? 'text-black hover:text-[#ef4444]' : 'text-black hover:text-[#ff2e93]'}`}
            aria-label={isPaused ? 'Resume banner autoplay' : 'Pause banner autoplay'}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶' : '❚❚'}
          </button>
        </div>

      </div>

      {/* =========================================================================
          2. DEDICATED FANDOM CATEGORY DOCK
      ========================================================================= */}
      <div className={`fandom-category-dock w-full ${isGaming ? 'bg-white' : isCinema ? 'bg-[#F2F2F2]' : isAnime ? 'bg-[#f7fee7]' : 'bg-[#fdfbf7]'} dark:bg-[#090d16] border-b-4 border-black dark:border-[#2a364f] py-4 px-4 sm:px-8 transition-colors duration-300`}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-center overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {FANDOM_TABS.map((tab) => {
              const isActive = currentCategory === tab.id;

              // Color per tab when active
              let activeBgClass = 'fandom-tab-active-all bg-[#ffd60a] text-black border-black dark:bg-[#ffd60a] dark:text-black dark:border-[#ffd60a]';
              if (tab.id === 'Gaming') activeBgClass = 'fandom-tab-active-gaming bg-black text-white border-black dark:bg-[#00f0ff] dark:text-black dark:border-[#00f0ff]';
              else if (tab.id === 'K-Pop') activeBgClass = 'fandom-tab-active-kpop bg-[#d91470] text-white border-black dark:bg-[#d91470] dark:text-white dark:border-[#d91470]';
              else if (tab.id === 'Manga') activeBgClass = 'fandom-tab-active-manga bg-[#fff9c4] text-[#2d2d2d] border-[#2d2d2d] dark:bg-[#ff4d4d] dark:text-white dark:border-[#ff4d4d]';
              else if (tab.id === 'Cosplay') activeBgClass = 'fandom-tab-active-cosplay bg-[#D02020] text-white border-black dark:bg-[#D02020] dark:text-white dark:border-[#D02020] shadow-[4px_4px_0px_#121212] dark:shadow-none';
              else if (tab.id === 'Anime') activeBgClass = 'fandom-tab-active-anime bg-[#a3e635] text-black border-black dark:bg-[#a3e635] dark:text-black dark:border-[#a3e635] shadow-[4px_4px_0px_#000000] dark:shadow-none';
              else if (tab.id === 'Comics') activeBgClass = 'fandom-tab-active-comics bg-[#38bdf8] text-black border-black dark:bg-[#38bdf8] dark:text-black dark:border-[#38bdf8]';
              else if (tab.id === 'Movies') activeBgClass = 'fandom-tab-active-movies bg-[#FF3000] text-white border-black dark:bg-[#FF3000] dark:text-white dark:border-[#FF3000]';
              else if (tab.id === 'TV Shows') activeBgClass = 'fandom-tab-active-tv bg-[#d91470] text-white border-black dark:bg-[#d91470] dark:text-white dark:border-[#d91470]';

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  type="button"
                  style={{ borderRadius: isAnime || isComics ? '8px' : '0px' }}
                  aria-label={`Switch to ${tab.label} fandom category`}
                  className={`fandom-dock-btn px-4 sm:px-5 py-2.5 text-xs font-mono font-black tracking-widest uppercase transition-all duration-100 cursor-pointer flex items-center gap-2 whitespace-nowrap border-2 min-h-[44px] ${isActive
                    ? `${activeBgClass} ${isGaming || isCinema ? 'shadow-none' : 'shadow-[3px_3px_0px_#000000]'}`
                    : `fandom-tab-inactive bg-white text-black border-black hover:bg-neutral-100 dark:bg-[#1e293b] dark:text-[#f8fafc] dark:border-[#334155] dark:hover:bg-[#2a364f] dark:hover:text-white ${isGaming || isCinema ? 'shadow-none' : 'shadow-[2px_2px_0px_#000000]'}`
                    }`}
                >
                  {isActive && <span>★</span>}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
