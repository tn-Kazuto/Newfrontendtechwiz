'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useGoogleLanguage } from './GoogleTranslate';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';
import { useDomainTheme } from '../context/DomainContext';
import { NotificationDropdown } from './NotificationDropdown';
import { PersonalDashboardModal } from './PersonalDashboardModal';
import { SeatMapBookingModal } from './SeatMapBookingModal';
import { OutroModal } from './OutroModal';
import { getActiveFandomTheme } from '../utils/fandomTheme';
import {
  Menu,
  Search,
  User,
  ShoppingBag,
  FileText,
  Globe,
  Sun,
  Moon,
  X,
  ShieldCheck,
  Sparkles,
  Disc,
  Users,
  Calendar,
  Map,
  MessageSquare,
  Building2,
  CheckCircle2,
  Palette,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  ArrowRight,
  Phone,
  Loader2,
  ChevronRight,
  Ticket,
  Gift,
  Tv,
  Heart,
  Compass,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fandomThemeKey?: string;
  fandomCategory?: string;
}

const extractApiError = (data: any, fallbackMsg: string): string => {
  if (!data) return fallbackMsg;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (data.errors && typeof data.errors === 'object') {
    const messages: string[] = [];
    for (const key of Object.keys(data.errors)) {
      const val = data.errors[key];
      if (Array.isArray(val)) {
        messages.push(...val);
      } else if (typeof val === 'string' && val.trim()) {
        messages.push(val);
      }
    }
    if (messages.length > 0) return messages.join('. ');
  }
  if (typeof data.title === 'string' && data.title.trim()) return data.title;
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  return fallbackMsg;
};

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onOpenFeedback,
  searchQuery,
  setSearchQuery,
  fandomThemeKey = 'all',
  fandomCategory = 'all',
}) => {
  const pathname = usePathname();
  const { language, toggleLanguage } = useGoogleLanguage();
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen, currency, toggleCurrency } = useCartWishlist();
  const { user, isLoggedIn, loginAs, logout, requestPasswordReset, resetPasswordWithToken } = useAuth();
  const { themeMode, toggleThemeMode } = useDomainTheme();

  const [activeFandomTheme, setActiveFandomTheme] = useState(() => getActiveFandomTheme(fandomThemeKey, fandomCategory));

  useEffect(() => {
    const updateTheme = () => {
      setActiveFandomTheme(getActiveFandomTheme(fandomThemeKey, fandomCategory));
    };
    updateTheme();

    const handleCustomChange = (e: any) => {
      if (e?.detail?.theme && e.detail.theme !== 'all') {
        setActiveFandomTheme(e.detail.theme);
      } else {
        updateTheme();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('fandom-theme-change', handleCustomChange);
    }
    if (typeof document !== 'undefined') {
      const observer = new MutationObserver(updateTheme);
      observer.observe(document.body, { attributes: true, attributeFilter: ['data-fandom-theme'] });
      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('fandom-theme-change', handleCustomChange);
        }
        observer.disconnect();
      };
    }
  }, [fandomThemeKey, fandomCategory]);

  useEffect(() => {
    if (fandomThemeKey && fandomThemeKey !== 'all') {
      setActiveFandomTheme(fandomThemeKey);
    }
  }, [fandomThemeKey]);

  const effectiveTheme = (fandomThemeKey && fandomThemeKey !== 'all')
    ? fandomThemeKey
    : (activeFandomTheme || getActiveFandomTheme(fandomThemeKey, fandomCategory));
  const isManga = effectiveTheme === 'manga' || pathname?.startsWith('/manga');
  const isGaming = effectiveTheme === 'gaming' || pathname?.startsWith('/gaming');
  const isCosplay = effectiveTheme === 'cosplay' || pathname?.startsWith('/cosplay');
  const isAnime = effectiveTheme === 'anime' || pathname?.startsWith('/anime');
  const isCinema = effectiveTheme === 'cinema' || pathname?.startsWith('/cinema');
  const isComics = effectiveTheme === 'comics' || pathname?.startsWith('/comics') || fandomCategory?.toLowerCase().includes('comic') || fandomThemeKey?.toLowerCase().includes('comic');
  const isTvShows = effectiveTheme === 'tv' || pathname?.startsWith('/tv');

  const loginTheme = React.useMemo(() => {
    if (isManga) {
      return {
        fontFamily: "'Kalam', cursive, sans-serif",
        modalBg: '#fdfbf7',
        textColor: '#2d2d2d',
        subtitleColor: '#2d5da1',
        border: '3px solid #2d2d2d',
        shadow: '8px 8px 0px #2d2d2d',
        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
        headerTitle: 'MANGA GUILD // PASSPORT LOGIN',
        headerSubtitle: 'Mangaka & Tankōbon Collector Sign-In',
        primaryBtnBg: '#ff4d4d',
        primaryBtnColor: '#ffffff',
        primaryBtnBorder: '2px solid #2d2d2d',
        primaryBtnShadow: '3px 3px 0px #2d2d2d',
        primaryBtnRadius: '120px 8px 110px 8px/8px 110px 8px 120px',
        inputBorder: '2px solid #2d2d2d',
        inputRadius: '120px 8px 110px 8px/8px 110px 8px 120px',
        inputBg: '#ffffff',
        inputColor: '#2d2d2d',
        accentColor: '#2d5da1',
        tapeDecor: true,
      };
    }
    if (isAnime) {
      return {
        fontFamily: "'Space Grotesk', monospace, sans-serif",
        modalBg: '#ffffff',
        textColor: '#000000',
        subtitleColor: '#525252',
        border: '3px solid #000000',
        shadow: '8px 8px 0px #ccff00',
        borderRadius: '0px',
        headerTitle: 'SAKUGA VAULT // ANIME ID ACCESS',
        headerSubtitle: 'High-Framerate Collector & Otaku Authentication',
        primaryBtnBg: '#ccff00',
        primaryBtnColor: '#000000',
        primaryBtnBorder: '2px solid #000000',
        primaryBtnShadow: '3px 3px 0px #000000',
        primaryBtnRadius: '0px',
        inputBorder: '2px solid #000000',
        inputRadius: '0px',
        inputBg: '#f7fee7',
        inputColor: '#000000',
        accentColor: '#ccff00',
        tapeDecor: false,
      };
    }
    if (isComics) {
      return {
        fontFamily: "'Bangers', 'Kalam', cursive, sans-serif",
        modalBg: '#ffffff',
        textColor: '#000000',
        subtitleColor: '#ef4444',
        border: '4px solid #000000',
        shadow: '8px 8px 0px #ef4444',
        borderRadius: '0px',
        headerTitle: 'HERO ARCHIVE // SECRET IDENTITY LOGIN',
        headerSubtitle: 'Unlock Exclusive Variant Pulls & Omnibuses',
        primaryBtnBg: '#ffd60a',
        primaryBtnColor: '#000000',
        primaryBtnBorder: '3px solid #000000',
        primaryBtnShadow: '4px 4px 0px #000000',
        primaryBtnRadius: '0px',
        inputBorder: '2px solid #000000',
        inputRadius: '2px',
        inputBg: '#fffdf0',
        inputColor: '#000000',
        accentColor: '#ef4444',
        tapeDecor: false,
      };
    }
    if (isGaming) {
      return {
        fontFamily: "'JetBrains Mono', monospace",
        modalBg: '#ffffff',
        textColor: '#000000',
        subtitleColor: '#525252',
        border: '4px solid #000000',
        shadow: '8px 8px 0px #000000',
        borderRadius: '0px',
        headerTitle: 'GAMING ARENA // MEMBER LOGIN',
        headerSubtitle: 'Official Soundtracks & Collector Archive',
        primaryBtnBg: '#000000',
        primaryBtnColor: '#ffffff',
        primaryBtnBorder: '2px solid #000000',
        primaryBtnShadow: 'none',
        primaryBtnRadius: '0px',
        inputBorder: '2px solid #000000',
        inputRadius: '0px',
        inputBg: '#ffffff',
        inputColor: '#000000',
        accentColor: '#000000',
        tapeDecor: false,
      };
    }
    if (isCinema) {
      return {
        fontFamily: "'Playfair Display', Georgia, serif",
        modalBg: '#0d0d0f',
        textColor: '#ffffff',
        subtitleColor: '#d4af37',
        border: '2px solid rgba(212,175,55,0.6)',
        shadow: '0 20px 45px rgba(0,0,0,0.9)',
        borderRadius: '0px',
        headerTitle: 'CINEMA ARCHIVE // PATRON CREDENTIALS',
        headerSubtitle: 'Cannes & Criterion Guild Member Portal',
        primaryBtnBg: '#d4af37',
        primaryBtnColor: '#09090b',
        primaryBtnBorder: '1px solid #d4af37',
        primaryBtnShadow: '2px 2px 0px rgba(0,0,0,0.5)',
        primaryBtnRadius: '0px',
        inputBorder: '1px solid rgba(212,175,55,0.5)',
        inputRadius: '0px',
        inputBg: '#18181b',
        inputColor: '#fafaf9',
        accentColor: '#d4af37',
        tapeDecor: false,
      };
    }
    if (isTvShows) {
      return {
        fontFamily: "'Outfit', sans-serif",
        modalBg: '#ffffff',
        textColor: '#000000',
        subtitleColor: '#7c3aed',
        border: '3px solid #000000',
        shadow: '8px 8px 0px #8b5cf6',
        borderRadius: '0px',
        headerTitle: 'TV BROADCAST // SUBSCRIBER LOGIN',
        headerSubtitle: 'Binge Series & K-Drama Streaming Access',
        primaryBtnBg: '#8b5cf6',
        primaryBtnColor: '#ffffff',
        primaryBtnBorder: '2px solid #000000',
        primaryBtnShadow: '3px 3px 0px #000000',
        primaryBtnRadius: '0px',
        inputBorder: '2px solid #000000',
        inputRadius: '0px',
        inputBg: '#faf5ff',
        inputColor: '#000000',
        accentColor: '#7c3aed',
        tapeDecor: false,
      };
    }
    return {
      fontFamily: "'Outfit', monospace, sans-serif",
      modalBg: '#ffffff',
      textColor: '#000000',
      subtitleColor: '#ff2e93',
      border: '3px solid #000000',
      shadow: '8px 8px 0px #ff2e93',
      borderRadius: '0px',
      headerTitle: 'FAN HUB PLUS // MEMBER LOGIN',
      headerSubtitle: 'Official Hanteo Certified Member Gate',
      primaryBtnBg: '#ff2e93',
      primaryBtnColor: '#ffffff',
      primaryBtnBorder: '2px solid #000000',
      primaryBtnShadow: '3px 3px 0px #000000',
      primaryBtnRadius: '0px',
      inputBorder: '2px solid #000000',
      inputRadius: '0px',
      inputBg: '#ffffff',
      inputColor: '#000000',
      accentColor: '#ff2e93',
      tapeDecor: false,
    };
  }, [isManga, isAnime, isComics, isGaming, isCinema, isTvShows]);

  const subnavTheme = React.useMemo(() => {
    if (isGaming) {
      return {
        barBg: '#ffffff',
        barBorder: 'border-t-2 border-black border-b-4 border-black',
        btnBg: '#000000',
        btnColor: '#ffffff',
        btnBorder: '2px solid #000000',
        btnRadius: '0px',
        btnShadow: 'none',
        btnFont: "'JetBrains Mono', monospace",
        btnLabel: '★ GAMING MD',
        tabFont: "'JetBrains Mono', monospace",
        tabColor: '#000000',
        tabActiveColor: '#000000',
        tabActiveBorder: '3px solid #000000',
        tabLetterSpacing: '0.12em',
        tabFontWeight: 600,
        tabActiveWeight: 900,
        fandomQuery: 'gaming',
      };
    }
    if (isManga) {
      return {
        barBg: '#fdfbf7',
        barBorder: 'border-t-2 border-[#2d2d2d] border-b-4 border-[#2d2d2d]',
        btnBg: '#ff4d4d',
        btnColor: '#ffffff',
        btnBorder: '2px solid #2d2d2d',
        btnRadius: '6px',
        btnShadow: '3px 3px 0px #2d2d2d',
        btnFont: "'Kalam', cursive, sans-serif",
        btnLabel: '★ MANGA MD',
        tabFont: "'Kalam', cursive, sans-serif",
        tabColor: '#2d2d2d',
        tabActiveColor: '#ff4d4d',
        tabActiveBorder: '3px solid #ff4d4d',
        tabLetterSpacing: '0.08em',
        tabFontWeight: 700,
        tabActiveWeight: 900,
        fandomQuery: 'manga',
      };
    }
    if (isAnime) {
      return {
        barBg: '#ffffff',
        barBorder: 'border-t-2 border-black border-b-4 border-black',
        btnBg: '#ccff00',
        btnColor: '#000000',
        btnBorder: '2px solid #000000',
        btnRadius: '0px',
        btnShadow: '3px 3px 0px #000000',
        btnFont: "'Space Grotesk', sans-serif",
        btnLabel: '★ SAKUGA MD',
        tabFont: "'Space Grotesk', sans-serif",
        tabColor: '#000000',
        tabActiveColor: '#000000',
        tabActiveBorder: '3px solid #ccff00',
        tabLetterSpacing: '0.1em',
        tabFontWeight: 700,
        tabActiveWeight: 900,
        fandomQuery: 'anime',
      };
    }
    if (isComics) {
      return {
        barBg: '#fef9c3',
        barBorder: 'border-t-2 border-black border-b-4 border-black',
        btnBg: '#ef4444',
        btnColor: '#ffffff',
        btnBorder: '2.5px solid #000000',
        btnRadius: '0px',
        btnShadow: '3px 3px 0px #000000',
        btnFont: "var(--font-bangers), 'Bangers', cursive, sans-serif",
        btnLabel: '★ COMICS MD',
        tabFont: "var(--font-bangers), 'Bangers', cursive, sans-serif",
        tabColor: '#000000',
        tabActiveColor: '#ef4444',
        tabActiveBorder: '3px solid #ef4444',
        tabLetterSpacing: '0.08em',
        tabFontWeight: 400,
        tabActiveWeight: 400,
        fandomQuery: 'comics',
      };
    }
    if (isCinema) {
      return {
        barBg: '#0d0d0f',
        barBorder: 'border-t border-[#d4af37]/40 border-b-2 border-[#d4af37]',
        btnBg: '#d4af37',
        btnColor: '#09090b',
        btnBorder: '1px solid #d4af37',
        btnRadius: '0px',
        btnShadow: 'none',
        btnFont: "'Playfair Display', Georgia, serif",
        btnLabel: '★ 70MM CINEMA MD',
        tabFont: "'Playfair Display', Georgia, serif",
        tabColor: 'rgba(255,255,255,0.75)',
        tabActiveColor: '#ffffff',
        tabActiveBorder: '3px solid #d4af37',
        tabLetterSpacing: '0.15em',
        tabFontWeight: 600,
        tabActiveWeight: 800,
        fandomQuery: 'cinema',
      };
    }
    if (isTvShows) {
      return {
        barBg: '#faf5ff',
        barBorder: 'border-t-2 border-[#7c3aed] border-b-4 border-[#7c3aed]',
        btnBg: '#8b5cf6',
        btnColor: '#ffffff',
        btnBorder: '2px solid #7c3aed',
        btnRadius: '0px',
        btnShadow: '3px 3px 0px #7c3aed',
        btnFont: "'Outfit', sans-serif",
        btnLabel: '★ TV SERIES MD',
        tabFont: "'Outfit', sans-serif",
        tabColor: '#4c1d95',
        tabActiveColor: '#7c3aed',
        tabActiveBorder: '3px solid #8b5cf6',
        tabLetterSpacing: '0.1em',
        tabFontWeight: 700,
        tabActiveWeight: 900,
        fandomQuery: 'tv',
      };
    }
    if (isCosplay) {
      return {
        barBg: '#ffffff',
        barBorder: 'border-t-2 border-black border-b-4 border-black',
        btnBg: '#D02020',
        btnColor: '#ffffff',
        btnBorder: '2px solid #000000',
        btnRadius: '0px',
        btnShadow: '3px 3px 0px #000000',
        btnFont: "'Outfit', var(--font-sans), sans-serif",
        btnLabel: '★ BAUHAUS MD',
        tabFont: "'Outfit', var(--font-sans), sans-serif",
        tabColor: '#000000',
        tabActiveColor: '#D02020',
        tabActiveBorder: '3px solid #D02020',
        tabLetterSpacing: '0.12em',
        tabFontWeight: 700,
        tabActiveWeight: 900,
        fandomQuery: 'cosplay',
      };
    }
    // Default / K-Pop
    return {
      barBg: '#ffffff',
      barBorder: 'border-t border-black border-b-4 border-black',
      btnBg: '#d91470',
      btnColor: '#ffffff',
      btnBorder: '2px solid #000000',
      btnRadius: '0px',
      btnShadow: '3px 3px 0px #000000',
      btnFont: "var(--font-jetbrains), var(--font-mono), monospace",
      btnLabel: '★ ALL MD',
      tabFont: "var(--font-mono), monospace",
      tabColor: '#000000',
      tabActiveColor: '#d91470',
      tabActiveBorder: '3px solid #d91470',
      tabLetterSpacing: '0.12em',
      tabFontWeight: 600,
      tabActiveWeight: 800,
      fandomQuery: 'kpop',
    };
  }, [isGaming, isManga, isAnime, isComics, isCinema, isTvShows, isCosplay]);

  const SUBNAV_TABS = React.useMemo(() => [
    { label: 'ARTIST', href: '/artist' },
    { label: 'EXPLORE EVENTS', href: '/event' },
    { label: 'FANDOM HUB / LIVE SPACE', href: '/multimedia' },
    { label: 'CD/DVD/BOOK', href: '/cd-dvd-book' },
    { label: 'MD', href: '/md' },
    { label: 'B2B/BULK', href: '/b2b' },
  ], []);

  const getTabHref = React.useCallback((baseHref: string) => {
    const q = subnavTheme.fandomQuery || effectiveTheme;
    if (q && q !== 'all') {
      return `${baseHref}?fandom=${q}`;
    }
    return baseHref;
  }, [subnavTheme.fandomQuery, effectiveTheme]);

  useEffect(() => {
    if (typeof document !== 'undefined' && effectiveTheme) {
      document.documentElement.setAttribute('data-fandom-theme', effectiveTheme);
      document.body.setAttribute('data-fandom-theme', effectiveTheme);
    }
  }, [effectiveTheme]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isTicketWalletOpen, setIsTicketWalletOpen] = useState(false);
  const [isOutroOpen, setIsOutroOpen] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleOpenWallet = () => setIsTicketWalletOpen(true);
    const handleOpenOutro = () => setIsOutroOpen(true);
    window.addEventListener('open-ticket-wallet', handleOpenWallet);
    window.addEventListener('open-outro-modal', handleOpenOutro);
    return () => {
      window.removeEventListener('open-ticket-wallet', handleOpenWallet);
      window.removeEventListener('open-outro-modal', handleOpenOutro);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fanhub_font_large');
      if (saved === 'true') {
        setIsLargeFont(true);
        document.documentElement.classList.add('font-accessible-large');
      }
    } catch { }
  }, []);

  const toggleFontSize = () => {
    const next = !isLargeFont;
    setIsLargeFont(next);
    try {
      localStorage.setItem('fanhub_font_large', String(next));
    } catch { }
    if (next) {
      document.documentElement.classList.add('font-accessible-large');
    } else {
      document.documentElement.classList.remove('font-accessible-large');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form & Tab State for Auth Modal
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authNotification, setAuthNotification] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Forgot password flow states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotToken, setForgotToken] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [isResetTokenSent, setIsResetTokenSent] = useState(false);

  // Sub-header navigation dropdown (Exact matching user's image)
  const [isAllMdDropdownOpen, setIsAllMdDropdownOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [isCustomZoneOpen, setIsCustomZoneOpen] = useState(false);
  const [b2bSubmitted, setB2bSubmitted] = useState(false);
  const [b2bOrg, setB2bOrg] = useState('');
  const [b2bContact, setB2bContact] = useState('');
  const [b2bQty, setB2bQty] = useState('50');
  const [b2bArtist, setB2bArtist] = useState('NewJeans');

  const scrollToSection = (id: string) => {
    setIsAllMdDropdownOpen(false);
    setIsMenuDrawerOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (id === 'tours') {
        window.location.href = '/event';
      } else {
        window.location.href = `/#${id}`;
      }
    }
  };

  const allMdItems = [
    { label: 'EVENT & TICKETS', icon: Ticket, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/event'; } },
    { label: 'CD, DVD & VINYL', icon: Disc, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/cd-dvd-book'; } },
    { label: 'OFFICIAL MD GOODS', icon: ShoppingBag, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/md'; } },
    { label: "SEASON'S GREETINGS", icon: Gift, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/cd-dvd-book'; } },
    { label: 'CUSTOM GOODS ZONE', icon: Palette, action: () => { setIsAllMdDropdownOpen(false); setIsCustomZoneOpen(true); } },
    { label: 'DUCKJIL FANDOM HUB', icon: Heart, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/artist'; } },
    { label: 'ALLMD BEAUTY & CARE', icon: Sparkles, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/md'; } },
    { label: 'B2B / BULK ORDER', icon: Building2, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/b2b'; } },
    { label: 'MULTIMEDIA CENTER', icon: Tv, action: () => { setIsAllMdDropdownOpen(false); window.location.href = '/multimedia'; } },
  ];

  return (
    <header
      className={`sticky top-0 z-[100] w-full header-root fandom-header-${effectiveTheme} transition-all duration-300${isScrolled ? ' header-scrolled' : ''}`}
      data-fandom-theme={effectiveTheme}
    >
      {/* Y2K System Status Ribbon */}
      <div className={`w-full ${isGaming ? 'bg-white text-black' : 'bg-black text-white'} px-4 sm:px-8 py-1 font-mono text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b border-black select-none`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 ${isGaming ? 'bg-black' : 'bg-white'} animate-pulse`} />
            <span>PORTAL // READY</span>
          </span>
          <span className={`hidden md:inline ${isGaming ? 'text-neutral-600' : 'text-neutral-400'}`}>SYS.VER: 2026.1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`hidden sm:inline ${isGaming ? 'text-neutral-600' : 'text-neutral-400'}`}>HANTEO &amp; CIRCLE CERTIFIED</span>
          <span>TIME // 2026 UTC</span>
        </div>
      </div>

      {/* Main Bar - Responsive Header Bar */}
      <div className="header-inner max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-2.5 sm:py-3.5 flex items-center justify-between gap-4 md:gap-8 transition-colors duration-300">
        {/* LEFT: Menu button (Mobile only, hidden on PC) & Logo */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 shrink-0">
          <button
            onClick={() => setIsMenuDrawerOpen(true)}
            className={`mobile-menu-btn header-action-btn px-3 py-1.5 min-h-[44px] min-w-[44px] ${isGaming ? 'bg-black text-white hover:bg-white hover:text-black shadow-none' : isCinema ? 'bg-[#FF3000] text-white hover:bg-black shadow-none' : isCosplay ? 'bg-[#D02020] text-white hover:bg-[#b01818] shadow-[3px_3px_0px_#121212]' : isAnime ? 'bg-[#a3e635] text-black hover:bg-[#84cc16] shadow-[2px_2px_0px_#000000]' : isComics ? 'bg-[#ef4444] text-white hover:bg-[#dc2626] shadow-[3px_3px_0px_#000000]' : 'bg-[#d91470] text-white hover:bg-[#be185d] shadow-[2px_2px_0px_#000000]'} items-center justify-center cursor-pointer shrink-0 border-2 border-black font-mono text-xs font-black uppercase tracking-widest transition-transform active:scale-95`}
            style={{ borderRadius: '0px' }}
            title="Menu"
            aria-label="Toggle navigation menu"
            type="button"
          >
            [MENU]
          </button>

          <Link href="/" className="flex items-center notranslate shrink-0" aria-label="Fan Hub Plus Home">
            <Image
              src="/logo-dark.webp"
              alt="Fan Hub Plus"
              width={180}
              height={44}
              priority
              className={`header-logo h-8 sm:h-9 md:h-11 w-auto object-contain block transition-all hover:scale-105 ${isGaming || isCinema ? 'brightness-0' : ''}`}
            />
          </Link>
        </div>

        {/* CENTER: Wide Y2K Search Bar (Desktop) - Clean Flex Layout */}
        <div className="hidden md:flex flex-1 justify-center max-w-[560px] mx-4 lg:mx-8">
          <div
            className="header-search-bar"
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              border: '2px solid #000000',
              backgroundColor: '#ffffff',
              boxShadow: isGaming || isCinema ? 'none' : isCosplay ? '4px 4px 0px #121212' : isAnime ? '4px 4px 0px #84cc16' : isComics ? '4px 4px 0px #000000' : '3px 3px 0px #000000',
              padding: '6px 12px',
              borderRadius: '0px',
            }}
          >
            {/* Search prefix */}
            <span
              style={{
                fontFamily: isCosplay ? "var(--font-outfit), 'Outfit', sans-serif" : "var(--font-jetbrains), var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 900,
                color: isGaming ? '#000000' : isCinema ? '#FF3000' : isCosplay ? '#D02020' : isAnime ? '#65a30d' : isComics ? '#ef4444' : '#d91470',
                marginRight: '8px',
                userSelect: 'none',
              }}
            >
              [SEARCH//]
            </span>

            <input
              id="desktop-header-search"
              aria-label="Search albums, artists, or tours"
              type="text"
              placeholder={isManga ? "MANGA, TANKŌBON, AUTHOR, ARC..." : isCinema ? "70MM ARCHIVE, AUTEUR, RESTORATIONS, CRITERION..." : isCosplay ? "BAUHAUS COSPLAY, ATELIER PROPS, EXPO..." : isAnime ? "SHONEN ANIME, PEDIDO STREETWEAR, OSTS..." : isComics ? "COMICS, HEROES, VARIANT COVERS, GRAPHIC NOVELS..." : "ARTIST, ALBUM, ARCHIVE..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const targetEl = document.getElementById(isManga ? 'manga-catalog' : isCinema ? 'cinema-catalog' : 'albums');
                  if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="header-search-input"
              style={{
                flex: 1,
                width: '100%',
                fontFamily: "var(--font-jetbrains), var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: '#000000',
                padding: '0px',
                textTransform: 'uppercase',
              }}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="header-clear-btn hover:text-[#ff2e93] font-mono text-xs font-bold"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#000000',
                  padding: '2px 6px',
                }}
                title="Clear"
              >
                [×]
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Action Buttons (Minimalist Monochrome / Neo-Brutalist Colors) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 font-mono text-xs">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className={`mobile-search-btn header-action-btn px-2.5 py-1.5 min-h-[44px] min-w-[44px] items-center justify-center text-black border-2 border-black hover:bg-neutral-100 hover:text-black cursor-pointer bg-white transition-colors duration-100 font-bold ${isGaming || isCinema ? 'shadow-none' : 'shadow-[2px_2px_0px_#000000]'}`}
            style={{ borderRadius: '0px' }}
            title="Search"
            aria-label="Open search dialog"
            type="button"
          >
            [?]
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`header-action-btn px-3 py-1.5 min-h-[44px] sm:min-h-[36px] flex items-center justify-center border-2 border-black cursor-pointer font-black uppercase transition-colors duration-100 h-8 sm:h-9 ${isGaming ? 'bg-white hover:bg-neutral-100 hover:text-black text-black shadow-none' : isCinema ? 'bg-white hover:bg-[#FF3000] hover:text-white text-black shadow-none' : 'text-black bg-[#ffd60a] hover:bg-[#fde047] shadow-[2px_2px_0px_#000000]'}`}
            style={{ borderRadius: '0px' }}
            title="Cart"
            aria-label={`BAG (${cartCount}) - Shopping Cart`}
            type="button"
          >
            <span>BAG ({cartCount})</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className={`header-action-btn hidden sm:flex px-3 py-1.5 min-h-[44px] sm:min-h-[36px] items-center justify-center border-2 border-black cursor-pointer font-black uppercase transition-colors duration-100 h-8 sm:h-9 ${isGaming ? 'bg-white hover:bg-neutral-100 hover:text-black text-black shadow-none' : isCinema ? 'bg-white hover:bg-[#FF3000] hover:text-white text-black shadow-none' : 'text-black bg-[#00f0ff] hover:bg-[#38bdf8] shadow-[2px_2px_0px_#000000]'}`}
            style={{ borderRadius: '0px' }}
            title="Wishlist"
            aria-label={`SAVED (${wishlistCount}) - Saved Wishlist`}
            type="button"
          >
            <span>SAVED ({wishlistCount})</span>
          </button>

          {/* Language Switcher Button [ EN ] */}
          <button
            onClick={toggleLanguage}
            title="Language: English"
            aria-label="Toggle language between English and Vietnamese"
            type="button"
            className={`header-lang-btn hidden sm:flex notranslate hover:bg-neutral-100 hover:text-black items-center px-2.5 py-1 text-xs font-mono font-bold border-2 border-black bg-white text-black h-8 sm:h-9 min-h-[44px] sm:min-h-[36px] cursor-pointer transition-colors duration-100 ${isGaming || isCinema ? 'shadow-none' : 'shadow-[2px_2px_0px_#000000]'}`}
            style={{ borderRadius: '0px' }}
          >
            <span>[EN]</span>
          </button>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleThemeMode}
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            type="button"
            className={`header-action-btn hidden sm:flex notranslate hover:bg-neutral-100 hover:text-black px-2.5 py-1 items-center justify-center text-black border-2 border-black bg-white font-bold uppercase cursor-pointer transition-colors duration-100 h-8 sm:h-9 min-h-[44px] sm:min-h-[36px] text-[11px] ${isGaming || isCinema ? 'shadow-none' : 'shadow-[2px_2px_0px_#000000]'}`}
            style={{ borderRadius: '0px' }}
          >
            {themeMode === 'dark' ? '[LIGHT]' : '[DARK]'}
          </button>

          {/* Ticket Wallet Quick Access Button */}
          <button
            onClick={() => setIsTicketWalletOpen(true)}
            className={`header-action-btn flex items-center justify-center px-2.5 sm:px-3 py-1.5 border-2 border-black cursor-pointer font-black uppercase transition-colors duration-100 h-8 sm:h-9 min-h-[44px] sm:min-h-[36px] text-xs ${isGaming ? 'bg-white hover:bg-neutral-100 hover:text-black text-black shadow-none' : isCinema ? 'bg-[#FF3000] text-white hover:bg-[#e02b00] shadow-none' : 'text-black bg-[#10b981] hover:bg-[#34d399] shadow-[2px_2px_0px_#000000]'}`}
            style={{ borderRadius: '0px' }}
            title="Open Ticket Wallet & Blockchain Verification"
            aria-label="Ticket Wallet"
            type="button"
          >
            <Ticket className="w-3.5 h-3.5 mr-1" />
            <span className="font-mono font-black">TICKET WALLET</span>
          </button>

          {/* User Account / Login Button */}
          {isLoggedIn ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`header-action-btn flex items-center justify-center px-3 py-1.5 border-2 border-black cursor-pointer font-black uppercase transition-colors duration-100 h-8 sm:h-9 min-h-[44px] sm:min-h-[36px] text-xs ${isGaming ? 'bg-white hover:bg-neutral-100 hover:text-black text-black shadow-none' : isCinema ? 'bg-white hover:bg-[#FF3000] hover:text-white text-black shadow-none' : 'text-black bg-[#c084fc] hover:bg-[#d8b4fe] shadow-[2px_2px_0px_#000000]'}`}
              style={{ borderRadius: '0px' }}
              title={`${user.name} - Profile`}
              aria-label={`User Account Profile for ${user.name}`}
              type="button"
            >
              <User className="w-3.5 h-3.5 mr-1" />
              <span className="truncate max-w-[85px]">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`header-action-btn flex items-center justify-center px-3 py-1.5 border-2 border-black cursor-pointer font-black uppercase transition-colors duration-100 h-8 sm:h-9 min-h-[44px] sm:min-h-[36px] text-xs ${isGaming ? 'bg-black text-white hover:bg-white hover:text-black shadow-none' : isCinema ? 'bg-[#FF3000] text-white hover:bg-black shadow-none' : 'text-black bg-[#ffd60a] hover:bg-[#ffe066] shadow-[2px_2px_0px_#000000]'}`}
              style={{ borderRadius: '0px' }}
              title="Sign In / Sign Up"
              aria-label="LOGIN - Sign In or Register"
              type="button"
            >
              <User className="w-3.5 h-3.5 mr-1" />
              <span>LOGIN</span>
            </button>
          )}
        </div>
      </div>

      {/* SECONDARY CATEGORY NAVIGATION BAR (Desktop Only) */}
      <div
        className={`desktop-subnav header-subnav w-full relative z-30 transition-colors duration-150 ${subnavTheme.barBorder}`}
        style={{ backgroundColor: subnavTheme.barBg }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between h-11 sm:h-[50px] relative gap-4">
          {/* [ ≡ ALL MD ] Button with Exact Dropdown */}
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', zIndex: 60 }}>
            <button
              onClick={() => setIsAllMdDropdownOpen(!isAllMdDropdownOpen)}
              type="button"
              className="header-allmd-btn transition-colors duration-100 hover:opacity-90"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 18px',
                height: '36px',
                backgroundColor: subnavTheme.btnBg,
                color: subnavTheme.btnColor,
                fontFamily: subnavTheme.btnFont,
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: subnavTheme.btnBorder,
                borderRadius: subnavTheme.btnRadius,
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: subnavTheme.btnShadow,
              }}
            >
              <Menu style={{ width: '15px', height: '15px', flexShrink: 0, strokeWidth: 2.5 }} />
              <span style={{ whiteSpace: 'nowrap' }}>{subnavTheme.btnLabel}</span>
            </button>

            {/* Dropdown Menu under [ ≡ ALL MD ] (Strictly 0px, pure monochrome, no shadow) */}
            {isAllMdDropdownOpen && (
              <>
                {/* Backdrop to close on click outside */}
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 9990, backgroundColor: 'transparent' }}
                  onClick={() => setIsAllMdDropdownOpen(false)}
                />

                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '100%',
                    marginTop: '2px',
                    width: '340px',
                    maxWidth: '92vw',
                    backgroundColor: '#ffffff',
                    border: '2px solid #000000',
                    borderRadius: '0px',
                    padding: '14px',
                    boxShadow: 'none',
                    zIndex: 9999,
                    display: 'block',
                  }}
                  className="animate-in fade-in-0 duration-100"
                >
                  {/* Header Title */}
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div
                        style={{ borderRadius: '0px' }}
                        className="w-5 h-5 bg-black text-white flex items-center justify-center"
                      >
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-black">
                        CATEGORIES &amp; FUNCTIONS
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAllMdDropdownOpen(false)}
                      style={{ borderRadius: '0px' }}
                      className="w-6 h-6 border border-black hover:bg-neutral-100 text-black flex items-center justify-center bg-white cursor-pointer transition-colors duration-100"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Category Items with Library Icons */}
                  <div className="flex flex-col gap-1">
                    {allMdItems.map((item, idx) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsAllMdDropdownOpen(false);
                            item.action();
                          }}
                          style={{ borderRadius: '0px' }}
                          className="group w-full flex items-center justify-between px-3 py-2 border border-transparent hover:border-black hover:bg-neutral-100 text-black text-left bg-transparent cursor-pointer transition-colors duration-100"
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              style={{ borderRadius: '0px' }}
                              className="w-6 h-6 border border-black bg-white text-black flex items-center justify-center shrink-0"
                            >
                              <ItemIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-mono text-[12px] font-bold text-black tracking-tight">
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black shrink-0" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Sections shortcut */}
                  <div className="pt-3 mt-3 border-t border-black">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mb-2 px-1">
                      QUICK SHORTCUTS
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAllMdDropdownOpen(false);
                          scrollToSection('albums');
                        }}
                        style={{ borderRadius: '0px' }}
                        className="group flex items-center gap-2 p-2 bg-white hover:bg-neutral-100 border border-black text-xs font-mono font-bold text-black cursor-pointer transition-colors duration-100"
                      >
                        <div
                          style={{ borderRadius: '0px' }}
                          className="w-5 h-5 border border-black bg-black text-white flex items-center justify-center shrink-0"
                        >
                          <Disc className="w-3 h-3" />
                        </div>
                        <span className="truncate text-black">Album Drops</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAllMdDropdownOpen(false);
                          scrollToSection('artists');
                        }}
                        style={{ borderRadius: '0px' }}
                        className="group flex items-center gap-2 p-2 bg-white hover:bg-neutral-100 border border-black text-xs font-mono font-bold text-black cursor-pointer transition-colors duration-100"
                      >
                        <div
                          style={{ borderRadius: '0px' }}
                          className="w-5 h-5 border border-black bg-black text-white flex items-center justify-center shrink-0"
                        >
                          <Users className="w-3 h-3" />
                        </div>
                        <span className="truncate text-black">Idol Profiles</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAllMdDropdownOpen(false);
                          scrollToSection('tours');
                        }}
                        style={{ borderRadius: '0px' }}
                        className="group flex items-center gap-2 p-2 bg-white hover:bg-neutral-100 border border-black text-xs font-mono font-bold text-black cursor-pointer transition-colors duration-100"
                      >
                        <div
                          style={{ borderRadius: '0px' }}
                          className="w-5 h-5 border border-black bg-black text-white flex items-center justify-center shrink-0"
                        >
                          <Calendar className="w-3 h-3" />
                        </div>
                        <span className="truncate text-black">World Tour</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAllMdDropdownOpen(false);
                          scrollToSection('community');
                        }}
                        style={{ borderRadius: '0px' }}
                        className="group flex items-center gap-2 p-2 bg-white hover:bg-neutral-100 border border-black text-xs font-mono font-bold text-black cursor-pointer transition-colors duration-100"
                      >
                        <div
                          style={{ borderRadius: '0px' }}
                          className="w-5 h-5 border border-black bg-black text-white flex items-center justify-center shrink-0"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </div>
                        <span className="truncate text-black">Fandom Feed</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Horizontal Links - Layout strictly preserved across all categories */}
          <nav className="flex items-center gap-6 sm:gap-8 lg:gap-10 xl:gap-12 flex-nowrap h-full shrink-0 overflow-x-auto scrollbar-none">
            {SUBNAV_TABS.map((tab) => {
              const isActive = pathname === tab.href || (tab.href !== '/' && pathname?.startsWith(tab.href));
              const targetHref = getTabHref(tab.href);
              return (
                <Link
                  key={tab.label}
                  href={targetHref}
                  data-active={isActive ? "true" : undefined}
                  style={{
                    fontFamily: subnavTheme.tabFont,
                    fontSize: isComics ? '15px' : '12px',
                    fontWeight: isActive ? subnavTheme.tabActiveWeight : subnavTheme.tabFontWeight,
                    letterSpacing: subnavTheme.tabLetterSpacing,
                    textTransform: 'uppercase',
                    padding: '12px 4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: isActive ? subnavTheme.tabActiveColor : subnavTheme.tabColor,
                    transition: 'all 0.15s ease',
                    borderBottom: isActive ? subnavTheme.tabActiveBorder : '3px solid transparent',
                    textDecoration: 'none',
                  }}
                  className={`header-nav-link hover:opacity-70 ${isActive ? 'active' : ''}`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* CUSTOM ZONE MODAL */}
      {isCustomZoneOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0px',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              boxShadow: 'none',
              border: '2px solid #000000',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsCustomZoneOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: '#000000',
                cursor: 'pointer'
              }}
              type="button"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Palette style={{ width: '22px', height: '22px', color: '#000000' }} />
              <h3 className="text-base font-bold text-black uppercase font-mono tracking-wide">
                CUSTOM ZONE - Fan DIY Studio
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4">
              Personalize your bias lightstick, holographic toploader binders, and custom photocard sleeves.
            </p>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 bg-white border border-black flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">Holographic Toploader Deco Kit</div>
                  <div className="text-[11px] text-neutral-500">Stickers, charms, and protective UV sleeves</div>
                </div>
                <span className="font-bold text-black">$12.00</span>
              </div>

              <div className="p-3 bg-white border border-black flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">Lightstick Custom Dome Decals</div>
                  <div className="text-[11px] text-neutral-500">NewJeans, BLACKPINK, BTS strap & decal sets</div>
                </div>
                <span className="font-bold text-black">$9.50</span>
              </div>

              <div className="p-3 bg-white border border-black flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">Custom Bias NFC Keychain Card</div>
                  <div className="text-[11px] text-neutral-500">Taps on smartphone to play idol voice note</div>
                </div>
                <span className="font-bold text-black">$15.00</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCustomZoneOpen(false);
                scrollToSection('albums');
              }}
              className="mt-5 w-full py-3 text-white text-xs font-mono font-bold uppercase tracking-widest cursor-pointer bg-black border-2 border-black hover:bg-white hover:text-black transition-colors duration-100"
              style={{ borderRadius: '0px' }}
              type="button"
            >
              Explore Official Custom Kits
            </button>
          </div>
        </div>
      )}

      {/* B2B / Bulk Order Modal (From Image 2 & Dropdown CONTACT FOR BULK ORDER) */}
      {isB2BModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: 'none',
              border: '2px solid #000000',
              position: 'relative'
            }}
          >
            <button
              onClick={() => {
                setIsB2BModalOpen(false);
                setB2bSubmitted(false);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: '#000000',
                cursor: 'pointer'
              }}
              type="button"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            {b2bSubmitted ? (
              <div className="text-center py-6 space-y-3 font-mono">
                <div
                  className="bg-black text-white flex items-center justify-center mx-auto"
                  style={{ width: '48px', height: '48px', borderRadius: '0px' }}
                >
                  <CheckCircle2 style={{ width: '28px', height: '28px' }} />
                </div>
                <h3 className="text-base font-bold text-black uppercase tracking-wider">
                  B2B Group Order Request Received!
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                  Thank you! Our Global Wholesale & Group Order department will send tier-discount quotations to your contact within 2 hours.
                </p>
                <div
                  className="p-3 border border-black text-xs text-black"
                  style={{ backgroundColor: '#ffffff', borderRadius: '0px' }}
                >
                  📦 Inquiries reflect 100% on official Hanteo & Circle Charts.
                </div>
                <button
                  onClick={() => {
                    setIsB2BModalOpen(false);
                    setB2bSubmitted(false);
                  }}
                  className="mt-4 px-6 py-2.5 text-white text-xs font-mono font-bold uppercase tracking-widest cursor-pointer bg-black border-2 border-black hover:bg-white hover:text-black transition-colors duration-100"
                  style={{ borderRadius: '0px' }}
                  type="button"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 style={{ width: '20px', height: '20px', color: '#000000' }} />
                  <h3 className="text-base font-bold text-black uppercase font-mono tracking-wider">
                    B2B & Fandom Group Orders (GO)
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 mb-4">
                  Wholesale discounts for fan clubs, international group order managers, and retailers. 100% Hanteo Chart counted.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!b2bOrg.trim() || !b2bContact.trim()) return;
                    setB2bSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-black block mb-1">
                      Fanbase / Business Organization
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bunnies Global Fandom, Seoul K-Store"
                      value={b2bOrg}
                      onChange={(e) => setB2bOrg(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border-2 border-black focus:outline-none font-mono"
                      style={{ borderRadius: '0px' }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-black block mb-1">
                      Email / WhatsApp Contact
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. fandom_order@gmail.com / +84 912 345 678"
                      value={b2bContact}
                      onChange={(e) => setB2bContact(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border-2 border-black focus:outline-none font-mono"
                      style={{ borderRadius: '0px' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-black block mb-1">
                        Target Artist
                      </label>
                      <select
                        value={b2bArtist}
                        onChange={(e) => setB2bArtist(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border-2 border-black focus:outline-none font-mono"
                        style={{ borderRadius: '0px' }}
                      >
                        <option value="NewJeans">NewJeans</option>
                        <option value="BLACKPINK">BLACKPINK</option>
                        <option value="BTS">BTS</option>
                        <option value="Stray Kids">Stray Kids</option>
                        <option value="IVE">IVE</option>
                        <option value="aespa">aespa</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-black block mb-1">
                        Quantity (Copies)
                      </label>
                      <input
                        type="number"
                        min="20"
                        step="10"
                        required
                        value={b2bQty}
                        onChange={(e) => setB2bQty(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border-2 border-black focus:outline-none font-mono"
                        style={{ borderRadius: '0px' }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-black text-[11px] text-black font-mono space-y-1">
                    <p className="font-bold">Perks for Group Order Managers:</p>
                    <p>✓ Custom photocard sorting service</p>
                    <p>✓ Direct EMS / DHL Express shipping from Seoul</p>
                    <p>✓ Official Hanteo Chart authentication barcode</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white text-xs py-3 font-mono font-bold uppercase tracking-widest cursor-pointer bg-black border-2 border-black hover:bg-white hover:text-black transition-colors duration-100 mt-2"
                    style={{ borderRadius: '0px' }}
                  >
                    Submit B2B Quotation Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Login / Auth Modal - Clean Root Styled Sign In & Sign Up */}
      {isAuthModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: loginTheme.modalBg,
              borderRadius: loginTheme.borderRadius,
              maxWidth: '440px',
              width: '100%',
              padding: '28px 24px',
              boxShadow: loginTheme.shadow,
              position: 'relative',
              border: loginTheme.border,
              fontFamily: loginTheme.fontFamily,
            }}
          >
            {/* Top Tape for Manga */}
            {loginTheme.tapeDecor && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '40px',
                  width: '110px',
                  height: '24px',
                  backgroundColor: '#e5e0d8',
                  opacity: 0.9,
                  zIndex: 20,
                  transform: 'rotate(-2deg)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  pointerEvents: 'none',
                }}
              />
            )}
            {/* Close Button */}
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthNotification(null);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: '#000000',
                backgroundColor: '#ffffff',
                borderRadius: '0px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid #000000',
                transition: 'all 0.1s ease'
              }}
              type="button"
              title="Close"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>

            {isLoggedIn ? (
              /* LOGGED IN USER PROFILE CARD — Fully themed to match category style */
              <div style={{ fontFamily: loginTheme.fontFamily }}>
                {/* Category Header Badge & Title */}
                <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      backgroundColor: loginTheme.accentColor,
                      color: isCinema || isAnime ? '#000000' : '#ffffff',
                      fontSize: '10px',
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      border: loginTheme.inputBorder,
                      borderRadius: loginTheme.inputRadius,
                      marginBottom: '14px',
                      boxShadow: loginTheme.primaryBtnShadow !== 'none' ? '2px 2px 0px rgba(0,0,0,0.2)' : 'none',
                    }}
                  >
                    <Sparkles style={{ width: '12px', height: '12px' }} />
                    <span>
                      {isManga
                        ? 'MANGA GUILD PASSPORT'
                        : isAnime
                        ? 'SAKUGA VAULT OTACRED'
                        : isComics
                        ? 'HERO SECRET IDENTITY'
                        : isGaming
                        ? 'ARENA PLAYER DOSSIER'
                        : isCinema
                        ? 'CINEMA 70MM PATRON GUILD'
                        : isTvShows
                        ? 'TV BROADCAST SUBSCRIBER'
                        : isCosplay
                        ? 'BAUHAUS ATELIER RUNWAY'
                        : 'FAN HUB PLUS PROFILE'}
                    </span>
                  </div>

                  {/* Avatar with dynamic frame */}
                  <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto 10px auto' }}>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{
                        width: '78px',
                        height: '78px',
                        borderRadius: isManga
                          ? '120px 8px 110px 8px/8px 110px 8px 120px'
                          : isAnime || isComics || isGaming
                          ? '0px'
                          : '50%',
                        objectFit: 'cover',
                        border: loginTheme.primaryBtnBorder,
                        boxShadow: loginTheme.primaryBtnShadow !== 'none' ? loginTheme.primaryBtnShadow : '0 4px 12px rgba(0,0,0,0.15)',
                        backgroundColor: '#ffffff',
                        display: 'block',
                      }}
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 900,
                      color: loginTheme.textColor,
                      margin: '0 0 4px 0',
                      letterSpacing: '-0.01em',
                      fontFamily: loginTheme.fontFamily,
                    }}
                  >
                    {user.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '12px',
                      color: loginTheme.subtitleColor,
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {user.email}
                  </p>
                </div>

                {/* Info Card Container */}
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: loginTheme.inputBg,
                    borderRadius: loginTheme.inputRadius,
                    border: loginTheme.inputBorder,
                    fontSize: '12px',
                    marginBottom: '18px',
                    color: loginTheme.inputColor,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ opacity: 0.7, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>ROLE / STATUS:</span>
                    <span
                      style={{
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: loginTheme.accentColor,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {user.role === 'admin' ? '★ SYSTEM ADMINISTRATOR' : '★ VIP MEMBER'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ opacity: 0.7, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>ACTIVE DOMAIN:</span>
                    <span style={{ fontWeight: 800, color: loginTheme.textColor, textTransform: 'uppercase' }}>
                      {effectiveTheme || 'GLOBAL'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ opacity: 0.7, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>FANDOMS:</span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: loginTheme.textColor,
                        maxWidth: '210px',
                        textAlign: 'right',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.favoriteFandoms && user.favoriteFandoms.length > 0
                        ? user.favoriteFandoms.join(', ')
                        : 'Official Fan'}
                    </span>
                  </div>
                </div>

                {/* Themed Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Dashboard Button */}
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setIsDashboardOpen(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      backgroundColor: loginTheme.primaryBtnBg,
                      color: loginTheme.primaryBtnColor,
                      fontSize: '12px',
                      fontWeight: 900,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      borderRadius: loginTheme.primaryBtnRadius,
                      border: loginTheme.primaryBtnBorder,
                      boxShadow: loginTheme.primaryBtnShadow,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontFamily: loginTheme.fontFamily,
                      transition: 'all 0.1s ease',
                    }}
                    type="button"
                  >
                    <Sparkles style={{ width: '15px', height: '15px' }} />
                    <span>OPEN PERSONAL DASHBOARD</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        onOpenAdmin();
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#000000',
                        color: '#ffd60a',
                        fontSize: '12px',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        borderRadius: loginTheme.primaryBtnRadius,
                        border: loginTheme.primaryBtnBorder,
                        boxShadow: loginTheme.primaryBtnShadow,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontFamily: loginTheme.fontFamily,
                      }}
                      type="button"
                    >
                      <ShieldCheck style={{ width: '15px', height: '15px' }} />
                      <span>ADMIN MANAGEMENT PANEL</span>
                    </button>
                  )}

                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      logout();
                      setIsAuthModalOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      backgroundColor: 'transparent',
                      color: isCinema ? '#f87171' : '#b91c1c',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      borderRadius: loginTheme.primaryBtnRadius,
                      border: loginTheme.inputBorder,
                      cursor: 'pointer',
                      fontFamily: loginTheme.fontFamily,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginTop: '2px',
                    }}
                    type="button"
                  >
                    <LogOut style={{ width: '13px', height: '13px' }} />
                    <span>SIGN OUT</span>
                  </button>
                </div>
              </div>
            ) : (
              /* SIGN IN / SIGN UP FORM MODAL */
              <div>
                {/* Brand Logo Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <img
                    src="/logo-dark.webp"
                    alt="Fan Hub Plus Logo"
                    style={{ height: '40px', width: 'auto', margin: '0 auto 12px auto', objectFit: 'contain' }}
                  />
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: loginTheme.textColor, letterSpacing: '-0.02em', margin: '0 0 4px 0', fontFamily: loginTheme.fontFamily }}>
                    {authMode === 'signin' ? loginTheme.headerTitle : 'NEW COLLECTOR REGISTRATION'}
                  </h3>
                  <p style={{ fontSize: '12px', color: loginTheme.subtitleColor, margin: 0, fontWeight: 700 }}>
                    {authMode === 'signin'
                      ? loginTheme.headerSubtitle
                      : 'Join now for exclusive verified fandom perks & pre-order access'}
                  </p>
                </div>

                {authNotification && (
                  <div
                    style={{
                      marginBottom: '16px',
                      padding: '10px 12px',
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      color: '#047857',
                      fontSize: '12px',
                      fontWeight: 700,
                      borderRadius: loginTheme.inputRadius,
                      textAlign: 'center'
                    }}
                  >
                    {authNotification}
                  </div>
                )}

                {authError && (
                  <div
                    style={{
                      marginBottom: '16px',
                      padding: '10px 12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      fontSize: '12px',
                      fontWeight: 700,
                      borderRadius: loginTheme.inputRadius,
                      textAlign: 'center'
                    }}
                  >
                    {authError}
                  </div>
                )}

                {/* SIGN IN FORM */}
                {authMode === 'signin' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAuthError(null);
                      setAuthNotification(null);
                      setIsLoadingAuth(true);

                      try {
                        const response = await fetch('/api/v1/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: loginEmail,
                            password: loginPassword,
                          }),
                        });

                        const data = await response.json().catch(() => ({}));

                        if (response.status === 200 || response.status === 201) {
                          const accessToken = data.data?.accessToken || data.accessToken || data.access_token;
                          const refreshToken = data.data?.refreshToken || data.refreshToken || data.refresh_token;

                          if (accessToken) {
                            document.cookie = `access_token=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
                            localStorage.setItem('access_token', accessToken);
                          }
                          if (refreshToken) {
                            document.cookie = `refresh_token=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
                            localStorage.setItem('refresh_token', refreshToken);
                          }

                          const userObj = data.data?.user || data.user || data.user_info || {};
                          const roles: string[] = Array.isArray(userObj.roles)
                            ? userObj.roles
                            : (userObj.role ? [userObj.role] : []);
                          const isAdmin = roles.some((r: string) => String(r).toLowerCase() === 'admin');
                          const userRole = isAdmin ? 'admin' : 'registered';

                          setAuthNotification(data.message || 'Login successful!');
                          loginAs(userRole, {
                            id: userObj.id || data.user_id || 'usr_' + Date.now(),
                            name: userObj.fullName || userObj.name || userObj.full_name || loginEmail.split('@')[0],
                            email: userObj.email || loginEmail,
                          });

                          setTimeout(() => {
                            setIsAuthModalOpen(false);
                            setAuthNotification(null);
                            setAuthError(null);
                          }, 1000);
                        } else {
                          setAuthError(extractApiError(data, `Error ${response.status}: Login failed.`));
                        }
                      } catch (err: any) {
                        setAuthError(err.message || 'Unable to connect to authentication server');
                      } finally {
                        setIsLoadingAuth(false);
                      }
                    }}
                  >

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: loginTheme.textColor, marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. user@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          fontSize: '13px',
                          backgroundColor: loginTheme.inputBg,
                          border: loginTheme.inputBorder,
                          borderRadius: loginTheme.inputRadius,
                          outline: 'none',
                          color: loginTheme.inputColor,
                          fontFamily: loginTheme.fontFamily,
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: loginTheme.textColor }}>
                          Password
                        </label>
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); setAuthMode('forgot'); }}
                          style={{ fontSize: '11px', fontWeight: 700, color: loginTheme.accentColor }}
                          className="hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: '14px',
                            paddingRight: '50px',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            fontSize: '13px',
                            backgroundColor: loginTheme.inputBg,
                            border: loginTheme.inputBorder,
                            borderRadius: loginTheme.inputRadius,
                            outline: 'none',
                            color: loginTheme.inputColor,
                            fontFamily: loginTheme.fontFamily,
                            transition: 'all 0.15s ease'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: loginTheme.inputColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px',
                            fontSize: '10px',
                            fontWeight: 800,
                            letterSpacing: '0.05em'
                          }}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? 'HIDE' : 'SHOW'}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setAuthError(null);
                          setAuthNotification(null);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '12px',
                          color: loginTheme.accentColor,
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Reset password via Token/Email
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: loginTheme.primaryBtnBg,
                        color: loginTheme.primaryBtnColor,
                        fontSize: '13px',
                        fontWeight: 800,
                        borderRadius: loginTheme.primaryBtnRadius,
                        border: loginTheme.primaryBtnBorder,
                        boxShadow: loginTheme.primaryBtnShadow,
                        cursor: isLoadingAuth ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: isLoadingAuth ? 0.7 : 1,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isLoadingAuth ? (
                        <span>Signing in...</span>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </form>
                )}

                {/* SIGN UP FORM */}
                {authMode === 'signup' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAuthError(null);
                      setAuthNotification(null);

                      if (signupPassword !== signupConfirmPassword) {
                        setAuthError('Confirm password does not match');
                        return;
                      }

                      setIsLoadingAuth(true);

                      try {
                        const response = await fetch('/api/v1/auth/register', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: signupEmail,
                            Email: signupEmail,
                            password: signupPassword,
                            Password: signupPassword,
                            fullName: signupName,
                            full_name: signupName,
                            FullName: signupName,
                            confirmPassword: signupConfirmPassword,
                            confirm_password: signupConfirmPassword,
                            ConfirmPassword: signupConfirmPassword,
                            phoneNumber: signupPhone,
                            phone_number: signupPhone,
                            PhoneNumber: signupPhone,
                            phone: signupPhone,
                          }),
                        });

                        const data = await response.json().catch(() => ({}));

                        if (response.ok || response.status === 200 || response.status === 201) {
                          const accessToken = data.data?.accessToken || data.accessToken || data.access_token;
                          const refreshToken = data.data?.refreshToken || data.refreshToken || data.refresh_token;

                          if (accessToken) {
                            document.cookie = `access_token=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
                            localStorage.setItem('access_token', accessToken);
                          }
                          if (refreshToken) {
                            document.cookie = `refresh_token=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
                            localStorage.setItem('refresh_token', refreshToken);
                          }

                          const userObj = data.data?.user || data.user || {};
                          setAuthNotification(data.message || 'Account created successfully!');
                          loginAs('registered', {
                            id: userObj.id || data.user_id || 'usr_' + Date.now(),
                            name: userObj.fullName || userObj.name || signupName,
                            email: userObj.email || signupEmail,
                          });
                          setTimeout(() => {
                            setIsAuthModalOpen(false);
                            setAuthNotification(null);
                            setAuthError(null);
                          }, 1200);
                        } else {
                          setAuthError(extractApiError(data, 'Registration failed. Please try again.'));
                        }
                      } catch (err: any) {
                        setAuthError(err.message || 'Unable to connect to auth server (/api/v1/auth/register)');
                      } finally {
                        setIsLoadingAuth(false);
                      }
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: loginTheme.textColor, marginBottom: '5px' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 14px',
                          fontSize: '13px',
                          backgroundColor: loginTheme.inputBg,
                          border: loginTheme.inputBorder,
                          borderRadius: loginTheme.inputRadius,
                          outline: 'none',
                          color: loginTheme.inputColor,
                          fontFamily: loginTheme.fontFamily,
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: loginTheme.textColor, marginBottom: '5px' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="user@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 14px',
                          fontSize: '13px',
                          backgroundColor: loginTheme.inputBg,
                          border: loginTheme.inputBorder,
                          borderRadius: loginTheme.inputRadius,
                          outline: 'none',
                          color: loginTheme.inputColor,
                          fontFamily: loginTheme.fontFamily,
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: loginTheme.textColor, marginBottom: '5px' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 0912345678"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 14px',
                          fontSize: '13px',
                          backgroundColor: loginTheme.inputBg,
                          border: loginTheme.inputBorder,
                          borderRadius: loginTheme.inputRadius,
                          outline: 'none',
                          color: loginTheme.inputColor,
                          fontFamily: loginTheme.fontFamily,
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: loginTheme.textColor, marginBottom: '5px' }}>
                        Password
                      </label>
                      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Min 6 characters"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: '14px',
                            paddingRight: '50px',
                            paddingTop: '9px',
                            paddingBottom: '9px',
                            fontSize: '13px',
                            backgroundColor: loginTheme.inputBg,
                            border: loginTheme.inputBorder,
                            borderRadius: loginTheme.inputRadius,
                            outline: 'none',
                            color: loginTheme.inputColor,
                            fontFamily: loginTheme.fontFamily,
                            transition: 'all 0.15s ease'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: loginTheme.inputColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px',
                            fontSize: '10px',
                            fontWeight: 800
                          }}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? 'HIDE' : 'SHOW'}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: loginTheme.textColor, marginBottom: '5px' }}>
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Repeat password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 14px',
                          fontSize: '13px',
                          backgroundColor: loginTheme.inputBg,
                          border: loginTheme.inputBorder,
                          borderRadius: loginTheme.inputRadius,
                          outline: 'none',
                          color: loginTheme.inputColor,
                          fontFamily: loginTheme.fontFamily,
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: loginTheme.primaryBtnBg,
                        color: loginTheme.primaryBtnColor,
                        fontSize: '13px',
                        fontWeight: 800,
                        borderRadius: loginTheme.primaryBtnRadius,
                        border: loginTheme.primaryBtnBorder,
                        boxShadow: loginTheme.primaryBtnShadow,
                        cursor: isLoadingAuth ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: isLoadingAuth ? 0.7 : 1,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isLoadingAuth ? (
                        <span>Creating Account...</span>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </form>
                )}

                {/* FORGOT PASSWORD FORM */}
                {authMode === 'forgot' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setAuthError(null);
                      setAuthNotification(null);

                      if (!isResetTokenSent) {
                        if (!forgotEmail.trim()) {
                          setAuthError('Please enter your email address.');
                          return;
                        }
                        const res = requestPasswordReset(forgotEmail);
                        setIsResetTokenSent(true);
                        setForgotToken(res.token);
                        setAuthNotification(res.message);
                      } else {
                        if (!forgotToken.trim() || !forgotNewPassword.trim()) {
                          setAuthError('Please enter both the token and your new password.');
                          return;
                        }
                        const res = resetPasswordWithToken(forgotEmail, forgotToken, forgotNewPassword);
                        if (res.success) {
                          setAuthNotification(res.message);
                          setTimeout(() => {
                            setAuthMode('signin');
                            setIsResetTokenSent(false);
                            setLoginEmail(forgotEmail);
                            setForgotToken('');
                            setForgotNewPassword('');
                          }, 1800);
                        } else {
                          setAuthError(res.message);
                        }
                      }
                    }}
                  >
                    {!isResetTokenSent ? (
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: loginTheme.textColor, marginBottom: '5px' }}>
                          Registered Account Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="fan@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: '13px',
                            backgroundColor: loginTheme.inputBg,
                            border: loginTheme.inputBorder,
                            borderRadius: loginTheme.inputRadius,
                            outline: 'none',
                            color: loginTheme.inputColor,
                            fontFamily: loginTheme.fontFamily,
                            transition: 'all 0.15s ease'
                          }}
                        />
                        <p style={{ fontSize: '11px', color: loginTheme.subtitleColor, marginTop: '6px' }}>
                          We will send a 6-character verification token to securely reset your password.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: loginTheme.textColor, marginBottom: '5px' }}>
                            Verification Token (Sent via email)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter 6-digit token"
                            value={forgotToken}
                            onChange={(e) => setForgotToken(e.target.value.toUpperCase())}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              letterSpacing: '0.15em',
                              textAlign: 'center',
                              backgroundColor: '#fef3c7',
                              border: '1.5px solid #f59e0b',
                              borderRadius: loginTheme.inputRadius,
                              outline: 'none',
                              color: '#92400e'
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: loginTheme.textColor, marginBottom: '5px' }}>
                            New Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Minimum 6 characters"
                            value={forgotNewPassword}
                            onChange={(e) => setForgotNewPassword(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              fontSize: '13px',
                              backgroundColor: loginTheme.inputBg,
                              border: loginTheme.inputBorder,
                              borderRadius: loginTheme.inputRadius,
                              outline: 'none',
                              color: loginTheme.inputColor,
                              fontFamily: loginTheme.fontFamily,
                              transition: 'all 0.15s ease'
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '11px',
                        backgroundColor: loginTheme.primaryBtnBg,
                        color: loginTheme.primaryBtnColor,
                        fontSize: '13px',
                        fontWeight: 800,
                        borderRadius: loginTheme.primaryBtnRadius,
                        border: loginTheme.primaryBtnBorder,
                        boxShadow: loginTheme.primaryBtnShadow,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{isResetTokenSent ? 'Confirm Password Reset' : 'Send Verification Token via Email'}</span>
                    </button>
                  </form>
                )}

                {/* Bottom Switch Link */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center' }}>
                  {authMode === 'signin' ? (
                    <p style={{ fontSize: '13px', color: loginTheme.textColor, margin: 0, opacity: 0.85 }}>
                      {"Don't have an account?"}{' '}
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signup'); setAuthNotification(null); }}
                        style={{ fontWeight: 800, color: loginTheme.accentColor || loginTheme.textColor, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                      >
                        Sign up now
                      </button>
                    </p>
                  ) : authMode === 'signup' ? (
                    <p style={{ fontSize: '13px', color: loginTheme.textColor, margin: 0, opacity: 0.85 }}>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signin'); setAuthNotification(null); }}
                        style={{ fontWeight: 800, color: loginTheme.accentColor || loginTheme.textColor, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                      >
                        Sign in now
                      </button>
                    </p>
                  ) : (
                    <p style={{ fontSize: '13px', color: loginTheme.textColor, margin: 0, opacity: 0.85 }}>
                      Remember your password?{' '}
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signin'); setAuthNotification(null); setIsResetTokenSent(false); }}
                        style={{ fontWeight: 800, color: loginTheme.accentColor || loginTheme.textColor, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                      >
                        Back to Sign In
                      </button>
                    </p>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* PERSONAL USER DASHBOARD MODAL */}
      <PersonalDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        fandomThemeKey={effectiveTheme}
        fandomCategory={fandomCategory}
      />

      {/* ========================================================================= */}
      {/* MOBILE SIDEBAR DRAWER */}
      {/* ========================================================================= */}
      {isMenuDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMenuDrawerOpen(false)}
          />

          {/* Drawer content sliding from left */}
          <div className="relative w-[310px] sm:w-[350px] max-w-[85vw] h-full bg-white flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Top Bar with Brand & Close */}
            <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-slate-50">
              <Link
                href="/"
                onClick={() => setIsMenuDrawerOpen(false)}
                className="flex items-center notranslate"
              >
                <img
                  src="/logo-dark.webp"
                  alt="Fan Hub Plus"
                  className="h-8 w-auto object-contain block"
                />
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-black cursor-pointer shadow-xs transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search trigger button in Drawer */}
            <div className="p-3.5 border-b border-slate-100 bg-white">
              <button
                type="button"
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  setIsSearchModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-semibold cursor-pointer border-0 transition-colors"
              >
                <Search className="w-4 h-4 text-slate-600" />
                <span>Search albums, artists, OSTs...</span>
              </button>
            </div>

            {/* Scrollable Nav Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              {/* Accessibility & Quick Settings (Dark Mode, Language) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Accessibility &amp; Settings
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={toggleThemeMode}
                    className="py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className="py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>🌐 {language === 'en' ? 'EN' : 'VI'}</span>
                  </button>
                </div>
              </div>

              {/* 1. Main Navigation Links */}
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Main Navigation
                </div>
                <div className="space-y-1">
                  <Link
                    href={getTabHref('/artist')}
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-black" />
                      ARTIST
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href={getTabHref('/event')}
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-black" />
                      EVENT
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href={getTabHref('/multimedia')}
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Tv className="w-4 h-4 text-black" />
                      MULTIMEDIA
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href={getTabHref('/cd-dvd-book')}
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Disc className="w-4 h-4 text-black" />
                      CD / DVD / BOOK
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href={getTabHref('/md')}
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-black" />
                      MD (Official Merchandise)
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href={getTabHref('/b2b')}
                    onClick={() => setIsMenuDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-black" />
                      B2B / BULK ORDERS
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* 2. ALL MD Collection Categories */}
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
                  <span>ALL MD CATEGORIES</span>
                  <span className="bg-black text-white text-[9px] px-1.5 py-0.5 rounded font-bold">9 ITEMS</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1">
                  {allMdItems.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsMenuDrawerOpen(false);
                        item.action();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-white hover:text-black hover:shadow-xs transition-all flex items-center justify-between border-0 cursor-pointer bg-transparent"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Quick Section Jumps */}
              <div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2 px-1">
                  Quick Sections
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('albums')}
                    style={{ borderRadius: '0px' }}
                    className="p-2.5 text-left bg-white border border-black hover:bg-neutral-100 text-xs font-mono font-bold text-black cursor-pointer flex items-center gap-2 transition-colors duration-100"
                  >
                    <Disc className="w-3.5 h-3.5 shrink-0" />
                    <span>Album Drops</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('artists')}
                    style={{ borderRadius: '0px' }}
                    className="p-2.5 text-left bg-white border border-black hover:bg-neutral-100 text-xs font-mono font-bold text-black cursor-pointer flex items-center gap-2 transition-colors duration-100"
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>Idol Profiles</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('tours')}
                    style={{ borderRadius: '0px' }}
                    className="p-2.5 text-left bg-white border border-black hover:bg-neutral-100 text-xs font-mono font-bold text-black cursor-pointer flex items-center gap-2 transition-colors duration-100"
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>World Tour</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('community')}
                    style={{ borderRadius: '0px' }}
                    className="p-2.5 text-left bg-white border border-black hover:bg-neutral-100 text-xs font-mono font-bold text-black cursor-pointer flex items-center gap-2 transition-colors duration-100"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>Fandom Feed</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Footer Actions inside Drawer */}
            <div className="p-3.5 border-t border-black bg-white space-y-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  style={{ borderRadius: '0px' }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-black text-xs font-mono font-bold text-black hover:bg-neutral-100 cursor-pointer transition-colors duration-100"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'EN' : 'VI'}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleThemeMode}
                  style={{ borderRadius: '0px' }}
                  className="w-10 h-9 flex items-center justify-center bg-white border border-black text-black hover:bg-neutral-100 cursor-pointer transition-colors duration-100"
                  title="Theme toggle"
                >
                  {themeMode === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={toggleFontSize}
                  style={{ borderRadius: '0px' }}
                  className={`w-10 h-9 flex items-center justify-center border border-black text-xs font-mono font-bold cursor-pointer transition-colors duration-100 ${isLargeFont
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                    }`}
                  title={isLargeFont ? 'Reduce font size' : 'Increase font size'}
                >
                  <span>{isLargeFont ? 'A+' : 'A'}</span>
                </button>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs font-mono">
                    <span className="font-bold text-black block truncate max-w-[170px]">{user.name}</span>
                    <span className="text-[10px] text-neutral-500 block truncate max-w-[170px]">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsMenuDrawerOpen(false);
                    }}
                    className="text-xs font-mono font-bold text-black underline hover:opacity-60 bg-transparent border-0 cursor-pointer p-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuDrawerOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  style={{ borderRadius: '0px' }}
                  className="w-full py-2.5 bg-black text-white text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer hover:bg-white hover:text-black border-2 border-black transition-colors duration-100"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEDICATED SEARCH MODAL (Minimalist Monochrome - 0px sharp, pure black & white) */}
      {/* ========================================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start items-center p-0 sm:p-6">
          {/* Smooth backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity duration-100"
            onClick={() => setIsSearchModalOpen(false)}
          />

          {/* Modal Card - 0px sharp, 2px solid black border, zero shadows */}
          <div
            style={{ borderRadius: '0px' }}
            className="relative w-full max-w-[680px] bg-white rounded-none shadow-none z-10 overflow-hidden border-2 border-black mt-8"
          >
            {/* Top Bar with Brand / Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b-2 border-black bg-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-black">
                  SEARCH &amp; EXPLORE
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 border border-black px-2 py-0.5 ml-2">
                  FANDOM ARCHIVE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                style={{ borderRadius: '0px' }}
                className="w-8 h-8 bg-white hover:bg-neutral-100 border border-black flex items-center justify-center text-black cursor-pointer transition-colors duration-100"
                title="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Form Area */}
            <div className="p-6">
              {/* Sharp Monochrome Search Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSearchModalOpen(false);
                  const albumsEl = document.getElementById('albums');
                  if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full mb-6"
              >
                <div
                  style={{
                    borderRadius: '0px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #000000',
                  }}
                  className="w-full flex items-center pl-4 pr-1.5 py-1.5"
                >
                  <Search className="w-5 h-5 text-black shrink-0" />

                  <input
                    id="mobile-header-search"
                    aria-label="Search artist, album drops, or tours"
                    type="text"
                    autoFocus
                    placeholder="Search artist, album drops, tours (Playfair, BTS, NewJeans...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      color: '#000000',
                      fontFamily: 'var(--font-source-serif), serif',
                    }}
                    className="flex-1 min-w-0 px-3 py-2 text-base font-normal placeholder:text-neutral-400 placeholder:italic"
                  />

                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ borderRadius: '0px' }}
                      className="w-7 h-7 bg-white hover:bg-neutral-100 border border-black text-black flex items-center justify-center cursor-pointer shrink-0 mr-2 transition-colors duration-100"
                      aria-label="Clear search input"
                      title="Clear text"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Submit Action Sharp Button */}
                  <button
                    type="submit"
                    style={{
                      borderRadius: '0px',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                    }}
                    className="hover:bg-white hover:text-black border-2 border-black text-xs font-mono font-bold uppercase tracking-widest px-5 py-2.5 flex items-center gap-2 cursor-pointer shrink-0 transition-colors duration-100"
                  >
                    <span>SEARCH</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Real-time search status indicator if user is typing */}
              {searchQuery.trim() ? (
                <div
                  style={{ borderRadius: '0px' }}
                  className="flex items-center justify-between px-4 py-2.5 mb-6 bg-neutral-100 border border-black text-xs font-mono text-black"
                >
                  <span>
                    FILTER: <strong>"{searchQuery}"</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      const albumsEl = document.getElementById('albums');
                      if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="underline text-black font-bold uppercase cursor-pointer bg-transparent border-0"
                  >
                    VIEW RESULTS →
                  </button>
                </div>
              ) : null}

              {/* Trending Keywords / Top Searches */}
              <div className="mb-6">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-3 px-1">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>TRENDING KEYWORDS &amp; POPULAR SEARCHES</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'BTS', hot: true },
                    { label: 'NewJeans', hot: true },
                    { label: 'BLACKPINK', hot: true },
                    { label: 'Stray Kids', hot: false },
                    { label: 'Demon Slayer', hot: false },
                    { label: 'Limited Kit', hot: false },
                    { label: 'Vinyl LP', hot: false },
                    { label: 'OST Anime', hot: false },
                  ].map((item, idx) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item.label);
                        setIsSearchModalOpen(false);
                        const albumsEl = document.getElementById('albums');
                        if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        borderRadius: '0px',
                      }}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-neutral-100 text-black border border-black text-xs font-mono font-bold cursor-pointer transition-colors duration-100"
                    >
                      <span className="font-mono text-[10px] font-bold">
                        0{idx + 1}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories Navigation */}
              <div className="pt-4 border-t border-black">
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-3 px-1">
                  FEATURED CATEGORIES
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('Full Album');
                      setIsSearchModalOpen(false);
                      const albumsEl = document.getElementById('albums');
                      if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ borderRadius: '0px' }}
                    className="p-3 text-left bg-white hover:bg-neutral-100 text-xs font-mono font-bold text-black border border-black cursor-pointer transition-colors duration-100 flex items-center gap-2 group"
                  >
                    <Disc className="w-3.5 h-3.5 shrink-0" />
                    <span>CD &amp; LP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('Limited Kit');
                      setIsSearchModalOpen(false);
                      const albumsEl = document.getElementById('albums');
                      if (albumsEl) albumsEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ borderRadius: '0px' }}
                    className="p-3 text-left bg-white hover:bg-neutral-100 text-xs font-mono font-bold text-black border border-black cursor-pointer transition-colors duration-100 flex items-center gap-2 group"
                  >
                    <Gift className="w-3.5 h-3.5 shrink-0" />
                    <span>Limited</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      const artistsEl = document.getElementById('artists');
                      if (artistsEl) artistsEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ borderRadius: '0px' }}
                    className="p-3 text-left bg-white hover:bg-neutral-100 text-xs font-mono font-bold text-black border border-black cursor-pointer transition-colors duration-100 flex items-center gap-2 group"
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>Artists</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      const toursEl = document.getElementById('tours');
                      if (toursEl) toursEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ borderRadius: '0px' }}
                    className="p-3 text-left bg-white hover:bg-neutral-100 text-xs font-mono font-bold text-black border border-black cursor-pointer transition-colors duration-100 flex items-center gap-2 group"
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Tour</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals: Ticket Wallet & Outro */}
      <SeatMapBookingModal
        event={null}
        isOpen={isTicketWalletOpen}
        onClose={() => setIsTicketWalletOpen(false)}
        initialStep="wallet"
      />
      <OutroModal
        isOpen={isOutroOpen}
        onClose={() => setIsOutroOpen(false)}
      />

    </header>
  );
};
