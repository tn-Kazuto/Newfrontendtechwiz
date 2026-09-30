'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
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
  PenTool,
  Flame,
  Star,
  Layers,
  Send,
  Pin
} from 'lucide-react';
import { Album } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

// ==========================================
// Hand-Drawn Wobbly Border Radius Constants
// ==========================================
const WOBBLY_SM = '255px 15px 225px 15px / 15px 225px 15px 255px';
const WOBBLY_MD = '255px 25px 225px 25px / 25px 225px 25px 255px';
const WOBBLY_LG = '225px 35px 255px 25px / 25px 245px 35px 225px';
const WOBBLY_CIRCLE = '255px 225px 240px 220px / 225px 250px 220px 245px';

// ==========================================
// Manga Volume Model
// ==========================================
export interface MangaItem {
  id: string;
  title: string;
  volumeNumber: string;
  author: string;
  genre: 'Shonen' | 'Seinen' | 'Romance' | 'Cyberpunk' | 'Artbook';
  publisher: string;
  priceUSD: number;
  priceVND: number;
  originalPriceUSD?: number;
  rating: number;
  reviewCount: number;
  tag: string;
  coverImage: string;
  description: string;
  samplePages: string[];
  stock: number;
  rotationClass: string;
  decoration: 'tape' | 'tack' | 'none';
  postItNote?: string;
}

