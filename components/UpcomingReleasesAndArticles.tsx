'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Bookmark, Share2, Copy, Check, X } from 'lucide-react';
import { mockFeaturedArticles, mockUpcomingReleases } from '../data/mockData';
import { FandomCategoryKey, UpcomingRelease, FeaturedArticle } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

interface UpcomingReleasesAndArticlesProps {
  initialCategory?: FandomCategoryKey | 'all';
  onSelectCategory?: (category: FandomCategoryKey | 'all') => void;
  fandomCategory?: FandomCategoryKey | 'all';
  onSelectAlbum?: (album: any) => void;
}

export const UpcomingReleasesAndArticles: React.FC<UpcomingReleasesAndArticlesProps> = ({
  initialCategory = 'all',
  onSelectCategory,
  fandomCategory,
  onSelectAlbum,
}) => {
  const { addToCart, setIsCartOpen } = useCartWishlist();
  const [activeCategory, setActiveCategory] = useState<FandomCategoryKey | 'all'>(fandomCategory || initialCategory);
  const [remindedItems, setRemindedItems] = useState<Record<string, boolean>>({});
  const [likedArticles, setLikedArticles] = useState<Record<string, number>>({});

  // SRS 1.6: Bookmarking, Notes & Sharing state
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('fanhub_bookmarked_articles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });
  const [sharingArticle, setSharingArticle] = useState<FeaturedArticle | null>(null);
  const [articleToast, setArticleToast] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // View Mode: 'grid' vs 'timeline'
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  // Fan Submission Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitToast, setSubmitToast] = useState<string | null>(null);
  const [submitTitle, setSubmitTitle] = useState('');
  const [submitExcerpt, setSubmitExcerpt] = useState('');
  const [submitContent, setSubmitContent] = useState('');
  const [submitCategory, setSubmitCategory] = useState<FandomCategoryKey>('K-Pop');
  const [submitAuthor, setSubmitAuthor] = useState('Editorial Contributor');
  const [submitImage, setSubmitImage] = useState('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80');
  const [submitTags, setSubmitTags] = useState('Comeback, Concert, Fandom');

  // Fan articles loaded from localStorage
  const [fanArticles, setFanArticles] = useState<FeaturedArticle[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('fanhub_fan_articles');
    if (saved) {
      try {
        setFanArticles(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // SRS 1.6 Handlers for Bookmarking & Sharing Articles
  const toggleBookmarkArticle = (art: FeaturedArticle) => {
    setBookmarkedArticles((prev) => {
      const isSaved = !!prev[art.id];
      const next = { ...prev, [art.id]: !isSaved };
      try {
        localStorage.setItem('fanhub_bookmarked_articles', JSON.stringify(next));
      } catch {}
      setArticleToast(!isSaved ? `★ Saved article "${art.title}" to Bookmarks!` : `Removed article from Bookmarks.`);
      setTimeout(() => setArticleToast(null), 3000);
      return next;
    });
  };

  const handleCopyArticleLink = (art: FeaturedArticle) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/#upcoming-releases?article=${art.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Sync with fandomCategory or initialCategory if parent changes
  useEffect(() => {
    if (fandomCategory) {
      setActiveCategory(fandomCategory);
    } else if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory, fandomCategory]);

  const handleCategoryClick = (cat: FandomCategoryKey | 'all') => {
    setActiveCategory(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  // Toggle Reminder Alert
  const toggleReminder = (id: string) => {
    setRemindedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Like Article
  const toggleLike = (id: string, currentLikes: number) => {
    setLikedArticles(prev => ({
      ...prev,
      [id]: prev[id] ? prev[id] - 1 : (currentLikes + 1)
    }));
  };

  // Add Upcoming Release to Cart & Open Drawer
  const handlePreOrder = (rel: UpcomingRelease) => {
    addToCart({
      id: `upcoming-${rel.id}`,
      title: rel.title,
      artist: rel.creatorOrArtist,
      artistId: rel.creatorOrArtist.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: rel.category,
      priceUSD: rel.priceUSD,
      priceVND: rel.priceVND,
      coverImage: rel.coverImage,
      galleryImages: [rel.coverImage],
      type: rel.type,
      releaseDate: rel.releaseDate,
      tag: rel.badgeText || 'Pre-Order Drop',
      rating: 5.0,
      reviewCount: 1,
      popularityScore: 95,
      stock: 50,
      description: `Official Scheduled Drop. Perks: ${rel.perks?.join(', ')}`,
      versions: [{ id: 'standard', name: 'Official Scheduled Drop', extraPriceUSD: 0 }],
      inclusions: rel.perks || ['Official Scheduled Drop'],
      photocards: [],
      tracks: [],
      reviews: []
    });
    setIsCartOpen(true);
  };

  // Combined Articles (Fan-Submitted + Editorial)
  const allArticles = useMemo(() => {
    return [...fanArticles, ...mockFeaturedArticles];
  }, [fanArticles]);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return allArticles;
    return allArticles.filter(art => art.category === activeCategory);
  }, [activeCategory, allArticles]);

  // Fan Article Submission Handler
  const handleFanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTitle.trim() || !submitExcerpt.trim()) return;

    const newArticle: FeaturedArticle = {
      id: `fan-art-${Date.now()}`,
      title: submitTitle.trim(),
      excerpt: submitExcerpt.trim(),
      category: submitCategory,
      author: {
        name: submitAuthor.trim() || 'Fandom Contributor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        role: 'Verified Fan Writer',
      },
      date: 'Today',
      readTime: '3 min read',
      coverImage: submitImage.trim() || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      tags: submitTags.split(',').map(t => t.trim()).filter(Boolean),
      badgeText: 'FAN SUBMISSION',
      isHot: true,
      likes: 1,
      commentsCount: 0,
    };

    const updated = [newArticle, ...fanArticles];
    setFanArticles(updated);
    localStorage.setItem('fanhub_fan_articles', JSON.stringify(updated));

    setSubmitToast(`Article "${submitTitle.slice(0, 32)}..." submitted and published to feed!`);
    setIsSubmitModalOpen(false);
    setSubmitTitle('');
    setSubmitExcerpt('');
    setSubmitContent('');
    setTimeout(() => setSubmitToast(null), 4000);
  };

  // Filtered Upcoming Releases
  const filteredReleases = useMemo(() => {
    if (activeCategory === 'all') return mockUpcomingReleases;
    return mockUpcomingReleases.filter(rel => rel.category === activeCategory);
  }, [activeCategory]);

  const categories: (FandomCategoryKey | 'all')[] = [
    'all',
    'K-Pop',
    'Anime',
    'Gaming',
    'Manga',
    'Comics',
    'Movies',
    'TV Shows',
    'Cosplay'
  ];

  return (
    <section 
      id="upcoming-releases"
      style={{
        paddingTop: '80px',
        paddingBottom: '96px',
      }}
      className="w-full py-20 md:py-28 bg-white border-b-4 border-black"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* ==================== 1. EDITORIAL HEADER & MONOCHROME FILTER ==================== */}
        <div>
          {/* Eyebrow Label + Category Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 border-2 border-black px-4 py-2 bg-black text-white">
              <span className="w-2 h-2 bg-white" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                EDITORIAL RADAR // RELEASE CALENDAR
              </span>
            </div>

            {/* Category tabs (Vibrant Y2K Pop Rectangles) */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-full pb-2">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    type="button"
                    style={{ borderRadius: '0px' }}
                    className={`px-4 py-2 text-xs font-mono font-black tracking-widest uppercase cursor-pointer whitespace-nowrap transition-all duration-100 border-2 border-black ${
                      isSelected
                        ? 'bg-[#d91470] text-white shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-white text-black hover:bg-[#fefce8] hover:shadow-[2px_2px_0px_#000000]'
                    }`}
                  >
                    {isSelected && <span>★ </span>}
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Title Row with Playfair Display and Visual Punctuation */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b-2 border-black gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-[#ff2e93] border-2 border-black" />
                <div className="w-12 h-[3px] bg-[#00f0ff]" />
                <div className="w-3 h-3 bg-[#ffd60a] border-2 border-black" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-black leading-tight tracking-tight">
                Trending Articles{' '}
                <em className="font-serif italic font-normal text-[#d91470] drop-shadow-[1px_1px_0px_#000000]">
                  &amp; Upcoming Drops
                </em>
              </h2>
            </div>

            <div className="border-2 border-black bg-[#fefce8] px-4 py-2 font-mono text-xs text-black flex items-center gap-2 self-start md:self-end shadow-[3px_3px_0px_#000000]">
              <span className="font-black text-sm text-[#d91470]">{filteredArticles.length}</span> ARTICLES
              <span className="text-neutral-400">/</span>
              <span className="font-black text-sm text-black">{filteredReleases.length}</span> DROPS
            </div>
          </div>
        </div>

        {/* ==================== 2. MAIN SPLIT CONTENT GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mt-12 md:mt-16">
          
          {/* -------------------- COLUMN A: FEATURED ARTICLES (7 COLS) -------------------- */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#00f0ff] border border-black" />
                <h3 className="font-serif text-2xl font-normal italic text-black">
                  Fandom Dispatches &amp; Editorial Lore
                </h3>
              </div>

              {/* View Switcher & Fan Submit Trigger */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* View Mode Toggle */}
                <div className="flex items-center border-2 border-black text-xs font-mono shadow-[2px_2px_0px_#000000]">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    style={{ borderRadius: '0px' }}
                    className={`px-3 py-1.5 font-black uppercase tracking-wider cursor-pointer transition-colors duration-100 ${
                      viewMode === 'grid'
                        ? 'bg-[#ffd60a] text-black'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('timeline')}
                    style={{ borderRadius: '0px' }}
                    className={`px-3 py-1.5 font-black uppercase tracking-wider cursor-pointer transition-colors duration-100 border-l-2 border-black ${
                      viewMode === 'timeline'
                        ? 'bg-[#ffd60a] text-black'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    <span>Timeline</span>
                  </button>
                </div>

                {/* Fan Submission Button */}
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  style={{ borderRadius: '0px' }}
                  className="px-4 py-2 bg-[#d91470] text-white text-xs font-mono font-black uppercase tracking-widest hover:bg-[#be185d] border-2 border-black transition-colors duration-100 cursor-pointer shadow-[3px_3px_0px_#000000]"
                  title="Submit Fandom Article"
                >
                  <span>[+ SUBMIT POST]</span>
                </button>
              </div>
            </div>

            {/* Submission Toast Notification */}
            {submitToast && (
              <div 
                style={{ borderRadius: '0px' }}
                className="p-4 bg-[#ffd60a] text-black border-2 border-black text-xs font-mono font-black flex items-center gap-2 shadow-[3px_3px_0px_#000]"
              >
                <span>[OK]</span>
                <span>{submitToast}</span>
              </div>
            )}

            {/* SRS 1.6: Article Bookmark Toast Notification */}
            {articleToast && (
              <div 
                style={{ borderRadius: '0px' }}
                className="p-3 bg-[#ccff00] text-black border-2 border-black text-xs font-mono font-black flex items-center gap-2 shadow-[3px_3px_0px_#000] animate-in fade-in duration-150"
              >
                <Bookmark className="w-4 h-4 fill-black" />
                <span>{articleToast}</span>
              </div>
            )}

            {filteredArticles.length === 0 ? (
              <div 
                style={{ borderRadius: '0px' }}
                className="p-12 text-center bg-neutral-50 border-2 border-dashed border-black font-mono text-neutral-600 text-sm"
              >
                No dispatches available in this category.
              </div>
            ) : viewMode === 'timeline' ? (
              /* TIMELINE VIEW (Vibrant Y2K Pop) */
              <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-black">
                {filteredArticles.map((art) => {
                  const likesCount = likedArticles[art.id] !== undefined ? likedArticles[art.id] : art.likes;

                  return (
                    <div key={art.id} className="relative group">
                      {/* Timeline Milestone Square */}
                      <span 
                        style={{ borderRadius: '0px' }}
                        className="absolute -left-8 top-1 w-6 h-6 bg-[#d91470] text-white flex items-center justify-center border-2 border-black font-mono text-[9px] font-black shadow-[2px_2px_0px_#000]"
                      >
                        //
                      </span>

                      {/* Timeline Card */}
                      <div 
                        style={{ borderRadius: '0px' }}
                        className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#00f0ff] transition-all duration-100 flex flex-col md:flex-row gap-6 group"
                      >
                        <div className="relative w-full md:w-48 h-36 shrink-0 border-2 border-black overflow-hidden">
                          <Image
                            src={art.coverImage}
                            alt={art.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 192px"
                            className="object-cover group-hover:scale-105 transition-all duration-300"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-1">
                              <span className="border border-black bg-[#fefce8] px-2 py-0.5 font-bold uppercase text-black">
                                {art.date}
                              </span>
                              <span className="font-bold">{art.readTime}</span>
                            </div>

                            <h4 className="font-serif text-xl font-bold leading-snug text-black">
                              {art.title}
                            </h4>

                            <p className="font-serif text-xs leading-relaxed text-neutral-600 line-clamp-2 mt-1">
                              {art.excerpt}
                            </p>
                          </div>

                          <div className="pt-3 border-t-2 border-black flex items-center justify-between font-mono text-xs flex-wrap gap-2">
                            <span className="font-black text-[#d91470]">{art.author.name}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleLike(art.id, art.likes)}
                                type="button"
                                className="inline-flex items-center gap-1.5 cursor-pointer bg-[#fdf2f8] border border-black px-2 py-0.5 text-black hover:bg-[#d91470] hover:text-white transition-colors"
                              >
                                <span className="text-[#d91470]">★</span>
                                <span className="font-bold">{likesCount}</span>
                              </button>
                              <button
                                onClick={() => toggleBookmarkArticle(art)}
                                type="button"
                                className={`inline-flex items-center gap-1 cursor-pointer border border-black px-2 py-0.5 text-[10.5px] font-bold transition-colors ${
                                  bookmarkedArticles[art.id]
                                    ? 'bg-[#ccff00] text-black shadow-[1px_1px_0px_#000]'
                                    : 'bg-white text-black hover:bg-neutral-100'
                                }`}
                                title="Bookmark Article"
                              >
                                <Bookmark className={`w-3 h-3 ${bookmarkedArticles[art.id] ? 'fill-black' : ''}`} />
                                <span>{bookmarkedArticles[art.id] ? 'SAVED' : 'SAVE'}</span>
                              </button>
                              <button
                                onClick={() => setSharingArticle(art)}
                                type="button"
                                className="inline-flex items-center gap-1 cursor-pointer bg-white border border-black px-2 py-0.5 text-[10.5px] font-bold hover:bg-[#00f0ff] transition-colors"
                                title="Share Article"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>SHARE</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* GRID VIEW (Vibrant Y2K Pop Editorial Cards) */
              <div className="flex flex-col gap-6">
                {filteredArticles.map((art) => {
                  const likesCount = likedArticles[art.id] !== undefined ? likedArticles[art.id] : art.likes;

                  return (
                    <article
                      key={art.id}
                      style={{ borderRadius: '0px' }}
                      className="group border-2 border-black bg-white shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#00f0ff] transition-all duration-100 flex flex-col sm:flex-row overflow-hidden"
                    >
                      {/* Image Thumbnail */}
                      <div className="sm:w-[42%] relative min-h-[220px] sm:min-h-[260px] overflow-hidden bg-black shrink-0 border-b-2 sm:border-b-0 sm:border-r-2 border-black">
                        <Image 
                          src={art.coverImage} 
                          alt={art.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 42vw"
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />

                        {/* Top Category Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span 
                            style={{ borderRadius: '0px' }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffd60a] text-black border-2 border-black font-mono text-[10px] font-black tracking-widest uppercase shadow-[2px_2px_0px_#000000]"
                          >
                            <span>★ {art.badgeText || art.category}</span>
                          </span>
                        </div>

                        {art.isHot && (
                          <div 
                            style={{ borderRadius: '0px' }}
                            className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#d91470] text-white font-mono text-[9px] font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_#000000]"
                          >
                            ⚡ HOT DISPATCH
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Author & Meta */}
                          <div className="flex items-center justify-between font-mono text-xs text-neutral-500 mb-3">
                            <span className="font-black tracking-wide uppercase text-[#d91470]">
                              {art.author.name}
                            </span>
                            <div className="flex items-center gap-1.5 font-bold">
                              <span>//</span>
                              <span>{art.readTime}</span>
                            </div>
                          </div>

                          {/* Title (Playfair Display) */}
                          <h4 className="font-serif text-xl sm:text-2xl font-bold leading-tight line-clamp-2 mb-3 text-black">
                            {art.title.replace('GAME START: ', '')}
                          </h4>

                          {/* Excerpt (Source Serif) */}
                          <p className="font-serif text-xs sm:text-sm text-neutral-600 mb-4 line-clamp-3 font-normal leading-relaxed">
                            {art.excerpt}
                          </p>

                          {/* Event Data Panel */}
                          {art.category === 'K-Pop' ? (
                            <div 
                              style={{ borderRadius: '0px' }}
                              className="p-3 bg-[#ecfeff] border-2 border-black my-3 font-mono text-xs shadow-[2px_2px_0px_#000000]"
                            >
                              <div className="flex items-center justify-between border-b border-black pb-1.5 mb-2 font-black uppercase tracking-wider text-black">
                                <span>LOC // Tokyo Dome Stadium</span>
                                <span className="bg-[#ffd60a] border border-black px-2 py-0.5 text-[10px]">
                                  PASS // 2026
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold text-neutral-700">
                                <div>
                                  <span>DATE // Jan 21 &amp; 22, 2026</span>
                                </div>
                                <div>
                                  <span className="text-[#d91470]">STATUS // ★ Certified Pass</span>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>

                        {/* Tags & Action Stats */}
                        <div className="pt-4 mt-4 border-t-2 border-black flex items-center justify-between font-mono text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            {art.tags.slice(0, 2).map((t, i) => (
                              <span 
                                key={i} 
                                style={{ borderRadius: '0px' }}
                                className="px-2.5 py-0.5 border border-black bg-[#fefce8] text-black text-[10px] font-black uppercase tracking-wider"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => toggleLike(art.id, art.likes)}
                              type="button"
                              className="inline-flex items-center gap-1.5 cursor-pointer bg-[#fdf2f8] border border-black px-2.5 py-1 text-black hover:bg-[#d91470] hover:text-white transition-colors"
                              title="Like"
                            >
                              <span className="text-[#d91470]">★</span>
                              <span className="font-bold">{likesCount}</span>
                            </button>

                            <button
                              onClick={() => toggleBookmarkArticle(art)}
                              type="button"
                              className={`inline-flex items-center gap-1 cursor-pointer border border-black px-2.5 py-1 text-xs font-bold transition-colors ${
                                bookmarkedArticles[art.id]
                                  ? 'bg-[#ccff00] text-black shadow-[1px_1px_0px_#000]'
                                  : 'bg-white text-black hover:bg-neutral-100'
                              }`}
                              title="Bookmark Article"
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${bookmarkedArticles[art.id] ? 'fill-black' : ''}`} />
                              <span>{bookmarkedArticles[art.id] ? 'SAVED' : 'SAVE'}</span>
                            </button>

                            <button
                              onClick={() => setSharingArticle(art)}
                              type="button"
                              className="inline-flex items-center gap-1 cursor-pointer bg-white border border-black px-2.5 py-1 text-black hover:bg-[#00f0ff] text-xs font-bold transition-colors"
                              title="Share Article"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>SHARE</span>
                            </button>

                            <div className="inline-flex items-center gap-1 text-black font-bold ml-auto">
                              <span>COMMENTS:</span>
                              <span className="font-black text-[#d91470]">{art.commentsCount}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* -------------------- COLUMN B: UPCOMING RELEASES (5 COLS) -------------------- */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-black">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold">//</span>
                <h3 className="font-serif text-2xl font-normal italic text-black">
                  Scheduled Drops
                </h3>
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest border border-black px-3 py-1">
                {filteredReleases.length} Drops
              </span>
            </div>

            {filteredReleases.length === 0 ? (
              <div 
                style={{ borderRadius: '0px' }}
                className="p-12 text-center bg-neutral-50 border-2 border-dashed border-black font-mono text-neutral-600 text-sm"
              >
                No upcoming drops scheduled in this category.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredReleases.map((rel) => {
                  const isReminded = remindedItems[rel.id];

                  return (
                    <div
                      key={rel.id}
                      style={{ borderRadius: '0px' }}
                      className="p-6 flex flex-col gap-4 group bg-white border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#ffd60a] transition-all duration-100"
                    >
                      {/* Top Header: Badge & Days Countdown */}
                      <div className="flex items-center justify-between gap-2.5 font-mono">
                        <span 
                          style={{ borderRadius: '0px' }}
                          className="px-3 py-1 text-[10.5px] font-black uppercase tracking-widest border-2 border-black bg-[#d91470] text-white shadow-[2px_2px_0px_#000]"
                        >
                          ★ {rel.badgeText || rel.status}
                        </span>

                        <div 
                          style={{ borderRadius: '0px' }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-black bg-[#ffd60a] text-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]"
                        >
                          <span>⚡</span>
                          <span>{rel.daysRemaining}d remaining</span>
                        </div>
                      </div>

                      {/* Main Release Info */}
                      <div className="flex items-start gap-5">
                        <div className="relative w-24 h-24 shrink-0 border-2 border-black overflow-hidden shadow-[2px_2px_0px_#000]">
                          <Image 
                            src={rel.coverImage} 
                            alt={rel.title}
                            fill
                            sizes="96px"
                            className="object-cover group-hover:scale-105 transition-all duration-300" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-mono text-[10px] font-black text-[#d91470] uppercase tracking-widest block mb-1">
                            {rel.category} // {rel.type}
                          </span>
                          <h4 className="font-serif text-lg font-bold text-black leading-snug line-clamp-2">
                            {rel.title}
                          </h4>
                          <p className="font-serif text-xs text-neutral-600 truncate mt-1">
                            {rel.creatorOrArtist}
                          </p>
                          <div className="flex items-baseline gap-2 mt-2 font-mono">
                            <span className="text-black text-lg font-black">
                              ${rel.priceUSD}
                            </span>
                            <span className="text-neutral-500 text-xs font-bold">
                              ({rel.priceVND.toLocaleString('vi-VN')} ₫)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Inclusions / Perks */}
                      {rel.perks && rel.perks.length > 0 && (
                        <div 
                          style={{ borderRadius: '0px' }}
                          className="bg-[#fefce8] p-3.5 border-2 border-black text-xs font-mono text-black flex flex-col gap-1.5 my-1 shadow-[2px_2px_0px_#000]"
                        >
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest pb-1 border-b border-black">
                            <span className="text-[#d91470]">INCLUSIONS &amp; SPECIFICATIONS:</span>
                            <span className="text-black font-bold">OFFICIAL DROP</span>
                          </div>
                          <div className="flex flex-col gap-1 text-[11px] pt-1">
                            {rel.perks.slice(0, 3).map((perk, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-2 truncate font-semibold">
                                <span className="w-1.5 h-1.5 bg-[#ff2e93] shrink-0" />
                                <span className="truncate">{perk}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons (Vibrant Y2K Pop) */}
                      <div className="flex items-center gap-3 pt-3 border-t-2 border-black font-mono">
                        <button
                          type="button"
                          onClick={() => handlePreOrder(rel)}
                          style={{ borderRadius: '0px' }}
                          className="flex-1 py-3 px-5 text-black text-xs font-black uppercase tracking-widest bg-[#ffd60a] border-2 border-black hover:bg-[#ff2e93] hover:text-white cursor-pointer transition-colors duration-100 shadow-[3px_3px_0px_#000000]"
                        >
                          [+ PRE-ORDER DROP]
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleReminder(rel.id)}
                          style={{ borderRadius: '0px' }}
                          className={`px-3 py-3 border-2 border-black text-xs font-black uppercase tracking-wider transition-colors duration-100 cursor-pointer shrink-0 shadow-[3px_3px_0px_#000000] ${
                            isReminded 
                              ? 'bg-[#d91470] text-white' 
                              : 'bg-[#00f0ff] text-black hover:bg-[#38bdf8]'
                          }`}
                          title={isReminded ? 'Reminder set' : 'Remind me'}
                        >
                          {isReminded ? '[ALERT ON]' : '[REMIND]'}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Vibrant Pop Y2K Section: VIP Priority Banner */}
            <div 
              style={{ borderRadius: '0px' }}
              className="mt-6 p-7 bg-[#ffd60a] text-black border-3 border-black shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div>
                <span className="font-mono text-[10.5px] font-black uppercase tracking-widest bg-[#d91470] text-white px-2.5 py-0.5 border border-black inline-block mb-1 shadow-[2px_2px_0px_#000]">
                  // FANDOM VIP ALLOCATION //
                </span>
                <h4 className="font-sans text-xl sm:text-2xl font-black uppercase tracking-tight text-black mt-1">
                  24-Hour Early Drop Allocation
                </h4>
                <p className="font-sans text-xs font-semibold text-neutral-800 mt-1 max-w-sm">
                  Priority allocation for signed vinyls, limited photocard boxes &amp; stage passes.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => alert('VIP membership pass requested!')}
                style={{ borderRadius: '0px' }}
                className="px-6 py-3 bg-[#d91470] hover:bg-[#be185d] text-white border-2 border-black font-mono text-xs font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-all shrink-0 self-start sm:self-center"
              >
                [CLAIM ACCESS →]
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* FAN-SUBMITTED CONTENT MODAL (Vibrant Pop Y2K) */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-mono">
          <div 
            style={{ borderRadius: '0px' }}
            className="bg-white max-w-xl w-full border-3 border-black shadow-[8px_8px_0px_#000000] overflow-hidden relative"
          >
            {/* Title Bar */}
            <div className="bg-[#ffd60a] px-5 py-3 border-b-3 border-black flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#ff2e93] border border-black" />
                <span className="font-black uppercase text-xs tracking-wider text-black">
                  ★ COMMUNITY EDITORIAL DESK ✦
                </span>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                style={{ borderRadius: '0px' }}
                className="px-2 py-0.5 border-2 border-black bg-white hover:bg-[#ff2e93] hover:text-white text-xs font-black cursor-pointer shadow-[1px_1px_0px_#000] transition-colors"
                title="Close"
              >
                [✕]
              </button>
            </div>

            <div className="p-7">
              <div className="mb-5">
                <h3 className="font-sans text-xl font-black uppercase text-black">
                  Submit Fan Dispatch or Review
                </h3>
                <p className="font-sans text-xs font-semibold text-neutral-600 mt-1">
                  Share concert memoirs, album unboxings, or fandom analyses with our global readership.
                </p>
              </div>

              <form onSubmit={handleFanSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label htmlFor="submit-article-title" className="font-black uppercase tracking-wider block mb-1">Title *</label>
                  <input
                    id="submit-article-title"
                    type="text"
                    required
                    placeholder="e.g. My Dinh Stadium 30,000 Fandom Experience..."
                    value={submitTitle}
                    onChange={(e) => setSubmitTitle(e.target.value)}
                    style={{ borderRadius: '0px' }}
                    className="w-full p-2.5 border-2 border-black focus:outline-none focus:border-[#ff2e93] bg-[#fdfbf7] font-medium text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="submit-article-category" className="font-black uppercase tracking-wider block mb-1">Category *</label>
                    <select
                      id="submit-article-category"
                      aria-label="Article Category"
                      value={submitCategory}
                      onChange={(e) => setSubmitCategory(e.target.value as any)}
                      style={{ borderRadius: '0px' }}
                      className="w-full p-2.5 border-2 border-black focus:outline-none focus:border-[#ff2e93] bg-[#fdfbf7] font-bold"
                    >
                      <option value="K-Pop">K-Pop</option>
                      <option value="Anime">Anime &amp; Manga</option>
                      <option value="Gaming">Gaming Arena</option>
                      <option value="Cosplay">Cosplay &amp; Streetwear</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="submit-article-author" className="font-black uppercase tracking-wider block mb-1">Author Pen Name *</label>
                    <input
                      id="submit-article-author"
                      type="text"
                      required
                      placeholder="e.g. Tokki Fan Club"
                      value={submitAuthor}
                      onChange={(e) => setSubmitAuthor(e.target.value)}
                      style={{ borderRadius: '0px' }}
                      className="w-full p-2.5 border-2 border-black focus:outline-none focus:border-[#ff2e93] bg-[#fdfbf7]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="submit-article-excerpt" className="font-black uppercase tracking-wider block mb-1">Short Excerpt *</label>
                  <textarea
                    id="submit-article-excerpt"
                    required
                    rows={2}
                    placeholder="Compelling 1-2 sentence lead paragraph..."
                    value={submitExcerpt}
                    onChange={(e) => setSubmitExcerpt(e.target.value)}
                    style={{ borderRadius: '0px' }}
                    className="w-full p-2.5 border-2 border-black focus:outline-none focus:border-[#ff2e93] bg-[#fdfbf7] text-xs resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="submit-article-image" className="font-black uppercase tracking-wider block mb-1">Cover Image URL</label>
                  <input
                    id="submit-article-image"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={submitImage}
                    onChange={(e) => setSubmitImage(e.target.value)}
                    style={{ borderRadius: '0px' }}
                    className="w-full p-2.5 border-2 border-black focus:outline-none focus:border-[#ff2e93] bg-[#fdfbf7]"
                  />
                </div>

                <div>
                  <label htmlFor="submit-article-tags" className="font-black uppercase tracking-wider block mb-1">Tags (Comma-separated)</label>
                  <input
                    id="submit-article-tags"
                    type="text"
                    placeholder="Concert, Review, NewJeans, Fandom"
                    value={submitTags}
                    onChange={(e) => setSubmitTags(e.target.value)}
                    style={{ borderRadius: '0px' }}
                    className="w-full p-2.5 border-2 border-black focus:outline-none focus:border-[#ff2e93] bg-[#fdfbf7]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-black">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    style={{ borderRadius: '0px' }}
                    className="px-4 py-2.5 border-2 border-black text-black hover:bg-neutral-100 font-black uppercase tracking-wider cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    style={{ borderRadius: '0px' }}
                    className="px-6 py-2.5 bg-[#d91470] text-white hover:bg-[#be185d] border-2 border-black font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-all"
                  >
                    [PUBLISH DISPATCH →]
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SRS 1.6: Interactive Article Sharing Modal */}
      {sharingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
          <div 
            style={{ borderRadius: '0px' }}
            className="bg-white max-w-md w-full border-3 border-black shadow-[8px_8px_0px_#000000] overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Window Bar */}
            <div className="bg-[#00f0ff] border-b-3 border-black px-4 py-2.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-black">
                <Share2 className="w-3.5 h-3.5" />
                <span>★ SHARE FANDOM DISPATCH ✦</span>
              </div>
              <button
                type="button"
                onClick={() => setSharingArticle(null)}
                style={{ borderRadius: '0px' }}
                className="bg-white text-black hover:bg-black hover:text-white px-2 py-0.5 border-2 border-black text-xs font-black cursor-pointer shadow-[1px_1px_0px_#000]"
              >
                [✕]
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Preview card */}
              <div className="p-3 bg-[#fdfbf7] border-2 border-black space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#d91470] block">
                  [{sharingArticle.category}] • {sharingArticle.author.name}
                </span>
                <h4 className="font-serif font-bold text-sm text-black line-clamp-2">
                  {sharingArticle.title}
                </h4>
                <p className="text-[11px] text-neutral-600 line-clamp-2 font-sans">
                  {sharingArticle.excerpt}
                </p>
              </div>

              {/* Direct Link Copy */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-600 uppercase block">DIRECT PASS LINK:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? `${window.location.origin}/#upcoming-releases?article=${sharingArticle.id}` : ''}
                    className="flex-1 text-xs px-2.5 py-2 bg-neutral-100 border-2 border-black font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyArticleLink(sharingArticle)}
                    style={{ borderRadius: '0px' }}
                    className="px-3 py-2 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'COPIED!' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-1.5 pt-2 border-t-2 border-dashed border-neutral-300">
                <span className="text-[10px] font-black uppercase text-neutral-600 block">BROADCAST TO SOCIAL:</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${sharingArticle.title}" on Fan Hub Plus!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black text-white text-center border-2 border-black hover:bg-neutral-800 text-decoration-none shadow-[2px_2px_0px_#000] block"
                  >
                    X / Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1877F2] text-white text-center border-2 border-black hover:opacity-90 text-decoration-none shadow-[2px_2px_0px_#000] block"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(sharingArticle.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#0088cc] text-white text-center border-2 border-black hover:opacity-90 text-decoration-none shadow-[2px_2px_0px_#000] block"
                  >
                    Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
