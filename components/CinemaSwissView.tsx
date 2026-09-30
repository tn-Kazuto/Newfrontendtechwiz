'use client';

import React, { useState, useMemo } from 'react';
import {
  Film,
  Search,
  ShoppingCart,
  Heart,
  ArrowRight,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Disc,
  Sliders,
  Tv,
  Camera,
  Play,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  Maximize2,
  Bookmark,
} from 'lucide-react';
import { Album } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

// =========================================================================
// SWISS INTERNATIONAL TYPOGRAPHIC DESIGN SYSTEM (TOKENS)
// =========================================================================
const SWISS = {
  white: '#FFFFFF',
  black: '#000000',
  muted: '#F2F2F2',
  mutedDark: '#E5E5E5',
  red: '#FF3000',        // The Functional Swiss Red Signal
  redHover: '#E62B00',
  border: '#000000',
  textMuted: '#525252',
  radius: '0px',         // Strictly 0px Rectangular Everywhere
};

// =========================================================================
// CINEMA FILM ITEM MODEL
// =========================================================================
export interface CinemaItem {
  id: string;
  catalogNumber: string; // e.g. "CH-01", "CH-02"
  title: string;
  director: string;
  year: number;
  country: string;
  genre: 'Auteur' | 'Sci-Fi' | 'Noir' | 'Classic' | 'Documentary';
  aspectRatio: string;
  runtimeMinutes: number;
  format: string; // e.g. "70MM IMAX 4K UHD", "CRITERION 4K SLIPCASE"
  priceUSD: number;
  priceVND: number;
  originalPriceUSD?: number;
  rating: number;
  reviewCount: number;
  tag: string;
  coverImage: string;
  description: string;
  technicalSpecs: string[];
  previewFrames: string[];
  stock: number;
}

