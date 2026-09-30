'use client';

import React, { useState, useMemo } from 'react';
import {
  Play,
  Search,
  ShoppingCart,
  Heart,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  X,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Tv,
  Flame,
  Star,
  Layers,
  Send,
  Pin,
  Zap,
  Clapperboard,
  Film,
  Volume2,
} from 'lucide-react';
import { Album } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

// ==========================================
// Soft Rounded Radius (matches Manga vibe, slightly rounded)
// ==========================================
const ROUND_SM = '10px';
const ROUND_MD = '14px';
const ROUND_LG = '18px';

// ==========================================
// Anime Color Palette (Acid Lime Neo-Brutalist)
// ==========================================
const COLORS = {
  lime: '#a3e635',
  limeDeep: '#84cc16',
  limeDark: '#65a30d',
  limeLight: '#ecfccb',
  limeBg: '#f7fee7',
  black: '#09090b',
  white: '#ffffff',
  accent: '#ff4d4d',
  neon: '#39ff14',
  paper: '#fdfbf7',
};

// ==========================================
// Anime Item Model
// ==========================================
export interface AnimeItem {
  id: string;
  title: string;
  format: string;
  studio: string;
  genre: 'Action' | 'Fantasy' | 'Mecha' | 'Slice of Life' | 'Horror' | 'Isekai';
  distributor: string;
  priceUSD: number;
  priceVND: number;
  originalPriceUSD?: number;
  rating: number;
  reviewCount: number;
  tag: string;
  coverImage: string;
  description: string;
  previewImages: string[];
  stock: number;
  episodes?: string;
}

// Curated Anime Catalog
const ANIME_CATALOG: AnimeItem[] = [
  {
    id: 'anime-demon-slayer-box',
    title: 'Demon Slayer: Infinity Castle Collector Box',
    format: 'Blu-ray 4K UHD Box Set',
    studio: 'ufotable',
    genre: 'Action',
    distributor: 'Aniplex / Shueisha',
    priceUSD: 89.99,
    priceVND: 2230000,
    originalPriceUSD: 109.99,
    rating: 4.98,
    reviewCount: 5200,
    tag: '★ GLOBAL BESTSELLER',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    description: 'Complete Infinity Castle Arc in 4K HDR10+ with Dolby Atmos audio. Includes exclusive Ufotable art booklet and character design cards.',
    previewImages: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 32,
    episodes: '26 Episodes + 2 OVA',
  },
  {
    id: 'anime-jjk-s2-steelbook',
    title: 'Jujutsu Kaisen S2: Shibuya Incident Steelbook',
    format: 'Steelbook Blu-ray',
    studio: 'MAPPA',
    genre: 'Action',
    distributor: 'Crunchyroll / Toho Animation',
    priceUSD: 64.99,
    priceVND: 1610000,
    originalPriceUSD: 79.99,
    rating: 4.95,
    reviewCount: 3900,
    tag: '⚡ SHIBUYA ARC',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    description: 'The devastating Shibuya Incident arc in stunning animation. Steelbook with holographic foil cover, director commentary, and key animation cels.',
    previewImages: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 28,
    episodes: '23 Episodes',
  },
  {
    id: 'anime-frieren-complete',
    title: 'Frieren: Beyond Journey\'s End Complete Series',
    format: 'Collector\'s Edition Blu-ray',
    studio: 'Madhouse',
    genre: 'Fantasy',
    distributor: 'Kadokawa / Shogakukan',
    priceUSD: 74.99,
    priceVND: 1860000,
    rating: 4.99,
    reviewCount: 4100,
    tag: '✨ CRITIC MASTERPIECE',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    description: 'The complete journey of elven mage Frieren, presented in a deluxe slipcase with sakuga animation booklet and Tsukasa Abe illustration gallery.',
    previewImages: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 22,
    episodes: '28 Episodes',
  },
  {
    id: 'anime-evangelion-ultimate',
    title: 'Neon Genesis Evangelion Ultimate Archive',
    format: 'Definitive Blu-ray Box',
    studio: 'Gainax / Studio Khara',
    genre: 'Mecha',
    distributor: 'King Records / GKIDS',
    priceUSD: 149.99,
    priceVND: 3720000,
    originalPriceUSD: 189.99,
    rating: 5.0,
    reviewCount: 6800,
    tag: '👑 LEGENDARY ARCHIVE',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    description: 'TV Series + End of Evangelion + Rebuild Tetralogy. 4K remastered with archival production documents and Anno commentary tracks.',
    previewImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 10,
    episodes: '26 EP + 5 Films',
  },
  {
    id: 'anime-solo-leveling-s1',
    title: 'Solo Leveling Season 1: Arise Edition',
    format: 'Limited Blu-ray + OST CD',
    studio: 'A-1 Pictures',
    genre: 'Isekai',
    distributor: 'Aniplex / Crunchyroll',
    priceUSD: 59.99,
    priceVND: 1490000,
    originalPriceUSD: 69.99,
    rating: 4.93,
    reviewCount: 2800,
    tag: '🔥 ARISE EDITION',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    description: 'Sung Jin-Woo awakens in mesmerizing A-1 Pictures animation. Includes Hiroyuki Sawano OST CD and dungeon concept art portfolio.',
    previewImages: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 40,
    episodes: '12 Episodes + Special',
  },
  {
    id: 'anime-chainsaw-man-s1',
    title: 'Chainsaw Man S1 Director\'s Cut',
    format: 'Director\'s Cut Steelbook',
    studio: 'MAPPA',
    genre: 'Horror',
    distributor: 'Crunchyroll / Shueisha',
    priceUSD: 69.99,
    priceVND: 1730000,
    rating: 4.96,
    reviewCount: 3300,
    tag: '✦ DIRECTOR\'S CUT',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    description: 'Extended Director\'s Cut with remastered audio, exclusive Ryu Nakayama storyboard booklet, and 8 collectible character art cards.',
    previewImages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 25,
    episodes: '12 Episodes + Extended',
  },
  {
    id: 'anime-spy-family-s2',
    title: 'Spy x Family Season 2 + Movie Bundle',
    format: 'Blu-ray Bundle',
    studio: 'WIT Studio x CloverWorks',
    genre: 'Slice of Life',
    distributor: 'Toho Animation',
    priceUSD: 54.99,
    priceVND: 1360000,
    originalPriceUSD: 64.99,
    rating: 4.91,
    reviewCount: 2400,
    tag: '🌸 FAMILY BUNDLE',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: 'Complete Season 2 and Code: White theatrical film. Includes Anya "Waku Waku" limited chibi figurine and poster set.',
    previewImages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 38,
    episodes: '25 EP + Film',
  },
  {
    id: 'anime-dandadan-vol1',
    title: 'Dandadan Volume 1 Collector Blu-ray',
    format: 'Collector Blu-ray',
    studio: 'Science SARU',
    genre: 'Action',
    distributor: 'Shueisha / Viz Media',
    priceUSD: 49.99,
    priceVND: 1240000,
    rating: 4.97,
    reviewCount: 1800,
    tag: '⚡ HYPER-DRIVE',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    description: 'Occult spirits meets alien invasion in Science SARU\'s kinetic sakuga. Includes storyboard replica and animation cel art print.',
    previewImages: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 30,
    episodes: '12 Episodes',
  },
  {
    id: 'anime-attack-on-titan-final',
    title: 'Attack on Titan The Final Season: Complete 4K Boxset',
    format: '4K Ultra HD Steelbook',
    studio: 'MAPPA',
    genre: 'Action',
    distributor: 'Pony Canyon / Crunchyroll',
    priceUSD: 94.99,
    priceVND: 2360000,
    originalPriceUSD: 119.99,
    rating: 4.99,
    reviewCount: 6980,
    tag: '👑 THE RUMBLING CLIMAX',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    description: 'The historic conclusion of humanity’s battle against Titans. 4K Dolby Vision HDR mastering with Hiroyuki Sawano & Kohta Yamamoto OST CD.',
    previewImages: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 15,
    episodes: 'Final Chapters Special 1 & 2',
  },
  {
    id: 'anime-bleach-tybw-part2',
    title: 'Bleach: Thousand-Year Blood War - The Separation',
    format: 'Limited Edition Blu-ray Box',
    studio: 'Studio Pierrot',
    genre: 'Action',
    distributor: 'Aniplex / Viz Media',
    priceUSD: 62.99,
    priceVND: 1560000,
    rating: 4.96,
    reviewCount: 3450,
    tag: '⚡ BANKAI SEPARATION',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    description: 'The Quincy blood warfare escalates with cinema-grade sakuga animation. Includes Senjumaru Bankai special fold-out tapestry and interview booklet.',
    previewImages: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 26,
    episodes: '13 Episodes + Uncut Scenes',
  },
  {
    id: 'anime-cyberpunk-edgerunners',
    title: 'Cyberpunk: Edgerunners Ultimate Collector Edition',
    format: '4K UHD + Vinyl Soundtrack',
    studio: 'Studio Trigger',
    genre: 'Action',
    distributor: 'CD Projekt Red / Netflix',
    priceUSD: 79.99,
    priceVND: 1980000,
    originalPriceUSD: 99.99,
    rating: 4.98,
    reviewCount: 5740,
    tag: '★ NIGHT CITY MASTERPIECE',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    description: 'David Martinez and Lucy battle across the neon ruins of Night City. Hiroyuki Imaishi signature kinetic direction packaged with yellow neon colored vinyl LP.',
    previewImages: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 20,
    episodes: '10 Episodes Complete',
  },
  {
    id: 'anime-one-piece-film-red',
    title: 'One Piece Film: RED Deluxe 4K Soundstage Edition',
    format: 'Deluxe 4K UHD + CD',
    studio: 'Toei Animation',
    genre: 'Action',
    distributor: 'Toei / Crunchyroll',
    priceUSD: 54.99,
    priceVND: 1360000,
    rating: 4.93,
    reviewCount: 4200,
    tag: '🎵 UTA LIVE CONCERT',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    description: 'Ado’s sensational vocal powerhouse brings Uta to life in dazzling 4K visuals. Includes concert replica lightstick and 7-track vocal album CD.',
    previewImages: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 35,
    episodes: '115 Min Feature + Concert Extras',
  },
  {
    id: 'anime-vinland-saga-s2',
    title: 'Vinland Saga Season 2: Slave Arc Master Edition',
    format: 'Collector Blu-ray Box',
    studio: 'MAPPA',
    genre: 'Action',
    distributor: 'Twin Engine / Crunchyroll',
    priceUSD: 72.00,
    priceVND: 1790000,
    rating: 4.99,
    reviewCount: 3120,
    tag: '✨ EMOTIONAL MASTERPIECE',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    description: 'Thorfinn’s spiritual rebirth on Ketil’s farm. Masterclass character acting animation, Shuhei Yabuta director commentary, and raw production storyboard binder.',
    previewImages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 18,
    episodes: '24 Episodes',
  },
  {
    id: 'anime-mob-psycho-100-grand',
    title: 'Mob Psycho 100 III: Grand Finale Sakuga Cut',
    format: 'Limited Steelbook',
    studio: 'Studio BONES',
    genre: 'Action',
    distributor: 'Warner Bros. Japan',
    priceUSD: 58.50,
    priceVND: 1450000,
    rating: 4.97,
    reviewCount: 2680,
    tag: '💥 SAKUGA APOTHEOSIS',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    description: 'The tearful and explosive conclusion of Mob’s coming-of-age story with 100% hand-drawn uncorrected sakuga flipbook by legendary animators.',
    previewImages: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 24,
    episodes: '12 Episodes',
  },
  {
    id: 'anime-haikyu-dumpster-battle',
    title: 'Haikyu!! The Dumpster Battle 4K IMAX Edition',
    format: '4K UHD + Artbook',
    studio: 'Production I.G',
    genre: 'Slice of Life',
    distributor: 'Toho Animation',
    priceUSD: 48.00,
    priceVND: 1190000,
    rating: 4.95,
    reviewCount: 4350,
    tag: '🏐 KARASUNO VS NEKOMA',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    description: 'The destined match at the Spring Tournament. First-person POV volleyball camera runs in blistering high frame-rate animation with Kenma keyframe booklet.',
    previewImages: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 30,
    episodes: '85 Min Theatrical IMAX Cut',
  },
];

