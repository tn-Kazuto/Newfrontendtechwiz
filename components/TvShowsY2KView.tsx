'use client';

import React, { useState, useMemo } from 'react';
import {
  Tv,
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
  Star,
  Film,
  Calendar,
  Layers,
  Send,
  Clapperboard,
  Disc,
  Radio,
  Sliders,
  Flame,
  Zap,
  Info,
} from 'lucide-react';
import { Album } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

// =========================================================================
// K-POP Y2K NEO-BRUTALIST DESIGN TOKENS (Strictly identical to K-Pop DNA)
// =========================================================================
const KPOP = {
  pink: '#ff2e93',          // Hot Y2K Idol Pink
  pinkHover: '#ff007f',
  cyan: '#00f0ff',          // Electric Cyber Game Boy Cyan
  cyanLight: '#e0f7fa',
  yellow: '#ffd60a',        // Sunshine Star Yellow
  yellowLight: '#fff9c4',
  black: '#000000',
  white: '#ffffff',
  muted: '#f8f9fa',
  mutedDark: '#e9ecef',
  border: '#000000',
  radius: '0px',            // Strict 0px Rectangular Everywhere (as in K-Pop cards)
  shadowBlack: '4px 4px 0px #000000',
  shadowBlackSm: '2px 2px 0px #000000',
  shadowBlackLg: '6px 6px 0px #000000',
  shadowPink: '4px 4px 0px #ff2e93',
  shadowCyan: '4px 4px 0px #00f0ff',
  shadowYellow: '4px 4px 0px #ffd60a',
};

// =========================================================================
// TV SHOW ITEM MODEL (Boxsets, Vinyl OSTs, Photobooks & Inclusions)
// =========================================================================
export interface TvShowItem {
  id: string;
  catalogCode: string; // e.g. "TV-KD-01"
  title: string;
  originalTitle?: string; // Korean / Local title, e.g. "오징어 게임 2", "눈물의 여왕"
  networkOrPlatform: string; // "Netflix", "tvN / Studio Dragon", "HBO Max", etc.
  seasonText: string; // "Season 2 Complete", "Limited Series", "Complete Boxset"
  episodeCount: number;
  year: number;
  genre: 'K-Drama' | 'Sci-Fi & Fantasy' | 'Thriller' | 'Romance' | 'Prestige Drama';
  format: string; // "4K UHD Steelbook + Photocards", "Deluxe 2LP Vinyl OST + Photobook"
  priceUSD: number;
  priceVND: number;
  originalPriceUSD?: number;
  rating: number; // 4.95
  reviewCount: number;
  badge: string; // "★ GLOBAL PHENOMENON", "✦ BINGE WATCH DROP"
  coverImage: string;
  galleryImages: string[];
  cast: string[];
  director: string;
  synopsis: string;
  inclusions: string[]; // K-pop style inclusions: photocards, postcards, stickers, script excerpts
  ostTracks: { title: string; artist: string; duration: string }[];
  isPopular?: boolean;
  isNewRelease?: boolean;
}