// Curated Swiss International Cinema Catalog
const CINEMA_CATALOG: CinemaItem[] = [
  {
    id: 'film-dune-2-70mm',
    catalogNumber: 'CH-01',
    title: 'DUNE: PART TWO',
    director: 'Denis Villeneuve',
    year: 2024,
    country: 'USA / CAN',
    genre: 'Sci-Fi',
    aspectRatio: '1.43:1 IMAX Expanded',
    runtimeMinutes: 166,
    format: '70MM IMAX 4K UHD + Film Frame',
    priceUSD: 44.99,
    priceVND: 1120000,
    originalPriceUSD: 54.99,
    rating: 4.98,
    reviewCount: 4210,
    tag: '01. GRAND MODERNIST EPIC',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=700&auto=format&fit=crop&q=85',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Filmed with Arri Alexa LF IMAX cameras, presented with full 1.43:1 uncompressed dynamic range and Hans Zimmer\'s monumental acoustic soundscape.',
    technicalSpecs: [
      'Native 4K 2160p HEVC / Dolby Vision & HDR10+',
      'IMAX 1.43:1 Aspect Ratio Sequence Integration',
      'Dolby Atmos 7.1.4 Uncompressed Audio Track',
      'Authentic Mounted 70mm IMAX Film Cell Specimen',
      '64-Page Architectural Production Monograph',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 18,
  },
  {
    id: 'film-oppenheimer-70mm',
    catalogNumber: 'CH-02',
    title: 'OPPENHEIMER',
    director: 'Christopher Nolan',
    year: 2023,
    country: 'USA / UK',
    genre: 'Auteur',
    aspectRatio: '1.43:1 / 2.20:1 Variable',
    runtimeMinutes: 180,
    format: '70MM Photochemical Master 4K',
    priceUSD: 48.99,
    priceVND: 1220000,
    originalPriceUSD: 59.99,
    rating: 4.99,
    reviewCount: 5680,
    tag: '02. PHOTOCHEMICAL MASTERPIECE',
    coverImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=700&auto=format&fit=crop&q=85',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. Mastered directly from the 65mm original camera negative without digital intermediate, featuring custom Kodak 65mm black-and-white film stocks.',
    technicalSpecs: [
      'Mastered Direct from 65mm Large-Format Negative',
      'Uncompressed 5.1 DTS-HD Master Audio (Nolan Reference Mix)',
      'Trinity Test Architectural Sequence Breakdown',
      'Full Script Replica with Archival Director Annotations',
      'Matte Black Linen Hardcover Presentation Box',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 12,
  },
  {
    id: 'film-in-the-mood-for-love',
    catalogNumber: 'CH-03',
    title: 'IN THE MOOD FOR LOVE',
    director: 'Wong Kar-wai',
    year: 2000,
    country: 'HK / FRA',
    genre: 'Classic',
    aspectRatio: '1.66:1 European Widescreen',
    runtimeMinutes: 98,
    format: 'Criterion Collection 4K UHD Slipcase',
    priceUSD: 39.99,
    priceVND: 990000,
    originalPriceUSD: 49.99,
    rating: 4.97,
    reviewCount: 3840,
    tag: '03. POETIC VISUAL SYMPHONY',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=85',
    description: 'Two neighbors, a woman and a man, form a strong bond after both suspect extramarital activities of their spouses. Christopher Doyle and Mark Lee Ping-bin\'s cinematography presented in pristine 4K 16-bit scan overseen by director Wong Kar-wai.',
    technicalSpecs: [
      '4K Digital Restoration Approved by Wong Kar-wai',
      'Uncompressed Monophonic Soundtrack & 5.1 Remix',
      'Tony Leung & Maggie Cheung Wardrobe Study Guide',
      'Essays by Film Historian Stephen Teo',
      'Linen Embossed Slipcase with Qipao Textile Inset',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 24,
  },
  {
    id: 'film-2001-space-odyssey',
    catalogNumber: 'CH-04',
    title: '2001: A SPACE ODYSSEY',
    director: 'Stanley Kubrick',
    year: 1968,
    country: 'UK / USA',
    genre: 'Sci-Fi',
    aspectRatio: '2.20:1 Super Panavision 70',
    runtimeMinutes: 149,
    format: '70MM Unrestored Negative Scan 4K',
    priceUSD: 42.99,
    priceVND: 1070000,
    originalPriceUSD: 52.99,
    rating: 5.0,
    reviewCount: 6120,
    tag: '04. MATHEMATICAL RECKONING',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=700&auto=format&fit=crop&q=85',
    description: 'Stanley Kubrick\'s peerless voyage from the dawn of humanity to the infinite reaches of outer space. Created directly from the original 65mm camera negative overseen by Christopher Nolan and Warner Bros. preservation team.',
    technicalSpecs: [
      'Original 65mm Camera Negative 8K Scan to 4K Master',
      'Original 1968 6-Track 70mm Audio Mix in 5.1 DTS-HD',
      'HAL 9000 Interface Architectural Dossier',
      'Behind the Scenes Stills by Douglas Trumbull',
      'Matte White Swiss Typographic Slipcase',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 15,
  },
  {
    id: 'film-blade-runner-2049',
    catalogNumber: 'CH-05',
    title: 'BLADE RUNNER 2049',
    director: 'Denis Villeneuve',
    year: 2017,
    country: 'USA / UK',
    genre: 'Noir',
    aspectRatio: '2.39:1 Anamorphic Panavision',
    runtimeMinutes: 164,
    format: 'Masterwork Steelbook 4K UHD + Cell',
    priceUSD: 38.99,
    priceVND: 970000,
    originalPriceUSD: 46.99,
    rating: 4.96,
    reviewCount: 4720,
    tag: '05. BRUTALIST DYSTOPIAN NOIR',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=700&auto=format&fit=crop&q=85',
    description: 'Young Blade Runner K unearths a long-buried secret that leads him to track down former Blade Runner Rick Deckard. Roger Deakins\' Oscar-winning cinematography delivered in reference 4K HDR masterwork quality.',
    technicalSpecs: [
      'Digital Master 4K with Dolby Vision Grading',
      'Dolby Atmos Reference Sound Mix (Deakins Approved)',
      'Brutalist Architecture Production Booklet',
      'Numbered Archival Foil Certificate of Authenticity',
      'Brushed Aluminum Steelbook Casing',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 22,
  },
  {
    id: 'film-interstellar-imax',
    catalogNumber: 'CH-06',
    title: 'INTERSTELLAR',
    director: 'Christopher Nolan',
    year: 2014,
    country: 'USA / UK',
    genre: 'Sci-Fi',
    aspectRatio: '1.43:1 / 2.39:1 Variable',
    runtimeMinutes: 169,
    format: '10th Anniversary IMAX Film Collector Box',
    priceUSD: 49.99,
    priceVND: 1240000,
    originalPriceUSD: 62.99,
    rating: 4.99,
    reviewCount: 6980,
    tag: '06. COSMIC RELATIVITY MASTER',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=85',
    description: 'A team of explorers travels through a wormhole in space in an attempt to ensure humanity\'s survival. Featuring over one hour of full-screen 15/70mm IMAX sequences and Kip Thorne\'s relativistic black hole visualizations.',
    technicalSpecs: [
      '15/70mm IMAX Original Negative 4K Scan',
      '5.1 DTS-HD Master Audio Church Pipe Organ Mix',
      'Kip Thorne General Relativity Equations Portfolio',
      'Genuine 70mm Mounted Film Strip in Acrylic Stand',
      'Deluxe Black & Swiss Red Slipcase Box',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 14,
  },
  {
    id: 'film-parasite-criterion',
    catalogNumber: 'CH-07',
    title: 'PARASITE (기생충)',
    director: 'Bong Joon-ho',
    year: 2019,
    country: 'KOR',
    genre: 'Auteur',
    aspectRatio: '2.39:1 Anamorphic Widescreen',
    runtimeMinutes: 132,
    format: 'Criterion Dual 4K: Color & B&W Edition',
    priceUSD: 36.99,
    priceVND: 920000,
    originalPriceUSD: 44.99,
    rating: 4.98,
    reviewCount: 5120,
    tag: '07. PALME D\'OR & OSCAR BEST PICTURE',
    coverImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=700&auto=format&fit=crop&q=85',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan. Includes both the original theatrical color master and the pristine black-and-white edition.',
    technicalSpecs: [
      'Both Color & Black-and-White 4K Digital Masters',
      'Dolby Atmos Soundtrack Approved by Bong Joon-ho',
      'Architectural Blueprint of the Park Modernist Residence',
      'Audio Commentary by Bong Joon-ho & Tony Rayns',
      'Matte Rigid Slipbox with Transparent Overlay',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 21,
  },
  {
    id: 'film-drive-4k-steelbook',
    catalogNumber: 'CH-08',
    title: 'DRIVE',
    director: 'Nicolas Winding Refn',
    year: 2011,
    country: 'USA',
    genre: 'Noir',
    aspectRatio: '2.35:1 Widescreen Cinema',
    runtimeMinutes: 100,
    format: 'Limited 4K Steelbook + Cliff Martinez OST',
    priceUSD: 37.99,
    priceVND: 940000,
    originalPriceUSD: 45.99,
    rating: 4.94,
    reviewCount: 3620,
    tag: '08. CANNES BEST DIRECTOR',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=700&auto=format&fit=crop&q=85',
    description: 'A Hollywood stuntman and getaway driver gets into trouble when he involves himself in his neighbor\'s life. Refn\'s neo-noir masterpiece with synthwave score by Cliff Martinez, mastered in HDR10+ from the original Arri digital negative.',
    technicalSpecs: [
      '4K HDR10+ Transfer Approved by Refn',
      'Dolby Atmos Sound Mix & 2.0 Stereo Track',
      'Original Soundtrack CD by Cliff Martinez Included',
      'Satin Finish Embossed Steelbook Case',
      'Art Cards by Belgian Illustrator Laurent Durieux',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 19,
  },
  {
    id: 'film-the-godfather',
    catalogNumber: 'CH-09',
    title: 'THE GODFATHER (50TH ANNIVERSARY)',
    director: 'Francis Ford Coppola',
    year: 1972,
    country: 'USA',
    genre: 'Classic',
    aspectRatio: '1.85:1 Academy Flat',
    runtimeMinutes: 175,
    format: 'Paramount 4K UHD 50th Collector Vault',
    priceUSD: 46.99,
    priceVND: 1170000,
    originalPriceUSD: 58.99,
    rating: 5.0,
    reviewCount: 7890,
    tag: '09. THE CORLEONE CHRONICLE',
    coverImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=700&auto=format&fit=crop&q=85',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. Restored under the direct supervision of Francis Ford Coppola across 3 years with pristine 4K grain reproduction.',
    technicalSpecs: [
      'Original 35mm Technicolor Camera Negative Scan',
      'Restored 5.1 Dolby TrueHD & Original 1972 Mono',
      'Archival Nino Rota Orchestral Score Monograph',
      'Hardcover 48-Page Archival Photography Book',
      'Heavyweight Linen Embossed Corleone Slipbox',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 16,
  },
  {
    id: 'film-apocalypse-now-final-cut',
    catalogNumber: 'CH-10',
    title: 'APOCALYPSE NOW: FINAL CUT',
    director: 'Francis Ford Coppola',
    year: 1979,
    country: 'USA',
    genre: 'Auteur',
    aspectRatio: '2.35:1 Technovision 70mm',
    runtimeMinutes: 183,
    format: '70MM Master 4K UHD + Meyer Sound Sensurround',
    priceUSD: 45.50,
    priceVND: 1140000,
    originalPriceUSD: 55.00,
    rating: 4.97,
    reviewCount: 5340,
    tag: '10. PSYCHEDELIC WAR ODYSSEY',
    coverImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=700&auto=format&fit=crop&q=85',
    description: 'A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Colonel who sees himself as a god. Vittorio Storaro’s legendary cinematography presented in reference Dolby Vision.',
    technicalSpecs: [
      'Scanned from the Original Camera Negative in 4K 16-bit',
      'Groundbreaking Dolby Atmos Soundtrack by Walter Murch',
      'Includes 1979 Theatrical, Redux, and Final Cut versions',
      'Replica Vietnam Field Military Map & Dossier',
      'Custom Industrial Camouflage Steel Slipcase',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 20,
  },
  {
    id: 'film-spirited-away-ghibli',
    catalogNumber: 'CH-11',
    title: 'SPIRITED AWAY (千と千尋の神隠し)',
    director: 'Hayao Miyazaki',
    year: 2001,
    country: 'JPN',
    genre: 'Classic',
    aspectRatio: '1.85:1 Theatrical Flat',
    runtimeMinutes: 125,
    format: 'Studio Ghibli Archival 4K Boxset + Cel',
    priceUSD: 42.00,
    priceVND: 1050000,
    originalPriceUSD: 50.00,
    rating: 4.99,
    reviewCount: 8450,
    tag: '11. STUDIO GHIBLI GOLDEN CROWN',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=700&auto=format&fit=crop&q=85',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits. Oscar Winner for Best Animated Feature, mastered with Joe Hisaishi’s transcendent symphonic score.',
    technicalSpecs: [
      'Pristine 4K 12-bit Restoration Supervised by Studio Ghibli',
      'Joe Hisaishi Complete Orchestral Score in 24-bit 96kHz',
      'Mounted Authentic 35mm Hand-Drawn Cel Specimen',
      'Exclusive Miyazaki Storyboard Comparison Angle',
      'Gold Foil Embossed Japanese Washi Paper Slipcase',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 25,
  },
  {
    id: 'film-se7en-fincher',
    catalogNumber: 'CH-12',
    title: 'SE7EN: THE 4K REMASTER',
    director: 'David Fincher',
    year: 1995,
    country: 'USA',
    genre: 'Noir',
    aspectRatio: '2.39:1 Anamorphic Panavision',
    runtimeMinutes: 127,
    format: 'Fincher Certified 4K HDR10+ Deluxe Box',
    priceUSD: 39.50,
    priceVND: 980000,
    originalPriceUSD: 48.00,
    rating: 4.95,
    reviewCount: 4890,
    tag: '12. THE BLEACH-BYPASS NOIR',
    coverImage: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=700&auto=format&fit=crop&q=85',
    description: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives. Overhauled frame-by-frame by David Fincher using the CCE (Silver Retention) process reproduction.',
    technicalSpecs: [
      'Frame-by-Frame 8K Scan Approved by David Fincher',
      'Uncompressed 7.1 Surround Sound Mix & Howard Shore Score',
      'John Doe Investigation Scrapbook Replica (100+ Pages)',
      'Audio Commentary with Brad Pitt, Morgan Freeman & Fincher',
      'Custom Industrial Riveted Black Slipcase',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 17,
  },
  {
    id: 'film-pulp-fiction-30th',
    catalogNumber: 'CH-13',
    title: 'PULP FICTION: 30TH ANNIVERSARY',
    director: 'Quentin Tarantino',
    year: 1994,
    country: 'USA',
    genre: 'Auteur',
    aspectRatio: '2.35:1 Panavision Widescreen',
    runtimeMinutes: 154,
    format: 'Palme d\'Or 30th Anniversary 4K Steelbook',
    priceUSD: 41.00,
    priceVND: 1020000,
    originalPriceUSD: 49.99,
    rating: 4.98,
    reviewCount: 6510,
    tag: '13. POST-MODERN CINEMA ICON',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=700&auto=format&fit=crop&q=85',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption. Andrzej Sekula\'s low-grain 50 ASA cinematography mastered in 4K HDR.',
    technicalSpecs: [
      'Original 35mm Camera Negative 4K HDR Master',
      'DTS-HD Master Audio 5.1 & Surf-Rock Master Tracks',
      'Jack Rabbit Slim\'s Retro Menu & Matchbook Set',
      'Full Cast Oral History Retrospective Booklet',
      'Embossed Pulp Hardcover Slipcase with Gold Spine',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 22,
  },
  {
    id: 'film-taxi-driver-scorsese',
    catalogNumber: 'CH-14',
    title: 'TAXI DRIVER: 4K ARCHIVAL RESTORATION',
    director: 'Martin Scorsese',
    year: 1976,
    country: 'USA',
    genre: 'Noir',
    aspectRatio: '1.85:1 Theatrical Flat',
    runtimeMinutes: 114,
    format: 'Sony 4K Columbia Classics Collection',
    priceUSD: 38.00,
    priceVND: 950000,
    originalPriceUSD: 45.00,
    rating: 4.96,
    reviewCount: 4210,
    tag: '14. MIDNIGHT NEW YORK NEO-NOIR',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&auto=format&fit=crop&q=85',
    description: 'A mentally unstable veteran works as a nighttime taxi driver in New York City, where the perceived decadence fuels his urge for violent action. Michael Chapman\'s neon-drenched cinematography in pristine 4K.',
    technicalSpecs: [
      'Scanned from 35mm Original Camera Negative in 4K',
      'Bernard Herrmann Final Orchestral Score in Uncompressed Audio',
      'Screenplay by Paul Schrader with Author Annotations',
      'Archival Travis Bickle Checker Cab Taxi Pass Specimen',
      'High-Gloss Yellow & Black Checkerboard Slipbox',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 15,
  },
  {
    id: 'film-stalker-tarkovsky',
    catalogNumber: 'CH-15',
    title: 'STALKER (СТАЛКЕР)',
    director: 'Andrei Tarkovsky',
    year: 1979,
    country: 'SUN',
    genre: 'Auteur',
    aspectRatio: '1.37:1 Academy Standard',
    runtimeMinutes: 162,
    format: 'Mosfilm 4K Criterion Archival Edition',
    priceUSD: 43.50,
    priceVND: 1080000,
    originalPriceUSD: 52.00,
    rating: 4.98,
    reviewCount: 3950,
    tag: '15. POETIC METAPHYSICAL ASCENT',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=85',
    description: 'A guide leads two men through an area known as the Zone to find a room that grants a person\'s innermost desires. Tarkovsky\'s hypnotic metaphysical journey restored from the 35mm negative by Mosfilm.',
    technicalSpecs: [
      'Mosfilm 4K Digital Restoration from Original Camera Negative',
      'Eduard Artemyev Electronic & Acoustic Synthesizer Score',
      'Arkady & Boris Strugatsky Original "Roadside Picnic" Notes',
      'Essays by Film Critic Mark Le Fanu & J. Hoberman',
      'Linen Textured Raw Canvas Presentation Box',
    ],
    previewFrames: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=85',
    ],
    stock: 18,
  },
];

// Helper to convert CinemaItem to Album format for cart
function cinemaToAlbum(item: CinemaItem): Album {
  return {
    id: item.id,
    title: `${item.title} (${item.year})`,
    artist: `Dir. ${item.director}`,
    artistId: item.director.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    category: 'Movies',
    priceUSD: item.priceUSD,
    priceVND: item.priceVND,
    originalPriceUSD: item.originalPriceUSD,
    coverImage: item.coverImage,
    galleryImages: item.previewFrames,
    type: 'Cinema Film Edition',
    releaseDate: `${item.year}-01-01`,
    tag: item.tag,
    rating: item.rating,
    reviewCount: item.reviewCount,
    popularityScore: 99,
    stock: item.stock,
    description: item.description,
    versions: [
      { id: `${item.id}-standard`, name: `Standard ${item.format}`, extraPriceUSD: 0 },
      { id: `${item.id}-archival`, name: 'Archival 70mm Slipcase Box (+Parchment)', extraPriceUSD: 12.0 },
    ],
    inclusions: [
      item.format,
      'Archival Linen Rigid Slipcase Box',
      'Architectural Production Monograph Book',
      'Certificate of Authenticity with Stamped Number',
    ],
    photocards: [
      {
        member: `${item.director} (Director)`,
        image: item.coverImage,
      },
    ],
    tracks: [
      { id: 1, title: 'Act I: The Architectural Prologue & Title Sequence', duration: 'Scene: 24m', isTitleTrack: true },
      { id: 2, title: 'Act II: The Rising Tension & Symmetry Centerpiece', duration: 'Scene: 42m', isTitleTrack: false },
      { id: 3, title: 'Act III: The Climactic Monolith Resolution', duration: 'Scene: 35m', isTitleTrack: true },
    ],
    reviews: [
      {
        id: `rev-${item.id}-1`,
        userName: 'Cahiers_Archive',
        avatar: item.coverImage,
        rating: 5,
        comment: 'The 70mm transfer is mathematical perfection. Contrast ratios and grain structure represent reference-level restoration work.',
        date: '2025-02-20',
        fandomTag: 'Film Scholar',
      },
    ],
  };
}

// Swiss 70mm Large Format Spotlight Banners
export interface CinemaBanner {
  id: string;
  catalogNumber: string;
  title: string;
  director: string;
  year: number;
  format: string;
  badge: string;
  specs: string;
  desc: string;
  image: string;
  aspectRatio: string;
  targetId?: string;
}

const CINEMA_SPOTLIGHT_BANNERS: CinemaBanner[] = [
  {
    id: 'cb-dune2',
    catalogNumber: 'CH-01',
    title: 'DUNE: PART TWO (2024)',
    director: 'Denis Villeneuve',
    year: 2024,
    format: '70MM IMAX EXPANDED 1.43:1 MASTER',
    badge: '★ CANTON ZÜRICH ARCHIVAL FEATURE',
    specs: 'Native 4K 2160p HEVC • Dolby Atmos 7.1.4',
    desc: 'Filmed with Arri Alexa LF IMAX large-format cameras. Full 1.43:1 aspect ratio integration with Hans Zimmer’s acoustic soundscape and mounted 70mm film frame specimen.',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=85',
    aspectRatio: '1.43:1 IMAX Expanded',
    targetId: 'film-dune-2-70mm',
  },
  {
    id: 'cb-oppenheimer',
    catalogNumber: 'CH-02',
    title: 'OPPENHEIMER (2023)',
    director: 'Christopher Nolan',
    year: 2023,
    format: 'PHOTOCHEMICAL 65MM ORIGINAL NEGATIVE',
    badge: '★ PHOTOCHEMICAL ARCHIVE CROWN',
    specs: 'Direct 65mm Negative Scan • 5.1 DTS-HD Nolan Mix',
    desc: 'Mastered directly from the 65mm original camera negative without digital intermediate. Custom Kodak 65mm B&W film stock sequence in matte black linen hardcover.',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1600&auto=format&fit=crop&q=85',
    aspectRatio: '1.43:1 / 2.20:1 Variable',
    targetId: 'film-oppenheimer-70mm',
  },
  {
    id: 'cb-interstellar',
    catalogNumber: 'CH-06',
    title: 'INTERSTELLAR: 10TH ANNIVERSARY (2014)',
    director: 'Christopher Nolan',
    year: 2014,
    format: '15/70MM WORLDWIDE ROADSHOW RE-ISSUE',
    badge: '★ DECADE MEMORIAL IMAX RELEASE',
    specs: 'Over 60 Mins 15/70mm IMAX • Kip Thorne Physics Equations',
    desc: 'The cosmic relativity masterwork returns in 15/70mm format. Experience Gargantua black hole gravitational lensing and Hans Zimmer’s cathedral organ in reference clarity.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=85',
    aspectRatio: '1.43:1 / 2.39:1 Variable',
    targetId: 'film-interstellar-imax',
  },
  {
    id: 'cb-bladerunner',
    catalogNumber: 'CH-05',
    title: 'BLADE RUNNER 2049 (2017)',
    director: 'Denis Villeneuve',
    year: 2017,
    format: 'ROGER DEAKINS MASTERWORK STEELBOOK',
    badge: '★ OSCAR BEST CINEMATOGRAPHY',
    specs: '4K HDR10+ Dolby Vision • Reference Brutalist Mix',
    desc: 'Roger Deakins’ breathtaking dystopian frames presented in pristine 4K HDR. Brutalist architecture study monograph and brushed aluminum steelbook casing.',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&auto=format&fit=crop&q=85',
    aspectRatio: '2.39:1 Anamorphic Panavision',
    targetId: 'film-blade-runner-2049',
  },
  {
    id: 'cb-2001',
    catalogNumber: 'CH-04',
    title: '2001: A SPACE ODYSSEY (1968)',
    director: 'Stanley Kubrick',
    year: 1968,
    format: '70MM UNRESTORED PHOTOCHEMICAL PRINT',
    badge: '★ THE ARCHITECTURAL HORIZON',
    specs: '8K Original Negative Scan • 1968 6-Track 70mm Audio',
    desc: 'Stanley Kubrick’s monumental journey from prehistoric dawn to cosmic rebirth. Photochemical timing supervised by Christopher Nolan in matte white Swiss slipcase.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85',
    aspectRatio: '2.20:1 Super Panavision 70',
    targetId: 'film-2001-space-odyssey',
  },
];

export const CinemaSwissView: React.FC = () => {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice, setIsCartOpen } = useCartWishlist();

  // Filters & State
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewingFilm, setPreviewingFilm] = useState<CinemaItem | null>(null);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [dispatchEmail, setDispatchEmail] = useState('');
  const [dispatchSubscribed, setDispatchSubscribed] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  // Auto rotate banner every 6s
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % CINEMA_SPOTLIGHT_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Community Film Criticism Wall State
  const [criticismNotes, setCriticismNotes] = useState([
    {
      id: 'cn-1',
      author: 'ARCHITECTURAL_EYE',
      role: 'Film Historian',
      text: 'Villeneuve treats the frame as modern architecture. The brutalist structures of Giedi Prime in Dune 2 rival Le Corbusier in pure spatial geometry.',
      category: 'Dune Part Two',
      code: 'DOC-894',
    },
    {
      id: 'cn-2',
      author: 'ANALOG_PURIST_70',
      role: 'Cinémathèque Member',
      text: 'Nolan\'s refusal to use digital intermediaries makes Oppenheimer feel physically alive. You can feel the chemical grain reacting to light.',
      category: 'Oppenheimer',
      code: 'DOC-895',
    },
    {
      id: 'cn-3',
      author: 'KUBRICK_ARCHIVE',
      role: 'Restoration Lead',
      text: '2001 in 70mm uncompressed negative scan confirms that Kubrick had solved widescreen composition forever in 1968. Absolute precision.',
      category: '2001 Space Odyssey',
      code: 'DOC-896',
    },
    {
      id: 'cn-4',
      author: 'WONG_MONOGRAPH',
      role: 'Hong Kong Film Critic',
      text: 'In the Mood for Love uses the hallway frame as an emotional cage. The color palette of 1962 Hong Kong is pure architectural poetry.',
      category: 'In the Mood for Love',
      code: 'DOC-897',
    },
  ]);
  const [newNoteAuthor, setNewNoteAuthor] = useState('');
  const [newNoteRole, setNewNoteRole] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  // Filtered Cinema Items
  const filteredFilms = useMemo(() => {
    return CINEMA_CATALOG.filter((film) => {
      if (selectedGenre !== 'all' && film.genre !== selectedGenre) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = film.title.toLowerCase().includes(q);
        const inDirector = film.director.toLowerCase().includes(q);
        const inCatalog = film.catalogNumber.toLowerCase().includes(q);
        const inCountry = film.country.toLowerCase().includes(q);
        const inTag = film.tag.toLowerCase().includes(q);
        if (!inTitle && !inDirector && !inCatalog && !inCountry && !inTag) return false;
      }
      return true;
    });
  }, [selectedGenre, searchQuery]);

  // Handle Add to Cart
  const handleAddToCart = (item: CinemaItem) => {
    const album = cinemaToAlbum(item);
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
      author: newNoteAuthor.trim() || 'ANONYMOUS_ARCHIVIST',
      role: newNoteRole.trim() || 'Film Enthusiast',
      text: newNoteText.trim(),
      category: 'Film Critique',
      code: `DOC-${Math.floor(100 + Math.random() * 900)}`,
    };
    setCriticismNotes([newNote, ...criticismNotes]);
    setNewNoteText('');
    setNewNoteAuthor('');
    setNewNoteRole('');
  };

  return (
    <div
      className="cinema-swiss-root w-full relative text-black py-8 px-4 sm:px-6 md:px-8 overflow-hidden select-none bg-white"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.035) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Toast Notification (Swiss Rectangular Flat) */}
      {addedToast && (
        <div
          className="fixed bottom-6 right-6 z-50 p-4 flex items-center gap-4 bg-black text-white border-2 border-black"
          style={{ borderRadius: SWISS.radius }}
        >
          <div className="w-8 h-8 flex items-center justify-center bg-[#FF3000] text-white font-black text-sm">
            ✓
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#FF3000]">01. ARCHIVE ADDITION</p>
            <p className="font-bold text-sm uppercase tracking-tight">{addedToast}</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-4 px-3 py-1.5 bg-white text-black font-mono text-xs font-bold uppercase hover:bg-[#FF3000] hover:text-white transition-colors duration-150 cursor-pointer"
            style={{ borderRadius: SWISS.radius }}
          >
            Open Cart
          </button>
        </div>
      )}

      {/* Main Container - Widened to 1440px for spacious modernist browsing */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-24 sm:gap-32">

        {/* =========================================================================
            01. HERO SECTION: INTERNATIONAL TYPOGRAPHIC CINEMA ARCHIVE
        ========================================================================= */}
        <section className="relative pt-4">
          {/* Top Architectural Measurement Bar */}
          <div className="flex items-center justify-between border-b-2 border-black pb-2 text-[11px] font-mono uppercase tracking-widest text-[#525252]">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 bg-[#FF3000]" />
              <span className="font-black text-black">SWISS CINEMA ARCHIVE</span>
              <span>// 70MM LARGE FORMAT REPOSITORY</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <span>CANTON ZÜRICH · BASEL 1957</span>
              <span className="text-black font-bold">GRID RATIO 8:4</span>
            </div>
          </div>

          {/* Main Hero Grid: Asymmetrical 8:4 Ratio */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 border-4 border-black bg-white">
            
            {/* Left Column (8 cols): Giant Grotesque Headline & Statement */}
            <div className="lg:col-span-8 p-6 sm:p-10 md:p-14 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col justify-between space-y-8">
              <div>
                {/* Red Section Index */}
                <div className="inline-flex items-center gap-2 mb-4 text-xs font-mono font-black uppercase tracking-widest text-[#FF3000]">
                  <span>01.</span>
                  <span>SYSTEM // RESTORED ARCHIVE</span>
                </div>

                {/* Massive Grotesque Headline */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-black leading-[0.88] select-none">
                  CINEMA
                  <br />
                  <span className="text-transparent" style={{ WebkitTextStroke: '2px #000000' }}>ARCHIVE</span>
                </h1>

                {/* Objective Monograph Subtitle */}
                <p className="mt-8 text-lg sm:text-xl text-neutral-800 font-normal leading-relaxed max-w-xl text-left">
                  Objective preservation of landmark 70mm, 35mm photochemical masterworks and pristine 4K Criterion restorations. Universal clarity, mathematical compositions, and uncompressed acoustic master tracks.
                </p>
              </div>

              {/* Action Buttons: Strict Rectangular Inversion */}
              <div className="pt-6 flex flex-wrap items-center gap-4">
                <a
                  href="#cinema-catalog"
                  className="px-8 py-4 bg-black text-white hover:bg-[#FF3000] font-mono text-xs sm:text-sm font-black uppercase tracking-widest transition-colors duration-150 flex items-center gap-3 cursor-pointer"
                  style={{ borderRadius: SWISS.radius }}
                >
                  <span>EXPLORE SELECTION</span>
                  <ArrowRight size={16} strokeWidth={3} />
                </a>

                <a
                  href="#cinema-directors"
                  className="px-8 py-4 bg-white text-black hover:bg-black hover:text-white border-2 border-black font-mono text-xs sm:text-sm font-black uppercase tracking-widest transition-colors duration-150 flex items-center gap-3 cursor-pointer"
                  style={{ borderRadius: SWISS.radius }}
                >
                  <Camera size={16} />
                  <span>AUTEUR ATELIER</span>
                </a>
              </div>
            </div>

            {/* Right Column (4 cols): Bauhaus Geometric Composition & Specs */}
            <div className="lg:col-span-4 bg-[#F2F2F2] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              {/* Technical Indicator */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <span className="font-mono text-xs font-black uppercase tracking-widest text-[#FF3000]">SPECIFICATION</span>
                  <span className="font-mono text-xs font-bold text-black">ISO 70MM</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-neutral-300">
                    <span className="text-neutral-500 uppercase">NEGATIVE SCAN</span>
                    <span className="font-bold text-black">8K 16-BIT UNCOMPRESSED</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-300">
                    <span className="text-neutral-500 uppercase">ASPECT RATIOS</span>
                    <span className="font-bold text-black">1.43:1 / 2.20:1 / 2.39:1</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-300">
                    <span className="text-neutral-500 uppercase">COLOR SCIENCE</span>
                    <span className="font-bold text-black">ACES 2065-1 ARCHIVAL</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-300">
                    <span className="text-neutral-500 uppercase">AUDIO ENCODING</span>
                    <span className="font-bold text-black">96kHz / 24-BIT MASTER</span>
                  </div>
                </div>
              </div>

              {/* Bauhaus Abstract Composition Box */}
              <div className="p-6 bg-white border-2 border-black relative overflow-hidden">
                {/* Dot Matrix Texture Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                  }}
                />

                <div className="relative z-10 space-y-3">
                  <div className="w-10 h-10 bg-[#FF3000] flex items-center justify-center text-white font-mono font-black text-sm">
                    70
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-black">
                    PHOTONIC CALIBRATION
                  </h3>
                  <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                    Every film entry catalogued conforms to archival preservation standards set by FIAF (International Federation of Film Archives).
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-3 bg-black text-white text-center font-mono text-xs font-bold uppercase tracking-widest">
                VERIFIED ARCHIVAL STOCK // 2026
              </div>

            </div>

          </div>

          {/* Stats Bar (4 Equal Columns with 2px borders) */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-x-4 border-b-4 border-black bg-white">
            {[
              { num: '70MM', label: 'LARGE FORMAT MASTER SCAN', red: true },
              { num: '4K HDR', label: 'REFERENCE LEVEL BITRATE', red: false },
              { num: '08', label: 'CURATED MASTER EDITIONS', red: false },
              { num: 'FIAF', label: 'CERTIFIED PRESERVATION', red: true },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`p-6 border-b md:border-b-0 ${idx < 3 ? 'md:border-r-2 border-black' : ''} ${idx % 2 === 0 ? 'border-r md:border-r-2' : ''} flex flex-col justify-between hover:bg-[#F2F2F2] transition-colors duration-150`}
              >
                <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tighter ${stat.red ? 'text-[#FF3000]' : 'text-black'}`}>
                  {stat.num}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-600 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            FEATURED 70MM LARGE FORMAT SPOTLIGHT BANNER CAROUSEL
        ========================================================================= */}
        <section className="relative">
          {/* Top Architectural Indicator */}
          <div className="flex items-center justify-between border-b-2 border-black pb-2 text-[11px] font-mono uppercase tracking-widest text-[#525252] mb-4">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 bg-[#FF3000]" />
              <span className="font-black text-black">SPOTLIGHT PANAVISION &amp; 70MM LARGE FORMAT</span>
              <span>// CH-SERIES ARCHIVE</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span>CANTON BASEL ARCHIVE</span>
              <span className="text-black font-bold">EDITION 0{currentBannerIdx + 1} / 0{CINEMA_SPOTLIGHT_BANNERS.length}</span>
            </div>
          </div>

          <div 
            className="border-4 border-black bg-black text-white overflow-hidden relative"
            style={{ borderRadius: SWISS.radius }}
          >
            {/* Banner Slide Container */}
            <div className="relative min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex flex-col justify-end p-6 sm:p-10 md:p-14 overflow-hidden">
              {/* Background 70mm Film Frame */}
              <img
                src={CINEMA_SPOTLIGHT_BANNERS[currentBannerIdx].image}
                alt={CINEMA_SPOTLIGHT_BANNERS[currentBannerIdx].title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 brightness-65 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />

              {/* Swiss Minimalist Linear Overlay */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '100% 32px',
                }}
              />

              {/* Banner Content Container */}
              <div className="relative z-10 max-w-4xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-3 py-1 bg-[#FF3000] text-white font-mono text-xs font-black uppercase tracking-widest"
                    style={{ borderRadius: SWISS.radius }}
                  >
                    {CINEMA_SPOTLIGHT_BANNERS[currentBannerIdx].badge}
                  </span>
                  <span
                    className="px-3 py-1 bg-white text-black font-mono text-xs font-black uppercase tracking-widest"
                    style={{ borderRadius: SWISS.radius }}
                  >
                    {CINEMA_SPOTLIGHT_BANNERS[currentBannerIdx].catalogNumber}
                  </span>
                  <span className="text-xs font-mono text-white/80 border border-white/30 px-2 py-0.5">
                    {CINEMA_SPOTLIGHT_BANNERS[currentBannerIdx].format}
                  </span>
                  <span className="text-xs font-mono text-[#FF3000] border border-[#FF3000]/60 px-2 py-0.5">
                    {CINEMA_SPOTLIGHT_BANNERS[currentBannerIdx].aspectRatio}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
                  {CINEMA_SPOTLIGHT_BANNERS[currentBannerIdx].title}
                </h3>

                <p className="text-xs sm:text-sm font-mono text-white/90">
                  DIRECTED BY <strong className="text-white font-black">{CINEMA_SPOTLIGHT_BANNERS[currentBannerIdx].director.toUpperCase()}</strong> // {CINEMA_SPOTLIGHT_BANNERS[currentBannerIdx].specs}
                </p>

                <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl font-sans leading-relaxed">
                  {CINEMA_SPOTLIGHT_BANNERS[currentBannerIdx].desc}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#cinema-catalog"
                    className="px-8 py-3 bg-[#FF3000] hover:bg-white hover:text-black text-white font-mono text-xs font-black uppercase tracking-widest transition-colors duration-150 flex items-center gap-3 cursor-pointer"
                    style={{ borderRadius: SWISS.radius }}
                  >
                    <span>VIEW FILM IN SELECTION</span>
                    <ArrowRight size={16} strokeWidth={3} />
                  </a>

                  <div className="text-xs font-mono text-neutral-400 bg-black/60 px-3 py-2 border border-white/20">
                    SLIDE 0{currentBannerIdx + 1} / 0{CINEMA_SPOTLIGHT_BANNERS.length}
                  </div>
                </div>
              </div>

              {/* Prev / Next Navigation Arrows (Swiss 0px sharp buttons) */}
              <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentBannerIdx((prev) => (prev - 1 + CINEMA_SPOTLIGHT_BANNERS.length) % CINEMA_SPOTLIGHT_BANNERS.length)}
                  className="w-12 h-12 bg-white text-black hover:bg-[#FF3000] hover:text-white border-2 border-black flex items-center justify-center font-mono font-black transition-colors duration-150 cursor-pointer"
                  style={{ borderRadius: SWISS.radius }}
                  title="Previous Archival Feature"
                >
                  <ChevronLeft size={22} strokeWidth={3} />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentBannerIdx((prev) => (prev + 1) % CINEMA_SPOTLIGHT_BANNERS.length)}
                  className="w-12 h-12 bg-white text-black hover:bg-[#FF3000] hover:text-white border-2 border-black flex items-center justify-center font-mono font-black transition-colors duration-150 cursor-pointer"
                  style={{ borderRadius: SWISS.radius }}
                  title="Next Archival Feature"
                >
                  <ChevronRight size={22} strokeWidth={3} />
                </button>
              </div>

              {/* Segmented Progress Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {CINEMA_SPOTLIGHT_BANNERS.map((banner, idx) => (
                  <button
                    key={banner.id}
                    type="button"
                    onClick={() => setCurrentBannerIdx(idx)}
                    className="h-2 transition-all cursor-pointer"
                    style={{
                      width: currentBannerIdx === idx ? '36px' : '10px',
                      backgroundColor: currentBannerIdx === idx ? SWISS.red : 'rgba(255,255,255,0.4)',
                      borderRadius: '0px',
                    }}
                    title={`Feature 0${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            02. SELECTION // INTERACTIVE FILTER DOCK & SEARCH
        ========================================================================= */}
        <section id="cinema-catalog" className="flex flex-col gap-6">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b-4 border-black pb-4 gap-4">
            <div>
              <div className="text-xs font-mono font-black uppercase tracking-widest text-[#FF3000] mb-1">
                02. SELECTION // DIRECTORS & EDITIONS
              </div>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-black">
                MASTER FILM CATALOG
              </h2>
            </div>

            {/* Strict Rectangular Search Box */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH TITLE, DIRECTOR, CATALOG NO..."
                className="w-full pl-10 pr-8 py-3 bg-white border-2 border-black text-xs font-mono uppercase tracking-wider text-black placeholder:text-neutral-400 outline-none focus:border-[#FF3000]"
                style={{ borderRadius: SWISS.radius }}
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black pointer-events-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-[#FF3000] cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Genre Filter Strip: Strict Rectangular Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
            {[
              { id: 'all', label: 'ALL ENTRIES' },
              { id: 'Auteur', label: 'AUTEUR CINEMA' },
              { id: 'Sci-Fi', label: '70MM SCI-FI' },
              { id: 'Noir', label: 'NEO-NOIR' },
              { id: 'Classic', label: 'CRITERION CLASSICS' },
            ].map((tab) => {
              const isActive = selectedGenre === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGenre(tab.id)}
                  type="button"
                  className={`px-5 py-2.5 text-xs font-mono font-black uppercase tracking-widest transition-colors duration-150 cursor-pointer border-2 border-black ${isActive
                    ? 'bg-[#FF3000] text-white border-[#FF3000]'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                    }`}
                  style={{ borderRadius: SWISS.radius }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Results Index */}
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#525252]">
            CATALOG INDEX // {filteredFilms.length} ENTRIES AVAILABLE
          </div>

          {/* Film Grid: Strict 4-Column Architectural Cards */}
          {filteredFilms.length === 0 ? (
            <div className="p-16 text-center border-4 border-black bg-[#F2F2F2]">
              <p className="text-2xl font-black uppercase tracking-tight text-black mb-2">NO ARCHIVAL ENTRIES LOCATED</p>
              <p className="text-xs font-mono uppercase text-neutral-600 mb-6">Modify filter parameters or query terms.</p>
              <button
                onClick={() => {
                  setSelectedGenre('all');
                  setSearchQuery('');
                }}
                className="px-6 py-3 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#FF3000] transition-colors"
                style={{ borderRadius: SWISS.radius }}
              >
                RESET CATALOG FILTER
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFilms.map((film) => {
                const wishlisted = isWishlisted(film.id);
                return (
                  <div
                    key={film.id}
                    className="group bg-white border-2 border-black flex flex-col justify-between transition-colors duration-150 hover:border-[#FF3000]"
                    style={{ borderRadius: SWISS.radius }}
                  >
                    <div>
                      {/* Frame Image Container with Crisp 16:9 Aspect Ratio */}
                      <div className="relative w-full aspect-[4/5] bg-black border-b-2 border-black overflow-hidden">
                        <img
                          src={film.coverImage}
                          alt={film.title}
                          className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-300"
                        />

                        {/* Top Catalog Badge */}
                        <div className="absolute top-0 left-0 bg-black text-white px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-widest border-b-2 border-r-2 border-black">
                          {film.catalogNumber}
                        </div>

                        {/* Top Right Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(cinemaToAlbum(film));
                          }}
                          className={`absolute top-0 right-0 w-8 h-8 flex items-center justify-center border-b-2 border-l-2 border-black ${wishlisted ? 'bg-[#FF3000] text-white' : 'bg-white text-black hover:bg-black hover:text-white'} transition-colors duration-150 cursor-pointer`}
                          style={{ borderRadius: SWISS.radius }}
                          title={wishlisted ? 'Remove from Archive' : 'Save to Archive'}
                        >
                          <Heart size={14} className={wishlisted ? 'fill-white' : ''} />
                        </button>

                        {/* Bottom Format Ribbon */}
                        <div className="absolute bottom-0 inset-x-0 bg-black/90 text-white px-3 py-1 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider">
                          <span>{film.aspectRatio}</span>
                          <span className="text-[#FF3000]">{film.runtimeMinutes} MIN</span>
                        </div>
                      </div>

                      {/* Film Meta Information */}
                      <div className="p-5 space-y-3">
                        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF3000]">
                          {film.tag}
                        </div>

                        <h3 className="text-xl font-black uppercase tracking-tight text-black leading-tight line-clamp-1 group-hover:text-[#FF3000] transition-colors duration-150">
                          {film.title}
                        </h3>

                        <div className="text-xs font-mono uppercase space-y-1 text-neutral-700">
                          <p className="font-bold text-black">DIR. {film.director}</p>
                          <p>{film.year} · {film.country} · {film.format}</p>
                        </div>

                        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
                          {film.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions & Price */}
                    <div className="p-5 pt-0">
                      <div className="border-t-2 border-black pt-3 flex items-baseline justify-between mb-4">
                        <div className="text-lg font-black font-mono text-black">
                          {formatPrice(film.priceUSD, film.priceVND)}
                        </div>
                        {film.originalPriceUSD && (
                          <div className="text-xs font-mono text-neutral-400 line-through">
                            {formatPrice(film.originalPriceUSD)}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewingFilm(film);
                            setActiveFrameIndex(0);
                          }}
                          className="px-3 py-2.5 bg-white text-black hover:bg-[#F2F2F2] border-2 border-black text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          style={{ borderRadius: SWISS.radius }}
                        >
                          <Play size={12} className="fill-black" />
                          <span>SPECS</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(film)}
                          className="px-3 py-2.5 bg-black text-white hover:bg-[#FF3000] border-2 border-black text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          style={{ borderRadius: SWISS.radius }}
                        >
                          <ShoppingCart size={12} />
                          <span>ADD</span>
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
            03. DIRECTORS // AUTEUR ATELIER SPOTLIGHT
        ========================================================================= */}
        <section id="cinema-directors" className="border-4 border-black bg-white">
          <div className="p-6 sm:p-10 border-b-4 border-black bg-[#F2F2F2] flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-black uppercase tracking-widest text-[#FF3000] mb-1">
                03. DIRECTORS // AUTEUR ATELIER
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
                MASTERS OF THE VISUAL FRAME
              </h2>
            </div>
            <p className="text-xs font-mono uppercase text-neutral-600 max-w-md">
              ARCHITECTURAL COMPOSITION, PHOTONIC CALIBRATION & FILM CELL PRESERVATION.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x-2 divide-black">
            {[
              {
                code: 'DIR-01',
                name: 'DENIS VILLENEUVE',
                style: 'THE GRAND SCALE MODERNIST',
                works: 'Dune Part Two · Blade Runner 2049 · Arrival',
                desc: 'Colossal brutalist architecture, monochromatic desert vistas, and uncompressed acoustic weight.',
              },
              {
                code: 'DIR-02',
                name: 'CHRISTOPHER NOLAN',
                style: 'THE PHOTOCHEMICAL PURIST',
                works: 'Oppenheimer · Interstellar · Dunkirk',
                desc: 'Rigid adherence to 65mm/70mm physical film emulsion, practical physical effects, and non-linear timelines.',
              },
              {
                code: 'DIR-03',
                name: 'WONG KAR-WAI',
                style: 'THE POETIC IMPRESSIONIST',
                works: 'In the Mood for Love · Chungking Express',
                desc: 'Step-printed step-framing, saturated European widescreen framing, and melancholic romantic isolation.',
              },
              {
                code: 'DIR-04',
                name: 'STANLEY KUBRICK',
                style: 'THE MATHEMATICAL MASTER',
                works: '2001 Space Odyssey · The Shining · Barry Lyndon',
                desc: 'One-point perspective symmetry, pioneering special photographic effects, and clinical philosophical rigor.',
              },
            ].map((auteur, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 flex flex-col justify-between hover:bg-[#F2F2F2] transition-colors duration-150"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-300 mb-4">
                    <span className="font-mono text-xs font-black text-[#FF3000]">{auteur.code}</span>
                    <span className="w-2 h-2 bg-black" />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight text-black">
                    {auteur.name}
                  </h4>
                  <p className="text-[11px] font-mono font-bold uppercase text-[#FF3000] mt-1 mb-3">
                    {auteur.style}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal mb-4">
                    {auteur.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-300 text-[10px] font-mono uppercase text-neutral-700">
                  <span className="font-bold block text-black mb-0.5">CANON WORKS:</span>
                  <span>{auteur.works}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            04. DIALOGUE // CRITICISM & ARCHIVE WALL
        ========================================================================= */}
        <section id="cinema-dialogue" className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b-4 border-black pb-4 gap-4">
            <div>
              <div className="text-xs font-mono font-black uppercase tracking-widest text-[#FF3000] mb-1">
                04. DIALOGUE // CRITIQUE & ARCHIVE NOTES
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
                CINEMATHEQUE WALL
              </h2>
            </div>
            <p className="text-xs font-mono uppercase text-neutral-600">
              DISPATCHES FROM FILM RESTORATION LABS AND SCHOLARS.
            </p>
          </div>

          {/* Notes Grid: 4-Column Objective Archival Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {criticismNotes.map((note) => (
              <div
                key={note.id}
                className="p-6 bg-white border-2 border-black flex flex-col justify-between h-64 hover:border-[#FF3000] transition-colors duration-150"
                style={{ borderRadius: SWISS.radius }}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-black pb-2 mb-3 text-[10px] font-mono uppercase tracking-widest">
                    <span className="font-bold text-[#FF3000]">{note.code}</span>
                    <span className="text-neutral-500">{note.category}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-black font-normal">
                    "{note.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-neutral-300 flex items-center justify-between text-[10px] font-mono uppercase">
                  <span className="font-bold text-black">{note.author}</span>
                  <span className="text-neutral-500">{note.role}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submission Form: Strict Rectangular Monospace Input Strip */}
          <form
            onSubmit={handleAddNote}
            className="p-6 sm:p-8 bg-[#F2F2F2] border-2 border-black flex flex-col md:flex-row items-center gap-4"
            style={{ borderRadius: SWISS.radius }}
          >
            <input
              type="text"
              value={newNoteAuthor}
              onChange={(e) => setNewNoteAuthor(e.target.value)}
              placeholder="SCHOLAR / ARCHIVIST HANDLE..."
              className="w-full md:w-56 px-4 py-3 bg-white border-2 border-black font-mono text-xs uppercase tracking-wider text-black outline-none focus:border-[#FF3000]"
              style={{ borderRadius: SWISS.radius }}
            />
            <input
              type="text"
              value={newNoteRole}
              onChange={(e) => setNewNoteRole(e.target.value)}
              placeholder="AFFILIATION / LAB..."
              className="w-full md:w-44 px-4 py-3 bg-white border-2 border-black font-mono text-xs uppercase tracking-wider text-black outline-none focus:border-[#FF3000]"
              style={{ borderRadius: SWISS.radius }}
            />
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="SUBMIT TECHNICAL ARCHIVAL OBSERVATION OR CRITIQUE..."
              className="flex-1 w-full px-4 py-3 bg-white border-2 border-black font-mono text-xs uppercase tracking-wider text-black outline-none focus:border-[#FF3000]"
              style={{ borderRadius: SWISS.radius }}
            />
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-black text-white hover:bg-[#FF3000] font-mono text-xs font-black uppercase tracking-widest transition-colors duration-150 cursor-pointer whitespace-nowrap"
              style={{ borderRadius: SWISS.radius }}
            >
              TRANSMIT DISPATCH
            </button>
          </form>
        </section>

        {/* =========================================================================
            05. DISPATCH // SUBSCRIPTION ARCHIVE BULLETIN
        ========================================================================= */}
        <section className="border-4 border-black bg-white p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="text-xs font-mono font-black uppercase tracking-widest text-[#FF3000]">
              05. DISPATCH // 70MM RESTORATION BULLETIN
            </div>
            <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              NEVER MISS A LIMITED 70MM RE-ISSUE
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
              Official weekly bulletin covering photochemical laboratory negative scans, Criterion 4K restorations, and limited film cell allotments. Zero promotional fluff.
            </p>
          </div>

          <div className="w-full md:w-96">
            {dispatchSubscribed ? (
              <div className="p-4 bg-[#F2F2F2] border-2 border-black font-mono text-xs font-bold uppercase text-black flex items-center gap-2">
                <span className="text-[#FF3000]">✓</span>
                <span>REGISTERED ON RESTORATION DISPATCH.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (dispatchEmail) setDispatchSubscribed(true);
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  value={dispatchEmail}
                  onChange={(e) => setDispatchEmail(e.target.value)}
                  placeholder="ARCHIVIST@INSTITUTE.CH"
                  className="flex-1 px-4 py-3 bg-white border-2 border-black font-mono text-xs uppercase tracking-wider text-black outline-none focus:border-[#FF3000]"
                  style={{ borderRadius: SWISS.radius }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white hover:bg-[#FF3000] font-mono text-xs font-black uppercase tracking-widest transition-colors duration-150 cursor-pointer whitespace-nowrap"
                  style={{ borderRadius: SWISS.radius }}
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </section>

      </div>

      {/* =========================================================================
          TECHNICAL SPECIFICATION & FRAME PREVIEW MODAL
      ========================================================================= */}
      {previewingFilm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-4xl bg-white border-4 border-black p-6 sm:p-8 max-h-[90vh] overflow-y-auto flex flex-col justify-between space-y-6"
            style={{ borderRadius: SWISS.radius }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b-2 border-black pb-4">
              <div>
                <div className="flex items-center gap-3 mb-1 font-mono text-xs">
                  <span className="bg-black text-white px-2 py-0.5 font-black uppercase">{previewingFilm.catalogNumber}</span>
                  <span className="text-[#FF3000] font-bold">{previewingFilm.format}</span>
                  <span className="text-neutral-500">{previewingFilm.aspectRatio}</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight text-black">
                  {previewingFilm.title} ({previewingFilm.year})
                </h3>
                <p className="text-xs font-mono uppercase text-neutral-600">
                  DIR. {previewingFilm.director} · {previewingFilm.country} · {previewingFilm.runtimeMinutes} MINUTES
                </p>
              </div>

              <button
                onClick={() => setPreviewingFilm(null)}
                className="w-10 h-10 border-2 border-black bg-white text-black hover:bg-black hover:text-white font-mono font-bold flex items-center justify-center transition-colors cursor-pointer"
                style={{ borderRadius: SWISS.radius }}
              >
                ✕
              </button>
            </div>

            {/* Frame Carousel */}
            <div className="space-y-3">
              <div className="relative w-full aspect-[16/9] bg-black border-2 border-black overflow-hidden">
                <img
                  src={previewingFilm.previewFrames[activeFrameIndex] || previewingFilm.coverImage}
                  alt={previewingFilm.title}
                  className="w-full h-full object-contain"
                />

                {/* Frame Nav Arrows */}
                {previewingFilm.previewFrames.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveFrameIndex((prev) =>
                          prev === 0 ? previewingFilm.previewFrames.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-black text-black hover:bg-[#FF3000] hover:text-white flex items-center justify-center font-mono font-black transition-colors cursor-pointer"
                      style={{ borderRadius: SWISS.radius }}
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setActiveFrameIndex((prev) =>
                          (prev + 1) % previewingFilm.previewFrames.length
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-black text-black hover:bg-[#FF3000] hover:text-white flex items-center justify-center font-mono font-black transition-colors cursor-pointer"
                      style={{ borderRadius: SWISS.radius }}
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {/* Frame Indicator */}
              {previewingFilm.previewFrames.length > 1 && (
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-500 uppercase">PHOTOGRAM {activeFrameIndex + 1} OF {previewingFilm.previewFrames.length}</span>
                  <div className="flex gap-2">
                    {previewingFilm.previewFrames.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFrameIndex(idx)}
                        className={`w-6 h-2 border border-black transition-colors ${idx === activeFrameIndex ? 'bg-[#FF3000]' : 'bg-neutral-200'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Specifications Dossier */}
            <div className="p-5 bg-[#F2F2F2] border-2 border-black space-y-3">
              <div className="text-xs font-mono font-black uppercase text-[#FF3000]">
                TECHNICAL DOSSIER & RESTORATION AUDIT
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neutral-800">
                {previewingFilm.technicalSpecs.map((spec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#FF3000] font-black">▪</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Footer */}
            <div className="border-t-2 border-black pt-4 flex items-center justify-between">
              <div className="text-2xl font-black font-mono text-black">
                {formatPrice(previewingFilm.priceUSD, previewingFilm.priceVND)}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewingFilm(null)}
                  className="px-5 py-3 border-2 border-black bg-white text-black hover:bg-[#F2F2F2] font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
                  style={{ borderRadius: SWISS.radius }}
                >
                  DISMISS
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(previewingFilm);
                    setPreviewingFilm(null);
                  }}
                  className="px-6 py-3 bg-[#FF3000] text-white hover:bg-black font-mono text-xs font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-2"
                  style={{ borderRadius: SWISS.radius }}
                >
                  <ShoppingCart size={14} />
                  <span>ADD TO ARCHIVE</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
