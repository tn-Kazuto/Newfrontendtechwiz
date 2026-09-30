'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { IdolProfiles } from '../../components/IdolProfiles';
import { AlbumDetailModal } from '../../components/AlbumDetailModal';
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
import { Sparkles, Users, ArrowRight, ShieldCheck, Disc } from 'lucide-react';

import { useActiveFandom, persistFandomTheme } from '../../utils/fandomTheme';

const FANDOM_DOCK_TABS = [
  { id: 'all', label: 'ALL FANDOMS', theme: 'all', category: 'All Fandoms' },
  { id: 'K-Pop', label: 'K-POP', theme: 'kpop', category: 'K-Pop' },
  { id: 'Gaming', label: 'GAMING ARENA', theme: 'gaming', category: 'Gaming' },
  { id: 'Manga', label: 'MANGA', theme: 'manga', category: 'Manga' },
  { id: 'Cosplay', label: 'COSPLAY & STREET', theme: 'cosplay', category: 'Cosplay' },
  { id: 'Anime', label: 'ANIME', theme: 'anime', category: 'Anime' },
  { id: 'Comics', label: 'COMICS', theme: 'comics', category: 'Comics' },
  { id: 'Movies', label: 'CINEMA', theme: 'cinema', category: 'Movies' },
  { id: 'TV Shows', label: 'TV SHOWS', theme: 'tv', category: 'TV Shows' },
];

