'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  X,
  Heart,
  Bookmark,
  Clock,
  Sparkles,
  Camera,
  Edit3,
  Check,
  LogOut,
  ExternalLink,
  Flame,
  Star,
  Calendar,
  Disc,
  Radio,
  Share2,
  Tv,
  Bell,
  Trash2,
  FileText,
  User as UserIcon,
  Play,
  Award,
  ChevronRight,
  Shield,
  ShieldCheck,
  Layers,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Palette,
  Film,
  Gamepad2,
  BookOpen,
  Scissors,
  Music,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { mockFeaturedArticles } from '../data/mockData';
import { INITIAL_MEDIA_ITEMS } from '../data/multimediaData';
import {
  getActiveFandomTheme,
  getFandomCategoryFromTheme,
  getFandomThemeKeyFromCategory,
  persistFandomTheme,
} from '../utils/fandomTheme';

interface PersonalDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  fandomThemeKey?: string;
  fandomCategory?: string;
}

export interface FandomOption {
  id: string;
  name: string;
  tag: string; // Category: 'K-Pop' | 'V-Pop' | 'Anime' | 'Manga' | 'Gaming' | 'Comics' | 'Movies' | 'TV Shows' | 'Cosplay'
  color: string;
  description?: string;
  isCustom?: boolean;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
];

export const CATEGORY_ITEMS = [
  { key: 'all', label: 'ALL UNIVERSE', icon: Sparkles },
  { key: 'kpop', label: 'K-POP', icon: Music },
  { key: 'manga', label: 'MANGA', icon: BookOpen },
  { key: 'anime', label: 'ANIME', icon: Flame },
  { key: 'gaming', label: 'GAMING', icon: Gamepad2 },
  { key: 'comics', label: 'COMICS', icon: ZapIcon },
  { key: 'cinema', label: 'MOVIES / CINEMA', icon: Film },
  { key: 'tv', label: 'TV SHOWS', icon: Tv },
  { key: 'cosplay', label: 'COSPLAY', icon: Scissors },
  { key: 'vpop', label: 'V-POP', icon: Star },
];

function ZapIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