// =========================================================================
// CURATED MASTER TV SHOWS & K-DRAMA CATALOG (8 High-Profile Series)
// =========================================================================
const TV_SHOWS_CATALOG: TvShowItem[] = [
  {
    id: 'tv-squid-game-s2',
    catalogCode: 'TV-KD-01',
    title: 'Squid Game: Season 2',
    originalTitle: '오징어 게임 2',
    networkOrPlatform: 'Netflix Original',
    seasonText: 'Season 2 Complete (9 Episodes)',
    episodeCount: 9,
    year: 2026,
    genre: 'Thriller',
    format: '4K UHD Collector Steelbook + VIP Invitation Set',
    priceUSD: 69.99,
    priceVND: 1750000,
    originalPriceUSD: 84.99,
    rating: 4.98,
    reviewCount: 9420,
    badge: '★ GLOBAL PHENOMENON // NO. 1 DROP',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=85',
    ],
    cast: ['Lee Jung-jae', 'Lee Byung-hun', 'Wi Ha-joon', 'Yim Si-wan', 'Kang Ha-neul', 'Park Sung-hoon'],
    director: 'Hwang Dong-hyuk',
    synopsis: 'Three years after winning the deadly Squid Game, Player 456 Gi-hun abandons his journey to the US and dives headfirst into the island labyrinth once again to shut down the VIP syndicate from within.',
    inclusions: [
      'Gold Foil Embossed VIP Invitation Card (Numbered 001 - 456)',
      'Front Man Metallic Chrome Mask Pin Badge',
      'Player Green Tracksuit Cast Photocard Pack (6ea)',
      'Behind-the-Scenes Production Art Book (88 Pages)',
      'Game Ddakji Mini Game Replica Set',
    ],
    ostTracks: [
      { title: 'Pink Soldiers Theme (Jung Jae-il Orchestral)', artist: 'Jung Jae-il', duration: '3:45' },
      { title: 'Way Back then (Carnival Remix)', artist: 'Jung Jae-il', duration: '2:58' },
      { title: 'Circle, Triangle, Square', artist: 'Seoul Philharmonic', duration: '4:12' },
    ],
    isPopular: true,
    isNewRelease: true,
  },
  {
    id: 'tv-queen-of-tears',
    catalogCode: 'TV-KD-02',
    title: 'Queen of Tears',
    originalTitle: '눈물의 여왕',
    networkOrPlatform: 'tvN & Studio Dragon',
    seasonText: '16 Episodes Complete Series',
    episodeCount: 16,
    year: 2024,
    genre: 'K-Drama',
    format: 'Deluxe 2LP Vinyl OST + Baek-Hong Wedding Photobook',
    priceUSD: 58.00,
    priceVND: 1450000,
    originalPriceUSD: 69.00,
    rating: 4.97,
    reviewCount: 8200,
    badge: '✦ 24.9% PEAK RATING RECORD',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85',
    ],
    cast: ['Kim Soo-hyun', 'Kim Ji-won', 'Park Sung-hoon', 'Kwak Dong-yeon', 'Lee Joo-bin'],
    director: 'Jang Young-woo & Kim Hee-won (Written by Park Ji-eun)',
    synopsis: 'Queens Group department store queen Hong Hae-in and Yongduri village pride lawyer Baek Hyun-woo navigate a dizzying crisis and miraculous rekindling of love three years into a turbulent high-society marriage.',
    inclusions: [
      '128-Page Wedding Photo Album & German Honeymoon Photobook',
      'Kim Soo-hyun & Kim Ji-won Dual Holographic Photocards (4ea)',
      'Clover Lucky Leaf Bookmark & Queens Department VIP Pass',
      'Full Script Excerpt of Episode 16 with Director Notes',
      '4-Cut Yongduri Romantic Photo Booth Strip',
    ],
    ostTracks: [
      { title: 'The Reasons of My Smiles', artist: 'BSS (SEVENTEEN)', duration: '3:32' },
      { title: 'Hold Me Back', artist: 'Heize', duration: '3:50' },
      { title: 'Way Home (청혼)', artist: 'Kim Soo-hyun', duration: '4:18' },
    ],
    isPopular: true,
  },
  {
    id: 'tv-arcane-s2',
    catalogCode: 'TV-KD-03',
    title: 'Arcane: Season 2',
    originalTitle: 'League of Legends: Arcane',
    networkOrPlatform: 'Riot Games & Netflix',
    seasonText: '3 Acts / 9 Episodes Complete',
    episodeCount: 9,
    year: 2026,
    genre: 'Sci-Fi & Fantasy',
    format: 'Deluxe Shimmer-Purple 2LP Soundtrack + Zaun Crest Pin',
    priceUSD: 74.00,
    priceVND: 1850000,
    originalPriceUSD: 89.00,
    rating: 4.99,
    reviewCount: 11200,
    badge: '⚡ EMMY WINNER MASTERWORK',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=85',
    ],
    cast: ['Hailee Steinfeld (Vi)', 'Ella Purnell (Jinx)', 'Katie Leung (Caitlyn)', 'Reed Shannon (Ekko)'],
    director: 'Christian Linke & Alex Yee (Fortiche Studio)',
    synopsis: 'The climactic war between Piltover and Zaun explodes. As hextech and shimmer collide, sisters Vi and Jinx find themselves on opposing frontlines of an ideological tragedy that will reshape Runeterra forever.',
    inclusions: [
      'Heavyweight 180g Shimmer-Purple Translucent 2LP Gatefold Vinyl',
      'Jinx Graffiti Spray-Paint Stencil & Hextech Blueprint Poster',
      'Piltover Enforcers & Firelight Foil Card Set (4ea)',
      'Fortiche Studio 64-Page Concept & Keyframe Monograph',
      'Solid Enamel Zaun Undercity Crest Lapel Pin',
    ],
    ostTracks: [
      { title: 'Enemy', artist: 'Imagine Dragons x JID', duration: '2:53' },
      { title: 'What Could Have Been', artist: 'Sting x Ray Chen', duration: '3:33' },
      { title: 'Heavy Is the Crown', artist: 'Linkin Park', duration: '3:12' },
    ],
    isPopular: true,
    isNewRelease: true,
  },
  {
    id: 'tv-crash-landing-on-you',
    catalogCode: 'TV-KD-04',
    title: 'Crash Landing on You',
    originalTitle: '사랑의 불시착',
    networkOrPlatform: 'tvN & Studio Dragon',
    seasonText: '5th Anniversary Collector Edition (16 Eps)',
    episodeCount: 16,
    year: 2025,
    genre: 'Romance',
    format: 'Wooden Music Box Boxset + Swiss Alps Scenic Monograph',
    priceUSD: 79.99,
    priceVND: 1990000,
    originalPriceUSD: 95.00,
    rating: 4.96,
    reviewCount: 15400,
    badge: '★ ALL-TIME K-DRAMA CLASSIC',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop&q=85',
    ],
    cast: ['Hyun Bin', 'Son Ye-jin', 'Seo Ji-hye', 'Kim Jung-hyun'],
    director: 'Lee Jung-hyo',
    synopsis: 'A paragliding mishap drops South Korean chaebol heiress Yoon Se-ri into North Korea, straight into the protective arms of Captain Ri Jeong-hyeok. A secret border romance of unparalleled devotion unfolds.',
    inclusions: [
      'Functional Hand-Cranked Wooden Music Box (Plays "Song for Brother")',
      'Swiss Iseltwald Lake & Pyongyang Village Double-Sided Map Poster',
      'Hyun Bin & Son Ye-jin Authentic Film Photocard Pack (5ea)',
      'Tomato Cultivator Club Mini Plant Seed Packet & Bookmark',
      '144-Page High-Gloss Archival Behind-the-Scenes Photobook',
    ],
    ostTracks: [
      { title: 'Here I Am Again', artist: 'Yerin Baek', duration: '3:55' },
      { title: 'Flower', artist: 'Yoon Mi-rae', duration: '4:15' },
      { title: 'Give You My Heart', artist: 'IU (아이유)', duration: '4:41' },
    ],
    isPopular: true,
  },
  {
    id: 'tv-stranger-things-s5',
    catalogCode: 'TV-KD-05',
    title: 'Stranger Things: Season 5',
    originalTitle: 'The Final Season',
    networkOrPlatform: 'Netflix Original',
    seasonText: '8 Feature-Length Finale Episodes',
    episodeCount: 8,
    year: 2026,
    genre: 'Sci-Fi & Fantasy',
    format: 'Hawkins 1986 Retro VHS-Box 4K UHD + D&D Campaign',
    priceUSD: 72.00,
    priceVND: 1800000,
    originalPriceUSD: 85.00,
    rating: 4.95,
    reviewCount: 7800,
    badge: '⚡ THE EPIC HAWKINS FINALE',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=85',
    ],
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour', 'Winona Ryder', 'Sadie Sink', 'Joe Keery'],
    director: 'The Duffer Brothers',
    synopsis: 'The barrier between Hawkins and the Upside Down has fractured completely. Eleven and the party gather for one last desperate stand against Vecna to save their town and reality from eternal nightmare.',
    inclusions: [
      'Vintage Distressed VHS Big-Box Packaging with 4K UHD Discs',
      'Hellfire Club Embroidered Iron-On Patch & 20-Sided Die (D20)',
      'Hawkins Lab Classified Demogorgon Autopsy Dossier',
      'Cast Polaroid Snapshots Photocard Set (6ea)',
      'Retro Cassette Tape with 80s Synthwav Soundtrack',
    ],
    ostTracks: [
      { title: 'Running Up That Hill (Hawkins Remix)', artist: 'Kate Bush', duration: '4:58' },
      { title: 'Separate Ways (Worlds Apart)', artist: 'Journey x Bryce Miller', duration: '3:20' },
      { title: 'Stranger Things Theme', artist: 'Kyle Dixon & Michael Stein', duration: '2:10' },
    ],
    isPopular: true,
    isNewRelease: true,
  },
  {
    id: 'tv-the-glory',
    catalogCode: 'TV-KD-06',
    title: 'The Glory',
    originalTitle: '더 글로리',
    networkOrPlatform: 'Netflix Original',
    seasonText: 'Part 1 & 2 Complete (16 Episodes)',
    episodeCount: 16,
    year: 2024,
    genre: 'K-Drama',
    format: 'Script Book Deluxe Boxset + Mini Go Board Collector Edition',
    priceUSD: 54.00,
    priceVND: 1350000,
    originalPriceUSD: 65.00,
    rating: 4.96,
    reviewCount: 6900,
    badge: '✦ BAEKSANG GRAND PRIZE WINNER',
    coverImage: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=1200&auto=format&fit=crop&q=85',
    ],
    cast: ['Song Hye-kyo', 'Lee Do-hyun', 'Lim Ji-yeon', 'Yeom Hye-ran', 'Park Sung-hoon'],
    director: 'Ahn Gil-ho (Written by Kim Eun-sook)',
    synopsis: 'Decades after surviving horrific high school bullying, Moon Dong-eun puts into motion an immaculate, mathematically chilling revenge scheme against her tormentors and the bystanders who looked away.',
    inclusions: [
      'Complete Two-Volume Screenplay Script Books with Author Signature Print',
      'Miniature Wooden Baduk (Go) Travel Board with Black & White Stones',
      'Song Hye-kyo "Moon Dong-eun" Monochrome Photocard Set (4ea)',
      'Semyung Elementary School Teacher ID Badge Replica',
      'Morning Glory Blue Flower Bookmark',
    ],
    ostTracks: [
      { title: 'Until The End', artist: 'Kelley McRae', duration: '3:40' },
      { title: 'A Shine on You', artist: 'Kim Ye-ji', duration: '3:15' },
      { title: 'The Glory Main Theme', artist: 'Kim Joon-seok', duration: '2:50' },
    ],
    isPopular: false,
  },
  {
    id: 'tv-succession',
    catalogCode: 'TV-KD-07',
    title: 'Succession: The Complete Series',
    originalTitle: 'Waystar Royco Legacy',
    networkOrPlatform: 'HBO Max Prestige',
    seasonText: 'Seasons 1-4 Complete (39 Episodes)',
    episodeCount: 39,
    year: 2024,
    genre: 'Prestige Drama',
    format: 'Waystar Royco Monogram Slipcase + Nicholas Britell 4LP Score',
    priceUSD: 99.99,
    priceVND: 2490000,
    originalPriceUSD: 119.00,
    rating: 4.99,
    reviewCount: 8900,
    badge: '★ 19 EMMY AWARDS // PEAK TV',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=85',
    ],
    cast: ['Brian Cox', 'Jeremy Strong', 'Sarah Snook', 'Kieran Culkin', 'Matthew Macfadyen', 'Nicholas Braun'],
    director: 'Jesse Armstrong (HBO)',
    synopsis: 'When aging media patriarch Logan Roy contemplates retirement, his four adult children descend into savage, Shakespearean corporate warfare to seize the crown of Waystar Royco.',
    inclusions: [
      'Waystar Royco Executive Embossed Leatherette Slipcase Box',
      'Nicholas Britell Piano & Hip-Hop Strings 4LP Heavyweight Vinyl',
      'Roy Siblings Boardroom Pass & Helicopter Flight Manifest Dossier',
      'Logan Roy "You Are Not Serious People" Gold Foil Quote Card',
      'ATN News Official Reporter Press Pass & Lanyard',
    ],
    ostTracks: [
      { title: 'Succession (Main Title Theme)', artist: 'Nicholas Britell', duration: '1:42' },
      { title: 'Andante Risoluto', artist: 'Nicholas Britell', duration: '2:30' },
      { title: 'L to the OG', artist: 'Nicholas Britell x Kendall Roy', duration: '2:15' },
    ],
    isPopular: true,
  },
  {
    id: 'tv-lovely-runner',
    catalogCode: 'TV-KD-08',
    title: 'Lovely Runner',
    originalTitle: '선재 업고 튀어',
    networkOrPlatform: 'tvN & CJ ENM',
    seasonText: '16 Episodes Complete (Director Cut)',
    episodeCount: 16,
    year: 2024,
    genre: 'K-Drama',
    format: 'ECLIPSE Concert CD + Sun-jae Hologram Photocards',
    priceUSD: 52.00,
    priceVND: 1300000,
    originalPriceUSD: 62.00,
    rating: 4.98,
    reviewCount: 9800,
    badge: '✦ GLOBAL SYNDROME HIT // SOLD OUT',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=85',
    ],
    cast: ['Byeon Woo-seok (Ryu Sun-jae)', 'Kim Hye-yoon (Im Sol)', 'Song Geon-hee', 'Lee Seung-hyub'],
    director: 'Yoon Jong-ho & Kim Tae-yeop',
    synopsis: 'Devastated by the sudden death of top idol Ryu Sun-jae, passionate fan Im Sol miraculously slips 15 years back in time to 2008 to protect her beloved star before fate strikes.',
    inclusions: [
      'ECLIPSE Band Official Concert Digipack CD with Live Bonus Tracks',
      'Byeon Woo-seok & Kim Hye-yoon Time-Slip Hologram Cards (5ea)',
      'High School Swimming Team Yellow Umbrella Keychain',
      'Im Sol Cassette Tape MP3 Player Replica Tin Case',
      '96-Page Romantic 2008 Retro Nostalgia Photobook',
    ],
    ostTracks: [
      { title: 'Sudden Shower (소나기)', artist: 'ECLIPSE (Byeon Woo-seok)', duration: '3:53' },
      { title: 'Run Run', artist: 'ECLIPSE', duration: '3:20' },
      { title: 'Spring Snow (봄눈)', artist: '10CM', duration: '3:39' },
    ],
    isPopular: true,
  },
];