// Helper to convert Anime item to Album format for cart
function animeToAlbum(item: AnimeItem): Album {
  return {
    id: item.id,
    title: `${item.title} (${item.format})`,
    artist: item.studio,
    artistId: item.studio.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    category: 'Anime',
    priceUSD: item.priceUSD,
    priceVND: item.priceVND,
    originalPriceUSD: item.originalPriceUSD,
    coverImage: item.coverImage,
    galleryImages: item.previewImages,
    type: 'Anime Collector Edition',
    releaseDate: '2025-03-01',
    tag: item.tag,
    rating: item.rating,
    reviewCount: item.reviewCount,
    popularityScore: 97,
    stock: item.stock,
    description: item.description,
    versions: [
      { id: `${item.id}-standard`, name: 'Standard Blu-ray', extraPriceUSD: 0 },
      { id: `${item.id}-deluxe`, name: 'Deluxe Edition (+Art Cards)', extraPriceUSD: 10.0 },
    ],
    inclusions: [
      'Full Series Blu-ray Disc Set',
      'Exclusive Animation Studio Art Booklet',
      'Collectible Character Cards',
      'Original Soundtrack Sampler CD',
    ],
    photocards: [
      { member: item.studio, image: item.coverImage },
    ],
    tracks: [
      { id: 1, title: 'Episode 01: Awakening', duration: '24m', isTitleTrack: true },
      { id: 2, title: 'Episode 02: The Rising Storm', duration: '24m', isTitleTrack: false },
      { id: 3, title: 'Episode 03: Clash of Titans', duration: '24m', isTitleTrack: true },
    ],
    reviews: [
      {
        id: `rev-${item.id}-1`,
        userName: 'AnimeCollector_HD',
        avatar: item.coverImage,
        rating: 5,
        comment: 'Stunning 4K transfer with incredible color grading. The art booklet alone is worth the price.',
        date: '2025-02-15',
        fandomTag: 'Anime Collector',
      },
    ],
  };
}