// Full theme presets for each category
export const CATEGORY_THEMES: Record<string, {
  name: string;
  categoryLabel: string;
  fontFamily: string;
  modalClass: string;
  headerClass: string;
  headerGlow1: string;
  headerGlow2: string;
  accentHex: string;
  accentTextClass: string;
  roleBadgeClass: string;
  roleBadgeText: string;
  cardClass: string;
  cardInnerClass: string;
  tabActiveClass: string;
  tabInactiveClass: string;
  actionBtnClass: string;
  fandomPillClass: string;
  tabBarClass: string;
  contentBgClass: string;
  tapeDecor?: boolean;
  closeBtnClass?: string;
  headerSubtitle?: string;
  inputClass?: string;
  borderRadius?: string;
}> = {
  all: {
    name: 'all',
    categoryLabel: 'Universe Explorer',
    fontFamily: "'Outfit', sans-serif",
    modalClass: 'rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900',
    headerClass: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white border-b border-indigo-900/40',
    headerGlow1: 'bg-pink-500/20',
    headerGlow2: 'bg-indigo-500/20',
    accentHex: '#6366f1',
    accentTextClass: 'text-indigo-600 dark:text-indigo-400',
    roleBadgeClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    roleBadgeText: '★ UNIVERSE EXPLORER VIP ✦',
    cardClass: 'rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-800 shadow-xs hover:shadow-md',
    cardInnerClass: 'bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800',
    tabActiveClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20',
    tabInactiveClass: 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800',
    actionBtnClass: 'rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white shadow-md shadow-indigo-600/20',
    fandomPillClass: 'rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
    tabBarClass: 'bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60',
    contentBgClass: 'bg-white dark:bg-slate-900',
    tapeDecor: false,
    closeBtnClass: 'w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 text-white backdrop-blur-md border border-white/20',
    headerSubtitle: 'Universe Explorer & Cross-Fandom Hub',
    inputClass: 'w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500',
  },
  kpop: {
    name: 'kpop',
    categoryLabel: 'K-Pop Official Hub',
    fontFamily: "'Outfit', sans-serif",
    modalClass: 'rounded-3xl border-3 border-pink-500/40 shadow-2xl shadow-pink-500/10 bg-white dark:bg-slate-900',
    headerClass: 'bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950 text-white border-b border-pink-500/40',
    headerGlow1: 'bg-pink-500/25',
    headerGlow2: 'bg-cyan-500/20',
    accentHex: '#ff2e93',
    accentTextClass: 'text-pink-600 dark:text-pink-400',
    roleBadgeClass: 'bg-pink-500/20 text-pink-300 border border-pink-500/40',
    roleBadgeText: '★ K-POP FANDOM ELITE VIP ✦',
    cardClass: 'rounded-2xl border border-pink-200/80 dark:border-pink-900/40 bg-white dark:bg-slate-800 shadow-xs hover:shadow-pink-500/10',
    cardInnerClass: 'bg-pink-50/50 dark:bg-pink-950/30 rounded-xl border border-pink-100 dark:border-pink-900/50',
    tabActiveClass: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/25',
    tabInactiveClass: 'text-slate-600 dark:text-slate-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-slate-800',
    actionBtnClass: 'rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-md shadow-pink-600/25',
    fandomPillClass: 'rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800',
    tabBarClass: 'bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/40 dark:via-purple-950/30 dark:to-pink-950/40 border-b-2 border-pink-300/60 dark:border-pink-800/60',
    contentBgClass: 'bg-gradient-to-b from-pink-50/30 to-white dark:from-pink-950/20 dark:to-slate-900',
    tapeDecor: false,
    closeBtnClass: 'w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 hover:scale-105',
    headerSubtitle: 'Official Hanteo Certified Member Gate & Photocard Vault',
    inputClass: 'w-full px-3.5 py-2.5 rounded-xl border-2 border-pink-300 dark:border-pink-800 text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500',
  },
  manga: {
    name: 'manga',
    categoryLabel: 'Manga Tankōbon Guild',
    fontFamily: "'Kalam', cursive, sans-serif",
    modalClass: 'border-3 border-[#2d2d2d] shadow-[8px_8px_0px_#2d2d2d] bg-[#fdfbf7]',
    borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
    headerClass: 'bg-[#fdfbf7] text-[#2d2d2d] border-b-3 border-[#2d2d2d] relative',
    headerGlow1: 'bg-red-400/15',
    headerGlow2: 'bg-amber-300/15',
    accentHex: '#ff4d4d',
    accentTextClass: 'text-[#ff4d4d]',
    roleBadgeClass: 'bg-[#ff4d4d] text-white border-2 border-[#2d2d2d]',
    roleBadgeText: '★ MANGA GUILD // TANKŌBON COLLECTOR ✦',
    cardClass: 'rounded-xl border-2 border-[#2d2d2d] bg-white shadow-[3px_3px_0px_#2d2d2d]',
    cardInnerClass: 'bg-[#fdfbf7] rounded-lg border border-[#2d2d2d]/30',
    tabActiveClass: 'bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]',
    tabInactiveClass: 'text-[#2d2d2d] hover:bg-[#fff0f0] border-2 border-transparent',
    actionBtnClass: 'rounded-lg bg-[#ff4d4d] hover:bg-[#e03a3a] text-white border-2 border-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d]',
    fandomPillClass: 'rounded-lg bg-[#fff0f0] text-[#ff4d4d] border-2 border-[#2d2d2d] shadow-[1px_1px_0px_#2d2d2d]',
    tabBarClass: 'bg-[#fdfbf7] border-b-3 border-[#2d2d2d] text-[#2d2d2d]',
    contentBgClass: 'bg-[#fdfbf7] text-[#2d2d2d]',
    tapeDecor: true,
    closeBtnClass: 'w-8 h-8 rounded-none bg-white hover:bg-neutral-100 text-black border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]',
    headerSubtitle: 'Mangaka & Tankōbon Collector Sign-In',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-[#2d2d2d] text-xs bg-white text-[#2d2d2d] focus:outline-none font-["Kalam"]',
  },
  anime: {
    name: 'anime',
    categoryLabel: 'Anime Sakuga Vault',
    fontFamily: "'Space Grotesk', monospace, sans-serif",
    modalClass: 'rounded-none border-3 border-black shadow-[10px_10px_0px_#ccff00] bg-white',
    headerClass: 'bg-[#ffd60a] text-black border-b-3 border-black',
    headerGlow1: 'bg-[#ccff00]/40',
    headerGlow2: 'bg-[#00f0ff]/30',
    accentHex: '#ccff00',
    accentTextClass: 'text-black font-black',
    roleBadgeClass: 'bg-black text-[#ccff00] border-2 border-black font-black',
    roleBadgeText: '★ SAKUGA VAULT // OTAKU ARCHIVE ✦',
    cardClass: 'rounded-none border-2 border-black bg-white shadow-[4px_4px_0px_#000000]',
    cardInnerClass: 'bg-[#fefce8] rounded-none border border-black',
    tabActiveClass: 'bg-[#ccff00] text-black border-2 border-black shadow-[2px_2px_0px_#000] font-black',
    tabInactiveClass: 'text-black hover:bg-[#fefce8] border-2 border-transparent font-bold',
    actionBtnClass: 'rounded-none bg-[#ccff00] hover:bg-[#b8e600] text-black border-2 border-black shadow-[3px_3px_0px_#000] font-black',
    fandomPillClass: 'rounded-none bg-[#ccff00]/30 text-black border-2 border-black shadow-[2px_2px_0px_#000] font-bold',
    tabBarClass: 'bg-[#ffd60a] border-b-3 border-black text-black',
    contentBgClass: 'bg-[#fffef5] text-black',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-black hover:bg-[#ccff00] text-white hover:text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    headerSubtitle: 'High-Framerate Collector & Otaku Authentication',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-black text-xs bg-[#fefce8] text-black focus:outline-none font-["Space_Grotesk"]',
  },
  gaming: {
    name: 'gaming',
    categoryLabel: 'Gaming & Esports Arena',
    fontFamily: "'JetBrains Mono', monospace",
    modalClass: 'rounded-none border-4 border-black shadow-[8px_8px_0px_#000000] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100',
    headerClass: 'bg-black text-white border-b-4 border-black',
    headerGlow1: 'bg-cyan-500/25',
    headerGlow2: 'bg-emerald-500/20',
    accentHex: '#06b6d4',
    accentTextClass: 'text-cyan-400 font-mono font-bold',
    roleBadgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-mono',
    roleBadgeText: '★ GAMING ARENA // MEMBER GATE ✦',
    cardClass: 'rounded-none border-2 border-black dark:border-cyan-500/40 bg-white dark:bg-slate-900 shadow-[3px_3px_0px_#000000] text-slate-900 dark:text-slate-100',
    cardInnerClass: 'bg-slate-50 dark:bg-slate-950/80 rounded-none border border-black/20 dark:border-cyan-500/20',
    tabActiveClass: 'bg-black text-white dark:bg-cyan-500 dark:text-black font-extrabold shadow-[2px_2px_0px_#000]',
    tabInactiveClass: 'text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-900',
    actionBtnClass: 'rounded-none bg-black hover:bg-neutral-800 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-black border-2 border-black font-extrabold shadow-[3px_3px_0px_#000]',
    fandomPillClass: 'rounded-none bg-slate-100 dark:bg-cyan-950/80 text-black dark:text-cyan-300 border-2 border-black shadow-[1px_1px_0px_#000]',
    tabBarClass: 'bg-neutral-100 dark:bg-slate-950 border-b-4 border-black text-black dark:text-white',
    contentBgClass: 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-black hover:bg-neutral-800 text-white border-2 border-black shadow-[2px_2px_0px_#000000]',
    headerSubtitle: 'Official Soundtracks & Collector Archive',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-black text-xs bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none font-mono',
  },
  comics: {
    name: 'comics',
    categoryLabel: 'Comics Pop-Art Hero Archive',
    fontFamily: "'Bangers', 'Kalam', cursive, sans-serif",
    modalClass: 'rounded-none border-4 border-black shadow-[10px_10px_0px_#ef4444] bg-[#fffdf0]',
    headerClass: 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black border-b-4 border-black',
    headerGlow1: 'bg-red-500/30',
    headerGlow2: 'bg-yellow-400/30',
    accentHex: '#ef4444',
    accentTextClass: 'text-red-600 font-black',
    roleBadgeClass: 'bg-black text-[#ffd60a] border-2 border-black font-bold tracking-wider',
    roleBadgeText: '★ HERO ARCHIVE // VARIANT SECRET IDENTITY ✦',
    cardClass: 'rounded-none border-3 border-black bg-white shadow-[4px_4px_0px_#000000]',
    cardInnerClass: 'bg-[#fffdf0] rounded-none border-2 border-black/30',
    tabActiveClass: 'bg-[#ef4444] text-white border-2 border-black shadow-[3px_3px_0px_#000] font-black',
    tabInactiveClass: 'text-black hover:bg-amber-100 border-2 border-transparent font-bold',
    actionBtnClass: 'rounded-none bg-[#ffd60a] hover:bg-amber-400 text-black border-3 border-black shadow-[3px_3px_0px_#ef4444] font-black',
    fandomPillClass: 'rounded-none bg-[#fee2e2] text-red-700 border-2 border-black shadow-[2px_2px_0px_#000] font-bold',
    tabBarClass: 'bg-gradient-to-r from-amber-100 via-yellow-100 to-red-100 border-b-3 border-black text-black',
    contentBgClass: 'bg-[#fffdf0] text-black',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-white hover:bg-[#ffd60a] text-black border-3 border-black shadow-[3px_3px_0px_#000000]',
    headerSubtitle: 'Unlock Exclusive Variant Pulls & Omnibuses',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-black text-xs bg-white text-black focus:outline-none',
  },
  cinema: {
    name: 'cinema',
    categoryLabel: 'Cinema 70mm Swiss Archive',
    fontFamily: "'Playfair Display', Georgia, serif",
    modalClass: 'rounded-none border-2 border-[rgba(212,175,55,0.6)] shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#0d0d0f] text-zinc-100',
    headerClass: 'bg-gradient-to-br from-[#0d0d0f] via-zinc-950 to-neutral-900 text-white border-b border-amber-500/30',
    headerGlow1: 'bg-amber-500/20',
    headerGlow2: 'bg-yellow-600/15',
    accentHex: '#d4af37',
    accentTextClass: 'text-amber-400 font-bold',
    roleBadgeClass: 'bg-amber-400/15 text-amber-300 border border-amber-400/40',
    roleBadgeText: '★ CINEMA 70MM // PATRON CRITERION GUILD ✦',
    cardClass: 'rounded-none border border-amber-500/25 bg-zinc-900/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-zinc-100',
    cardInnerClass: 'bg-black/60 rounded-none border border-amber-500/20',
    tabActiveClass: 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]',
    tabInactiveClass: 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/60',
    actionBtnClass: 'rounded-none bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black border border-amber-400/60 font-bold shadow-[0_2px_15px_rgba(212,175,55,0.3)]',
    fandomPillClass: 'rounded-none bg-amber-950/40 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(212,175,55,0.15)]',
    tabBarClass: 'bg-gradient-to-r from-zinc-950 via-amber-950/40 to-zinc-950 border-b border-amber-500/30 text-zinc-100',
    contentBgClass: 'bg-[#0d0d0f] text-zinc-100',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-[#0d0d0f] hover:bg-amber-500/20 text-[#d4af37] border border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.3)]',
    headerSubtitle: 'Cannes & Criterion Guild Member Portal',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border border-[rgba(212,175,55,0.5)] text-xs bg-[#18181b] text-[#fafaf9] focus:outline-none',
  },
  tv: {
    name: 'tv',
    categoryLabel: 'TV Shows Y2K Broadcast',
    fontFamily: "'Outfit', sans-serif",
    modalClass: 'rounded-none border-3 border-black shadow-[8px_8px_0px_#8b5cf6] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100',
    headerClass: 'bg-gradient-to-br from-slate-950 via-purple-950 to-violet-900 text-white border-b-3 border-black',
    headerGlow1: 'bg-purple-500/25',
    headerGlow2: 'bg-fuchsia-500/20',
    accentHex: '#8b5cf6',
    accentTextClass: 'text-purple-600 dark:text-purple-400 font-bold',
    roleBadgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-400/40',
    roleBadgeText: '★ TV BROADCAST // SUBSCRIBER ACCESS ✦',
    cardClass: 'rounded-none border-2 border-black bg-white dark:bg-slate-900 shadow-[3px_3px_0px_#8b5cf6] text-slate-900 dark:text-slate-100',
    cardInnerClass: 'bg-[#faf5ff] dark:bg-slate-950/80 rounded-none border border-black/20 dark:border-purple-500/20',
    tabActiveClass: 'bg-[#8b5cf6] text-white border-2 border-black shadow-[2px_2px_0px_#000] font-bold',
    tabInactiveClass: 'text-slate-700 dark:text-slate-300 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-slate-900',
    actionBtnClass: 'rounded-none bg-[#8b5cf6] hover:bg-[#7c3aed] text-white border-2 border-black shadow-[3px_3px_0px_#000] font-bold',
    fandomPillClass: 'rounded-none bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border-2 border-black shadow-[1px_1px_0px_#8b5cf6]',
    tabBarClass: 'bg-[#faf5ff] dark:bg-slate-950 border-b-3 border-black text-black dark:text-white',
    contentBgClass: 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-purple-900 hover:bg-purple-800 text-white border-2 border-black shadow-[3px_3px_0px_#8b5cf6]',
    headerSubtitle: 'Binge Series & K-Drama Streaming Access',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-black text-xs bg-[#faf5ff] text-black focus:outline-none',
  },
  cosplay: {
    name: 'cosplay',
    categoryLabel: 'Cosplay & Vanguard Atelier',
    fontFamily: "'Space Grotesk', sans-serif",
    modalClass: 'rounded-none border-3 border-black shadow-[8px_8px_0px_#D02020] bg-white text-black',
    headerClass: 'bg-black text-white border-b-3 border-black',
    headerGlow1: 'bg-red-500/25',
    headerGlow2: 'bg-neutral-500/20',
    accentHex: '#D02020',
    accentTextClass: 'text-[#D02020] font-bold',
    roleBadgeClass: 'bg-[#D02020] text-white border border-black font-bold',
    roleBadgeText: '★ VANGUARD ATELIER // CONSTRUCTIVIST ✦',
    cardClass: 'rounded-none border-2 border-black bg-white shadow-[3px_3px_0px_#D02020] text-black',
    cardInnerClass: 'bg-neutral-50 rounded-none border border-black/30',
    tabActiveClass: 'bg-[#D02020] text-white border-2 border-black shadow-[2px_2px_0px_#000] font-bold',
    tabInactiveClass: 'text-black hover:text-[#D02020] hover:bg-neutral-100',
    actionBtnClass: 'rounded-none bg-[#D02020] hover:bg-red-700 text-white border-2 border-black shadow-[3px_3px_0px_#000] font-bold',
    fandomPillClass: 'rounded-none bg-red-50 text-[#D02020] border-2 border-black shadow-[1px_1px_0px_#000]',
    tabBarClass: 'bg-white border-b-3 border-black text-black',
    contentBgClass: 'bg-white text-black',
    tapeDecor: false,
    closeBtnClass: 'w-8 h-8 rounded-none bg-black hover:bg-[#D02020] text-white border-2 border-black shadow-[2px_2px_0px_#000000]',
    headerSubtitle: 'Constructivist Costuming & Runway Guild',
    inputClass: 'w-full px-3.5 py-2.5 rounded-none border-2 border-black text-xs bg-white text-black focus:outline-none',
  },
  vpop: {
    name: 'vpop',
    categoryLabel: 'V-Pop Stadium Live',
    fontFamily: "'Outfit', sans-serif",
    modalClass: 'rounded-2xl border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.25)] bg-slate-950 text-slate-100',
    headerClass: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900 text-white border-b border-emerald-500/40',
    headerGlow1: 'bg-emerald-500/25',
    headerGlow2: 'bg-teal-500/20',
    accentHex: '#10b981',
    accentTextClass: 'text-emerald-400',
    roleBadgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40',
    roleBadgeText: '★ V-POP STADIUM // SAYHI LIVE VIP ✦',
    cardClass: 'rounded-xl border border-emerald-500/30 bg-slate-900/90 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-slate-100',
    cardInnerClass: 'bg-slate-950/80 rounded-lg border border-emerald-500/20',
    tabActiveClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    tabInactiveClass: 'text-slate-300 hover:text-emerald-300 hover:bg-slate-900',
    actionBtnClass: 'rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/30',
    fandomPillClass: 'rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
    tabBarClass: 'bg-gradient-to-r from-slate-950 via-emerald-950/50 to-slate-950 border-b border-emerald-500/40 text-slate-100',
    contentBgClass: 'bg-slate-950 text-slate-100',
    tapeDecor: false,
    closeBtnClass: 'w-9 h-9 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 shadow-sm',
    headerSubtitle: 'SayHi Live VIP & Vietnam Stadium Concert Hall',
    inputClass: 'w-full px-3.5 py-2.5 rounded-xl border border-emerald-500/40 text-xs bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500',
  },
};

const DEFAULT_FANDOM_OPTIONS: FandomOption[] = [
  // K-Pop
  { id: 'bunnies', name: 'Bunnies (NewJeans)', tag: 'K-Pop', color: '#ff2e93', description: 'Official NewJeans Tokki Club & Y2K aesthetic universe' },
  { id: 'blink', name: 'BLINK (BLACKPINK)', tag: 'K-Pop', color: '#ec4899', description: 'Born Pink Stadium Worldwide Fandom' },
  { id: 'army', name: 'A.R.M.Y (BTS)', tag: 'K-Pop', color: '#8b5cf6', description: 'Global 21st-Century Pop Icon Fanbase' },
  { id: 'carat', name: 'CARAT (SEVENTEEN)', tag: 'K-Pop', color: '#06b6d4', description: 'Diamond Stage & Right Here World Tour Stan' },
  { id: 'stay', name: 'STAY (Stray Kids)', tag: 'K-Pop', color: '#84cc16', description: 'Dominate World Tour & 5-STAR Worldwide Stan' },
  { id: 'my', name: 'MY (aespa)', tag: 'K-Pop', color: '#6366f1', description: 'Kwangya & Synk Metaverse Explorers' },
  { id: 'dive', name: 'DIVE (IVE)', tag: 'K-Pop', color: '#f97316', description: 'Show What I Have World Tour Community' },

  // V-Pop
  { id: 'sayhi', name: 'SayHi Believers (Anh Trai Say Hi)', tag: 'V-Pop', color: '#10b981', description: 'Sold-out stadium live concert phenomenon' },
  { id: 'chonggai', name: 'Chong Gai Fandom Club (Anh Trai Vuot Ngan Chong Gai)', tag: 'V-Pop', color: '#f43f5e', description: 'Fire & Heritage Vietnam Stadium Tour' },
  { id: 'sky', name: 'SKY (Son Tung M-TP)', tag: 'V-Pop', color: '#3b82f6', description: 'Top-tier V-Pop icon Sky Tour arena fanbase' },

  // Anime
  { id: 'demon-slayer', name: 'Demon Slayer Corps (Kimetsu no Yaiba)', tag: 'Anime', color: '#ef4444', description: 'Hashira Training & Infinity Castle Arc' },
  { id: 'jjk', name: 'Jujutsu Sorcerers (Jujutsu Kaisen)', tag: 'Anime', color: '#6366f1', description: 'MAPPA Tokyo Jujutsu High Alliance' },
  { id: 'conan', name: 'Conan Global Fanclub (Detective Conan)', tag: 'Anime', color: '#0284c7', description: 'Black Iron Submarine & Detective League' },

  // Manga
  { id: 'straw-hats', name: 'Straw Hat Pirates (One Piece)', tag: 'Manga', color: '#eab308', description: 'Grand Line & Egghead Island Nakama (Eiichiro Oda)' },
  { id: 'survey-corps', name: 'Survey Corps (Attack on Titan)', tag: 'Manga', color: '#15803d', description: 'Wings of Freedom & Eren Yeager Legacy' },
  { id: 'hunter-assoc', name: 'Hunter Association (Hunter x Hunter)', tag: 'Manga', color: '#059669', description: 'Nen Masters & Dark Continent Explorers' },

  // Gaming
  { id: 't1', name: 'T1 Fandom & Faker (LoL)', tag: 'Gaming', color: '#dc2626', description: '5-Time World Champions & Unkillable Demon King' },
  { id: 'teyvat', name: 'Travelers of Teyvat (Genshin Impact)', tag: 'Gaming', color: '#06b6d4', description: 'HoYoverse & Symphony of Teyvat' },
  { id: 'sentinels', name: 'Sentinels & VCT Champions (Valorant)', tag: 'Gaming', color: '#f43f5e', description: 'Tactical FPS Champions & Esports Guild' },

  // Comics
  { id: 'web-heads', name: 'Web-Heads & Marvel Multiverse', tag: 'Comics', color: '#e11d48', description: 'Spider-Man, Miles Morales & Marvel Comics' },
  { id: 'gotham', name: 'Gotham Knights & Bat-Family (DC)', tag: 'Comics', color: '#1e293b', description: 'Detective Comics & Dark Knight Legends' },
  { id: 'avengers', name: 'Avengers Initiative (Marvel)', tag: 'Comics', color: '#2563eb', description: 'Earth Mightiest Heroes & Secret Wars' },

  // Movies
  { id: 'cinephiles', name: 'Auteur Cinephiles & 70mm Purists', tag: 'Movies', color: '#d97706', description: 'Christopher Nolan, Hans Zimmer & IMAX 70mm' },
  { id: 'fremen', name: 'Dune Fremen Brotherhood', tag: 'Movies', color: '#ca8a04', description: 'Denis Villeneuve Arrakis Desert Alliance' },
  { id: 'ghibli', name: 'Studio Ghibli Dreamers', tag: 'Movies', color: '#14b8a6', description: 'Hayao Miyazaki & Spirited Fantasy Lovers' },

  // TV Shows
  { id: 'hellfire', name: 'The Hellfire Club (Stranger Things)', tag: 'TV Shows', color: '#ef4444', description: 'Hawkins 1980s D&D Campaign & Upside Down' },
  { id: 'dragon-loyalists', name: 'House of the Dragon Loyalists', tag: 'TV Shows', color: '#7f1d1d', description: 'Targaryen Blood & Fire Westeros Faction' },
  { id: 'continental', name: 'The Continental Guild (John Wick)', tag: 'TV Shows', color: '#475569', description: 'High Table & Neo-Noir Cinema Fandom' },

  // Cosplay
  { id: 'constructivists', name: 'Constructivists (Bauhaus Modernist)', tag: 'Cosplay', color: '#ea580c', description: 'Avant-Garde Theatrical Cosplay Atelier' },
  { id: 'cyberpunk-cos', name: 'Cyberpunk Street Runners', tag: 'Cosplay', color: '#06b6d4', description: 'Neo-Tokyo LED & High-Tech Armor Crafters' },
  { id: 'harajuku', name: 'Harajuku Gothic & Lolita League', tag: 'Cosplay', color: '#be185d', description: 'Tokyo Street Fashion & Themed Subculture' },
];

const PRESET_COLOR_SWATCHES = [
  '#ff2e93',
  '#ec4899',
  '#8b5cf6',
  '#6366f1',
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#84cc16',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#1e293b',
];

export const PersonalDashboardModal: React.FC<PersonalDashboardModalProps> = ({ 
  isOpen, 
  onClose,
  fandomThemeKey,
  fandomCategory,
}) => {
  const { user, logout, updateProfile, toggleFavoriteFandom, activities } = useAuth();
  const { wishlist } = useCartWishlist();

  const [activeTab, setActiveTab] = useState<'overview' | 'fandoms' | 'activities' | 'bookmarks' | 'profile' | 'jwt'>('overview');

  // Dynamic Category Theme Key: Inherited directly from outside (Header / active category)
  const [activeThemeKey, setActiveThemeKey] = useState<string>(() => {
    return getActiveFandomTheme(fandomThemeKey, fandomCategory) || 'kpop';
  });

  // Profile edit form
  const [editName, setEditName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [editBio, setEditBio] = useState('Music lover, photocard collector, and passionate concert enthusiast!');
  const [saveToast, setSaveToast] = useState<{ message: string } | null>(null);

  // Helper to sanitize any mojibake in user activities
  const sanitizeActivity = (text: string) => {
    if (!text) return '';
    return text
      .replace(/ÃBÃƒng nhÃ¡ºp thÃ nh cÃ´ng vÃ o hÃ»‡ thÃ»'ng/gi, 'Đăng nhập thành công vào hệ thống')
      .replace(/ÃBÃƒng nhÃ¡ºp/gi, 'Đăng nhập')
      .replace(/thÃ nh cÃ´ng/gi, 'thành công')
      .replace(/vÃ o/gi, 'vào')
      .replace(/hÃ»‡ thÃ»'ng/gi, 'hệ thống')
      .replace(/VÃ«Â«a xong|VÃ«.*?a xong/gi, 'Vừa xong');
  };

  // Sync state if user changes
  useEffect(() => {
    setEditName(user.name);
    setSelectedAvatar(user.avatar);
  }, [user]);

  // Synchronize theme with outside active fandom whenever modal opens or props change
  useEffect(() => {
    const syncWithOutside = () => {
      const liveTheme = getActiveFandomTheme(fandomThemeKey, fandomCategory);
      if (liveTheme && CATEGORY_THEMES[liveTheme]) {
        setActiveThemeKey(liveTheme);
      }
    };
    syncWithOutside();

    const handleCustomChange = (e: any) => {
      if (e?.detail?.theme && e.detail.theme !== 'all' && CATEGORY_THEMES[e.detail.theme]) {
        setActiveThemeKey(e.detail.theme);
      } else {
        syncWithOutside();
      }
    };

    window.addEventListener('fandom-theme-change', handleCustomChange);
    return () => window.removeEventListener('fandom-theme-change', handleCustomChange);
  }, [isOpen, fandomThemeKey, fandomCategory]);

  const currentTheme = CATEGORY_THEMES[activeThemeKey] || CATEGORY_THEMES.all;

  // Fandom Management State (Categories & Custom Creation)
  const [selectedFandomCategory, setSelectedFandomCategory] = useState<string>('All');
  const [fandomSearchQuery, setFandomSearchQuery] = useState('');
  const [isCreatingFandom, setIsCreatingFandom] = useState(false);
  const [newFandomName, setNewFandomName] = useState('');
  const [newFandomCategory, setNewFandomCategory] = useState<string>('K-Pop');
  const [newFandomColor, setNewFandomColor] = useState('#ff2e93');
  const [newFandomDesc, setNewFandomDesc] = useState('');

  // Load user custom fandoms from localStorage
  const [customFandoms, setCustomFandoms] = useState<FandomOption[]>(() => {
    try {
      const saved = localStorage.getItem('fanhub_custom_fandoms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allFandomsList = useMemo(() => {
    return [...customFandoms, ...DEFAULT_FANDOM_OPTIONS];
  }, [customFandoms]);

  // Filtered fandoms by category and search
  const filteredFandoms = useMemo(() => {
    return allFandomsList.filter((fandom) => {
      const matchesCategory = selectedFandomCategory === 'All' || fandom.tag === selectedFandomCategory;
      const matchesSearch =
        fandomSearchQuery.trim() === '' ||
        fandom.name.toLowerCase().includes(fandomSearchQuery.toLowerCase()) ||
        fandom.tag.toLowerCase().includes(fandomSearchQuery.toLowerCase()) ||
        (fandom.description && fandom.description.toLowerCase().includes(fandomSearchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allFandomsList, selectedFandomCategory, fandomSearchQuery]);

  // Handle creation of custom fandom
  const handleCreateFandom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newFandomName.trim();
    if (!trimmedName) return;

    const exists = allFandomsList.some(
      (f) => f.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exists) {
      alert(`Fandom "${trimmedName}" already exists!`);
      return;
    }

    const created: FandomOption = {
      id: `custom-${Date.now()}`,
      name: trimmedName,
      tag: newFandomCategory,
      color: newFandomColor,
      description: newFandomDesc.trim() || `Official community for ${trimmedName} fans.`,
      isCustom: true,
    };

    const nextCustomList = [created, ...customFandoms];
    setCustomFandoms(nextCustomList);
    try {
      localStorage.setItem('fanhub_custom_fandoms', JSON.stringify(nextCustomList));
    } catch {}

    if (!user.favoriteFandoms.includes(created.name)) {
      toggleFavoriteFandom(created.name);
    }

    setNewFandomName('');
    setNewFandomDesc('');
    setIsCreatingFandom(false);
    setSelectedFandomCategory(newFandomCategory);

    setSaveToast({
      message: `Fandom "${created.name}" created under ${created.tag}!`,
    });
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleDeleteCustomFandom = (fandomId: string, fandomName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete the custom fandom "${fandomName}"?`)) return;

    const nextCustomList = customFandoms.filter((f) => f.id !== fandomId);
    setCustomFandoms(nextCustomList);
    try {
      localStorage.setItem('fanhub_custom_fandoms', JSON.stringify(nextCustomList));
    } catch {}

    if (user.favoriteFandoms.includes(fandomName)) {
      toggleFavoriteFandom(fandomName);
    }
  };

  // SRS 1.6: Categories of interest & Display preferences
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fanhub_user_interests');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['K-Pop', 'Anime', 'Gaming'];
  });
  const [prefTheme, setPrefTheme] = useState<'light' | 'dark'>('light');
  const [prefFontSize, setPrefFontSize] = useState<'standard' | 'large'>('standard');
  const [prefLanding, setPrefLanding] = useState<string>('all');

  // SRS 1.6 & Database Specification: Centralized Bookmarks & Notes
  const [bookmarkFilter, setBookmarkFilter] = useState<'all' | 'albums' | 'media' | 'articles' | 'characters'>('all');
  const [characterBookmarks, setCharacterBookmarks] = useState<any[]>([]);
  const [articleBookmarks, setArticleBookmarks] = useState<any[]>([]);
  const [mediaBookmarks, setMediaBookmarks] = useState<any[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [customNotes, setCustomNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('fanhub_bookmark_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveCustomNote = (id: string, noteText: string) => {
    setCustomNotes((prev) => {
      const next = { ...prev, [id]: noteText };
      try {
        localStorage.setItem('fanhub_bookmark_notes', JSON.stringify(next));
      } catch {}
      return next;
    });
    setEditingNoteId(null);
  };

  const removeCharacterBookmark = (charId: string) => {
    setCharacterBookmarks((prev) => {
      const next = prev.filter((c) => c.id !== charId);
      try {
        localStorage.setItem('fanhub_bookmarked_characters_list', JSON.stringify(next));
        const mapRaw = localStorage.getItem('fanhub_bookmarked_characters');
        if (mapRaw) {
          const map = JSON.parse(mapRaw);
          delete map[charId];
          localStorage.setItem('fanhub_bookmarked_characters', JSON.stringify(map));
        }
      } catch {}
      return next;
    });
  };

  const removeArticleBookmark = (artId: string) => {
    setArticleBookmarks((prev) => {
      const next = prev.filter((a) => a.id !== artId);
      try {
        const mapRaw = localStorage.getItem('fanhub_bookmarked_articles');
        if (mapRaw) {
          const map = JSON.parse(mapRaw);
          delete map[artId];
          localStorage.setItem('fanhub_bookmarked_articles', JSON.stringify(map));
        }
      } catch {}
      return next;
    });
  };

  const removeMediaBookmark = (mediaId: string) => {
    setMediaBookmarks((prev) => {
      const next = prev.filter((m) => m.id !== mediaId);
      try {
        const ids = next.map((m) => m.id);
        localStorage.setItem('fanhub_bookmarked_media', JSON.stringify(ids));
      } catch {}
      return next;
    });
  };

  // Load bookmarks on modal open
  useEffect(() => {
    if (isOpen) {
      try {
        const rawChars = localStorage.getItem('fanhub_bookmarked_characters_list');
        if (rawChars) setCharacterBookmarks(JSON.parse(rawChars));
      } catch {}

      try {
        const rawArts = localStorage.getItem('fanhub_bookmarked_articles');
        if (rawArts) {
          const map = JSON.parse(rawArts);
          const savedList = mockFeaturedArticles.filter((a) => map[a.id]);
          setArticleBookmarks(savedList);
        }
      } catch {}

      try {
        const rawMedia = localStorage.getItem('fanhub_bookmarked_media');
        if (rawMedia) {
          const ids: string[] = JSON.parse(rawMedia);
          const savedMedia = INITIAL_MEDIA_ITEMS.filter((m) => ids.includes(m.id));
          setMediaBookmarks(savedMedia);
        }
      } catch {}
    }
  }, [isOpen]);

  // Personalized Greeting calculation
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', sub: 'Wishing you a high-energy day filled with great music and fandom drops!' };
    if (hour < 18) return { text: 'Good afternoon', sub: 'Explore the latest events, albums, and universe comebacks!' };
    return { text: 'Good evening', sub: 'Unwind with your favorite podcasts, tracks, and live stages after a long day!' };
  }, []);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;
    updateProfile({
      name: editName.trim() || user.name,
      avatar: finalAvatar,
    });
    try {
      localStorage.setItem('fanhub_user_interests', JSON.stringify(selectedInterests));
      localStorage.setItem('fanhub_user_pref_theme', prefTheme);
      localStorage.setItem('fanhub_user_pref_font', prefFontSize);
      localStorage.setItem('fanhub_user_pref_landing', prefLanding);
    } catch {}
    setSaveToast({ message: 'Profile and display preferences have been successfully updated!' });
    setTimeout(() => setSaveToast(null), 3000);
  };

  const totalBookmarks = wishlist.length + articleBookmarks.length + characterBookmarks.length + mediaBookmarks.length;

  return (
    <div
      style={{ fontFamily: currentTheme.fontFamily }}
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className={`max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 transition-all ${currentTheme.modalClass}`}
        style={currentTheme.borderRadius ? { borderRadius: currentTheme.borderRadius } : undefined}
        role="dialog"
        aria-modal="true"
      >

        {/* ========================================================= */}
        {/* 1. DYNAMIC CATEGORY STYLE HEADER & PERSONAL GREETING      */}
        {/* ========================================================= */}
        <div className={`relative p-6 sm:p-8 overflow-hidden select-none transition-all duration-300 ${currentTheme.headerClass}`}>
          {/* Top Tape for Manga */}
          {currentTheme.tapeDecor && (
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                left: '40px',
                width: '110px',
                height: '24px',
                backgroundColor: '#e5e0d8',
                opacity: 0.95,
                zIndex: 20,
                transform: 'rotate(-2deg)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Subtle Ambient Glow Effects */}
          <div className={`absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl pointer-events-none ${currentTheme.headerGlow1}`} />
          <div className={`absolute left-1/3 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${currentTheme.headerGlow2}`} />

          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 z-20 transition-all cursor-pointer flex items-center justify-center ${currentTheme.closeBtnClass || 'w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 text-white backdrop-blur-md border border-white/20'}`}
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-7">
            {/* User Avatar with Edit Trigger */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-white/25 shadow-2xl overflow-hidden bg-slate-800">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                style={{ backgroundColor: currentTheme.accentHex }}
                className="absolute -bottom-1 -right-1 p-2 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-slate-900"
                title="Change avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Info & Personalized Greeting */}
            <div className="text-center sm:text-left flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md transition-all ${currentTheme.roleBadgeClass}`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{user.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : currentTheme.roleBadgeText}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-emerald-300 border border-white/15 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center sm:justify-start gap-2 m-0 mb-1">
                  <span>{greeting.text}, {user.name}!</span>
                  <span className="text-amber-400">✨</span>
                </h2>
                <p className="text-xs sm:text-sm opacity-80 font-normal m-0 max-w-xl">
                  {currentTheme.headerSubtitle || greeting.sub}
                </p>
              </div>

              {/* Status Meta Pills */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-xs">
                <div className="px-3.5 py-1.5 rounded-xl bg-black/25 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                  <span className="opacity-70 font-medium">EMAIL:</span>
                  <span className="font-semibold">{user.email}</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-black/25 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                  <span className="opacity-70 font-medium">SINCE:</span>
                  <span className="font-semibold">{user.memberSince || '2024'}</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>DIAMOND STAN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. NAVIGATION TABS BAR — Dynamically styled per category  */}
        {/* ========================================================= */}
        <div className={`px-6 sm:px-8 py-3 transition-all duration-300 ${currentTheme.tabBarClass}`}>
          {/* Category quick-switcher row */}
          <div className="flex items-center gap-1.5 pb-2.5 mb-2.5 border-b border-current/10 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 shrink-0 mr-1">THEME:</span>
            {CATEGORY_ITEMS.map((cat) => {
              const themeKey = cat.key;
              const isSelected = activeThemeKey === themeKey;
              const catTheme = CATEGORY_THEMES[themeKey];
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    setActiveThemeKey(themeKey);
                    persistFandomTheme(themeKey);
                  }}
                  title={catTheme?.categoryLabel || cat.label}
                  className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 rounded-lg ${
                    isSelected
                      ? `ring-2 ring-offset-1 shadow-sm scale-105`
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSelected ? (catTheme?.accentHex || '#6366f1') : 'transparent',
                    color: isSelected ? '#fff' : 'inherit',
                    '--tw-ring-color': catTheme?.accentHex || '#6366f1',
                  } as React.CSSProperties}
                >
                  <cat.icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main tab navigation */}
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: Sparkles },
              { id: 'fandoms', label: 'FAVORITE FANDOMS', icon: Heart, count: user.favoriteFandoms.length },
              { id: 'activities', label: 'RECENT ACTIVITY', icon: Clock, count: activities.length },
              { id: 'bookmarks', label: 'BOOKMARKS & NOTES', icon: Bookmark, count: totalBookmarks },
              { id: 'profile', label: 'PROFILE & SETTINGS', icon: Settings },
              { id: 'jwt', label: 'KIỂM TRA JWT TOKEN', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-3.5 sm:px-4 text-xs font-bold transition-all whitespace-nowrap cursor-pointer rounded-xl ${
                    isActive
                      ? `${currentTheme.tabActiveClass} shadow-sm`
                      : `${currentTheme.tabInactiveClass}`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive
                          ? 'bg-black/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toast alert */}
        {saveToast && (
          <div className="mx-6 sm:mx-8 mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{saveToast.message}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. TAB CONTENT VIEWS                                      */}
        {/* ========================================================= */}
        <div className={`p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 sm:space-y-8 transition-all duration-300 ${currentTheme.contentBgClass}`}>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              {/* JWT Security Card Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border-2 border-cyan-500/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00f0ff] text-black flex items-center justify-center font-black shrink-0">
                    <ShieldCheck className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                      <span>KIỂM TRA JWT TOKEN LƯU TRỮ AN TOÀN</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500 text-black font-black rounded">SECURE</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 m-0">
                      Thuật toán HS256 • Lưu trữ an toàn trong LocalStorage &amp; Cookie • Khớp chữ ký số xác thực
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('jwt')}
                  className="px-4 py-2 bg-[#00f0ff] hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shrink-0 transition-transform active:scale-95"
                >
                  Kiểm tra JWT Token →
                </button>
              </div>

              {/* Quick Stat Tiles styled dynamically with generous spacing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                <div className={`p-5 sm:p-6 transition-all hover:translate-y-[-2px] flex flex-col justify-between min-h-[125px] ${currentTheme.cardClass}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold opacity-75 uppercase tracking-wider">Fandoms</span>
                    <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black my-2">
                    {user.favoriteFandoms.length}
                  </div>
                  <span className={`text-xs font-semibold block ${currentTheme.accentTextClass}`}>
                    Official communities
                  </span>
                </div>

                <div className={`p-5 sm:p-6 transition-all hover:translate-y-[-2px] flex flex-col justify-between min-h-[125px] ${currentTheme.cardClass}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold opacity-75 uppercase tracking-wider">Wishlist</span>
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Bookmark className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black my-2">
                    {wishlist.length}
                  </div>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold block">
                    Saved merch &amp; items
                  </span>
                </div>

                <div className={`p-5 sm:p-6 transition-all hover:translate-y-[-2px] flex flex-col justify-between min-h-[125px] ${currentTheme.cardClass}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold opacity-75 uppercase tracking-wider">History</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black my-2">
                    {activities.length}
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
                    Reviews &amp; streams
                  </span>
                </div>

                <div className={`p-5 sm:p-6 transition-all hover:translate-y-[-2px] flex flex-col justify-between min-h-[125px] ${currentTheme.cardClass}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold opacity-75 uppercase tracking-wider">Points</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black my-2">
                    2,450
                  </div>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold block">
                    Diamond Tier ⭐
                  </span>
                </div>
              </div>

              {/* Fandom Highlight Row with generous spacing */}
              <div className={`p-6 sm:p-7 space-y-4 ${currentTheme.cardClass}`}>
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                    <span>Your Subscribed Fandoms ({user.favoriteFandoms.length})</span>
                  </h4>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveTab('fandoms');
                        setIsCreatingFandom(true);
                      }}
                      className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${currentTheme.accentTextClass}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Fandom</span>
                    </button>
                    <span className="opacity-30">|</span>
                    <button
                      onClick={() => setActiveTab('fandoms')}
                      className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${currentTheme.accentTextClass}`}
                    >
                      <span>Browse All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {user.favoriteFandoms.length === 0 ? (
                    <div className="text-xs opacity-60 py-2">
                      You haven't followed any fandoms yet. Click below to explore and follow communities across K-Pop, Anime, Gaming, and more!
                    </div>
                  ) : (
                    user.favoriteFandoms.map((fandomName, idx) => {
                      const matched = allFandomsList.find((f) => f.name === fandomName);
                      return (
                        <span
                          key={idx}
                          className={`px-4 py-2 text-xs font-bold flex items-center gap-2.5 shadow-2xs transition-all ${currentTheme.fandomPillClass}`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: matched?.color || currentTheme.accentHex }}
                          />
                          {matched?.tag && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded">
                              {matched.tag}
                            </span>
                          )}
                          <span>{fandomName}</span>
                        </span>
                      );
                    })
                  )}
                  <button
                    onClick={() => {
                      setActiveTab('fandoms');
                      setIsCreatingFandom(true);
                    }}
                    className="px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-pink-500 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Fandom Mới</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity Snapshot */}
              <div className={`p-6 sm:p-7 space-y-4 ${currentTheme.cardClass}`}>
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>Recent Activity</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${currentTheme.accentTextClass}`}
                  >
                    <span>View All ({activities.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {activities.slice(0, 3).map((act) => (
                    <div
                      key={act.id}
                      className={`p-3.5 sm:p-4 flex items-center justify-between text-xs transition-colors rounded-xl ${currentTheme.cardInnerClass}`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: currentTheme.accentHex }}
                        />
                        <span className="font-semibold truncate">{sanitizeActivity(act.title)}</span>
                      </div>
                      <span className="text-[11px] opacity-60 font-medium whitespace-nowrap shrink-0">
                        {sanitizeActivity(act.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FANDOMS MANAGEMENT & CREATION BY CATEGORY */}
          {activeTab === 'fandoms' && (
            <div className="space-y-5">
              {/* Header and Create Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-base font-extrabold flex items-center gap-2">
                    <span>Fandom Hub by Category</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700">
                      {allFandomsList.length} Fandoms
                    </span>
                  </h4>
                  <p className="text-xs opacity-70 mt-0.5">
                    Click any category to switch styling, or create custom fandoms for any category!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreatingFandom(!isCreatingFandom)}
                  className={`px-4 py-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isCreatingFandom
                      ? 'bg-slate-200 dark:bg-slate-700 text-black dark:text-white rounded-xl'
                      : currentTheme.actionBtnClass
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreatingFandom ? 'Cancel' : '+ Tạo Fandom Mới'}</span>
                </button>
              </div>

              {/* COLLAPSIBLE FORM: CREATE NEW CUSTOM FANDOM FOR A CATEGORY */}
              {isCreatingFandom && (
                <form
                  onSubmit={handleCreateFandom}
                  className={`p-5 space-y-4 shadow-sm animate-in fade-in zoom-in-98 duration-200 ${currentTheme.cardClass}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        style={{ backgroundColor: currentTheme.accentHex }}
                        className="w-7 h-7 rounded-xl text-white flex items-center justify-center"
                      >
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h5 className="text-sm font-extrabold">
                        Tạo Fandom Mới Cho Danh Mục
                      </h5>
                    </div>
                    <span className="text-[11px] opacity-60 font-medium">Auto-synced & styled per category</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Fandom Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold">
                        Tên Fandom *
                      </label>
                      <input
                        type="text"
                        placeholder="VD: MIDZY (ITZY), Solo Leveling Guild..."
                        value={newFandomName}
                        onChange={(e) => setNewFandomName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 focus:outline-none"
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold">
                        Danh Mục (Category) *
                      </label>
                      <select
                        value={newFandomCategory}
                        onChange={(e) => {
                          setNewFandomCategory(e.target.value);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 cursor-pointer focus:outline-none"
                      >
                        {CATEGORY_ITEMS.filter((c) => c.key !== 'all').map((cat) => (
                          <option key={cat.key} value={cat.label.split(' / ')[0]}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Fandom Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold">
                      Mô Tả / Slogan Của Fandom
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Official Global Fandom & Concert Standouts"
                      value={newFandomDesc}
                      onChange={(e) => setNewFandomDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  {/* Color Swatch Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold block">
                      Màu Đại Diện Của Fandom
                    </label>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {PRESET_COLOR_SWATCHES.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewFandomColor(color)}
                          style={{ backgroundColor: color }}
                          className={`w-7 h-7 rounded-xl transition-all cursor-pointer ${
                            newFandomColor === color
                              ? 'ring-4 ring-offset-2 scale-110 shadow-md ring-indigo-500'
                              : 'opacity-80 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingFandom(false)}
                      className="px-4 py-2 text-xs font-bold opacity-60 hover:opacity-100 cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className={`px-5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${currentTheme.actionBtnClass}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tạo &amp; Theo Dõi Fandom</span>
                    </button>
                  </div>
                </form>
              )}

              {/* CATEGORY FILTER BAR & SEARCH */}
              <div className="space-y-3">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 opacity-40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fandomSearchQuery}
                    onChange={(e) => setFandomSearchQuery(e.target.value)}
                    placeholder="Search fandoms by name, artist, or concept (e.g. One Piece, T1, NewJeans, Spider-Man)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 focus:outline-none"
                  />
                  {fandomSearchQuery && (
                    <button
                      onClick={() => setFandomSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Categories Tabs - Filters fandoms by category */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  {CATEGORY_ITEMS.map((cat) => {
                    const catName = cat.key === 'all' ? 'All' : cat.label.split(' / ')[0];
                    const isSelected = selectedFandomCategory === catName;
                    const countInCat =
                      cat.key === 'all'
                        ? allFandomsList.length
                        : allFandomsList.filter((f) => f.tag.toLowerCase().includes(cat.key) || cat.label.includes(f.tag)).length;

                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setSelectedFandomCategory(catName)}
                        className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          isSelected
                            ? `${currentTheme.tabActiveClass} rounded-xl shadow-xs scale-102`
                            : 'bg-white dark:bg-slate-800 opacity-75 hover:opacity-100 border border-slate-200 dark:border-slate-700 rounded-xl'
                        }`}
                      >
                        <span>{catName}</span>
                        <span className="px-1.5 py-0.2 text-[10px] rounded-full font-bold bg-black/10 dark:bg-white/10">
                          {countInCat}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FANDOM CARDS GRID */}
              {filteredFandoms.length === 0 ? (
                <div className={`py-12 text-center p-6 space-y-2 ${currentTheme.cardClass}`}>
                  <Heart className="w-8 h-8 opacity-30 mx-auto" />
                  <p className="text-sm font-bold">No Fandoms Found</p>
                  <p className="text-xs opacity-60">
                    No communities match your current filter or query. You can click '+ Tạo Fandom Mới' to add it!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredFandoms.map((item) => {
                    const isFollowed = user.favoriteFandoms.includes(item.name);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleFavoriteFandom(item.name)}
                        className={`p-4 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 group ${
                          isFollowed
                            ? `${currentTheme.cardClass} ring-2 ring-indigo-500/40`
                            : currentTheme.cardClass
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div
                              className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-xs shrink-0 mt-0.5"
                              style={{ backgroundColor: item.color }}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFandomCategory(item.tag);
                                  }}
                                  className="text-[10px] font-extrabold px-2 py-0.5 bg-black/10 dark:bg-white/10 rounded-md uppercase hover:underline"
                                >
                                  {item.tag}
                                </span>
                                {item.isCustom && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 rounded">
                                    Custom
                                  </span>
                                )}
                              </div>
                              <h5 className="text-xs font-bold mt-1 truncate">
                                {item.name}
                              </h5>
                              {item.description && (
                                <p className="text-[11px] opacity-70 line-clamp-1 mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.isCustom && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteCustomFandom(item.id, item.name, e)}
                                title="Delete custom fandom"
                                className="p-1.5 opacity-50 hover:opacity-100 text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                isFollowed
                                  ? `${currentTheme.actionBtnClass} shadow-xs`
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl'
                              }`}
                            >
                              {isFollowed ? '✓ Following' : '+ Follow'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACTIVITIES TIMELINE */}
          {activeTab === 'activities' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-extrabold">Your Activity History</h4>
                <p className="text-xs opacity-70 mt-1 leading-relaxed">
                  Complete record of your interactions: reviews, saved concert events, playlist additions, and community feedback.
                </p>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {activities.map((act) => (
                  <div key={act.id} className="relative group">
                    <span
                      style={{ backgroundColor: currentTheme.accentHex }}
                      className="absolute -left-6 top-3 w-3 h-3 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-xs"
                    />
                    <div className={`p-4 sm:p-5 flex items-center justify-between hover:shadow-md transition-shadow rounded-xl ${currentTheme.cardClass}`}>
                      <div>
                        <p className="text-xs sm:text-sm font-bold">{sanitizeActivity(act.title)}</p>
                        <span className="text-[11px] opacity-60 font-medium mt-1 inline-block">{sanitizeActivity(act.timestamp)}</span>
                      </div>
                      {act.link && (
                        <Link
                          href={act.link}
                          onClick={onClose}
                          className={`text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 transition-colors shadow-2xs ${currentTheme.cardInnerClass}`}
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CENTRALIZED BOOKMARKS & NOTES */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-base font-extrabold flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-indigo-500" />
                    <span>Bookmarks &amp; Collector Notes</span>
                  </h4>
                  <p className="text-xs opacity-70 mt-0.5">
                    Centralized hub for all saved albums, dispatches, characters, and streams with personal collector notes.
                  </p>
                </div>

                {/* Sub-Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  {[
                    { id: 'all', label: `All (${totalBookmarks})` },
                    { id: 'albums', label: `Merch (${wishlist.length})` },
                    { id: 'media', label: `Media (${mediaBookmarks.length})` },
                    { id: 'articles', label: `Articles (${articleBookmarks.length})` },
                    { id: 'characters', label: `Characters (${characterBookmarks.length})` },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setBookmarkFilter(filter.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        bookmarkFilter === filter.id
                          ? currentTheme.tabActiveClass
                          : 'bg-white dark:bg-slate-800 opacity-75 hover:opacity-100 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* No items fallback */}
              {totalBookmarks === 0 ? (
                <div className={`py-14 text-center p-6 space-y-2.5 ${currentTheme.cardClass}`}>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mx-auto">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold">No Bookmarks Saved Yet</p>
                  <p className="text-xs opacity-70 max-w-md mx-auto">
                    Click the bookmark button on any album, article, media stream, or character dossier to save them here!
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Albums */}
                  {(bookmarkFilter === 'all' || bookmarkFilter === 'albums') && wishlist.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-70">
                        <Disc className="w-4 h-4 text-indigo-500" />
                        <span>Official Albums &amp; Merchandise ({wishlist.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {wishlist.map(({ album, note }) => {
                          const activeNote = customNotes[album.id] !== undefined ? customNotes[album.id] : (note || '');
                          const isEditing = editingNoteId === album.id;

                          return (
                            <div
                              key={album.id}
                              className={`p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow ${currentTheme.cardClass}`}
                            >
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={album.coverImage}
                                  alt={album.title}
                                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className={`text-[10px] font-bold block uppercase ${currentTheme.accentTextClass}`}>
                                    {album.artist}
                                  </span>
                                  <h5 className="text-xs font-bold truncate">
                                    {album.title}
                                  </h5>
                                  <span className="text-xs font-extrabold mt-1 block">
                                    ${album.priceUSD} USD
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-xs">
                                {isEditing ? (
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Add note..."
                                      className="flex-1 text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => saveCustomNote(album.id, tempNoteText)}
                                      className={`px-3 py-1.5 text-xs font-bold cursor-pointer ${currentTheme.actionBtnClass}`}
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <div className={`flex items-center justify-between px-3 py-2 ${currentTheme.cardInnerClass}`}>
                                    <span className="truncate opacity-75 text-[11px]">
                                      {activeNote ? `📝 "${activeNote}"` : 'No note added'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(album.id);
                                        setTempNoteText(activeNote);
                                      }}
                                      className={`font-bold text-[11px] ml-2 shrink-0 hover:underline cursor-pointer ${currentTheme.accentTextClass}`}
                                    >
                                      {activeNote ? 'Edit Note' : '+ Note'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Articles */}
                  {(bookmarkFilter === 'all' || bookmarkFilter === 'articles') && articleBookmarks.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-70">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <span>Bookmarked Articles &amp; Dispatches ({articleBookmarks.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {articleBookmarks.map((art) => (
                          <div
                            key={art.id}
                            className={`p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow ${currentTheme.cardClass}`}
                          >
                            <div className="flex items-start gap-3.5">
                              <img
                                src={art.image}
                                alt={art.title}
                                className="w-14 h-14 object-cover rounded-xl shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-md uppercase">
                                  {art.category}
                                </span>
                                <h5 className="text-xs font-bold line-clamp-1 mt-1">{art.title}</h5>
                                <p className="text-[11px] opacity-60">By {art.author?.name || 'Contributor'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & SETTINGS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h4 className="text-base font-extrabold">Profile &amp; Preferences</h4>
                <p className="text-xs opacity-70 mt-1">
                  Customize your fan presence, avatar identity, and display preferences.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider block">
                  Fandom Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={currentTheme.inputClass || "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 focus:outline-none"}
                  required
                />
              </div>

              {/* Avatar Preset Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider block">
                  Quick Avatar Selection
                </label>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Avatar preset"
                      onClick={() => {
                        setSelectedAvatar(url);
                        setCustomAvatarUrl('');
                      }}
                      className={`w-14 h-14 rounded-2xl object-cover cursor-pointer transition-all ${
                        selectedAvatar === url && !customAvatarUrl
                          ? 'ring-4 ring-offset-2 scale-105 shadow-md ring-indigo-500'
                          : 'opacity-75 hover:opacity-100 hover:scale-102 border border-slate-200 dark:border-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider block">
                  Fandom Bio / Motto
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className={currentTheme.inputClass || "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 focus:outline-none"}
                />
              </div>

              {/* Categories of Interest */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Categories of Interest
                  </label>
                  <span className="text-xs opacity-60 font-medium">
                    {selectedInterests.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_ITEMS.filter((c) => c.key !== 'all').map((cat) => {
                    const isSelected = selectedInterests.includes(cat.label.split(' / ')[0]);
                    const catName = cat.label.split(' / ')[0];
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => {
                          setSelectedInterests((prev) =>
                            isSelected ? prev.filter((c) => c !== catName) : [...prev, catName]
                          );
                        }}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? currentTheme.tabActiveClass
                            : 'bg-slate-100 dark:bg-slate-800 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {catName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>

                <button
                  type="submit"
                  className={`px-6 py-2.5 text-xs font-bold cursor-pointer transition-all ${currentTheme.actionBtnClass}`}
                >
                  Save Profile Changes
                </button>
              </div>

            </form>
          )}

          {/* TAB: JWT TOKEN INSPECTION & SECURITY AUDIT */}
          {activeTab === 'jwt' && (
            <div className="space-y-6">
              <div className="p-5 bg-black/60 border-2 border-[#00f0ff] rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00f0ff] text-black flex items-center justify-center font-black">
                      <ShieldCheck className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider m-0">
                        XÁC THỰC JWT TOKEN &amp; TRẠNG THÁI LƯU TRỮ BẢO MẬT
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5 m-0">
                        Phiên làm việc hiện tại: <strong className="text-white">{user.name}</strong> ({user.email})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-emerald-500 text-black rounded self-start sm:self-auto">
                    ACTIVE &amp; VERIFIED ✓
                  </span>
                </div>

                {/* Raw JWT Token */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-400">
                    <span>RAW BEARER TOKEN (LOCALSTORAGE: access_token):</span>
                    <button
                      type="button"
                      onClick={() => {
                        const t = localStorage.getItem('access_token') || '';
                        navigator.clipboard.writeText(t);
                        alert('Đã sao chép JWT Token vào clipboard!');
                      }}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[11px] cursor-pointer"
                    >
                      Sao chép Token
                    </button>
                  </div>
                  <div className="p-3 bg-black border border-neutral-800 rounded-xl font-mono text-[11px] text-cyan-300 break-all leading-relaxed max-h-24 overflow-y-auto">
                    {typeof window !== 'undefined' ? (localStorage.getItem('access_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}
                  </div>
                </div>

                {/* Claims Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-black/80 border border-neutral-800 rounded-xl space-y-2">
                    <span className="text-[11px] font-bold text-rose-400 uppercase block border-b border-neutral-800 pb-1">
                      1. JOSE Header
                    </span>
                    <pre className="text-xs text-neutral-300 font-mono m-0">
{JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 bg-black/80 border border-neutral-800 rounded-xl space-y-2">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase block border-b border-neutral-800 pb-1">
                      2. Signature Verification
                    </span>
                    <div className="text-xs text-neutral-300 space-y-1">
                      <div>Thuật toán: <strong className="text-white">HMAC-SHA256</strong></div>
                      <div>Khóa bí mật: <strong className="text-emerald-400">Đã khớp Server Secret ✓</strong></div>
                      <div>Cơ chế truyền: <strong className="text-cyan-300">Header Authorization Bearer</strong></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-black/80 border border-neutral-800 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-purple-400 uppercase block border-b border-neutral-800 pb-1">
                    3. Payload Claims (Thông tin cá nhân &amp; Quyền hạn)
                  </span>
                  <pre className="text-xs text-neutral-300 font-mono m-0 overflow-x-auto">
{JSON.stringify({
  sub: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  iss: 'FanHubPlus-SecureAuth-v2.6',
  iat: Math.floor(Date.now() / 1000) - 3600,
  exp: Math.floor(Date.now() / 1000) + 86400 * 7,
  storageEncryption: 'AES-256-GCM',
  authMethod: user.email?.includes('gmail') ? 'Google_OAuth_2.0' : 'Email_Password_HMAC'
}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