// Curated Manga Volumes & Tankōbon Catalog
const MANGA_CATALOG: MangaItem[] = [
  {
    id: 'manga-one-piece-109',
    title: 'One Piece: Egghead Climax',
    volumeNumber: 'Vol. 109',
    author: 'Eiichiro Oda',
    genre: 'Shonen',
    publisher: 'Shueisha / Weekly Shonen Jump',
    priceUSD: 11.99,
    priceVND: 295000,
    originalPriceUSD: 14.99,
    rating: 5.0,
    reviewCount: 4820,
    tag: '★ GLOBAL BESTSELLER',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    description: 'The monumental battle at the futuristic island of Egghead reaches its peak! Gear 5 Luffy clashes with ancient powers as the truth of the Void Century begins to unravel.',
    samplePages: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 45,
    rotationClass: '',
    decoration: 'tape',
    postItNote: 'Egghead Arc final chapter!'
  },
  {
    id: 'manga-jujutsu-kaisen-27',
    title: 'Jujutsu Kaisen: Shinjuku Duel',
    volumeNumber: 'Vol. 27',
    author: 'Gege Akutami',
    genre: 'Shonen',
    publisher: 'Shueisha / Weekly Shonen Jump',
    priceUSD: 12.5,
    priceVND: 310000,
    originalPriceUSD: 15.0,
    rating: 4.95,
    reviewCount: 3910,
    tag: '⚡ HOT CLIMAX DROP',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    description: 'The desperate all-out assault against the King of Curses. High-density domain expansions, black flash rushes, and boundless cursed energy.',
    samplePages: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 32,
    rotationClass: '',
    decoration: 'tack',
    postItNote: 'Sukuna vs Sorcerers'
  },
  {
    id: 'manga-chainsaw-man-17',
    title: 'Chainsaw Man: Part 2 Aging Arc',
    volumeNumber: 'Vol. 17',
    author: 'Tatsuki Fujimoto',
    genre: 'Shonen',
    publisher: 'Shonen Jump+',
    priceUSD: 11.99,
    priceVND: 295000,
    originalPriceUSD: 13.99,
    rating: 4.98,
    reviewCount: 2750,
    tag: '✦ UNFILTERED GENIUS',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    description: 'Denji and Asa Mitaka navigate psychological dread and apocalyptic devil pacts in Fujimoto’s distinctive cinematic panel flow.',
    samplePages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 28,
    rotationClass: '',
    decoration: 'tape'
  },
  {
    id: 'manga-berserk-deluxe-14',
    title: 'Berserk Deluxe Edition Vol. 14',
    volumeNumber: 'Special Tankōbon',
    author: 'Kentaro Miura / Studio Gaga',
    genre: 'Seinen',
    publisher: 'Dark Horse Comics / Hakusensha',
    priceUSD: 49.99,
    priceVND: 1240000,
    originalPriceUSD: 59.99,
    rating: 5.0,
    reviewCount: 5200,
    tag: '👑 MASTERPIECE HARDCOVER',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: 'The monumental final pages penned by Kentaro Miura, bound in an oversized leatherette collector foil edition with bookmark ribbon.',
    samplePages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 14,
    rotationClass: '',
    decoration: 'tack',
    postItNote: 'Includes Miura Tribute Artbook!'
  },
  {
    id: 'manga-spy-family-13',
    title: 'Spy x Family: Red Circus Crisis',
    volumeNumber: 'Vol. 13',
    author: 'Tatsuya Endo',
    genre: 'Romance',
    publisher: 'Shonen Jump+',
    priceUSD: 10.99,
    priceVND: 270000,
    originalPriceUSD: 12.99,
    rating: 4.92,
    reviewCount: 1840,
    tag: '🌸 WHOLESOME ACTION',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    description: 'Operation Strix encounters dangerous hijacked school buses. Anya, Yor, and Loid weave undercover comedy with gripping Cold War espionage.',
    samplePages: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 50,
    rotationClass: '',
    decoration: 'tape'
  },
  {
    id: 'manga-dandadan-14',
    title: 'Dandadan: Space Invader Arc',
    volumeNumber: 'Vol. 14',
    author: 'Yukinobu Tatsu',
    genre: 'Shonen',
    publisher: 'Shonen Jump+',
    priceUSD: 11.5,
    priceVND: 285000,
    rating: 4.97,
    reviewCount: 2120,
    tag: '⚡ ANIME HYPER-DRIVE',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    description: 'Occult spirits collide with extraterrestrial invasion fleets in high-speed kinetic splash pages that redefined modern Shonen draftsmanship.',
    samplePages: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 36,
    rotationClass: '',
    decoration: 'tack'
  },
  {
    id: 'manga-tokyo-ghoul-boxset',
    title: 'Tokyo Ghoul Complete 14-Vol Boxset',
    volumeNumber: 'Full Arc Boxset',
    author: 'Sui Ishida',
    genre: 'Seinen',
    publisher: 'Viz Media / Young Jump',
    priceUSD: 115.0,
    priceVND: 2850000,
    originalPriceUSD: 149.0,
    rating: 4.99,
    reviewCount: 1630,
    tag: '📦 COLLECTOR BOXSET',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    description: 'Kaneki Ken’s complete tragedy. Contains all 14 volumes in an exclusive rigid magnetic case with dual-sided poster and Sui Ishida mini art booklet.',
    samplePages: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 8,
    rotationClass: '',
    decoration: 'tape',
    postItNote: 'Strictly limited to 500 sets!'
  },
  {
    id: 'manga-akira-35th-box',
    title: 'Akira 35th Anniversary Hardcover Box',
    volumeNumber: 'Definitive Archive',
    author: 'Katsuhiro Otomo',
    genre: 'Cyberpunk',
    publisher: 'Kodansha',
    priceUSD: 185.0,
    priceVND: 4580000,
    originalPriceUSD: 220.0,
    rating: 5.0,
    reviewCount: 980,
    tag: '🏆 HISTORIC MASTERPIECE',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    description: 'Presented in the original right-to-left Japanese reading format with authentic sound effect lettering and the rare Akira Club artbook.',
    samplePages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 5,
    rotationClass: '',
    decoration: 'tack'
  },
  {
    id: 'manga-frieren-12',
    title: 'Frieren: Beyond Journey’s End Vol. 12',
    volumeNumber: 'Vol. 12',
    author: 'Kanehito Yamada & Tsukasa Abe',
    genre: 'Seinen',
    publisher: 'Shogakukan',
    priceUSD: 11.99,
    priceVND: 295000,
    rating: 4.98,
    reviewCount: 3100,
    tag: '✨ CRITIC HIGHEST RATED',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    description: 'The elven mage Frieren and her young companions delve into the northern plateau. Gentle melancholic pacing with masterclass landscape screentones.',
    samplePages: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 22,
    rotationClass: '',
    decoration: 'tape'
  },
  {
    id: 'manga-naruto-anniversary-box',
    title: 'Naruto 25th Anniversary Memorial Boxset',
    volumeNumber: 'Part 1 Complete (Vol. 1-27)',
    author: 'Masashi Kishimoto',
    genre: 'Shonen',
    publisher: 'Shueisha / Viz Media',
    priceUSD: 135.0,
    priceVND: 3350000,
    originalPriceUSD: 175.0,
    rating: 4.99,
    reviewCount: 6420,
    tag: '★ 25TH ANNIVERSARY',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    description: 'The definitive classic ninja saga: Team 7 formation through the Valley of the End. Deluxe rigid box with embossed Konoha leaf crest and exclusive Masashi Kishimoto illustration book.',
    samplePages: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 18,
    rotationClass: '',
    decoration: 'tape',
    postItNote: 'Includes full Konoha color map!'
  },
  {
    id: 'manga-bleach-thousand-year',
    title: 'Bleach: Thousand-Year Blood War Final Arc',
    volumeNumber: 'Vol. 74 Climax',
    author: 'Tite Kubo',
    genre: 'Shonen',
    publisher: 'Shueisha / Weekly Shonen Jump',
    priceUSD: 12.99,
    priceVND: 320000,
    rating: 4.96,
    reviewCount: 4210,
    tag: '⚡ BANKAI CLIMAX',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    description: 'Ichigo Kurosaki faces Yhwach in the final showdown of Soul Society. Stunning negative-space black ink washes and razor-sharp fashion paneling.',
    samplePages: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 30,
    rotationClass: '',
    decoration: 'tack'
  },
  {
    id: 'manga-dragon-ball-daizenshuu',
    title: 'Dragon Ball Complete Illustration Archive',
    volumeNumber: 'Daizenshuu Special Edition',
    author: 'Akira Toriyama',
    genre: 'Shonen',
    publisher: 'Bird Studio / Shueisha',
    priceUSD: 45.0,
    priceVND: 1120000,
    originalPriceUSD: 55.0,
    rating: 5.0,
    reviewCount: 7800,
    tag: '👑 TORIYAMA MASTERWORK',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    description: 'A tribute anthology of Akira Toriyama’s legendary watercolor splash panels, vintage Toriyama mechanical vehicle sketches, and full-color chapter title spreads.',
    samplePages: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 24,
    rotationClass: '',
    decoration: 'tape',
    postItNote: 'Rest in power Akira Toriyama Sensei'
  },
  {
    id: 'manga-vagabond-vizbig-12',
    title: 'Vagabond Definitive Edition Vol. 12',
    volumeNumber: 'Vizbig 3-in-1',
    author: 'Takehiko Inoue',
    genre: 'Seinen',
    publisher: 'Viz Media / Kodansha',
    priceUSD: 24.99,
    priceVND: 620000,
    originalPriceUSD: 29.99,
    rating: 5.0,
    reviewCount: 5120,
    tag: '✨ INK WASH PERFECTION',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: 'Miyamoto Musashi’s philosophical journey towards enlightenment. Unmatched Sumi ink brushwork depicting the quiet contemplation and visceral swordsmanship of feudal Japan.',
    samplePages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 19,
    rotationClass: '',
    decoration: 'tack'
  },
  {
    id: 'manga-vinland-saga-deluxe-3',
    title: 'Vinland Saga Deluxe Collector Hardcover Book 3',
    volumeNumber: 'Deluxe HC Book 3',
    author: 'Makoto Yukimura',
    genre: 'Seinen',
    publisher: 'Kodansha Comics',
    priceUSD: 42.5,
    priceVND: 1050000,
    originalPriceUSD: 49.99,
    rating: 4.97,
    reviewCount: 3340,
    tag: '⚔️ FARMLAND ARC EPIC',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    description: 'Thorfinn seeks atonement in the universally acclaimed Farmland Arc. Oversized genuine faux-leather binding with gold debossing and red ribbon marker.',
    samplePages: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 16,
    rotationClass: '',
    decoration: 'tape'
  },
  {
    id: 'manga-death-note-all-in-one',
    title: 'Death Note All-In-One 2,400-Page Monolith',
    volumeNumber: 'Complete Series Edition',
    author: 'Tsugumi Ohba & Takeshi Obata',
    genre: 'Shonen',
    publisher: 'Viz Media',
    priceUSD: 39.99,
    priceVND: 990000,
    originalPriceUSD: 49.99,
    rating: 4.94,
    reviewCount: 4670,
    tag: '📓 2,400-PAGE TOME',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    description: 'All 12 volumes of the mind-game battle between Light Yagami and L bound into a single colossal 2,400-page gilded foil volume with silver foil edged pages.',
    samplePages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 21,
    rotationClass: '',
    decoration: 'tack'
  },
  {
    id: 'manga-hunter-hunter-37',
    title: 'Hunter x Hunter: Succession Contest',
    volumeNumber: 'Vol. 37',
    author: 'Yoshihiro Togashi',
    genre: 'Shonen',
    publisher: 'Shueisha',
    priceUSD: 11.99,
    priceVND: 295000,
    rating: 4.96,
    reviewCount: 3890,
    tag: '🧠 MASTER STRATEGIST',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    description: 'Kurapika navigates the deadly Nen-beast battle royale on the Black Whale heading for the Dark Continent. Intricate high-stakes psychological warfare.',
    samplePages: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 27,
    rotationClass: '',
    decoration: 'tape'
  }
];