// Anime Seasonal Sakuga Spotlight Banners
export interface AnimeBanner {
  id: string;
  title: string;
  studio: string;
  badge: string;
  tag: string;
  desc: string;
  image: string;
  specs: string;
  targetId?: string;
}

const ANIME_SPOTLIGHT_BANNERS: AnimeBanner[] = [
  {
    id: 'ab-demonslayer',
    title: 'Demon Slayer: Infinity Castle Movie Trilogy',
    studio: 'ufotable (ユーフォーテーブル)',
    badge: '★ UFOTABLE SAKUGA MASTERPIECE',
    tag: 'THEATRICAL IMAX 4K HDR',
    desc: 'The Demon Slayer Corps plunges into the shifting depths of Muzan’s Infinity Castle. Groundbreaking 3D CGI architecture with hand-drawn sakuga animation.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=85',
    specs: '4K HDR10+ • Dolby Atmos 7.1',
    targetId: 'anime-demon-slayer-infinity-castle',
  },
  {
    id: 'ab-sololeveling',
    title: 'Solo Leveling: Arise - Shadow Monarch Unleashed',
    studio: 'A-1 Pictures',
    badge: '★ WORLDWIDE STREAMING PHENOMENON',
    tag: 'LIMITED STEELBOOK 4K EDITION',
    desc: 'Jinwoo ascends from the weakest hunter to the sovereign of shadows. Hiroyuki Sawano’s heart-pounding orchestral score in lossless master audio.',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&auto=format&fit=crop&q=85',
    specs: 'Hiroyuki Sawano OST Included',
    targetId: 'anime-solo-leveling-s1',
  },
  {
    id: 'ab-aot',
    title: 'Attack on Titan: The Final Chapters & 10-Year Memorial',
    studio: 'MAPPA',
    badge: '★ MAPPA DECADE COMMEMORATIVE',
    tag: 'COLLECTOR WOODEN VAULT BOX',
    desc: 'The Rumbling sweeps across the earth as Eren Yeager confronts his closest comrades. Comprehensive 128-page key animation frames and director interviews.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85',
    specs: 'Uncut Extended 145min Feature',
    targetId: 'anime-attack-on-titan-final',
  },
  {
    id: 'ab-frieren',
    title: 'Frieren: Beyond Journey’s End - Complete Archival Box',
    studio: 'Madhouse',
    badge: '★ MADHOUSE FANTASY CROWN',
    tag: 'AUTHENTIC SOUNDSCAPE EDITION',
    desc: 'The elf mage Frieren embarks on a nostalgic journey toward the resting place of souls. Stunning background art and peaceful pacing praised worldwide.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=85',
    specs: 'Evan Call 24-bit Lossless Score',
    targetId: 'anime-frieren-s1',
  },
];

