'use client';

import React, { useState, useEffect } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Trash2, ShoppingCart, Edit3, Check, X } from 'lucide-react';
import { getActiveFandomTheme } from '../utils/fandomTheme';

interface WishlistModalProps {
  fandomCategory?: string;
  fandomThemeKey?: string;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ fandomCategory, fandomThemeKey }) => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, updateWishlistNote, addToCart, formatPrice } = useCartWishlist();
  
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [currentTheme, setCurrentTheme] = useState(() => getActiveFandomTheme(fandomThemeKey, fandomCategory));

  // Detect active fandom theme dynamically from props, custom event, or document DOM attribute
  useEffect(() => {
    const updateTheme = () => {
      setCurrentTheme(getActiveFandomTheme(fandomThemeKey, fandomCategory));
    };

    updateTheme();

    const handleCustomChange = (e: any) => {
      if (e?.detail?.theme && e.detail.theme !== 'all') {
        setCurrentTheme(e.detail.theme);
      } else {
        updateTheme();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('fandom-theme-change', handleCustomChange);
    }

    if (typeof document !== 'undefined') {
      const observer = new MutationObserver(updateTheme);
      observer.observe(document.body, { attributes: true, attributeFilter: ['data-fandom-theme'] });
      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('fandom-theme-change', handleCustomChange);
        }
        observer.disconnect();
      };
    }
  }, [fandomThemeKey, fandomCategory]);

  if (!isWishlistOpen) return null;

  const handleStartEditNote = (albumId: string, currentNote?: string) => {
    setEditingNoteId(albumId);
    setTempNote(currentNote || '');
  };

  const handleSaveNote = (albumId: string) => {
    updateWishlistNote(albumId, tempNote);
    setEditingNoteId(null);
  };

  // Thematic design config for each fandom style
  // Thematic design config for each fandom style
  const isManga = currentTheme === 'manga';
  const isAnime = currentTheme === 'anime';
  const isComics = currentTheme === 'comics';
  const isGaming = currentTheme === 'gaming';
  const isCinema = currentTheme === 'cinema';
  const isTvShows = currentTheme === 'tv';

  const WOBBLY_SM = '120px 8px 110px 8px/8px 110px 8px 120px';

  const getThemeConfig = () => {
    if (isManga) {
      return {
        fontFamily: "'Kalam', cursive, sans-serif",
        modalBg: 'bg-[#fdfbf7]',
        modalBorder: 'border-r-[3px] border-[#2d2d2d]',
        modalShadow: 'shadow-[10px_0px_0px_#2d2d2d]',
        headerBg: 'bg-[#fff9c4]',
        headerBorder: 'border-b-[3px] border-[#2d2d2d]',
        headerTextColor: 'text-[#2d2d2d]',
        headerTitle: 'READER SCRAPBOOK // BOOKMARKED VOLUMES',
        badgeBg: 'bg-[#2d5da1]',
        badgeTextColor: 'text-white',
        badgeBorder: 'border border-[#2d2d2d]',
        closeBtn: 'bg-white text-[#2d2d2d] hover:bg-[#ff4d4d] hover:text-white border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]',
        itemBg: 'bg-white border-2 border-[#2d2d2d] shadow-[4px_4px_0px_#2d2d2d]',
        itemRadius: WOBBLY_SM,
        priceColor: 'text-[#ff4d4d]',
        actionBtn: 'bg-[#fff9c4] hover:bg-[#ff4d4d] hover:text-white text-[#2d2d2d] border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]',
        actionBtnRadius: WOBBLY_SM,
        tapeDecor: true,
        emptyIcon: '',
        emptyTitle: 'YOUR MANGA SCRAPBOOK IS EMPTY',
        emptySubtitle: 'Bookmark draft chapters, authentic tankōbon volumes, and author sketches from the manga desk!',
      };
    }
    if (isAnime) {
      return {
        fontFamily: "'Space Grotesk', monospace, sans-serif",
        modalBg: 'bg-[#ffffff]',
        modalBorder: 'border-r-4 border-black',
        modalShadow: 'shadow-[10px_0px_0px_#ccff00]',
        headerBg: 'bg-[#ccff00]',
        headerBorder: 'border-b-3 border-black',
        headerTextColor: 'text-black',
        headerTitle: 'SAKUGA WATCHLIST // COLLECTOR STASH',
        badgeBg: 'bg-black',
        badgeTextColor: 'text-[#ccff00]',
        badgeBorder: 'border border-black',
        closeBtn: 'bg-black text-[#ccff00] hover:bg-white hover:text-black border-2 border-black shadow-[2px_2px_0px_#000]',
        itemBg: 'bg-[#f7fee7] border-2 border-black shadow-[4px_4px_0px_#000]',
        itemRadius: '0px',
        priceColor: 'text-black font-black',
        actionBtn: 'bg-[#ccff00] hover:bg-black hover:text-[#ccff00] text-black font-black border-2 border-black shadow-[2px_2px_0px_#000]',
        actionBtnRadius: '0px',
        tapeDecor: false,
        emptyIcon: '',
        emptyTitle: 'SAKUGA STASH EMPTY',
        emptySubtitle: 'Save high-framerate animation boxsets, Blu-ray master editions, and anime streetwear!',
      };
    }
    if (isComics) {
      return {
        fontFamily: "'Bangers', 'Kalam', cursive, sans-serif",
        modalBg: 'bg-[#ffffff]',
        modalBorder: 'border-r-4 border-black',
        modalShadow: 'shadow-[10px_0px_0px_#ef4444]',
        headerBg: 'bg-[#ef4444]',
        headerBorder: 'border-b-3 border-black',
        headerTextColor: 'text-white',
        headerTitle: 'COMIC VAULT // SAVED RUNS & VARIANTS',
        badgeBg: 'bg-[#ffd60a]',
        badgeTextColor: 'text-black',
        badgeBorder: 'border border-black',
        closeBtn: 'bg-[#ffd60a] text-black hover:bg-white border-2 border-black shadow-[2px_2px_0px_#000]',
        itemBg: 'bg-[#fffdf0] border-2 border-black shadow-[4px_4px_0px_#ef4444]',
        itemRadius: '2px',
        priceColor: 'text-[#ef4444]',
        actionBtn: 'bg-[#ffd60a] hover:bg-[#ef4444] hover:text-white text-black font-black border-2 border-black shadow-[2px_2px_0px_#000]',
        actionBtnRadius: '0px',
        tapeDecor: false,
        emptyIcon: '',
        emptyTitle: 'COMIC VAULT IS EMPTY',
        emptySubtitle: 'Save comic runs, key issues, graphic novels, and variant covers to your pull list!',
      };
    }
    if (isGaming) {
      return {
        fontFamily: "'JetBrains Mono', monospace",
        modalBg: 'bg-[#ffffff]',
        modalBorder: 'border-r-4 border-black',
        modalShadow: 'shadow-[10px_0px_0px_#000000]',
        headerBg: 'bg-[#000000]',
        headerBorder: 'border-b-4 border-black',
        headerTextColor: 'text-white',
        headerTitle: 'GAMING ARCHIVE // SAVED VINYLS',
        badgeBg: 'bg-white',
        badgeTextColor: 'text-black',
        badgeBorder: 'border-2 border-black',
        closeBtn: 'bg-white text-black hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0px_#000]',
        itemBg: 'bg-[#fafafa] border-2 border-black shadow-[4px_4px_0px_#000]',
        itemRadius: '0px',
        priceColor: 'text-black font-black',
        actionBtn: 'bg-black hover:bg-neutral-800 text-white font-bold border-2 border-black shadow-[2px_2px_0px_#000]',
        actionBtnRadius: '0px',
        tapeDecor: false,
        emptyIcon: '',
        emptyTitle: 'NO SAVED VINYLS IN ARCHIVE',
        emptySubtitle: 'Save upcoming game soundtrack vinyls, collector passes, and orchestra scores.',
      };
    }
    if (isCinema) {
      return {
        fontFamily: "'Playfair Display', Georgia, serif",
        modalBg: 'bg-[#0d0d0f]',
        modalBorder: 'border-r-2 border-[#d4af37]/60',
        modalShadow: 'shadow-[12px_0px_40px_rgba(0,0,0,0.95)]',
        headerBg: 'bg-[#18181b]',
        headerBorder: 'border-b border-[#d4af37]/40',
        headerTextColor: 'text-[#d4af37]',
        headerTitle: 'DIRECTORS CUT // CURATED FILM ARCHIVE',
        badgeBg: 'bg-[#d4af37]',
        badgeTextColor: 'text-black',
        badgeBorder: 'border border-[#d4af37]',
        closeBtn: 'bg-[#27272a] text-[#d4af37] hover:bg-[#d4af37] hover:text-black border border-[#d4af37]/50',
        itemBg: 'bg-[#141416] border border-[#d4af37]/30 shadow-md',
        itemRadius: '0px',
        priceColor: 'text-[#d4af37]',
        actionBtn: 'bg-[#d4af37] hover:bg-[#e6c760] text-black font-bold border border-[#d4af37]',
        actionBtnRadius: '0px',
        tapeDecor: false,
        emptyIcon: '',
        emptyTitle: 'DIRECTORS ARCHIVE EMPTY',
        emptySubtitle: 'Curate your watchlist of restored classics, Cannes festival gems, and auteur prints!',
      };
    }
    if (isTvShows) {
      return {
        fontFamily: "'Outfit', sans-serif",
        modalBg: 'bg-[#ffffff]',
        modalBorder: 'border-r-4 border-black',
        modalShadow: 'shadow-[10px_0px_0px_#8b5cf6]',
        headerBg: 'bg-[#8b5cf6]',
        headerBorder: 'border-b-3 border-black',
        headerTextColor: 'text-white',
        headerTitle: 'BINGE WATCHLIST // SAVED SERIES',
        badgeBg: 'bg-black',
        badgeTextColor: 'text-[#8b5cf6]',
        badgeBorder: 'border border-black',
        closeBtn: 'bg-white text-black hover:bg-[#8b5cf6] hover:text-white border-2 border-black shadow-[2px_2px_0px_#000]',
        itemBg: 'bg-[#faf5ff] border-2 border-black shadow-[3px_3px_0px_#8b5cf6]',
        itemRadius: '0px',
        priceColor: 'text-[#8b5cf6] font-black',
        actionBtn: 'bg-[#8b5cf6] hover:bg-violet-600 text-white font-bold border-2 border-black shadow-[2px_2px_0px_#000]',
        actionBtnRadius: '0px',
        tapeDecor: false,
        emptyIcon: '',
        emptyTitle: 'YOUR WATCHLIST IS EMPTY',
        emptySubtitle: 'Save TV boxsets, screenplays, and limited merchandise.',
      };
    }
    // Default: K-Pop Style
    return {
      fontFamily: "'Outfit', monospace, sans-serif",
      modalBg: 'bg-[#ffffff]',
      modalBorder: 'border-r-4 border-black',
      modalShadow: 'shadow-[10px_0px_0px_#000]',
      headerBg: 'bg-[#ffd60a]',
      headerBorder: 'border-b-3 border-black',
      headerTextColor: 'text-black',
      headerTitle: 'SAVED ALBUMS // WISHLIST',
      badgeBg: 'bg-[#ff2e93]',
      badgeTextColor: 'text-white',
      badgeBorder: 'border border-black',
      closeBtn: 'bg-white text-black hover:bg-[#ff2e93] hover:text-white border-2 border-black shadow-[1px_1px_0px_#000]',
      itemBg: 'bg-white border-2 border-black shadow-[3px_3px_0px_#000]',
      itemRadius: '0px',
      priceColor: 'text-[#ff2e93]',
      actionBtn: 'bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black font-bold border-2 border-black shadow-[2px_2px_0px_#000]',
      actionBtnRadius: '0px',
      tapeDecor: false,
      emptyIcon: '',
      emptyTitle: 'YOUR WISHLIST IS EMPTY',
      emptySubtitle: 'Bookmark dream albums and photocard wishlist from the catalog!',
    };
  };

  const t = getThemeConfig();

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden" style={{ fontFamily: t.fontFamily }}>
      {/* Backdrop */}
      <div 
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-black/65 backdrop-blur-xs transition-opacity" 
      />

      {/* Spacious Left-Docked Drawer Slider */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-6 sm:pr-10">
        <div 
          className={`w-screen max-w-xl sm:max-w-2xl ${t.modalBg} ${t.modalShadow} ${t.modalBorder} flex flex-col justify-between relative h-full`}
        >
          {/* Tape decoration for Manga */}
          {t.tapeDecor && (
            <div
              className="absolute -top-3 left-10 w-28 h-6 bg-[#e5e0d8] opacity-90 z-20 -rotate-2 pointer-events-none"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            />
          )}

          {/* Header Bar */}
          <div className={`px-6 py-4 ${t.headerBorder} flex items-center justify-between ${t.headerBg} select-none relative z-10`}>
            <div className="flex items-center gap-2.5">
              <h3 className={`text-sm sm:text-base font-black ${t.headerTextColor} uppercase tracking-wider`}>
                {t.headerTitle}
              </h3>
              <span className={`text-[11px] font-black px-2.5 py-0.5 ${t.badgeBg} ${t.badgeTextColor} ${t.badgeBorder} shadow-[1px_1px_0px_#000]`}>
                {wishlist.length} SAVED
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className={`px-2.5 py-1 text-xs font-black cursor-pointer transition-colors ${t.closeBtn}`}
              type="button"
              title="Close"
            >
              [✕]
            </button>
          </div>

          {/* Content - Spacious and Left-Anchored */}
          <div className={`p-6 overflow-y-auto flex-1 space-y-4 ${isManga ? 'bg-[#fdfbf7]' : isCinema ? 'bg-[#0d0d0f]' : 'bg-[#fafaf9]'}`}>
            {wishlist.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                {t.emptyIcon ? <div className="text-5xl sm:text-6xl">{t.emptyIcon}</div> : (
                  <div className="inline-block px-3 py-1 bg-black/5 dark:bg-white/5 border border-current text-[11px] font-mono uppercase tracking-widest mb-2 font-bold">
                    [ARCHIVE EMPTY]
                  </div>
                )}
                <p className={`text-sm font-bold uppercase ${isCinema ? 'text-neutral-200' : 'text-neutral-800'}`}>{t.emptyTitle}</p>
                <p className={`text-xs max-w-sm mx-auto leading-relaxed ${isCinema ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.emptySubtitle}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {wishlist.map(({ album, note }) => (
                  <div
                    key={album.id}
                    style={{ borderRadius: t.itemRadius }}
                    className={`p-4 space-y-3 ${t.itemBg} transition-all`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        style={{ width: '80px', height: '80px', borderRadius: isManga ? WOBBLY_SM : '0px' }}
                        className={`object-cover shrink-0 ${isManga ? 'border-2 border-[#2d2d2d]' : isCinema ? 'border border-[#d4af37]' : 'border-2 border-black'}`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-black truncate uppercase ${isCinema ? 'text-white' : 'text-black'}`}>
                            {album.title}
                          </h4>
                          <button
                            onClick={() => toggleWishlist(album)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                            title="Remove from saved"
                            type="button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className={`text-xs font-bold mt-0.5 ${isGaming ? 'text-black' : isCinema ? 'text-[#d4af37]' : isManga ? 'text-[#2d5da1]' : 'text-neutral-700'}`}>{album.artist}</p>

                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-sm font-black ${t.priceColor}`}>
                            {formatPrice(album.priceUSD, album.priceVND)}
                          </span>

                          <button
                            onClick={() => {
                              addToCart(album, album.versions[0]?.name);
                              toggleWishlist(album);
                            }}
                            style={{ borderRadius: t.actionBtnRadius }}
                            className={`px-3 py-1.5 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors ${t.actionBtn}`}
                            type="button"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>MOVE TO BAG</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Personal Note Section */}
                    <div className={`pt-2.5 border-t border-dashed ${isCinema ? 'border-[#d4af37]/30' : isManga ? 'border-[#2d2d2d]/30' : 'border-black/30'}`}>
                      {editingNoteId === album.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            placeholder="Add chapter note, volume wishlist, or theory..."
                            className={`flex-1 text-xs px-3 py-1.5 outline-none font-bold ${isCinema ? 'bg-[#18181b] border border-[#d4af37] text-white' : isManga ? 'bg-[#fff9c4] border border-[#2d2d2d] text-[#2d2d2d]' : 'bg-[#fff9c4] border border-black text-black'}`}
                            style={{ borderRadius: isManga ? WOBBLY_SM : '0px' }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveNote(album.id)}
                            className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-bold cursor-pointer"
                            style={{ borderRadius: isManga ? WOBBLY_SM : '0px' }}
                            type="button"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          <span className={`italic truncate pr-2 ${isCinema ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {note ? `"${note}"` : 'No personal note added.'}
                          </span>
                          <button
                            onClick={() => handleStartEditNote(album.id, note)}
                            className={`hover:underline shrink-0 flex items-center gap-1 cursor-pointer font-bold ${isCinema ? 'text-[#d4af37]' : isManga ? 'text-[#2d5da1]' : 'text-black'}`}
                            type="button"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{note ? 'Edit' : 'Add Note'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom quick actions */}
          <div className={`p-4 ${isManga ? 'border-t-[3px] border-[#2d2d2d] bg-[#fdfbf7]' : isGaming ? 'border-t-4 border-black bg-white' : isCinema ? 'border-t border-[#d4af37]/40 bg-[#141416]' : 'border-t-3 border-black bg-white'} flex items-center justify-between`}>
            <span className={`text-xs font-bold ${isCinema ? 'text-neutral-400' : 'text-neutral-600'}`}>
              SAVED ITEMS: <strong className={isCinema ? 'text-white' : 'text-black'}>{wishlist.length}</strong>
            </span>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className={`px-4 py-2 text-xs font-black uppercase cursor-pointer transition-colors ${t.actionBtn}`}
              style={{ borderRadius: t.actionBtnRadius }}
              type="button"
            >
              Close Saved Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
