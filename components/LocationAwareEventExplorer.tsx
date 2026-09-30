'use client';

import QRCode from 'react-qr-code';
import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';

const RealGpsMap = dynamic(() => import('./RealGpsMap'), { 
  ssr: false, 
  loading: () => <div className="w-full h-[460px] flex items-center justify-center bg-slate-900 text-slate-400 font-mono font-bold">Loading GPS Radar Map...</div> 
});

const Map = dynamic(() => import('./Map'), { 
  ssr: false, 
  loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 font-mono font-bold">Loading Map...</div> 
});

import { SeatMapBookingModal } from './SeatMapBookingModal';

import { 
  MapPin, 
  Navigation, 
  Compass, 
  Calendar as CalendarIcon, 
  Clock, 
  Ticket, 
  ExternalLink, 
  Radio, 
  Users, 
  Check, 
  X, 
  Search, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Coffee, 
  Heart, 
  Globe, 
  LocateFixed, 
  Eye, 
  Share2, 
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  QrCode,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { 
  LocationEvent, 
  CITIES_CONFIG, 
  mockLocationEvents, 
  calculateDistanceKm 
} from '../data/locationEventsData';
import { useActiveFandom, getFandomThemeKeyFromCategory, getFandomCategoryFromTheme } from '../utils/fandomTheme';

interface LocationAwareEventExplorerProps {
  fandomCategory?: string;
}

export const LocationAwareEventExplorer: React.FC<LocationAwareEventExplorerProps> = ({ fandomCategory: propFandomCategory }) => {
  const { formatPrice } = useCartWishlist();
  const { themeKey, category } = useActiveFandom();

  // Internal reactive theme key that syncs with props and window events
  const [internalCategory, setInternalCategory] = useState<string>(() => propFandomCategory || category || 'all');

  useEffect(() => {
    if (propFandomCategory) {
      setInternalCategory(propFandomCategory);
    }
  }, [propFandomCategory]);

  useEffect(() => {
    const handleFandomChange = (e: any) => {
      if (e?.detail?.category) {
        setInternalCategory(e.detail.category);
      } else if (e?.detail?.theme) {
        setInternalCategory(getFandomCategoryFromTheme(e.detail.theme));
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('fandom-theme-change', handleFandomChange);
      return () => window.removeEventListener('fandom-theme-change', handleFandomChange);
    }
  }, []);

  const effectiveThemeKey = useMemo(() => {
    const cat = (internalCategory || propFandomCategory || category || '').toLowerCase();
    if (cat.includes('comic')) return 'comics';
    if (cat.includes('manga')) return 'manga';
    if (cat.includes('anime')) return 'anime';
    if (cat.includes('game') || cat.includes('gaming')) return 'gaming';
    if (cat.includes('movie') || cat.includes('cinema')) return 'cinema';
    if (cat.includes('tv')) return 'tv';
    if (cat.includes('cosplay')) return 'cosplay';
    if (themeKey && themeKey !== 'all') return themeKey;
    return 'kpop';
  }, [internalCategory, propFandomCategory, category, themeKey]);

  const isComics = effectiveThemeKey === 'comics';
  const isManga = effectiveThemeKey === 'manga';
  const isAnime = effectiveThemeKey === 'anime';
  const isGaming = effectiveThemeKey === 'gaming';
  const isCosplay = effectiveThemeKey === 'cosplay';
  const isCinema = effectiveThemeKey === 'cinema';
  const isTv = effectiveThemeKey === 'tv';
  const isDark = isGaming || isCinema || isTv || isCosplay;

  // Unified theme tokens across all 8 fandom categories
  const themeTokens = useMemo(() => {
    if (isGaming) {
      return {
        key: 'gaming',
        sectionBg: '#050508',
        sectionBorder: 'border-t border-b border-[#00f0ff]/40',
        textColor: 'text-white',
        textMuted: 'text-cyan-200/70',
        headingFont: "'JetBrains Mono', monospace",
        accentHex: '#00f0ff',
        accentText: 'text-[#00f0ff]',
        eyebrowBox: 'bg-black text-[#00f0ff] border-2 border-[#00f0ff] shadow-[2px_2px_0px_#00f0ff]',
        eyebrowDot: 'bg-[#00f0ff]',
        switcherBox: 'bg-[#0a0a12] border-2 border-[#00f0ff]/60 shadow-[3px_3px_0px_#00f0ff]',
        btnActive: 'bg-[#00f0ff] text-black font-extrabold shadow-[2px_2px_0px_#ffffff]',
        btnInactive: 'text-cyan-300 hover:text-white hover:bg-cyan-950/60 font-bold',
        gpsBar: 'bg-[#0b0c16] border-2 border-[#00f0ff] shadow-[4px_4px_0px_#00f0ff]',
        gpsBtn: 'bg-[#00f0ff] hover:bg-[#38bdf8] text-black border-2 border-black font-extrabold shadow-[2px_2px_0px_#ffffff]',
        coordBadge: 'bg-[#050508] border-2 border-[#00f0ff]/50 text-cyan-300 font-mono font-bold',
        cityActive: 'bg-[#00f0ff] text-black border-2 border-white shadow-[2px_2px_0px_#00ff66] font-extrabold',
        cityInactive: 'bg-[#121324] text-cyan-200 border border-[#00f0ff]/40 hover:bg-cyan-950',
        filterBox: 'bg-[#0b0c16] border-2 border-[#00f0ff]/60 shadow-[2px_2px_0px_#00f0ff]',
        radiusActive: 'bg-[#00f0ff] text-black border-2 border-white shadow-[2px_2px_0px_#00ff66] font-extrabold',
        radiusInactive: 'bg-[#0b0c16] border-2 border-[#00f0ff]/40 text-cyan-300 hover:bg-cyan-950 font-bold',
        searchBox: 'bg-[#050508] border-2 border-[#00f0ff] text-white placeholder-cyan-500/50 shadow-[2px_2px_0px_#00f0ff]',
        cardBg: 'bg-[#0b0c16] border-2 border-[#00f0ff] shadow-[5px_5px_0px_#00f0ff]',
        cardSubtleBorder: 'border-[#00f0ff]/30',
        cardTitleColor: 'text-white',
        primaryBtn: 'bg-[#00f0ff] hover:bg-white text-black border-2 border-black shadow-[3px_3px_0px_#00ff66] font-extrabold',
        secondaryBtn: 'bg-[#121324] border-2 border-[#00f0ff] text-cyan-300 hover:bg-[#00f0ff] hover:text-black shadow-[2px_2px_0px_#00f0ff]',
        badgeDistance: 'bg-black text-[#00ff66] border-2 border-[#00ff66]',
        perkChip: 'bg-[#050508] text-cyan-300 border border-[#00f0ff]/60 font-mono',
        listItemActive: 'bg-[#16182e] border-2 border-[#00f0ff] text-white shadow-[3px_3px_0px_#00f0ff]',
        listItemInactive: 'bg-[#0b0c16] border border-[#00f0ff]/30 hover:border-[#00f0ff] text-slate-200',
        modalBg: 'bg-[#080910] border-3 border-[#00f0ff] shadow-[8px_8px_0px_#00f0ff] text-white',
      };
    }

    if (isCinema) {
      return {
        key: 'cinema',
        sectionBg: '#09090b',
        sectionBorder: 'border-t border-b border-[#d4af37]/40',
        textColor: 'text-zinc-100',
        textMuted: 'text-neutral-400',
        headingFont: "'Playfair Display', Georgia, serif",
        accentHex: '#d4af37',
        accentText: 'text-[#d4af37]',
        eyebrowBox: 'bg-[#121215] text-[#d4af37] border-2 border-[#d4af37] shadow-[2px_2px_0px_#d4af37]',
        eyebrowDot: 'bg-[#d4af37]',
        switcherBox: 'bg-[#141418] border-2 border-[#d4af37]/60 shadow-[3px_3px_0px_#d4af37]',
        btnActive: 'bg-[#d4af37] text-black font-extrabold shadow-[2px_2px_0px_#ffffff]',
        btnInactive: 'text-[#d4af37]/80 hover:text-white hover:bg-neutral-800 font-bold',
        gpsBar: 'bg-[#121216] border-2 border-[#d4af37] shadow-[4px_4px_0px_#d4af37]',
        gpsBtn: 'bg-[#d4af37] hover:bg-[#e6c35c] text-black border-2 border-black font-extrabold shadow-[2px_2px_0px_#ffffff]',
        coordBadge: 'bg-[#09090b] border-2 border-[#d4af37]/50 text-amber-200 font-mono font-bold',
        cityActive: 'bg-[#d4af37] text-black border-2 border-white shadow-[2px_2px_0px_#d4af37] font-extrabold',
        cityInactive: 'bg-[#1a1a20] text-amber-100/80 border border-[#d4af37]/30 hover:bg-neutral-800',
        filterBox: 'bg-[#121216] border-2 border-[#d4af37]/60 shadow-[2px_2px_0px_#d4af37]',
        radiusActive: 'bg-[#d4af37] text-black border-2 border-white shadow-[2px_2px_0px_#d4af37] font-extrabold',
        radiusInactive: 'bg-[#121216] border-2 border-[#d4af37]/40 text-amber-200 hover:bg-neutral-800 font-bold',
        searchBox: 'bg-[#09090b] border-2 border-[#d4af37] text-white placeholder-amber-400/40 shadow-[2px_2px_0px_#d4af37]',
        cardBg: 'bg-[#121216] border-2 border-[#d4af37] shadow-[5px_5px_0px_#d4af37]',
        cardSubtleBorder: 'border-[#d4af37]/30',
        cardTitleColor: 'text-white',
        primaryBtn: 'bg-[#d4af37] hover:bg-amber-300 text-black border-2 border-black shadow-[3px_3px_0px_#ffffff] font-extrabold',
        secondaryBtn: 'bg-[#1c1c22] border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black shadow-[2px_2px_0px_#d4af37]',
        badgeDistance: 'bg-black text-[#d4af37] border-2 border-[#d4af37]',
        perkChip: 'bg-[#09090b] text-[#d4af37] border border-[#d4af37]/50 font-serif',
        listItemActive: 'bg-[#1f1f28] border-2 border-[#d4af37] text-white shadow-[3px_3px_0px_#d4af37]',
        listItemInactive: 'bg-[#121216] border border-[#d4af37]/30 hover:border-[#d4af37] text-zinc-300',
        modalBg: 'bg-[#0f0f13] border-3 border-[#d4af37] shadow-[8px_8px_0px_#d4af37] text-white',
      };
    }

    if (isManga) {
      return {
        key: 'manga',
        sectionBg: '#fdfbf7',
        sectionBorder: 'border-t-2 border-b-2 border-[#2d2d2d]',
        textColor: 'text-[#2d2d2d]',
        textMuted: 'text-[#555555]',
        headingFont: "'Kalam', cursive, sans-serif",
        accentHex: '#ff4d4d',
        accentText: 'text-[#ff4d4d]',
        eyebrowBox: 'bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]',
        eyebrowDot: 'bg-[#ffd60a]',
        switcherBox: 'bg-white border-2 border-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d]',
        btnActive: 'bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d] font-bold',
        btnInactive: 'text-[#2d2d2d] hover:bg-[#fff0f0] font-bold',
        gpsBar: 'bg-white border-3 border-[#2d2d2d] shadow-[4px_4px_0px_#2d2d2d]',
        gpsBtn: 'bg-[#ff4d4d] hover:bg-[#e03a3a] text-white border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d] font-bold',
        coordBadge: 'bg-[#fdfbf7] border-2 border-[#2d2d2d] text-[#2d2d2d] font-mono font-bold',
        cityActive: 'bg-[#ffd60a] text-black border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d] font-bold',
        cityInactive: 'bg-white text-[#2d2d2d] border border-[#2d2d2d] hover:bg-[#fff0f0]',
        filterBox: 'bg-white border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]',
        radiusActive: 'bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d] font-bold',
        radiusInactive: 'bg-white border-2 border-[#2d2d2d] text-[#2d2d2d] hover:bg-[#fff0f0] font-bold',
        searchBox: 'bg-white border-2 border-[#2d2d2d] text-[#2d2d2d] placeholder-slate-400 shadow-[2px_2px_0px_#2d2d2d]',
        cardBg: 'bg-white border-3 border-[#2d2d2d] shadow-[5px_5px_0px_#2d2d2d]',
        cardSubtleBorder: 'border-[#2d2d2d]/30',
        cardTitleColor: 'text-[#2d2d2d]',
        primaryBtn: 'bg-[#ff4d4d] hover:bg-[#e03a3a] text-white border-2 border-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d] font-bold',
        secondaryBtn: 'bg-white border-2 border-[#2d2d2d] text-[#2d2d2d] hover:bg-[#fff0f0] shadow-[2px_2px_0px_#2d2d2d]',
        badgeDistance: 'bg-[#ffd60a] text-black border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]',
        perkChip: 'bg-[#fff0f0] text-[#ff4d4d] border border-[#2d2d2d] font-bold',
        listItemActive: 'bg-[#ffd60a] border-2 border-[#2d2d2d] text-black shadow-[3px_3px_0px_#2d2d2d]',
        listItemInactive: 'bg-white border-2 border-[#2d2d2d] hover:bg-[#fff0f0] text-[#2d2d2d]',
        modalBg: 'bg-[#fdfbf7] border-3 border-[#2d2d2d] shadow-[8px_8px_0px_#2d2d2d] text-[#2d2d2d]',
      };
    }

    if (isAnime) {
      return {
        key: 'anime',
        sectionBg: '#f8fafc',
        sectionBorder: 'border-t-3 border-b-3 border-black',
        textColor: 'text-black',
        textMuted: 'text-slate-600',
        headingFont: "'Space Grotesk', sans-serif",
        accentHex: '#ccff00',
        accentText: 'text-[#ff0055]',
        eyebrowBox: 'bg-[#ffd60a] text-black border-2 border-black font-black shadow-[2px_2px_0px_#000000]',
        eyebrowDot: 'bg-[#ff0055]',
        switcherBox: 'bg-white border-2 border-black shadow-[3px_3px_0px_#000000]',
        btnActive: 'bg-[#ccff00] text-black border-2 border-black shadow-[2px_2px_0px_#000000] font-black',
        btnInactive: 'text-black hover:bg-[#fefce8] font-bold',
        gpsBar: 'bg-white border-3 border-black shadow-[4px_4px_0px_#ccff00]',
        gpsBtn: 'bg-[#ccff00] hover:bg-[#b8e600] text-black border-2 border-black shadow-[2px_2px_0px_#000000] font-black',
        coordBadge: 'bg-[#fefce8] border-2 border-black text-black font-mono font-bold',
        cityActive: 'bg-[#ccff00] text-black border-2 border-black shadow-[2px_2px_0px_#000000] font-black',
        cityInactive: 'bg-white text-black border border-black hover:bg-[#fefce8]',
        filterBox: 'bg-white border-2 border-black shadow-[2px_2px_0px_#000000]',
        radiusActive: 'bg-[#ccff00] text-black border-2 border-black shadow-[2px_2px_0px_#000000] font-black',
        radiusInactive: 'bg-white border-2 border-black text-black hover:bg-[#fefce8] font-bold',
        searchBox: 'bg-white border-2 border-black text-black placeholder-slate-400 shadow-[2px_2px_0px_#000000]',
        cardBg: 'bg-white border-3 border-black shadow-[6px_6px_0px_#ccff00]',
        cardSubtleBorder: 'border-black/30',
        cardTitleColor: 'text-black',
        primaryBtn: 'bg-[#ccff00] hover:bg-[#b8e600] text-black border-2 border-black shadow-[3px_3px_0px_#000000] font-black',
        secondaryBtn: 'bg-white border-2 border-black text-black hover:bg-[#fefce8] shadow-[2px_2px_0px_#000000]',
        badgeDistance: 'bg-[#ffd60a] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
        perkChip: 'bg-[#fefce8] text-black border border-black font-bold',
        listItemActive: 'bg-[#ccff00] border-2 border-black text-black shadow-[3px_3px_0px_#000000]',
        listItemInactive: 'bg-white border-2 border-black hover:bg-[#fefce8] text-black',
        modalBg: 'bg-white border-4 border-black shadow-[8px_8px_0px_#ccff00] text-black',
      };
    }

    if (isTv) {
      return {
        key: 'tv',
        sectionBg: '#090d16',
        sectionBorder: 'border-t border-b border-[#8b5cf6]/40',
        textColor: 'text-slate-100',
        textMuted: 'text-slate-400',
        headingFont: "'Space Grotesk', sans-serif",
        accentHex: '#8b5cf6',
        accentText: 'text-[#8b5cf6]',
        eyebrowBox: 'bg-[#151226] text-[#c084fc] border-2 border-[#8b5cf6] shadow-[2px_2px_0px_#8b5cf6]',
        eyebrowDot: 'bg-[#c084fc]',
        switcherBox: 'bg-[#121624] border-2 border-[#8b5cf6]/60 shadow-[3px_3px_0px_#8b5cf6]',
        btnActive: 'bg-[#8b5cf6] text-white font-extrabold shadow-[2px_2px_0px_#ffffff]',
        btnInactive: 'text-purple-300 hover:text-white hover:bg-purple-950/60 font-bold',
        gpsBar: 'bg-[#121624] border-2 border-[#8b5cf6] shadow-[4px_4px_0px_#8b5cf6]',
        gpsBtn: 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white border-2 border-black font-extrabold shadow-[2px_2px_0px_#ffffff]',
        coordBadge: 'bg-[#090d16] border-2 border-[#8b5cf6]/50 text-purple-200 font-mono font-bold',
        cityActive: 'bg-[#8b5cf6] text-white border-2 border-white shadow-[2px_2px_0px_#c084fc] font-extrabold',
        cityInactive: 'bg-[#161c30] text-purple-200 border border-[#8b5cf6]/40 hover:bg-purple-950',
        filterBox: 'bg-[#121624] border-2 border-[#8b5cf6]/60 shadow-[2px_2px_0px_#8b5cf6]',
        radiusActive: 'bg-[#8b5cf6] text-white border-2 border-white shadow-[2px_2px_0px_#c084fc] font-extrabold',
        radiusInactive: 'bg-[#121624] border-2 border-[#8b5cf6]/40 text-purple-300 hover:bg-purple-950 font-bold',
        searchBox: 'bg-[#090d16] border-2 border-[#8b5cf6] text-white placeholder-purple-400/40 shadow-[2px_2px_0px_#8b5cf6]',
        cardBg: 'bg-[#121624] border-2 border-[#8b5cf6] shadow-[5px_5px_0px_#8b5cf6]',
        cardSubtleBorder: 'border-[#8b5cf6]/30',
        cardTitleColor: 'text-white',
        primaryBtn: 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white border-2 border-black shadow-[3px_3px_0px_#ffffff] font-extrabold',
        secondaryBtn: 'bg-[#1a2035] border-2 border-[#8b5cf6] text-purple-300 hover:bg-[#8b5cf6] hover:text-white shadow-[2px_2px_0px_#8b5cf6]',
        badgeDistance: 'bg-black text-[#c084fc] border-2 border-[#8b5cf6]',
        perkChip: 'bg-[#090d16] text-purple-300 border border-[#8b5cf6]/50 font-mono',
        listItemActive: 'bg-[#202742] border-2 border-[#8b5cf6] text-white shadow-[3px_3px_0px_#8b5cf6]',
        listItemInactive: 'bg-[#121624] border border-[#8b5cf6]/30 hover:border-[#8b5cf6] text-slate-200',
        modalBg: 'bg-[#0d101a] border-3 border-[#8b5cf6] shadow-[8px_8px_0px_#8b5cf6] text-white',
      };
    }

    if (isCosplay) {
      return {
        key: 'cosplay',
        sectionBg: '#101014',
        sectionBorder: 'border-t-2 border-b-2 border-[#D02020]',
        textColor: 'text-slate-100',
        textMuted: 'text-slate-400',
        headingFont: "'Space Grotesk', sans-serif",
        accentHex: '#D02020',
        accentText: 'text-[#D02020]',
        eyebrowBox: 'bg-[#D02020] text-white border-2 border-white shadow-[2px_2px_0px_#D02020]',
        eyebrowDot: 'bg-[#ffd60a]',
        switcherBox: 'bg-[#18181f] border-2 border-[#D02020] shadow-[3px_3px_0px_#D02020]',
        btnActive: 'bg-[#D02020] text-white font-extrabold shadow-[2px_2px_0px_#ffffff]',
        btnInactive: 'text-rose-300 hover:text-white hover:bg-rose-950/60 font-bold',
        gpsBar: 'bg-[#18181f] border-2 border-[#D02020] shadow-[4px_4px_0px_#D02020]',
        gpsBtn: 'bg-[#D02020] hover:bg-[#b01818] text-white border-2 border-white font-extrabold shadow-[2px_2px_0px_#ffffff]',
        coordBadge: 'bg-[#101014] border-2 border-[#D02020]/60 text-rose-200 font-mono font-bold',
        cityActive: 'bg-[#D02020] text-white border-2 border-white shadow-[2px_2px_0px_#ffd60a] font-extrabold',
        cityInactive: 'bg-[#22222c] text-rose-200 border border-[#D02020]/40 hover:bg-rose-950',
        filterBox: 'bg-[#18181f] border-2 border-[#D02020] shadow-[2px_2px_0px_#D02020]',
        radiusActive: 'bg-[#D02020] text-white border-2 border-white shadow-[2px_2px_0px_#ffd60a] font-extrabold',
        radiusInactive: 'bg-[#18181f] border-2 border-[#D02020]/40 text-rose-300 hover:bg-rose-950 font-bold',
        searchBox: 'bg-[#101014] border-2 border-[#D02020] text-white placeholder-rose-400/40 shadow-[2px_2px_0px_#D02020]',
        cardBg: 'bg-[#18181f] border-2 border-[#D02020] shadow-[5px_5px_0px_#D02020]',
        cardSubtleBorder: 'border-[#D02020]/40',
        cardTitleColor: 'text-white',
        primaryBtn: 'bg-[#D02020] hover:bg-[#b01818] text-white border-2 border-white shadow-[3px_3px_0px_#ffd60a] font-extrabold',
        secondaryBtn: 'bg-[#22222c] border-2 border-[#D02020] text-rose-300 hover:bg-[#D02020] hover:text-white shadow-[2px_2px_0px_#D02020]',
        badgeDistance: 'bg-black text-[#ffd60a] border-2 border-[#D02020]',
        perkChip: 'bg-[#101014] text-rose-300 border border-[#D02020]/60 font-mono',
        listItemActive: 'bg-[#2a2a38] border-2 border-[#D02020] text-white shadow-[3px_3px_0px_#D02020]',
        listItemInactive: 'bg-[#18181f] border border-[#D02020]/30 hover:border-[#D02020] text-slate-200',
        modalBg: 'bg-[#121217] border-3 border-[#D02020] shadow-[8px_8px_0px_#D02020] text-white',
      };
    }

    if (isComics) {
      return {
        key: 'comics',
        sectionBg: '#fffdf0',
        sectionBorder: 'border-t-3 border-b-3 border-black',
        textColor: 'text-black',
        textMuted: 'text-slate-700',
        headingFont: "var(--font-bangers), 'Bangers', cursive, sans-serif",
        accentHex: '#ef4444',
        accentText: 'text-[#ef4444]',
        eyebrowBox: 'bg-[#ffd60a] text-black border-2 border-black font-mono shadow-[2px_2px_0px_#000000]',
        eyebrowDot: 'bg-[#ef4444]',
        switcherBox: 'bg-white border-2 border-black shadow-[3px_3px_0px_#000000]',
        btnActive: 'bg-[#ef4444] text-white border-2 border-black shadow-[2px_2px_0px_#000000] font-bold',
        btnInactive: 'text-black hover:bg-[#fef9c3] font-bold',
        gpsBar: 'bg-white border-3 border-black shadow-[4px_4px_0px_#000000]',
        gpsBtn: 'bg-[#ef4444] hover:bg-[#dc2626] text-white border-2 border-black shadow-[3px_3px_0px_#000000] font-bold',
        coordBadge: 'bg-[#fffdf0] border-2 border-black text-black font-mono font-bold',
        cityActive: 'bg-[#ffd60a] text-black border-2 border-black shadow-[2px_2px_0px_#000000] font-bold',
        cityInactive: 'bg-white text-black border border-black hover:bg-[#fef9c3]',
        filterBox: 'bg-white border-2 border-black shadow-[2px_2px_0px_#000000]',
        radiusActive: 'bg-[#ef4444] text-white border-2 border-black shadow-[2px_2px_0px_#000000] font-bold',
        radiusInactive: 'bg-white border-2 border-black text-black hover:bg-[#fef9c3] font-bold',
        searchBox: 'bg-white border-2 border-black text-black placeholder-slate-400 shadow-[2px_2px_0px_#000000]',
        cardBg: 'bg-white border-3 border-black shadow-[6px_6px_0px_#000000]',
        cardSubtleBorder: 'border-black/30',
        cardTitleColor: 'text-black',
        primaryBtn: 'bg-[#ffd60a] hover:bg-[#eab308] text-black border-2 border-black shadow-[3px_3px_0px_#000000] font-bold',
        secondaryBtn: 'bg-white border-2 border-black text-black hover:bg-[#fef9c3] shadow-[2px_2px_0px_#000000]',
        badgeDistance: 'bg-[#ffd60a] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
        perkChip: 'bg-[#fef9c3] text-black border border-black font-bold',
        listItemActive: 'bg-[#ffd60a] border-2 border-black text-black shadow-[3px_3px_0px_#000000]',
        listItemInactive: 'bg-white border-2 border-black hover:bg-[#fef9c3] text-black shadow-[1px_1px_0px_#000000]',
        modalBg: 'bg-[#fffdf0] border-4 border-black shadow-[10px_10px_0px_#000000] text-black',
      };
    }

    // Default: K-Pop & All Fandoms (Y2K Neo-brutalist / Clean Editorial with Pink & Stark Black)
    return {
      key: 'kpop',
      sectionBg: '#fdfbf7',
      sectionBorder: 'border-t-3 border-b-3 border-black',
      textColor: 'text-black',
      textMuted: 'text-slate-600',
      headingFont: "'Space Grotesk', sans-serif",
      accentHex: '#ff2e93',
      accentText: 'text-[#ff2e93]',
      eyebrowBox: 'bg-[#ffd60a] text-black border-2 border-black font-mono shadow-[2px_2px_0px_#000000]',
      eyebrowDot: 'bg-[#ff2e93]',
      switcherBox: 'bg-white dark:bg-[#121214] border-2 border-black dark:border-[#3F3F46] shadow-[3px_3px_0px_#000000] dark:shadow-none',
      btnActive: 'bg-black text-white dark:bg-[#00f0ff] dark:text-black border-2 border-black dark:border-[#00f0ff] shadow-[2px_2px_0px_#ff2e93] dark:shadow-none font-bold',
      btnInactive: 'text-black dark:text-[#E2E8F0] hover:bg-[#fff0f6] dark:hover:bg-[#27272A] font-bold',
      gpsBar: 'bg-white dark:bg-[#121214] border-3 border-black dark:border-[#3F3F46] shadow-[4px_4px_0px_#000000] dark:shadow-none',
      gpsBtn: 'bg-[#ff2e93] hover:bg-[#e0207e] text-white border-2 border-black shadow-[3px_3px_0px_#000000] font-bold',
      coordBadge: 'bg-[#fffdf0] dark:bg-[#18181B] border-2 border-black dark:border-[#3F3F46] text-black dark:text-[#E2E8F0] font-mono font-bold',
      cityActive: 'bg-[#ffd60a] text-black border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-none font-bold',
      cityInactive: 'bg-white text-black dark:bg-[#18181B] dark:text-[#CBD5E1] border border-black dark:border-[#3F3F46] hover:bg-[#fff0f6] dark:hover:bg-[#27272A]',
      filterBox: 'bg-white dark:bg-[#121214] border-2 border-black dark:border-[#3F3F46] shadow-[2px_2px_0px_#000000] dark:shadow-none',
      radiusActive: 'bg-[#ff2e93] text-white border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-none font-bold',
      radiusInactive: 'bg-white dark:bg-[#18181B] border-2 border-black dark:border-[#3F3F46] text-black dark:text-[#CBD5E1] hover:bg-[#fff0f6] dark:hover:bg-[#27272A] font-bold',
      searchBox: 'bg-white dark:bg-[#18181B] border-2 border-black dark:border-[#3F3F46] text-black dark:text-[#FAFAFA] placeholder-slate-400 dark:placeholder-neutral-500 shadow-[2px_2px_0px_#000000] dark:shadow-none',
      cardBg: 'bg-white dark:bg-[#121214] border-3 border-black dark:border-[#3F3F46] shadow-[6px_6px_0px_#000000] dark:shadow-none',
      cardSubtleBorder: 'border-black/30 dark:border-white/10',
      cardTitleColor: 'text-black dark:text-white',
      primaryBtn: 'bg-[#ffd60a] hover:bg-[#eab308] text-black border-2 border-black shadow-[3px_3px_0px_#000000] dark:shadow-none font-bold',
      secondaryBtn: 'bg-white dark:bg-[#18181B] border-2 border-black dark:border-[#52525B] text-black dark:text-[#FAFAFA] hover:bg-[#fff0f6] dark:hover:bg-[#27272A] shadow-[2px_2px_0px_#000000] dark:shadow-none',
      badgeDistance: 'bg-[#ffd60a] text-black border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-none',
      perkChip: 'bg-[#fff0f6] dark:bg-[#18181B] text-black dark:text-[#E2E8F0] border border-black dark:border-[#3F3F46] font-bold',
      listItemActive: 'bg-[#ffd60a] border-2 border-black text-black shadow-[3px_3px_0px_#000000] dark:shadow-none',
      listItemInactive: 'bg-white dark:bg-[#18181B] border-2 border-black dark:border-[#3F3F46] hover:bg-[#fff0f6] dark:hover:bg-[#27272A] text-black dark:text-[#FAFAFA] shadow-[1px_1px_0px_#000000] dark:shadow-none',
      modalBg: 'bg-[#fffdf0] dark:bg-[#121214] border-4 border-black dark:border-[#3F3F46] shadow-[10px_10px_0px_#000000] dark:shadow-none text-black dark:text-white',
    };
  }, [isGaming, isCinema, isManga, isAnime, isTv, isCosplay, isComics]);

  // User location state
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    isGpsActive: boolean;
  }>({
    lat: 21.0285,
    lng: 105.8542,
    name: 'Hanoi, Vietnam',
    isGpsActive: false,
  });

  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Filter states
  const [selectedCity, setSelectedCity] = useState<string>('Hanoi');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIdol, setSelectedIdol] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'all' | 'weekend' | 'month'>('all');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(50); // 10, 35, 100, 500, 5000 (all)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'calendar' | 'list'>('map');

  // Selected event for detail inspection and modal
  const [selectedEventId, setSelectedEventId] = useState<string>(mockLocationEvents[0].id);
  const [bookingEvent, setBookingEvent] = useState<LocationEvent | null>(null);
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [rsvpName, setRsvpName] = useState<string>('Alex Morgan');
  const [rsvpEmail, setRsvpEmail] = useState<string>('fanhub.fan@gmail.com');
  const [rsvpPhone, setRsvpPhone] = useState<string>('+1 (555) 019-2834');
  const [bookingCompleted, setBookingCompleted] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Calendar specific state
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Auto-detect GPS Location handler
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Your browser does not support HTML5 Geolocation.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          name: `Your GPS Location (${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°)`,
          isGpsActive: true,
        });
        setIsLocating(false);
        // Find nearest city
        let nearestCity = CITIES_CONFIG[0];
        let minD = Infinity;
        CITIES_CONFIG.forEach(c => {
          const d = calculateDistanceKm(latitude, longitude, c.lat, c.lng);
          if (d < minD) {
            minD = d;
            nearestCity = c;
          }
        });
        setSelectedCity(nearestCity.id);
        setMaxRadiusKm(100);
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to acquire GPS coordinates. Please grant location permissions in your browser.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please select a city manually below.';
        }
        setGpsError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // City preset switch handler
  const handleSelectCityPreset = (cityId: string) => {
    const target = CITIES_CONFIG.find(c => c.id === cityId);
    if (target) {
      setSelectedCity(cityId);
      setUserLocation({
        lat: target.lat,
        lng: target.lng,
        name: `${target.name} (${target.flag})`,
        isGpsActive: false,
      });
      setGpsError(null);
    }
  };

  // Calculate distance for all events and sort / filter
  const eventsWithDistance = useMemo(() => {
    return mockLocationEvents.map(ev => {
      const distance = calculateDistanceKm(userLocation.lat, userLocation.lng, ev.lat, ev.lng);
      return {
        ...ev,
        distanceKm: distance
      };
    });
  }, [userLocation]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsWithDistance.filter(ev => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ev.title.toLowerCase().includes(q);
        const matchVenue = ev.venue.toLowerCase().includes(q);
        const matchArtist = ev.artistOrHost.toLowerCase().includes(q);
        const matchAddress = ev.address.toLowerCase().includes(q);
        if (!matchTitle && !matchVenue && !matchArtist && !matchAddress) return false;
      }

      // Event Type
      if (selectedType !== 'all' && ev.type !== selectedType) {
        return false;
      }

      // Category / Music genre
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }

      // Idol Filter
      if (selectedIdol !== 'all') {
        const idolQ = selectedIdol.toLowerCase();
        const matchTitle = ev.title.toLowerCase().includes(idolQ);
        const matchArtist = ev.artistOrHost.toLowerCase().includes(idolQ);
        if (!matchTitle && !matchArtist) return false;
      }

      // Time Range Filter (Cuối tuần này / Tháng này / Tất cả)
      if (selectedTimeRange === 'weekend') {
        // Concerts happening on weekend (e.g., 2025-04-12, 2025-04-13 or Friday/Saturday/Sunday)
        const isWeekend = ev.date.includes('2025-04-12') || ev.date.includes('2025-04-13') || ev.date.includes('2025-04-19') || ev.date.includes('2025-04-20') || ev.title.toLowerCase().includes('weekend');
        if (!isWeekend) return false;
      } else if (selectedTimeRange === 'month') {
        const isMonth = ev.date.startsWith('2025-04') || ev.date.startsWith('2025-05');
        if (!isMonth) return false;
      }

      // Radius filter: only apply if not 'All / 5000km'
      if (maxRadiusKm < 5000 && ev.distanceKm > maxRadiusKm) {
        return false;
      }

      // Date filter
      if (selectedDate && ev.date !== selectedDate) {
        return false;
      }

      return true;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [eventsWithDistance, searchQuery, selectedType, selectedCategory, selectedIdol, selectedTimeRange, maxRadiusKm, selectedDate]);

  // Selected event object
  const activeEvent = useMemo(() => {
    return eventsWithDistance.find(e => e.id === selectedEventId) || filteredEvents[0] || eventsWithDistance[0];
  }, [eventsWithDistance, selectedEventId, filteredEvents]);

  // Keep selectedEventId synced if filtered list changes
  useEffect(() => {
    if (filteredEvents.length > 0 && !filteredEvents.some(e => e.id === selectedEventId)) {
      setSelectedEventId(filteredEvents[0].id);
    }
  }, [filteredEvents, selectedEventId]);

  // Dates present in events for calendar
  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    mockLocationEvents.forEach(e => dates.add(e.date));
    return Array.from(dates).sort();
  }, []);

  const handleShare = (event: LocationEvent) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/event#${event.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getEventTypeBadge = (type: LocationEvent['type']) => {
    switch (type) {
      case 'stadium_concert':
        return { label: 'Concert & Stadium Tour', icon: Ticket, color: isDark ? 'bg-[#ff2e93] text-white border-2 border-white' : 'bg-[#ef4444] text-white border-2 border-black font-bold' };
      case 'cup_sleeve_cafe':
        return { label: 'Cup Sleeve & Birthday Cafe', icon: Coffee, color: isDark ? 'bg-pink-700 text-white border-2 border-pink-400' : 'bg-[#ec4899] text-white border-2 border-black font-bold' };
      case 'photocard_trade':
        return { label: 'Photocard Trade Lounge', icon: Sparkles, color: isDark ? 'bg-purple-700 text-white border-2 border-purple-400' : 'bg-[#8b5cf6] text-white border-2 border-black font-bold' };
      case 'anime_expo':
        return { label: 'Manga & Cosplay Expo', icon: Layers, color: isDark ? 'bg-amber-600 text-black border-2 border-amber-300' : 'bg-[#ffd60a] text-black border-2 border-black font-bold' };
      case 'gaming_arena':
        return { label: 'Gaming Arena Live Watch', icon: Radio, color: isDark ? 'bg-cyan-500 text-black border-2 border-cyan-300' : 'bg-[#00f0ff] text-black border-2 border-black font-bold' };
      default:
        return { label: 'Fandom Event', icon: Compass, color: isDark ? 'bg-slate-800 text-white border-2 border-white' : 'bg-black text-white border-2 border-black font-bold' };
    }
  };

  return (
    <section 
      id="location-events"
      style={{ 
        scrollMarginTop: '100px',
        backgroundColor: themeTokens.sectionBg 
      }}
      className={`py-16 sm:py-24 w-full ${themeTokens.sectionBorder} transition-colors duration-300`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* ==================== 1. Editorial Section Header ==================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-2.5 rounded-none ${themeTokens.eyebrowBox}`}>
              <span className={`w-2 h-2 rounded-full ${themeTokens.eyebrowDot} animate-ping`} />
              <LocateFixed size={12} className={themeTokens.accentText} />
              <span>Location-Aware Event Radar &amp; GPS Discovery</span>
            </div>

            <h2 
              style={{ fontFamily: themeTokens.headingFont }}
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase m-0 ${themeTokens.textColor}`}
            >
              Discover Events <span className={themeTokens.accentText}>&amp; Meetups Near You</span>
            </h2>
            <p className={`text-xs sm:text-sm mt-2 max-w-2xl font-normal leading-relaxed ${themeTokens.textMuted}`}>
              Live GPS radar automatically locates stadium concert tours, birthday cup-sleeve cafes, manga and cosplay expos, and official photocard trading meetups near you.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className={`flex items-center gap-1.5 p-1 self-start md:self-auto shrink-0 rounded-none ${themeTokens.switcherBox}`}>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider transition-all cursor-pointer rounded-none ${
                viewMode === 'map' ? themeTokens.btnActive : themeTokens.btnInactive
              }`}
            >
              <Navigation size={13} />
              <span>GPS Map</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider transition-all cursor-pointer rounded-none ${
                viewMode === 'calendar' ? themeTokens.btnActive : themeTokens.btnInactive
              }`}
            >
              <CalendarIcon size={13} />
              <span>Event Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider transition-all cursor-pointer rounded-none ${
                viewMode === 'list' ? themeTokens.btnActive : themeTokens.btnInactive
              }`}
            >
              <Users size={13} />
              <span>List View ({filteredEvents.length})</span>
            </button>
          </div>
        </div>

        {/* ==================== 2. GPS Locator Bar & City Pills ==================== */}
        <div className={`p-4 sm:p-5 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-none ${themeTokens.gpsBar}`}>
          
          {/* GPS Auto-Detect Button & Current Coordinates indicator */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isLocating}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none ${themeTokens.gpsBtn}`}
            >
              <LocateFixed size={14} className={isLocating ? 'animate-spin' : ''} />
              <span>
                {isLocating ? 'Scanning satellite GPS...' : userLocation.isGpsActive ? '✓ Using Live GPS' : 'Enable GPS Near Me'}
              </span>
            </button>

            <div className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-none ${themeTokens.coordBadge}`}>
              <MapPin size={13} className="text-rose-500 shrink-0" />
              <span className="truncate max-w-[240px] sm:max-w-none">
                {userLocation.name}
              </span>
            </div>

            {gpsError && (
              <span className="text-[11.5px] text-amber-400 font-bold bg-amber-950/80 px-2.5 py-1 rounded-none border border-amber-500">
                ⚠️ {gpsError}
              </span>
            )}
          </div>

          {/* Quick City Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className={`text-[11px] font-bold uppercase font-mono shrink-0 mr-1 ${themeTokens.textMuted}`}>
              City:
            </span>
            {CITIES_CONFIG.map(city => {
              const isActive = selectedCity === city.id && !userLocation.isGpsActive;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleSelectCityPreset(city.id)}
                  className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 rounded-none ${
                    isActive ? themeTokens.cityActive : themeTokens.cityInactive
                  }`}
                >
                  <span>{city.flag}</span>
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ==================== 3. Filter Controls: Radius, Type, Search ==================== */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 flex-wrap">
          
          {/* Radius Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <span className={`text-[10.5px] font-mono font-bold uppercase tracking-wider shrink-0 mr-1 ${themeTokens.textMuted}`}>
              Radius:
            </span>
            {[
              { val: 15, label: '< 15 km' },
              { val: 35, label: '< 35 km' },
              { val: 150, label: '< 150 km' },
              { val: 5000, label: 'Global (All)' },
            ].map(r => (
              <button
                key={r.val}
                type="button"
                onClick={() => setMaxRadiusKm(r.val)}
                className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer rounded-none ${
                  maxRadiusKm === r.val ? themeTokens.radiusActive : themeTokens.radiusInactive
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Event Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`flex items-center gap-1 rounded-none p-1 ${themeTokens.filterBox} text-xs`}>
              {[
                { id: 'all', label: 'All Types' },
                { id: 'stadium_concert', label: 'Concert' },
                { id: 'cup_sleeve_cafe', label: 'Cafe Meetup' },
                { id: 'photocard_trade', label: 'Trade Lounge' },
                { id: 'anime_expo', label: 'Manga / Cosplay' },
                { id: 'gaming_arena', label: 'Gaming' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={`px-2.5 py-1 font-bold transition-all cursor-pointer rounded-none ${
                    selectedType === t.id ? themeTokens.btnActive : themeTokens.btnInactive
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative min-w-[220px]">
              <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${themeTokens.textMuted}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search artist, concert, stadium, venue..."
                className={`w-full pl-8 pr-3 py-1.5 text-xs focus:outline-none rounded-none font-sans ${themeTokens.searchBox}`}
              />
            </div>
          </div>

          {/* Quick Filter Bar: Idol, Genre, Time Range */}
          <div className="w-full flex items-center justify-between gap-3 pt-2 border-t border-black/10 dark:border-white/10 flex-wrap text-xs">
            {/* Idol Quick Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${themeTokens.textMuted}`}>
                ⭐ Artist / Idol:
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'SEVENTEEN', label: 'SEVENTEEN' },
                { id: 'Sơn Tùng', label: 'Son Tung M-TP' },
                { id: 'NewJeans', label: 'NewJeans' },
                { id: 'BTS', label: 'BTS' },
                { id: 'Say Hi', label: 'Say Hi All-Stars' },
              ].map(idol => (
                <button
                  key={idol.id}
                  type="button"
                  onClick={() => setSelectedIdol(idol.id)}
                  className={`px-2 py-0.5 text-[11px] font-bold transition-all cursor-pointer rounded-none border ${
                    selectedIdol === idol.id
                      ? 'bg-[#ff2e93] text-white border-black shadow-[1px_1px_0px_#000]'
                      : 'bg-white/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-neutral-500'
                  }`}
                >
                  {idol.label}
                </button>
              ))}
            </div>

            {/* Time Range Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${themeTokens.textMuted}`}>
                📅 Timing:
              </span>
              {[
                { id: 'all', label: 'All Dates' },
                { id: 'weekend', label: 'This Weekend' },
                { id: 'month', label: 'This Month' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTimeRange(t.id as any)}
                  className={`px-2 py-0.5 text-[11px] font-bold transition-all cursor-pointer rounded-none border ${
                    selectedTimeRange === t.id
                      ? 'bg-[#ffd60a] text-black border-black shadow-[1px_1px_0px_#000]'
                      : 'bg-white/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-neutral-500'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ==================== 4. MAIN INTERACTIVE CONTENT AREA ==================== */}

        {/* --- VIEW MODE 1: INTERACTIVE GPS RADAR MAP + SPLIT LIST --- */}
        {viewMode === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 Columns: High-Tech GPS Interactive Map Canvas / Radar */}
            <div className={`lg:col-span-7 overflow-hidden relative min-h-[460px] sm:min-h-[540px] flex flex-col justify-between rounded-none ${themeTokens.cardBg}`}>
              
              {/* Map Top Overlay HUD: GPS Status & Stats */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-none">
                <div className={`pointer-events-auto px-3 py-1.5 flex items-center gap-2 rounded-none bg-black/90 border-2 border-white text-white font-mono shadow-[2px_2px_0px_#000000]`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${themeTokens.eyebrowDot} animate-ping`} />
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
                    Satellite GPS Radar: {filteredEvents.length} Active Venues
                  </span>
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-[10px] font-mono rounded-none bg-black/90 border-2 border-white text-white`}>
                    Coordinates: {userLocation.lat.toFixed(2)}°N, {userLocation.lng.toFixed(2)}°E
                  </span>
                </div>
              </div>

              {/* REAL LEAFLET GPS MAP OVERLAY */}
              <div className="relative w-full h-[460px] sm:h-[540px] z-10 overflow-hidden rounded-none border-b-2 border-black">
                <RealGpsMap 
                  events={filteredEvents}
                  activeEvent={activeEvent}
                  onEventClick={(ev) => setSelectedEventId(ev.id)}
                />
              </div>

              {/* Map Bottom Legend / Compass Bar */}
              <div className="p-3.5 border-t text-xs flex items-center justify-between flex-wrap gap-2 z-10 bg-black border-black text-white">
                <div className="flex items-center gap-3 text-[11px] font-medium flex-wrap">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> You
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Concert
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-400" /> Cafe Meetup
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Manga/Cosplay
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeEvent) {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${activeEvent.lat},${activeEvent.lng}`;
                        window.open(url, '_blank');
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer rounded-none ${themeTokens.primaryBtn}`}
                  >
                    <Compass size={12} />
                    <span>Google Maps Directions</span>
                    <ArrowUpRight size={11} />
                  </button>
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Active Event Spotlight Card & Quick List */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* Highlight Card for Active Selected Pin */}
              {activeEvent ? (
                <div className={`p-5 sm:p-6 relative overflow-hidden transition-all rounded-none ${themeTokens.cardBg}`}>
                  
                  {/* Category Pill & Distance Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-none ${getEventTypeBadge(activeEvent.type).color}`}>
                      <Radio size={11} className="animate-pulse" />
                      <span>{getEventTypeBadge(activeEvent.type).label}</span>
                    </span>

                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-mono font-bold rounded-none ${themeTokens.badgeDistance}`}>
                      <LocateFixed size={12} />
                      <span>{activeEvent.distanceKm} km away</span>
                    </span>
                  </div>

                  {/* Image & Title */}
                  <div className="relative aspect-[16/9] overflow-hidden mb-4 rounded-none border-2 border-black bg-slate-900">
                    <img 
                      src={activeEvent.coverImage} 
                      alt={activeEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className={`text-[10px] font-mono uppercase tracking-widest font-bold block mb-0.5 ${themeTokens.accentText}`}>
                        {activeEvent.artistOrHost}
                      </span>
                      <h3 
                        className="text-base sm:text-lg font-black leading-tight text-white m-0 tracking-wide"
                        style={{
                          fontFamily: themeTokens.headingFont
                        }}
                      >
                        {activeEvent.title}
                      </h3>
                    </div>
                  </div>

                  {/* Details: Venue, Date, Time */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className={`block font-bold ${themeTokens.cardTitleColor}`}>{activeEvent.venue}</strong>
                        <span className={`text-[11.5px] leading-tight block ${themeTokens.textMuted}`}>{activeEvent.address}</span>
                      </div>
                    </div>

                    <div className={`flex items-center justify-between pt-2 border-t ${themeTokens.cardSubtleBorder}`}>
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon size={13} className={themeTokens.accentText} />
                        <span className={`font-semibold ${themeTokens.cardTitleColor}`}>{activeEvent.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-amber-500" />
                        <span className={themeTokens.textMuted}>{activeEvent.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Excerpt */}
                  <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${themeTokens.textMuted}`}>
                    {activeEvent.description}
                  </p>

                  {/* Perks chips */}
                  {activeEvent.perks && activeEvent.perks.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-5">
                      {activeEvent.perks.slice(0, 2).map((p, pIdx) => (
                        <span key={pIdx} className={`text-[10.5px] px-2 py-0.5 rounded-none ${themeTokens.perkChip}`}>
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Row: Price & Booking */}
                  <div className={`pt-4 border-t ${themeTokens.cardSubtleBorder} flex items-center justify-between gap-3`}>
                    <div>
                      <span className={`text-[10px] font-mono uppercase font-bold tracking-wider block ${themeTokens.textMuted}`}>
                        {activeEvent.freeEntry ? 'Admission' : 'Tickets From'}
                      </span>
                      <div className={`text-base sm:text-lg font-black font-mono ${themeTokens.cardTitleColor}`}>
                        {activeEvent.freeEntry ? (
                          <span className={themeTokens.accentText}>Free Admission (RSVP)</span>
                        ) : (
                          formatPrice(activeEvent.priceUSD, activeEvent.priceVND)
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleShare(activeEvent)}
                        className={`p-2.5 transition-colors cursor-pointer rounded-none ${themeTokens.secondaryBtn}`}
                        title="Share event link"
                      >
                        {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBookingEvent(activeEvent);
                          setBookingCompleted(false);
                        }}
                        className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer font-mono rounded-none ${themeTokens.primaryBtn}`}
                      >
                        <Ticket size={13} />
                        <span>{activeEvent.freeEntry ? 'RSVP Now' : 'Book Tickets'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className={`p-8 text-center text-sm rounded-none ${themeTokens.cardBg} ${themeTokens.textMuted}`}>
                  No events found within the selected radius. Try expanding your radius or selecting another city.
                </div>
              )}

              {/* Quick Scrollable Nearby Events List Below Spotlight */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-none">
                <span className={`text-[11px] font-bold uppercase tracking-wider font-mono block px-1 ${themeTokens.textMuted}`}>
                  Other nearby venues ({filteredEvents.length}):
                </span>
                {filteredEvents.map(ev => {
                  const isCurrent = ev.id === activeEvent?.id;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEventId(ev.id)}
                      className={`p-3 transition-all cursor-pointer flex items-center justify-between gap-3 rounded-none ${
                        isCurrent 
                          ? themeTokens.listItemActive 
                          : themeTokens.listItemInactive
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-black text-white border border-white/20">
                            {ev.city}
                          </span>
                          <span className="text-xs font-bold truncate block">
                            {ev.title}
                          </span>
                        </div>
                        <span className={`text-[11px] truncate block mt-0.5 ${themeTokens.textMuted}`}>
                          {ev.venue}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[11px] font-mono font-bold block ${themeTokens.accentText}`}>
                          {ev.distanceKm} km
                        </span>
                        <span className={`text-[10px] ${themeTokens.textMuted}`}>
                          {ev.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* --- VIEW MODE 2: CALENDAR VIEW --- */}
        {viewMode === 'calendar' && (
          <div className={`p-6 sm:p-8 rounded-none ${themeTokens.cardBg}`}>
            <div className={`flex items-center justify-between mb-6 flex-wrap gap-4 pb-4 border-b ${themeTokens.cardSubtleBorder}`}>
              <div>
                <h3 
                  className={`text-lg sm:text-xl font-black uppercase ${themeTokens.cardTitleColor}`}
                  style={{ fontFamily: themeTokens.headingFont }}
                >
                  Fandom Event Schedule by Date
                </h3>
                <p className={`text-xs mt-1 ${themeTokens.textMuted}`}>
                  Select a date to filter stadium concerts, offline meetups, and anime expos.
                </p>
              </div>

              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate('')}
                  className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer rounded-none ${themeTokens.primaryBtn}`}
                >
                  ✕ Clear date filter ({selectedDate})
                </button>
              )}
            </div>

            {/* Horizontal Timeline Date Picker */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-6">
              {eventDates.map(dateStr => {
                const count = mockLocationEvents.filter(e => e.date === dateStr).length;
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(isSelected ? '' : dateStr)}
                    className={`p-3 text-center transition-all cursor-pointer min-w-[100px] shrink-0 rounded-none ${
                      isSelected ? themeTokens.listItemActive : themeTokens.listItemInactive
                    }`}
                  >
                    <span className={`text-[10px] font-mono uppercase font-bold block ${themeTokens.textMuted}`}>
                      {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-base font-black block my-0.5">
                      {dateStr.split('-').slice(1).join('/')}
                    </span>
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.5 inline-block rounded-none ${
                      isSelected ? 'bg-black text-white border border-white' : 'bg-black/20 text-current border border-current'
                    }`}>
                      {count} {count === 1 ? 'event' : 'events'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Event Grid for Calendar Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(ev => (
                <div
                  key={ev.id}
                  className={`overflow-hidden transition-all flex flex-col justify-between p-5 rounded-none ${themeTokens.cardBg} hover:translate-y-[-2px]`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none ${getEventTypeBadge(ev.type).color}`}>
                        {getEventTypeBadge(ev.type).label}
                      </span>
                      <span className={`text-xs font-mono font-bold ${themeTokens.accentText}`}>
                        {ev.distanceKm} km away
                      </span>
                    </div>

                    <div className="relative aspect-[16/10] overflow-hidden mb-3 bg-slate-900 rounded-none border-2 border-black">
                      <img src={ev.coverImage} alt={ev.title} className="w-full h-full object-cover" />
                    </div>

                    <span className={`text-[10px] font-mono font-bold block uppercase mb-1 ${themeTokens.textMuted}`}>
                      {ev.artistOrHost}
                    </span>
                    <h4 
                      className={`text-base font-bold line-clamp-1 mb-2 ${themeTokens.cardTitleColor}`}
                      style={{ fontFamily: themeTokens.headingFont }}
                    >
                      {ev.title}
                    </h4>
                    <p className={`text-xs line-clamp-2 mb-3 ${themeTokens.textMuted}`}>
                      {ev.venue} • {ev.address}
                    </p>
                  </div>

                  <div className={`pt-3 border-t ${themeTokens.cardSubtleBorder} flex items-center justify-between`}>
                    <div>
                      <span className={`text-[10px] font-mono block ${themeTokens.textMuted}`}>From</span>
                      <strong className={`text-sm font-black font-mono ${themeTokens.cardTitleColor}`}>
                        {ev.freeEntry ? 'Free' : formatPrice(ev.priceUSD, ev.priceVND)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBookingEvent(ev)}
                      className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer font-mono rounded-none ${themeTokens.primaryBtn}`}
                    >
                      {ev.freeEntry ? 'RSVP' : 'Get Tickets'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* --- VIEW MODE 3: FULL LIST VIEW --- */}
        {viewMode === 'list' && (
          <div className={`overflow-hidden rounded-none ${themeTokens.cardBg}`}>
            <div className={`divide-y ${themeTokens.cardSubtleBorder}`}>
              {filteredEvents.map(ev => (
                <div
                  key={ev.id}
                  className={`p-4 sm:p-6 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <img
                      src={ev.coverImage}
                      alt={ev.title}
                      className="w-20 h-20 object-cover shrink-0 rounded-none border-2 border-black"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2 py-0.5 text-[9.5px] font-bold uppercase rounded-none ${getEventTypeBadge(ev.type).color}`}>
                          {getEventTypeBadge(ev.type).label}
                        </span>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-none ${themeTokens.badgeDistance}`}>
                          {ev.distanceKm} km away
                        </span>
                        <span className={`text-xs ${themeTokens.textMuted}`}>• {ev.date} ({ev.time})</span>
                      </div>

                      <h4 
                        className={`text-base font-bold leading-snug ${themeTokens.cardTitleColor}`}
                        style={{ fontFamily: themeTokens.headingFont }}
                      >
                        {ev.title}
                      </h4>
                      <p className={`text-xs mt-1 flex items-center gap-1 ${themeTokens.textMuted}`}>
                        <MapPin size={12} className="text-rose-500 shrink-0" />
                        <span>{ev.venue} — {ev.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 ${themeTokens.cardSubtleBorder}`}>
                    <div className="text-left md:text-right">
                      <span className={`text-[10px] font-mono uppercase block ${themeTokens.textMuted}`}>Tickets</span>
                      <strong className={`text-base font-black font-mono ${themeTokens.cardTitleColor}`}>
                        {ev.freeEntry ? 'Free RSVP' : formatPrice(ev.priceUSD, ev.priceVND)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${ev.lat},${ev.lng}`;
                          window.open(url, '_blank');
                        }}
                        className={`p-2.5 transition-colors cursor-pointer rounded-none ${themeTokens.secondaryBtn}`}
                        title="Google Maps Directions"
                      >
                        <Compass size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingEvent(ev)}
                        className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 font-mono rounded-none ${themeTokens.primaryBtn}`}
                      >
                        {ev.freeEntry ? 'RSVP Now' : 'Book Tickets'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ==================== 5. MODAL: SEAT MAP, E-WALLET & BLOCKCHAIN TICKET WALLET ==================== */}
      <SeatMapBookingModal
        event={bookingEvent}
        isOpen={!!bookingEvent}
        onClose={() => setBookingEvent(null)}
      />

    </section>
  );
};