export const AnimeNeoBrutalView: React.FC = () => {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice, setIsCartOpen } = useCartWishlist();

  // Filters & State
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewingAnime, setPreviewingAnime] = useState<AnimeItem | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  // Auto rotate banner every 6s
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % ANIME_SPOTLIGHT_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Community Notes Wall State
  const [communityNotes, setCommunityNotes] = useState([
    {
      id: 'an-1',
      author: 'TanjiroFan99',
      text: 'The Infinity Castle fight choreography is the best sakuga ever animated. Ufotable went BEYOND. 🔥',
      color: COLORS.limeLight,
      rotation: '-rotate-2',
      tag: 'Demon Slayer',
    },
    {
      id: 'an-2',
      author: 'SakugaEnjoyer',
      text: 'MAPPA\'s Shibuya Incident episode 17 broke the internet. The Domain Expansion sequence is pure art.',
      color: COLORS.white,
      rotation: 'rotate-1',
      tag: 'Jujutsu Kaisen',
    },
    {
      id: 'an-3',
      author: 'FrierenHealer',
      text: 'Frieren shows that the best anime doesn\'t need constant action. The pacing is therapeutic perfection. ☕',
      color: COLORS.limeLight,
      rotation: '-rotate-1',
      tag: 'Frieren',
    },
    {
      id: 'an-4',
      author: 'EvaUnit01',
      text: 'Evangelion Ultimate Archive packaging is museum-grade. The Anno commentary tracks are priceless. 🤖',
      color: COLORS.white,
      rotation: 'rotate-2',
      tag: 'Evangelion',
    },
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('');

  // Filtered Items
  const filteredAnime = useMemo(() => {
    return ANIME_CATALOG.filter((item) => {
      if (selectedGenre !== 'all' && item.genre !== selectedGenre) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inStudio = item.studio.toLowerCase().includes(q);
        const inDistributor = item.distributor.toLowerCase().includes(q);
        const inTag = item.tag.toLowerCase().includes(q);
        if (!inTitle && !inStudio && !inDistributor && !inTag) return false;
      }
      return true;
    });
  }, [selectedGenre, searchQuery]);

  // Handle Add to Cart
  const handleAddToCart = (item: AnimeItem) => {
    const album = animeToAlbum(item);
    addToCart(album, `${item.id}-standard`, 1);
    setAddedToast(item.title);
    setTimeout(() => setAddedToast(null), 3500);
  };

  // Handle Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote = {
      id: `an-${Date.now()}`,
      author: newNoteAuthor.trim() || 'Anonymous Otaku',
      text: newNoteText.trim(),
      color: COLORS.limeLight,
      rotation: Math.random() > 0.5 ? 'rotate-1' : '-rotate-2',
      tag: 'Community',
    };
    setCommunityNotes([newNote, ...communityNotes]);
    setNewNoteText('');
    setNewNoteAuthor('');
  };

  return (
    <div
      className="anime-neo-brutal-root w-full relative text-[#09090b] py-8 px-4 sm:px-6 md:px-8 overflow-hidden select-none"
      style={{
        backgroundColor: COLORS.limeBg,
        backgroundImage: `radial-gradient(${COLORS.limeDeep}22 1.5px, transparent 1.5px)`,
        backgroundSize: '24px 24px',
        fontFamily: "'Patrick Hand', cursive, sans-serif",
      }}
    >
      {/* Toast Notification */}
      {addedToast && (
        <div
          className="fixed bottom-6 right-6 z-50 p-4 flex items-center gap-3 animate-bounce"
          style={{
            borderRadius: ROUND_MD,
            backgroundColor: COLORS.lime,
            border: `3px solid ${COLORS.black}`,
            boxShadow: `4px 4px 0px ${COLORS.black}`,
          }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: COLORS.black, borderRadius: ROUND_SM }}
          >
            ✓
          </div>
          <div>
            <p className="text-xs uppercase font-bold" style={{ color: COLORS.black }}>Added to Cart!</p>
            <p className="font-bold text-sm" style={{ color: COLORS.black }}>{addedToast}</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 px-3 py-1 text-xs font-bold hover:opacity-80 transition-opacity cursor-pointer"
            style={{
              borderRadius: ROUND_SM,
              backgroundColor: COLORS.white,
              border: `2px solid ${COLORS.black}`,
              color: COLORS.black,
            }}
          >
            View Cart
          </button>
        </div>
      )}

      {/* Main Container - Widened to 1440px for spacious browsing */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-24 sm:gap-32">

        {/* =========================================================================
            1. HERO SECTION: ANIME ARCHIVE & SAKUGA VAULT
        ========================================================================= */}
        <section className="relative pt-6 pb-12">
          {/* Decorative Lime Strip */}
          <div
            className="absolute -top-2 left-12 w-24 h-2 z-20 pointer-events-none"
            style={{ backgroundColor: COLORS.lime, borderRadius: ROUND_SM }}
          />
          <div
            className="absolute -top-2 right-16 w-16 h-2 z-20 pointer-events-none"
            style={{ backgroundColor: COLORS.limeDeep, borderRadius: ROUND_SM }}
          />

          {/* Main Hero Container */}
          <div
            className="relative p-6 sm:p-10 md:p-12"
            style={{
              borderRadius: ROUND_LG,
              backgroundColor: COLORS.white,
              border: `3px solid ${COLORS.black}`,
              boxShadow: `8px 8px 0px ${COLORS.lime}`,
            }}
          >
            {/* Corner marks */}
            <div className="absolute top-3 left-3 text-xs font-mono opacity-20 pointer-events-none">
              ┌── ANIME.2025 ──┐
            </div>
            <div className="absolute bottom-3 right-3 text-xs font-mono opacity-20 pointer-events-none">
              └── 4K.SAKUGA ──┘
            </div>

            {/* Balanced 12-Column Responsive Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column (7 cols): Heading, Narrative, Actions & Studio Badges */}
              <div className="lg:col-span-7 space-y-5">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.lime,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `2px 2px 0px ${COLORS.black}`,
                  }}
                >
                  <Tv size={15} className="text-black" />
                  <span className="text-sm font-bold text-black tracking-wide">
                    OFFICIAL ANIME SAKUGA ARCHIVE
                  </span>
                </div>

                {/* Hero Title */}
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-black leading-none tracking-tight"
                  style={{ fontFamily: "'Kalam', cursive, sans-serif", color: COLORS.black }}
                >
                  Anime Collector Vault!
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg max-w-xl leading-relaxed" style={{ color: `${COLORS.black}cc` }}>
                  4K HDR Blu-ray steelbooks, limited edition box sets, original soundtracks, and exclusive
                  animation studio art booklets from MAPPA, ufotable, Madhouse &amp; A-1 Pictures.
                </p>

                {/* CTA Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#anime-catalog"
                    className="inline-flex items-center gap-2 px-6 py-3 font-bold text-base transition-all cursor-pointer hover:translate-y-[-2px]"
                    style={{
                      borderRadius: ROUND_SM,
                      backgroundColor: COLORS.lime,
                      border: `3px solid ${COLORS.black}`,
                      boxShadow: `4px 4px 0px ${COLORS.black}`,
                      color: COLORS.black,
                    }}
                  >
                    <span>EXPLORE CATALOG</span>
                    <ArrowRight size={18} strokeWidth={3} />
                  </a>

                  <a
                    href="#anime-community"
                    className="inline-flex items-center gap-2 px-5 py-3 font-bold text-base transition-all cursor-pointer hover:translate-y-[-2px]"
                    style={{
                      borderRadius: ROUND_SM,
                      backgroundColor: COLORS.white,
                      border: `3px solid ${COLORS.black}`,
                      boxShadow: `4px 4px 0px ${COLORS.limeDeep}`,
                      color: COLORS.black,
                    }}
                  >
                    <Zap size={16} />
                    <span>COMMUNITY WALL</span>
                  </a>
                </div>

                {/* Studio Quick Pills */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="text-black/60 uppercase mr-1">TOP STUDIOS:</span>
                  <span className="px-2.5 py-1 bg-[#ccff00] text-black border border-black font-bold" style={{ borderRadius: ROUND_SM }}>
                    🔥 ufotable
                  </span>
                  <span className="px-2.5 py-1 bg-white text-black border border-black font-bold" style={{ borderRadius: ROUND_SM }}>
                    ⚡ MAPPA
                  </span>
                  <span className="px-2.5 py-1 bg-[#e0f2fe] text-[#0369a1] border border-black font-bold" style={{ borderRadius: ROUND_SM }}>
                    ⚔️ Wit Studio
                  </span>
                  <span className="px-2.5 py-1 bg-[#fee2e2] text-[#991b1b] border border-black font-bold" style={{ borderRadius: ROUND_SM }}>
                    🌸 Kyoto Animation
                  </span>
                </div>

                {/* Trust Guarantees */}
                <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-bold border-t border-black/15" style={{ color: `${COLORS.black}bb` }}>
                  <span className="flex items-center gap-1 text-emerald-800">
                    <Check size={14} strokeWidth={3} /> 100% 4K HDR 10-Bit Master
                  </span>
                  <span className="flex items-center gap-1 text-sky-800">
                    <Check size={14} strokeWidth={3} /> Uncompressed Dolby Atmos 7.1.4
                  </span>
                  <span className="flex items-center gap-1 text-black">
                    <Check size={14} strokeWidth={3} /> Serialized Steelbook &amp; Art Booklet
                  </span>
                </div>
              </div>

              {/* Right Column (5 cols): Rich Featured Steelbook Spotlight Card */}
              <div className="lg:col-span-5">
                <div
                  className="p-5 relative overflow-hidden"
                  style={{
                    borderRadius: ROUND_MD,
                    backgroundColor: COLORS.limeLight,
                    border: `3.5px solid ${COLORS.black}`,
                    boxShadow: `6px 6px 0px ${COLORS.black}`,
                  }}
                >
                  {/* Lime accent strip */}
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-3 pointer-events-none"
                    style={{ backgroundColor: COLORS.lime, borderRadius: ROUND_SM }}
                  />

                  {/* Sound Burst Pill */}
                  <div
                    className="absolute -top-1 -right-1 px-3 py-1 bg-[#09090b] text-[#ccff00] font-black text-xs uppercase border-2 border-black rotate-3 shadow-[2px_2px_0px_#ccff00] z-20"
                    style={{ fontFamily: "'Bangers', 'Kalam', cursive", letterSpacing: '0.04em' }}
                  >
                    4K SAKUGA DROP
                  </div>

                  {/* Header bar */}
                  <div className="flex items-center justify-between pb-3 border-b-2 border-dashed" style={{ borderColor: COLORS.black }}>
                    <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5" style={{ color: COLORS.limeDark }}>
                      <Sparkles size={14} style={{ color: COLORS.accent }} />
                      ★ STEELBOOK OF THE WEEK
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-black text-white px-2 py-0.5" style={{ borderRadius: ROUND_SM }}>
                      4K UHD + OBI
                    </span>
                  </div>

                  {/* Showcase Body: Cover Image + Boxset Details */}
                  <div className="mt-4 flex gap-4">
                    {/* Steelbook Mockup Frame */}
                    <div 
                      className="w-32 shrink-0 bg-black border-2 border-black overflow-hidden shadow-[3px_3px_0px_#000] relative"
                      style={{ borderRadius: ROUND_SM }}
                    >
                      <div className="bg-[#ccff00] text-black text-[9px] font-mono font-black text-center py-0.5 uppercase border-b border-black">
                        UFOTABLE SAKUGA
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
                        alt="Demon Slayer Infinity Castle"
                        className="w-full h-40 object-cover"
                      />
                    </div>

                    {/* Metadata & Quick Action */}
                    <div className="flex-1 flex flex-col justify-between space-y-2 text-left">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-black/60 block">
                          UFOTABLE • HARUO SOTOZAKI
                        </span>
                        <h4 
                          className="font-bold text-base text-black leading-tight mt-0.5 line-clamp-2"
                          style={{ fontFamily: "'Kalam', cursive" }}
                        >
                          Demon Slayer: Infinity Castle 4K Steelbook
                        </h4>
                        <p className="text-xs text-black/80 mt-1">
                          3-Disc Collector Boxset (Dolby Vision &amp; Atmos)
                        </p>
                      </div>

                      <div className="pt-2 border-t border-black/20 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-black/60 font-mono block">STEELBOOK PRICE</span>
                          <span className="text-lg font-black text-black font-mono leading-none">
                            $48.00
                          </span>
                        </div>

                        <a
                          href="#anime-catalog"
                          className="px-3 py-1.5 bg-black hover:bg-[#ccff00] hover:text-black text-white text-xs font-bold uppercase transition-colors border border-black shadow-[2px_2px_0px_#000] inline-flex items-center gap-1"
                          style={{ borderRadius: ROUND_SM }}
                        >
                          <ShoppingCart size={13} />
                          <span>CLAIM BOX</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Speech Bubble */}
                  <div className="mt-4 p-2.5 bg-white border-2 border-black text-xs text-black leading-snug relative" style={{ borderRadius: ROUND_SM }}>
                    <p className="italic font-bold">
                      "Includes 120-page key animation layouts &amp; storyboards drawn by chief animation directors."
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Stats Counter */}
            <div className="mt-10 pt-6 border-t-2 border-dashed grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ borderColor: COLORS.black }}>
              {[
                { number: '200M+', label: 'Streams Worldwide', bg: COLORS.white },
                { number: '30+', label: 'Partner Studios', bg: COLORS.limeLight },
                { number: '4K HDR', label: 'Mastered Quality', bg: COLORS.white },
                { number: 'Dolby', label: 'Atmos Soundtrack', bg: COLORS.lime },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 text-center"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: stat.bg,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `3px 3px 0px ${COLORS.black}`,
                  }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ fontFamily: "'Kalam', cursive", color: COLORS.black }}
                  >
                    {stat.number}
                  </div>
                  <div className="text-xs font-bold uppercase" style={{ color: `${COLORS.black}aa` }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            FEATURED ANIME SAKUGA SPOTLIGHT BANNER CAROUSEL
        ========================================================================= */}
        <section className="relative">
          {/* Top Decorative Pills */}
          <div
            className="absolute -top-2.5 left-10 w-28 h-3 z-20 pointer-events-none"
            style={{ backgroundColor: COLORS.lime, borderRadius: ROUND_SM }}
          />
          <div
            className="absolute -top-2.5 right-12 w-20 h-3 z-20 pointer-events-none"
            style={{ backgroundColor: COLORS.limeDeep, borderRadius: ROUND_SM }}
          />

          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: ROUND_LG,
              backgroundColor: COLORS.white,
              border: `3px solid ${COLORS.black}`,
              boxShadow: `8px 8px 0px ${COLORS.lime}`,
            }}
          >
            {/* Banner Slide Container */}
            <div className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[460px] flex flex-col justify-end p-6 sm:p-10 md:p-12 overflow-hidden">
              {/* Background Art */}
              <img
                src={ANIME_SPOTLIGHT_BANNERS[currentBannerIdx].image}
                alt={ANIME_SPOTLIGHT_BANNERS[currentBannerIdx].title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15" />

              {/* Neo-brutalist Grid Overlay */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(${COLORS.lime} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.lime} 1px, transparent 1px)`,
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Banner Content Container */}
              <div className="relative z-10 max-w-3xl space-y-3.5 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-3 py-1 text-xs font-bold uppercase"
                    style={{
                      borderRadius: ROUND_SM,
                      backgroundColor: COLORS.lime,
                      border: `2px solid ${COLORS.black}`,
                      color: COLORS.black,
                      boxShadow: `2px 2px 0px ${COLORS.black}`,
                    }}
                  >
                    {ANIME_SPOTLIGHT_BANNERS[currentBannerIdx].badge}
                  </span>
                  <span
                    className="px-3 py-1 text-xs font-bold uppercase bg-white text-black"
                    style={{
                      borderRadius: ROUND_SM,
                      border: `2px solid ${COLORS.black}`,
                      boxShadow: `2px 2px 0px ${COLORS.black}`,
                    }}
                  >
                    {ANIME_SPOTLIGHT_BANNERS[currentBannerIdx].tag}
                  </span>
                  <span className="text-xs font-mono text-white/90 bg-black/70 px-2 py-0.5 border border-white/30">
                    {ANIME_SPOTLIGHT_BANNERS[currentBannerIdx].specs}
                  </span>
                </div>

                <h3
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md"
                  style={{ fontFamily: "'Kalam', cursive, sans-serif" }}
                >
                  {ANIME_SPOTLIGHT_BANNERS[currentBannerIdx].title}
                </h3>

                <p className="text-sm font-bold text-white/90">
                  Animation Studio: <span style={{ color: COLORS.lime }}>{ANIME_SPOTLIGHT_BANNERS[currentBannerIdx].studio}</span>
                </p>

                <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                  {ANIME_SPOTLIGHT_BANNERS[currentBannerIdx].desc}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#anime-catalog"
                    className="inline-flex items-center gap-2 px-6 py-2.5 font-bold text-sm transition-transform hover:translate-y-[-2px] cursor-pointer"
                    style={{
                      borderRadius: ROUND_SM,
                      backgroundColor: COLORS.lime,
                      border: `2px solid ${COLORS.black}`,
                      color: COLORS.black,
                      boxShadow: `3px 3px 0px ${COLORS.black}`,
                    }}
                  >
                    <span>BROWSE ANIME STEELBOOK</span>
                    <ArrowRight size={16} strokeWidth={3} />
                  </a>

                  <div className="text-xs font-mono text-white/70 bg-black/50 px-2.5 py-1 border border-white/20">
                    SAKUGA {currentBannerIdx + 1} / {ANIME_SPOTLIGHT_BANNERS.length}
                  </div>
                </div>
              </div>

              {/* Prev / Next Navigation Arrows */}
              <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentBannerIdx((prev) => (prev - 1 + ANIME_SPOTLIGHT_BANNERS.length) % ANIME_SPOTLIGHT_BANNERS.length)}
                  className="w-10 h-10 flex items-center justify-center font-bold transition-transform hover:translate-y-[-2px] cursor-pointer"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.white,
                    border: `2px solid ${COLORS.black}`,
                    color: COLORS.black,
                    boxShadow: `2px 2px 0px ${COLORS.black}`,
                  }}
                  title="Previous Banner"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentBannerIdx((prev) => (prev + 1) % ANIME_SPOTLIGHT_BANNERS.length)}
                  className="w-10 h-10 flex items-center justify-center font-bold transition-transform hover:translate-y-[-2px] cursor-pointer"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.lime,
                    border: `2px solid ${COLORS.black}`,
                    color: COLORS.black,
                    boxShadow: `2px 2px 0px ${COLORS.black}`,
                  }}
                  title="Next Banner"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Bottom Dot Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {ANIME_SPOTLIGHT_BANNERS.map((banner, idx) => (
                  <button
                    key={banner.id}
                    type="button"
                    onClick={() => setCurrentBannerIdx(idx)}
                    className="h-2.5 rounded-full border border-black transition-all cursor-pointer"
                    style={{
                      width: currentBannerIdx === idx ? '32px' : '10px',
                      backgroundColor: currentBannerIdx === idx ? COLORS.lime : 'rgba(255,255,255,0.6)',
                    }}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. INTERACTIVE FILTER DOCK & SEARCH
        ========================================================================= */}
        <section id="anime-catalog" className="flex flex-col gap-8 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div
                className="inline-block px-3 py-0.5 text-xs font-bold -rotate-1 mb-1"
                style={{
                  borderRadius: ROUND_SM,
                  backgroundColor: COLORS.lime,
                  border: `2px solid ${COLORS.black}`,
                  color: COLORS.black,
                }}
              >
                ANIME CATALOG
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ fontFamily: "'Kalam', cursive", color: COLORS.black }}
              >
                Curated Anime Collection
              </h2>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, studio, or arc..."
                className="w-full pl-10 pr-8 py-2.5 text-sm font-bold outline-none transition-all"
                style={{
                  borderRadius: ROUND_SM,
                  backgroundColor: COLORS.white,
                  border: `2px solid ${COLORS.black}`,
                  boxShadow: `3px 3px 0px ${COLORS.black}`,
                  color: COLORS.black,
                }}
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: `${COLORS.black}66` }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: COLORS.black }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Genre Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
            {[
              { id: 'all', label: '✦ All Anime' },
              { id: 'Action', label: '⚡ Action & Shonen' },
              { id: 'Fantasy', label: '🧙 Fantasy & Adventure' },
              { id: 'Mecha', label: '🤖 Mecha & Sci-Fi' },
              { id: 'Slice of Life', label: '🌸 Slice of Life' },
              { id: 'Horror', label: '👹 Horror & Dark' },
              { id: 'Isekai', label: '🌀 Isekai & Power' },
            ].map((tab) => {
              const isActive = selectedGenre === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGenre(tab.id)}
                  type="button"
                  className="px-4 py-2 text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: isActive ? COLORS.lime : COLORS.white,
                    color: COLORS.black,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: isActive ? `3px 3px 0px ${COLORS.black}` : `2px 2px 0px ${COLORS.black}`,
                    transform: isActive ? 'translate(-1px, -1px)' : 'none',
                  }}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div className="text-xs font-bold flex items-center justify-between" style={{ color: `${COLORS.black}88` }}>
            <span>Showing {filteredAnime.length} titles</span>
            <span
              className="underline cursor-pointer hover:opacity-70"
              style={{ color: COLORS.limeDark }}
              onClick={() => { setSelectedGenre('all'); setSearchQuery(''); }}
            >
              Reset Filters
            </span>
          </div>

          {/* =========================================================================
              3. ANIME CATALOG GRID
          ========================================================================= */}
          {filteredAnime.length === 0 ? (
            <div
              className="p-12 text-center space-y-3"
              style={{
                borderRadius: ROUND_MD,
                backgroundColor: COLORS.white,
                border: `2px dashed ${COLORS.black}`,
              }}
            >
              <Film size={40} className="mx-auto" style={{ color: `${COLORS.black}33` }} />
              <p className="font-bold text-xl" style={{ fontFamily: "'Kalam', cursive", color: COLORS.black }}>
                No anime titles match your search!
              </p>
              <button
                onClick={() => { setSelectedGenre('all'); setSearchQuery(''); }}
                className="px-4 py-2 font-bold cursor-pointer"
                style={{
                  borderRadius: ROUND_SM,
                  backgroundColor: COLORS.lime,
                  color: COLORS.black,
                  border: `2px solid ${COLORS.black}`,
                  boxShadow: `3px 3px 0px ${COLORS.black}`,
                }}
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredAnime.map((anime) => {
                const isFavorited = isWishlisted(anime.id);

                return (
                  <div
                    key={anime.id}
                    className="group relative flex flex-col justify-between transition-all hover:translate-y-[-4px]"
                    style={{
                      borderRadius: ROUND_MD,
                      backgroundColor: COLORS.white,
                      border: `2px solid ${COLORS.black}`,
                      padding: '20px',
                      boxShadow: `4px 4px 0px ${COLORS.lime}`,
                      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `6px 6px 0px ${COLORS.black}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0px ${COLORS.lime}`;
                    }}
                  >
                    {/* Card Top: Tag & Wishlist */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="px-2.5 py-0.5 text-xs font-bold"
                          style={{
                            borderRadius: ROUND_SM,
                            backgroundColor: COLORS.limeLight,
                            border: `1px solid ${COLORS.black}`,
                            color: COLORS.black,
                          }}
                        >
                          {anime.tag}
                        </span>

                        <button
                          onClick={() => toggleWishlist(animeToAlbum(anime))}
                          className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
                          style={{
                            borderRadius: '50%',
                            border: `2px solid ${COLORS.black}`,
                            backgroundColor: isFavorited ? COLORS.accent : COLORS.white,
                            color: isFavorited ? COLORS.white : COLORS.black,
                          }}
                          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <Heart size={14} fill={isFavorited ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Cover Image */}
                      <div
                        className="relative w-full h-64 overflow-hidden mb-4 cursor-pointer"
                        onClick={() => {
                          setPreviewingAnime(anime);
                          setActivePreviewIndex(0);
                        }}
                        style={{
                          borderRadius: ROUND_SM,
                          border: `2px solid ${COLORS.black}`,
                          backgroundColor: COLORS.limeBg,
                        }}
                      >
                        <img
                          src={anime.coverImage}
                          alt={anime.title}
                          className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5" />

                        {/* Preview indicator */}
                        <div
                          className="absolute bottom-2 right-2 px-2 py-1 text-xs font-bold flex items-center gap-1"
                          style={{
                            borderRadius: ROUND_SM,
                            backgroundColor: `${COLORS.white}f0`,
                            border: `1px solid ${COLORS.black}`,
                            boxShadow: `2px 2px 0px ${COLORS.black}`,
                          }}
                        >
                          <Eye size={12} />
                          <span>Preview</span>
                        </div>

                        {/* Format Ribbon */}
                        <div
                          className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold"
                          style={{
                            borderRadius: ROUND_SM,
                            backgroundColor: COLORS.lime,
                            border: `1px solid ${COLORS.black}`,
                            color: COLORS.black,
                          }}
                        >
                          {anime.format.split(' ')[0]}
                        </div>
                      </div>

                      {/* Title & Studio */}
                      <h3
                        className="text-xl font-bold line-clamp-1 group-hover:opacity-80 transition-opacity"
                        style={{ fontFamily: "'Kalam', cursive", color: COLORS.black }}
                      >
                        {anime.title}
                      </h3>
                      <p className="text-sm font-bold mb-1" style={{ color: COLORS.limeDark }}>
                        Studio: {anime.studio}
                      </p>
                      <p className="text-xs mb-1" style={{ color: `${COLORS.black}aa` }}>
                        {anime.distributor}
                      </p>
                      {anime.episodes && (
                        <p className="text-xs font-bold mb-2" style={{ color: `${COLORS.black}88` }}>
                          {anime.episodes}
                        </p>
                      )}

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 text-xs font-bold mb-3" style={{ color: `${COLORS.black}cc` }}>
                        <span className="font-black" style={{ color: COLORS.limeDark }}>★ {anime.rating.toFixed(1)}</span>
                        <span>({anime.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                    </div>

                    {/* Card Bottom: Price & Actions */}
                    <div className="pt-3 border-t border-dashed mt-2 space-y-3" style={{ borderColor: `${COLORS.black}66` }}>
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold" style={{ color: COLORS.black }}>
                            {formatPrice(anime.priceUSD, anime.priceVND)}
                          </span>
                          {anime.originalPriceUSD && (
                            <span className="text-xs line-through" style={{ color: `${COLORS.black}55` }}>
                              {formatPrice(anime.originalPriceUSD)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold uppercase" style={{ color: COLORS.limeDark }}>
                          {anime.genre}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewingAnime(anime);
                            setActivePreviewIndex(0);
                          }}
                          className="px-2 py-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer hover:translate-y-[-1px]"
                          style={{
                            borderRadius: ROUND_SM,
                            backgroundColor: COLORS.limeLight,
                            border: `2px solid ${COLORS.black}`,
                            boxShadow: `2px 2px 0px ${COLORS.black}`,
                            color: COLORS.black,
                          }}
                        >
                          <Play size={13} />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(anime)}
                          className="px-2 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer hover:translate-y-[-1px]"
                          style={{
                            borderRadius: ROUND_SM,
                            backgroundColor: COLORS.lime,
                            border: `2px solid ${COLORS.black}`,
                            boxShadow: `3px 3px 0px ${COLORS.black}`,
                            color: COLORS.black,
                          }}
                        >
                          <ShoppingCart size={13} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================================
            4. ANIMATION STUDIO SPOTLIGHT
        ========================================================================= */}
        <section className="relative my-24 sm:my-36">
          <div
            className="p-6 sm:p-8 md:p-10 relative"
            style={{
              borderRadius: ROUND_LG,
              backgroundColor: COLORS.limeLight,
              border: `3px solid ${COLORS.black}`,
              boxShadow: `6px 6px 0px ${COLORS.lime}`,
            }}
          >
            {/* Accent strip */}
            <div
              className="absolute -top-2 left-1/3 w-28 h-3"
              style={{ backgroundColor: COLORS.lime, borderRadius: ROUND_SM }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-3">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.white,
                    border: `2px solid ${COLORS.black}`,
                    color: COLORS.black,
                  }}
                >
                  <Clapperboard size={13} style={{ color: COLORS.limeDark }} />
                  <span>INSIDE THE ANIMATION STUDIO</span>
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ fontFamily: "'Kalam', cursive", color: COLORS.black }}
                >
                  The Art of Sakuga Animation
                </h3>

                {/* Quote Bubble */}
                <div
                  className="relative p-4 my-3"
                  style={{
                    borderRadius: ROUND_MD,
                    backgroundColor: COLORS.white,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `3px 3px 0px ${COLORS.black}`,
                  }}
                >
                  <p className="text-base italic" style={{ color: COLORS.black }}>
                    "Every frame of sakuga carries the animator's soul. Digital compositing preserves accuracy,
                    but hand-drawn key animation captures the raw emotion of movement."
                  </p>
                  <p className="text-xs font-bold mt-2" style={{ color: COLORS.limeDark }}>
                    — Key Animation Director, Studio Archive
                  </p>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: `${COLORS.black}cc` }}>
                  Every collector edition features studio-grade color timing, lossless DTS-HD Master Audio,
                  and exclusive production materials from Japan's leading animation studios.
                </p>
              </div>

              {/* Studio Stack */}
              <div className="space-y-3">
                {[
                  { studio: 'ufotable', desc: 'Unlimited Budget Works CGI' },
                  { studio: 'MAPPA', desc: 'Hyper-realistic action sakuga' },
                  { studio: 'Madhouse', desc: 'Cinematic masterclass pacing' },
                  { studio: 'A-1 Pictures', desc: 'Vivid fantasy world-building' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 text-xs font-bold"
                    style={{
                      borderRadius: ROUND_SM,
                      backgroundColor: COLORS.white,
                      border: `2px solid ${COLORS.black}`,
                      boxShadow: `2px 2px 0px ${COLORS.lime}`,
                    }}
                  >
                    <div style={{ color: COLORS.limeDark }}>{item.studio}</div>
                    <div className="font-normal" style={{ color: `${COLORS.black}aa` }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. COMMUNITY WALL (OTAKU BOARD)
        ========================================================================= */}
        <section id="anime-community" className="flex flex-col gap-12 sm:gap-16 my-24 sm:my-36">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div
              className="inline-block px-3 py-1 text-xs font-bold mb-1"
              style={{
                borderRadius: ROUND_SM,
                backgroundColor: COLORS.lime,
                border: `2px solid ${COLORS.black}`,
                color: COLORS.black,
              }}
            >
              OTAKU COMMUNITY BOARD
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "'Kalam', cursive", color: COLORS.black }}
            >
              Viewer Notes & Hot Takes
            </h2>
            <p className="text-base" style={{ color: `${COLORS.black}cc` }}>
              Share your sakuga moments, episode reactions, and collector thoughts with the community.
            </p>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-6">
            {communityNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 relative flex flex-col justify-between h-48"
                style={{
                  backgroundColor: note.color,
                  borderRadius: ROUND_SM,
                  border: `2px solid ${COLORS.black}`,
                  boxShadow: `4px 4px 0px ${COLORS.lime}`,
                }}
              >
                {/* Pin */}
                <div
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: COLORS.lime,
                    border: `1px solid ${COLORS.black}`,
                  }}
                />

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: COLORS.limeDark }}>
                    #{note.tag}
                  </span>
                  <p className="text-sm font-bold leading-snug" style={{ color: COLORS.black }}>
                    "{note.text}"
                  </p>
                </div>

                <div className="pt-2 border-t border-dashed flex items-center justify-between text-xs font-bold" style={{ borderColor: `${COLORS.black}44`, color: `${COLORS.black}aa` }}>
                  <span>@{note.author}</span>
                  <span>★</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Note Form - spaced cleanly with extra top margin */}
          <form
            onSubmit={handleAddNote}
            className="flex flex-col sm:flex-row items-center gap-4 mt-16 sm:mt-24"
            style={{
              borderRadius: ROUND_MD,
              backgroundColor: COLORS.white,
              border: `3px solid ${COLORS.black}`,
              boxShadow: `4px 4px 0px ${COLORS.lime}`,
              padding: '24px',
            }}
          >
            <input
              type="text"
              value={newNoteAuthor}
              onChange={(e) => setNewNoteAuthor(e.target.value)}
              placeholder="Your username..."
              className="w-full sm:w-44 px-3 py-2 text-sm font-bold outline-none"
              style={{
                borderRadius: ROUND_SM,
                border: `2px solid ${COLORS.black}`,
                color: COLORS.black,
              }}
            />
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Share your sakuga moment or anime hot take..."
              className="flex-1 w-full px-4 py-2 text-sm font-bold outline-none"
              style={{
                borderRadius: ROUND_SM,
                border: `2px solid ${COLORS.black}`,
                color: COLORS.black,
              }}
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer hover:translate-y-[-1px] transition-all"
              style={{
                borderRadius: ROUND_SM,
                backgroundColor: COLORS.lime,
                color: COLORS.black,
                border: `2px solid ${COLORS.black}`,
                boxShadow: `3px 3px 0px ${COLORS.black}`,
              }}
            >
              <Pin size={14} />
              <span>Pin Note</span>
            </button>
          </form>
        </section>

        {/* =========================================================================
            6. NEWSLETTER & PRE-ORDER ALERT
        ========================================================================= */}
        <section className="relative mt-28 sm:mt-40 mb-20 sm:mb-28 pt-8">
          {/* Accent strip */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-3 z-10"
            style={{ backgroundColor: COLORS.lime, borderRadius: ROUND_SM }}
          />

          <div
            className="p-8 sm:p-10 text-center space-y-4"
            style={{
              borderRadius: ROUND_LG,
              backgroundColor: COLORS.white,
              border: `3px dashed ${COLORS.black}`,
              boxShadow: `6px 6px 0px ${COLORS.lime}`,
            }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center mx-auto"
              style={{
                borderRadius: ROUND_SM,
                backgroundColor: COLORS.limeLight,
                border: `2px solid ${COLORS.black}`,
                color: COLORS.black,
              }}
            >
              <Bookmark size={24} />
            </div>

            <h3
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "'Kalam', cursive", color: COLORS.black }}
            >
              Never Miss an Anime Pre-Order Drop
            </h3>
            <p className="text-base max-w-md mx-auto" style={{ color: `${COLORS.black}cc` }}>
              Get weekly alerts for limited edition Blu-rays, steelbook restocks, and exclusive studio collaboration releases.
            </p>

            {newsletterSubscribed ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 font-bold text-sm"
                style={{
                  borderRadius: ROUND_SM,
                  backgroundColor: COLORS.limeLight,
                  border: `2px solid ${COLORS.black}`,
                  color: COLORS.black,
                }}
              >
                <Check size={16} style={{ color: COLORS.limeDark }} />
                <span>You are subscribed to the weekly anime drop alerts!</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail) setNewsletterSubscribed(true);
                }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email for anime drops..."
                  className="w-full px-4 py-3 text-sm font-bold outline-none"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.limeBg,
                    border: `2px solid ${COLORS.black}`,
                    color: COLORS.black,
                  }}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 font-bold text-sm cursor-pointer whitespace-nowrap hover:translate-y-[-1px] transition-all"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.lime,
                    color: COLORS.black,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `3px 3px 0px ${COLORS.black}`,
                  }}
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </section>

      </div>

      {/* =========================================================================
          7. PREVIEW MODAL
      ========================================================================= */}
      {previewingAnime && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
            style={{
              borderRadius: ROUND_MD,
              backgroundColor: COLORS.limeBg,
              border: `3px solid ${COLORS.black}`,
              padding: '24px',
              boxShadow: `8px 8px 0px ${COLORS.lime}`,
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed mb-4" style={{ borderColor: COLORS.black }}>
              <div>
                <span className="text-xs font-bold uppercase" style={{ color: COLORS.limeDark }}>
                  ANIME PREVIEW · {previewingAnime.format}
                </span>
                <h3
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Kalam', cursive", color: COLORS.black }}
                >
                  {previewingAnime.title}
                </h3>
              </div>

              <button
                onClick={() => setPreviewingAnime(null)}
                className="w-9 h-9 flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  borderRadius: '50%',
                  backgroundColor: COLORS.white,
                  border: `2px solid ${COLORS.black}`,
                  color: COLORS.black,
                }}
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto space-y-4">
              <div
                className="relative w-full h-[360px] sm:h-[420px] overflow-hidden flex items-center justify-center"
                style={{
                  borderRadius: ROUND_SM,
                  backgroundColor: '#000',
                  border: `2px solid ${COLORS.black}`,
                }}
              >
                <img
                  src={previewingAnime.previewImages[activePreviewIndex] || previewingAnime.coverImage}
                  alt={`Preview ${activePreviewIndex + 1}`}
                  className="w-full h-full object-contain"
                />

                {/* Carousel Controls */}
                {previewingAnime.previewImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePreviewIndex(prev => (prev - 1 + previewingAnime.previewImages.length) % previewingAnime.previewImages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer"
                      style={{
                        borderRadius: ROUND_SM,
                        backgroundColor: COLORS.white,
                        border: `2px solid ${COLORS.black}`,
                        boxShadow: `2px 2px 0px ${COLORS.black}`,
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setActivePreviewIndex(prev => (prev + 1) % previewingAnime.previewImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer"
                      style={{
                        borderRadius: ROUND_SM,
                        backgroundColor: COLORS.white,
                        border: `2px solid ${COLORS.black}`,
                        boxShadow: `2px 2px 0px ${COLORS.black}`,
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Page Indicator */}
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.white,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `2px 2px 0px ${COLORS.black}`,
                  }}
                >
                  Image {activePreviewIndex + 1} of {previewingAnime.previewImages.length}
                </div>
              </div>

              {/* Synopsis */}
              <div
                className="p-4"
                style={{
                  borderRadius: ROUND_SM,
                  backgroundColor: COLORS.white,
                  border: `2px solid ${COLORS.black}`,
                }}
              >
                <p className="text-xs uppercase font-bold mb-1" style={{ color: COLORS.limeDark }}>SYNOPSIS</p>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.black }}>
                  {previewingAnime.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t-2 border-dashed mt-4 flex items-center justify-between" style={{ borderColor: COLORS.black }}>
              <div className="text-xl font-bold" style={{ color: COLORS.black }}>
                {formatPrice(previewingAnime.priceUSD, previewingAnime.priceVND)}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewingAnime(null)}
                  className="px-4 py-2 text-sm font-bold cursor-pointer"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.limeLight,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `2px 2px 0px ${COLORS.black}`,
                    color: COLORS.black,
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(previewingAnime);
                    setPreviewingAnime(null);
                  }}
                  className="px-6 py-2 text-sm font-bold cursor-pointer flex items-center gap-2 transition-all hover:translate-y-[-1px]"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.lime,
                    color: COLORS.black,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `3px 3px 0px ${COLORS.black}`,
                  }}
                >
                  <ShoppingCart size={15} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
