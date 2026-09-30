'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { CartDrawer } from '../../components/CartDrawer';
import { WishlistModal } from '../../components/WishlistModal';
import { ChatbotModal } from '../../components/ChatbotModal';
import { AudioPlayer } from '../../components/AudioPlayer';
import { AdminModal } from '../../components/AdminModal';
import { FeedbackModal } from '../../components/FeedbackModal';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Footer } from '../../components/Footer';
import { Album } from '../../types';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useActiveFandom } from '../../utils/fandomTheme';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Check, 
  Search, 
  SlidersHorizontal, 
  Flame, 
  ShieldCheck, 
  Radio, 
  Tag, 
  Zap,
  Eye
} from 'lucide-react';

interface MerchItem {
  id: string;
  name: string;
  artist: string;
  category: string;
  universe: string;
  priceUSD: number;
  priceVND: number;
  image: string;
  stock: number;
  badge?: string;
  description: string;
  features: string[];
}

const mockMerchList: MerchItem[] = [
  // ==================== K-POP MERCH ====================
  {
    id: 'md-aespa-ls',
    name: 'aespa Official Lightstick Ver. 2',
    artist: 'aespa',
    category: 'Lightstick',
    universe: 'K-Pop',
    priceUSD: 55.0,
    priceVND: 1375000,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    stock: 14,
    badge: 'Synk Bluetooth Sync',
    description: 'Central concert control Bluetooth lightstick with 4 interchangeable ae-Avatar emblem caps and holographic strap.',
    features: ['Bluetooth 5.2 Stadium Pairing', '4 ae-Member Emblems', 'Holographic Wrist Strap'],
  },
  {
    id: 'md-bts-ls',
    name: 'BTS Official Light Stick: MAP OF THE SOUL SPECIAL EDITION',
    artist: 'BTS',
    category: 'Lightstick',
    universe: 'K-Pop',
    priceUSD: 62.0,
    priceVND: 1550000,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    stock: 9,
    badge: 'ARMY Bomb Verified',
    description: 'The iconic stadium lightstick with 5 stage flash modes, seat-pairing technology, and 7 exclusive photo cards.',
    features: ['7 Special Photocard Set', 'Wireless Central Stage Sync', 'Micro USB Rechargeable'],
  },
  {
    id: 'md-nj-ls',
    name: 'NewJeans Official Lightstick (Binky Bong Special Pack)',
    artist: 'NewJeans',
    category: 'Lightstick',
    universe: 'K-Pop',
    priceUSD: 52.0,
    priceVND: 1300000,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    stock: 18,
    badge: 'Tokki Limited Edition',
    description: 'Adorable Binky Bong featuring interchangeable colored bunny ears, Y2K retro sticker decals, and canvas pouch.',
    features: ['Interchangeable Bunny Ears', 'Custom Y2K Sticker Sheet', 'Dedicated Canvas Carry Bag'],
  },
  {
    id: 'md-skz-ls',
    name: 'Stray Kids Official Light Stick Ver. 2',
    artist: 'Stray Kids',
    category: 'Lightstick',
    universe: 'K-Pop',
    priceUSD: 58.0,
    priceVND: 1450000,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    stock: 11,
    badge: 'Nachimbong OLED',
    description: 'Upgraded Nachimbong with integrated digital OLED compass display screen and custom team rhythm sensor.',
    features: ['Digital OLED Front Screen', 'Custom Compass Gyro Sensor', 'Live Concert Rhythm Mode'],
  },
  {
    id: 'md-bp-ls',
    name: 'BLACKPINK Official Lightstick Ver. 2 Limited Edition',
    artist: 'BLACKPINK',
    category: 'Lightstick',
    universe: 'K-Pop',
    priceUSD: 56.0,
    priceVND: 1400000,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    badge: 'Pyongbong Sound React',
    description: 'Features soft silicone hammer heads that squeak on impact, reactive audio sound mode, and dual pink glow.',
    features: ['Audio Reaction Mode', 'Soft Squeaking Silicone Heads', 'Adjustable Dimmer Control'],
  },
  {
    id: 'md-nj-hoodie',
    name: 'NewJeans "Get Up" Y2K Heavyweight Tour Hoodie',
    artist: 'NewJeans',
    category: 'Apparel',
    universe: 'K-Pop',
    priceUSD: 68.0,
    priceVND: 1700000,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    stock: 22,
    badge: 'Official Tour Apparel',
    description: '450gsm heavyweight brushed cotton fleece hoodie with embroidered Powerpuff bunnies chest patch and raw hems.',
    features: ['450gsm Premium Cotton Fleece', 'Embroidered Chest Patch', 'Custom Metal Aglet Drawstrings'],
  },
  {
    id: 'md-aespa-jacket',
    name: 'aespa "Armageddon" Cyberpunk Reflective Windbreaker',
    artist: 'aespa',
    category: 'Apparel',
    universe: 'K-Pop',
    priceUSD: 84.0,
    priceVND: 2100000,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
    stock: 8,
    badge: 'Limited Run 500 Pcs',
    description: 'Water-resistant nylon technical jacket with 3M reflective typography and detachable holographic tactical strap.',
    features: ['3M Scotchlite Reflective Ink', 'Waterproof Technical Shell', 'Tactical Modular Keyring'],
  },
  {
    id: 'md-pc-binder',
    name: 'Fan Hub Plus Holographic Photocard Binder (360 Pockets)',
    artist: 'Fan Hub Plus',
    category: 'Accessories',
    universe: 'K-Pop',
    priceUSD: 26.0,
    priceVND: 650000,
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=600&q=80',
    stock: 40,
    badge: 'Acid-Free Archival',
    description: '9-pocket side-loading binder with rainbow holographic hardcover and acid-free non-PVC protective card sleeves.',
    features: ['360 Total Card Capacity', 'Acid-Free Archival Safe', 'Heavy Duty Zipper Closure'],
  },

  // ==================== GAMING ARENA MERCH ====================
  {
    id: 'md-t1-keycaps',
    name: 'T1 World Champions 2024 Hall of Legends Mechanical Keycap Set',
    artist: 'T1 Esports',
    category: 'Peripherals',
    universe: 'Gaming',
    priceUSD: 65.0,
    priceVND: 1625000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    stock: 12,
    badge: 'Faker 5x Champion Edition',
    description: '142-key dye-sublimated PBT keycaps in signature red, white, and gold featuring the iconic Hall of Legends crown motif.',
    features: ['142-Key PBT Dye-Sub', 'Cherry Profile Compatible', 'Commemorative Novelty Keys'],
  },
  {
    id: 'md-er-map',
    name: 'Elden Ring Lands Between Heavy Canvas Cloth Map (24x36")',
    artist: 'FromSoftware',
    category: 'Collectibles',
    universe: 'Gaming',
    priceUSD: 28.0,
    priceVND: 700000,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    stock: 16,
    badge: 'FromSoftware Official',
    description: 'High-definition archival pigment print on weathered canvas fabric showing all Erdtree sites, dungeons, and runes.',
    features: ['100% Archival Canvas Fabric', 'Fray-Resistant Stitching', 'Display Leather Binding Cord'],
  },
  {
    id: 'md-ff-sword',
    name: 'Final Fantasy VII Die-cast Buster Sword Desktop Display',
    artist: 'Square Enix',
    category: 'Collectibles',
    universe: 'Gaming',
    priceUSD: 42.0,
    priceVND: 1050000,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    stock: 12,
    badge: 'Square Enix Prop',
    description: 'Precision zinc alloy miniature replica with dual Materia slots, weathering details, and weighted display pediment.',
    features: ['Heavy Zinc Alloy Die-Cast', 'Dual Translucent Materia Gems', 'Solid Slate Display Stand'],
  },
  {
    id: 'md-genshin-vision',
    name: 'Genshin Impact Metallic Anemo Vision & Light-Up Orb Desk Totem',
    artist: 'HoYo-MiX',
    category: 'Accessories',
    universe: 'Gaming',
    priceUSD: 32.0,
    priceVND: 800000,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    badge: 'miHoYo Authentic',
    description: 'Die-cast metallic frame with rechargeable pulsing LED core replicating the sacred Mondstadt Anemo Vision.',
    features: ['Rechargeable Type-C LED', 'Antiqued Brass Casing', 'Velvet Presentation Box'],
  },

  // ==================== MANGA GUILD MERCH ====================
  {
    id: 'md-csm-pochita',
    name: 'Chainsaw Man Pochita 1:1 Scale Lifesize Corduroy Plush Doll',
    artist: 'Tatsuki Fujimoto',
    category: 'Collectibles',
    universe: 'Manga',
    priceUSD: 45.0,
    priceVND: 1125000,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    badge: 'Shueisha Certified',
    description: 'Faithful lifesize Pochita plush with soft plush chainsaw blade, pull cord tail, and embroidered expressive eyes.',
    features: ['Lifesize 35cm Height', 'High-Density Soft Velvet', 'Pull-String Cord Mechanism'],
  },
  {
    id: 'md-berserk-sword',
    name: 'Berserk Dragon Slayer Heavy Steel Bookmark & Display Stand',
    artist: 'Kentaro Miura',
    category: 'Accessories',
    universe: 'Manga',
    priceUSD: 24.0,
    priceVND: 600000,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    stock: 30,
    badge: 'Young Animal Official',
    description: 'Blackened stainless steel bookmark engraved with the Brand of Sacrifice and ultra-thin profile suited for tankōbon volumes.',
    features: ['Laser-Cut Stainless Steel', 'Brand of Sacrifice Enamel', 'Acrylic Mini Desk Stand'],
  },
  {
    id: 'md-op-shikishi',
    name: 'One Piece Egghead Climax High-Gloss Gold Foil Shikishi Art Board',
    artist: 'Eiichiro Oda',
    category: 'Prints',
    universe: 'Manga',
    priceUSD: 19.0,
    priceVND: 475000,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    stock: 45,
    badge: 'Jump Festa 2025 Special',
    description: 'Thick traditional washi cardboard illustration board with hot-stamped gold foil edges celebrating Gear 5 Sun God Luffy.',
    features: ['Traditional Japanese Shikishi', 'Gold Foil Beveled Borders', 'Official Holographic Seal'],
  },

  // ==================== ANIME SAKUGA MERCH ====================
  {
    id: 'md-ds-diorama',
    name: 'Demon Slayer Tanjiro & Rengoku Acrylic Flame Diorama',
    artist: 'Ufotable',
    category: 'Collectibles',
    universe: 'Anime',
    priceUSD: 34.0,
    priceVND: 850000,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    badge: 'ufotable Certified',
    description: 'Multi-layered 3D acrylic display diorama capturing the monumental climax battle with transparent flame effects.',
    features: ['4-Layer Laser Cut Acrylic', 'Gold Foil Embellished Base', 'Original Keyframe Art'],
  },
  {
    id: 'md-op-pass',
    name: 'One Piece Film: Red Uta World Diva Concert Pass & Lanyard',
    artist: 'Toei Animation',
    category: 'Accessories',
    universe: 'Anime',
    priceUSD: 22.0,
    priceVND: 550000,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    stock: 35,
    badge: 'Toei Animation Official',
    description: 'Replica metal VIP laminate pass from Elegia concert island with rainbow woven lanyard and Uta music badge.',
    features: ['Solid Metal Core Pass', 'Holographic Front Foil', 'Heavy Woven Neck Lanyard'],
  },
  {
    id: 'md-eva-lanyard',
    name: 'Evangelion Unit-01 Awakening Heavy Modular Tactical Lanyard',
    artist: 'Khara Studio',
    category: 'Accessories',
    universe: 'Anime',
    priceUSD: 25.0,
    priceVND: 625000,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    stock: 18,
    badge: 'Radio EVA Certified',
    description: 'Military-grade nylon lanyard with anodized zinc carabiner buckle and Unit-01 purple/acid green colorway.',
    features: ['Quick-Release Metal Cobra Buckle', 'High-Density Jacquard Webbing', 'Detachable O-Ring'],
  },

  // ==================== COSPLAY ATELIER MERCH ====================
  {
    id: 'md-cos-foam-kit',
    name: 'Master Pro High-Density EVA Foam Sculpting & Bevel Cutter Toolkit',
    artist: 'Atelier Guild',
    category: 'Tools',
    universe: 'Cosplay',
    priceUSD: 48.0,
    priceVND: 1200000,
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    badge: 'Maker Grade 100kg/m³',
    description: 'Comprehensive armor fabrication kit including adjustable angle bevel cutter, tungsten carving blades, and rotary sanding blocks.',
    features: ['3 Adjustable Cutting Angles (45°/60°/90°)', '10 Replacement Carbon Blades', 'Anti-Slip Aluminum Handle'],
  },
  {
    id: 'md-cos-wig-kit',
    name: 'Professional Heat-Resistant Synthetic Lace-Front Wig Styling Set',
    artist: 'Atelier Guild',
    category: 'Wig Care',
    universe: 'Cosplay',
    priceUSD: 36.0,
    priceVND: 900000,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    stock: 22,
    badge: 'Pro Cosplayer Choice',
    description: 'Complete wig preparation arsenal: canvas styling block head, table clamp, teasing brushes, and anti-static detangling mist.',
    features: ['Heavy Canvas Block Head', '360° Rotational C-Clamp', 'Heat-Resistant Steel Combs'],
  },

  // ==================== COMICS MULTIVERSE MERCH ====================
  {
    id: 'md-spidey-book',
    name: 'Spider-Man: Across The Spider-Verse Archival Sketchbook & Marker Set',
    artist: 'Marvel Comics',
    category: 'Art Supplies',
    universe: 'Comics',
    priceUSD: 38.0,
    priceVND: 950000,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    stock: 24,
    badge: 'Sony Animation Official',
    description: '200gsm mixed-media sketchbook with holographic pop-art cover and 6 double-ended comic alcohol illustration markers.',
    features: ['200gsm Bleedproof Paper', 'Holographic Embossed Cover', 'Dual-Brush Alcohol Markers'],
  },
  {
    id: 'md-bat-signal',
    name: 'Batman Dark Knight Bat-Signal Die-Cast Metal Desktop Spotlight',
    artist: 'DC Comics',
    category: 'Collectibles',
    universe: 'Comics',
    priceUSD: 49.0,
    priceVND: 1225000,
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    stock: 14,
    badge: 'DC Collectibles',
    description: 'Working high-intensity LED desktop projector that casts the iconic Bat-Insignia up to 6 meters with full 360-degree rotation.',
    features: ['Cast Zinc Alloy Body', 'Super-Bright LED Projector Lens', '360° Swivel & Tilt Base'],
  },

  // ==================== MOVIES CINEMA MERCH ====================
  {
    id: 'md-dune-knife',
    name: 'Dune: Part Two Crysknife Sandworm Tooth Display Replica',
    artist: 'Legendary Pictures',
    category: 'Collectibles',
    universe: 'Movies',
    priceUSD: 58.0,
    priceVND: 1450000,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    stock: 10,
    badge: 'Denis Villeneuve Prop',
    description: 'Solid resin ceremonial dagger replica with iridescent pearlescent finish, carved Fremen hilt, and solid sandstone pedestal.',
    features: ['Translucent Shai-Hulud Resin', 'Hand-Wrapped Leather Grip', 'Natural Sandstone Display Plinth'],
  },
  {
    id: 'md-oppen-cell',
    name: 'Oppenheimer Trinity 70mm Film Cell Archival Acrylic Paperweight',
    artist: 'Universal Pictures',
    category: 'Collectibles',
    universe: 'Movies',
    priceUSD: 39.0,
    priceVND: 975000,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    badge: 'Original 70mm Print',
    description: 'Original frame from 70mm IMAX theatrical release print sealed inside optical-grade museum acrylic block with laser serial.',
    features: ['Genuine 70mm Film Strip Cell', 'Optical Grade Scratchless Acrylic', 'Numbered Certificate of Authenticity'],
  },

  // ==================== TV SHOWS MERCH ====================
  {
    id: 'md-st-shirt',
    name: 'Stranger Things Hellfire Club Hawkins High Raglan Baseball Shirt',
    artist: 'Netflix',
    category: 'Apparel',
    universe: 'TV Shows',
    priceUSD: 36.0,
    priceVND: 900000,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    stock: 28,
    badge: 'Official Netflix Merch',
    description: 'Authentic 3/4 sleeve 100% combed cotton raglan t-shirt featuring screenprinted Eddie Munson Hellfire Club demon mascot.',
    features: ['100% Combed Ring-Spun Cotton', 'Vintage Screenprinted Artwork', 'Retro 3/4 Contrast Sleeves'],
  },
  {
    id: 'md-arcane-jinx',
    name: 'Arcane: League of Legends Jinx Mechanical Shark Rocket Plush',
    artist: 'Riot Games',
    category: 'Collectibles',
    universe: 'TV Shows',
    priceUSD: 44.0,
    priceVND: 1100000,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    stock: 17,
    badge: 'Fortiche / Riot Games',
    description: 'Super soft oversized plush version of Fishbones the rocket launcher with fluorescent graffiti detailing and metallic teeth.',
    features: ['Oversized 45cm Length', 'Glow-in-the-Dark Graffiti Paint', 'Heavyweight Plush Filling'],
  }
];

