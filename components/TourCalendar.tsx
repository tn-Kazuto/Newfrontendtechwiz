'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { mockTourEvents } from '../data/mockData';
import { TourEvent, EventPlatform, EventType } from '../types';
import {
  MapPin,
  Calendar,
  Ticket,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Flame,
  Radio,
  ShieldCheck,
  QrCode,
  ArrowUpRight,
  Heart,
  Gift,
  Vote,
  Store,
  Trophy,
  Video,
  Search,
  Users,
  Award,
  ChevronRight,
  ThumbsUp,
  Clock,
  Layers,
  Compass
} from 'lucide-react';
import { useDomainTheme } from '../context/DomainContext';
import { getFandomCategoryFromTheme } from '../utils/fandomTheme';

interface TourCalendarProps {
  activeCategory?: string;
}

export const TourCalendar: React.FC<TourCalendarProps> = ({ activeCategory: propActiveCategory }) => {
  const { formatPrice } = useCartWishlist();
  const { activeConfig, activeSubCategory, selectSubCategory } = useDomainTheme();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (propActiveCategory && propActiveCategory !== 'all') {
      return propActiveCategory;
    }
    return 'all';
  });
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Sync category with propActiveCategory
  useEffect(() => {
    if (propActiveCategory) {
      setSelectedCategory(propActiveCategory);
    }
  }, [propActiveCategory]);

  // Sync category with global fandom theme events
  useEffect(() => {
    const handleFandomChange = (e: any) => {
      if (e?.detail?.category) {
        setSelectedCategory(e.detail.category);
      } else if (e?.detail?.theme) {
        setSelectedCategory(getFandomCategoryFromTheme(e.detail.theme));
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('fandom-theme-change', handleFandomChange);
      return () => window.removeEventListener('fandom-theme-change', handleFandomChange);
    }
  }, []);

  // Sync category with activeSubCategory from DomainContext
  useEffect(() => {
    if (propActiveCategory) return;
    if (activeSubCategory === 'kpop' || activeSubCategory === 'kpop_fandom') {
      setSelectedCategory('K-Pop');
    } else if (activeSubCategory === 'anime' || activeSubCategory === 'anime_fandom' || activeSubCategory === 'ghibli') {
      setSelectedCategory('Anime');
    } else if (activeSubCategory === 'gaming' || activeSubCategory === 'cyber' || activeSubCategory === 'hardware') {
      setSelectedCategory('Gaming');
    } else if (activeSubCategory === 'all') {
      setSelectedCategory('all');
    }
  }, [activeSubCategory, propActiveCategory]);

  // Modals State
  const [bookedTour, setBookedTour] = useState<TourEvent | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('VIP Soundcheck Floor');

  // Withmuu Fansign & Lucky Draw Modal State
  const [fansignModalEvent, setFansignModalEvent] = useState<TourEvent | null>(null);
  const [albumEntryQty, setAlbumEntryQty] = useState<number>(3);
  const [applicantName, setApplicantName] = useState<string>('Alex Morgan');
  const [applicantContact, setApplicantContact] = useState<string>('@alex_kpop (KakaoTalk)');
  const [fansignSuccess, setFansignSuccess] = useState<boolean>(false);
  const [generatedEntryId, setGeneratedEntryId] = useState<string>('');

  // Mubeat Voting Modal State
  const [votingModalEvent, setVotingModalEvent] = useState<TourEvent | null>(null);
  const [userHeartBeats, setUserHeartBeats] = useState<number>(1850);
  const [selectedContender, setSelectedContender] = useState<string>('');
  const [voteAmount, setVoteAmount] = useState<number>(50);
  const [votingSuccessMsg, setVotingSuccessMsg] = useState<string | null>(null);
  const [localEventVotes, setLocalEventVotes] = useState<Record<string, number>>({});

  // Dynamic Cities derived from mockTourEvents
  const cities = useMemo(() => {
    const cityMap = new Map<string, number>();
    mockTourEvents.forEach(e => {
      cityMap.set(e.city, (cityMap.get(e.city) || 0) + 1);
    });
    const list = [
      { id: 'all', name: 'All Locations', count: mockTourEvents.length },
      ...Array.from(cityMap.entries()).map(([cityName, count]) => ({
        id: cityName,
        name: cityName,
        count
      }))
    ];
    return list;
  }, []);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return mockTourEvents.filter((ev) => {
      // Category filter (K-Pop, Anime, Gaming, Manga, Cosplay, Comics, Movies, TV, all)
      if (selectedCategory !== 'all') {
        const c1 = (ev.category || '').toLowerCase();
        const c2 = selectedCategory.toLowerCase();
        const matches = c1 === c2 ||
          ((c1.includes('movie') || c1.includes('cinema')) && (c2.includes('movie') || c2.includes('cinema'))) ||
          (c1.includes('tv') && c2.includes('tv')) ||
          (c1.includes('game') && c2.includes('game')) ||
          (c1.includes('comic') && c2.includes('comic')) ||
          (c1.includes('manga') && c2.includes('manga')) ||
          (c1.includes('anime') && c2.includes('anime')) ||
          (c1.includes('cosplay') && c2.includes('cosplay')) ||
          (c1.includes('kpop') && c2.includes('kpop'));
        if (!matches) return false;
      }
      // Platform filter
      if (selectedPlatform !== 'all' && ev.sourcePlatform !== selectedPlatform) {
        return false;
      }
      // Event type filter
      if (selectedEventType !== 'all' && ev.eventType !== selectedEventType) {
        return false;
      }
      // City filter
      if (selectedCity !== 'all' && ev.city !== selectedCity) {
        return false;
      }
      // Keyword search
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchTitle = ev.tourName.toLowerCase().includes(q);
        const matchArtist = ev.artistName.toLowerCase().includes(q);
        const matchCity = ev.city.toLowerCase().includes(q);
        const matchVenue = ev.venue.toLowerCase().includes(q);
        const matchFandom = (ev.fandomName || '').toLowerCase().includes(q);
        if (!matchTitle && !matchArtist && !matchCity && !matchVenue && !matchFandom) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedPlatform, selectedEventType, selectedCity, searchFilter]);

  // Handler for opening appropriate modal based on event type
  const handleOpenAction = (event: TourEvent) => {
    if (event.eventType === 'voting') {
      setVotingModalEvent(event);
      setSelectedContender(event.votingProgress?.topContenders?.[0]?.name || event.artistName);
      setVotingSuccessMsg(null);
    } else if (event.eventType === 'fansign' || event.eventType === 'luckydraw') {
      setFansignModalEvent(event);
      setFansignSuccess(false);
      setAlbumEntryQty(3);
      setGeneratedEntryId(`WM-${event.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`);
    } else {
      // Default to concert ticket booking
      setBookedTour(event);
    }
  };

  // Submit Fansign / Lucky Draw Application
  const handleConfirmFansignEntry = () => {
    setFansignSuccess(true);
  };

  // Submit Mubeat Heart Beats Vote
  const handleCastVote = () => {
    if (!votingModalEvent) return;
    if (userHeartBeats < voteAmount) {
      alert('Not enough Heart Beats! Collect more through daily missions.');
      return;
    }
    setUserHeartBeats(prev => prev - voteAmount);
    setLocalEventVotes(prev => ({
      ...prev,
      [votingModalEvent.id]: (prev[votingModalEvent.id] || 0) + voteAmount
    }));
    setVotingSuccessMsg(`Successfully cast ${voteAmount} Heart Beats for ${selectedContender}!`);
  };

  const parseDateParts = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        return {
          month: months[d.getMonth()],
          day: String(d.getDate()).padStart(2, '0'),
          year: d.getFullYear(),
          dayOfWeek: days[d.getDay()],
        };
      }
    } catch {
      // fallback
    }
    const parts = dateStr.split('-');
    return {
      month: parts[1] ? `M${parts[1]}` : 'DATE',
      day: parts[2] || '01',
      year: parts[0] || '2026',
      dayOfWeek: 'TOUR',
    };
  };

  return (
    <section
      id="tours"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        scrollMarginTop: '110px',
      }}
      className="py-12 md:py-20 w-full border-t border-slate-100"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">

        {/* ==================== 1. Editorial Section Header ==================== */}
        <div className="mb-8">

          {/* Eyebrow & Platform Badges */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-0.5 bg-black inline-block rounded-full" />
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                <Ticket className="w-3.5 h-3.5 text-black" />
                <span>Global Fandom Events &amp; Official Schedules</span>
              </div>
            </div>

            {/* Platform Reference Pills */}
            <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono font-bold uppercase">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>Weverse Concert &amp; Live</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-50 text-pink-700 border border-pink-200 rounded">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>Withmuu Lucky Draw &amp; Fansign</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded">
                <Heart className="w-3 h-3 text-purple-500 fill-purple-500" />
                <span>Mubeat Voting &amp; Billboard</span>
              </span>
            </div>
          </div>

          {/* Heading Row: Serif Title + Search */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-5 border-b border-slate-200">
            <div>
              <h2
                style={{
                  fontFamily: activeConfig.fontFamily,
                  fontSize: 'clamp(28px, 3.2vw, 44px)',
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                World Tours, Fansigns <em className="font-normal text-slate-500 italic font-serif">&amp; Fandom Voting</em>
              </h2>
              <p className="text-[13px] text-slate-500 mt-2 font-light leading-relaxed max-w-2xl">
                Certified box office stadium tours (Weverse), authentic unreleased photocard lucky draws &amp; 1:1 video calls (Withmuu), and music show chart votes &amp; subway billboards (Mubeat).
              </p>
            </div>

            {/* Keyword Search Input */}
            <div className="relative min-w-[260px] max-w-md w-full lg:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search artist, tour, lucky draw, city..."
                className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-black transition-colors"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black cursor-pointer text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ==================== 1.5. UNIVERSE CATEGORY TABS (K-Pop Universe, Anime & Manga, Gaming Arena, All) ==================== */}
          <div className="flex items-center gap-2 pt-3 pb-1 overflow-x-auto scrollbar-none flex-nowrap">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold mr-1 shrink-0 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>UNIVERSE:</span>
            </span>
            {[
              { id: 'all', label: 'All Universes', icon: Layers, subId: 'all' },
              { id: 'K-Pop', label: 'K-Pop Universe', icon: Radio, subId: 'kpop' },
              { id: 'Anime', label: 'Anime & Manga', icon: Flame, subId: 'anime' },
              { id: 'Gaming', label: 'Gaming Arena', icon: Trophy, subId: 'gaming' },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    selectSubCategory(cat.subId);
                  }}
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase rounded-full cursor-pointer transition-all shrink-0 border ${isActive
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-black'
                    }`}
                >
                  <IconComp className={`w-3 h-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* ==================== 2. PRIMARY PLATFORM TABS (Weverse, Withmuu, Mubeat, Conventions) ==================== */}
          <div className="flex items-center gap-2 pt-3 pb-2 overflow-x-auto scrollbar-none flex-nowrap">
            {[
              { id: 'all', label: 'All Ecosystems', icon: Layers, badge: `${mockTourEvents.length}` },
              { id: 'Weverse', label: 'Weverse Live & Tours', icon: Radio, badge: 'HYBE & Tours' },
              { id: 'Withmuu', label: 'Withmuu Lucky Draw & Fansign', icon: Sparkles, badge: 'Exclusive POB' },
              { id: 'Mubeat', label: 'Mubeat Fandom Vote & Billboard', icon: Heart, badge: 'Live Chart' },
              { id: 'Official', label: 'Conventions & Tournaments', icon: Trophy, badge: 'Expo' },
            ].map(tab => {
              const isActive = selectedPlatform === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedPlatform(tab.id)}
                  type="button"
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider font-mono rounded cursor-pointer transition-all shrink-0 border ${isActive
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Event Format Filter Pills */}
          <div className="flex items-center gap-1.5 pt-2 pb-3 overflow-x-auto scrollbar-none flex-nowrap text-xs">
            <span className="text-[10px] font-mono text-slate-600 uppercase font-bold mr-1 shrink-0">FORMAT:</span>
            {[
              { id: 'all', label: 'All Formats' },
              { id: 'concert', label: '🎤 World Stadium Tour' },
              { id: 'luckydraw', label: '🎰 Lucky Draw (럭키드로우)' },
              { id: 'fansign', label: '✍️ Fansign & Video Call' },
              { id: 'voting', label: '🗳️ Live Voting & Billboard' },
              { id: 'popup', label: '🏬 Pop-Up Store' },
              { id: 'convention', label: '🎪 Convention' },
            ].map(fmt => (
              <button
                key={fmt.id}
                onClick={() => setSelectedEventType(fmt.id)}
                type="button"
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full cursor-pointer transition-colors shrink-0 ${selectedEventType === fmt.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          {/* City / Location Underline Navigation */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none pt-2 border-b border-slate-100 pb-1">
            {cities.map((c) => {
              const isActive = selectedCity === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCity(c.id)}
                  type="button"
                  className={`pb-2 text-[11px] tracking-wider uppercase font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 shrink-0 ${isActive
                      ? 'border-black text-black font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-black font-medium'
                    }`}
                >
                  <span>{c.name}</span>
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-black' : 'text-slate-600'}`}>
                    ({c.count})
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ==================== 3. Event Cards Grid ==================== */}
        {filteredEvents.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 border border-dashed border-slate-300 rounded p-8">
            <Ticket className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No events found matching your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filters or search keywords.</p>
            <button
              onClick={() => {
                setSelectedPlatform('all');
                setSelectedEventType('all');
                setSelectedCity('all');
                setSearchFilter('');
              }}
              type="button"
              className="mt-4 px-4 py-2 bg-black text-white text-xs font-mono font-bold uppercase rounded cursor-pointer hover:bg-neutral-800"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const dateParts = parseDateParts(event.date);
              const isSoldOut = event.status === 'Sold Out';
              const isVoting = event.eventType === 'voting';
              const isFansignOrLucky = event.eventType === 'fansign' || event.eventType === 'luckydraw';
              const isPopup = event.eventType === 'popup';

              // Platform badge colors
              let platformBadgeBg = '#f1f5f9';
              let platformBadgeText = '#0f172a';
              if (event.sourcePlatform === 'Weverse') {
                platformBadgeBg = '#ecfdf5';
                platformBadgeText = '#047857';
              } else if (event.sourcePlatform === 'Withmuu') {
                platformBadgeBg = '#fdf2f8';
                platformBadgeText = '#be185d';
              } else if (event.sourcePlatform === 'Mubeat') {
                platformBadgeBg = '#faf5ff';
                platformBadgeText = '#7e22ce';
              }

              // Status Badge styling
              let statusBg = '#ffffff';
              let statusColor = '#0f172a';
              let statusBorder = '#e2e8f0';
              let statusDot = '#10b981';

              if (event.status === 'Selling Fast') {
                statusBg = '#fff7ed';
                statusColor = '#c2410c';
                statusBorder = '#fdba74';
                statusDot = '#ea580c';
              } else if (event.status === 'Sold Out') {
                statusBg = '#fef2f2';
                statusColor = '#b91c1c';
                statusBorder = '#fca5a5';
                statusDot = '#dc2626';
              } else if (event.status === 'Presale Soon') {
                statusBg = '#f0f9ff';
                statusColor = '#0369a1';
                statusBorder = '#7dd3fc';
                statusDot = '#0284c7';
              } else if (event.status === 'Apply Open') {
                statusBg = '#fdf4ff';
                statusColor = '#a21caf';
                statusBorder = '#f0abfc';
                statusDot = '#d946ef';
              } else if (event.status === 'Voting Active') {
                statusBg = '#f5f3ff';
                statusColor = '#6d28d9';
                statusBorder = '#c4b5fd';
                statusDot = '#8b5cf6';
              } else if (event.status === 'Live Now') {
                statusBg = '#fef2f2';
                statusColor = '#b91c1c';
                statusBorder = '#f87171';
                statusDot = '#ef4444';
              }

              return (
                <div
                  key={event.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                  className="hover:border-black hover:shadow-xl group"
                >
                  {/* ---------- TOP SECTION: Atmosphere Banner & Badges ---------- */}
                  <div>
                    <div
                      style={{
                        position: 'relative',
                        height: '170px',
                        backgroundColor: '#0f172a',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={event.coverImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'}
                        alt={event.tourName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0.88,
                          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        className="group-hover:scale-105"
                      />

                      {/* Vignette Overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.15) 35%, rgba(15,23,42,0.95) 100%)',
                        }}
                      />

                      {/* Top Badges Row: Status + Platform Tag */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          right: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          zIndex: 10,
                        }}
                      >
                        {/* Live / Status Indicator */}
                        <span
                          style={{
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            padding: '3px 8px',
                            backgroundColor: statusBg,
                            color: statusColor,
                            border: `1px solid ${statusBorder}`,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            borderRadius: '2px',
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: statusDot,
                              display: 'inline-block',
                            }}
                            className={event.status === 'Live Now' || event.status === 'Voting Active' ? 'animate-ping' : ''}
                          />
                          <span>{event.badgeText || event.status}</span>
                        </span>

                        {/* Ecosystem Branding Tag (Weverse / Withmuu / Mubeat) */}
                        <span
                          style={{
                            fontSize: '9px',
                            fontFamily: 'monospace',
                            fontWeight: 900,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            padding: '3px 8px',
                            backgroundColor: platformBadgeBg,
                            color: platformBadgeText,
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '2px',
                          }}
                        >
                          {event.sourcePlatform || 'OFFICIAL'}
                        </span>
                      </div>

                      {/* Bottom Overlay Info: Avatar + Artist / Fandom Title */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '14px',
                          right: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          zIndex: 10,
                        }}
                      >
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            border: '2px solid #ffffff',
                            backgroundColor: '#000000',
                            overflow: 'hidden',
                            flexShrink: 0,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                            borderRadius: '4px',
                          }}
                        >
                          <img
                            src={event.artistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={event.artistName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        <div style={{ overflow: 'hidden' }}>
                          <span
                            style={{
                              fontSize: '9px',
                              fontFamily: 'monospace',
                              color: '#cbd5e1',
                              fontWeight: 700,
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              display: 'block',
                              marginBottom: '2px',
                            }}
                          >
                            {event.artistName} {event.fandomName ? `· ${event.fandomName}` : ''}
                          </span>
                          <h3
                            style={{
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontSize: '16px',
                              fontWeight: 800,
                              color: '#ffffff',
                              margin: 0,
                              letterSpacing: '-0.01em',
                              lineHeight: 1.25,
                              textShadow: '0 2px 6px rgba(0,0,0,0.7)',
                            }}
                            className="truncate group-hover:text-amber-200 transition-colors"
                          >
                            {event.tourName}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* ---------- TICKET STUB PERFORATED DIVIDER ---------- */}
                    <div
                      style={{
                        position: 'relative',
                        height: '18px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Left & Right Semicircular Ticket Notches */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-9px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          border: '1.5px solid #e2e8f0',
                          boxShadow: 'inset -2px 0 3px rgba(0,0,0,0.06)',
                          zIndex: 10,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          right: '-9px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          border: '1.5px solid #e2e8f0',
                          boxShadow: 'inset 2px 0 3px rgba(0,0,0,0.06)',
                          zIndex: 10,
                        }}
                      />
                      {/* Perforated Dashed Line */}
                      <div
                        style={{
                          width: '100%',
                          margin: '0 16px',
                          borderTop: '1.5px dashed #cbd5e1',
                        }}
                      />
                    </div>

                    {/* ---------- MIDDLE SECTION: Date, Venue, Perks & Progress ---------- */}
                    <div style={{ padding: '4px 20px 16px 20px' }}>

                      {/* Date Block + Venue Info Row */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>

                        {/* Bold Calendar Stamp */}
                        <div
                          style={{
                            width: '54px',
                            border: '1.5px solid #000000',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexShrink: 0,
                            textAlign: 'center',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <span
                            style={{
                              width: '100%',
                              backgroundColor: '#000000',
                              color: '#ffffff',
                              fontSize: '9px',
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              letterSpacing: '0.1em',
                              padding: '2px 0',
                            }}
                          >
                            {dateParts.month}
                          </span>
                          <span
                            style={{
                              fontSize: '20px',
                              fontWeight: 900,
                              fontFamily: 'monospace',
                              lineHeight: 1.1,
                              padding: '4px 0 2px 0',
                              color: '#0f172a',
                            }}
                          >
                            {dateParts.day}
                          </span>
                          <span
                            style={{
                              fontSize: '8px',
                              fontFamily: 'monospace',
                              color: '#64748b',
                              paddingBottom: '2px',
                            }}
                          >
                            {dateParts.year}
                          </span>
                        </div>

                        {/* Venue & Location Description */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                            <Calendar style={{ width: '12px', height: '12px', color: '#0f172a', flexShrink: 0 }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                              {event.date}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', marginBottom: '2px' }}>
                            <MapPin style={{ width: '12px', height: '12px', color: '#0f172a', flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }} className="truncate block">
                              {event.venue}
                            </span>
                          </div>

                          <div style={{ fontSize: '11px', color: '#64748b', paddingLeft: '17px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{event.city}, {event.country}</span>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#94a3b8',
                                display: 'inline-flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                              }}
                              title="Open Google Maps"
                              className="hover:text-black transition-colors"
                            >
                              <ArrowUpRight style={{ width: '11px', height: '11px' }} />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* SPECIAL VIEW 1: Mubeat Voting Progress Bar */}
                      {isVoting && event.votingProgress && (
                        <div className="mb-3 p-3 bg-purple-50/70 border border-purple-200/80 rounded">
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1.5 text-purple-950">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
                              <span>Live Fandom Quest</span>
                            </span>
                            <span className="text-purple-700 font-extrabold">
                              {event.votingProgress.percentage}% Achieved
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-purple-200/70 h-2 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-purple-600 transition-all duration-500 rounded-full"
                              style={{ width: `${Math.min(event.votingProgress.percentage, 100)}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono text-purple-800">
                            <span>Target: {event.votingProgress.target.toLocaleString()} Beats</span>
                            <span className="font-bold">
                              {(event.votingProgress.current + (localEventVotes[event.id] || 0)).toLocaleString()} Beats
                            </span>
                          </div>

                          {/* Contenders snippet */}
                          {event.votingProgress.topContenders && event.votingProgress.topContenders.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-purple-200/60 text-[10px] space-y-1">
                              {event.votingProgress.topContenders.slice(0, 2).map(c => (
                                <div key={c.rank} className="flex items-center justify-between text-slate-700">
                                  <span className="font-semibold truncate max-w-[170px]">
                                    #{c.rank} {c.name}
                                  </span>
                                  <span className="font-mono font-bold text-purple-900">{c.percentage}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* SPECIAL VIEW 2: Withmuu Fansign & Lucky Draw Period & Quota */}
                      {isFansignOrLucky && (
                        <div className="mb-3 p-2.5 bg-pink-50/60 border border-pink-200/80 rounded text-[11px]">
                          <div className="flex items-center justify-between font-mono font-bold text-pink-900 mb-1">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-pink-600" />
                              <span>{event.eventType === 'luckydraw' ? 'Lucky Draw Photocard' : 'Official Fansign Raffle'}</span>
                            </span>
                            {event.winnerCount && (
                              <span className="bg-pink-200 text-pink-800 px-1.5 py-0.5 rounded text-[10px] font-extrabold">
                                {event.winnerCount} WINNERS
                              </span>
                            )}
                          </div>
                          {event.applyPeriod && (
                            <p className="text-[10px] text-pink-800 m-0 font-mono">
                              Period: <strong>{event.applyPeriod}</strong>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Event Perks Micro-Badges */}
                      {event.perks && event.perks.length > 0 && (
                        <div
                          style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #f1f5f9',
                            padding: '8px 10px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            borderRadius: '3px',
                          }}
                        >
                          {event.perks.map((perk, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '9px',
                                fontFamily: 'monospace',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                padding: '2px 6px',
                                color: '#475569',
                                fontWeight: 600,
                                borderRadius: '2px',
                              }}
                            >
                              ✦ {perk}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* ---------- BOTTOM SECTION: Pricing & Action CTA ---------- */}
                  <div
                    style={{
                      padding: '14px 20px',
                      borderTop: '1px solid #f1f5f9',
                      backgroundColor: '#fafafa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '9px',
                          fontFamily: 'monospace',
                          color: '#94a3b8',
                          textTransform: 'uppercase',
                          fontWeight: 800,
                          letterSpacing: '0.1em',
                          display: 'block',
                        }}
                      >
                        {isVoting ? 'VOTING CURRENCY' : isFansignOrLucky ? 'ALBUM ENTRY' : 'PASS PRICE'}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: '17px',
                          fontWeight: 800,
                          color: '#0f172a',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {isVoting
                          ? 'Heart Beats (Free)'
                          : event.ticketPriceFromUSD === 0
                            ? 'Free RSVP'
                            : formatPrice(event.ticketPriceFromUSD, event.ticketPriceFromVND)
                        }
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenAction(event)}
                      disabled={isSoldOut}
                      type="button"
                      style={{
                        height: '38px',
                        padding: '0 16px',
                        backgroundColor: isSoldOut
                          ? '#e2e8f0'
                          : isVoting
                            ? '#7e22ce'
                            : isFansignOrLucky
                              ? '#be185d'
                              : '#000000',
                        color: isSoldOut ? '#94a3b8' : '#ffffff',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: isSoldOut ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        flexShrink: 0,
                        borderRadius: '3px',
                      }}
                      className={!isSoldOut ? "hover:opacity-90 active:scale-95 shadow-sm" : ""}
                    >
                      {isVoting ? (
                        <>
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span>Vote Now</span>
                        </>
                      ) : isFansignOrLucky ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{event.eventType === 'luckydraw' ? 'Lucky Draw' : 'Apply Fansign'}</span>
                        </>
                      ) : (
                        <>
                          <Ticket style={{ width: '13px', height: '13px' }} />
                          <span>{isSoldOut ? 'Sold Out' : 'Get Tickets'}</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ==================== 4. MODAL 1: VIP CONCERT PASS DISPATCH MODAL ==================== */}
        {bookedTour && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setBookedTour(null)}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                maxWidth: '460px',
                width: '100%',
                border: '2px solid #000000',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Banner */}
              <div
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    VIP CONCERT PASS DISPATCH · WEVERSE VERIFIED
                  </span>
                </div>
                <button
                  onClick={() => setBookedTour(null)}
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  className="hover:text-white"
                  aria-label="Close modal"
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto',
                      borderRadius: '50%',
                    }}
                  >
                    <Check style={{ width: '24px', height: '24px' }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: '0 0 6px 0',
                    }}
                  >
                    Concert Reservation Confirmed!
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    You have selected <strong>{bookedTour.tourName}</strong> in <strong>{bookedTour.city}</strong> ({bookedTour.venue}) on {bookedTour.date}.
                  </p>
                </div>

                {/* Ticket Stub Simulation */}
                <div
                  style={{
                    border: '1.5px solid #000000',
                    backgroundColor: '#f8fafc',
                    padding: '16px',
                    marginBottom: '18px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>ARTIST / TOUR</span>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: '#0f172a' }}>{bookedTour.artistName}</h4>
                    </div>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', backgroundColor: '#000', color: '#fff', padding: '2px 6px', fontWeight: 800 }}>
                      PASS #{bookedTour.id.toUpperCase()}-2026
                    </span>
                  </div>

                  {/* Tier Selection */}
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                      SELECT SEATING TIER:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                      {['VIP Soundcheck Floor', 'Tier 1 Lower', 'General Adm'].map((tier) => (
                        <button
                          key={tier}
                          onClick={() => setSelectedTier(tier)}
                          type="button"
                          style={{
                            padding: '6px 4px',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            fontWeight: selectedTier === tier ? 800 : 600,
                            border: '1px solid #000',
                            backgroundColor: selectedTier === tier ? '#000' : '#fff',
                            color: selectedTier === tier ? '#fff' : '#000',
                            cursor: 'pointer',
                          }}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Code */}
                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fde68a',
                      fontSize: '11px',
                      color: '#92400e',
                    }}
                  >
                    🎫 Official Fan Club Pre-sale Priority code: <strong>FANHUB-VIP-99</strong>
                  </div>

                  {/* Barcode */}
                  <div style={{ marginTop: '12px', textAlign: 'center', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '15px', letterSpacing: '4px', color: '#000', fontWeight: 900 }}>
                      ||| | || |||| | ||| || |||||| | ||
                    </div>
                    <span style={{ fontSize: '8px', fontFamily: 'monospace', color: '#94a3b8' }}>
                      ENCRYPTED WEVERSE BARCODE · 100% VERIFIED AUTHENTIC
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setBookedTour(null)}
                  type="button"
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                  className="hover:bg-neutral-800"
                >
                  Close Pass
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. MODAL 2: WITHMUU FANSIGN & LUCKY DRAW APPLICATION MODAL ==================== */}
        {fansignModalEvent && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setFansignModalEvent(null)}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                maxWidth: '480px',
                width: '100%',
                border: '2px solid #be185d',
                boxShadow: '0 25px 50px -12px rgba(190, 24, 93, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  backgroundColor: '#be185d',
                  color: '#ffffff',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles style={{ width: '16px', height: '16px', color: '#fbcfe8' }} />
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    WITHMUU EVENT ENTRY · {fansignModalEvent.eventType === 'luckydraw' ? 'LUCKY DRAW' : 'FANSIGN'}
                  </span>
                </div>
                <button
                  onClick={() => setFansignModalEvent(null)}
                  type="button"
                  className="text-pink-200 hover:text-white cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {!fansignSuccess ? (
                  <>
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase text-pink-700 font-bold block">
                        {fansignModalEvent.artistName} · {fansignModalEvent.organizer}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2 leading-tight">
                        {fansignModalEvent.tourName}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {fansignModalEvent.description}
                      </p>
                    </div>

                    {/* Entry Quantity Calculator */}
                    <div className="bg-pink-50/70 border border-pink-200 p-3.5 rounded mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-pink-950">Album Entry Count:</span>
                        <div className="flex items-center gap-2">
                          {[1, 3, 5, 10].map(qty => (
                            <button
                              key={qty}
                              type="button"
                              onClick={() => setAlbumEntryQty(qty)}
                              className={`px-2.5 py-1 text-xs font-mono font-bold rounded cursor-pointer ${albumEntryQty === qty
                                  ? 'bg-pink-700 text-white'
                                  : 'bg-white border border-pink-300 text-pink-800 hover:bg-pink-100'
                                }`}
                            >
                              {qty}x
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="text-[11px] text-pink-800 font-mono space-y-1 pt-1 border-t border-pink-200/70">
                        <div className="flex justify-between">
                          <span>Total Entries:</span>
                          <strong>{albumEntryQty} Raffle Chances</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Guaranteed Photocards:</span>
                          <strong>{albumEntryQty} Unreleased Hologram Cards</strong>
                        </div>
                        <div className="flex justify-between font-bold text-pink-900 pt-1">
                          <span>Estimated Total:</span>
                          <span>{formatPrice(fansignModalEvent.ticketPriceFromUSD * albumEntryQty, fansignModalEvent.ticketPriceFromVND * albumEntryQty)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Applicant Form */}
                    <div className="space-y-3 mb-5 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                          Full Name (as on Passport):
                        </label>
                        <input
                          type="text"
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:border-pink-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                          Video Call / Contact Handle:
                        </label>
                        <input
                          type="text"
                          value={applicantContact}
                          onChange={(e) => setApplicantContact(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:border-pink-600"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmFansignEntry}
                      type="button"
                      className="w-full py-3 bg-pink-700 hover:bg-pink-800 text-white text-xs font-mono font-bold uppercase tracking-wider rounded cursor-pointer transition-colors shadow-sm"
                    >
                      Confirm Entry &amp; Generate Voucher
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-pink-100 text-pink-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Withmuu Entry Registered!</h3>
                    <p className="text-xs text-slate-600 mb-4">
                      Your entry for <strong>{fansignModalEvent.tourName}</strong> has been registered.
                    </p>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded font-mono text-left text-xs space-y-1.5 mb-5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">ENTRY ID:</span>
                        <strong className="text-pink-700">{generatedEntryId}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">APPLICANT:</span>
                        <strong className="text-slate-800">{applicantName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">RAFFLE ENTRIES:</span>
                        <strong className="text-slate-800">{albumEntryQty} Entries ({albumEntryQty} Photocards)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">ANNOUNCEMENT:</span>
                        <strong className="text-slate-800">{fansignModalEvent.winnerAnnouncementDate || 'See event notice'}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setFansignModalEvent(null)}
                      type="button"
                      className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-mono font-bold uppercase rounded cursor-pointer"
                    >
                      Done &amp; Return
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. MODAL 3: MUBEAT HEART BEATS VOTING MODAL ==================== */}
        {votingModalEvent && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setVotingModalEvent(null)}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                maxWidth: '480px',
                width: '100%',
                border: '2px solid #7e22ce',
                boxShadow: '0 25px 50px -12px rgba(126, 34, 206, 0.35)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  backgroundColor: '#7e22ce',
                  color: '#ffffff',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart style={{ width: '16px', height: '16px', color: '#f3e8ff', fill: '#f3e8ff' }} />
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    MUBEAT HEART BEATS LIVE VOTE
                  </span>
                </div>
                <button
                  onClick={() => setVotingModalEvent(null)}
                  type="button"
                  className="text-purple-200 hover:text-white cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-purple-700 font-bold block">
                    {votingModalEvent.organizer}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                    {votingModalEvent.tourName}
                  </h3>
                </div>

                {/* User's Heart Beats Balance Card */}
                <div className="p-3.5 bg-purple-50 border border-purple-200 rounded flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-purple-700 uppercase font-bold block">Available Balance</span>
                    <div className="flex items-center gap-1.5 text-lg font-black text-purple-950 font-mono">
                      <Heart className="w-4 h-4 text-purple-600 fill-purple-600" />
                      <span>{userHeartBeats.toLocaleString()} Heart Beats</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUserHeartBeats(prev => prev + 500)}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-mono font-bold rounded cursor-pointer"
                  >
                    +500 Free Beats
                  </button>
                </div>

                {/* Candidate Selection */}
                {votingModalEvent.votingProgress?.topContenders && (
                  <div className="mb-4">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-2">
                      Select Nominee / Fandom Base:
                    </label>
                    <div className="space-y-1.5">
                      {votingModalEvent.votingProgress.topContenders.map(c => (
                        <button
                          key={c.rank}
                          type="button"
                          onClick={() => setSelectedContender(c.name)}
                          className={`w-full p-2.5 rounded text-left border flex items-center justify-between cursor-pointer transition-colors text-xs ${selectedContender === c.name
                              ? 'bg-purple-100/70 border-purple-600 text-purple-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-[10px] flex items-center justify-center font-bold">
                              {c.rank}
                            </span>
                            <span>{c.name}</span>
                          </div>
                          <span className="font-mono text-purple-700 font-bold">{c.percentage}%</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vote Amount Presets */}
                <div className="mb-5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1.5">
                    Select Heart Beats to Cast:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 50, 100, 500].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setVoteAmount(amt)}
                        className={`py-2 text-xs font-mono font-bold rounded border cursor-pointer ${voteAmount === amt
                            ? 'bg-purple-700 text-white border-purple-700'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                      >
                        +{amt} Beats
                      </button>
                    ))}
                  </div>
                </div>

                {votingSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded mb-4 flex items-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{votingSuccessMsg}</span>
                  </div>
                )}

                <button
                  onClick={handleCastVote}
                  type="button"
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white text-xs font-mono font-bold uppercase tracking-wider rounded cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Cast {voteAmount} Heart Beats</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
