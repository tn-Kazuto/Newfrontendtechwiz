'use client';

import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Disc,
  Ticket,
  Headphones,
  ShoppingBag,
  Heart,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
  Radio,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { FandomCategoryKey, Album } from '../types';

interface GamingMonochromeViewProps {
  onSelectCategory?: (category: FandomCategoryKey | 'all') => void;
  activeCategory?: FandomCategoryKey | 'all';
}

interface GamingProduct {
  id: string;
  title: string;
  franchise: string;
  composer: string;
  format: '4LP Vinyl Boxset' | 'Archival CD & Artbook' | 'Collector Pass Kit' | 'Pro Hardware Edition';
  priceUSD: number;
  priceVND: number;
  rating: number;
  reviewCount: number;
  badge: string;
  image: string;
  description: string;
  trackCount: number;
  edition: string;
  tag: string;
}

const GAMING_CATALOG: GamingProduct[] = [
  {
    id: 'game-ost-t1-worlds-2024',
    title: 'Heavy Is The Crown • T1 Worlds 2024 Grand Finals Suite',
    franchise: 'League of Legends // Riot Games',
    composer: 'Linkin Park & Riot Games Music',
    format: '4LP Vinyl Boxset',
    priceUSD: 85.00,
    priceVND: 2100000,
    rating: 5.0,
    reviewCount: 4210,
    badge: 'WORLDS CHAMPION EDITION',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    description: 'The definitive sonic chronicle of Faker and T1’s historic 5th Summoner’s Cup victory at the O2 Arena in London. Pressed on 180g pure heavyweight monochrome vinyl.',
    trackCount: 24,
    edition: 'Strictly 5,000 Hand-Numbered Units',
    tag: 'WORLDS 2024'
  },
  {
    id: 'game-ost-wukong-symphony',
    title: 'Black Myth: Wukong Complete Orchestral Symphony',
    franchise: 'Game Science',
    composer: 'Zhenfei Zhao, Zhiwei Wang & Traditional Folk Soloists',
    format: '4LP Vinyl Boxset',
    priceUSD: 92.00,
    priceVND: 2280000,
    rating: 4.98,
    reviewCount: 3890,
    badge: 'ANCIENT FOLK ORCHESTRA',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    description: 'Mastered directly from high-resolution studio stems recorded with a 90-piece Philharmonic Orchestra and authentic traditional Chinese percussion soloists.',
    trackCount: 38,
    edition: 'Archival Hardcover Foil Slipcase',
    tag: 'WUKONG'
  },
  {
    id: 'game-ost-elden-ring-erdtree',
    title: 'Shadow of the Erdtree Original Soundtrack Suite',
    franchise: 'FromSoftware // Bandai Namco',
    composer: 'Yuka Kitamura, Tsukasa Saitoh, Shoi Miyazawa',
    format: 'Archival CD & Artbook',
    priceUSD: 46.00,
    priceVND: 1150000,
    rating: 4.95,
    reviewCount: 2950,
    badge: 'GRAVEBIRD ARCHIVE',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    description: 'Haunting choral chants, brass-heavy crescendos, and somber string laments scored for the Land of Shadow. Includes 64-page concept artbook.',
    trackCount: 32,
    edition: 'First Press Gold Holographic Seal',
    tag: 'ELDEN RING'
  },
  {
    id: 'game-ost-genshin-natlan',
    title: 'Natlan: Land of Primal Flame Acoustic Symphony',
    franchise: 'HOYO-MiX',
    composer: 'HOYO-MiX Studio & Global Indigenous Ensembles',
    format: '4LP Vinyl Boxset',
    priceUSD: 78.00,
    priceVND: 1950000,
    rating: 4.92,
    reviewCount: 3120,
    badge: 'HOYO-MIX MASTERWORK',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    description: 'A vibrant cross-cultural tapestry combining African djembe rhythms, Latin brass, and soaring symphonic orchestra celebrating the sixth nation of Teyvat.',
    trackCount: 44,
    edition: 'Custom Embossed Monochrome Gatefold',
    tag: 'GENSHIN'
  },
  {
    id: 'game-gear-kingdom-cyber-controller',
    title: 'Kingdom Pro Wireless Controller • Monochrome Monolith',
    franchise: 'Esports Hardware Collaboration',
    composer: 'Kingdom Cyber Arena Setup',
    format: 'Pro Hardware Edition',
    priceUSD: 149.00,
    priceVND: 3700000,
    rating: 4.96,
    reviewCount: 1680,
    badge: '1000HZ TOURNAMENT POLLING',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
    description: 'Hall-effect magnetic triggers, swappable mechanical D-pads, 0.05ms wireless response rate, and architectural pure black/white chassis.',
    trackCount: 0,
    edition: 'Tournament Audited & Serialized',
    tag: 'HARDWARE'
  },
  {
    id: 'game-pass-worlds-london-vip',
    title: 'Championship Arena Pass Kit • Collector Access Voucher',
    franchise: 'Riot Games Arena Tour',
    composer: 'Official Esports Arena Pass',
    format: 'Collector Pass Kit',
    priceUSD: 120.00,
    priceVND: 2980000,
    rating: 5.0,
    reviewCount: 890,
    badge: 'VIP SOUNDCHECK TICKET',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    description: 'Physical acrylic tournament pass with RFID chip, lanyard, commemorative steel coin, and verified soundcheck access voucher.',
    trackCount: 0,
    edition: 'Limited Official Commemorative Release',
    tag: 'TICKETS'
  }
];