// Helper to convert Manga item to Album format for cart
function mangaToAlbum(item: MangaItem): Album {
  return {
    id: item.id,
    title: `${item.title} (${item.volumeNumber})`,
    artist: item.author,
    artistId: item.author.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    category: 'Manga',
    priceUSD: item.priceUSD,
    priceVND: item.priceVND,
    originalPriceUSD: item.originalPriceUSD,
    coverImage: item.coverImage,
    galleryImages: item.samplePages,
    type: 'Manga Volume',
    releaseDate: '2025-01-15',
    tag: item.tag,
    rating: item.rating,
    reviewCount: item.reviewCount,
    popularityScore: 98,
    stock: item.stock,
    description: item.description,
    versions: [
      { id: `${item.id}-tankobon`, name: 'Standard Tankōbon Paperback', extraPriceUSD: 0 },
      { id: `${item.id}-collector`, name: 'Collector Foil Variant (+Poster)', extraPriceUSD: 4.0 }
    ],
    inclusions: [
      'Authentic Tankōbon Volume (Japanese B6 Size)',
      'Exclusive Mangaka Author Replica Art Card',
      'Dual-sided Mini Poster Bookmark',
      'Original Onomatopoeia Translation Booklet'
    ],
    photocards: [
      {
        member: item.author,
        image: item.coverImage
      }
    ],
    tracks: [
      { id: 1, title: 'Chapter 01: The Beginning of the Journey', duration: 'Reading: 25m', isTitleTrack: true },
      { id: 2, title: 'Chapter 02: Clashing Steel & Shadows', duration: 'Reading: 20m', isTitleTrack: false },
      { id: 3, title: 'Chapter 03: The Climax Breakdown', duration: 'Reading: 28m', isTitleTrack: true }
    ],
    reviews: [
      {
        id: `rev-${item.id}-1`,
        userName: 'MangaOtaku_Global',
        avatar: item.coverImage,
        rating: 5,
        comment: 'Printing quality and screentones are gorgeous. The paper weight feels authentic to Japanese tankōbon.',
        date: '2025-01-20',
        fandomTag: 'Manga Collector'
      }
    ]
  };
}

// Manga Featured Spotlight Banners
export interface MangaBanner {
  id: string;
  title: string;
  mangaka: string;
  badge: string;
  tag: string;
  desc: string;
  image: string;
  volume: string;
  targetId?: string;
}

const MANGA_SPOTLIGHT_BANNERS: MangaBanner[] = [
  {
    id: 'mb-chainsaw',
    title: 'Chainsaw Man: Denji & War Devil Reckoning',
    mangaka: 'Tatsuki Fujimoto (藤本タツキ)',
    badge: '★ SHUEISHA JUMP+ HOT DROP',
    tag: 'METALLIC FOIL SPECIAL EDITION',
    desc: 'Denji faces Asa Mitaka and the terrifying War Devil in Fujimoto’s genre-defying cinematic inkwork. Uncut chapters with archival dust jacket.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=85',
    volume: 'Vol. 17',
    targetId: 'manga-chainsaw-man-vol1',
  },
  {
    id: 'mb-onepiece',
    title: 'One Piece: Egghead Island Future Climax',
    mangaka: 'Eiichiro Oda (尾田栄一郎)',
    badge: '★ 1100+ CHAPTERS LEGENDARY RUN',
    tag: 'GEAR 5 COMMEMORATIVE MANGA',
    desc: 'The mysteries of the Ancient Kingdom emerge as Dr. Vegapunk broadcasts to the world. High-definition screentones and 4-color foldout poster.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=85',
    volume: 'Vol. 109',
    targetId: 'manga-one-piece-vol1',
  },
  {
    id: 'mb-berserk',
    title: 'Berserk Deluxe Edition: Golden Age Masterwork',
    mangaka: 'Kentaro Miura (三浦建太郎)',
    badge: '★ DARK HORSE LEATHERETTE DELUXE',
    tag: '7x10 OVERSIZED ARCHIVE',
    desc: 'Miura’s unmatched hand-hatched inkwork presented in oversized deluxe hardcover. Guts’ struggle against destiny in absolute collector purity.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85',
    volume: 'Deluxe Vol. 14',
    targetId: 'manga-berserk-deluxe-vol1',
  },
  {
    id: 'mb-vagabond',
    title: 'Vagabond: The Way of the Blade & Spirit',
    mangaka: 'Takehiko Inoue (井上雄彦)',
    badge: '★ SEINEN CALLIGRAPHIC MASTERPIECE',
    tag: 'SUMI-E BRUSHWORK DEFINITIVE',
    desc: 'The life of sword-saint Miyamoto Musashi brought to life through traditional sumi ink and calligraphic brush precision. Archival boxed reprint.',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&auto=format&fit=crop&q=85',
    volume: 'VizBig Vol. 12',
    targetId: 'manga-vagabond-vol1',
  },
];