// Fan theories & Binge community dispatches
interface TvTheoryDispatch {
  id: string;
  series: string;
  author: string;
  tag: string;
  timestamp: string;
  title: string;
  content: string;
  likes: number;
}

const INITIAL_THEORIES: TvTheoryDispatch[] = [
  {
    id: 'th-1',
    series: 'Squid Game S2',
    author: 'Player456Fan',
    tag: '⚡ VIP CONSPIRACY',
    timestamp: '12 MIN AGO',
    title: 'Gi-hun’s red hair in the S1 finale was foreshadowing the undercover guard infiltration!',
    content: 'Notice how in the Season 2 teaser Gi-hun wears the pink soldier uniform? He’s not playing the games to survive — he memorized the camera blind spots from the previous games and is disabling the master servers!',
    likes: 342,
  },
  {
    id: 'th-2',
    series: 'Queen of Tears',
    author: 'BaekHongEndgame',
    tag: '★ WEDDING LORE',
    timestamp: '38 MIN AGO',
    title: 'The German clover meadow was recorded on 35mm film stock for the emotional flashbacks',
    content: 'Director Kim Hee-won confirmed in the audio commentary that all scenes in Germany used custom vintage anamorphic glass to represent Hae-in’s subjective memories of pure happiness before the corporate takeover.',
    likes: 218,
  },
  {
    id: 'th-3',
    series: 'Arcane S2',
    author: 'ZaunUnderground',
    tag: '✦ SHIMMER ANALYSIS',
    timestamp: '2 HOURS AGO',
    title: 'The sound design of Jinx’s minigun in Act 3 is tuned to the exact pitch of Vi’s hextech gauntlets',
    content: 'Christian Linke’s soundtrack layering literally plays the two motifs in counterpoint during the final confrontation. It’s an auditory mirror of their childhood connection torn apart by war.',
    likes: 476,
  },
];

