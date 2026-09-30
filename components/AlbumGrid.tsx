'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useCartWishlist } from '../context/CartWishlistContext';
import { usePlayer } from '../context/PlayerContext';
import { useDomainTheme } from '../context/DomainContext';
import { filterAlbumsByDomain, filterArtistsByDomain } from '../utils/domainFilters';
import { mockAlbums, mockArtists } from '../data/mockData';
import { Album } from '../types';
import { HeroBanner } from './HeroBanner';

interface AlbumGridProps {
  onSelectAlbum: (album: Album) => void;
  searchQuery: string;
  selectedArtistFilter?: string;
  setSelectedArtistFilter?: (artistId: string) => void;
  fandomCategory?: string;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  onSelectAlbum,
  searchQuery,
  selectedArtistFilter,
  setSelectedArtistFilter,
  fandomCategory,
}) => {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice } = useCartWishlist();
  const { playTrack, currentAlbum, isPlaying } = usePlayer();
  const { currentDomain, activeSubCategory, selectSubCategory, activeConfig } = useDomainTheme();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeArtist, setActiveArtist] = useState<string>(selectedArtistFilter || 'all');
  const [activeType, setActiveType] = useState<string>('all');
  const [activeGenre, setActiveGenre] = useState<string>('all');
  const [activeReleaseYear, setActiveReleaseYear] = useState<string>('all');
  const [activePopularity, setActivePopularity] = useState<string>('all');
  const [activeSort, setActiveSort] = useState<'popular' | 'newest' | 'alpha-asc' | 'alpha-desc' | 'price-asc' | 'price-desc'>('popular');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [albumLayoutMode, setAlbumLayoutMode] = useState<'bento' | 'masonry' | 'grid'>('bento');

  useEffect(() => {
    if (fandomCategory) {
      if (fandomCategory === 'all') {
        setActiveCategory('all');
      } else {
        setActiveCategory(fandomCategory);
      }
    }
  }, [fandomCategory]);

  useEffect(() => {
    const handleFandomChange = (e: any) => {
      if (e.detail?.category) {
        setActiveCategory(e.detail.category);
      }
    };
    window.addEventListener('fandom-theme-change', handleFandomChange);
    return () => window.removeEventListener('fandom-theme-change', handleFandomChange);
  }, []);

  useEffect(() => {
    if (selectedArtistFilter) {
      setActiveArtist(selectedArtistFilter);
    }
  }, [selectedArtistFilter]);

  const handleArtistChange = (id: string) => {
    setActiveArtist(id);
    if (setSelectedArtistFilter) setSelectedArtistFilter(id);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setActiveArtist('all');
    if (setSelectedArtistFilter) setSelectedArtistFilter('all');
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveArtist('all');
    setActiveType('all');
    setActiveGenre('all');
    setActiveReleaseYear('all');
    setActivePopularity('all');
    setInStockOnly(false);
    selectSubCategory('all');
    if (setSelectedArtistFilter) setSelectedArtistFilter('all');
  };

  // 1. Filter by Domain & Subcategory (Respect activeCategory and fandomCategory)
  const domainFilteredAlbums = useMemo(() => {
    if (activeCategory !== 'all' || (fandomCategory && fandomCategory !== 'all')) {
      return mockAlbums;
    }
    const byDomain = filterAlbumsByDomain(mockAlbums, currentDomain);
    if (activeSubCategory === 'all') return byDomain;
    return byDomain.filter((a) => a.category === activeSubCategory || a.type === activeSubCategory);
  }, [currentDomain, activeSubCategory, activeCategory, fandomCategory]);

  // 2. Filter artists for active domain
  const availableArtists = useMemo(() => {
    return filterArtistsByDomain(mockArtists, currentDomain);
  }, [currentDomain]);

  // 3. Multi-dimensional filtering
  const filteredAlbums = useMemo(() => {
    return domainFilteredAlbums.filter((album) => {
      if (activeCategory !== 'all') {
        const normActive = activeCategory.toLowerCase();
        const normAlbumCat = (album.category || '').toLowerCase();
        const matches =
          normAlbumCat.includes(normActive) ||
          normActive.includes(normAlbumCat) ||
          (normActive.includes('game') && normAlbumCat.includes('gaming')) ||
          (normActive.includes('movie') && normAlbumCat.includes('movies')) ||
          (normActive.includes('tv') && normAlbumCat.includes('tv'));
        if (!matches) return false;
      }
      if (activeArtist !== 'all' && album.artistId !== activeArtist) return false;
      if (activeType !== 'all' && album.type !== activeType) return false;
      if (inStockOnly && (album.stock ?? 0) <= 0) return false;

      if (activeGenre !== 'all') {
        const matchesGenre = album.tag?.toLowerCase().includes(activeGenre.toLowerCase()) ||
                             album.description?.toLowerCase().includes(activeGenre.toLowerCase());
        if (!matchesGenre) return false;
      }

      if (activeReleaseYear !== 'all') {
        if (activeReleaseYear === 'vintage') {
          const year = parseInt(album.releaseDate.split('-')[0], 10);
          if (year > 2021) return false;
        } else {
          if (!album.releaseDate.startsWith(activeReleaseYear)) return false;
        }
      }

      if (activePopularity !== 'all') {
        if (activePopularity === 'top90' && (album.popularityScore ?? 0) < 90) return false;
        if (activePopularity === 'highRated' && (album.rating ?? 0) < 4.9) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = album.title.toLowerCase().includes(q);
        const inArtist = album.artist.toLowerCase().includes(q);
        const inTag = album.tag?.toLowerCase().includes(q);
        if (!inTitle && !inArtist && !inTag) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (activeSort) {
        case 'popular': return (b.popularityScore ?? 0) - (a.popularityScore ?? 0);
        case 'newest': return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'alpha-asc': return a.title.localeCompare(b.title);
        case 'alpha-desc': return b.title.localeCompare(a.title);
        case 'price-asc': return a.priceUSD - b.priceUSD;
        case 'price-desc': return b.priceUSD - a.priceUSD;
        default: return 0;
      }
    });
  }, [
    domainFilteredAlbums,
    activeCategory,
    activeArtist,
    activeType,
    activeGenre,
    activeReleaseYear,
    activePopularity,
    activeSort,
    inStockOnly,
    searchQuery,
  ]);

  const activeCategoryTitle = useMemo(() => {
    if (activeCategory === 'all') return 'Archive Catalog';
    return `${activeCategory} Archive`;
  }, [activeCategory]);

  const hasActiveFilters =
    activeCategory !== 'all' ||
    activeArtist !== 'all' ||
    activeType !== 'all' ||
    activeGenre !== 'all' ||
    activeReleaseYear !== 'all' ||
    activePopularity !== 'all' ||
    inStockOnly;

  const [artistDropdownOpen, setArtistDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const artistDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (artistDropdownRef.current && !artistDropdownRef.current.contains(e.target as Node)) {
        setArtistDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortLabels: Record<string, string> = {
    popular: 'Most Popular',
    newest: 'Newest Drops',
    'alpha-asc': 'Alphabetical (A → Z)',
    'alpha-desc': 'Alphabetical (Z → A)',
    'price-asc': 'Price: Low → High',
    'price-desc': 'Price: High → Low',
  };

  return (
    <section
      id="albums"
      style={{
        paddingTop: '80px',
        paddingBottom: '96px',
      }}
      className="w-full bg-[#fdfbf7] text-black border-b-4 border-black relative"
    >
      <div 
        style={{ paddingBottom: '32px' }}
        className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-12 sm:pb-16"
      >

        {/* ==================== 1. EDITORIAL SECTION HEADER ==================== */}
        <div>
          {/* Top Row: Eyebrow + Subcategories */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff2e93] border-2 border-black" />
              <div className="w-12 h-[3px] bg-[#00f0ff]" />
              <div className="w-3 h-3 bg-[#ffd60a] border-2 border-black" />
              <span className="font-mono text-xs font-black uppercase tracking-widest text-neutral-800 ml-2">
                SECTION 02 // ARCHIVE CATALOG &amp; CERTIFIED DROPS
              </span>
            </div>

            {/* Sub-Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-full pb-1 font-mono text-xs">
              {activeConfig.subCategories.map((sub) => {
                const isActive = activeSubCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => selectSubCategory(sub.id)}
                    type="button"
                    style={{ borderRadius: '0px' }}
                    className={`px-3.5 py-1.5 font-black uppercase tracking-wider cursor-pointer transition-all border-2 border-black ${
                      isActive 
                        ? 'bg-[#d91470] text-white shadow-[3px_3px_0px_#000] -translate-y-0.5' 
                        : 'bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-[#fff9db] hover:shadow-[3px_3px_0px_#000]'
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Title Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b-4 border-black gap-6">
            <div>
              <div className="inline-block bg-[#ffd60a] border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000]">
                ✦ HANTEO &amp; CIRCLE CHART CERTIFIED COPIES
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-black leading-tight tracking-tight">
                {activeCategoryTitle} &amp;{' '}
                <em className="font-serif italic font-normal text-[#d91470] drop-shadow-[1px_1px_0px_#000000]">
                  Album Drops
                </em>
              </h2>
              <p className="font-sans font-semibold text-xs sm:text-sm text-neutral-700 max-w-xl mt-3 leading-relaxed">
                Explore official first-press publications, limited photobook editions, signed packaging, and lossless audio teaser preview tracks.
              </p>
            </div>

            {/* Result count badge */}
            <div className="font-mono text-xs bg-[#00f0ff] text-black border-2 border-black px-4 py-2 uppercase font-black shadow-[3px_3px_0px_#000] flex items-center gap-2 self-start md:self-end">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              <span>{filteredAlbums.length} ALBUMS AVAILABLE</span>
            </div>
          </div>
        </div>

        {/* Dynamic Category Spotlight Banner */}
        <div style={{ marginTop: '36px', marginBottom: '40px' }}>
          <HeroBanner embedded />
        </div>

        {/* ==================== 2. FILTER & VIEW CONTROL STATION (Organized & Separated) ==================== */}
        <div 
          style={{ borderRadius: '0px', marginTop: '36px', marginBottom: '40px' }}
          className="w-full bg-white border-3 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000000] flex flex-col gap-4 font-mono text-xs"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-black">
            <span className="font-black uppercase tracking-wider text-black flex items-center gap-2">
              <span className="text-base text-[#d91470]">★</span> MULTI-DIMENSIONAL CATALOG FILTER STATION
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                type="button"
                style={{ borderRadius: '0px' }}
                className="px-2.5 py-1 bg-[#d91470] text-white hover:bg-black font-black uppercase tracking-wider text-[11px] cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
              >
                [× RESET ALL]
              </button>
            )}
          </div>

          {/* Left: Format Segments + Selects + In Stock */}
          <div className="flex items-center gap-2.5 flex-wrap max-w-full pb-3 border-b-2 border-neutral-200">
            {/* Segmented Format Control */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
              {[
                { value: 'all', label: '★ ALL' },
                { value: 'Full Album', label: 'LP / CD' },
                { value: 'Mini Album', label: 'MINI EP' },
                { value: 'Limited Kit', label: 'LIMITED' },
                { value: 'OST & Vinyl', label: 'VINYL' },
              ].map((fmt) => {
                const isActive = activeType === fmt.value;
                return (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => setActiveType(fmt.value)}
                    style={{ borderRadius: '0px' }}
                    className={`px-3 py-1.5 font-black uppercase tracking-wider cursor-pointer transition-all border-2 border-black ${
                      isActive 
                        ? 'bg-[#00f0ff] text-black shadow-[2px_2px_0px_#000] -translate-y-0.5' 
                        : 'bg-white text-black shadow-[1px_1px_0px_#000] hover:bg-[#ecfeff]'
                    }`}
                  >
                    {fmt.label}
                  </button>
                );
              })}
            </div>

            {/* Artist Dropdown */}
            <div ref={artistDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setArtistDropdownOpen(!artistDropdownOpen)}
                style={{ borderRadius: '0px' }}
                className="flex items-center gap-2 px-3 py-2 bg-white text-black border-2 border-black font-black uppercase tracking-wider cursor-pointer hover:bg-[#fff9db] shadow-[2px_2px_0px_#000] transition-colors"
              >
                <span>
                  {activeArtist === 'all' 
                    ? 'ALL ARTISTS' 
                    : availableArtists.find(a => a.id === activeArtist)?.name || 'ARTIST'}
                </span>
                <span className="text-[10px]">▼</span>
              </button>

              {artistDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setArtistDropdownOpen(false)} />
                  <div 
                    style={{ borderRadius: '0px' }}
                    className="absolute left-0 top-full mt-1 w-64 bg-white border-2 border-black p-3 z-50 max-h-72 overflow-y-auto space-y-1 font-mono shadow-[4px_4px_0px_#000]"
                  >
                    <button
                      type="button"
                      onClick={() => { handleArtistChange('all'); setArtistDropdownOpen(false); }}
                      className="w-full text-left p-1.5 text-xs font-black uppercase hover:bg-[#ffd60a] hover:text-black cursor-pointer transition-colors"
                    >
                      ALL ARTISTS
                    </button>
                    {availableArtists.map((artist) => (
                      <button
                        key={artist.id}
                        type="button"
                        onClick={() => { handleArtistChange(artist.id); setArtistDropdownOpen(false); }}
                        className={`w-full text-left p-1.5 text-xs uppercase cursor-pointer transition-colors ${
                          activeArtist === artist.id ? 'bg-[#d91470] text-white font-black' : 'hover:bg-[#ffd60a] hover:text-black font-bold'
                        }`}
                      >
                        {artist.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Genre Filter */}
            <select
              value={activeGenre}
              onChange={(e) => setActiveGenre(e.target.value)}
              style={{ borderRadius: '0px' }}
              aria-label="Filter by music genre"
              className="py-2 px-3 border-2 border-black bg-white text-black font-black uppercase tracking-wider focus:outline-none cursor-pointer shadow-[2px_2px_0px_#000] hover:bg-[#fff9db]"
            >
              <option value="all">ALL GENRES</option>
              <option value="pop">POP &amp; DANCE</option>
              <option value="hip-hop">HIP-HOP</option>
              <option value="ballad">BALLAD</option>
              <option value="ost">OST</option>
              <option value="rock">ROCK</option>
              <option value="cyberpunk">ELECTRONIC</option>
            </select>

            {/* Release Year Filter */}
            <select
              value={activeReleaseYear}
              onChange={(e) => setActiveReleaseYear(e.target.value)}
              style={{ borderRadius: '0px' }}
              aria-label="Filter by release year"
              className="py-2 px-3 border-2 border-black bg-white text-black font-black uppercase tracking-wider focus:outline-none cursor-pointer shadow-[2px_2px_0px_#000] hover:bg-[#fff9db]"
            >
              <option value="all">YEAR: ALL</option>
              <option value="2024">2024 (LATEST)</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="vintage">2021 &amp; OLDER</option>
            </select>

            {/* In Stock Toggle */}
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              style={{ borderRadius: '0px' }}
              aria-label="IN STOCK - Filter by in-stock items only"
              className={`px-3 py-2 border-2 border-black font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                inStockOnly 
                  ? 'bg-[#10b981] text-white shadow-[2px_2px_0px_#000]' 
                  : 'bg-white text-black shadow-[1px_1px_0px_#000] hover:bg-neutral-100'
              }`}
            >
              <span className={`w-2 h-2 ${inStockOnly ? 'bg-white' : 'bg-black'}`} />
              <span>IN STOCK</span>
            </button>
          </div>

          {/* Bottom Row: Layout Switcher & Sort */}
          <div className="flex items-center justify-between gap-4 flex-wrap w-full font-mono text-xs pt-1">
            {/* Layout Mode Switcher */}
            <div className="flex items-center gap-2">
              <span className="font-black text-[11px] text-neutral-600 uppercase tracking-wider">
                LAYOUT VIEW:
              </span>
              <div className="flex items-center border-2 border-black p-0.5 bg-white gap-0.5 shadow-[2px_2px_0px_#000]">
                {(['bento', 'masonry', 'grid'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAlbumLayoutMode(mode)}
                    style={{ borderRadius: '0px' }}
                    className={`px-3 py-1 font-black uppercase tracking-wider cursor-pointer transition-colors ${
                      albumLayoutMode === mode ? 'bg-[#ffd60a] text-black' : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    <span>{mode.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-black text-[11px] text-neutral-600 uppercase tracking-wider">
                SORT BY:
              </span>
              <div ref={sortDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  style={{ borderRadius: '0px' }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white text-black border-2 border-black font-black uppercase tracking-wider cursor-pointer hover:bg-[#fff9db] shadow-[2px_2px_0px_#000] transition-colors"
                >
                  <span>{sortLabels[activeSort]}</span>
                  <span className="text-[10px]">▼</span>
                </button>

                {sortDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setSortDropdownOpen(false)} />
                    <div 
                      style={{ borderRadius: '0px' }}
                      className="absolute right-0 top-full mt-1 w-52 bg-white border-2 border-black p-2 z-50 space-y-1 font-mono text-xs shadow-[4px_4px_0px_#000]"
                    >
                      {Object.entries(sortLabels).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => { setActiveSort(key as any); setSortDropdownOpen(false); }}
                          className={`w-full text-left p-2 uppercase cursor-pointer transition-colors ${
                            activeSort === key ? 'bg-[#d91470] text-white font-black' : 'hover:bg-[#ffd60a] hover:text-black font-bold'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 3. PRODUCT SHOWCASE (Bento / Masonry / Grid) ==================== */}
        {albumLayoutMode === 'bento' && filteredAlbums.length > 0 ? (
          /* ASYMMETRICAL BENTO GRID LAYOUT (Strict 0px, Minimalist Monochrome) */
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Item 0: Major Bento Spotlight Hero */}
            {filteredAlbums[0] && (() => {
              const album = filteredAlbums[0];
              const isFav = isWishlisted(album.id);

              return (
                <div
                  key={album.id}
                  onClick={() => onSelectAlbum(album)}
                  style={{ borderRadius: '0px' }}
                  className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white border-2 border-black p-5 sm:p-6 flex flex-col justify-between cursor-pointer group relative shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ff2e93] transition-all duration-100 min-w-0 overflow-hidden"
                >
                  <div className="min-w-0">
                    {/* Top: Album Cover Hero Banner */}
                    <div 
                      style={{ borderRadius: '0px' }}
                      className="relative w-full aspect-video sm:aspect-[16/10] overflow-hidden bg-neutral-100 mb-4 border-2 border-black shadow-[3px_3px_0px_#000000]"
                    >
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute top-2 left-2 z-10">
                        <span 
                          style={{ borderRadius: '0px' }}
                          className="bg-[#d91470] text-white text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000000]"
                        >
                          ★ SPOTLIGHT // #01
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(album);
                        }}
                        style={{ borderRadius: '0px' }}
                        className="absolute top-2 right-2 z-10 px-2 py-1 bg-[#00f0ff] hover:bg-[#38bdf8] text-black border-2 border-black font-mono text-[10px] font-black transition-all cursor-pointer shadow-[2px_2px_0px_#000000]"
                        title="Add to Wishlist"
                        type="button"
                      >
                        {isFav ? '[SAVED]' : '[SAVE]'}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack(album);
                        }}
                        style={{ borderRadius: '0px' }}
                        className="absolute bottom-2 right-2 z-10 px-3 py-1.5 bg-[#ffd60a] hover:bg-[#fde047] text-black border-2 border-black font-mono text-[10px] font-black tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_#000000]"
                        title="Play Preview"
                        type="button"
                      >
                        [▶ PLAY]
                      </button>
                    </div>

                    {/* Metadata & Title */}
                    <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-widest text-[#d91470] mb-1.5 truncate">
                      <span>{album.artist}</span>
                      <span>//</span>
                      <span>{album.type}</span>
                      <span>//</span>
                      <span className="text-neutral-600">{album.releaseDate.split('-')[0]}</span>
                    </div>

                    <h3 className="font-sans text-xl sm:text-2xl font-black uppercase text-black line-clamp-2 leading-tight mb-2">
                      {album.title}
                    </h3>

                    <p className="font-sans font-medium text-xs sm:text-sm text-neutral-700 line-clamp-2 leading-relaxed mb-4">
                      {album.description || 'Authentic First-Press publication including complete photobook and limited collectible photocards.'}
                    </p>
                  </div>

                  {/* Price & CTA Button */}
                  <div className="pt-3 border-t-2 border-black flex items-center justify-between gap-3 font-mono mt-auto">
                    <div>
                      <div className="text-xl font-black text-black tracking-tight">
                        {formatPrice(album.priceUSD, album.priceVND)}
                      </div>
                      <span className="text-[10px] text-[#d91470] font-black uppercase tracking-widest block">
                        ★ HANTEO CERTIFIED
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(album, album.versions[0]?.name);
                      }}
                      style={{ borderRadius: '0px' }}
                      className="px-6 py-3 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black border-2 border-black text-xs font-black uppercase tracking-widest transition-colors duration-100 cursor-pointer shadow-[3px_3px_0px_#000000]"
                      type="button"
                    >
                      [+ PRE-ORDER]
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Remaining Bento Cards (Vibrant Y2K Pop, Rich Metadata, Zero Dead Space) */}
            {filteredAlbums.slice(1).map((album) => {
              const isFav = isWishlisted(album.id);

              return (
                <div
                  key={album.id}
                  onClick={() => onSelectAlbum(album)}
                  style={{ borderRadius: '0px' }}
                  className="group bg-white border-2 border-black p-4 sm:p-5 flex flex-col justify-between shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#ff2e93] transition-all duration-100 cursor-pointer"
                >
                  <div className="flex-1 flex flex-col">
                    {/* Album Cover Container */}
                    <div 
                      style={{ borderRadius: '0px' }}
                      className="relative w-full aspect-square overflow-hidden bg-neutral-100 mb-3 border-2 border-black shadow-[2px_2px_0px_#000]"
                    >
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute top-2 left-2 z-10">
                        <span 
                          style={{ borderRadius: '0px' }}
                          className="bg-[#ffd60a] text-black text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]"
                        >
                          {album.tag || 'Official'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(album);
                        }}
                        style={{ borderRadius: '0px' }}
                        className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-[#00f0ff] hover:bg-[#38bdf8] text-black border border-black font-mono text-[9px] font-black transition-all cursor-pointer shadow-[1px_1px_0px_#000]"
                        title="Add to Wishlist"
                        type="button"
                      >
                        {isFav ? '[SAVED]' : '[SAVE]'}
                      </button>
                    </div>

                    {/* Artist & Year */}
                    <div className="flex items-center justify-between mb-1 font-mono text-neutral-500">
                      <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[70%] text-[#d91470]">
                        {album.artist}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-600">{album.releaseDate.split('-')[0]}</span>
                    </div>

                    {/* Album Title */}
                    <h3 className="font-sans text-base sm:text-lg font-black uppercase leading-snug line-clamp-1 mb-1 text-black">
                      {album.title}
                    </h3>

                    {/* Primary Inclusions */}
                    <div className="font-mono text-xs font-bold text-neutral-600 line-clamp-1 mb-2">
                      {album.type} • {album.inclusions?.[0] || 'Official Publication'}
                    </div>

                    {/* Rich Specification Panel: Eliminates empty gap */}
                    <div className="bg-[#ecfeff] border-2 border-black p-2.5 my-2 space-y-1 font-mono text-[10px] shadow-[1px_1px_0px_#000]">
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="font-black text-[#d91470]">INCLUDES:</span>
                        <span className="text-black font-bold truncate max-w-[125px]">
                          {album.inclusions?.[1] || album.inclusions?.[0] || 'CD + Photobook'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="font-black text-[#d91470]">EDITION:</span>
                        <span className="text-[#d91470] font-black uppercase">FIRST-PRESS</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="font-black text-[#d91470]">RATING:</span>
                        <span className="text-black font-bold">★ {album.rating ? album.rating.toFixed(1) : '4.9'} ({album.reviewCount || 120})</span>
                      </div>
                    </div>

                    {/* Stock Status Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap my-1 font-mono text-[9px]">
                      <span className="px-1.5 py-0.5 bg-[#ecfeff] text-[#0369a1] border border-[#0369a1] font-black">
                        {(album.stock ?? 0) > 0 ? `IN STOCK (${album.stock})` : 'BACKORDER'}
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#fefce8] text-[#854d0e] border border-[#854d0e] font-black">
                        HANTEO CERTIFIED
                      </span>
                    </div>

                    {/* Description Summary */}
                    <p className="font-sans font-medium text-[11px] text-neutral-600 leading-snug line-clamp-2 mt-1 mb-2">
                      {album.description || 'Authentic collector publication with complete photobook and limited photocards.'}
                    </p>
                  </div>

                  {/* Price & CTA Button */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-black gap-2 font-mono">
                    <div>
                      <div className="text-base font-black tracking-tight truncate text-black">
                        {formatPrice(album.priceUSD, album.priceVND)}
                      </div>
                      <span className="text-[9px] text-[#047857] font-bold block uppercase tracking-wider">
                        READY TO SHIP
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(album, album.versions[0]?.name);
                      }}
                      style={{ borderRadius: '0px' }}
                      className="px-3.5 py-2 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black border-2 border-black text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-[2px_2px_0px_#000000]"
                      type="button"
                      title="Pre-Order"
                    >
                      [+ BAG]
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : albumLayoutMode === 'masonry' ? (
          /* MASONRY WATERFALL LAYOUT */
          <div className="mt-8 sm:mt-12 columns-2 sm:columns-3 lg:columns-4 gap-6 space-y-6">
            {filteredAlbums.map((album, idx) => {
              const isFav = isWishlisted(album.id);
              const aspectClass = idx % 3 === 0 ? 'aspect-[3/4]' : idx % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]';

              return (
                <div
                  key={album.id}
                  onClick={() => onSelectAlbum(album)}
                  style={{ borderRadius: '0px' }}
                  className="break-inside-avoid bg-white border-2 border-black p-5 flex flex-col justify-between shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#ff2e93] transition-all duration-200 cursor-pointer group"
                >
                  <div 
                    style={{ borderRadius: '0px' }}
                    className={`relative w-full ${aspectClass} overflow-hidden bg-neutral-100 mb-3 border-2 border-black shadow-[2px_2px_0px_#000]`}
                  >
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute top-2 left-2 z-10">
                      <span 
                        style={{ borderRadius: '0px' }}
                        className="bg-[#ffd60a] text-black text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]"
                      >
                        {album.tag || 'Official'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#d91470] block">
                      {album.artist}
                    </span>
                    <h3 className="font-sans text-base font-black line-clamp-1 mt-0.5 text-black">
                      {album.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-black font-mono">
                    <span className="text-sm font-black text-black">
                      {formatPrice(album.priceUSD, album.priceVND)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(album, album.versions[0]?.name);
                      }}
                      style={{ borderRadius: '0px' }}
                      className="px-3 py-1 border-2 border-black bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black font-mono text-xs font-black cursor-pointer shadow-[2px_2px_0px_#000] transition-colors"
                      type="button"
                    >
                      [+ BAG]
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* STANDARD CARD GRID LAYOUT */
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAlbums.map((album) => {
              const isFav = isWishlisted(album.id);

              return (
                <div
                  key={album.id}
                  onClick={() => onSelectAlbum(album)}
                  style={{ borderRadius: '0px' }}
                  className="group bg-white border-2 border-black p-4 sm:p-5 flex flex-col justify-between shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#ff2e93] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex-1 flex flex-col">
                    <div 
                      style={{ borderRadius: '0px' }}
                      className="relative w-full aspect-square overflow-hidden bg-neutral-100 mb-3 border-2 border-black shadow-[2px_2px_0px_#000]"
                    >
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute top-2 left-2 z-10">
                        <span 
                          style={{ borderRadius: '0px' }}
                          className="bg-[#ffd60a] text-black text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]"
                        >
                          {album.tag || 'Official'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(album);
                        }}
                        style={{ borderRadius: '0px' }}
                        className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-[#ecfeff] hover:bg-[#00f0ff] text-black border-2 border-black font-mono text-[9px] font-black shadow-[1px_1px_0px_#000] transition-colors cursor-pointer"
                        title="Add to Wishlist"
                        type="button"
                      >
                        {isFav ? '★ SAVED' : '♥ SAVE'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-1 font-mono text-neutral-600">
                      <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[70%] text-[#d91470]">
                        {album.artist}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-600">{album.releaseDate.split('-')[0]}</span>
                    </div>

                    <h3 className="font-sans text-base font-black uppercase leading-snug line-clamp-1 mb-1 text-black">
                      {album.title}
                    </h3>
                    <div className="font-mono text-xs font-bold text-neutral-600 mb-2 line-clamp-1">
                      {album.type} • {album.inclusions?.[0] || 'Sealed Official Copy'}
                    </div>

                    {/* Rich Specification Panel */}
                    <div className="bg-[#ecfeff] border-2 border-black p-2.5 my-2 space-y-1 font-mono text-[10px] shadow-[1px_1px_0px_#000]">
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="font-black text-[#d91470]">INCLUDES:</span>
                        <span className="text-black font-bold truncate max-w-[125px]">
                          {album.inclusions?.[1] || album.inclusions?.[0] || 'CD + Photobook'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="font-black text-[#d91470]">EDITION:</span>
                        <span className="text-[#d91470] font-black uppercase">FIRST-PRESS</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="font-black text-[#d91470]">RATING:</span>
                        <span className="text-black font-bold">★ {album.rating ? album.rating.toFixed(1) : '4.9'} ({album.reviewCount || 120})</span>
                      </div>
                    </div>

                    {/* Stock Status Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap my-1 font-mono text-[9px]">
                      <span className="px-1.5 py-0.5 bg-[#ecfeff] text-[#0369a1] border border-[#0369a1] font-black">
                        {(album.stock ?? 0) > 0 ? `IN STOCK (${album.stock})` : 'BACKORDER'}
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#fefce8] text-[#854d0e] border border-[#854d0e] font-black">
                        HANTEO CERTIFIED
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-black gap-2 font-mono">
                    <div>
                      <div className="text-base font-black tracking-tight truncate text-black">
                        {formatPrice(album.priceUSD, album.priceVND)}
                      </div>
                      <span className="text-[9px] text-[#047857] font-bold block uppercase tracking-wider">
                        READY TO SHIP
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(album, album.versions[0]?.name);
                      }}
                      style={{ borderRadius: '0px' }}
                      className="px-3.5 py-2 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] transition-colors cursor-pointer shrink-0"
                      type="button"
                    >
                      [+ PRE-ORDER]
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredAlbums.length === 0 && (
          <div 
            style={{ borderRadius: '0px' }}
            className="text-center py-20 px-6 bg-white border-3 border-black shadow-[6px_6px_0px_#000] mt-8"
          >
            <p className="font-sans text-2xl font-black text-black mb-2 uppercase">
              NO ALBUMS MATCH THIS FILTER.
            </p>
            <p className="font-mono text-xs text-neutral-600 uppercase tracking-widest mb-6">
              Try resetting your category or artist parameters.
            </p>
            <button
              onClick={handleResetFilters}
              style={{ borderRadius: '0px' }}
              className="bg-[#d91470] hover:bg-[#be185d] text-white border-2 border-black text-xs font-mono font-black uppercase tracking-widest px-8 py-3.5 cursor-pointer shadow-[3px_3px_0px_#000] transition-all"
              type="button"
            >
              [RESET ALL FILTERS]
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