export const MangaHandDrawnView: React.FC = () => {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice, setIsCartOpen } = useCartWishlist();

  // Filters & State
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewingManga, setPreviewingManga] = useState<MangaItem | null>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  // Auto rotate banner every 6s
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % MANGA_SPOTLIGHT_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Reader Sticky Notes Wall State
  const [communityNotes, setCommunityNotes] = useState([
    {
      id: 'cn-1',
      author: 'LuffyKing99',
      text: 'The Egghead double-spread in Ch. 1108 is Oda’s greatest panel composition since Marineford! 🏴‍☠️',
      color: '#fff9c4',
      rotation: '-rotate-2',
      tag: 'One Piece'
    },
    {
      id: 'cn-2',
      author: 'ChainsawReader',
      text: 'Fujimoto’s pacing in Part 2 feels like reading a French New Wave thriller. Brilliant screentone texture.',
      color: '#ffffff',
      rotation: 'rotate-1',
      tag: 'Chainsaw Man'
    },
    {
      id: 'cn-3',
      author: 'Guts_Struggler',
      text: 'Berserk Deluxe 14 arrived today. Paper weight is heavy 120gsm archival stock. Absolute holy grail tankōbon.',
      color: '#fff9c4',
      rotation: '-rotate-1',
      tag: 'Berserk'
    },
    {
      id: 'cn-4',
      author: 'FrierenFanVN',
      text: 'Frieren Vol. 12 background art is so soothing. Best manga to read on rainy days with green tea. ☕',
      color: '#ffffff',
      rotation: 'rotate-2',
      tag: 'Frieren'
    }
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('');

  // Filtered Manga Items
  const filteredManga = useMemo(() => {
    return MANGA_CATALOG.filter((item) => {
      if (selectedGenre !== 'all' && item.genre !== selectedGenre) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inAuthor = item.author.toLowerCase().includes(q);
        const inPublisher = item.publisher.toLowerCase().includes(q);
        const inTag = item.tag.toLowerCase().includes(q);
        if (!inTitle && !inAuthor && !inPublisher && !inTag) return false;
      }
      return true;
    });
  }, [selectedGenre, searchQuery]);

  // Handle Add to Cart
  const handleAddToCart = (item: MangaItem) => {
    const album = mangaToAlbum(item);
    addToCart(album, `${item.id}-tankobon`, 1);
    setAddedToast(item.title);
    setTimeout(() => setAddedToast(null), 3500);
  };

  // Handle Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote = {
      id: `cn-${Date.now()}`,
      author: newNoteAuthor.trim() || 'Anonymous Otaku',
      text: newNoteText.trim(),
      color: '#fff9c4',
      rotation: Math.random() > 0.5 ? 'rotate-1' : '-rotate-2',
      tag: 'Reader Note'
    };
    setCommunityNotes([newNote, ...communityNotes]);
    setNewNoteText('');
    setNewNoteAuthor('');
  };

  return (
    <div
      className="w-full relative text-[#2d2d2d] py-8 px-4 sm:px-6 md:px-8 overflow-hidden select-none"
      style={{
        backgroundColor: '#fdfbf7',
        backgroundImage: 'radial-gradient(#e5e0d8 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
        fontFamily: "'Patrick Hand', cursive, sans-serif"
      }}
    >
      {/* Toast Notification */}
      {addedToast && (
        <div
          className="fixed bottom-6 right-6 z-50 bg-[#fff9c4] border-[3px] border-[#2d2d2d] p-4 shadow-[4px_4px_0px_#2d2d2d] flex items-center gap-3 animate-bounce"
          style={{ borderRadius: WOBBLY_SM }}
        >
          <div className="w-8 h-8 rounded-full bg-[#ff4d4d] text-white flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-[#2d5da1]">Added to Tote!</p>
            <p className="font-bold text-sm text-[#2d2d2d]">{addedToast}</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 px-3 py-1 bg-white border-2 border-[#2d2d2d] text-xs font-bold hover:bg-[#ff4d4d] hover:text-white transition-colors"
            style={{ borderRadius: WOBBLY_SM }}
          >
            View Tote
          </button>
        </div>
      )}

      {/* Main Container - Widened to 1440px with generous flex gaps */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-28 sm:gap-40 py-12 sm:py-16">

        {/* =========================================================================
            1. HERO SECTION: HAND-DRAWN SKETCHBOOK TITLE & DRAFTING TABLE
        ========================================================================= */}
        <section className="relative pt-6 pb-12">
          {/* Tape strip top left */}
          <div
            className="absolute -top-3 left-8 w-28 h-7 z-20 pointer-events-none opacity-85"
            style={{
              backgroundColor: '#e5e0d8',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              transform: 'rotate(-4deg)'
            }}
          />

          {/* Red thumbtack top center */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
            <div className="w-6 h-6 rounded-full bg-[#ff4d4d] border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]" />
            <div className="w-1 h-3 bg-[#2d2d2d] -mt-0.5" />
          </div>

          {/* Main Hero Container */}
          <div
            className="relative bg-white border-[3px] border-[#2d2d2d] p-6 sm:p-10 md:p-12 shadow-[8px_8px_0px_#2d2d2d]"
            style={{ borderRadius: WOBBLY_LG }}
          >
            {/* Corner pencil marks */}
            <div className="absolute top-3 left-3 text-xs font-mono text-[#2d2d2d]/30 pointer-events-none">
              ┌── 2025.DRAFT ──┐
            </div>
            <div className="absolute bottom-3 right-3 text-xs font-mono text-[#2d2d2d]/30 pointer-events-none">
              └── G-PEN № 61 ──┘
            </div>

            {/* Balanced 12-Column Responsive Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column (7 cols): Heading, Narrative, Actions & Badges */}
              <div className="lg:col-span-7 space-y-5">
                {/* Hand-drawn badge */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 bg-[#fff9c4] border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]"
                  style={{ borderRadius: WOBBLY_SM }}
                >
                  <PenTool size={15} className="text-[#2d5da1]" />
                  <span className="text-sm font-bold text-[#2d2d2d] tracking-wide">
                    OFFICIAL MANGA ARCHIVE &amp; INK DRAFTS
                  </span>
                </div>

                {/* Hero Title with Kalam font */}
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2d2d2d] leading-none tracking-tight"
                  style={{ fontFamily: "'Kalam', cursive, sans-serif" }}
                >
                  Authentic Manga Vault!
                </h1>

                {/* Subtitle with Patrick Hand */}
                <p className="text-base sm:text-lg text-[#2d2d2d]/80 max-w-xl leading-relaxed">
                  Crafted with authentic G-Pen ink, traditional screentone halftones, and raw paper texture.
                  Discover licensed Shonen Jump+, Kodansha, and Hakusensha tankōbon volumes.
                </p>

                {/* CTA Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#manga-catalog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-[3px] border-[#2d2d2d] text-[#2d2d2d] font-bold text-base shadow-[4px_4px_0px_#2d2d2d] hover:bg-[#ff4d4d] hover:text-white transition-colors cursor-pointer"
                    style={{ borderRadius: WOBBLY_SM }}
                  >
                    <span>EXPLORE TANKŌBON</span>
                    <ArrowRight size={18} strokeWidth={3} />
                  </a>

                  <a
                    href="#reader-notes"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#e5e0d8] border-[3px] border-[#2d2d2d] text-[#2d2d2d] font-bold text-base shadow-[4px_4px_0px_#2d2d2d] hover:bg-[#2d5da1] hover:text-white transition-colors cursor-pointer"
                    style={{ borderRadius: WOBBLY_SM }}
                  >
                    <Pin size={16} />
                    <span>READER STICKY WALL</span>
                  </a>
                </div>

                {/* Publisher Quick Pills */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="text-[#2d2d2d]/60 uppercase mr-1">TOP IMPRINTS:</span>
                  <span className="px-2.5 py-1 bg-[#fff9c4] text-[#2d2d2d] border border-[#2d2d2d]" style={{ borderRadius: WOBBLY_SM }}>
                    ⚡ Shōnen Jump+
                  </span>
                  <span className="px-2.5 py-1 bg-[#e0f2fe] text-[#0369a1] border border-[#2d2d2d]" style={{ borderRadius: WOBBLY_SM }}>
                    ⚔️ Kodansha
                  </span>
                  <span className="px-2.5 py-1 bg-[#fee2e2] text-[#991b1b] border border-[#2d2d2d]" style={{ borderRadius: WOBBLY_SM }}>
                    🩸 Young Animal
                  </span>
                  <span className="px-2.5 py-1 bg-[#fdfbf7] text-[#2d2d2d] border border-[#2d2d2d]" style={{ borderRadius: WOBBLY_SM }}>
                    🌸 Hakusensha
                  </span>
                </div>

                {/* Trust Guarantees */}
                <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-[#2d2d2d]/80 border-t border-[#2d2d2d]/15">
                  <span className="flex items-center gap-1 text-emerald-800">
                    <Check size={14} strokeWidth={3} /> 100% Licensed Japanese Tankōbon
                  </span>
                  <span className="flex items-center gap-1 text-[#2d5da1]">
                    <Check size={14} strokeWidth={3} /> G-Pen Archival 120gsm Paper
                  </span>
                  <span className="flex items-center gap-1 text-[#2d2d2d]">
                    <Check size={14} strokeWidth={3} /> Mangaka Author Sketch Included
                  </span>
                </div>
              </div>

              {/* Right Column (5 cols): Rich Featured Tankōbon Spotlight Card */}
              <div className="lg:col-span-5">
                <div
                  className="bg-[#fff9c4] border-[3.5px] border-[#2d2d2d] p-5 shadow-[6px_6px_0px_#2d2d2d] relative"
                  style={{ borderRadius: WOBBLY_MD }}
                >
                  {/* Top Tape decoration */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#e5e0d8] opacity-90 shadow-xs pointer-events-none -rotate-1"
                  />

                  {/* Sound Burst Pill */}
                  <div
                    className="absolute -top-1 -right-1 px-3 py-1 bg-[#ff4d4d] text-white font-bold text-xs uppercase border-2 border-[#2d2d2d] rotate-3 shadow-[2px_2px_0px_#2d2d2d] z-20"
                    style={{ borderRadius: WOBBLY_SM }}
                  >
                    DON!! HOT DROP
                  </div>

                  {/* Header bar */}
                  <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#2d2d2d]">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#2d5da1] flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#ff4d4d]" />
                      ★ TANKŌBON OF THE WEEK
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-[#2d2d2d] text-white px-2 py-0.5" style={{ borderRadius: WOBBLY_SM }}>
                      1ST PRINTING
                    </span>
                  </div>

                  {/* Showcase Body */}
                  <div className="mt-4 flex gap-4">
                    {/* Tankōbon Book Frame */}
                    <div 
                      className="w-32 shrink-0 bg-white border-2 border-[#2d2d2d] overflow-hidden shadow-[3px_3px_0px_#2d2d2d] relative"
                      style={{ borderRadius: WOBBLY_SM }}
                    >
                      <div className="bg-[#ff4d4d] text-white text-[9px] font-bold text-center py-0.5 uppercase border-b border-[#2d2d2d]">
                        JUMP COMICS +
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
                        alt="One Piece Vol 109"
                        className="w-full h-40 object-cover"
                      />
                    </div>

                    {/* Metadata & Quick Add */}
                    <div className="flex-1 flex flex-col justify-between space-y-2 text-left">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-[#2d2d2d]/60 block">
                          EIICHIRO ODA • SHUEISHA
                        </span>
                        <h4 
                          className="font-bold text-base text-[#2d2d2d] leading-tight mt-0.5 line-clamp-2"
                          style={{ fontFamily: "'Kalam', cursive" }}
                        >
                          One Piece: Vol. 109 - Egghead Climax
                        </h4>
                        <p className="text-xs text-[#2d2d2d]/80 mt-1">
                          Japanese B6 Standard Tankōbon (216 pages)
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#2d2d2d]/20 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#2d2d2d]/60 font-mono block">COVER PRICE</span>
                          <span className="text-lg font-black text-[#ff4d4d] font-mono leading-none">
                            $13.99
                          </span>
                        </div>

                        <a
                          href="#manga-catalog"
                          className="px-3 py-1.5 bg-[#2d2d2d] hover:bg-[#ff4d4d] text-white text-xs font-bold uppercase transition-colors border border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d] inline-flex items-center gap-1"
                          style={{ borderRadius: WOBBLY_SM }}
                        >
                          <ShoppingCart size={13} />
                          <span>ADD TOTE</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Speech Bubble */}
                  <div className="mt-4 p-2.5 bg-white border-2 border-[#2d2d2d] text-xs text-[#2d2d2d] leading-snug relative" style={{ borderRadius: WOBBLY_SM }}>
                    <p className="italic font-bold">
                      "Pre-orders include licensed Oda author sketch postcard and bookmark ribbon."
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Organic Shape Stats Counter */}
            <div className="mt-10 pt-6 border-t-2 border-dashed border-[#2d2d2d] grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { number: '150M+', label: 'Copies Circulated', bg: 'bg-[#fdfbf7]' },
                { number: '48+', label: 'Master Mangaka', bg: 'bg-[#fff9c4]' },
                { number: '100%', label: 'Japanese Tankōbon', bg: 'bg-[#fdfbf7]' },
                { number: 'G-Pen', label: 'Archival Screentones', bg: 'bg-[#e5e0d8]' }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-3 text-center border-2 border-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d] ${stat.bg}`}
                  style={{ borderRadius: WOBBLY_SM }}
                >
                  <div
                    className="text-2xl font-bold text-[#2d2d2d]"
                    style={{ fontFamily: "'Kalam', cursive" }}
                  >
                    {stat.number}
                  </div>
                  <div className="text-xs font-bold text-[#2d2d2d]/70 uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            FEATURED MANGA SPOTLIGHT BANNER CAROUSEL
        ========================================================================= */}
        <section className="relative">
          {/* Top Tape decoration */}
          <div
            className="absolute -top-3 left-10 w-28 h-6 bg-[#e5e0d8] z-20 opacity-90 -rotate-2 pointer-events-none shadow-xs"
          />
          <div
            className="absolute -top-3 right-12 w-24 h-6 bg-[#fff9c4] z-20 opacity-90 rotate-2 pointer-events-none shadow-xs"
          />

          <div
            className="relative bg-white border-[3px] border-[#2d2d2d] shadow-[8px_8px_0px_#2d2d2d] overflow-hidden"
            style={{ borderRadius: WOBBLY_LG }}
          >
            {/* Banner Media Item */}
            <div className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[460px] flex flex-col justify-end p-6 sm:p-10 md:p-12 overflow-hidden">
              {/* Background Art with Vignette */}
              <img
                src={MANGA_SPOTLIGHT_BANNERS[currentBannerIdx].image}
                alt={MANGA_SPOTLIGHT_BANNERS[currentBannerIdx].title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />

              {/* Hand-Drawn Screentone Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none" 
                style={{
                  backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                  backgroundSize: '8px 8px',
                }}
              />

              {/* Banner Content Container */}
              <div className="relative z-10 max-w-3xl space-y-3.5 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-3 py-1 bg-[#ff4d4d] text-white text-xs font-bold uppercase border-2 border-white shadow-[2px_2px_0px_#000]"
                    style={{ borderRadius: WOBBLY_SM }}
                  >
                    {MANGA_SPOTLIGHT_BANNERS[currentBannerIdx].badge}
                  </span>
                  <span
                    className="px-3 py-1 bg-[#fff9c4] text-[#2d2d2d] text-xs font-bold uppercase border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#000]"
                    style={{ borderRadius: WOBBLY_SM }}
                  >
                    {MANGA_SPOTLIGHT_BANNERS[currentBannerIdx].tag}
                  </span>
                  <span className="text-xs font-mono text-white/90 bg-black/60 px-2 py-0.5 border border-white/40">
                    {MANGA_SPOTLIGHT_BANNERS[currentBannerIdx].volume}
                  </span>
                </div>

                <h3
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md"
                  style={{ fontFamily: "'Kalam', cursive, sans-serif" }}
                >
                  {MANGA_SPOTLIGHT_BANNERS[currentBannerIdx].title}
                </h3>

                <p className="text-sm font-bold text-white/90">
                  Mangaka: <span className="text-[#fff9c4]">{MANGA_SPOTLIGHT_BANNERS[currentBannerIdx].mangaka}</span>
                </p>

                <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                  {MANGA_SPOTLIGHT_BANNERS[currentBannerIdx].desc}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#manga-catalog"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#fff9c4] text-[#2d2d2d] hover:bg-[#ff4d4d] hover:text-white border-2 border-[#2d2d2d] font-bold text-sm shadow-[4px_4px_0px_#2d2d2d] transition-colors cursor-pointer"
                    style={{ borderRadius: WOBBLY_SM }}
                  >
                    <span>BROWSE VOLUME IN ARCHIVE</span>
                    <ArrowRight size={16} strokeWidth={3} />
                  </a>

                  <div className="text-xs font-mono text-white/70 bg-black/40 px-2 py-1 border border-white/20">
                    BANNER {currentBannerIdx + 1} / {MANGA_SPOTLIGHT_BANNERS.length}
                  </div>
                </div>
              </div>

              {/* Prev / Next Navigation Arrows */}
              <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentBannerIdx((prev) => (prev - 1 + MANGA_SPOTLIGHT_BANNERS.length) % MANGA_SPOTLIGHT_BANNERS.length)}
                  className="w-10 h-10 bg-white text-[#2d2d2d] hover:bg-[#ff4d4d] hover:text-white border-2 border-[#2d2d2d] flex items-center justify-center font-bold shadow-[2px_2px_0px_#2d2d2d] transition-colors cursor-pointer"
                  style={{ borderRadius: WOBBLY_SM }}
                  title="Previous Banner"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentBannerIdx((prev) => (prev + 1) % MANGA_SPOTLIGHT_BANNERS.length)}
                  className="w-10 h-10 bg-white text-[#2d2d2d] hover:bg-[#ff4d4d] hover:text-white border-2 border-[#2d2d2d] flex items-center justify-center font-bold shadow-[2px_2px_0px_#2d2d2d] transition-colors cursor-pointer"
                  style={{ borderRadius: WOBBLY_SM }}
                  title="Next Banner"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Bottom Dot Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {MANGA_SPOTLIGHT_BANNERS.map((banner, idx) => (
                  <button
                    key={banner.id}
                    type="button"
                    onClick={() => setCurrentBannerIdx(idx)}
                    className={`h-2.5 rounded-full border border-black transition-all cursor-pointer ${
                      currentBannerIdx === idx ? 'w-8 bg-[#fff9c4]' : 'w-2.5 bg-white/50'
                    }`}
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
        <section id="manga-catalog" className="flex flex-col gap-10 my-16 sm:my-28 pb-16 sm:pb-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-block px-3 py-0.5 bg-[#e5e0d8] border-2 border-[#2d2d2d] text-xs font-bold -rotate-1 mb-1"
                style={{ borderRadius: WOBBLY_SM }}>
                CATALOG BROWSER
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#2d2d2d]"
                style={{ fontFamily: "'Kalam', cursive" }}
              >
                Curated Tankōbon Volumes
              </h2>
            </div>

            {/* Wobbly Hand-Drawn Search Bar */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, author, or arc..."
                className="w-full pl-10 pr-8 py-2.5 bg-white border-2 border-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d] focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 outline-none text-sm placeholder:text-[#2d2d2d]/40 transition-all font-bold"
                style={{ borderRadius: WOBBLY_SM }}
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d2d2d]/60 pointer-events-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2d2d2d] hover:text-[#ff4d4d]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Genre / Tag Filter Buttons (Wobbly Oval Buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
            {[
              { id: 'all', label: '✦ All Manga' },
              { id: 'Shonen', label: '⚡ Shonen Action' },
              { id: 'Seinen', label: '⚔️ Seinen & Dark Fantasy' },
              { id: 'Romance', label: '🌸 Romance & Comedy' },
              { id: 'Cyberpunk', label: '🤖 Cyberpunk & Sci-Fi' }
            ].map((tab) => {
              const isActive = selectedGenre === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGenre(tab.id)}
                  type="button"
                  className={`px-4 py-2 text-sm font-bold border-2 border-[#2d2d2d] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${isActive
                    ? 'bg-[#ff4d4d] text-white shadow-[3px_3px_0px_#2d2d2d] translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-white text-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d] hover:bg-[#fff9c4]'
                    }`}
                  style={{ borderRadius: WOBBLY_SM }}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results count note */}
          <div className="text-xs font-bold text-[#2d2d2d]/60 flex items-center justify-between">
            <span>Showing {filteredManga.length} volumes</span>
            <span className="text-[#2d5da1] underline cursor-pointer hover:text-[#ff4d4d]" onClick={() => { setSelectedGenre('all'); setSearchQuery(''); }}>
              Reset Filters
            </span>
          </div>

          {/* =========================================================================
              3. TANKŌBON VOLUMES GRID (WOBBLY CARDS WITH DELIBERATE ROTATIONS)
          ========================================================================= */}
          {filteredManga.length === 0 ? (
            <div
              className="bg-white border-2 border-dashed border-[#2d2d2d] p-12 text-center space-y-3"
              style={{ borderRadius: WOBBLY_MD }}
            >
              <BookOpen size={40} className="mx-auto text-[#2d2d2d]/30" />
              <p className="font-bold text-xl" style={{ fontFamily: "'Kalam', cursive" }}>
                No manga volumes found for your draft query!
              </p>
              <button
                onClick={() => { setSelectedGenre('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-[#ff4d4d] text-white font-bold border-2 border-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d]"
                style={{ borderRadius: WOBBLY_SM }}
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredManga.map((manga) => {
                const isFavorited = isWishlisted(manga.id);

                return (
                  <div
                    key={manga.id}
                    className="group relative bg-white border-2 border-[#2d2d2d] p-5 shadow-[4px_4px_0px_#2d2d2d] flex flex-col justify-between transition-colors"
                    style={{ borderRadius: WOBBLY_MD }}
                  >
                    {/* Tape or Thumbtack Decoration at Top */}
                    {manga.decoration === 'tape' && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#e5e0d8] opacity-85 z-10 pointer-events-none"
                        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
                      />
                    )}
                    {manga.decoration === 'tack' && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                        <div className="w-5 h-5 rounded-full bg-[#ff4d4d] border-2 border-[#2d2d2d] shadow-[1px_1px_0px_#2d2d2d]" />
                      </div>
                    )}

                    {/* Card Top: Volume Tag & Wishlist Button */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="px-2.5 py-0.5 text-xs font-bold bg-[#fff9c4] border border-[#2d2d2d] text-[#2d2d2d]"
                          style={{ borderRadius: WOBBLY_SM }}
                        >
                          {manga.tag}
                        </span>

                        <button
                          onClick={() => toggleWishlist(mangaToAlbum(manga))}
                          className={`w-8 h-8 rounded-full border-2 border-[#2d2d2d] flex items-center justify-center transition-colors cursor-pointer ${isFavorited ? 'bg-[#ff4d4d] text-white' : 'bg-white text-[#2d2d2d] hover:bg-[#fff9c4]'
                            }`}
                          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <Heart size={14} fill={isFavorited ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Cover Image Container with Screentone Corner Marks */}
                      <div
                        className="relative w-full h-64 overflow-hidden border-2 border-[#2d2d2d] bg-[#fdfbf7] mb-4 cursor-pointer"
                        onClick={() => {
                          setPreviewingManga(manga);
                          setActivePageIndex(0);
                        }}
                        style={{ borderRadius: WOBBLY_SM }}
                      >
                        <img
                          src={manga.coverImage}
                          alt={manga.title}
                          className="w-full h-full object-cover object-center transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/5" />

                        {/* Quick Preview Hover Indicator */}
                        <div className="absolute bottom-2 right-2 bg-white/95 px-2 py-1 border border-[#2d2d2d] text-xs font-bold flex items-center gap-1 shadow-[2px_2px_0px_#2d2d2d]"
                          style={{ borderRadius: WOBBLY_SM }}>
                          <Eye size={12} />
                          <span>Preview Draft</span>
                        </div>

                        {/* Vol Ribbon Badge */}
                        <div className="absolute top-2 left-2 bg-[#2d2d2d] text-white px-2 py-0.5 text-xs font-bold"
                          style={{ borderRadius: WOBBLY_SM }}>
                          {manga.volumeNumber}
                        </div>
                      </div>

                      {/* Title & Author */}
                      <h3
                        className="text-xl font-bold text-[#2d2d2d] line-clamp-1 group-hover:text-[#ff4d4d] transition-colors"
                        style={{ fontFamily: "'Kalam', cursive" }}
                      >
                        {manga.title}
                      </h3>
                      <p className="text-sm font-bold text-[#2d5da1] mb-1">
                        By {manga.author}
                      </p>
                      <p className="text-xs text-[#2d2d2d]/70 mb-2">
                        {manga.publisher}
                      </p>

                      {/* Rating Stars (Hand-drawn look) */}
                      <div className="flex items-center gap-1 text-xs font-bold text-[#2d2d2d]/80 mb-3">
                        <span className="text-[#ff4d4d] font-black">★ {manga.rating.toFixed(1)}</span>
                        <span>({manga.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                    </div>

                    {/* Card Bottom: Price & Action Buttons */}
                    <div className="pt-3 border-t border-dashed border-[#2d2d2d]/60 mt-2 space-y-3">
                      {/* Price display with line-through pencil style */}
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[#2d2d2d]">
                            {formatPrice(manga.priceUSD, manga.priceVND)}
                          </span>
                          {manga.originalPriceUSD && (
                            <span className="text-xs text-[#2d2d2d]/50 line-through">
                              {formatPrice(manga.originalPriceUSD)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#2d5da1] uppercase">
                          {manga.genre}
                        </span>
                      </div>

                      {/* Action Buttons: Preview & Add to Tote */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewingManga(manga);
                            setActivePageIndex(0);
                          }}
                          className="px-2 py-2 bg-[#e5e0d8] border-2 border-[#2d2d2d] text-xs font-bold shadow-[2px_2px_0px_#2d2d2d] hover:bg-[#2d5da1] hover:text-white transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
                          style={{ borderRadius: WOBBLY_SM }}
                        >
                          <BookOpen size={13} />
                          <span>Sample Draft</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(manga)}
                          className="px-2 py-2 bg-white border-2 border-[#2d2d2d] text-[#2d2d2d] text-xs font-bold shadow-[3px_3px_0px_#2d2d2d] hover:bg-[#ff4d4d] hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          style={{ borderRadius: WOBBLY_SM }}
                        >
                          <ShoppingCart size={13} />
                          <span>Add to Tote</span>
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
            4. MANGAKA DRAFTING TABLE & LORE SPOTLIGHT
        ========================================================================= */}
        <section className="relative my-24 sm:my-36">
          <div
            className="bg-[#fff9c4] border-[3px] border-[#2d2d2d] p-6 sm:p-8 md:p-10 shadow-[6px_6px_0px_#2d2d2d] relative"
            style={{ borderRadius: WOBBLY_LG }}
          >
            {/* Top Tape decoration */}
            <div
              className="absolute -top-3 left-1/3 w-28 h-6 bg-[#e5e0d8] opacity-85"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#2d2d2d] text-xs font-bold text-[#2d2d2d]"
                  style={{ borderRadius: WOBBLY_SM }}>
                  <PenTool size={13} className="text-[#2d5da1]" />
                  <span>INSIDE THE MANGAKA STUDIO</span>
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-bold text-[#2d2d2d]"
                  style={{ fontFamily: "'Kalam', cursive" }}
                >
                  The Anatomy of Traditional Japanese Inking
                </h3>

                {/* Speech Bubble Quote with Geometric Tail */}
                <div className="relative bg-white border-2 border-[#2d2d2d] p-4 shadow-[3px_3px_0px_#2d2d2d] my-3"
                  style={{ borderRadius: WOBBLY_MD }}>
                  <p className="text-base text-[#2d2d2d] italic">
                    "When inking, every stroke of the Zebra G-Pen carries the breath of the character.
                    Digital brushes are sharp, but paper grain remembers human imperfection."
                  </p>
                  <p className="text-xs font-bold text-[#ff4d4d] mt-2">
                    — Master Mangaka & Inker Archive
                  </p>

                  {/* Speech bubble tail */}
                  <div
                    className="absolute -bottom-3 left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-[#2d2d2d]"
                  />
                </div>

                <p className="text-sm text-[#2d2d2d]/80 leading-relaxed">
                  Every volume in this archive adheres to authentic 115mm × 176mm Japanese tankōbon dimensions,
                  featuring faithful translation notes and original sound effect lettering (onomatopoeia).
                </p>
              </div>

              {/* Mangaka Tool Stack */}
              <div className="space-y-3">
                {[
                  { tool: 'Zebra G-Pen Nib', desc: 'Dynamic pressure line-weight' },
                  { tool: 'Kaimei Drawing Ink', desc: 'Deep black matte waterproof' },
                  { tool: 'IC Screentone № 61', desc: 'Vintage halftone dot shadow' },
                  { tool: 'Kent Paper 135kg', desc: 'High-density bleeding resistance' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d] text-xs font-bold"
                    style={{ borderRadius: WOBBLY_SM }}
                  >
                    <div className="text-[#2d5da1]">{item.tool}</div>
                    <div className="text-[#2d2d2d]/70 font-normal">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. READER STICKY NOTE WALL (COMMUNITY CORKBOARD)
        ========================================================================= */}
        <section id="reader-notes" className="flex flex-col gap-12 sm:gap-16 my-24 sm:my-36">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-2">
            <div className="inline-block px-3 py-1 bg-[#e5e0d8] border-2 border-[#2d2d2d] text-xs font-bold mb-1"
              style={{ borderRadius: WOBBLY_SM }}>
              COMMUNITY CORKBOARD
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#2d2d2d]"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              Reader Sticky Notes & Theories
            </h2>
            <p className="text-base text-[#2d2d2d]/80">
              Pin your thoughts, chapter theories, or favorite panel moments directly onto the sketchbook wall.
            </p>
          </div>

          {/* Sticky Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-6">
            {communityNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 border-2 border-[#2d2d2d] shadow-[4px_4px_0px_#2d2d2d] relative flex flex-col justify-between h-48"
                style={{
                  backgroundColor: note.color,
                  borderRadius: WOBBLY_SM
                }}
              >
                {/* Red push-pin */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#ff4d4d] border border-[#2d2d2d] shadow-sm" />

                <div>
                  <span className="text-[10px] font-bold text-[#2d5da1] uppercase tracking-wider block mb-1">
                    #{note.tag}
                  </span>
                  <p className="text-sm font-bold text-[#2d2d2d] leading-snug">
                    "{note.text}"
                  </p>
                </div>

                <div className="pt-2 border-t border-dashed border-[#2d2d2d]/40 flex items-center justify-between text-xs font-bold text-[#2d2d2d]/70">
                  <span>@{note.author}</span>
                  <span>★</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add a Sticky Note Form - Extra top margin so it never touches sticky notes above */}
          <form
            onSubmit={handleAddNote}
            className="mt-16 sm:mt-24 bg-white border-[3px] border-[#2d2d2d] p-6 sm:p-7 shadow-[5px_5px_0px_#2d2d2d] flex flex-col sm:flex-row items-center gap-4"
            style={{ borderRadius: WOBBLY_MD }}
          >
            <input
              type="text"
              value={newNoteAuthor}
              onChange={(e) => setNewNoteAuthor(e.target.value)}
              placeholder="Your username..."
              className="w-full sm:w-44 px-3 py-2 border-2 border-[#2d2d2d] text-sm font-bold outline-none focus:border-[#2d5da1]"
              style={{ borderRadius: WOBBLY_SM }}
            />
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Scribble your theory or comment on a volume..."
              className="flex-1 w-full px-4 py-2 border-2 border-[#2d2d2d] text-sm font-bold outline-none focus:border-[#2d5da1]"
              style={{ borderRadius: WOBBLY_SM }}
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] font-bold text-sm shadow-[3px_3px_0px_#2d2d2d] hover:bg-[#e03131] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ borderRadius: WOBBLY_SM }}
            >
              <Pin size={14} />
              <span>Pin Note</span>
            </button>
          </form>
        </section>

        {/* =========================================================================
            6. HAND-DRAWN NEWSLETTER & PRE-ORDER DROP ALERT
        ========================================================================= */}
        <section className="relative mt-28 sm:mt-40 mb-20 sm:mb-28 pt-8">
          {/* Tape on top */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#e5e0d8] opacity-90 z-10"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
          />

          <div
            className="bg-white border-[3px] border-dashed border-[#2d2d2d] p-8 sm:p-10 text-center space-y-4 shadow-[6px_6px_0px_#2d2d2d]"
            style={{ borderRadius: WOBBLY_LG }}
          >
            <div className="w-12 h-12 rounded-full bg-[#fff9c4] border-2 border-[#2d2d2d] flex items-center justify-center mx-auto text-[#2d2d2d]">
              <Bookmark size={24} />
            </div>

            <h3
              className="text-2xl sm:text-3xl font-bold text-[#2d2d2d]"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              Never Miss a Manga Pre-Order Drop
            </h3>
            <p className="text-base text-[#2d2d2d]/80 max-w-md mx-auto">
              Get weekly alert postcards for Shonen Jump+, Kodansha limited releases, and Berserk deluxe reprints.
            </p>

            {newsletterSubscribed ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#fff9c4] border-2 border-[#2d2d2d] font-bold text-sm text-[#2d2d2d]"
                style={{ borderRadius: WOBBLY_SM }}
              >
                <Check size={16} className="text-[#2d5da1]" />
                <span>You are subscribed to the weekly drafting newsletter!</span>
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
                  placeholder="Enter your email for manga drops..."
                  className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-[#2d2d2d] text-sm font-bold outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20"
                  style={{ borderRadius: WOBBLY_SM }}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] font-bold text-sm shadow-[3px_3px_0px_#2d2d2d] hover:bg-[#e03131] transition-colors cursor-pointer whitespace-nowrap"
                  style={{ borderRadius: WOBBLY_SM }}
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </section>

      </div>

      {/* =========================================================================
          7. INTERACTIVE MANGA STORYBOARD / CHAPTER PREVIEW MODAL
      ========================================================================= */}
      {previewingManga && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-3xl bg-[#fdfbf7] border-[3px] border-[#2d2d2d] p-6 shadow-[8px_8px_0px_#000] overflow-hidden max-h-[90vh] flex flex-col"
            style={{ borderRadius: WOBBLY_MD }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#2d2d2d] mb-4">
              <div>
                <span className="text-xs font-bold text-[#2d5da1] uppercase">
                  MANGA DRAFT VIEWER · {previewingManga.volumeNumber}
                </span>
                <h3
                  className="text-2xl font-bold text-[#2d2d2d]"
                  style={{ fontFamily: "'Kalam', cursive" }}
                >
                  {previewingManga.title}
                </h3>
              </div>

              <button
                onClick={() => setPreviewingManga(null)}
                className="w-9 h-9 rounded-full bg-white border-2 border-[#2d2d2d] flex items-center justify-center hover:bg-[#ff4d4d] hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Body: Sample Pages Carousel */}
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="relative w-full h-[360px] sm:h-[420px] bg-neutral-900 border-2 border-[#2d2d2d] overflow-hidden flex items-center justify-center"
                style={{ borderRadius: WOBBLY_SM }}>
                <img
                  src={previewingManga.samplePages[activePageIndex] || previewingManga.coverImage}
                  alt={`Sample draft page ${activePageIndex + 1}`}
                  className="w-full h-full object-contain"
                />

                {/* Left / Right Page Controls */}
                {previewingManga.samplePages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePageIndex(prev => (prev - 1 + previewingManga.samplePages.length) % previewingManga.samplePages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-[#2d2d2d] flex items-center justify-center shadow-[2px_2px_0px_#2d2d2d] hover:bg-[#fff9c4] transition-colors cursor-pointer"
                      style={{ borderRadius: WOBBLY_SM }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setActivePageIndex(prev => (prev + 1) % previewingManga.samplePages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-[#2d2d2d] flex items-center justify-center shadow-[2px_2px_0px_#2d2d2d] hover:bg-[#fff9c4] transition-colors cursor-pointer"
                      style={{ borderRadius: WOBBLY_SM }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Page Indicator */}
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 border-2 border-[#2d2d2d] text-xs font-bold shadow-[2px_2px_0px_#2d2d2d]"
                  style={{ borderRadius: WOBBLY_SM }}
                >
                  Draft Page {activePageIndex + 1} of {previewingManga.samplePages.length}
                </div>
              </div>

              {/* Volume Synopsis */}
              <div className="bg-white p-4 border-2 border-[#2d2d2d]" style={{ borderRadius: WOBBLY_SM }}>
                <p className="text-xs uppercase font-bold text-[#2d5da1] mb-1">STORYBOARD SYNOPSIS</p>
                <p className="text-sm text-[#2d2d2d] leading-relaxed">
                  {previewingManga.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t-2 border-dashed border-[#2d2d2d] mt-4 flex items-center justify-between">
              <div className="text-xl font-bold text-[#2d2d2d]">
                {formatPrice(previewingManga.priceUSD, previewingManga.priceVND)}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewingManga(null)}
                  className="px-4 py-2 bg-[#e5e0d8] border-2 border-[#2d2d2d] text-sm font-bold shadow-[2px_2px_0px_#2d2d2d] hover:bg-neutral-300"
                  style={{ borderRadius: WOBBLY_SM }}
                >
                  Close Draft
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(previewingManga);
                    setPreviewingManga(null);
                  }}
                  className="px-6 py-2 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] text-sm font-bold shadow-[3px_3px_0px_#2d2d2d] hover:bg-[#e11d48] cursor-pointer flex items-center gap-2 transition-colors"
                  style={{ borderRadius: WOBBLY_SM }}
                >
                  <ShoppingCart size={15} />
                  <span>Add Volume to Tote</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