// Helper to convert TvShowItem into universal Album format for cart / wishlist
export const tvShowToAlbum = (show: TvShowItem): Album => ({
  id: show.id,
  title: show.title,
  artist: show.networkOrPlatform,
  artistId: show.networkOrPlatform.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  category: 'K-Pop',
  priceUSD: show.priceUSD,
  priceVND: show.priceVND,
  originalPriceUSD: show.originalPriceUSD,
  coverImage: show.coverImage,
  galleryImages: show.galleryImages,
  type: 'Collector Box',
  releaseDate: `${show.year}-01-01`,
  tag: show.badge,
  rating: show.rating,
  reviewCount: show.reviewCount,
  popularityScore: 98,
  stock: 45,
  description: `${show.synopsis} | Includes: ${show.inclusions.slice(0, 3).join(', ')}`,
  versions: [
    { id: `${show.id}-std`, name: show.format, extraPriceUSD: 0 },
  ],
  inclusions: show.inclusions,
  photocards: show.cast.slice(0, 4).map((c) => ({
    member: c,
    image: show.coverImage,
  })),
  tracks: show.ostTracks.map((t, idx) => ({
    id: idx + 1,
    title: t.title,
    duration: t.duration,
    isTitleTrack: idx === 0,
  })),
  reviews: [],
});

