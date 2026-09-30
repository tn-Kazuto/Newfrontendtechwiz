'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Gamepad2, 
  Film, 
  Tv, 
  BookOpen, 
  PenTool, 
  Shirt, 
  Zap, 
  ArrowUpRight, 
  Compass
} from 'lucide-react';
import { FandomCategoryKey } from '../types';

interface FeaturedCategoriesProps {
  onSelectCategory?: (category: FandomCategoryKey | 'all') => void;
  activeCategory?: string;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  onSelectCategory,
  activeCategory = 'all'
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories: {
    id: FandomCategoryKey;
    label: string;
    subTitle: string;
    styleClass: string;
    tagText: string;
    icon: any;
    accentColor: string;
    description: string;
    stats: string;
  }[] = [
    // 1. K-POP (Reference Image 1: Y2K Game Boy Pixel Blue)
    {
      id: 'K-Pop',
      label: 'K-Pop Universe',
      subTitle: 'ACT:TOMORROW IN TOKYO',
      styleClass: 'fandom-card-kpop',
      tagText: '★ GAME START',
      icon: Sparkles,
      accentColor: '#2563eb',
      description: 'Y2K cyber idol aesthetics, Tokyo Dome World Tour series & exclusive holographic photocards.',
      stats: '14.8M Fans · 120+ Tours'
    },
    // 2. ANIME (Reference Image 2: Acid Lime Manga Halftone Streetwear)
    {
      id: 'Anime',
      label: 'Anime Streetwear',
      subTitle: 'PEDIDO STREET STYLE',
      styleClass: 'fandom-card-anime',
      tagText: 'INSPO IN OURLYSIE',
      icon: Flame,
      accentColor: '#a3e635',
      description: 'Manga halftone aesthetics, graphic streetwear drops & legendary Shonen masterpieces.',
      stats: '9.2M Otaku · 450+ Series'
    },
    // 3. COSPLAY (Bauhaus Constructivist Modernism: Red #D02020 & Geometric Atelier)
    {
      id: 'Cosplay',
      label: 'Cosplay World',
      subTitle: 'BAUHAUS GEOMETRIC ATELIER',
      styleClass: 'fandom-card-cosplay',
      tagText: '★ BAUHAUS COSPLAY',
      icon: Shirt,
      accentColor: '#D02020',
      description: 'Geometric character transformations, constructivist atelier props & architectural cosplay expos.',
      stats: '3.4M Cosplayers'
    },
    // 4. GAMING (Reference Image 3: Cyberpunk Electro-Graffiti / Lightning Violet + Lime)
    {
      id: 'Gaming',
      label: 'Gaming Arena',
      subTitle: 'HIGH VOLTAGE SPEED',
      styleClass: 'fandom-card-gaming',
      tagText: '⚡ ARENA READY',
      icon: Zap,
      accentColor: '#a855f7',
      description: 'High-voltage esports arenas bathed in neon lightning, game soundtracks & official gear.',
      stats: '18.5M Gamers · VCS & HoYo'
    },
    // 5. COMICS (Reference Image 4: Pop-Art Ben-Day Dots & Bold Action Panels)
    {
      id: 'Comics',
      label: 'Comic Books',
      subTitle: 'POP-ART ACTION PANEL',
      styleClass: 'fandom-card-comics',
      tagText: 'POW! VARIANT ISSUE',
      icon: BookOpen,
      accentColor: '#ef4444',
      description: 'Classic Ben-Day dot pop-art, gold-foil variant covers & the superhero multiverse.',
      stats: '5.6M Readers · Rare Issues'
    },
    // 6. MANGA (Reference: Shonen Jump+ Monochrome Screentone)
    {
      id: 'Manga',
      label: 'Manga Archive',
      subTitle: 'SHONEN JUMP+ MONOCHROME',
      styleClass: 'fandom-card-manga',
      tagText: '✦ MANGA INK',
      icon: PenTool,
      accentColor: '#0f172a',
      description: 'Masterclass ink brushwork, authentic screentone halftones & collector tankobon drops.',
      stats: '11.3M Readers · Screentone'
    },
    // 7. MOVIES (Sleek Cinematic Dark / Golden Spotlight)
    {
      id: 'Movies',
      label: 'Cinema Noir',
      subTitle: 'IMAX 70MM MASTERPIECE',
      styleClass: 'fandom-card-cinema',
      tagText: '🎬 BOX OFFICE HIT',
      icon: Film,
      accentColor: '#f59e0b',
      description: '70mm IMAX cinematic spectacles, embossed collector Steelbooks & immersive surround audio.',
      stats: '8.7M Moviegoers'
    },
    // 8. TV SHOWS (Sleek Cinematic Dark / Streamer Hit)
    {
      id: 'TV Shows',
      label: 'TV Series & Binge',
      subTitle: 'GOLDEN HOUR STREAMING',
      styleClass: 'fandom-card-cinema',
      tagText: '📺 BINGE WATCH NO.1',
      icon: Tv,
      accentColor: '#eab308',
      description: 'Blockbuster streaming anime & live-action epics taking global fandoms by storm.',
      stats: '6.9M Viewers'
    },
  ];

