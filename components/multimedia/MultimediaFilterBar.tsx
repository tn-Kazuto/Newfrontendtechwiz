'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { MediaType, FandomCategory, MediaItem, CATEGORY_ARTISTS_MAP } from '../../data/multimediaData';
import { Sparkles, Music, Star, Flame, BookOpen, Gamepad2, Zap, Film, Tv, Scissors, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface MultimediaFilterBarProps {
  selectedFormat: MediaType | 'all';
  selectedUniverse: FandomCategory | 'all';
  selectedArtist: string;
  searchQuery: string;
  sortBy: 'views' | 'rating' | 'newest' | 'duration';
  mediaList: MediaItem[];
  onSelectFormat: (fmt: MediaType | 'all') => void;
  onSelectUniverse: (cat: FandomCategory | 'all') => void;
  onSelectArtist: (artistQuery: string, artistLabel: string) => void;
  onSearchChange: (q: string) => void;
  onSortChange: (sort: 'views' | 'rating' | 'newest' | 'duration') => void;
}

export const MultimediaFilterBar: React.FC<MultimediaFilterBarProps> = ({
  selectedFormat,
  selectedUniverse,
  selectedArtist,
  searchQuery,
  sortBy,
  mediaList,
  onSelectFormat,
  onSelectUniverse,
  onSelectArtist,
  onSearchChange,
  onSortChange,
}) => {
  // Format tabs
  const formatTabs = [
    { id: 'all' as const, label: 'TẤT CẢ MEDIA', count: mediaList.length },
    { id: 'trailer' as const, label: 'TRAILERS & MV', count: mediaList.filter((m) => m.type === 'trailer').length },
    { id: 'video' as const, label: 'ORIGINAL SHOWS', count: mediaList.filter((m) => m.type === 'video').length },
    { id: 'podcast' as const, label: 'PODCAST RADIO', count: mediaList.filter((m) => m.type === 'podcast').length },
    { id: 'livestream' as const, label: 'LIVESTREAMS', count: mediaList.filter((m) => m.type === 'livestream').length },
    { id: 'soundtrack' as const, label: 'SOUNDTRACK OST', count: mediaList.filter((m) => m.type === 'soundtrack').length },
  ];

  // Persistent Category List across all tabs
  const universeCategories: { id: FandomCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'ALL UNIVERSE', icon: Sparkles },
    { id: 'K-Pop', label: 'K-POP', icon: Music },
    { id: 'V-Pop', label: 'V-POP', icon: Star },
    { id: 'Anime', label: 'ANIME', icon: Flame },
    { id: 'Manga', label: 'MANGA', icon: BookOpen },
    { id: 'Gaming', label: 'GAMING ARENA', icon: Gamepad2 },
    { id: 'Comics', label: 'COMICS', icon: Zap },
    { id: 'Cinema', label: 'CINEMA / MOVIES', icon: Film },
    { id: 'TV Shows', label: 'TV SHOWS', icon: Tv },
    { id: 'Cosplay', label: 'COSPLAY', icon: Scissors },
  ];

  // Dynamic Artist / Music Group List based on selected category
  const activeArtistList = useMemo(() => {
    if (selectedUniverse === 'all') {
      return [
        { label: 'Tất cả Nhóm nhạc & Nghệ sĩ', query: '' },
        { label: 'NewJeans', query: 'NewJeans' },
        { label: 'BLACKPINK', query: 'BLACKPINK' },
        { label: 'BTS', query: 'BTS' },
        { label: 'SEVENTEEN', query: 'SEVENTEEN' },
        { label: 'aespa', query: 'aespa' },
        { label: 'Anh Trai Say Hi', query: 'Say Hi' },
        { label: 'Sơn Tùng M-TP', query: 'Son Tung' },
        { label: 'Demon Slayer', query: 'Demon Slayer' },
        { label: 'One Piece', query: 'One Piece' },
        { label: 'T1 & Faker', query: 'Faker' },
      ];
    }
    return CATEGORY_ARTISTS_MAP[selectedUniverse] || [
      { label: `Tất cả ${selectedUniverse}`, query: '' },
    ];
  }, [selectedUniverse]);

  // Drag & Scroll State for Category Bar
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [isCatDragging, setIsCatDragging] = useState(false);
  const [catStartX, setCatStartX] = useState(0);
  const [catScrollLeft, setCatScrollLeft] = useState(0);
  const catMovedRef = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateCategoryScrollState = () => {
    const el = categoryScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  };

  useEffect(() => {
    updateCategoryScrollState();
    const el = categoryScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateCategoryScrollState);
    window.addEventListener('resize', updateCategoryScrollState);
    return () => {
      el.removeEventListener('scroll', updateCategoryScrollState);
      window.removeEventListener('resize', updateCategoryScrollState);
    };
  }, []);

  const handleCatMouseDown = (e: React.MouseEvent) => {
    if (!categoryScrollRef.current) return;
    setIsCatDragging(true);
    setCatStartX(e.pageX - categoryScrollRef.current.offsetLeft);
    setCatScrollLeft(categoryScrollRef.current.scrollLeft);
    catMovedRef.current = false;
  };

  const handleCatMouseMove = (e: React.MouseEvent) => {
    if (!isCatDragging || !categoryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - catStartX) * 1.6;
    if (Math.abs(walk) > 5) {
      catMovedRef.current = true;
    }
    categoryScrollRef.current.scrollLeft = catScrollLeft - walk;
  };

  const handleCatMouseUp = () => {
    setIsCatDragging(false);
  };

  const handleCatWheel = (e: React.WheelEvent) => {
    if (categoryScrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      categoryScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const scrollCategoryDir = (dir: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const offset = dir === 'left' ? -280 : 280;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Drag & Scroll State for Artist Bar
  const artistScrollRef = useRef<HTMLDivElement>(null);
  const [isArtistDragging, setIsArtistDragging] = useState(false);
  const [artistStartX, setArtistStartX] = useState(0);
  const [artistScrollLeft, setArtistScrollLeft] = useState(0);
  const artistMovedRef = useRef(false);

  const handleArtistMouseDown = (e: React.MouseEvent) => {
    if (!artistScrollRef.current) return;
    setIsArtistDragging(true);
    setArtistStartX(e.pageX - artistScrollRef.current.offsetLeft);
    setArtistScrollLeft(artistScrollRef.current.scrollLeft);
    artistMovedRef.current = false;
  };

  const handleArtistMouseMove = (e: React.MouseEvent) => {
    if (!isArtistDragging || !artistScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - artistScrollRef.current.offsetLeft;
    const walk = (x - artistStartX) * 1.6;
    if (Math.abs(walk) > 5) {
      artistMovedRef.current = true;
    }
    artistScrollRef.current.scrollLeft = artistScrollLeft - walk;
  };

  const handleArtistMouseUp = () => {
    setIsArtistDragging(false);
  };

  const handleArtistWheel = (e: React.WheelEvent) => {
    if (artistScrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      artistScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Wheel handler for format tabs
  const formatScrollRef = useRef<HTMLDivElement>(null);
  const handleFormatWheel = (e: React.WheelEvent) => {
    if (formatScrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      formatScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 font-mono text-xs select-none">

      {/* ========================================================= */}
      {/* 1. PERSISTENT CATEGORY SWITCHER BAR FOR ALL TABS          */}
      {/* ========================================================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b-2 border-black dark:border-[#2a364f]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#ff2e93] border-2 border-black dark:border-[#2a364f]" />
            <span className="w-8 h-[3px] bg-[#00f0ff]" />
            <span className="w-3 h-3 bg-[#ffd60a] border-2 border-black dark:border-[#2a364f]" />
            <h3 className="font-mono font-black uppercase tracking-widest text-black dark:text-[#f8fafc] text-xs sm:text-sm flex items-center gap-2">
              <span>THANH CHUYỂN DANH MỤC VŨ TRỤ // SECTORS</span>
              <span className="text-[10px] px-2 py-0.5 bg-[#ffd60a] text-black border border-black font-mono">
                {selectedUniverse === 'all' ? 'TẤT CẢ' : selectedUniverse.toUpperCase()}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-500 font-bold hidden sm:inline">
              Kéo chuột hoặc bấm mũi tên để duyệt toàn bộ danh mục ↔
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollCategoryDir('left')}
                disabled={!canScrollLeft}
                aria-label="Cuộn danh mục sang trái"
                className={`p-1.5 border-2 border-black transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'bg-white hover:bg-[#ffd60a] text-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5'
                    : 'bg-neutral-200 text-neutral-400 border-neutral-400 opacity-40 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollCategoryDir('right')}
                disabled={!canScrollRight}
                aria-label="Cuộn danh mục sang phải"
                className={`p-1.5 border-2 border-black transition-all cursor-pointer ${
                  canScrollRight
                    ? 'bg-white hover:bg-[#ffd60a] text-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5'
                    : 'bg-neutral-200 text-neutral-400 border-neutral-400 opacity-40 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Slider with Drag-to-Scroll & Navigation Arrows */}
        <div className="relative flex items-center gap-2">
          {/* Slider Container */}
          <div
            ref={categoryScrollRef}
            onMouseDown={handleCatMouseDown}
            onMouseMove={handleCatMouseMove}
            onMouseUp={handleCatMouseUp}
            onMouseLeave={handleCatMouseUp}
            onWheel={handleCatWheel}
            className={`flex-1 flex items-center gap-2 overflow-x-auto pb-1.5 scroll-smooth select-none cursor-grab active:cursor-grabbing ${
              isCatDragging ? 'cursor-grabbing select-none' : ''
            }`}
            style={{
              scrollbarWidth: 'thin',
            }}
          >
            {universeCategories.map((uni) => {
              const Icon = uni.icon;
              const isActive = selectedUniverse === uni.id;
              const countInCat =
                uni.id === 'all'
                  ? mediaList.length
                  : mediaList.filter((m) => m.category === uni.id || (uni.id === 'Cinema' && m.category === 'Movies')).length;

              return (
                <button
                  key={uni.id}
                  type="button"
                  onClick={(e) => {
                    if (catMovedRef.current) {
                      e.preventDefault();
                      return; // Was dragging, ignore click
                    }
                    onSelectUniverse(uni.id);
                    onSelectArtist('', ''); // reset artist when switching category
                  }}
                  style={{ borderRadius: '0px' }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 font-mono text-xs font-black uppercase tracking-wider cursor-pointer border-2 transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#ff2e93] text-white border-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                      : 'bg-white text-black border-black hover:bg-[#fff9db] dark:bg-[#1e293b] dark:text-[#f8fafc] dark:border-[#334155] dark:hover:bg-[#2a364f] shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{uni.label}</span>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      isActive ? 'text-white/80' : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    ({countInCat})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MUSIC GROUPS & ARTISTS SELECTOR DOCK                   */}
      {/* ========================================================= */}
      <div
        style={{ borderRadius: '0px' }}
        className="p-3.5 sm:p-4 bg-[#f8fafc] dark:bg-[#0f172a] border-2 border-black dark:border-[#334155] shadow-[3px_3px_0px_#000000] flex flex-col gap-2.5"
      >
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
          <div className="flex items-center gap-2 text-black dark:text-[#f8fafc]">
            <Users className="w-3.5 h-3.5 text-[#ff2e93]" />
            <span>NHÓM NHẠC &amp; NGHỆ SĨ ({selectedUniverse === 'all' ? 'TỔNG HỢP' : selectedUniverse.toUpperCase()}):</span>
          </div>
          {selectedArtist && (
            <button
              onClick={() => onSelectArtist('', '')}
              className="text-[#ff2e93] hover:underline cursor-pointer"
            >
              [XÓA LỌC NGHỆ SĨ]
            </button>
          )}
        </div>

        {/* Artist Pills with Drag and Wheel Support */}
        <div
          ref={artistScrollRef}
          onMouseDown={handleArtistMouseDown}
          onMouseMove={handleArtistMouseMove}
          onMouseUp={handleArtistMouseUp}
          onMouseLeave={handleArtistMouseUp}
          onWheel={handleArtistWheel}
          className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none cursor-grab active:cursor-grabbing ${
            isArtistDragging ? 'cursor-grabbing select-none' : ''
          }`}
        >
          {activeArtistList.map((artist) => {
            const isSelected = selectedArtist.toLowerCase() === artist.query.toLowerCase();
            const matchingCount =
              artist.query === ''
                ? (selectedUniverse === 'all' ? mediaList.length : mediaList.filter((m) => m.category === selectedUniverse).length)
                : mediaList.filter((m) => {
                    const matchCat = selectedUniverse === 'all' || m.category === selectedUniverse;
                    const q = artist.query.toLowerCase();
                    const matchArt = m.artist.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q)) || m.title.toLowerCase().includes(q);
                    return matchCat && matchArt;
                  }).length;

            return (
              <button
                key={artist.label}
                type="button"
                onClick={(e) => {
                  if (artistMovedRef.current) {
                    e.preventDefault();
                    return; // Was dragging, ignore click
                  }
                  onSelectArtist(artist.query, artist.label);
                }}
                style={{ borderRadius: '0px' }}
                className={`px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-wider cursor-pointer border-2 transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-black text-[#ccff00] border-black shadow-[2px_2px_0px_#000000] dark:bg-[#ccff00] dark:text-black'
                    : 'bg-white text-black border-black/60 hover:border-black hover:bg-[#fefce8] dark:bg-[#1e293b] dark:text-[#f8fafc] shadow-[1px_1px_0px_#000000]'
                }`}
              >
                <span>{artist.label}</span>
                <span
                  className={`text-[10px] font-mono font-bold ${
                    isSelected ? 'text-[#ccff00]/80 dark:text-black/70' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  ({matchingCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FORMAT TABS BAR (Trailers, Shows, Podcasts, etc.)     */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        <div
          ref={formatScrollRef}
          onWheel={handleFormatWheel}
          className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none select-none"
        >
          {formatTabs.map((tab) => {
            const isActive = selectedFormat === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectFormat(tab.id)}
                style={{ borderRadius: '0px' }}
                className={`px-3.5 py-2 font-mono text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-2 border-black dark:border-[#334155] flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-black text-[#ffd60a] shadow-[2px_2px_0px_#000000] -translate-y-0.5'
                    : 'bg-white text-black hover:bg-[#fefce8] dark:bg-[#1e293b] dark:text-[#f8fafc] shadow-[1px_1px_0px_#000000]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    isActive ? 'text-[#ffd60a]/80' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Sort Dropdown */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="[//] TÌM TRAILER, VIDEO..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ borderRadius: '0px' }}
              aria-label="Search multimedia archive"
              className="w-full px-3 py-1.5 border-2 border-black dark:border-[#334155] text-xs font-mono font-bold uppercase bg-white dark:bg-[#0f172a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2e93] shadow-[2px_2px_0px_#000000]"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            style={{ borderRadius: '0px' }}
            aria-label="Sort multimedia clips"
            className="border-2 border-black dark:border-[#334155] bg-white dark:bg-[#0f172a] text-black dark:text-white px-2.5 py-1.5 text-xs font-mono font-black uppercase cursor-pointer focus:outline-none shadow-[2px_2px_0px_#000000] hover:bg-[#fefce8]"
          >
            <option value="views">LƯỢT XEM CAO</option>
            <option value="rating">ĐÁNH GIÁ CAO</option>
            <option value="duration">THỜI LƯỢNG DÀI</option>
          </select>
        </div>
      </div>

    </div>
  );
};