export const TvShowsY2KView: React.FC = () => {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice } = useCartWishlist();

  // State
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShowForModal, setSelectedShowForModal] = useState<TvShowItem | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'synopsis' | 'inclusions' | 'soundtrack'>('inclusions');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fan theories state
  const [theories, setTheories] = useState<TvTheoryDispatch[]>(INITIAL_THEORIES);
  const [newSeriesName, setNewSeriesName] = useState('Squid Game S2');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Filter items
  const filteredShows = useMemo(() => {
    return TV_SHOWS_CATALOG.filter((item) => {
      // Filter by category
      if (activeFilter === 'kdrama' && item.genre !== 'K-Drama' && item.genre !== 'Romance') return false;
      if (activeFilter === 'prestige' && item.genre !== 'Prestige Drama') return false;
      if (activeFilter === 'scifi' && item.genre !== 'Sci-Fi & Fantasy' && item.genre !== 'Thriller') return false;
      if (activeFilter === 'bestseller' && !item.isPopular) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchOrig = item.originalTitle?.toLowerCase().includes(query);
        const matchCast = item.cast.some((c) => c.toLowerCase().includes(query));
        const matchNet = item.networkOrPlatform.toLowerCase().includes(query);
        if (!matchTitle && !matchOrig && !matchCast && !matchNet) return false;
      }
      return true;
    });
  }, [activeFilter, searchQuery]);

  // Handle Share / Copy Link
  const handleShare = (show: TvShowItem) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/?category=tv&show=${show.id}`);
      setCopiedId(show.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Submit theory
  const handlePostTheory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newTitle.trim() || !newContent.trim()) return;

    const newDispatch: TvTheoryDispatch = {
      id: `th-${Date.now()}`,
      series: newSeriesName,
      author: newAuthor.trim(),
      tag: '★ COMMUNITY THEORY',
      timestamp: 'JUST NOW',
      title: newTitle.trim(),
      content: newContent.trim(),
      likes: 1,
    };

    setTheories([newDispatch, ...theories]);
    setNewAuthor('');
    setNewTitle('');
    setNewContent('');
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 3000);
  };

  const handleLikeTheory = (id: string) => {
    setTheories((prev) =>
      prev.map((t) => (t.id === id ? { ...t, likes: t.likes + 1 } : t))
    );
  };

  return (
    <div className="w-full bg-[#f8f9fa] text-black font-sans pb-24 selection:bg-[#ff2e93] selection:text-white">

      {/* =========================================================================
          1. Y2K MARQUEE TICKER TAPE (HOT PINK & SUNSHINE YELLOW)
      ========================================================================= */}
      <div className="w-full overflow-hidden border-y-4 border-black py-3 bg-[#ff2e93] text-white font-mono text-xs sm:text-sm font-black tracking-widest uppercase select-none shadow-[0px_4px_0px_#000000]">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="flex items-center gap-2">
                <span className="text-[#ffd60a]">★</span>
                <span>BINGE NIGHT TV SHOWS & K-DRAMA UNIVERSE // OFFICIAL ARCHIVE</span>
              </span>
              <span className="text-[#00f0ff]">◆◆◆</span>
              <span className="flex items-center gap-2">
                <span className="text-[#ffd60a]">⚡</span>
                <span>SQUID GAME S2 • QUEEN OF TEARS • ARCANE S2 • STRANGER THINGS</span>
              </span>
              <span className="text-[#ffd60a]">◆◆◆</span>
              <span className="flex items-center gap-2">
                <span className="text-[#00f0ff]">✦</span>
                <span>AUTHENTIC PHOTOCARD PACKS & DELUXE VINYL SOUNDTRACK BOXSETS</span>
              </span>
              <span className="text-[#ffffff]">◆◆◆</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-10 space-y-24 sm:space-y-32">

        {/* =========================================================================
            2. HERO SPOTLIGHT // RETRO TV BROADCAST GAME BOY STYLE
        ========================================================================= */}
        <section className="relative w-full border-4 border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_#000000] overflow-hidden">
          {/* Subtle Halftone Dot / Pixel Matrix Texture Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column (7 cols): Editorial Headlines & Y2K Badges */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badges Bar */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap font-mono">
                <span className="px-3.5 py-1.5 bg-[#ff2e93] text-white border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Radio size={14} className="animate-pulse" />
                  <span>ON AIR // BINGE STREAMING 2026</span>
                </span>
                <span className="px-3 py-1.5 bg-[#00f0ff] text-black border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-black uppercase tracking-wider">
                  <span>★ K-DRAMA & PRESTIGE TV VAULT</span>
                </span>
                <span className="px-3 py-1.5 bg-[#ffd60a] text-black border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-black uppercase tracking-wider">
                  <span>100% VERIFIED FIRST PRESS</span>
                </span>
              </div>

              {/* Massive Oversized Headline */}
              <div className="space-y-2">
                <div className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-black drop-shadow-[2px_2px_0px_#ff2e93]">
                  BINGE WATCH
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#ff2e93] leading-tight">
                  K-DRAMA & TV SERIES COLLECTOR ARCHIVE
                </h1>
              </div>

              {/* Lead Paragraph */}
              <p className="text-base sm:text-lg text-neutral-800 font-medium leading-relaxed max-w-2xl">
                Immerse yourself in certified television masterworks. From viral K-Drama phenomena with exclusive member photocard inclusions to limited-edition orchestral soundtrack vinyls and director-annotated screenplay monographs.
              </p>

              {/* Quick Spec Highlights in Neo-Brutalist 3-Box Cluster */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono">
                <div className="p-3 bg-[#f8f9fa] border-2 border-black shadow-[3px_3px_0px_#000000]">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">INCLUSIONS</div>
                  <div className="text-sm font-black text-black">Holo Photocards</div>
                  <div className="text-xs text-[#ff2e93] font-bold">4-6ea Per Boxset</div>
                </div>

                <div className="p-3 bg-[#f8f9fa] border-2 border-black shadow-[3px_3px_0px_#000000]">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">AUDIO FIDELITY</div>
                  <div className="text-sm font-black text-black">2LP Gatefold OST</div>
                  <div className="text-xs text-[#00f0ff] font-bold">Colored Vinyl Editions</div>
                </div>

                <div className="p-3 bg-[#f8f9fa] border-2 border-black shadow-[3px_3px_0px_#000000]">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">AUTHENTICITY</div>
                  <div className="text-sm font-black text-black">Official License</div>
                  <div className="text-xs text-[#ffd60a] font-bold">Studio Dragon & HBO</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-2 flex-wrap font-mono">
                <a
                  href="#tv-catalog"
                  className="px-8 py-4 bg-[#ff2e93] hover:bg-[#ff007f] text-white border-3 border-black shadow-[4px_4px_0px_#000000] text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <Tv size={18} />
                  <span>EXPLORE TV RELEASES</span>
                  <span>→</span>
                </a>

                <a
                  href="#fan-theories"
                  className="px-8 py-4 bg-[#ffd60a] hover:bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000000] text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <Sparkles size={18} />
                  <span>FAN THEORY BOARD</span>
                </a>
              </div>
            </div>

            {/* Right Column (5 cols): Retro CRT Showcase Frame */}
            <div className="lg:col-span-5">
              <div className="relative border-4 border-black bg-black p-3 shadow-[8px_8px_0px_#ff2e93]">
                {/* TV Header Bar with Control Dots */}
                <div className="flex items-center justify-between pb-2 px-1 text-white font-mono text-[11px] font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff2e93]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffd60a]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]" />
                    <span className="tracking-widest uppercase ml-1">CHANNEL 01 // 4K BROADCAST</span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#ff2e93] text-white text-[10px] font-black uppercase">LIVE NOW</span>
                </div>

                {/* CRT Screen Display */}
                <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-black bg-neutral-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85"
                    alt="Squid Game 2 Showcase"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* High Contrast Scanlines Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px)',
                    }}
                  />

                  {/* High-Impact Badge Overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 font-mono">
                    <span className="px-3 py-1 bg-[#ffd60a] text-black border-2 border-black shadow-[2px_2px_0px_#000] text-[10px] font-black uppercase">
                      ★ SQUID GAME S2 SPECIAL DROP
                    </span>
                    <span className="px-2.5 py-0.5 bg-black/80 text-[#00f0ff] border border-white text-[9px] font-bold uppercase">
                      NETFLIX ORIGINAL • 9 EPISODES
                    </span>
                  </div>

                  {/* Bottom Info Bar inside CRT */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent text-white font-mono">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-[#00f0ff]">VIP EDITION STEELBOOK</div>
                        <div className="text-[11px] text-neutral-300">Includes Green Tracksuit Photocards (6ea)</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedShowForModal(TV_SHOWS_CATALOG[0])}
                        className="px-3 py-1.5 bg-[#ff2e93] hover:bg-white hover:text-black text-white border border-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        UNBOX
                      </button>
                    </div>
                  </div>
                </div>

                {/* CRT Lower Knob Control Panel */}
                <div className="flex items-center justify-between pt-3 px-2 text-white font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#ffd60a] font-bold">SIGNAL:</span>
                    <span className="text-[#00f0ff]">1080p 60FPS LOSSLESS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[8px]">●</span>
                    <span className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[8px]">▲</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. DOCK CONTROLS: CATEGORY FILTERS & REAL-TIME SEARCH
        ========================================================================= */}
        <section id="tv-catalog" className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-white border-4 border-black shadow-[6px_6px_0px_#000000]">
            
            {/* Filter Buttons Dock */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: 'ALL SHOWS', icon: Tv },
                { id: 'kdrama', label: 'K-DRAMA HITS', icon: Flame },
                { id: 'scifi', label: 'SCI-FI & THRILLER', icon: Zap },
                { id: 'prestige', label: 'PRESTIGE DRAMA', icon: Clapperboard },
                { id: 'bestseller', label: 'TOP BESTSELLERS', icon: Star },
              ].map((btn) => {
                const isActive = activeFilter === btn.id;
                const IconComponent = btn.icon;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setActiveFilter(btn.id)}
                    className={`px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 border-2 border-black transition-all duration-100 cursor-pointer ${
                      isActive
                        ? 'bg-[#ff2e93] text-white shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                        : 'bg-white text-black hover:bg-[#ffd60a] shadow-[2px_2px_0px_#000000]'
                    }`}
                  >
                    <IconComponent size={14} />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Real-time Search Input */}
            <div className="relative min-w-[280px] sm:min-w-[340px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search series, cast, platform..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:outline-none focus:border-[#ff2e93] shadow-[3px_3px_0px_#000000] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-black text-neutral-400 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Results Counter & Active Query Status */}
          <div className="flex items-center justify-between px-2 font-mono text-xs font-bold text-neutral-600">
            <div>
              SHOWING <span className="text-[#ff2e93] font-black">{filteredShows.length}</span> MASTERWORKS
              {activeFilter !== 'all' && <span className="ml-1 uppercase text-black">IN [{activeFilter}]</span>}
              {searchQuery && <span> MATCHING &quot;{searchQuery}&quot;</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
              <span>LIVE INVENTORY // SHIPS WORLDWIDE</span>
            </div>
          </div>

          {/* =========================================================================
              4. CATALOG GRID (K-POP NEO-BRUTALIST CARD ARCHITECTURE)
          ========================================================================= */}
          {filteredShows.length === 0 ? (
            <div className="w-full p-16 bg-white border-4 border-black text-center shadow-[6px_6px_0px_#000000] space-y-4 font-mono">
              <Tv size={48} className="mx-auto text-neutral-400" />
              <div className="text-xl font-black uppercase text-black">NO TV SERIES MATCHED YOUR SEARCH</div>
              <p className="text-neutral-600 text-sm max-w-md mx-auto">
                Try searching for &quot;Squid Game&quot;, &quot;Queen of Tears&quot;, &quot;Arcane&quot;, or reset your active genre filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-[#ffd60a] hover:bg-black hover:text-white border-2 border-black font-black uppercase text-xs tracking-wider transition-colors cursor-pointer"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredShows.map((show) => {
                const wishlisted = isWishlisted(show.id);
                return (
                  <article
                    key={show.id}
                    className="flex flex-col bg-white border-3 border-black shadow-[5px_5px_0px_#000000] hover:shadow-[5px_5px_0px_#ff2e93] transition-all duration-150 relative group overflow-hidden"
                  >
                    {/* Top Tag & Network Header */}
                    <div className="flex items-center justify-between p-3 bg-[#f8f9fa] border-b-2 border-black font-mono text-[11px] font-black">
                      <span className="px-2 py-0.5 bg-[#ffd60a] text-black border border-black uppercase tracking-wider text-[10px]">
                        {show.catalogCode}
                      </span>
                      <span className="text-neutral-800 font-bold uppercase truncate max-w-[170px]">
                        {show.networkOrPlatform}
                      </span>
                    </div>

                    {/* Image Area with Inclusions Peek */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 border-b-2 border-black">
                      <img
                        src={show.coverImage}
                        alt={show.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Hot Badge */}
                      <div className="absolute top-2.5 left-2.5 font-mono z-10">
                        <span className="px-2.5 py-1 bg-[#ff2e93] text-white border-2 border-black shadow-[2px_2px_0px_#000000] text-[10px] font-black uppercase tracking-wider">
                          {show.badge}
                        </span>
                      </div>

                      {/* Wishlist Quick Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(tvShowToAlbum(show));
                        }}
                        className={`absolute top-2.5 right-2.5 z-10 w-9 h-9 border-2 border-black flex items-center justify-center transition-transform duration-100 cursor-pointer active:scale-90 ${
                          wishlisted
                            ? 'bg-[#ff2e93] text-white shadow-[2px_2px_0px_#000000]'
                            : 'bg-white text-black hover:bg-[#ffd60a] shadow-[2px_2px_0px_#000000]'
                        }`}
                        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart size={16} fill={wishlisted ? '#ffffff' : 'none'} />
                      </button>

                      {/* Quick Details Floating Overlay on Hover */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono">
                        <div className="text-[11px] font-bold text-[#00f0ff] uppercase tracking-wider">
                          ★ INCLUSIONS PREVIEW:
                        </div>
                        <div className="text-[10px] text-neutral-200 line-clamp-2">
                          {show.inclusions.slice(0, 2).join(' • ')}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-neutral-500">
                          <span className="uppercase text-[#ff2e93] font-black">{show.genre}</span>
                          <span>{show.episodeCount} EPS</span>
                        </div>

                        <h3 className="text-base font-black uppercase tracking-tight text-black line-clamp-1 group-hover:text-[#ff2e93] transition-colors">
                          {show.title}
                        </h3>

                        {show.originalTitle && (
                          <div className="text-xs font-mono font-bold text-neutral-600 line-clamp-1">
                            {show.originalTitle} • {show.year}
                          </div>
                        )}

                        {/* Format Tag */}
                        <div className="pt-1">
                          <span className="inline-block px-2 py-0.5 bg-[#e0f7fa] text-[#006064] border border-black font-mono text-[10px] font-black uppercase tracking-wider">
                            {show.format}
                          </span>
                        </div>

                        {/* Cast snippet */}
                        <div className="text-[11px] text-neutral-600 font-medium line-clamp-1 pt-0.5">
                          <span className="font-mono font-bold text-black">Cast:</span> {show.cast.slice(0, 3).join(', ')}
                        </div>
                      </div>

                      {/* Price & Action Buttons */}
                      <div className="pt-2 border-t-2 border-black space-y-3">
                        <div className="flex items-baseline justify-between font-mono">
                          <div>
                            <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">COLLECTOR PRICE</div>
                            <div className="text-lg font-black text-black">
                              {formatPrice(show.priceUSD, show.priceVND)}
                            </div>
                          </div>
                          {show.originalPriceUSD && (
                            <span className="text-xs text-neutral-400 line-through">
                              ${show.originalPriceUSD.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                          {/* Unbox & Specs Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedShowForModal(show)}
                            className="px-3 py-2.5 bg-white hover:bg-[#ffd60a] text-black border-2 border-black shadow-[2px_2px_0px_#000000] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                          >
                            <Info size={14} />
                            <span>DETAILS</span>
                          </button>

                          {/* Add To Cart Button */}
                          <button
                            type="button"
                            onClick={() => addToCart(tvShowToAlbum(show))}
                            className="px-3 py-2.5 bg-[#ff2e93] hover:bg-[#ff007f] text-white border-2 border-black shadow-[2px_2px_0px_#000000] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                          >
                            <ShoppingCart size={14} />
                            <span>BUY NOW</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================================
            5. FAN THEORIES & BINGE NIGHT DISPATCHES (K-POP COMMUNITY VIBE)
        ========================================================================= */}
        <section id="fan-theories" className="space-y-6 pt-6">
          <div className="p-6 sm:p-8 bg-white border-4 border-black shadow-[8px_8px_0px_#000000] space-y-6">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs font-black text-[#ff2e93] uppercase tracking-widest">
                  <Flame size={16} />
                  <span>COMMUNITY DISPATCH // FAN CAFE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1">
                  EPISODE THEORIES & FAN BOARDS
                </h2>
              </div>
              <span className="px-3 py-1.5 bg-[#ffd60a] text-black border-2 border-black font-mono text-xs font-black uppercase tracking-wider self-start sm:self-auto shadow-[2px_2px_0px_#000]">
                ★ TELETEXT COMMUNITY FEED
              </span>
            </div>

            {/* Two Column Grid: Theory Cards + Submission Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Dispatches List (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {theories.map((theory) => (
                  <div
                    key={theory.id}
                    className="p-4 bg-[#f8f9fa] border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[4px_4px_0px_#ff2e93] transition-all duration-100 space-y-2 font-mono"
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#ff2e93] text-white text-[10px] font-black uppercase">
                          {theory.series}
                        </span>
                        <span className="text-black font-black">@{theory.author}</span>
                      </div>
                      <span className="text-neutral-400 text-[10px]">{theory.timestamp}</span>
                    </div>

                    <h4 className="font-sans text-base font-black text-black leading-snug">
                      {theory.title}
                    </h4>

                    <p className="font-sans text-xs sm:text-sm text-neutral-700 leading-relaxed">
                      {theory.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-300 text-xs">
                      <span className="text-[10px] text-[#ff2e93] font-black tracking-wider uppercase">
                        {theory.tag}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleLikeTheory(theory.id)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#ffd60a] border border-black font-black uppercase text-[11px] transition-colors cursor-pointer"
                      >
                        <span>★ AGREE</span>
                        <span className="text-[#ff2e93]">({theory.likes})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Theory Post Form (5 cols) */}
              <div className="lg:col-span-5 p-5 bg-[#fff9c4] border-3 border-black shadow-[5px_5px_0px_#000000] space-y-4 font-mono">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-2">
                  <Send size={14} />
                  <span>TRANSMIT FAN THEORY</span>
                </div>

                {submissionSuccess && (
                  <div className="p-3 bg-[#a3e635] border-2 border-black text-xs font-black text-black">
                    ✓ THEORY POSTED TO COMMUNITY BOARD!
                  </div>
                )}

                <form onSubmit={handlePostTheory} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider mb-1">
                      SELECT SERIES:
                    </label>
                    <select
                      value={newSeriesName}
                      onChange={(e) => setNewSeriesName(e.target.value)}
                      className="w-full p-2 bg-white border-2 border-black font-bold text-xs"
                    >
                      {TV_SHOWS_CATALOG.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider mb-1">
                      CODENAME / AUTHOR:
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. K-DramaDetective"
                      className="w-full p-2 bg-white border-2 border-black font-bold text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider mb-1">
                      HEADLINE:
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. The hidden clock in episode 4..."
                      className="w-full p-2 bg-white border-2 border-black font-bold text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider mb-1">
                      EVIDENCE & THEORY:
                    </label>
                    <textarea
                      rows={4}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Detail your scene breakdown or plot prediction..."
                      className="w-full p-2 bg-white border-2 border-black font-sans text-xs font-medium"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#ff2e93] hover:bg-black hover:text-white text-white border-2 border-black font-black uppercase text-xs tracking-wider transition-colors cursor-pointer shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    POST DISPATCH (BROADCAST)
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

      </div>

      {/* =========================================================================
          6. INTERACTIVE UNBOXING & SPECIFICATION MODAL (K-POP INCLUSIONS DRAWER)
      ========================================================================= */}
      {selectedShowForModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedShowForModal(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white border-4 border-black shadow-[10px_10px_0px_#ff2e93] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between p-4 bg-[#ff2e93] text-white border-b-3 border-black font-mono">
              <div className="flex items-center gap-2">
                <Tv size={18} />
                <span className="font-black text-sm uppercase tracking-wider">
                  [{selectedShowForModal.catalogCode}] UNBOXING & SERIES DOSSIER
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedShowForModal(null)}
                className="w-8 h-8 bg-black hover:bg-white hover:text-black text-white border-2 border-black flex items-center justify-center font-black text-sm transition-colors cursor-pointer"
                title="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Media Header Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-3 border-black p-4 bg-[#f8f9fa]">
                <div className="md:col-span-4 aspect-[3/4] overflow-hidden border-2 border-black bg-black">
                  <img
                    src={selectedShowForModal.coverImage}
                    alt={selectedShowForModal.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-8 space-y-3 font-mono">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-[#ffd60a] text-black border border-black text-xs font-black uppercase">
                      {selectedShowForModal.badge}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#00f0ff] text-black border border-black text-xs font-black uppercase">
                      {selectedShowForModal.networkOrPlatform}
                    </span>
                  </div>

                  <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                    {selectedShowForModal.title}
                  </h2>

                  {selectedShowForModal.originalTitle && (
                    <div className="text-sm font-bold text-neutral-600">
                      {selectedShowForModal.originalTitle} • {selectedShowForModal.year}
                    </div>
                  )}

                  <div className="text-xs text-neutral-700 font-medium">
                    <span className="font-bold text-black">Director/Creator:</span> {selectedShowForModal.director}
                  </div>

                  <div className="text-xs text-neutral-700 font-medium">
                    <span className="font-bold text-black">Lead Cast:</span> {selectedShowForModal.cast.join(', ')}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-neutral-300">
                    <div className="text-lg font-black text-[#ff2e93]">
                      {formatPrice(selectedShowForModal.priceUSD, selectedShowForModal.priceVND)}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(tvShowToAlbum(selectedShowForModal));
                        setSelectedShowForModal(null);
                      }}
                      className="px-6 py-2.5 bg-[#ff2e93] hover:bg-black text-white border-2 border-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-[3px_3px_0px_#000]"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs inside Modal */}
              <div className="flex border-b-2 border-black font-mono text-xs font-black">
                {[
                  { id: 'inclusions', label: '★ BOXSET INCLUSIONS (PHOTOCARDS)' },
                  { id: 'synopsis', label: 'SYNOPSIS & EPISODES' },
                  { id: 'soundtrack', label: 'SOUNDTRACK TRACKLIST' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalActiveTab(tab.id as any)}
                    className={`px-4 py-2.5 border-t-2 border-x-2 border-black transition-colors cursor-pointer mr-1 ${
                      modalActiveTab === tab.id
                        ? 'bg-[#ffd60a] text-black -mb-[2px] font-black'
                        : 'bg-white text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Inclusions (Signature K-Pop Photocard Architecture) */}
              {modalActiveTab === 'inclusions' && (
                <div className="p-4 bg-[#fff9c4] border-2 border-black space-y-4 font-mono">
                  <div className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
                    <Sparkles size={16} className="text-[#ff2e93]" />
                    <span>WHAT IS INSIDE THIS COLLECTOR EDITION:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedShowForModal.inclusions.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 bg-[#ff2e93] text-white border border-black flex items-center justify-center text-[10px] font-black shrink-0">
                          0{idx + 1}
                        </span>
                        <div className="text-xs font-bold text-black">{item}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-white border border-black text-[11px] text-neutral-600">
                    <span className="font-black text-[#ff2e93]">★ GUARANTEED FIRST PRESS:</span> All orders shipped in factory-sealed tamper-proof packaging with serialized authenticity hologram stamp.
                  </div>
                </div>
              )}

              {/* Tab 2: Synopsis & Narrative */}
              {modalActiveTab === 'synopsis' && (
                <div className="p-4 bg-white border-2 border-black space-y-4">
                  <div className="text-xs font-mono font-black uppercase tracking-wider text-[#ff2e93]">
                    OFFICIAL SYNOPSIS:
                  </div>
                  <p className="font-sans text-sm text-neutral-800 leading-relaxed font-medium">
                    {selectedShowForModal.synopsis}
                  </p>
                  <div className="p-3 bg-[#f8f9fa] border-2 border-black font-mono text-xs">
                    <span className="font-black">EPISODE RUNTIME:</span> Standard 60-75 minutes per episode • Uncut Director Edition with Audio Commentary.
                  </div>
                </div>
              )}

              {/* Tab 3: Soundtrack Tracks */}
              {modalActiveTab === 'soundtrack' && (
                <div className="p-4 bg-white border-2 border-black space-y-3 font-mono">
                  <div className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
                    <Disc size={16} className="text-[#00f0ff]" />
                    <span>OFFICIAL SOUNDTRACK TRACKLIST:</span>
                  </div>

                  <div className="space-y-2">
                    {selectedShowForModal.ostTracks.map((trk, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 bg-[#f8f9fa] border border-black text-xs hover:bg-[#e0f7fa] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-[10px] font-black">
                            {i + 1}
                          </span>
                          <div>
                            <div className="font-black text-black">{trk.title}</div>
                            <div className="text-[10px] text-neutral-500">{trk.artist}</div>
                          </div>
                        </div>
                        <span className="text-neutral-500 font-bold">{trk.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-black font-mono">
                <button
                  type="button"
                  onClick={() => handleShare(selectedShowForModal)}
                  className="px-4 py-2 bg-white hover:bg-[#ffd60a] text-black border-2 border-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Share2 size={14} />
                  <span>{copiedId === selectedShowForModal.id ? 'LINK COPIED!' : 'SHARE SHOW'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedShowForModal(null)}
                    className="px-5 py-2 bg-neutral-200 hover:bg-neutral-300 text-black border-2 border-black text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                    CLOSE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(tvShowToAlbum(selectedShowForModal));
                      setSelectedShowForModal(null);
                    }}
                    className="px-6 py-2 bg-[#ff2e93] hover:bg-[#ff007f] text-white border-2 border-black text-xs font-black uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_#000]"
                  >
                    BUY THIS BOXSET
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
