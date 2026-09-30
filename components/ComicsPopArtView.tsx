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
  Flame,
  Star,
  Layers,
  Send,
  Pin,
  Zap,
  Shield,
  Award,
} from 'lucide-react';
import { Album } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

// ==========================================
// Soft Rounded Radius (matching Manga/Anime requested vibe)
// ==========================================
const ROUND_SM = '10px';
const ROUND_MD = '14px';
const ROUND_LG = '18px';

// ==========================================
// Comic Pop-Art Color Palette
// ==========================================
const COLORS = {
  yellow: '#fef08a',       // Pop Canary Yellow
  yellowLight: '#fef9c3',  // Pale Pop Paper
  yellowDark: '#ca8a04',
  red: '#ef4444',          // Heroic Comic Red
  redDeep: '#dc2626',
  redLight: '#fee2e2',
  blue: '#38bdf8',         // Marvel/DC Electric Cyan Blue
  blueDark: '#0284c7',
  blueLight: '#e0f2fe',
  black: '#09090b',        // Ink Outline
  white: '#ffffff',
  paper: '#fffdf5',        // Newsprint Paper Canvas
};

// ==========================================
// Comic Item Model
// ==========================================
export interface ComicItem {
  id: string;
  title: string;
  issue: string;
  publisher: 'Marvel' | 'DC Comics' | 'Image Comics' | 'Vertigo' | 'Skybound' | 'Dark Horse';
  genre: 'Marvel' | 'DC Comics' | 'Image Comics' | 'Sci-Fi' | 'Horror' | 'Noir';
  writer: string;
  artist: string;
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
  cgcGrade?: string;
  format: string;
}

