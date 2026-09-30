'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { EventHeroBanner } from '../components/EventHeroBanner';

import { AlbumGrid } from '../components/AlbumGrid';
import dynamic from 'next/dynamic';
import { IdolProfiles } from '../components/IdolProfiles';
import { Y2KTickerTape } from '../components/Y2KTickerTape';

// Dynamically load below-the-fold sections to optimize initial JS bundle while preserving SSR
const UpcomingReleasesAndArticles = dynamic(() => import('../components/UpcomingReleasesAndArticles').then(m => m.UpcomingReleasesAndArticles));
const MultimediaTeaserSection = dynamic(() => import('../components/MultimediaTeaserSection').then(m => m.MultimediaTeaserSection));
const WorldTourShowcase = dynamic(() => import('../components/WorldTourShowcase').then(m => m.WorldTourShowcase));
const FanCommunityFeed = dynamic(() => import('../components/FanCommunityFeed').then(m => m.FanCommunityFeed));
const SitemapSection = dynamic(() => import('../components/SitemapSection').then(m => m.SitemapSection));
const Footer = dynamic(() => import('../components/Footer').then(m => m.Footer));

// Dynamically load alternative fandom views (only when active)
const MangaHandDrawnView = dynamic(() => import('../components/MangaHandDrawnView').then(m => m.MangaHandDrawnView));
const AnimeNeoBrutalView = dynamic(() => import('../components/AnimeNeoBrutalView').then(m => m.AnimeNeoBrutalView));
const ComicsPopArtView = dynamic(() => import('../components/ComicsPopArtView').then(m => m.ComicsPopArtView));
const CinemaSwissView = dynamic(() => import('../components/CinemaSwissView').then(m => m.CinemaSwissView));
const TvShowsY2KView = dynamic(() => import('../components/TvShowsY2KView').then(m => m.TvShowsY2KView));

// Dynamically load interactive modals & drawers (client-only, idle/interaction-loaded)
const AlbumDetailModal = dynamic(() => import('../components/AlbumDetailModal').then(m => m.AlbumDetailModal), { ssr: false });
const CartDrawer = dynamic(() => import('../components/CartDrawer').then(m => m.CartDrawer), { ssr: false });
const WishlistModal = dynamic(() => import('../components/WishlistModal').then(m => m.WishlistModal), { ssr: false });
const ChatbotModal = dynamic(() => import('../components/ChatbotModal').then(m => m.ChatbotModal), { ssr: false });
const AudioPlayer = dynamic(() => import('../components/AudioPlayer').then(m => m.AudioPlayer), { ssr: false });
const AdminModal = dynamic(() => import('../components/AdminModal').then(m => m.AdminModal), { ssr: false });
const FeedbackModal = dynamic(() => import('../components/FeedbackModal').then(m => m.FeedbackModal), { ssr: false });
// import { TestConnection } from '../components/TestConnection';
import { Album, FandomCategoryKey } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';
import { persistFandomTheme } from '../utils/fandomTheme';