  const handleCardClick = (catId: FandomCategoryKey) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    const heroEl = document.getElementById('hero-banner');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-12 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[11px] font-mono uppercase font-bold tracking-wider rounded-full mb-3 shadow-xs">
              <Compass size={13} className="text-amber-400" />
              <span>EXPLORE ALL 8 FANDOM WORLDS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase">
              Featured <span className="underline decoration-4 decoration-amber-400">Fandom Categories</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl font-medium">
              Explore multi-dimensional Fandom universes crafted with authentic visual DNA: from Y2K Pixel K-Pop and Acid Lime Streetwear to Cyberpunk Gaming & Screentone Manga Ink.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectCategory && onSelectCategory('all')}
              type="button"
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-all border ${
                activeCategory === 'all'
                  ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Explore All Fandoms
            </button>
          </div>
        </div>

        {/* 8 Featured Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat.id)}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  outline: isSelected ? `3px solid ${cat.accentColor}` : 'none',
                  outlineOffset: '2px',
                }}
                className={`${cat.styleClass} p-5 rounded-xl cursor-pointer flex flex-col justify-between min-h-[310px] select-none transition-all duration-300 hover:-translate-y-1.5`}
              >
                {/* 1. TOP BAR OF CARD */}
                <div className="flex items-start justify-between gap-2 z-10">
                  {/* Category Signature Tag */}
                  {cat.id === 'K-Pop' ? (
                    <div className="pixel-badge">
                      <span className="w-2 h-2 bg-blue-600 inline-block animate-pulse" />
                      <span>{cat.tagText}</span>
                    </div>
                  ) : cat.id === 'Anime' || cat.id === 'Cosplay' ? (
                    <div className="streetwear-tag">
                      <span>{cat.tagText}</span>
                    </div>
                  ) : cat.id === 'Gaming' ? (
                    <div className="gaming-hud-badge flex items-center gap-1.5">
                      <Zap size={12} className="text-lime-400 fill-current" />
                      <span>{cat.tagText}</span>
                    </div>
                  ) : cat.id === 'Comics' ? (
                    <div className="comic-burst-tag">
                      <span>{cat.tagText}</span>
                    </div>
                  ) : cat.id === 'Manga' ? (
                    <div className="manga-tag">
                      <span>{cat.tagText}</span>
                    </div>
                  ) : (
                    <div className="cinema-badge flex items-center gap-1.5">
                      <Film size={12} />
                      <span>{cat.tagText}</span>
                    </div>
                  )}

                  {/* Icon Circle */}
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 shadow-xs"
                    style={{
                      backgroundColor: cat.id === 'Gaming' || cat.id === 'Movies' || cat.id === 'TV Shows' ? 'rgba(255,255,255,0.1)' : '#ffffff',
                      borderColor: cat.accentColor,
                    }}
                  >
                    <IconComp size={17} style={{ color: cat.accentColor }} />
                  </div>
                </div>

                {/* 2. CENTER CONTENT WITH VISUAL ELEMENTS */}
                <div className="my-4 z-10 flex-1 flex flex-col justify-center">
                  
                  {/* Specific Decorative Elements for Each Style */}
                  {cat.id === 'K-Pop' && (
                    <div className="pixel-note-box p-2.5 mb-2.5 text-[11px] text-blue-950 font-bold">
                      <div className="flex items-center justify-between border-b border-blue-200 pb-1 mb-1 font-mono text-[10px] text-blue-800">
                        <span>★ NOTES!</span>
                        <span>TOKYO DOME</span>
                      </div>
                      <div className="font-mono text-[9.5px] leading-relaxed text-blue-900">
                        ▶ WHERE: TOKYO DOME<br />
                        ▶ WHEN: JAN 21 & 22
                      </div>
                    </div>
                  )}

                  {cat.id === 'Anime' && (
                    <div className="text-[11px] font-bold italic tracking-wider text-slate-800 bg-lime-200/80 px-2 py-1 border border-black rounded-sm mb-2 w-fit">
                      #PEDIDO_ENTREGUE // SHONEN
                    </div>
                  )}

                  {cat.id === 'Gaming' && (
                    <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-lime-400 font-bold">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
                      <span>[CYBER GRAFFITI SHARD]</span>
                    </div>
                  )}

                  {cat.id === 'Manga' && (
                    <div className="torn-paper-border-top" />
                  )}

                  {/* Subtitle / Micro Header */}
                  <span 
                    className={`text-[11px] uppercase font-bold tracking-widest block mb-1 ${
                      cat.id === 'Gaming' || cat.id === 'Movies' || cat.id === 'TV Shows' ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {cat.subTitle}
                  </span>

                  {/* Main Category Title */}
                  <h3 
                    className={`text-2xl font-black uppercase tracking-tight leading-tight ${
                      cat.id === 'Gaming' || cat.id === 'Movies' || cat.id === 'TV Shows' ? 'text-white' : 'text-slate-900'
                    } ${cat.id === 'Comics' ? 'bangers-font text-3xl' : ''}`}
                  >
                    {cat.label}
                  </h3>

                  {/* Description */}
                  <p 
                    className={`text-xs mt-2 line-clamp-2 ${
                      cat.id === 'Gaming' || cat.id === 'Movies' || cat.id === 'TV Shows' ? 'text-slate-300' : 'text-slate-600'
                    } font-medium leading-relaxed`}
                  >
                    {cat.description}
                  </p>
                </div>

                {/* 3. BOTTOM FOOTER WITH STATS & ACTION BUTTON */}
                <div 
                  className={`pt-3 flex items-center justify-between border-t z-10 ${
                    cat.id === 'Gaming' || cat.id === 'Movies' || cat.id === 'TV Shows' 
                      ? 'border-white/10' 
                      : 'border-black/10'
                  }`}
                >
                  <span 
                    className={`text-[11px] font-mono font-bold ${
                      cat.id === 'Gaming' || cat.id === 'Movies' || cat.id === 'TV Shows' 
                        ? 'text-slate-400' 
                        : 'text-slate-500'
                    }`}
                  >
                    {cat.stats}
                  </span>

                  <div 
                    className={`inline-flex items-center gap-1 text-xs font-bold uppercase transition-transform duration-200 group-hover:translate-x-1 ${
                      cat.id === 'Gaming' || cat.id === 'Movies' || cat.id === 'TV Shows' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <span>Explore</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>

                {/* Background Pattern Overlays */}
                {cat.id === 'K-Pop' && <div className="absolute inset-0 pixel-grid-pattern opacity-40 pointer-events-none" />}
                {cat.id === 'Anime' && <div className="absolute inset-0 halftone-lime-pattern opacity-25 pointer-events-none" />}
                {cat.id === 'Cosplay' && <div className="absolute inset-0 halftone-dark-pattern opacity-15 pointer-events-none" />}
                {cat.id === 'Comics' && <div className="absolute inset-0 bended-dots-pattern opacity-20 pointer-events-none" />}
                {cat.id === 'Manga' && <div className="absolute inset-0 screentone-dot-pattern opacity-15 pointer-events-none" />}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