export default function ArtistPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { setIsCartOpen } = useCartWishlist();
  const { themeKey, category, changeFandom } = useActiveFandom();

  const isManga = themeKey === 'manga';
  const isAnime = themeKey === 'anime';
  const isCosplay = themeKey === 'cosplay';
  const isGaming = themeKey === 'gaming';
  const isComics = themeKey === 'comics';
  const isCinema = themeKey === 'cinema';
  const isTv = themeKey === 'tv';
  const isKpop = themeKey === 'kpop';

  // Read URL query params (?category=... or ?fandom=...) on mount for direct deep linking
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category') || params.get('fandom');
      if (catParam) {
        changeFandom(catParam);
      }
    }
  }, [changeFandom]);

  const handleSelectArtist = (artistId: string) => {
    window.location.href = `/cd-dvd-book?artist=${artistId}&fandom=${themeKey}`;
  };

  const handleSelectFandomTab = (tab: typeof FANDOM_DOCK_TABS[number]) => {
    changeFandom(tab.id);
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
              { label: 'Artist Dossiers & Character Lore', isActive: true }
            ]}
          />
        </div>

        {/* Dedicated Artist Page Hero Banner - Dynamically Styled per Fandom */}
        <div 
          id="artist-hero-banner"
          className="artist-hero-banner"
          style={{
            padding: '48px 28px',
            borderBottom: isCinema ? '2px solid #d4af37' : isManga ? '3px solid #2d2d2d' : isAnime ? '3.5px solid #000000' : isCosplay ? '4px solid #D02020' : isGaming ? '4px solid #000000' : isComics ? '3.5px solid #000000' : isTv ? '3px solid #c084fc' : '3px solid #000000',
          }}
        >
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: isGaming ? 'var(--font-mono)' : isManga ? "'Kalam', cursive" : 'monospace', color: (isCinema || isTv) ? '#94a3b8' : '#52525b', textTransform: 'uppercase', marginBottom: '16px' }}>
              <Link href="/" className="hover:underline transition-colors">{category}</Link>
              <span>/</span>
              <span style={{ 
                color: isGaming ? '#0891b2' : isManga ? '#e11d48' : isAnime ? '#4d7c0f' : isCosplay ? '#D02020' : isComics ? '#dc2626' : isCinema ? '#d4af37' : isTv ? '#c084fc' : '#d91470', 
                fontWeight: 800 
              }}>
                {category.toUpperCase()} CREATORS &amp; DOSSIERS
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ maxWidth: '780px' }}>
                <div 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '4px 10px', 
                    backgroundColor: isCinema ? '#27272a' : isGaming ? '#000000' : isAnime ? '#000000' : isCosplay ? '#121212' : '#ffffff', 
                    color: isCinema ? '#d4af37' : isGaming ? '#00f0ff' : isAnime ? '#a3e635' : isCosplay ? '#ffffff' : isManga ? '#e11d48' : '#d91470', 
                    fontSize: '10px', 
                    fontFamily: isGaming ? 'var(--font-mono)' : 'monospace', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    marginBottom: '12px', 
                    border: `1.5px solid ${isCinema ? '#d4af37' : isGaming ? '#00f0ff' : isAnime ? '#000000' : isCosplay ? '#D02020' : isManga ? '#e11d48' : '#000000'}`,
                    boxShadow: isKpop ? '2px 2px 0px #000000' : 'none',
                  }}
                >
                  <Users style={{ width: '12px', height: '12px' }} />
                  <span>{category} Canonical Universes &amp; Character Lore</span>
                </div>
                <h1 
                  style={{
                    fontFamily: isManga ? "'Kalam', cursive" : isCinema ? "'Playfair Display', Georgia, serif" : isComics ? "'Bangers', cursive" : isGaming ? "var(--font-mono)" : "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(32px, 4vw, 56px)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: isManga ? '0.02em' : '-0.02em',
                    margin: '0 0 12px 0',
                    color: (isCinema || isTv) ? '#ffffff' : '#000000',
                  }}
                >
                  {isGaming ? (
                    <>Gaming Arena <em style={{ fontWeight: 400, color: '#0891b2', fontStyle: 'normal' }}>// Esports Champions &amp; OST Composers</em></>
                  ) : isManga ? (
                    <>Manga Guild <em style={{ fontWeight: 400, color: '#e11d48', fontStyle: 'italic' }}>&amp; Legendary Mangaka Dossiers</em></>
                  ) : isAnime ? (
                    <>Sakuga Anime <em style={{ fontWeight: 400, color: '#4d7c0f', fontStyle: 'normal' }}>// Directors, Seiyuu &amp; Studio MAPPA</em></>
                  ) : isCosplay ? (
                    <>Bauhaus Atelier <em style={{ fontWeight: 400, color: '#D02020', fontStyle: 'italic' }}>&amp; Costume Constructors</em></>
                  ) : isComics ? (
                    <>Comics Multiverse <em style={{ fontWeight: 400, color: '#dc2626', fontStyle: 'normal' }}>// Superhero Lore &amp; Variant Covers</em></>
                  ) : isCinema ? (
                    <>70mm Cinema Archive <em style={{ fontWeight: 400, color: '#d4af37', fontStyle: 'italic' }}>&amp; Visionary Auteurs</em></>
                  ) : isTv ? (
                    <>Television Binge Vault <em style={{ fontWeight: 400, color: '#c084fc', fontStyle: 'normal' }}>&amp; Ensemble Cast Lore</em></>
                  ) : isKpop ? (
                    <>K-Pop Supergroups <em style={{ fontWeight: 400, color: '#d91470', fontStyle: 'italic' }}>&amp; Generation Icons</em></>
                  ) : (
                    <>All Artists, Groups <em style={{ fontWeight: 400, color: '#ffd60a', fontStyle: 'italic' }}>&amp; Canonical Character Lore</em></>
                  )}
                </h1>
                <p style={{ fontSize: '14px', color: (isCinema || isTv) ? '#94a3b8' : '#475569', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                  {isGaming 
                    ? 'Dive into comprehensive dossiers of legendary League of Legends World Champions (T1 & Faker), HoYo-MiX orchestral composers, and Elden Ring dark fantasy demigods.'
                    : isManga
                    ? 'Explore original hand-drawn manuscripts, Weekly Shonen Jump mangaka masterclasses, Oda Eiichiro archives, and first-print tankōbon milestones.'
                    : isAnime
                    ? 'Delve into award-winning animation studios like ufotable and Studio MAPPA, official seiyuu voice talents, and high-octane anime lore.'
                    : isCosplay
                    ? 'Constructivist design portfolios, aerodynamic polymer costume guides, and living geometry stage performances.'
                    : isCinema
                    ? 'Director-approved monographs for Christopher Nolan, Denis Villeneuve, uncompressed IMAX reference scores, and physical 70mm cell specimens.'
                    : isTv
                    ? 'Dive into Hawkins AV Club files, D&D mythologies, and ensemble casts across hit television series.'
                    : isComics
                    ? 'Variant covers, Marvel multiverse dossiers, and Golden Age to modern pop-art character profiles.'
                    : isKpop
                    ? 'Discover canonical era timelines, member personality matrices, official fan club perks, and complete discography archives.'
                    : 'Universal archive across all 9 fandom universes: K-Pop idols, gaming champions, anime studios, manga creators, and cinematic auteurs.'}
                </p>
              </div>

              {/* Quick Stat Badges */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ padding: '14px 20px', backgroundColor: isCinema ? '#18181b' : '#ffffff', border: `2px solid ${isCinema ? '#d4af37' : '#000000'}`, boxShadow: (isCinema || isTv) ? 'none' : '3px 3px 0px #000000', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: isCinema ? '#94a3b8' : '#64748b', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>CATEGORY</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: isGaming ? '#0891b2' : isManga ? '#e11d48' : isAnime ? '#4d7c0f' : isCosplay ? '#D02020' : isComics ? '#dc2626' : isCinema ? '#d4af37' : isTv ? '#c084fc' : '#d91470' }}>{category.toUpperCase()}</span>
                </div>
                <div style={{ padding: '14px 20px', backgroundColor: isCinema ? '#18181b' : '#ffffff', border: `2px solid ${isCinema ? '#d4af37' : '#000000'}`, boxShadow: (isCinema || isTv) ? 'none' : '3px 3px 0px #000000', minWidth: '140px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: isCinema ? '#94a3b8' : '#64748b', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>DOSSIERS</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: isCinema ? '#ffffff' : '#000000' }}>100% CANON</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DEDICATED FANDOM CATEGORY SWITCHER DOCK (Matching Screenshot 2)
        ========================================================================= */}
        <nav 
          aria-label="Fandom Category Switcher"
          className="fandom-nav-dock w-full bg-[#000000] border-b-4 border-[#ffd60a] py-3.5 px-4 sm:px-8 select-none shadow-[0_4px_12px_rgba(0,0,0,0.5)] sticky top-0 z-20"
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-center overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap sm:flex-wrap justify-start sm:justify-center shrink-0">
              {FANDOM_DOCK_TABS.map((tab) => {
                const isActive = 
                  (tab.id === 'all' && (themeKey === 'all' || category === 'All Fandoms' || !category)) ||
                  (tab.id !== 'all' && (
                    themeKey === tab.theme || 
                    category.toLowerCase() === tab.category.toLowerCase() ||
                    (tab.id === 'Movies' && (category.toLowerCase() === 'movies' || category.toLowerCase() === 'cinema')) ||
                    (tab.id === 'TV Shows' && (category.toLowerCase() === 'tv shows' || category.toLowerCase() === 'tv'))
                  ));

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectFandomTab(tab)}
                    type="button"
                    data-active={isActive ? 'true' : 'false'}
                    style={{ 
                      borderRadius: '0px',
                      backgroundColor: isActive ? '#ffd60a' : '#ffffff',
                      color: '#000000',
                      borderColor: '#000000',
                    }}
                    aria-label={`Switch to ${tab.label} category`}
                    aria-current={isActive ? 'page' : undefined}
                    className="dock-tab-btn px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-mono font-black tracking-wider sm:tracking-widest uppercase transition-all duration-100 cursor-pointer flex items-center gap-1.5 whitespace-nowrap min-h-[42px] border-2 shadow-[2px_2px_0px_#000000] hover:translate-y-[-1px] active:translate-y-[1px]"
                  >
                    {isActive && <span style={{ color: '#000000', fontWeight: 900 }}>★</span>}
                    <span style={{ color: '#000000', fontWeight: 800 }}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Complete Idol Profiles Component with Fandom Category Filter */}
        <IdolProfiles onSelectArtist={handleSelectArtist} fandomCategory={category} />
      </main>

      {/* Modals & Drawers */}
      <AlbumDetailModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />

      <CartDrawer />
      <WishlistModal />
      <AudioPlayer />

      <ChatbotModal
        onFilterArtist={handleSelectArtist}
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