export const GamingMonochromeView: React.FC<GamingMonochromeViewProps> = ({
  onSelectCategory,
  activeCategory = 'Gaming'
}) => {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice } = useCartWishlist();

  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'ALL') return GAMING_CATALOG;
    return GAMING_CATALOG.filter(item => item.tag === activeFilter);
  }, [activeFilter]);

  // Convert GamingProduct to Album format for cart & wishlist
  const toAlbum = (item: GamingProduct): Album => ({
    id: item.id,
    title: item.title,
    artist: item.franchise,
    artistId: 'gaming-artist',
    releaseDate: '2026-01-15',
    priceUSD: item.priceUSD,
    priceVND: item.priceVND,
    coverImage: item.image,
    galleryImages: [item.image],
    description: item.description,
    type: 'OST & Vinyl',
    tag: 'Limited Edition',
    rating: item.rating,
    reviewCount: item.reviewCount,
    popularityScore: 99,
    stock: 50,
    category: 'Gaming',
    versions: [
      {
        id: `${item.id}-std`,
        name: item.format,
        extraPriceUSD: 0
      }
    ],
    inclusions: ['Archival Gatefold', '180g Vinyl', 'Monochrome Liner Notes'],
    photocards: [],
    tracks: [],
    reviews: []
  });

  const handleAddToCart = (item: GamingProduct) => {
    const mockAlbum = toAlbum(item);
    addToCart(mockAlbum, `${item.id}-std`, 1);
    setAddedToast(item.title);
    setTimeout(() => setAddedToast(null), 3500);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  const FANDOM_CATEGORIES: { id: FandomCategoryKey | 'all'; label: string }[] = [
    { id: 'all', label: 'All Fandoms' },
    { id: 'K-Pop', label: 'K-Pop' },
    { id: 'Gaming', label: '★ Gaming Arena' },
    { id: 'Manga', label: 'Manga' },
    { id: 'Anime', label: 'Anime' },
    { id: 'Cosplay', label: 'Cosplay' },
    { id: 'Comics', label: 'Comics' },
    { id: 'Movies', label: 'Cinema' },
    { id: 'TV Shows', label: 'TV Shows' }
  ];

  return (
    <div className="w-full bg-[#FFFFFF] text-[#000000] dark:bg-[#090d16] dark:text-[#f8fafc] selection:bg-[#000000] selection:text-[#FFFFFF]">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000000] text-[#FFFFFF] dark:bg-[#1e293b] dark:text-white border-2 border-[#000000] dark:border-[#334155] px-6 py-4 shadow-none flex items-center gap-3 font-mono text-xs uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-100">
          <Check className="w-4 h-4 text-[#FFFFFF]" />
          <span>Added to Collection: {addedToast.substring(0, 36)}...</span>
        </div>
      )}

      {/* =========================================================================
          0. TOP CATEGORY SWITCHER DOCK (Strict Minimalist Monochrome 0px)
      ========================================================================= */}
      <div className="w-full bg-[#FFFFFF] dark:bg-[#090d16] border-b-4 border-[#000000] dark:border-[#2a364f] py-3 px-4 sm:px-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[11px] font-black tracking-widest uppercase mr-2 select-none text-black dark:text-[#94a3b8]">
              SECTOR //
            </span>
            {FANDOM_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                  type="button"
                  style={{ borderRadius: '0px' }}
                  className={`px-3.5 sm:px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-100 cursor-pointer whitespace-nowrap border-2 ${
                    isActive
                      ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#00f0ff] dark:text-black dark:border-[#00f0ff]'
                      : 'bg-[#FFFFFF] text-[#000000] border-[#000000] hover:bg-[#000000] hover:text-[#FFFFFF] dark:bg-[#1e293b] dark:text-[#f8fafc] dark:border-[#334155] dark:hover:bg-[#2a364f] dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <span className="hidden lg:inline-block font-mono text-[10px] tracking-widest text-[#525252] uppercase shrink-0">
            SYSTEM // MONOCHROME V2
          </span>
        </div>
      </div>

      {/* =========================================================================
          1. HERO SECTION: OVERSIZED TYPOGRAPHY (8XL/9XL) & EDITORIAL RULES
      ========================================================================= */}
      <section 
        id="arena-hero" 
        className="relative w-full py-20 sm:py-28 md:py-36 px-6 md:px-8 lg:px-12 border-b-4 border-[#000000] overflow-hidden"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)',
          backgroundSize: '100% 4px'
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Metadata pill in JetBrains Mono */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs uppercase tracking-widest font-black px-3 py-1 bg-[#000000] text-[#FFFFFF]">
              ISSUE № 04 // GAMING ARCHIVE
            </span>
            <span className="font-mono text-xs tracking-widest text-[#525252] uppercase">
              ORCHESTRAL SOUNDTRACKS &amp; TOURNAMENT MERCH
            </span>
          </div>

          {/* Bold Choice #1: Oversized Hero Statement (9xl Desktop) */}
          <div className="space-y-0 select-none">
            <div 
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none text-[#000000]"
            >
              DISCIPLINE.
            </div>
            <div 
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal italic tracking-tight text-[#000000] -mt-2 sm:-mt-4"
            >
              The Architecture of Sound &amp; Arena.
            </div>
          </div>

          {/* Bold Choice #2: Hero Decorative Element (Thick Rule with Bordered Square Punctuation) */}
          <div className="flex items-center gap-2 max-w-md my-8">
            <div className="w-3 h-3 border-2 border-[#000000] bg-[#000000] shrink-0" />
            <div className="flex-1 h-[4px] bg-[#000000]" />
            <div className="w-3 h-3 border-2 border-[#000000] bg-[#FFFFFF] shrink-0" />
          </div>

          {/* Lead Subtitle (Source Serif 4) */}
          <p 
            style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
            className="text-base sm:text-lg md:text-xl text-[#525252] leading-relaxed max-w-2xl font-normal mb-10"
          >
            Stripped down to the uncompromising essence of competitive audio and monumental game scores. 
            Zero noise, zero distraction—pure fidelity pressed on heavyweight lacquer and engineered for the world stage.
          </p>

          {/* Buttons: Primary (px-8 py-4, hover invert) & Secondary (2px outline) */}
          <div className="flex items-center gap-4 flex-wrap font-mono">
            <a
              href="#gaming-catalog"
              style={{ borderRadius: '0px' }}
              className="px-8 py-4 bg-[#000000] text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#000000] border-2 border-[#000000] text-sm uppercase font-black tracking-widest flex items-center gap-3 transition-colors duration-100 cursor-pointer no-underline"
            >
              <span>EXPLORE ARCHIVE</span>
              <span>→</span>
            </a>

            <a
              href="#tournament-passes"
              style={{ borderRadius: '0px' }}
              className="px-8 py-4 bg-transparent text-[#000000] hover:bg-[#000000] hover:text-[#FFFFFF] border-2 border-[#000000] text-sm uppercase font-black tracking-widest flex items-center gap-3 transition-colors duration-100 cursor-pointer no-underline"
            >
              <span>ARENA PASSES</span>
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. FEATURED SOUNDTRACKS & MERCH DETAIL (With Boxed Drop Cap)
      ========================================================================= */}
      <section 
        id="gaming-catalog" 
        className="w-full py-20 sm:py-28 px-6 md:px-8 lg:px-12 border-b-4 border-[#000000]"
        style={{
          backgroundImage: 'linear-gradient(#00000008 1px, transparent 1px), linear-gradient(90deg, #00000008 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      >
        <div className="max-w-6xl mx-auto">
          
          {/* Header with Title and Boxed Drop Cap Story */}
          <div className="mb-14 pb-8 border-b-2 border-[#000000]">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#525252] font-black block mb-1">
                  OFFICIAL AUDITED CATALOG // 2026
                </span>
                <h2 
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#000000]"
                >
                  Monumental Soundtracks.
                </h2>
              </div>

              {/* Filter Tabs in JetBrains Mono */}
              <div className="flex items-center gap-2 flex-wrap">
                {['ALL', 'WORLDS 2024', 'WUKONG', 'ELDEN RING', 'GENSHIN', 'HARDWARE'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    style={{ borderRadius: '0px' }}
                    className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase border border-[#000000] transition-colors duration-100 cursor-pointer ${
                      activeFilter === tag
                        ? 'bg-[#000000] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] text-[#000000] hover:bg-[#000000] hover:text-[#FFFFFF]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Bold Choice #11: Boxed Drop Cap on First Paragraph */}
            <div 
              style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
              className="text-base sm:text-lg text-[#525252] leading-relaxed max-w-3xl pt-4"
            >
              <p className="relative pl-0">
                {/* Bordered Box Drop Cap */}
                <span className="float-left mr-3.5 mt-1 border-2 border-[#000000] bg-[#000000] text-[#FFFFFF] w-12 h-12 flex items-center justify-center font-serif text-2xl font-black select-none">
                  G
                </span>
                aming scores have transcended the background. From 90-piece Philharmonic ensembles to unyielding 
                electronic breakcore, every release presented here is documented with archival precision. Hand-pressed 
                vinyl editions, audiophile-grade remastering, and verified tournament passes for the dedicated auditor.
              </p>
            </div>
          </div>

          {/* Product Grid: 3 Columns with Sharp Corners and Hover Inversion */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((item) => {
              const wishlisted = isWishlisted(item.id);
              return (
                <div
                  key={item.id}
                  style={{ borderRadius: '0px' }}
                  className="group bg-[#FFFFFF] border-2 border-[#000000] p-6 flex flex-col justify-between transition-colors duration-100 hover:bg-[#000000] hover:text-[#FFFFFF] cursor-pointer"
                >
                  <div>
                    {/* Top Format & Badge */}
                    <div className="flex items-center justify-between mb-4 border-b border-[#000000] group-hover:border-[#FFFFFF] pb-3">
                      <span className="font-mono text-[10px] font-black uppercase tracking-widest group-hover:text-[#FFFFFF]">
                        {item.format}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 border border-[#000000] group-hover:border-[#FFFFFF] group-hover:text-[#FFFFFF]">
                        {item.badge}
                      </span>
                    </div>

                    {/* Image with Border weight transition */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden border border-[#000000] group-hover:border-[#FFFFFF] mb-4 bg-neutral-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(toAlbum(item));
                        }}
                        style={{ borderRadius: '0px' }}
                        className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center border border-[#000000] ${
                          wishlisted
                            ? 'bg-[#000000] text-[#FFFFFF]'
                            : 'bg-[#FFFFFF] text-[#000000] hover:bg-[#000000] hover:text-[#FFFFFF]'
                        }`}
                        title="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Title (Playfair Display) */}
                    <h3 
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                      className="text-xl font-bold tracking-tight mb-2 group-hover:text-[#FFFFFF] line-clamp-2"
                    >
                      {item.title}
                    </h3>

                    <p className="font-mono text-xs text-[#525252] group-hover:text-neutral-300 uppercase tracking-wider mb-2">
                      {item.franchise}
                    </p>

                    <p 
                      style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
                      className="text-xs text-[#525252] group-hover:text-neutral-300 leading-relaxed mb-4 line-clamp-2"
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="pt-4 border-t border-[#000000] group-hover:border-[#FFFFFF] flex items-center justify-between">
                    <div>
                      <div className="font-mono text-lg font-black group-hover:text-[#FFFFFF]">
                        ${item.priceUSD.toFixed(2)}
                      </div>
                      <div className="font-mono text-[10px] text-[#525252] group-hover:text-neutral-400">
                        {formatPrice(item.priceUSD, item.priceVND)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      style={{ borderRadius: '0px' }}
                      className="px-4 py-2 bg-[#000000] text-[#FFFFFF] group-hover:bg-[#FFFFFF] group-hover:text-[#000000] border border-[#000000] group-hover:border-[#FFFFFF] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-100"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>ORDER</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. BOLD CHOICE #3: INVERTED STATS SECTION (Pure Black & White with Texture)
      ========================================================================= */}
      {/* =========================================================================
          3. STATS SECTION (Minimalist Monochrome on #FFFFFF with Editorial Rules)
      ========================================================================= */}
      <section 
        id="gaming-stats"
        className="w-full bg-[#FFFFFF] text-[#000000] py-24 sm:py-32 px-6 md:px-8 lg:px-12 border-b-4 border-[#000000] relative overflow-hidden"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)',
          backgroundSize: '100% 4px'
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Section Subhead */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] font-black block mb-2">
              AUDITED NUMERICAL RIGOR
            </span>
            <h2 
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#000000]"
            >
              The Mechanics of Scale.
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-black border-y-2 border-black py-8">
            
            <div className="pt-6 sm:pt-0 sm:px-6 text-center">
              <div 
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                className="text-6xl sm:text-7xl font-bold tracking-tighter text-[#000000] mb-2 leading-none"
              >
                120K+
              </div>
              <div className="font-mono text-xs font-black uppercase tracking-widest text-[#000000]">
                STADIUM SPECTATORS
              </div>
              <p 
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
                className="text-xs text-[#525252] mt-2"
              >
                Simultaneous verified attendance across Tokyo Dome and London O2 arena tours.
              </p>
            </div>

            <div className="pt-6 sm:pt-0 sm:px-6 text-center">
              <div 
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                className="text-6xl sm:text-7xl font-bold tracking-tighter text-[#000000] mb-2 leading-none"
              >
                0.00MS
              </div>
              <div className="font-mono text-xs font-black uppercase tracking-widest text-[#000000]">
                ZERO-LATENCY FIDELITY
              </div>
              <p 
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
                className="text-xs text-[#525252] mt-2"
              >
                192kHz / 24-bit direct audio lacquer pressings without digital compression.
              </p>
            </div>

            <div className="pt-6 sm:pt-0 sm:px-6 text-center">
              <div 
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                className="text-6xl sm:text-7xl font-bold tracking-tighter text-[#000000] mb-2 leading-none"
              >
                100%
              </div>
              <div className="font-mono text-xs font-black uppercase tracking-widest text-[#000000]">
                AUDITED &amp; CERTIFIED
              </div>
              <p 
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
                className="text-xs text-[#525252] mt-2"
              >
                Every release serialized and registered in the global fandom archive.
              </p>
            </div>

            <div className="pt-6 sm:pt-0 sm:px-6 text-center">
              <div 
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                className="text-6xl sm:text-7xl font-bold tracking-tighter text-[#000000] mb-2 leading-none"
              >
                24/7
              </div>
              <div className="font-mono text-xs font-black uppercase tracking-widest text-[#000000]">
                ARENA ACCESS VAULT
              </div>
              <p 
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
                className="text-xs text-[#525252] mt-2"
              >
                Instant digital authentication for VIP soundcheck and tournament kits.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. BOLD CHOICE #6: EDITORIAL PULL QUOTES & TESTIMONIALS
      ========================================================================= */}
      <section className="w-full py-20 sm:py-28 px-6 md:px-8 lg:px-12 border-b-4 border-[#000000] bg-[#FFFFFF]">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] font-black block mb-1">
              PRO CURATOR VOICES // ARCHIVAL REVIEWS
            </span>
            <h2 
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#000000]"
            >
              Editorial Testimonials.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Quote 1 */}
            <div className="group border-b border-[#000000] pb-8 transition-all duration-100 hover:border-b-[3px]">
              <span className="font-serif text-7xl font-black leading-none text-[#000000] opacity-10 group-hover:opacity-40 transition-opacity duration-100 block -mb-6">
                “
              </span>
              <p 
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                className="text-xl sm:text-2xl italic font-normal text-[#000000] leading-relaxed mb-6"
              >
                When Linkin Park’s Heavy Is The Crown erupted through the O2 Arena sound system, it wasn’t just esports. 
                It was an architectural masterclass in competitive drama.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#000000] text-[#FFFFFF] flex items-center justify-center font-mono text-xs font-black">
                  F
                </div>
                <div>
                  <div className="font-mono text-xs font-black uppercase tracking-wider text-[#000000]">
                    LEE 'FAKER' SANG-HYEOK
                  </div>
                  <div className="font-mono text-[10px] text-[#525252] uppercase">
                    5-TIME LEAGUE OF LEGENDS WORLD CHAMPION
                  </div>
                </div>
              </div>
            </div>

            {/* Quote 2 */}
            <div className="group border-b border-[#000000] pb-8 transition-all duration-100 hover:border-b-[3px]">
              <span className="font-serif text-7xl font-black leading-none text-[#000000] opacity-10 group-hover:opacity-40 transition-opacity duration-100 block -mb-6">
                “
              </span>
              <p 
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                className="text-xl sm:text-2xl italic font-normal text-[#000000] leading-relaxed mb-6"
              >
                The orchestral suite for Black Myth: Wukong proves that classical traditional instrumentation can hit 
                with the sheer percussive fury of a modern action score.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#000000] text-[#FFFFFF] flex items-center justify-center font-mono text-xs font-black">
                  Z
                </div>
                <div>
                  <div className="font-mono text-xs font-black uppercase tracking-wider text-[#000000]">
                    ZHENFEI ZHAO
                  </div>
                  <div className="font-mono text-[10px] text-[#525252] uppercase">
                    SYMPHONIC SCORE DIRECTOR // GAME SCIENCE
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. BOLD CHOICE #12: ELEVATED PRICING TIER (Tournament Passes)
      ========================================================================= */}
      <section id="tournament-passes" className="w-full py-20 sm:py-32 px-6 md:px-8 lg:px-12 border-b-4 border-[#000000] bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] font-black block mb-2">
              ACCREDITATION &amp; ENTRY
            </span>
            <h2 
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#000000]"
            >
              Tournament Access Tiers.
            </h2>
            <p 
              style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
              className="text-base text-[#525252] mt-3"
            >
              Verified spectator access, digital lossless archives, and commemorative hardware kits.
            </p>
          </div>

          {/* 3 Tier Grid with Center Tier Elevated */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
            
            {/* Tier 1: Standard Digital Access */}
            <div 
              style={{ borderRadius: '0px' }}
              className="group bg-[#FFFFFF] border-2 border-[#000000] p-8 flex flex-col justify-between transition-colors duration-100 hover:bg-[#000000] hover:text-[#FFFFFF]"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#525252] group-hover:text-neutral-400 block mb-2">
                  TIER 01 // AUDITOR
                </span>
                <h3 
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  className="text-2xl font-bold mb-4"
                >
                  Standard Arena Pass
                </h3>
                <div className="font-mono text-4xl font-black mb-6">
                  $24.00
                </div>
                <ul className="space-y-3 font-mono text-xs text-[#525252] group-hover:text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#000000] group-hover:text-[#FFFFFF]" />
                    <span>Lossless 24-Bit FLAC Audio Stream</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#000000] group-hover:text-[#FFFFFF]" />
                    <span>Digital Tournament Program PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#000000] group-hover:text-[#FFFFFF]" />
                    <span>Verified Fandom Vault Badge</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                style={{ borderRadius: '0px' }}
                className="w-full mt-8 py-3.5 bg-transparent border-2 border-[#000000] text-[#000000] group-hover:border-[#FFFFFF] group-hover:bg-[#FFFFFF] group-hover:text-[#000000] font-mono text-xs font-black uppercase tracking-widest cursor-pointer transition-colors duration-100"
              >
                CLAIM PASS
              </button>
            </div>

            {/* Tier 2: ELEVATED TIER (Highlighted Tier Extends Vertically on Desktop) */}
            <div 
              style={{ borderRadius: '0px' }}
              className="group bg-[#000000] text-[#FFFFFF] border-4 border-[#000000] p-8 lg:-mt-6 lg:mb-6 shadow-none flex flex-col justify-between transition-colors duration-100 relative z-20"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                    TIER 02 // RECOMMENDED
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-[#FFFFFF] text-[#000000] font-black uppercase">
                    MOST POPULAR
                  </span>
                </div>
                <h3 
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  className="text-3xl font-bold mb-4 text-[#FFFFFF]"
                >
                  Grand Final VIP Pass
                </h3>
                <div className="font-mono text-5xl font-black mb-6 text-[#FFFFFF]">
                  $78.00
                </div>
                <ul className="space-y-3.5 font-mono text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FFFFFF]" />
                    <span>Official Soundcheck Arena Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FFFFFF]" />
                    <span>RFID Acrylic Physical Collector Pass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FFFFFF]" />
                    <span>Exclusive Holographic Pass Lanyard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FFFFFF]" />
                    <span>Complete 4LP Digital Master Download</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                style={{ borderRadius: '0px' }}
                className="w-full mt-8 py-4 bg-[#FFFFFF] text-[#000000] hover:bg-[#000000] hover:text-[#FFFFFF] hover:border-[#FFFFFF] border-2 border-[#FFFFFF] font-mono text-xs font-black uppercase tracking-widest cursor-pointer transition-colors duration-100"
              >
                SECURE VIP PASS →
              </button>
            </div>

            {/* Tier 3: Collector Monolith */}
            <div 
              style={{ borderRadius: '0px' }}
              className="group bg-[#FFFFFF] border-2 border-[#000000] p-8 flex flex-col justify-between transition-colors duration-100 hover:bg-[#000000] hover:text-[#FFFFFF]"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#525252] group-hover:text-neutral-400 block mb-2">
                  TIER 03 // ARCHIVIST
                </span>
                <h3 
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  className="text-2xl font-bold mb-4"
                >
                  Collector Monolith Kit
                </h3>
                <div className="font-mono text-4xl font-black mb-6">
                  $145.00
                </div>
                <ul className="space-y-3 font-mono text-xs text-[#525252] group-hover:text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#000000] group-hover:text-[#FFFFFF]" />
                    <span>Everything in VIP Soundcheck Tier</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#000000] group-hover:text-[#FFFFFF]" />
                    <span>Serialized Metal Commemorative Coin</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#000000] group-hover:text-[#FFFFFF]" />
                    <span>180g Heavyweight Monochrome Vinyl LP</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                style={{ borderRadius: '0px' }}
                className="w-full mt-8 py-3.5 bg-transparent border-2 border-[#000000] text-[#000000] group-hover:border-[#FFFFFF] group-hover:bg-[#FFFFFF] group-hover:text-[#000000] font-mono text-xs font-black uppercase tracking-widest cursor-pointer transition-colors duration-100"
              >
                CLAIM PASS
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          6. BOLD CHOICE #14: BLOG/EDITORIAL ARTICLES (Image border thickens on hover)
      ========================================================================= */}
      <section id="editorial-drops" className="w-full py-20 sm:py-28 px-6 md:px-8 lg:px-12 border-b-4 border-[#000000] bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center justify-between mb-12 pb-4 border-b-2 border-[#000000]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#525252] font-black block mb-1">
                DISPATCHES &amp; ESSAYS
              </span>
              <h2 
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#000000]"
              >
                Editorial Dispatches.
              </h2>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs font-black text-[#525252] uppercase">
              READING TIME // 4 MIN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Article 1 */}
            <article className="group cursor-pointer">
              <div className="relative w-full aspect-[16/10] overflow-hidden border-2 border-[#000000] group-hover:border-[4px] transition-all duration-100 mb-4 bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
                  alt="Worlds 2024"
                  className="w-full h-full object-cover object-center grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#525252] block mb-1">
                ACOUSTIC ENGINEERING // ESSAY
              </span>
              <h3 
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                className="text-xl font-bold tracking-tight text-[#000000] group-hover:underline mb-2"
              >
                The Acoustic Geometry of the 2024 London O2 Arena Finals.
              </h3>
              <p 
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
                className="text-xs text-[#525252] leading-relaxed"
              >
                How sound designers calibrated 140 line-array subwoofers to ensure zero bleed into player headsets.
              </p>
            </article>

            {/* Article 2 */}
            <article className="group cursor-pointer">
              <div className="relative w-full aspect-[16/10] overflow-hidden border-2 border-[#000000] group-hover:border-[4px] transition-all duration-100 mb-4 bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80"
                  alt="Black Myth Wukong"
                  className="w-full h-full object-cover object-center grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#525252] block mb-1">
                FOLK MEETS SYMPHONY
              </span>
              <h3 
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                className="text-xl font-bold tracking-tight text-[#000000] group-hover:underline mb-2"
              >
                Orchestrating Wukong: Qinqiang Opera Meets Modern Western Brass.
              </h3>
              <p 
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
                className="text-xs text-[#525252] leading-relaxed"
              >
                Inside the studio sessions that recorded authentic northern Shaanxi folk vocalists in 4K resolution.
              </p>
            </article>

            {/* Article 3 */}
            <article className="group cursor-pointer">
              <div className="relative w-full aspect-[16/10] overflow-hidden border-2 border-[#000000] group-hover:border-[4px] transition-all duration-100 mb-4 bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80"
                  alt="Elden Ring Vinyl"
                  className="w-full h-full object-cover object-center grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#525252] block mb-1">
                ANALOG MASTERING
              </span>
              <h3 
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                className="text-xl font-bold tracking-tight text-[#000000] group-hover:underline mb-2"
              >
                Cutting Lacquer for the Elden Ring Shadow of the Erdtree Box.
              </h3>
              <p 
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
                className="text-xs text-[#525252] leading-relaxed"
              >
                Why FromSoftware insisted on half-speed analog mastering at Abbey Road Studios for maximum dynamic range.
              </p>
            </article>

          </div>

        </div>
      </section>

      {/* =========================================================================
          7. FINAL CALL-TO-ACTION (Minimalist Monochrome on #FFFFFF)
      ========================================================================= */}
      <section 
        className="w-full bg-[#FFFFFF] text-[#000000] py-24 sm:py-32 px-6 md:px-8 lg:px-12 border-b-4 border-[#000000] relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(#00000008 1px, transparent 1px), linear-gradient(90deg, #00000008 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252] font-black block mb-4">
            SUBSCRIPTION // DISPATCHES
          </span>

          <h2 
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-[#000000] uppercase leading-none mb-6"
          >
            Enter The Arena.
          </h2>

          <p 
            style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
            className="text-base sm:text-lg text-[#525252] max-w-xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Receive direct telegram notices of limited vinyl drops, tournament passes, and pro soundcheck accreditation.
          </p>

          {/* Minimalist Input Form (Bottom Border Only with 4px focus thickening) */}
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email"
              required
              placeholder="ENTER ARCHIVAL EMAIL..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              style={{ borderRadius: '0px' }}
              className="w-full bg-transparent border-b-2 border-[#000000] focus:border-b-[4px] focus:outline-none text-[#000000] placeholder:text-[#525252] placeholder:italic py-3.5 px-2 font-mono text-sm tracking-wider"
            />
            <button
              type="submit"
              style={{ borderRadius: '0px' }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#000000] text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#000000] border-2 border-[#000000] font-mono text-xs font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors duration-100"
            >
              ENLIST →
            </button>
          </form>

          {newsletterSuccess && (
            <p className="font-mono text-xs text-black font-bold mt-4 uppercase tracking-widest">
              ✓ Registered in the official dispatch registry.
            </p>
          )}

          <div className="mt-14 pt-8 border-t border-black flex items-center justify-center gap-6 font-mono text-[10px] text-[#525252] uppercase tracking-widest">
            <span>HANTEO VERIFIED</span>
            <span>•</span>
            <span>RIOT GAMES AUDITED</span>
            <span>•</span>
            <span>ABBEY ROAD MASTERED</span>
          </div>

        </div>
      </section>

    </div>
  );
};