// Curated Comic Books Catalog
const COMIC_CATALOG: ComicItem[] = [
  {
    id: 'comic-spiderman-blue',
    title: 'Spider-Man: Blue - Deluxe Gallery Edition',
    issue: 'Complete Miniseries HC',
    publisher: 'Marvel',
    genre: 'Marvel',
    writer: 'Jeph Loeb',
    artist: 'Tim Sale',
    priceUSD: 29.99,
    priceVND: 745000,
    originalPriceUSD: 39.99,
    rating: 4.96,
    reviewCount: 3120,
    tag: '★ EISNER AWARD WINNER',
    coverImage: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=600&auto=format&fit=crop&q=80',
    description: 'The heartbreaking and nostalgic tale of Peter Parker looking back on his first love, Gwen Stacy. Rendered in Tim Sale\'s timeless watercolor-wash aesthetic with oversized gallery pages.',
    previewImages: [
      'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 28,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Oversized Hardcover',
  },
  {
    id: 'comic-batman-long-halloween',
    title: 'Batman: The Long Halloween - Noir Masterwork',
    issue: 'Special Anniversary Box',
    publisher: 'DC Comics',
    genre: 'DC Comics',
    writer: 'Jeph Loeb',
    artist: 'Tim Sale',
    priceUSD: 34.99,
    priceVND: 870000,
    originalPriceUSD: 44.99,
    rating: 4.98,
    reviewCount: 4890,
    tag: '⚡ ESSENTIAL GOTHAM NOIR',
    coverImage: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=600&auto=format&fit=crop&q=80',
    description: 'During Batman\'s early years, a mysterious serial killer dubbed "Holiday" strikes on every major holiday. A landmark detective noir mystery that defined modern Gotham City lore.',
    previewImages: [
      'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 19,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Deluxe Slipcase Hardcover',
  },
  {
    id: 'comic-saga-deluxe-1',
    title: 'Saga: Deluxe Hardcover Edition Book One',
    issue: 'Collects Issues #1-18',
    publisher: 'Image Comics',
    genre: 'Image Comics',
    writer: 'Brian K. Vaughan',
    artist: 'Fiona Staples',
    priceUSD: 39.99,
    priceVND: 990000,
    originalPriceUSD: 49.99,
    rating: 4.99,
    reviewCount: 5210,
    tag: '★ HUGO & HARVEY WINNER',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    description: 'An epic space opera and fantasy masterpiece following two star-crossed soldiers from opposite sides of a galactic war risking everything to protect their newborn daughter, Hazel.',
    previewImages: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 22,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Oversized Deluxe HC',
  },
  {
    id: 'comic-xmen-inferno',
    title: 'X-Men: Inferno Climax Holographic Foil Variant',
    issue: 'Limited Facsimile Edition #1',
    publisher: 'Marvel',
    genre: 'Marvel',
    writer: 'Chris Claremont',
    artist: 'Marc Silvestri',
    priceUSD: 24.99,
    priceVND: 620000,
    originalPriceUSD: 29.99,
    rating: 4.88,
    reviewCount: 1980,
    tag: '🔥 FOIL VIRGIN VARIANT',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    description: 'The monumental crossover event where Madelyne Pryor claims her throne as the Goblin Queen and Manhattan descends into demonic chaos. Exclusive embossed silver foil variant.',
    previewImages: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 14,
    cgcGrade: 'CGC 9.6 NM+',
    format: 'Single Issue Foil Slab',
  },
  {
    id: 'comic-watchmen-absolute',
    title: 'Watchmen: The Absolute Edition Master Collection',
    issue: 'Complete 12-Issue Omnibus',
    publisher: 'DC Comics',
    genre: 'DC Comics',
    writer: 'Alan Moore',
    artist: 'Dave Gibbons',
    priceUSD: 74.99,
    priceVND: 1860000,
    originalPriceUSD: 99.99,
    rating: 5.0,
    reviewCount: 6840,
    tag: '👑 TIME 100 GREATEST NOVELS',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    description: 'The graphic novel that transformed comic literature forever. Re-mastered line art, restored original color separations by John Higgins, and extensive creator bonus annotations.',
    previewImages: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 11,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Leatherette Slipcase Omnibus',
  },
  {
    id: 'comic-spawn-300',
    title: 'Spawn: Origins Anniversary Vault #300',
    issue: 'Record-Breaking Issue #300',
    publisher: 'Image Comics',
    genre: 'Image Comics',
    writer: 'Todd McFarlane',
    artist: 'Greg Capullo & J. Scott Campbell',
    priceUSD: 22.99,
    priceVND: 570000,
    rating: 4.92,
    reviewCount: 2430,
    tag: '⚡ GUINNESS RECORD DROP',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    description: 'Todd McFarlane breaks the Guinness World Record for the longest-running creator-owned superhero comic book series in comic book history with this historic double-sized issue.',
    previewImages: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 35,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Deluxe Prestige Single Issue',
  },
  {
    id: 'comic-sandman-overture',
    title: 'The Sandman: Overture 10th Anniversary Foil',
    issue: 'Complete Prequel Deluxe',
    publisher: 'Vertigo',
    genre: 'Horror',
    writer: 'Neil Gaiman',
    artist: 'J.H. Williams III',
    priceUSD: 32.99,
    priceVND: 820000,
    originalPriceUSD: 39.99,
    rating: 4.97,
    reviewCount: 2890,
    tag: '🌌 MIND-BENDING KALEIDOSCOPE',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    description: 'Morpheus, the Lord of the Dreaming, journeys to the edge of the universe to undo a cosmic catastrophe. J.H. Williams III delivers some of the most intricate comic panel work ever created.',
    previewImages: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 16,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Oversized Hardcover with Gatefold',
  },
  {
    id: 'comic-invincible-compendium',
    title: 'Invincible: The Ultimate Compendium Vol. 1',
    issue: 'Collects Issues #1-47',
    publisher: 'Skybound',
    genre: 'Sci-Fi',
    writer: 'Robert Kirkman',
    artist: 'Cory Walker & Ryan Ottley',
    priceUSD: 49.99,
    priceVND: 1240000,
    originalPriceUSD: 64.99,
    rating: 4.98,
    reviewCount: 4320,
    tag: '⚡ GLOBAL STREAMING PHENOMENON',
    coverImage: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=600&auto=format&fit=crop&q=80',
    description: 'The monumental superhero saga of Mark Grayson as he learns that being the son of Omni-Man comes with terrifying responsibilities. Massive 1,000+ page compendium.',
    previewImages: [
      'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 25,
    cgcGrade: 'CGC 9.8 NM/M',
    format: '1,024-Page Softcover Compendium',
  },
  {
    id: 'comic-daredevil-born-again',
    title: 'Daredevil: Born Again Artist Edition',
    issue: 'Complete Milestone Storyline',
    publisher: 'Marvel',
    genre: 'Marvel',
    writer: 'Frank Miller',
    artist: 'David Mazzucchelli',
    priceUSD: 49.99,
    priceVND: 1240000,
    originalPriceUSD: 59.99,
    rating: 4.99,
    reviewCount: 4210,
    tag: '👑 MASTERWORK TRAGEDY',
    coverImage: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=600&auto=format&fit=crop&q=80',
    description: 'And I have shown him... that a man without hope is a man without fear. Frank Miller and David Mazzucchelli craft the definitive masterpiece of comic redemption.',
    previewImages: [
      'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 16,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Deluxe Gallery Hardcover',
  },
  {
    id: 'comic-dark-knight-returns',
    title: 'Batman: The Dark Knight Returns Foil Gallery Slipcase',
    issue: 'Definitive Graphic Novel',
    publisher: 'DC Comics',
    genre: 'DC Comics',
    writer: 'Frank Miller',
    artist: 'Frank Miller & Klaus Janson',
    priceUSD: 59.99,
    priceVND: 1490000,
    originalPriceUSD: 69.99,
    rating: 5.0,
    reviewCount: 7850,
    tag: '⚡ LEGENDARY REVOLUTION',
    coverImage: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=600&auto=format&fit=crop&q=80',
    description: 'The graphic novel that revolutionized modern superhero comics in 1986. An aging Bruce Wayne returns to a dystopian Gotham to face the Mutant Gang, the Joker, and the Man of Steel.',
    previewImages: [
      'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 22,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Leatherette Slipcase Hardcover',
  },
  {
    id: 'comic-hellboy-omnibus-vol1',
    title: 'Hellboy: Seed of Destruction Library Edition Vol. 1',
    issue: 'Library Edition Vol. 1',
    publisher: 'Dark Horse',
    genre: 'Horror',
    writer: 'Mike Mignola',
    artist: 'Mike Mignola',
    priceUSD: 38.50,
    priceVND: 950000,
    rating: 4.96,
    reviewCount: 3120,
    tag: '🔥 GOTHIC SHADOWS',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    description: 'Mike Mignola’s iconic use of deep chiaroscuro black shadows, folklore terror, and the Right Hand of Doom in an oversized clothbound coffee table tome.',
    previewImages: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 19,
    cgcGrade: 'CGC 9.6 NM+',
    format: 'Oversized Clothbound Hardcover',
  },
  {
    id: 'comic-allstar-superman-absolute',
    title: 'All-Star Superman: The Absolute Deluxe Edition',
    issue: 'Complete 12-Issue Masterpiece',
    publisher: 'DC Comics',
    genre: 'DC Comics',
    writer: 'Grant Morrison',
    artist: 'Frank Quitely',
    priceUSD: 79.99,
    priceVND: 1980000,
    originalPriceUSD: 99.99,
    rating: 4.99,
    reviewCount: 5410,
    tag: '👑 THE GREATEST SUPERMAN TALE',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    description: 'You will give the people of Earth an ideal to strive towards. Grant Morrison and Frank Quitely deliver a timeless, mythic celebration of the Man of Tomorrow in an Absolute slipcase.',
    previewImages: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 12,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Absolute Slipcase Omnibus',
  },
  {
    id: 'comic-marvels-alex-ross',
    title: 'Marvels 30th Anniversary Masterwork Foil Edition',
    issue: 'Special Curated Edition',
    publisher: 'Marvel',
    genre: 'Marvel',
    writer: 'Kurt Busiek',
    artist: 'Alex Ross',
    priceUSD: 44.99,
    priceVND: 1120000,
    rating: 4.98,
    reviewCount: 4620,
    tag: '✨ PHOTOREALISTIC GOUACHE',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    description: 'The birth of the Marvel Universe viewed through the lens of ordinary photojournalist Phil Sheldon. Alex Ross’s breathtaking hand-painted gouache illustrations in oversized gold foil format.',
    previewImages: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 25,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Deluxe Hardcover with Dust Jacket',
  },
  {
    id: 'comic-monstress-deluxe-book1',
    title: 'Monstress: Deluxe Hardcover Book One',
    issue: 'Collects Issues #1-18',
    publisher: 'Image Comics',
    genre: 'Image Comics',
    writer: 'Marjorie Liu',
    artist: 'Sana Takeda',
    priceUSD: 42.00,
    priceVND: 1040000,
    rating: 4.97,
    reviewCount: 3820,
    tag: '🌸 ART DECO FANTASY',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    description: 'Set in an alternate 1900s Asia blending Art Deco aesthetics with Kaiju horror. Sana Takeda’s Eisner and Hugo Award-winning opulent linework presented in a lush gold-stamped clothbound spine.',
    previewImages: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 17,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Deluxe Clothbound Hardcover',
  },
  {
    id: 'comic-black-hammer-library',
    title: 'Black Hammer: Library Edition Vol. 1',
    issue: 'Library Edition Vol. 1',
    publisher: 'Dark Horse',
    genre: 'Sci-Fi',
    writer: 'Jeff Lemire',
    artist: 'Dean Ormston',
    priceUSD: 36.00,
    priceVND: 890000,
    rating: 4.95,
    reviewCount: 2450,
    tag: '★ EISNER BEST NEW SERIES',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    description: 'Once they were heroes, but now they are trapped in a mysterious timeless midwestern town. A melancholic love letter to Golden Age comic tropes by Jeff Lemire and Dean Ormston.',
    previewImages: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 20,
    cgcGrade: 'CGC 9.8 NM/M',
    format: 'Library Edition Hardcover',
  },
];

// Helper to convert Comic item to Album format for cart
function comicToAlbum(item: ComicItem): Album {
  return {
    id: item.id,
    title: item.title,
    artist: `${item.writer} & ${item.artist}`,
    artistId: item.publisher.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    category: 'Comics',
    priceUSD: item.priceUSD,
    priceVND: item.priceVND,
    originalPriceUSD: item.originalPriceUSD,
    coverImage: item.coverImage,
    galleryImages: item.previewImages,
    type: 'Comic Book Edition',
    releaseDate: '2025-02-10',
    tag: item.tag,
    rating: item.rating,
    reviewCount: item.reviewCount,
    popularityScore: 99,
    stock: item.stock,
    description: item.description,
    versions: [
      { id: `${item.id}-standard`, name: `Standard ${item.format}`, extraPriceUSD: 0 },
      { id: `${item.id}-variant`, name: 'Virgin Foil Variant (+COA)', extraPriceUSD: 10.0 },
    ],
    inclusions: [
      `Official ${item.publisher} First Printing`,
      'Archival Mylar Sleeve with Acid-Free Board',
      'Certificate of Authenticity with Hologram Seal',
      'Exclusive Comic Creator Interview Art Print',
    ],
    photocards: [
      {
        member: `${item.writer} (Writer)`,
        image: item.coverImage,
      },
    ],
    tracks: [
      { id: 1, title: 'Issue Opening Scene: Shadows Across the Skyline', duration: 'Reading: 12m', isTitleTrack: true },
      { id: 2, title: 'Full-Page Splash: Climactic Battle Confrontation', duration: 'Reading: 15m', isTitleTrack: false },
      { id: 3, title: 'Variant Cover Gallery & Sketchbook Breakdown', duration: 'Gallery: 8m', isTitleTrack: false },
    ],
    reviews: [
      {
        id: `rev-${item.id}-1`,
        userName: 'ComicCollector99',
        avatar: item.coverImage,
        rating: 5,
        comment: 'Arrived in immaculate CGC 9.8 condition. The oversized gallery presentation is breathtaking!',
        date: '2025-02-18',
        fandomTag: 'Comic Aficionado',
      },
    ],
  };
}

// Comic Heroic Spotlight Banners
export interface ComicBanner {
  id: string;
  title: string;
  publisher: string;
  badge: string;
  tag: string;
  desc: string;
  image: string;
  creators: string;
  targetId?: string;
}

const COMIC_SPOTLIGHT_BANNERS: ComicBanner[] = [
  {
    id: 'cb-spiderman',
    title: 'Spider-Man: Across the Multiverse & Secret Wars',
    publisher: 'Marvel Comics',
    badge: '★ MARVEL PREMIERE OMNIBUS',
    tag: 'VIRGIN FOIL VARIANT',
    desc: 'Miles Morales, Peter Parker, and Gwen Stacy unite across the dimensional web. Includes oversized double-page spreads and behind-the-scenes concept sketches.',
    image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1600&auto=format&fit=crop&q=85',
    creators: 'Brian Michael Bendis & Sara Pichelli',
    targetId: 'comic-spider-man-miles-omnibus',
  },
  {
    id: 'cb-batman',
    title: 'Batman: The Dark Knight Returns 40th Memorial',
    publisher: 'DC Comics',
    badge: '★ DC BLACK LABEL MASTERWORK',
    tag: 'LEATHERETTE SLIPCASE SLAB',
    desc: 'Frank Miller\'s dystopian masterpiece that reshaped the comic medium forever. Remastered directly from the original hand-lettered ink boards.',
    image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1600&auto=format&fit=crop&q=85',
    creators: 'Frank Miller & Klaus Janson',
    targetId: 'comic-batman-dark-knight-returns',
  },
  {
    id: 'cb-invincible',
    title: 'Invincible: The Complete Bloodline Compendium',
    publisher: 'Image Comics / Skybound',
    badge: '★ SKYBOUND HARDCOVER SAGA',
    tag: 'UNCUT 144-ISSUE RUN',
    desc: 'Mark Grayson discovers the brutal truth of the Viltrumite Empire. Robert Kirkman\'s legendary superhero saga collected in oversized foil hardcover.',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=85',
    creators: 'Robert Kirkman & Ryan Ottley',
    targetId: 'comic-invincible-compendium-vol1',
  },
  {
    id: 'cb-watchmen',
    title: 'Watchmen: The Absolute Annotated Edition',
    publisher: 'DC / Vertigo',
    badge: '★ HUGO AWARD HISTORIC GRAPHIC NOVEL',
    tag: 'SLIPCASE DEFINITIVE EDITION',
    desc: 'Who watches the watchmen? Alan Moore and Dave Gibbons’ revolutionary Cold War deconstruction of superhero archetypes with complete script notes.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=85',
    creators: 'Alan Moore & Dave Gibbons',
    targetId: 'comic-watchmen-deluxe',
  },
];

// Featured CGC Graded Slabs for Hero Showcase
export interface HeroSlab {
  id: string;
  title: string;
  publisher: string;
  creators: string;
  grade: string;
  gradeBadge: string;
  tag: string;
  priceUSD: number;
  cover: string;
  quote: string;
  icon: string;
  shortName: string;
}

const FEATURED_HERO_SLABS: HeroSlab[] = [
  {
    id: 'comic-batman-long-halloween',
    title: 'Batman: The Long Halloween #1',
    publisher: 'DC BLACK LABEL ARCHIVE',
    creators: 'Jeph Loeb & Tim Sale',
    grade: 'CGC 9.8 WHITE PAGES',
    gradeBadge: 'CGC 9.8 NM/M',
    tag: 'BATMAN NOIR',
    priceUSD: 45.00,
    cover: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    quote: '"Spider-Man: Blue & Long Halloween restocked in certified slabs. All orders ship with archival corner guards."',
    icon: '🦇',
    shortName: 'Batman #1',
  },
  {
    id: 'comic-spiderman-blue',
    title: 'Spider-Man: Blue - Deluxe Gallery',
    publisher: 'MARVEL MODERN MASTERWORK',
    creators: 'Jeph Loeb & Tim Sale',
    grade: 'CGC 9.8 GEM MINT',
    gradeBadge: 'CGC 9.8 MINT',
    tag: 'EISNER WINNER',
    priceUSD: 49.00,
    cover: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=600&auto=format&fit=crop&q=80',
    quote: '"The heartbreaking tale of Peter Parker and Gwen Stacy rendered in timeless watercolor tones."',
    icon: '🕷️',
    shortName: 'Spider-Man',
  },
  {
    id: 'comic-saga-deluxe-1',
    title: 'Saga: Book One Deluxe Edition',
    publisher: 'IMAGE / SKYBOUND VAULT',
    creators: 'Brian K. Vaughan & Fiona Staples',
    grade: 'CGC 9.8 1ST PRINT',
    gradeBadge: 'CGC 9.8 NM/M',
    tag: 'SPACE OPERA',
    priceUSD: 39.99,
    cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    quote: '"Award-winning sci-fi odyssey in oversized hardcover with gold-stamped foil slipcase."',
    icon: '🚀',
    shortName: 'Saga Vol. 1',
  },
];

export const ComicsPopArtView: React.FC = () => {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice, setIsCartOpen } = useCartWishlist();

  // Filters & State
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewingComic, setPreviewingComic] = useState<ComicItem | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [featuredSlabIdx, setFeaturedSlabIdx] = useState(0);

  // Auto rotate banner every 6s
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % COMIC_SPOTLIGHT_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Community Dialogue Wall State
  const [communityNotes, setCommunityNotes] = useState([
    {
      id: 'cn-1',
      author: 'GothamDetective',
      text: 'Tim Sale\'s shadows in The Long Halloween are unmatched. The splash pages of Calendar Man are pure art! 🦇',
      color: COLORS.yellow,
      rotation: '-rotate-2',
      tag: 'Batman Noir',
    },
    {
      id: 'cn-2',
      author: 'WebSlinger_88',
      text: 'Spider-Man: Blue made me cry at the end. Jeph Loeb captured Peter Parker\'s grief and optimism perfectly.',
      color: COLORS.blueLight,
      rotation: 'rotate-1',
      tag: 'Spider-Man',
    },
    {
      id: 'cn-3',
      author: 'CosmicVoyager',
      text: 'Saga is the best comic of the 21st century. Fiona Staples\' character designs are legendary! 🚀',
      color: COLORS.redLight,
      rotation: '-rotate-1',
      tag: 'Image Comics',
    },
    {
      id: 'cn-4',
      author: 'WatchmenScholar',
      text: 'Absolute Watchmen in oversized slipcase format lets you see every detail of Dave Gibbons\' nine-panel grid. ⏱️',
      color: COLORS.white,
      rotation: 'rotate-2',
      tag: 'DC Absolute',
    },
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('');

  // Filtered Items
  const filteredComics = useMemo(() => {
    return COMIC_CATALOG.filter((item) => {
      if (selectedGenre !== 'all' && item.genre !== selectedGenre) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inWriter = item.writer.toLowerCase().includes(q);
        const inArtist = item.artist.toLowerCase().includes(q);
        const inPublisher = item.publisher.toLowerCase().includes(q);
        const inTag = item.tag.toLowerCase().includes(q);
        if (!inTitle && !inWriter && !inArtist && !inPublisher && !inTag) return false;
      }
      return true;
    });
  }, [selectedGenre, searchQuery]);

  // Handle Add to Cart
  const handleAddToCart = (item: ComicItem) => {
    const album = comicToAlbum(item);
    addToCart(album, `${item.id}-standard`, 1);
    setAddedToast(item.title);
    setTimeout(() => setAddedToast(null), 3500);
  };

  // Handle Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote = {
      id: `cn-${Date.now()}`,
      author: newNoteAuthor.trim() || 'Anonymous Reader',
      text: newNoteText.trim(),
      color: COLORS.yellow,
      rotation: Math.random() > 0.5 ? 'rotate-1' : '-rotate-2',
      tag: 'Comics Fan',
    };
    setCommunityNotes([newNote, ...communityNotes]);
    setNewNoteText('');
    setNewNoteAuthor('');
  };

  return (
    <div
      className="comics-pop-art-root w-full relative text-[#09090b] py-8 px-4 sm:px-6 md:px-8 overflow-hidden select-none"
      style={{
        backgroundColor: COLORS.yellowLight,
        backgroundImage: `radial-gradient(${COLORS.red}28 1.5px, transparent 1.5px)`,
        backgroundSize: '20px 20px',
        fontFamily: "'Patrick Hand', cursive, sans-serif",
      }}
    >
      {/* Toast Notification */}
      {addedToast && (
        <div
          className="fixed bottom-6 right-6 z-50 p-4 flex items-center gap-3 animate-bounce"
          style={{
            borderRadius: ROUND_MD,
            backgroundColor: COLORS.yellow,
            border: `3px solid ${COLORS.black}`,
            boxShadow: `4px 4px 0px ${COLORS.black}`,
          }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: COLORS.red, borderRadius: ROUND_SM }}
          >
            ✓
          </div>
          <div>
            <p className="text-xs uppercase font-bold" style={{ color: COLORS.black }}>Added to Pull Box!</p>
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
            1. HERO SECTION: POP-ART COMIC BOOK VAULT
        ========================================================================= */}
        <section className="relative pt-6 pb-6">
          {/* Decorative Comic Sound Effect Pill */}
          <div
            className="absolute -top-2 left-12 w-28 h-3 z-20 pointer-events-none"
            style={{ backgroundColor: COLORS.red, borderRadius: ROUND_SM }}
          />
          <div
            className="absolute -top-2 right-16 w-20 h-3 z-20 pointer-events-none"
            style={{ backgroundColor: COLORS.blue, borderRadius: ROUND_SM }}
          />

          {/* Main Hero Container */}
          <div
            className="relative p-6 sm:p-10 md:p-12"
            style={{
              borderRadius: ROUND_LG,
              backgroundColor: COLORS.white,
              border: `3.5px solid ${COLORS.black}`,
              boxShadow: `8px 8px 0px ${COLORS.black}`,
            }}
          >
            {/* Corner action badges */}
            <div className="absolute top-3 left-3 text-xs font-mono text-black/40 pointer-events-none font-bold">
              ★ GOLDEN AGE № 1939 ★
            </div>
            <div className="absolute bottom-3 right-3 text-xs font-mono text-black/40 pointer-events-none font-bold">
              ★ FIRST PRINTING ARCHIVE ★
            </div>

            {/* Balanced 12-Column Responsive Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column (7 cols): Heading, Narrative, Actions & Universe Badges */}
              <div className="lg:col-span-7 space-y-5">
                {/* Official Badge */}
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.red,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `2px 2px 0px ${COLORS.black}`,
                    color: COLORS.white,
                  }}
                >
                  <Shield size={16} className="text-white" />
                  <span className="text-xs font-bold tracking-wide uppercase">
                    OFFICIAL COMIC VAULT &amp; FIRST EDITIONS
                  </span>
                </div>

                {/* Hero Title */}
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-wide text-black"
                  style={{ fontFamily: "'Bangers', 'Kalam', cursive, sans-serif", letterSpacing: '0.04em' }}
                >
                  Pop-Art Comic Vault!
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-sans max-w-xl">
                  Rare first printings, deluxe oversized omnibuses, virgin holographic foil variants, and CGC 9.8 graded slabs from Marvel, DC Comics, Image, and Vertigo.
                </p>

                {/* CTA Action Buttons */}
                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <a
                    href="#comic-catalog"
                    className="inline-flex items-center gap-2 px-6 py-3 font-bold text-base transition-all cursor-pointer hover:translate-y-[-2px]"
                    style={{
                      borderRadius: ROUND_SM,
                      backgroundColor: COLORS.red,
                      border: `3px solid ${COLORS.black}`,
                      boxShadow: `4px 4px 0px ${COLORS.black}`,
                      color: COLORS.white,
                    }}
                  >
                    <span>EXPLORE CATALOG</span>
                    <ArrowRight size={18} strokeWidth={3} />
                  </a>

                  <a
                    href="#comic-community"
                    className="inline-flex items-center gap-2 px-5 py-3 font-bold text-base transition-all cursor-pointer hover:translate-y-[-2px]"
                    style={{
                      borderRadius: ROUND_SM,
                      backgroundColor: COLORS.yellow,
                      border: `3px solid ${COLORS.black}`,
                      boxShadow: `4px 4px 0px ${COLORS.blueDark}`,
                      color: COLORS.black,
                    }}
                  >
                    <Zap size={16} />
                    <span>FAN SOUNDBOARD</span>
                  </a>
                </div>

                {/* Universe Quick Pills */}
                <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="text-neutral-500 font-bold text-[11px] uppercase mr-1">KEY UNIVERSES:</span>
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 border border-black font-bold" style={{ borderRadius: ROUND_SM }}>
                    ⚡ Marvel
                  </span>
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 border border-black font-bold" style={{ borderRadius: ROUND_SM }}>
                    🦇 DC Comics
                  </span>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-black font-bold" style={{ borderRadius: ROUND_SM }}>
                    🩸 Image / Skybound
                  </span>
                  <span className="px-2.5 py-1 bg-neutral-100 text-neutral-900 border border-black font-bold" style={{ borderRadius: ROUND_SM }}>
                    💀 Dark Horse
                  </span>
                </div>

                {/* Trust Perks */}
                <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-600 border-t border-black/15 pt-3">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Check size={14} strokeWidth={3} /> 100% CGC 9.8 Certified
                  </span>
                  <span className="flex items-center gap-1 text-sky-700">
                    <Check size={14} strokeWidth={3} /> Free Mylar Bag &amp; Board
                  </span>
                  <span className="flex items-center gap-1 text-neutral-800">
                    <Check size={14} strokeWidth={3} /> Armored Box Shipping
                  </span>
                </div>
              </div>

              {/* Right Column (5 cols): Rich Featured Slab Showcase Card */}
              <div className="lg:col-span-5">
                <div
                  className="p-5 relative overflow-hidden"
                  style={{
                    borderRadius: ROUND_MD,
                    backgroundColor: COLORS.yellow,
                    border: `3.5px solid ${COLORS.black}`,
                    boxShadow: `6px 6px 0px ${COLORS.black}`,
                  }}
                >
                  {/* Comic Action Sound Burst Badge */}
                  <div
                    className="absolute -top-1 -right-1 px-3 py-1 bg-[#ef4444] text-white font-black text-xs uppercase border-2 border-black rotate-3 shadow-[2px_2px_0px_#000] z-20"
                    style={{ fontFamily: "'Bangers', cursive", letterSpacing: '0.05em' }}
                  >
                    POW! HOT DROP
                  </div>

                  {/* Header bar */}
                  <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-black">
                    <span className="font-bold text-xs uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                      <Sparkles size={14} />
                      ★ NCBD ISSUE OF THE WEEK
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-black text-white px-2 py-0.5" style={{ borderRadius: ROUND_SM }}>
                      {FEATURED_HERO_SLABS[featuredSlabIdx].gradeBadge}
                    </span>
                  </div>

                  {/* Showcase Body: Cover Image + Issue Details */}
                  <div className="mt-4 flex gap-4">
                    {/* Graded Comic Slab Mockup Frame */}
                    <div 
                      className="w-32 shrink-0 bg-white border-2 border-black overflow-hidden shadow-[3px_3px_0px_#000] relative"
                      style={{ borderRadius: ROUND_SM }}
                    >
                      {/* CGC Grade Label Header */}
                      <div className="bg-[#0284c7] text-white text-[9px] font-mono font-black text-center py-0.5 uppercase border-b border-black">
                        {FEATURED_HERO_SLABS[featuredSlabIdx].grade}
                      </div>
                      <img
                        src={FEATURED_HERO_SLABS[featuredSlabIdx].cover}
                        alt={FEATURED_HERO_SLABS[featuredSlabIdx].title}
                        className="w-full h-40 object-cover"
                      />
                    </div>

                    {/* Issue Metadata & Instant Pull */}
                    <div className="flex-1 flex flex-col justify-between space-y-2 text-left">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 block">
                          {FEATURED_HERO_SLABS[featuredSlabIdx].publisher}
                        </span>
                        <h4 
                          className="font-bold text-base text-black leading-tight mt-0.5 line-clamp-2"
                          style={{ fontFamily: "'Bangers', 'Kalam', cursive", letterSpacing: '0.02em' }}
                        >
                          {FEATURED_HERO_SLABS[featuredSlabIdx].title}
                        </h4>
                        <p className="text-xs text-neutral-700 font-sans mt-1">
                          {FEATURED_HERO_SLABS[featuredSlabIdx].creators}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-black/20 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-500 font-mono block">COLLECTOR PRICE</span>
                          <span className="text-lg font-black text-red-600 font-mono leading-none">
                            ${FEATURED_HERO_SLABS[featuredSlabIdx].priceUSD.toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            const found = COMIC_CATALOG.find((c) => c.id === FEATURED_HERO_SLABS[featuredSlabIdx].id);
                            if (found) handleAddToCart(found);
                          }}
                          className="px-3 py-1.5 bg-black hover:bg-red-600 text-white text-xs font-bold uppercase transition-colors border border-black shadow-[2px_2px_0px_#000] inline-flex items-center gap-1 cursor-pointer"
                          style={{ borderRadius: ROUND_SM }}
                        >
                          <ShoppingCart size={13} />
                          <span>PULL BOX</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Speech Bubble Quote */}
                  <div className="mt-4 p-2.5 bg-white border-2 border-black text-xs font-sans text-neutral-800 leading-snug relative" style={{ borderRadius: ROUND_SM }}>
                    <p className="italic">
                      {FEATURED_HERO_SLABS[featuredSlabIdx].quote}
                    </p>
                  </div>

                  {/* Interactive Slab Switcher Tabs */}
                  <div className="mt-3 pt-2.5 border-t border-black/20 flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-black/70 shrink-0">
                      KEY SLABS:
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {FEATURED_HERO_SLABS.map((slab, sIdx) => (
                        <button
                          key={slab.id}
                          onClick={() => setFeaturedSlabIdx(sIdx)}
                          className={`px-2.5 py-1 text-xs font-bold transition-all border border-black cursor-pointer ${
                            featuredSlabIdx === sIdx
                              ? 'bg-[#ef4444] text-white shadow-[2px_2px_0px_#000]'
                              : 'bg-white hover:bg-neutral-100 text-black'
                          }`}
                          style={{ borderRadius: ROUND_SM }}
                        >
                          <span>{slab.icon} {slab.shortName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Stats Counter */}
            <div className="mt-10 pt-6 border-t-2 border-dashed grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ borderColor: COLORS.black }}>
              {[
                { number: '120K+', label: 'Comics Delivered', bg: COLORS.white },
                { number: '50+', label: 'Legendary Creators', bg: COLORS.yellowLight },
                { number: 'CGC 9.8', label: 'Certified Near-Mint', bg: COLORS.blueLight },
                { number: '100%', label: 'Bagged & Boarded', bg: COLORS.redLight },
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
                    style={{ fontFamily: "'Bangers', 'Kalam', cursive", color: COLORS.black, letterSpacing: '0.04em' }}
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
            FEATURED COMIC HEROIC SPOTLIGHT BANNER CAROUSEL
        ========================================================================= */}
        <section className="relative">
          {/* Top Decorative Comic Action Pills */}
          <div
            className="absolute -top-3 left-10 w-28 h-3.5 z-20 pointer-events-none"
            style={{ backgroundColor: COLORS.red, borderRadius: ROUND_SM }}
          />
          <div
            className="absolute -top-3 right-12 w-20 h-3.5 z-20 pointer-events-none"
            style={{ backgroundColor: COLORS.yellow, borderRadius: ROUND_SM }}
          />

          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: ROUND_LG,
              backgroundColor: COLORS.white,
              border: `3.5px solid ${COLORS.black}`,
              boxShadow: `8px 8px 0px ${COLORS.black}`,
            }}
          >
            {/* Banner Slide Container */}
            <div className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[460px] flex flex-col justify-end p-6 sm:p-10 md:p-12 overflow-hidden">
              {/* Background Art */}
              <img
                src={COMIC_SPOTLIGHT_BANNERS[currentBannerIdx].image}
                alt={COMIC_SPOTLIGHT_BANNERS[currentBannerIdx].title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />

              {/* Ben-Day Halftone Dot Overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(${COLORS.red} 2px, transparent 2px)`,
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Banner Content Container */}
              <div className="relative z-10 max-w-3xl space-y-3.5 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white"
                    style={{
                      borderRadius: ROUND_SM,
                      backgroundColor: COLORS.red,
                      border: `2px solid ${COLORS.black}`,
                      boxShadow: `2px 2px 0px ${COLORS.black}`,
                    }}
                  >
                    {COMIC_SPOTLIGHT_BANNERS[currentBannerIdx].badge}
                  </span>
                  <span
                    className="px-3 py-1 text-xs font-bold uppercase text-black"
                    style={{
                      borderRadius: ROUND_SM,
                      backgroundColor: COLORS.yellow,
                      border: `2px solid ${COLORS.black}`,
                      boxShadow: `2px 2px 0px ${COLORS.black}`,
                    }}
                  >
                    {COMIC_SPOTLIGHT_BANNERS[currentBannerIdx].tag}
                  </span>
                  <span className="text-xs font-mono text-white/90 bg-black/70 px-2 py-0.5 border border-white/30">
                    {COMIC_SPOTLIGHT_BANNERS[currentBannerIdx].publisher}
                  </span>
                </div>

                <h3
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md"
                  style={{ fontFamily: "'Bangers', 'Kalam', cursive, sans-serif", letterSpacing: '0.04em' }}
                >
                  {COMIC_SPOTLIGHT_BANNERS[currentBannerIdx].title}
                </h3>

                <p className="text-sm font-bold text-white/90">
                  Creators: <span style={{ color: COLORS.yellow }}>{COMIC_SPOTLIGHT_BANNERS[currentBannerIdx].creators}</span>
                </p>

                <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                  {COMIC_SPOTLIGHT_BANNERS[currentBannerIdx].desc}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#comic-catalog"
                    className="inline-flex items-center gap-2 px-6 py-2.5 font-bold text-sm transition-transform hover:translate-y-[-2px] cursor-pointer"
                    style={{
                      borderRadius: ROUND_SM,
                      backgroundColor: COLORS.red,
                      border: `2px solid ${COLORS.black}`,
                      color: COLORS.white,
                      boxShadow: `3px 3px 0px ${COLORS.black}`,
                    }}
                  >
                    <span>BROWSE COMIC VAULT</span>
                    <ArrowRight size={16} strokeWidth={3} />
                  </a>

                  <div className="text-xs font-mono text-white/70 bg-black/50 px-2.5 py-1 border border-white/20">
                    COMIC BANNER {currentBannerIdx + 1} / {COMIC_SPOTLIGHT_BANNERS.length}
                  </div>
                </div>
              </div>

              {/* Prev / Next Navigation Arrows */}
              <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentBannerIdx((prev) => (prev - 1 + COMIC_SPOTLIGHT_BANNERS.length) % COMIC_SPOTLIGHT_BANNERS.length)}
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
                  onClick={() => setCurrentBannerIdx((prev) => (prev + 1) % COMIC_SPOTLIGHT_BANNERS.length)}
                  className="w-10 h-10 flex items-center justify-center font-bold transition-transform hover:translate-y-[-2px] cursor-pointer"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.yellow,
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
                {COMIC_SPOTLIGHT_BANNERS.map((banner, idx) => (
                  <button
                    key={banner.id}
                    type="button"
                    onClick={() => setCurrentBannerIdx(idx)}
                    className="h-2.5 rounded-full border border-black transition-all cursor-pointer"
                    style={{
                      width: currentBannerIdx === idx ? '32px' : '10px',
                      backgroundColor: currentBannerIdx === idx ? COLORS.red : 'rgba(255,255,255,0.6)',
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
        <section id="comic-catalog" className="flex flex-col gap-8 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div
                className="inline-block px-3 py-0.5 text-xs font-bold -rotate-1 mb-1"
                style={{
                  borderRadius: ROUND_SM,
                  backgroundColor: COLORS.red,
                  border: `2px solid ${COLORS.black}`,
                  color: COLORS.white,
                }}
              >
                COMIC ISSUE CATALOG
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ fontFamily: "'Bangers', 'Kalam', cursive", color: COLORS.black, letterSpacing: '0.03em' }}
              >
                Curated Comic Editions & Omnibuses
              </h2>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search superhero, writer, artist..."
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
              { id: 'all', label: '✦ All Comics' },
              { id: 'Marvel', label: '⚡ Marvel Universe' },
              { id: 'DC Comics', label: '🦇 DC Universe & Noir' },
              { id: 'Image Comics', label: '🌟 Image Creator-Owned' },
              { id: 'Sci-Fi', label: '🌌 Sci-Fi & Cosmic' },
              { id: 'Horror', label: '🧟 Horror & Supernatural' },
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
                    backgroundColor: isActive ? COLORS.red : COLORS.white,
                    color: isActive ? COLORS.white : COLORS.black,
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
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: `${COLORS.black}88` }}>
            Showing {filteredComics.length} of {COMIC_CATALOG.length} collector issues
          </div>

          {/* Catalog Grid */}
          {filteredComics.length === 0 ? (
            <div
              className="p-12 text-center"
              style={{
                borderRadius: ROUND_MD,
                backgroundColor: COLORS.white,
                border: `3px dashed ${COLORS.black}`,
              }}
            >
              <p className="text-xl font-bold mb-2" style={{ fontFamily: "'Bangers', 'Kalam', cursive" }}>No Comic Issues Found!</p>
              <p className="text-sm text-neutral-600 mb-4">Try clearing your search query or selecting another universe filter.</p>
              <button
                onClick={() => {
                  setSelectedGenre('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-bold"
                style={{
                  borderRadius: ROUND_SM,
                  backgroundColor: COLORS.red,
                  color: COLORS.white,
                  border: `2px solid ${COLORS.black}`,
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredComics.map((comic) => {
                const wishlisted = isWishlisted(comic.id);
                return (
                  <div
                    key={comic.id}
                    className="group relative flex flex-col justify-between p-4 transition-all duration-200 hover:-translate-y-1.5"
                    style={{
                      borderRadius: ROUND_MD,
                      backgroundColor: COLORS.white,
                      border: `3px solid ${COLORS.black}`,
                      boxShadow: `5px 5px 0px ${COLORS.red}`,
                    }}
                  >
                    <div>
                      {/* Image Container with Badges */}
                      <div
                        className="relative w-full aspect-[3/4] mb-3 overflow-hidden"
                        style={{
                          borderRadius: ROUND_SM,
                          border: `2px solid ${COLORS.black}`,
                          backgroundColor: COLORS.yellowLight,
                        }}
                      >
                        <img
                          src={comic.coverImage}
                          alt={comic.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Tag */}
                        <div
                          className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: COLORS.red,
                            color: COLORS.white,
                            border: `1.5px solid ${COLORS.black}`,
                            boxShadow: `2px 2px 0px ${COLORS.black}`,
                          }}
                        >
                          {comic.tag}
                        </div>

                        {/* CGC Grade Badge */}
                        {comic.cgcGrade && (
                          <div
                            className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                            style={{
                              borderRadius: '4px',
                              backgroundColor: COLORS.blue,
                              color: COLORS.black,
                              border: `1.5px solid ${COLORS.black}`,
                              boxShadow: `2px 2px 0px ${COLORS.black}`,
                            }}
                          >
                            {comic.cgcGrade}
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(comicToAlbum(comic));
                          }}
                          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                          style={{
                            borderRadius: ROUND_SM,
                            backgroundColor: COLORS.white,
                            border: `2px solid ${COLORS.black}`,
                            boxShadow: `2px 2px 0px ${COLORS.black}`,
                          }}
                          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <Heart
                            size={16}
                            className={wishlisted ? 'fill-[#ef4444] text-[#ef4444]' : 'text-black'}
                          />
                        </button>

                        {/* Format Indicator */}
                        <div
                          className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[9px] font-bold uppercase"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: COLORS.yellow,
                            color: COLORS.black,
                            border: `1px solid ${COLORS.black}`,
                          }}
                        >
                          {comic.format.split(' ')[0]}
                        </div>
                      </div>

                      {/* Title & Creator Credits */}
                      <h3
                        className="text-xl font-bold line-clamp-1 group-hover:opacity-80 transition-opacity"
                        style={{ fontFamily: "'Bangers', 'Kalam', cursive", color: COLORS.black, letterSpacing: '0.03em' }}
                      >
                        {comic.title}
                      </h3>
                      <p className="text-sm font-bold mb-1" style={{ color: COLORS.redDeep }}>
                        Writer: {comic.writer}
                      </p>
                      <p className="text-xs mb-1" style={{ color: `${COLORS.black}aa` }}>
                        Art: {comic.artist} · {comic.publisher}
                      </p>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 text-xs font-bold mb-3" style={{ color: `${COLORS.black}cc` }}>
                        <span className="font-black" style={{ color: COLORS.redDeep }}>★ {comic.rating.toFixed(1)}</span>
                        <span>({comic.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                    </div>

                    {/* Card Bottom: Price & Actions */}
                    <div className="pt-3 border-t border-dashed mt-2 space-y-3" style={{ borderColor: `${COLORS.black}66` }}>
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold" style={{ color: COLORS.black }}>
                            {formatPrice(comic.priceUSD, comic.priceVND)}
                          </span>
                          {comic.originalPriceUSD && (
                            <span className="text-xs line-through" style={{ color: `${COLORS.black}55` }}>
                              {formatPrice(comic.originalPriceUSD)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold uppercase" style={{ color: COLORS.redDeep }}>
                          {comic.genre}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewingComic(comic);
                            setActivePreviewIndex(0);
                          }}
                          className="px-2 py-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer hover:translate-y-[-1px]"
                          style={{
                            borderRadius: ROUND_SM,
                            backgroundColor: COLORS.yellowLight,
                            border: `2px solid ${COLORS.black}`,
                            boxShadow: `2px 2px 0px ${COLORS.black}`,
                            color: COLORS.black,
                          }}
                        >
                          <BookOpen size={13} />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(comic)}
                          className="px-2 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer hover:translate-y-[-1px]"
                          style={{
                            borderRadius: ROUND_SM,
                            backgroundColor: COLORS.red,
                            border: `2px solid ${COLORS.black}`,
                            boxShadow: `3px 3px 0px ${COLORS.black}`,
                            color: COLORS.white,
                          }}
                        >
                          <ShoppingCart size={13} />
                          <span>Add to Box</span>
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
            4. LEGENDARY COMIC IMPRINT SPOTLIGHT
        ========================================================================= */}
        <section className="relative my-24 sm:my-36">
          <div
            className="p-6 sm:p-8 md:p-10 relative"
            style={{
              borderRadius: ROUND_LG,
              backgroundColor: COLORS.yellowLight,
              border: `3px solid ${COLORS.black}`,
              boxShadow: `6px 6px 0px ${COLORS.red}`,
            }}
          >
            {/* Accent strip */}
            <div
              className="absolute -top-2 left-1/3 w-28 h-3"
              style={{ backgroundColor: COLORS.red, borderRadius: ROUND_SM }}
            />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold mb-1"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.white,
                    border: `2px solid ${COLORS.black}`,
                    color: COLORS.black,
                  }}
                >
                  <Award size={14} className="text-[#ef4444]" />
                  <span>THE FOUR CORNERS OF COMIC HISTORY</span>
                </div>
                <h2
                  className="text-3xl sm:text-4xl font-bold"
                  style={{ fontFamily: "'Bangers', 'Kalam', cursive", color: COLORS.black, letterSpacing: '0.03em' }}
                >
                  Legendary Comic Imprints & Publishers
                </h2>
              </div>
              <p className="text-sm max-w-md" style={{ color: `${COLORS.black}bb` }}>
                Celebrating the visionaries, writers, and pencilers behind the world's most enduring mythology.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: 'Marvel Comics',
                  slogan: 'The House of Ideas',
                  icon: '⚡',
                  bg: COLORS.redLight,
                  desc: 'Stan Lee & Jack Kirby\'s interconnected tapestry: Spider-Man, X-Men, Avengers & Fantastic Four.',
                  badge: '616 UNIVERSE',
                },
                {
                  name: 'DC Comics',
                  slogan: 'Pantheon of Gods',
                  icon: '🦇',
                  bg: COLORS.blueLight,
                  desc: 'The timeless archetypes of superhero storytelling: Batman, Superman, Wonder Woman & Gotham noir.',
                  badge: 'BLACK LABEL',
                },
                {
                  name: 'Image Comics',
                  slogan: 'Creator-Owned Freedom',
                  icon: '🌟',
                  bg: COLORS.yellow,
                  desc: 'Where creators retain 100% rights to their worlds. Home of Spawn, Saga, and Invincible.',
                  badge: 'CREATOR OWNED',
                },
                {
                  name: 'DC Vertigo / Dark Horse',
                  slogan: 'Literary & Dark Noir',
                  icon: '💀',
                  bg: COLORS.white,
                  desc: 'Mature boundary-pushing fiction: Neil Gaiman\'s Sandman, Hellboy, Sin City, and Alan Moore.',
                  badge: 'LITERARY NOIR',
                },
              ].map((studio, idx) => (
                <div
                  key={idx}
                  className="p-5 flex flex-col justify-between h-56 transition-transform hover:-translate-y-1"
                  style={{
                    borderRadius: ROUND_MD,
                    backgroundColor: studio.bg,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `3px 3px 0px ${COLORS.black}`,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{studio.icon}</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: COLORS.white,
                          border: `1.5px solid ${COLORS.black}`,
                        }}
                      >
                        {studio.badge}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold" style={{ fontFamily: "'Bangers', 'Kalam', cursive", color: COLORS.black, letterSpacing: '0.03em' }}>
                      {studio.name}
                    </h4>
                    <p className="text-xs font-bold uppercase mb-2" style={{ color: COLORS.redDeep }}>
                      {studio.slogan}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: `${COLORS.black}dd` }}>
                      {studio.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. COMMUNITY DIALOGUE WALL (POP-ART SPEECH BUBBLES)
        ========================================================================= */}
        <section id="comic-community" className="flex flex-col gap-12 sm:gap-16 my-24 sm:my-36">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div
              className="inline-block px-3 py-1 text-xs font-bold mb-1"
              style={{
                borderRadius: ROUND_SM,
                backgroundColor: COLORS.red,
                border: `2px solid ${COLORS.black}`,
                color: COLORS.white,
              }}
            >
              READER SOUNDBOARD & DIALOGUE
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "'Bangers', 'Kalam', cursive", color: COLORS.black, letterSpacing: '0.03em' }}
            >
              Comic Reader Notes & Hot Takes
            </h2>
            <p className="text-base" style={{ color: `${COLORS.black}cc` }}>
              Share your favorite comic runs, storyline theories, and variant collection triumphs.
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
                  boxShadow: `4px 4px 0px ${COLORS.red}`,
                }}
              >
                {/* Pin */}
                <div
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: COLORS.red,
                    border: `1px solid ${COLORS.black}`,
                  }}
                />

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: COLORS.redDeep }}>
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
              boxShadow: `4px 4px 0px ${COLORS.red}`,
              padding: '24px',
            }}
          >
            <input
              type="text"
              value={newNoteAuthor}
              onChange={(e) => setNewNoteAuthor(e.target.value)}
              placeholder="Your comic handle..."
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
              placeholder="Share your comic run theory or graphic novel recommendation..."
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
                backgroundColor: COLORS.red,
                color: COLORS.white,
                border: `2px solid ${COLORS.black}`,
                boxShadow: `3px 3px 0px ${COLORS.black}`,
              }}
            >
              <Pin size={14} />
              <span>Pin Comment</span>
            </button>
          </form>
        </section>

        {/* =========================================================================
            6. NEWSLETTER & PULL LIST PRE-ORDER ALERT
        ========================================================================= */}
        <section className="relative mt-28 sm:mt-40 mb-20 sm:mb-28 pt-8">
          {/* Accent strip */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-3 z-10"
            style={{ backgroundColor: COLORS.red, borderRadius: ROUND_SM }}
          />

          <div
            className="p-8 sm:p-10 text-center space-y-4"
            style={{
              borderRadius: ROUND_LG,
              backgroundColor: COLORS.white,
              border: `3px dashed ${COLORS.black}`,
              boxShadow: `6px 6px 0px ${COLORS.red}`,
            }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center mx-auto"
              style={{
                borderRadius: ROUND_SM,
                backgroundColor: COLORS.yellow,
                border: `2px solid ${COLORS.black}`,
                color: COLORS.black,
              }}
            >
              <Bookmark size={24} />
            </div>

            <h3
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "'Bangers', 'Kalam', cursive", color: COLORS.black, letterSpacing: '0.03em' }}
            >
              Never Miss a New Comic Book Day (NCBD) Drop
            </h3>
            <p className="text-base max-w-md mx-auto" style={{ color: `${COLORS.black}cc` }}>
              Get weekly alerts for virgin foil variant drops, signed creator releases, and San Diego Comic-Con exclusives.
            </p>

            {newsletterSubscribed ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 font-bold text-sm"
                style={{
                  borderRadius: ROUND_SM,
                  backgroundColor: COLORS.yellowLight,
                  border: `2px solid ${COLORS.black}`,
                  color: COLORS.black,
                }}
              >
                <Check size={16} style={{ color: COLORS.redDeep }} />
                <span>You are subscribed to the weekly NCBD drop alerts!</span>
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
                  placeholder="Enter email for weekly pull list..."
                  className="w-full px-4 py-3 text-sm font-bold outline-none"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.yellowLight,
                    border: `2px solid ${COLORS.black}`,
                    color: COLORS.black,
                  }}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 font-bold text-sm cursor-pointer whitespace-nowrap hover:translate-y-[-1px] transition-all"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.red,
                    color: COLORS.white,
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
          7. COMIC PREVIEW MODAL
      ========================================================================= */}
      {previewingComic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
            style={{
              borderRadius: ROUND_MD,
              backgroundColor: COLORS.yellowLight,
              border: `3.5px solid ${COLORS.black}`,
              boxShadow: `8px 8px 0px ${COLORS.black}`,
              padding: '24px',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b-2 border-dashed" style={{ borderColor: COLORS.black }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2 py-0.5 text-xs font-bold"
                    style={{
                      borderRadius: '4px',
                      backgroundColor: COLORS.red,
                      color: COLORS.white,
                      border: `1.5px solid ${COLORS.black}`,
                    }}
                  >
                    {previewingComic.publisher}
                  </span>
                  <span
                    className="px-2 py-0.5 text-xs font-bold"
                    style={{
                      borderRadius: '4px',
                      backgroundColor: COLORS.blue,
                      color: COLORS.black,
                      border: `1.5px solid ${COLORS.black}`,
                    }}
                  >
                    {previewingComic.format}
                  </span>
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Bangers', 'Kalam', cursive", color: COLORS.black, letterSpacing: '0.03em' }}
                >
                  {previewingComic.title}
                </h3>
                <p className="text-xs font-bold" style={{ color: COLORS.redDeep }}>
                  Writer: {previewingComic.writer} · Art: {previewingComic.artist}
                </p>
              </div>

              <button
                onClick={() => setPreviewingComic(null)}
                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors"
                style={{
                  borderRadius: ROUND_SM,
                  border: `2px solid ${COLORS.black}`,
                  backgroundColor: COLORS.white,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Image Carousel */}
            <div className="overflow-y-auto py-4 space-y-4 flex-1">
              <div
                className="relative w-full aspect-[16/9] overflow-hidden"
                style={{
                  borderRadius: ROUND_SM,
                  border: `2px solid ${COLORS.black}`,
                  backgroundColor: COLORS.black,
                }}
              >
                <img
                  src={previewingComic.previewImages[activePreviewIndex] || previewingComic.coverImage}
                  alt={previewingComic.title}
                  className="w-full h-full object-contain"
                />

                {/* Carousel Controls */}
                {previewingComic.previewImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActivePreviewIndex((prev) =>
                          prev === 0 ? previewingComic.previewImages.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer"
                      style={{
                        borderRadius: ROUND_SM,
                        backgroundColor: COLORS.yellow,
                        border: `2px solid ${COLORS.black}`,
                        color: COLORS.black,
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setActivePreviewIndex((prev) =>
                          (prev + 1) % previewingComic.previewImages.length
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer"
                      style={{
                        borderRadius: ROUND_SM,
                        backgroundColor: COLORS.yellow,
                        border: `2px solid ${COLORS.black}`,
                        color: COLORS.black,
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {previewingComic.previewImages.length > 1 && (
                <div className="flex items-center gap-2 justify-center">
                  {previewingComic.previewImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePreviewIndex(idx)}
                      className="w-16 h-12 overflow-hidden cursor-pointer transition-all"
                      style={{
                        borderRadius: '4px',
                        border: idx === activePreviewIndex ? `2.5px solid ${COLORS.red}` : `1.5px solid ${COLORS.black}`,
                        opacity: idx === activePreviewIndex ? 1 : 0.6,
                      }}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              <div
                className="p-4"
                style={{
                  borderRadius: ROUND_SM,
                  backgroundColor: COLORS.white,
                  border: `2px solid ${COLORS.black}`,
                }}
              >
                <p className="text-xs uppercase font-bold mb-1" style={{ color: COLORS.redDeep }}>STORYLINE SYNOPSIS</p>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.black }}>
                  {previewingComic.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t-2 border-dashed mt-4 flex items-center justify-between" style={{ borderColor: COLORS.black }}>
              <div className="text-xl font-bold" style={{ color: COLORS.black }}>
                {formatPrice(previewingComic.priceUSD, previewingComic.priceVND)}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewingComic(null)}
                  className="px-4 py-2 text-sm font-bold cursor-pointer"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.white,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `2px 2px 0px ${COLORS.black}`,
                    color: COLORS.black,
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(previewingComic);
                    setPreviewingComic(null);
                  }}
                  className="px-6 py-2 text-sm font-bold cursor-pointer flex items-center gap-2 transition-all hover:translate-y-[-1px]"
                  style={{
                    borderRadius: ROUND_SM,
                    backgroundColor: COLORS.red,
                    color: COLORS.white,
                    border: `2px solid ${COLORS.black}`,
                    boxShadow: `3px 3px 0px ${COLORS.black}`,
                  }}
                >
                  <ShoppingCart size={15} />
                  <span>Add to Pull Box</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