export default function Home({ initialCategory = 'all' }: { initialCategory?: FandomCategoryKey | 'all' } = {}) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistFilter, setSelectedArtistFilter] = useState('all');
  const [selectedFandomCategory, setSelectedFandomCategory] = useState<FandomCategoryKey | 'all'>(initialCategory);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const { setIsCartOpen, setIsWishlistOpen } = useCartWishlist();

  // Check URL query params on mount for direct category access (e.g. ?category=kpop or ?category=manga)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category') || params.get('fandom');
      if (catParam) {
        const lower = catParam.toLowerCase();
        if (lower === 'kpop' || lower === 'k-pop') {
          setSelectedFandomCategory('K-Pop');
        } else if (lower === 'manga') {
          setSelectedFandomCategory('Manga');
        } else if (lower === 'anime') {
          setSelectedFandomCategory('Anime');
        } else if (lower === 'cosplay') {
          setSelectedFandomCategory('Cosplay');
        } else if (lower === 'gaming') {
          setSelectedFandomCategory('Gaming');
        } else if (lower === 'comics') {
          setSelectedFandomCategory('Comics');
        } else if (lower === 'cinema' || lower === 'movies') {
          setSelectedFandomCategory('Movies');
        } else if (lower === 'tv' || lower === 'tv-shows' || lower === 'tvshows' || lower === 'tv shows') {
          setSelectedFandomCategory('TV Shows');
        }
      } else {
        try {
          const stored = localStorage.getItem('fanhub_fandom_category');
          if (stored) {
            setSelectedFandomCategory(stored as any);
          }
        } catch { }
      }
    }
  }, []);

  // Map selectedFandomCategory to theme attribute key
  const fandomThemeKey = React.useMemo(() => {
    switch (selectedFandomCategory) {
      case 'K-Pop': return 'kpop';
      case 'Anime': return 'anime';
      case 'Cosplay': return 'cosplay';
      case 'Gaming': return 'gaming';
      case 'Comics': return 'comics';
      case 'Manga': return 'manga';
      case 'Movies': return 'cinema';
      case 'TV Shows': return 'tv';
      default: return 'all';
    }
  }, [selectedFandomCategory]);

  // Synchronize full-page DOM theme attributes and persist when fandom category changes
  React.useEffect(() => {
    persistFandomTheme(fandomThemeKey, selectedFandomCategory);
  }, [fandomThemeKey, selectedFandomCategory]);

  const handleSelectArtistFromProfiles = (artistId: string) => {
    setSelectedArtistFilter(artistId);
    const albumsEl = document.getElementById('albums');
    if (albumsEl) {
      albumsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilterArtistFromBot = (artistId: string) => {
    setSelectedArtistFilter(artistId);
    const albumsEl = document.getElementById('albums');
    if (albumsEl) {
      albumsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col bg-body fandom-theme-${fandomThemeKey} transition-colors duration-500`}
      data-fandom-theme={fandomThemeKey}
    >
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fandomThemeKey={fandomThemeKey}
        fandomCategory={selectedFandomCategory}
      />

      {/* Main Content Sections */}
      <main className="flex-1">

        {/* 1. Global Fandom Events Showcase Carousel Banner (Top of Homepage with Category Dock) */}
        <EventHeroBanner 
          activeCategory={selectedFandomCategory}
          onSelectCategory={(cat) => setSelectedFandomCategory(cat)}
        />

        {selectedFandomCategory === 'Manga' ? (
          /* =========================================================================
             DEDICATED HAND-DRAWN MANGA SKETCHBOOK & TANKŌBON LAYOUT
          ========================================================================= */
          <MangaHandDrawnView />
        ) : selectedFandomCategory === 'Anime' ? (
          /* =========================================================================
             DEDICATED ANIME NEO-BRUTALIST SAKUGA & ARCHIVE LAYOUT
          ========================================================================= */
          <AnimeNeoBrutalView />
        ) : selectedFandomCategory === 'Comics' ? (
          /* =========================================================================
             DEDICATED COMICS POP-ART HEROIC & BEN-DAY DOT LAYOUT
          ========================================================================= */
          <ComicsPopArtView />
        ) : selectedFandomCategory === 'Movies' ? (
          /* =========================================================================
             DEDICATED SWISS INTERNATIONAL TYPOGRAPHIC CINEMA ARCHIVE
          ========================================================================= */
          <CinemaSwissView />
        ) : selectedFandomCategory === 'TV Shows' ? (
          /* =========================================================================
             DEDICATED TV SHOWS Y2K POP SHOWCASE (K-POP AESTHETIC)
          ========================================================================= */
          <TvShowsY2KView />
        ) : (
          <>
            {/* Y2K Marquee Ticker 01 */}
            <Y2KTickerTape />

            {/* 2. Character & Idol Group Profiles (Encyclopedic Archive, Characters & Lore) */}
            <div className="section-lazy-layout">
              <IdolProfiles 
                onSelectArtist={handleSelectArtistFromProfiles} 
                fandomCategory={selectedFandomCategory}
              />
            </div>

            {/* 3. Fandom Content Explorer & Official Album Drops with Multi-Filters & Search */}
            <div className="section-lazy-layout">
              <AlbumGrid
                onSelectAlbum={(album) => setSelectedAlbum(album)}
                searchQuery={searchQuery}
                selectedArtistFilter={selectedArtistFilter}
                setSelectedArtistFilter={setSelectedArtistFilter}
                fandomCategory={selectedFandomCategory}
              />
            </div>

            {/* 4. Multimedia Center Spotlight & Teaser Showcase */}
            <div className="section-lazy-layout">
              <MultimediaTeaserSection />
            </div>

            {/* 5. Trending Articles & Upcoming Drops / Release Calendar */}
            <div id="upcoming-releases" className="section-lazy-layout">
              <UpcomingReleasesAndArticles 
                initialCategory={selectedFandomCategory}
                fandomCategory={selectedFandomCategory}
                onSelectCategory={(cat) => setSelectedFandomCategory(cat)}
              />
            </div>

            {/* 6. World Tour & Stadium Arenas Showcase */}
            <div className="section-lazy-layout">
              <WorldTourShowcase />
            </div>

            {/* Y2K Marquee Ticker 02 (Inverted Obsidian) */}
            <Y2KTickerTape inverted />

            {/* 7. Fan Community Social Feed */}
            <div className="section-lazy-layout">
              <FanCommunityFeed />
            </div>
          </>
        )}
      </main>

      {/* SRS 1.9 Mandatory Deliverable: Fan Hub Plus Sitemap & Directory */}
      <div className="section-lazy-layout">
        <SitemapSection
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
        />
      </div>

      {/* Interactive Modals and Drawers - Loaded on demand */}
      {selectedAlbum && (
        <AlbumDetailModal
          album={selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
        />
      )}

      <CartDrawer fandomCategory={selectedFandomCategory} fandomThemeKey={fandomThemeKey} />
      <WishlistModal fandomCategory={selectedFandomCategory} fandomThemeKey={fandomThemeKey} />
      <AudioPlayer />

      {/* AI-Powered Chatbot Assistant */}
      <ChatbotModal
        onFilterArtist={handleFilterArtistFromBot}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Admin Control Panel Modal - Loaded on demand */}
      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Dynamic Feedback Modal - Loaded on demand */}
      {isFeedbackOpen && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
      )}

      {/* Footer */}
      <div className="section-lazy-layout">
        <Footer
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
        />
      </div>
    </div>
  );
}