export default function MdPage() {
  const { formatPrice, addToCart, setIsCartOpen } = useCartWishlist();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { themeKey, category } = useActiveFandom();

  // Filter merchandise by active fandom category
  const normCategory = (category || '').toLowerCase();
  const universeMatchedMerch = mockMerchList.filter((item) => {
    if (!normCategory || normCategory === 'all') return true;
    const itemUni = item.universe.toLowerCase();
    return (
      itemUni.includes(normCategory) ||
      normCategory.includes(itemUni) ||
      (normCategory.includes('game') && itemUni.includes('gaming')) ||
      (normCategory.includes('movie') && itemUni.includes('movies')) ||
      (normCategory.includes('tv') && itemUni.includes('tv'))
    );
  });

  // Fallback to all items if category has few items
  const activePool = universeMatchedMerch.length > 0 ? universeMatchedMerch : mockMerchList;

  // Dynamically compute subcategory filter chips
  const subCategories = React.useMemo(() => {
    const cats = new Set(activePool.map(m => m.category));
    return [
      { id: 'All', label: 'All MD', count: activePool.length },
      ...Array.from(cats).map(c => ({
        id: c,
        label: c,
        count: activePool.filter(m => m.category === c).length
      }))
    ];
  }, [activePool]);

  const filteredMerch = activePool.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || item.name.toLowerCase().includes(q) || item.artist.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const handleAddMerchToCart = (item: MerchItem) => {
    const fakeAlbum: Album = {
      id: item.id,
      title: item.name,
      artist: item.artist,
      artistId: item.artist.toLowerCase().replace(/\s+/g, '-'),
      priceUSD: item.priceUSD,
      priceVND: item.priceVND,
      coverImage: item.image,
      galleryImages: [item.image],
      type: 'Figure & Merch',
      releaseDate: '2026-01-01',
      tag: item.stock <= 10 ? 'Limited Edition' : 'Hot Seller',
      rating: 5.0,
      reviewCount: 95,
      popularityScore: 99,
      stock: item.stock,
      description: item.description,
      versions: [{ id: 'standard', name: 'Standard Edition', extraPriceUSD: 0 }],
      inclusions: item.features,
      photocards: [],
      tracks: [],
      reviews: [],
    };

    addToCart(fakeAlbum, 'Standard Edition', 1);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div 
      className={`min-h-screen flex flex-col fandom-theme-${themeKey} transition-colors duration-500`}
      data-fandom-theme={themeKey}
    >
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fandomThemeKey={themeKey}
        fandomCategory={category}
      />

      <main className="flex-1">
        {/* Unified Breadcrumbs Navigation */}
        <div className="bg-slate-50 border-b border-slate-200">
          <Breadcrumbs
            items={[
              { label: 'Official Merch & Collectibles (MD & Merch)', isActive: true }
            ]}
          />
        </div>

        {/* Dedicated Category-Specific MD Hero Banner */}
        {(() => {
          const bannerConfigs: Record<string, {
            badge: string;
            badgeColor: string;
            title1: string;
            title2: string;
            desc: string;
            stamp1Label: string;
            stamp1Val: string;
            stamp2Label: string;
            stamp2Val: string;
            stamp3Label: string;
            stamp3Val: string;
            stamp3Color?: string;
          }> = {
            gaming: {
              badge: 'CERTIFIED ESPORTS & ARENA GEAR · HOYOVERSE & PRO REPLICAS',
              badgeColor: '#00ff66',
              title1: 'Gaming Gear, Keycaps ',
              title2: '& Battlestation Collectibles',
              desc: 'Level up your battlestation: mechanical keycap sets, die-cast weapon miniatures, archival canvas maps, and official tournament collectibles.',
              stamp1Label: 'AUTHENTIC GEAR',
              stamp1Val: '100% LICENSED',
              stamp2Label: 'HARDWARE',
              stamp2Val: 'PRO TIER',
              stamp3Label: 'EXPRESS SHIP',
              stamp3Val: 'GLOBAL',
              stamp3Color: '#00ff66',
            },
            manga: {
              badge: 'JAPANESE SHUEISHA & KODANSHA CERTIFIED GOODS',
              badgeColor: '#f97316',
              title1: 'Manga Merch, Plushies ',
              title2: '& Archival Shikishi',
              desc: 'Direct imports from Japanese manga stores: exclusive character plushies, engraved metal bookmarks, acrylic scene panels, and artist shikishi boards.',
              stamp1Label: 'ORIGIN',
              stamp1Val: '100% TOKYO',
              stamp2Label: 'COLLECTIBLES',
              stamp2Val: 'SHIKISHI·PLUSH',
              stamp3Label: 'AUTHENTICITY',
              stamp3Val: 'CERTIFIED',
              stamp3Color: '#f97316',
            },
            anime: {
              badge: 'ANIMATE & TOKYO POP-UP MERCH · 100% OFFICIALLY LICENSED',
              badgeColor: '#ccff00',
              title1: 'Anime Collectibles, Dioramas ',
              title2: '& Tactical Lanyards',
              desc: 'Authentic acrylic diorama displays, character convention passes, studio-exclusive metal accessories, and anime collaboration apparel.',
              stamp1Label: 'STUDIO IMPORTS',
              stamp1Val: '100% REAL',
              stamp2Label: 'DISPLAYS',
              stamp2Val: 'ACRYLIC 3D',
              stamp3Label: 'QUALITY',
              stamp3Val: 'PREMIUM',
              stamp3Color: '#ccff00',
            },
            cosplay: {
              badge: 'ATELIER PRO GRADE CRAFTING TOOLS & PROP ESSENTIALS',
              badgeColor: '#38bdf8',
              title1: 'Cosplay Crafting Tools, Wigs ',
              title2: '& Workshop Supplies',
              desc: 'Everything for the master prop maker: high-density EVA foam tools, lace-front wig care sets, armor grommets, and professional special FX kits.',
              stamp1Label: 'MAKER TOOLS',
              stamp1Val: 'PRO GRADE',
              stamp2Label: 'WIG CRAFT',
              stamp2Val: 'HEAT SAFE',
              stamp3Label: 'MATERIALS',
              stamp3Val: 'ARCHIVAL',
              stamp3Color: '#38bdf8',
            },
            comics: {
              badge: 'MARVEL & DC OFFICIALLY LICENSED COMIC ARTIFACTS',
              badgeColor: '#ffd60a',
              title1: 'Comic Collectibles, Pins ',
              title2: '& Desktop Spotlights',
              desc: 'Celebrate legendary comic book history: die-cast Bat-Signal spotlights, Spider-Verse sketching kits, vintage enamel pins, and archival comic sleeves.',
              stamp1Label: 'LICENSED',
              stamp1Val: 'MARVEL·DC',
              stamp2Label: 'PINS & PROPS',
              stamp2Val: 'DIE-CAST',
              stamp3Label: 'PACKAGING',
              stamp3Val: 'SAFE',
              stamp3Color: '#ffd60a',
            },
            cinema: {
              badge: 'AUTEUR CINEMA PROP REPLICAS & BOUTIQUE ARTIFACTS',
              badgeColor: '#d4af37',
              title1: 'Cinema Artifacts, Film Cells ',
              title2: '& Prop Replicas',
              desc: 'Museum-grade cinematic keepsakes: genuine 70mm IMAX film cell acrylic blocks, Dune Crysknife desktop displays, and A24 collector hardcover books.',
              stamp1Label: 'ARTIFACTS',
              stamp1Val: '70MM FILM',
              stamp2Label: 'REPLICAS',
              stamp2Val: 'MUSEUM',
              stamp3Label: 'FINISH',
              stamp3Val: 'DELUXE',
              stamp3Color: '#d4af37',
            },
            tv: {
              badge: 'ORIGINAL SERIES APPAREL & FANCLUB MEMORABILIA',
              badgeColor: '#a78bfa',
              title1: 'Series Merch, Apparel ',
              title2: '& Nostalgia Collectibles',
              desc: 'Official television fandom gear: Hawkins High baseball raglan tees, Arcane mechanical plushies, and collector enamel insignia pins.',
              stamp1Label: 'SERIES MERCH',
              stamp1Val: 'OFFICIAL',
              stamp2Label: 'APPAREL',
              stamp2Val: 'HEAVYWEIGHT',
              stamp3Label: 'DROPS',
              stamp3Val: 'LIMITED',
              stamp3Color: '#a78bfa',
            },
            kpop: {
              badge: 'Certified Authentic Merchandise · Direct Agency Imports',
              badgeColor: '#a855f7',
              title1: 'Official Fandom Goods, Lightsticks ',
              title2: '& Apparel',
              desc: 'Explore 100% authentic group lightsticks with Bluetooth stadium sync, official concert tour hoodies, limited acrylic character dioramas, and archival photocard storage binders.',
              stamp1Label: 'AUTHENTIC GOODS',
              stamp1Val: '100% REAL',
              stamp2Label: 'LIGHTSTICKS',
              stamp2Val: 'BT 5.2 SYNC',
              stamp3Label: 'EXPRESS SHIP',
              stamp3Val: 'GLOBAL',
              stamp3Color: '#10b981',
            }
          };

          const conf = bannerConfigs[themeKey] || bannerConfigs.kpop;

          return (
            <section 
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '48px 28px',
                borderBottom: '1px solid #1e293b',
              }}
            >
              <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>
                  <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                  <span>/</span>
                  <span style={{ color: '#ffffff', fontWeight: 800 }}>OFFICIAL MD &amp; FANDOM GOODS</span>
                  <span>/</span>
                  <span style={{ color: conf.badgeColor, fontWeight: 800 }}>{category}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
                  <div style={{ maxWidth: '780px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#1e293b', color: conf.badgeColor, fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', border: `1px solid ${conf.badgeColor}40` }}>
                      <Sparkles style={{ width: '12px', height: '12px' }} />
                      <span>{conf.badge}</span>
                    </div>
                    <h1 
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(32px, 4vw, 56px)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        margin: '0 0 12px 0',
                      }}
                    >
                      {conf.title1}<em style={{ fontWeight: 400, color: '#94a3b8', fontStyle: 'italic' }}>{conf.title2}</em>
                    </h1>
                    <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                      {conf.desc}
                    </p>
                  </div>

                  {/* Stat badges */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>{conf.stamp1Label}</span>
                      <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>{conf.stamp1Val}</span>
                    </div>
                    <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>{conf.stamp2Label}</span>
                      <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>{conf.stamp2Val}</span>
                    </div>
                    <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>{conf.stamp3Label}</span>
                      <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: conf.stamp3Color || '#10b981' }}>{conf.stamp3Val}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* MD Content Section */}
        <section className="py-14 px-4 sm:px-7 max-w-[1440px] mx-auto">
          {/* Header & Filter row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9', marginBottom: '28px', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* Category tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', overflowX: 'auto' }}>
              {subCategories.map((c) => {
                const isActive = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    type="button"
                    style={{
                      padding: '0 0 8px 0',
                      fontSize: '11px',
                      fontWeight: isActive ? 800 : 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActive ? '#0f172a' : '#94a3b8',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid #0f172a' : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>{c.label}</span>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', color: isActive ? '#000000' : '#cbd5e1', fontWeight: 700 }}>
                      ({c.count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick search */}
            <div style={{ position: 'relative', width: '260px' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search lightstick, hoodie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  paddingLeft: '32px',
                  paddingRight: '12px',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  border: '1.5px solid #000000',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMerch.map((item) => {
              const isItemAdded = addedItem === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  className="hover:border-black hover:shadow-xl group"
                >
                  <div>
                    {/* Image Box */}
                    <div style={{ position: 'relative', width: '100%', height: '230px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="group-hover:scale-105"
                      />
                      
                      {/* Top Badges */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 800, padding: '3px 8px', backgroundColor: '#000000', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                          {item.artist}
                        </span>
                        {item.badge && (
                          <span style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 800, padding: '3px 8px', backgroundColor: '#ffffff', color: '#000000', border: '1px solid #000000', textTransform: 'uppercase' }}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Stock Pill */}
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 10 }}>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 700, padding: '2px 6px', backgroundColor: 'rgba(0,0,0,0.75)', color: item.stock <= 10 ? '#fca5a5' : '#86efac', border: '1px solid rgba(255,255,255,0.2)' }}>
                          ● {item.stock <= 10 ? `Only ${item.stock} left in stock` : 'In Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ padding: '16px 18px 8px 18px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '2px' }}>
                        OFFICIAL MD · {item.category}
                      </span>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, margin: '0 0 10px 0' }} className="line-clamp-2">
                        {item.description}
                      </p>

                      {/* Features bullets */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                        {item.features.slice(0, 2).map((f, i) => (
                          <span key={i} style={{ fontSize: '9px', fontFamily: 'monospace', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 5px', color: '#475569' }}>
                            ✦ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div style={{ padding: '12px 18px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '8px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>OFFICIAL PRICE</span>
                      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                        {formatPrice(item.priceUSD, item.priceVND)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddMerchToCart(item)}
                      style={{
                        height: '36px',
                        padding: '0 14px',
                        backgroundColor: isItemAdded ? '#10b981' : '#000000',
                        color: '#ffffff',
                        border: '1.5px solid',
                        borderColor: isItemAdded ? '#10b981' : '#000000',
                        fontSize: '11px',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                      className="hover:bg-neutral-800"
                    >
                      {isItemAdded ? (
                        <>
                          <Check style={{ width: '13px', height: '13px' }} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag style={{ width: '13px', height: '13px' }} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Modals & Drawers */}
      <CartDrawer />
      <WishlistModal />
      <AudioPlayer />

      <ChatbotModal
        onFilterArtist={() => {}}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />
    </div>
  );
}
