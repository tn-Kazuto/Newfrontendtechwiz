'use client';

import React, { useState, useEffect } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Trash2, Plus, Minus, ShieldCheck, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { getActiveFandomTheme } from '../utils/fandomTheme';

interface CartDrawerProps {
  fandomCategory?: string;
  fandomThemeKey?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ fandomCategory, fandomThemeKey }) => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartTotalUSD, 
    cartTotalVND, 
    cartCount,
    formatPrice 
  } = useCartWishlist();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [customerName, setCustomerName] = useState('Alex Rivers');
  const [customerAddress, setCustomerAddress] = useState('fan@fanhubplus.com');
  const [currentTheme, setCurrentTheme] = useState(() => getActiveFandomTheme(fandomThemeKey, fandomCategory));

  // Detect active fandom theme dynamically from props, event, or document DOM attribute
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

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    clearCart();
  };

  // Thematic design config for each fandom style
  const isManga = currentTheme === 'manga';
  const isAnime = currentTheme === 'anime';
  const isComics = currentTheme === 'comics';
  const isGaming = currentTheme === 'gaming';
  const isCinema = currentTheme === 'cinema';
  const isTvShows = currentTheme === 'tv';

  const WOBBLY_RADIUS = '255px 15px 225px 15px/15px 225px 15px 255px';
  const WOBBLY_SM = '120px 8px 110px 8px/8px 110px 8px 120px';

  // Get current theme parameters
  const getThemeConfig = () => {
    if (isManga) {
      return {
        fontFamily: "'Kalam', cursive, sans-serif",
        panelBg: 'bg-[#fdfbf7]',
        panelBorder: 'border-l-[3px] border-[#2d2d2d]',
        panelShadow: 'shadow-[-8px_0px_0px_#2d2d2d]',
        panelRadius: '0px',
        headerBg: 'bg-[#fff9c4]',
        headerBorder: 'border-b-[3px] border-[#2d2d2d]',
        headerTextColor: 'text-[#2d2d2d]',
        headerTitle: 'MANGA DRAFT TOTE // TANKŌBON',
        badgeBg: 'bg-[#2d5da1]',
        badgeTextColor: 'text-white',
        badgeBorder: 'border border-[#2d2d2d]',
        closeBtn: 'bg-white text-[#2d2d2d] hover:bg-[#ff4d4d] hover:text-white border-2 border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]',
        itemCardBg: 'bg-white',
        itemBorder: 'border-2 border-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d]',
        itemRadius: WOBBLY_SM,
        priceColor: 'text-[#ff4d4d]',
        accentTag: 'bg-[#fff9c4] text-[#2d2d2d] border border-[#2d2d2d]',
        primaryBtn: 'bg-[#ff4d4d] hover:bg-[#e03131] text-white border-2 border-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d]',
        primaryBtnRadius: WOBBLY_SM,
        qtyBox: 'border-2 border-[#2d2d2d] bg-[#fdfbf7] shadow-[2px_2px_0px_#2d2d2d]',
        tapeDecor: true,
        emptyIcon: '',
        emptyTitle: 'YOUR MANGA TOTE IS EMPTY',
        emptySubtitle: 'Scribble notes and add tankōbon volumes, draft prints, and author post cards!',
        checkoutText: '[PIN TANKŌBON PRE-ORDER DROP]',
      };
    }
    if (isAnime) {
      return {
        fontFamily: "'Space Grotesk', monospace, sans-serif",
        panelBg: 'bg-[#ffffff]',
        panelBorder: 'border-l-4 border-black',
        panelShadow: 'shadow-[-8px_0px_0px_#ccff00]',
        panelRadius: '0px',
        headerBg: 'bg-[#ccff00]',
        headerBorder: 'border-b-3 border-black',
        headerTextColor: 'text-black',
        headerTitle: 'SAKUGA CART // ANIME VAULT',
        badgeBg: 'bg-black',
        badgeTextColor: 'text-[#ccff00]',
        badgeBorder: 'border border-black',
        closeBtn: 'bg-black text-[#ccff00] hover:bg-white hover:text-black border-2 border-black shadow-[2px_2px_0px_#000]',
        itemCardBg: 'bg-[#f7fee7]',
        itemBorder: 'border-2 border-black shadow-[3px_3px_0px_#ccff00]',
        itemRadius: '0px',
        priceColor: 'text-black font-black',
        accentTag: 'bg-[#ccff00] text-black border border-black',
        primaryBtn: 'bg-[#ccff00] hover:bg-lime-400 text-black font-black border-2 border-black shadow-[3px_3px_0px_#000]',
        primaryBtnRadius: '0px',
        qtyBox: 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]',
        tapeDecor: false,
        emptyIcon: '',
        emptyTitle: 'SAKUGA CART EMPTY',
        emptySubtitle: 'Stash anime cels, Blu-ray collector editions, and streetwear from the vault!',
        checkoutText: '[CLAIM SAKUGA PRE-ORDER]',
      };
    }
    if (isComics) {
      return {
        fontFamily: "'Bangers', 'Kalam', cursive, sans-serif",
        panelBg: 'bg-[#ffffff]',
        panelBorder: 'border-l-4 border-black',
        panelShadow: 'shadow-[-8px_0px_0px_#ef4444]',
        panelRadius: '0px',
        headerBg: 'bg-[#ef4444]',
        headerBorder: 'border-b-3 border-black',
        headerTextColor: 'text-white',
        headerTitle: 'HEROIC ISSUE TOTE // PULL LIST',
        badgeBg: 'bg-[#ffd60a]',
        badgeTextColor: 'text-black',
        badgeBorder: 'border border-black',
        closeBtn: 'bg-[#ffd60a] text-black hover:bg-white border-2 border-black shadow-[2px_2px_0px_#000]',
        itemCardBg: 'bg-[#fffdf0]',
        itemBorder: 'border-2 border-black shadow-[3px_3px_0px_#ef4444]',
        itemRadius: '2px',
        priceColor: 'text-[#ef4444]',
        accentTag: 'bg-[#ffd60a] text-black border border-black',
        primaryBtn: 'bg-[#ffd60a] hover:bg-yellow-400 text-black font-black border-3 border-black shadow-[4px_4px_0px_#000]',
        primaryBtnRadius: '0px',
        qtyBox: 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]',
        tapeDecor: false,
        emptyIcon: '',
        emptyTitle: 'YOUR PULL LIST IS EMPTY',
        emptySubtitle: 'Grab variant covers, graphic novels, and signed issues from the racks!',
        checkoutText: '[LOCK IN HEROIC PULL LIST]',
      };
    }
    if (isGaming) {
      return {
        fontFamily: "'JetBrains Mono', monospace",
        panelBg: 'bg-[#ffffff]',
        panelBorder: 'border-l-4 border-black',
        panelShadow: 'shadow-[-10px_0px_0px_#000000]',
        panelRadius: '0px',
        headerBg: 'bg-[#000000]',
        headerBorder: 'border-b-4 border-black',
        headerTextColor: 'text-white',
        headerTitle: 'GAMING ARENA // VINYL & GEAR BAG',
        badgeBg: 'bg-white',
        badgeTextColor: 'text-black',
        badgeBorder: 'border-2 border-black',
        closeBtn: 'bg-white text-black hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0px_#000]',
        itemCardBg: 'bg-[#fafafa]',
        itemBorder: 'border-2 border-black shadow-[3px_3px_0px_#000]',
        itemRadius: '0px',
        priceColor: 'text-black font-black',
        accentTag: 'bg-black text-white border border-black',
        primaryBtn: 'bg-black hover:bg-neutral-800 text-white font-bold border-2 border-black shadow-[3px_3px_0px_#000]',
        primaryBtnRadius: '0px',
        qtyBox: 'border-2 border-black bg-white text-black',
        tapeDecor: false,
        emptyIcon: '',
        emptyTitle: 'YOUR VINYL BAG IS EMPTY',
        emptySubtitle: 'Add official gaming soundtrack vinyls, collector discs, and arena passes.',
        checkoutText: '[CONFIRM ARCHIVAL ORDER]',
      };
    }
    if (isCinema) {
      return {
        fontFamily: "'Playfair Display', Georgia, serif",
        panelBg: 'bg-[#0d0d0f]',
        panelBorder: 'border-l-2 border-[#d4af37]/60',
        panelShadow: 'shadow-[-12px_0px_35px_rgba(0,0,0,0.9)]',
        panelRadius: '0px',
        headerBg: 'bg-[#18181b]',
        headerBorder: 'border-b border-[#d4af37]/40',
        headerTextColor: 'text-[#d4af37]',
        headerTitle: 'ACADEMY SELECTION // REEL VAULT',
        badgeBg: 'bg-[#d4af37]',
        badgeTextColor: 'text-[#09090b]',
        badgeBorder: 'border border-[#d4af37]',
        closeBtn: 'bg-[#27272a] text-[#d4af37] hover:bg-[#d4af37] hover:text-black border border-[#d4af37]/50',
        itemCardBg: 'bg-[#141416]',
        itemBorder: 'border border-[#d4af37]/30 shadow-md',
        itemRadius: '0px',
        priceColor: 'text-[#d4af37]',
        accentTag: 'bg-[#27272a] text-[#d4af37] border border-[#d4af37]/40',
        primaryBtn: 'bg-[#d4af37] hover:bg-[#e6c760] text-[#09090b] font-bold border border-[#d4af37]',
        primaryBtnRadius: '0px',
        qtyBox: 'border border-[#d4af37]/40 bg-[#18181b] text-white',
        tapeDecor: false,
        emptyIcon: '',
        emptyTitle: 'CINEMATIC ARCHIVE EMPTY',
        emptySubtitle: 'Curate 4K restorations, criterion masterworks, and film scores!',
        checkoutText: '[RESERVE ARCHIVAL FILM REEL]',
      };
    }
    if (isTvShows) {
      return {
        fontFamily: "'Outfit', sans-serif",
        panelBg: 'bg-[#ffffff]',
        panelBorder: 'border-l-4 border-black',
        panelShadow: 'shadow-[-10px_0px_0px_#8b5cf6]',
        panelRadius: '0px',
        headerBg: 'bg-[#8b5cf6]',
        headerBorder: 'border-b-3 border-black',
        headerTextColor: 'text-white',
        headerTitle: 'BROADCAST BAG // TV SERIES ARCHIVE',
        badgeBg: 'bg-black',
        badgeTextColor: 'text-[#8b5cf6]',
        badgeBorder: 'border border-black',
        closeBtn: 'bg-white text-black hover:bg-[#8b5cf6] hover:text-white border-2 border-black shadow-[2px_2px_0px_#000]',
        itemCardBg: 'bg-[#faf5ff]',
        itemBorder: 'border-2 border-black shadow-[3px_3px_0px_#8b5cf6]',
        itemRadius: '0px',
        priceColor: 'text-[#8b5cf6] font-black',
        accentTag: 'bg-[#8b5cf6] text-white border border-black',
        primaryBtn: 'bg-[#8b5cf6] hover:bg-violet-600 text-white font-bold border-2 border-black shadow-[3px_3px_0px_#000]',
        primaryBtnRadius: '0px',
        qtyBox: 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]',
        tapeDecor: false,
        emptyIcon: '',
        emptyTitle: 'BROADCAST BAG EMPTY',
        emptySubtitle: 'Add certified TV soundtracks, screenplays, and deluxe collector items.',
        checkoutText: '[RESERVE TV SHOWCASE DROP]',
      };
    }
    // Default: K-Pop Style
    return {
      fontFamily: "'Outfit', monospace, sans-serif",
      panelBg: 'bg-[#fdfbf7]',
      panelBorder: 'border-l-4 border-black',
      panelShadow: 'shadow-[-10px_0px_0px_#000]',
      panelRadius: '0px',
      headerBg: 'bg-[#ffd60a]',
      headerBorder: 'border-b-3 border-black',
      headerTextColor: 'text-black',
      headerTitle: 'FANDOM SHOWCASE BAG',
      badgeBg: 'bg-[#ff2e93]',
      badgeTextColor: 'text-white',
      badgeBorder: 'border border-black',
      closeBtn: 'bg-white text-black hover:bg-[#ff2e93] hover:text-white border-2 border-black shadow-[1px_1px_0px_#000]',
      itemCardBg: 'bg-white',
      itemBorder: 'border-2 border-black shadow-[3px_3px_0px_#000]',
      itemRadius: '0px',
      priceColor: 'text-[#ff2e93]',
      accentTag: 'bg-[#ffd60a] text-black border border-black',
      primaryBtn: 'bg-[#ff2e93] hover:bg-[#e11d48] text-white border-2 border-black shadow-[3px_3px_0px_#000]',
      primaryBtnRadius: '0px',
      qtyBox: 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]',
      tapeDecor: false,
      emptyIcon: '',
      emptyTitle: 'YOUR SHOWCASE BAG IS EMPTY',
      emptySubtitle: 'Add albums or collector boxsets from the catalog above!',
      checkoutText: '[REGISTER PRE-ORDER ALERT / RESERVE SLOT]',
    };
  };

  const t = getThemeConfig();

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden" style={{ fontFamily: t.fontFamily }}>
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/65 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div 
          style={{ borderRadius: t.panelRadius }}
          className={`w-screen max-w-md ${t.panelBg} ${t.panelShadow} ${t.panelBorder} flex flex-col justify-between relative`}
        >
          {/* Tape decoration for Manga */}
          {t.tapeDecor && (
            <div
              className="absolute -top-3 left-10 w-28 h-6 bg-[#e5e0d8] opacity-90 z-20 -rotate-2 pointer-events-none"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            />
          )}

          {/* Header Bar */}
          <div className={`px-5 py-4 ${t.headerBorder} flex items-center justify-between ${t.headerBg} select-none relative z-10`}>
            <div className="flex items-center gap-2">
              <h2 className={`text-sm font-black ${t.headerTextColor} uppercase tracking-wider`}>
                {t.headerTitle}
              </h2>
              <span className={`text-[11px] font-black px-2 py-0.5 ${t.badgeBg} ${t.badgeTextColor} ${t.badgeBorder} shadow-[1px_1px_0px_#000]`}>
                {cartCount} ITEMS
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className={`px-2 py-0.5 text-xs font-black cursor-pointer transition-colors ${t.closeBtn}`}
              type="button"
              title="Close Bag"
            >
              [✕]
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-5 overflow-y-auto flex-1 space-y-3">
            {orderComplete ? (
              <div className="text-center py-10 space-y-4">
                <div 
                  className={`w-14 h-14 ${isCinema ? 'bg-[#d4af37] text-black' : isGaming ? 'bg-black text-white' : isManga ? 'bg-[#ff4d4d] text-white border-2 border-[#2d2d2d]' : 'bg-[#ccff00] text-black border-2 border-black'} shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto`}
                  style={{ borderRadius: isManga ? WOBBLY_SM : '0px' }}
                >
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className={`text-base font-black uppercase ${isCinema ? 'text-white' : 'text-black'}`}>
                  RESERVED SUCCESSFULLY
                </h3>
                <p className={`text-xs font-sans leading-relaxed max-w-xs mx-auto ${isCinema ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Thank you! Your official drop alert and pre-order slot have been registered in the archive.
                </p>
                <div 
                  className={`p-3 text-xs font-black shadow-[3px_3px_0px_#000] ${isManga ? 'bg-[#fff9c4] text-[#2d2d2d] border-2 border-[#2d2d2d]' : isCinema ? 'bg-[#27272a] text-[#d4af37] border border-[#d4af37]' : isGaming ? 'bg-black text-white border-2 border-black' : 'bg-[#ffd60a] border-2 border-black text-black'}`}
                  style={{ borderRadius: isManga ? WOBBLY_SM : '0px' }}
                >
                  ARCHIVE TRACKING ID: <strong>FH-2026-{currentTheme.toUpperCase()}-8839</strong>
                </div>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    setIsCartOpen(false);
                  }}
                  className={`mt-3 px-6 py-2.5 text-xs font-black uppercase cursor-pointer transition-all ${t.primaryBtn}`}
                  style={{ borderRadius: t.primaryBtnRadius }}
                  type="button"
                >
                  [CONTINUE BROWSING]
                </button>
              </div>
            ) : isCheckingOut ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className={`flex items-center justify-between pb-2 border-b-2 ${isGaming ? 'border-black' : isCinema ? 'border-[#d4af37]/40' : 'border-black'}`}>
                  <h3 className={`text-xs font-black uppercase ${isCinema ? 'text-white' : 'text-black'}`}>
                    PRE-ORDER &amp; ALERT REGISTRATION
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className={`text-xs font-black hover:underline cursor-pointer ${isGaming ? 'text-black' : isCinema ? 'text-[#d4af37]' : isManga ? 'text-[#ff4d4d]' : 'text-[#ff2e93]'}`}
                  >
                    ← BACK
                  </button>
                </div>

                {/* Important Showcase Disclaimer Badge */}
                <div 
                  className={`p-3 text-[11px] leading-relaxed shadow-[2px_2px_0px_#000] ${isGaming ? 'bg-neutral-100 text-black border-2 border-black' : isCinema ? 'bg-[#1c1c20] text-neutral-200 border border-[#d4af37]/40' : isManga ? 'bg-[#fff9c4] text-[#2d2d2d] border-2 border-[#2d2d2d]' : 'bg-[#ecfeff] text-black border-2 border-black'}`}
                  style={{ borderRadius: isManga ? WOBBLY_SM : '0px' }}
                >
                  <strong className="font-black block uppercase mb-1">
                    OFFICIAL ARCHIVE NOTICE:
                  </strong>
                  This showcase operates as an Official Fandom discovery catalog. Submitting your details secures priority alert notifications when certified editions drop.
                </div>

                <div>
                  <label className={`text-xs font-black block mb-1 ${isCinema ? 'text-neutral-200' : 'text-black'}`}>COLLECTOR NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex (Collector VIP)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full text-xs p-2.5 outline-none font-bold ${isCinema ? 'bg-[#18181b] border border-[#d4af37] text-white' : 'bg-white border-2 border-black text-black'}`}
                    style={{ borderRadius: isManga ? WOBBLY_SM : '0px' }}
                  />
                </div>

                <div>
                  <label className={`text-xs font-black block mb-1 ${isCinema ? 'text-neutral-200' : 'text-black'}`}>ALERT EMAIL *</label>
                  <input
                    type="email"
                    required
                    placeholder="fan@example.com"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className={`w-full text-xs p-2.5 outline-none font-bold ${isCinema ? 'bg-[#18181b] border border-[#d4af37] text-white' : 'bg-white border-2 border-black text-black'}`}
                    style={{ borderRadius: isManga ? WOBBLY_SM : '0px' }}
                  />
                </div>

                <div className={`pt-2 text-xs font-bold flex items-center gap-1.5 ${isCinema ? 'text-neutral-300' : 'text-black'}`}>
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  <span>Verified Official Channel • No Transaction Fee</span>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 text-xs font-black uppercase tracking-wider cursor-pointer mt-4 transition-all ${t.primaryBtn}`}
                  style={{ borderRadius: t.primaryBtnRadius }}
                >
                  {t.checkoutText}
                </button>
              </form>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                {t.emptyIcon ? <div className="text-5xl">{t.emptyIcon}</div> : (
                  <div className="inline-block px-3 py-1 bg-black/5 dark:bg-white/5 border border-current text-[11px] font-mono uppercase tracking-widest mb-2 font-bold">
                    [EMPTY ARCHIVE]
                  </div>
                )}
                <p className={`text-xs font-bold uppercase ${isCinema ? 'text-neutral-200' : 'text-neutral-800'}`}>{t.emptyTitle}</p>
                <p className={`text-[11px] max-w-xs mx-auto ${isCinema ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.emptySubtitle}</p>
              </div>
            ) : (
              cart.map((item, idx) => {
                const verObj = item.album.versions.find((v) => v.name === item.selectedVersion);
                const extra = verObj ? verObj.extraPriceUSD : 0;
                const unitPriceUSD = item.album.priceUSD + extra;
                const unitPriceVND = item.album.priceVND + extra * 25000;

                return (
                  <div 
                    key={`${item.album.id}-${item.selectedVersion}-${idx}`} 
                    className={`p-3.5 flex gap-3 ${t.itemCardBg} ${t.itemBorder} transition-all`}
                    style={{ borderRadius: t.itemRadius }}
                  >
                    <img
                      src={item.album.coverImage}
                      alt={item.album.title}
                      style={{ width: '68px', height: '68px', borderRadius: isManga ? WOBBLY_SM : '0px' }}
                      className={`object-cover shrink-0 ${isManga ? 'border-2 border-[#2d2d2d]' : isCinema ? 'border border-[#d4af37]' : isGaming ? 'border-2 border-black' : 'border-2 border-black'}`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className={`text-xs font-black truncate uppercase ${isCinema ? 'text-white' : 'text-black'}`}>
                          {item.album.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.album.id, item.selectedVersion)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                          title="Remove item"
                          type="button"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className={`text-[11px] font-bold ${isGaming ? 'text-black' : isCinema ? 'text-[#d4af37]' : isManga ? 'text-[#2d5da1]' : 'text-black'}`}>{item.album.artist}</p>
                      <p className={`text-[10px] mt-0.5 ${isCinema ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        EDITION: <span className={`font-bold uppercase px-1 ${t.accentTag}`}>{item.selectedVersion}</span>
                      </p>

                      <div className="flex items-center justify-between mt-2.5">
                        <span className={`text-xs font-black ${t.priceColor}`}>
                          {formatPrice(unitPriceUSD * item.quantity, unitPriceVND * item.quantity)}
                        </span>

                        <div className={`flex items-center ${t.qtyBox}`}>
                          <button
                            onClick={() => updateQuantity(item.album.id, item.selectedVersion, -1)}
                            className="px-2 py-0.5 hover:opacity-75 transition-colors font-bold cursor-pointer"
                            type="button"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.album.id, item.selectedVersion, 1)}
                            className="px-2 py-0.5 hover:opacity-75 transition-colors font-bold cursor-pointer"
                            type="button"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout Button */}
          {!orderComplete && !isCheckingOut && cart.length > 0 && (
            <div className={`p-5 ${isManga ? 'border-t-[3px] border-[#2d2d2d] bg-[#fdfbf7]' : isGaming ? 'border-t-4 border-black bg-white' : isCinema ? 'border-t border-[#d4af37]/40 bg-[#141416]' : 'border-t-3 border-black bg-white'} space-y-2.5`}>
              <div className={`flex items-center justify-between text-xs font-bold ${isCinema ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <span>SUBTOTAL:</span>
                <span className={`font-black ${isCinema ? 'text-white' : 'text-black'}`}>
                  {formatPrice(cartTotalUSD, cartTotalVND)}
                </span>
              </div>
              <div className={`flex items-center justify-between text-xs font-bold ${isCinema ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <span>DISPATCH:</span>
                <span className={`font-black px-1.5 py-0.5 ${t.accentTag}`}>FREE WORLDWIDE ARCHIVE</span>
              </div>
              <div className={`flex items-center justify-between text-sm font-black pt-2 ${isManga ? 'border-t border-dashed border-[#2d2d2d] text-[#2d2d2d]' : isGaming ? 'border-t-2 border-black text-black' : isCinema ? 'border-t border-[#d4af37]/40 text-white' : 'border-t-2 border-black text-black'}`}>
                <span>TOTAL ESTIMATE:</span>
                <span className={`text-base font-black ${t.priceColor}`}>
                  {formatPrice(cartTotalUSD, cartTotalVND)}
                </span>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className={`w-full text-xs py-3 mt-2 flex items-center justify-center gap-2 cursor-pointer font-black uppercase tracking-wider transition-all ${t.primaryBtn}`}
                style={{ borderRadius: t.primaryBtnRadius }}
                type="button"
              >
                <span>{t.checkoutText}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
