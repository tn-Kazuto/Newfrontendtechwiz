'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { mockAlbums } from '../data/mockData';
import { Album, FeaturedArticle } from '../types';
import { 
  ShieldCheck, 
  X, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  Plus, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  Pin,
  Star,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Layers,
  FileText,
  Search,
  Check,
  Eye,
  Calendar,
  Smartphone,
  Monitor,
  Tablet,
  Activity,
  Flame
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserReviewItem {
  id: string;
  userName: string;
  avatar: string;
  targetTitle: string;
  ratingType: 'star' | 'thumb';
  starScore?: number;
  isThumbUp?: boolean;
  comment: string;
  date: string;
  status: 'approved' | 'hidden';
}

const DEFAULT_MODERATION_ARTICLES: FeaturedArticle[] = [
  {
    id: 'fan-sub-001',
    title: 'Full Experience at NewJeans Tokyo Dome: A Futuristic Visual & Sonic Storm',
    excerpt: 'Firsthand review from VIP seats at Tokyo Dome featuring dynamic 3D spatial surround sound...',
    category: 'K-Pop',
    author: {
      name: 'Bunnies_Tokyo99',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'Fan Contributor ⭐',
    },
    date: 'Today 09:30',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    tags: ['NewJeans', 'Tokyo Dome', 'Live Experience'],
    badgeText: 'PENDING REVIEW ⏳',
    isHot: false,
    likes: 12,
    commentsCount: 3,
  },
  {
    id: 'fan-sub-002',
    title: 'In-Depth Analysis of aespa Metaverse Lore in Armageddon Comeback',
    excerpt: 'Revealing multiverse Easter eggs about Black Mamba and the awakening of the 4 ae-avatars...',
    category: 'Gaming',
    author: {
      name: 'CyberMY_Meta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      role: 'Lore Researcher 🧬',
    },
    date: 'Yesterday 21:15',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    tags: ['aespa', 'Metaverse', 'Armageddon'],
    badgeText: 'PENDING REVIEW ⏳',
    isHot: false,
    likes: 28,
    commentsCount: 7,
  }
];

const INITIAL_USER_REVIEWS: UserReviewItem[] = [
  {
    id: 'rev-01',
    userName: 'MinjiStan_VN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    targetTitle: 'NewJeans 2nd EP Get Up (Bunny Beach Bag Ver.)',
    ratingType: 'star',
    starScore: 5,
    comment: 'Superb photobook print quality, pristine unsealed CD disc. Early bird preorder arrived flawless, 10/10!',
    date: '26/09/2026',
    status: 'approved'
  },
  {
    id: 'rev-02',
    userName: 'KpopCollector_9x',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    targetTitle: 'aespa Armageddon CD Player Edition',
    ratingType: 'thumb',
    isThumbUp: true,
    comment: 'The portable CD player sounds remarkably rich with deep bass and high-end 3.5mm jack support.',
    date: '25/09/2026',
    status: 'approved'
  },
  {
    id: 'rev-03',
    userName: 'Spam_Bot_Account',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    targetTitle: 'BTS Proof (Collector Edition Boxset)',
    ratingType: 'star',
    starScore: 1,
    comment: 'Click here for free reward offers at abcxyz.com to claim gifts today...',
    date: '24/09/2026',
    status: 'hidden'
  }
];

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  // Tabs: 'catalog' | 'moderation' | 'analytics'
  const [activeTab, setActiveTab] = useState<'catalog' | 'moderation' | 'analytics'>('catalog');

  // Tab 1: Catalog State
  const [albums, setAlbums] = useState<Album[]>(mockAlbums);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('NewJeans');
  const [newPrice, setNewPrice] = useState(25);
  const [newStock, setNewStock] = useState(50);
  const [newTag, setNewTag] = useState<Album['tag']>('Pre-Order');

  // Tab 2: Moderation State
  const [moderationArticles, setModerationArticles] = useState<FeaturedArticle[]>([]);
  const [userReviews, setUserReviews] = useState<UserReviewItem[]>(INITIAL_USER_REVIEWS);
  const [moderationType, setModerationType] = useState<'articles' | 'reviews'>('articles');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Tab 3: Analytics Filter
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'today' | '7d' | '30d'>('7d');

  // Load articles from localStorage on mount/open
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('fanhub_fan_articles');
        if (saved) {
          const parsed: FeaturedArticle[] = JSON.parse(saved);
          // Combine stored articles with default samples ensuring no ID collision
          const ids = new Set(parsed.map(p => p.id));
          const merged = [...parsed, ...DEFAULT_MODERATION_ARTICLES.filter(d => !ids.has(d.id))];
          setModerationArticles(merged);
        } else {
          setModerationArticles(DEFAULT_MODERATION_ARTICLES);
        }
      } catch {
        setModerationArticles(DEFAULT_MODERATION_ARTICLES);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Add new album to catalog
  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Album = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      artist: newArtist,
      artistId: newArtist.toLowerCase().replace(/\s+/g, ''),
      priceUSD: newPrice,
      priceVND: newPrice * 25000,
      coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
      galleryImages: [],
      type: 'Mini Album',
      releaseDate: new Date().toISOString().split('T')[0],
      tag: newTag,
      rating: 5.0,
      reviewCount: 1,
      popularityScore: 90,
      stock: newStock,
      description: `Official first-press release of ${newTitle} by ${newArtist}.`,
      versions: [{ id: 'std', name: 'Standard Edition', extraPriceUSD: 0 }],
      inclusions: ['Photobook', 'Photocard (1 of 4)', 'CD-R'],
      photocards: [],
      tracks: [{ id: 1, title: 'Title Track Comeback', duration: '3:15', isTitleTrack: true }],
      reviews: [],
    };

    setAlbums([created, ...albums]);
    setNewTitle('');
    setIsAdding(false);
    showToast(`Added album "${newTitle}" to database successfully!`);
  };

  const handleDeleteAlbum = (id: string) => {
    setAlbums((prev) => prev.filter((a) => a.id !== id));
    showToast('Removed release from catalog.');
  };

  // Moderation handlers
  const handleApproveArticle = (articleId: string) => {
    const updated = moderationArticles.map(art => {
      if (art.id === articleId) {
        return { ...art, badgeText: 'APPROVED ⭐' };
      }
      return art;
    });
    setModerationArticles(updated);
    localStorage.setItem('fanhub_fan_articles', JSON.stringify(updated));
    showToast('Approved and published article to community feed!');
  };

  const handlePinArticle = (articleId: string) => {
    const updated = moderationArticles.map(art => {
      if (art.id === articleId) {
        const nextHot = !art.isHot;
        return { 
          ...art, 
          isHot: nextHot, 
          badgeText: nextHot ? 'PINNED TO HOME 🔥' : 'APPROVED ⭐' 
        };
      }
      return art;
    });
    setModerationArticles(updated);
    localStorage.setItem('fanhub_fan_articles', JSON.stringify(updated));
    showToast('Updated featured pin status for article!');
  };

  const handleRejectArticle = (articleId: string) => {
    const updated = moderationArticles.map(art => {
      if (art.id === articleId) {
        return { ...art, badgeText: 'REJECTED ❌' };
      }
      return art;
    });
    setModerationArticles(updated);
    localStorage.setItem('fanhub_fan_articles', JSON.stringify(updated));
    showToast('Rejected article submission.');
  };

  const handleDeleteArticle = (articleId: string) => {
    const updated = moderationArticles.filter(art => art.id !== articleId);
    setModerationArticles(updated);
    localStorage.setItem('fanhub_fan_articles', JSON.stringify(updated));
    showToast('Permanently deleted article.');
  };

  const handleToggleReviewStatus = (reviewId: string) => {
    setUserReviews(prev => prev.map(rev => {
      if (rev.id === reviewId) {
        const nextStatus = rev.status === 'approved' ? 'hidden' : 'approved';
        return { ...rev, status: nextStatus };
      }
      return rev;
    }));
    showToast('Updated review visibility status!');
  };

  // Filtered albums in catalog
  const filteredAlbums = useMemo(() => {
    if (!catalogSearch.trim()) return albums;
    const q = catalogSearch.toLowerCase();
    return albums.filter(a => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q));
  }, [albums, catalogSearch]);

  const pendingArticlesCount = moderationArticles.filter(a => a.badgeText?.includes('PENDING')).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        style={{ borderRadius: '12px' }}
      >
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Admin Control Panel</h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold">
                  Root Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Manage catalog, moderate fandom submissions & real-time analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-all shadow-xs"
            >
              <span>Full Admin Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              type="button"
              aria-label="Close admin control panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Action Toast */}
        {actionNotice && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            type="button"
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-sky-600 text-sky-600 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Catalog & Releases</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
              {albums.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            type="button"
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'moderation'
                ? 'border-sky-600 text-sky-600 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Submissions & Reviews</span>
            {pendingArticlesCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-mono font-bold animate-pulse">
                {pendingArticlesCount} pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            type="button"
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-sky-600 text-sky-600 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Traffic Analytics</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-mono font-bold">
              1.28M views
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">

          {/* ================= TAB 1: CONTENT CATALOG ================= */}
          {activeTab === 'catalog' && (
            <div className="space-y-5">
              {/* Quick Stats Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-[11px] text-slate-500 font-bold uppercase mb-1">Total Releases</div>
                  <div className="text-xl font-black text-slate-900">{albums.length}</div>
                  <div className="text-[10px] text-sky-600 font-medium">Mini Album, Full & Single</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-[11px] text-slate-500 font-bold uppercase mb-1">Pre-Orders</div>
                  <div className="text-xl font-black text-amber-600">
                    {albums.filter(a => a.tag === 'Pre-Order').length}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Includes First-Press gifts</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-[11px] text-slate-500 font-bold uppercase mb-1">Limited Edition</div>
                  <div className="text-xl font-black text-indigo-600">
                    {albums.filter(a => a.tag === 'Limited Edition').length}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Limited Boxset & CD Player</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-[11px] text-slate-500 font-bold uppercase mb-1">Total Stock</div>
                  <div className="text-xl font-black text-emerald-600">
                    {albums.reduce((acc, curr) => acc + (curr.stock || 0), 0)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Hanteo Chart Family</div>
                </div>
              </div>

              {/* Action & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-lg">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search album, artist..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAdding(!isAdding)}
                    type="button"
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Release</span>
                  </button>
                </div>
              </div>

              {/* Add New Album Form */}
              {isAdding && (
                <form onSubmit={handleAddNew} className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Add Album / Merchandise to Catalog</h4>
                    <span className="text-[11px] text-slate-500">Standard release format</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Release Title</label>
                      <input
                        type="text"
                        required
                        placeholder="vd: Supernatural (Single)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Artist / Fandom</label>
                      <select
                        value={newArtist}
                        onChange={(e) => setNewArtist(e.target.value)}
                        aria-label="Artist or Fandom"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                      >
                        <option value="NewJeans">NewJeans</option>
                        <option value="BLACKPINK">BLACKPINK</option>
                        <option value="BTS">BTS</option>
                        <option value="Stray Kids">Stray Kids</option>
                        <option value="IVE">IVE</option>
                        <option value="aespa">aespa</option>
                        <option value="Solo Leveling">Solo Leveling</option>
                        <option value="Genshin Impact">Genshin Impact</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Reference Price ($ USD)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        aria-label="Reference Price in USD"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Category / Tag</label>
                      <select
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value as any)}
                        aria-label="Category Tag"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                      >
                        <option value="Pre-Order">Pre-Order</option>
                        <option value="Limited Edition">Limited Edition</option>
                        <option value="Hot Seller">Hot Seller</option>
                        <option value="Restocked">Restocked</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                    >
                      Save Release
                    </button>
                  </div>
                </form>
              )}

              {/* Catalog Inventory Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3.5">Release & Artist</th>
                        <th className="py-3 px-3.5">Reference Price</th>
                        <th className="py-3 px-3.5">Estimated Stock</th>
                        <th className="py-3 px-3.5">Tag Status</th>
                        <th className="py-3 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAlbums.map((alb) => (
                        <tr key={alb.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-slate-900">{alb.title}</div>
                            <div className="text-[11px] text-sky-700 font-medium">{alb.artist} • {alb.type}</div>
                          </td>
                          <td className="py-3 px-3.5 font-bold text-slate-900 font-mono">
                            ${alb.priceUSD.toFixed(2)}
                            <span className="text-[10px] text-slate-400 font-normal block">
                              {(alb.priceVND || alb.priceUSD * 25000).toLocaleString('vi-VN')}₫
                            </span>
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                              {alb.stock} units
                            </span>
                          </td>
                          <td className="py-3 px-3.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                alb.tag === 'Limited Edition'
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                  : alb.tag === 'Pre-Order'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {alb.tag}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-right">
                            <button
                              onClick={() => handleDeleteAlbum(alb.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Delete release"
                              type="button"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: MODERATION QUEUE ================= */}
          {activeTab === 'moderation' && (
            <div className="space-y-5">
              {/* Moderation Sub-toggle */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModerationType('articles')}
                    type="button"
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                      moderationType === 'articles'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    📰 Fan Submissions ({moderationArticles.length})
                  </button>
                  <button
                    onClick={() => setModerationType('reviews')}
                    type="button"
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                      moderationType === 'reviews'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    💬 User Reviews & Feedback ({userReviews.length})
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  Auto-saves and syncs with system cache
                </div>
              </div>

              {/* Sub-Panel 1: Articles Moderation */}
              {moderationType === 'articles' && (
                <div className="space-y-4">
                  {moderationArticles.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-slate-200 rounded-xl text-slate-500 text-xs">
                      No pending articles in review queue.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3.5">
                      {moderationArticles.map((art) => {
                        const isPending = art.badgeText?.includes('PENDING');
                        const isApproved = art.badgeText?.includes('APPROVED') || art.badgeText?.includes('PINNED');
                        const isRejected = art.badgeText?.includes('REJECTED');

                        return (
                          <div
                            key={art.id}
                            className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-3.5 flex-1 min-w-0">
                              <img
                                src={art.coverImage}
                                alt={art.title}
                                className="w-20 h-16 rounded-lg object-cover shrink-0 border border-slate-100"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                                    {art.category}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                      isPending
                                        ? 'bg-amber-100 text-amber-800'
                                        : isApproved
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {art.badgeText || 'FAN SUBMISSION'}
                                  </span>
                                  {art.isHot && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 flex items-center gap-1">
                                      <Flame className="w-3 h-3 text-indigo-600" />
                                      <span>Featured</span>
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-400">{art.date}</span>
                                </div>

                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                  {art.title}
                                </h4>
                                <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                                  {art.excerpt}
                                </p>

                                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                                  <span>Author: <strong>{art.author.name}</strong> ({art.author.role})</span>
                                  <span>•</span>
                                  <span>Tags: {art.tags.join(', ')}</span>
                                </div>
                              </div>
                            </div>

                            {/* Moderation Action Buttons */}
                            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                              {/* Approve Button */}
                              <button
                                onClick={() => handleApproveArticle(art.id)}
                                type="button"
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                                title="Approve article"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>

                              {/* Pin Button */}
                              <button
                                onClick={() => handlePinArticle(art.id)}
                                type="button"
                                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                                  art.isHot 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                                }`}
                                title="Pin to top"
                              >
                                <Pin className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Ghim</span>
                              </button>

                              {/* Reject Button */}
                              <button
                                onClick={() => handleRejectArticle(art.id)}
                                type="button"
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                                title="Reject submission"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Reject</span>
                              </button>

                              {/* Delete Permanently */}
                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                type="button"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                title="Delete article"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-Panel 2: User Reviews Moderation */}
              {moderationType === 'reviews' && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/70 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3.5">User</th>
                          <th className="py-3 px-3.5">Release / Media</th>
                          <th className="py-3 px-3.5">Rating</th>
                          <th className="py-3 px-3.5">Review Content</th>
                          <th className="py-3 px-3.5">Status</th>
                          <th className="py-3 px-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {userReviews.map((rev) => (
                          <tr key={rev.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-2">
                                <img
                                  src={rev.avatar}
                                  alt={rev.userName}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <div>
                                  <div className="font-bold text-slate-900">{rev.userName}</div>
                                  <div className="text-[10px] text-slate-400">{rev.date}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3.5 font-medium text-slate-800 max-w-[160px] truncate">
                              {rev.targetTitle}
                            </td>
                            <td className="py-3 px-3.5">
                              {rev.ratingType === 'star' ? (
                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span>{rev.starScore}/5</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-emerald-600 font-bold">
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>Helpful</span>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3.5 text-slate-600 max-w-[280px]">
                              {rev.comment}
                            </td>
                            <td className="py-3 px-3.5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  rev.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {rev.status === 'approved' ? 'Public' : 'Hidden'}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-right">
                              <button
                                onClick={() => handleToggleReviewStatus(rev.id)}
                                type="button"
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-colors ${
                                  rev.status === 'approved'
                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {rev.status === 'approved' ? 'Hide Review' : 'Restore'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: VISITOR ANALYTICS & TELEMETRY ================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Telemetry Filter Buttons */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Traffic & User Behavior Analytics</h4>
                  <p className="text-[11px] text-slate-500">Real-time CDN metrics across global nodes</p>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-lg text-xs">
                  <button
                    onClick={() => setAnalyticsTimeframe('today')}
                    type="button"
                    className={`px-3 py-1 font-bold rounded cursor-pointer transition-all ${
                      analyticsTimeframe === 'today' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setAnalyticsTimeframe('7d')}
                    type="button"
                    className={`px-3 py-1 font-bold rounded cursor-pointer transition-all ${
                      analyticsTimeframe === '7d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => setAnalyticsTimeframe('30d')}
                    type="button"
                    className={`px-3 py-1 font-bold rounded cursor-pointer transition-all ${
                      analyticsTimeframe === '30d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Last 30 Days
                  </button>
                </div>
              </div>

              {/* 4 Core Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase mb-2">
                    <span>Total Pageviews</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">1,280,450</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">↑ +18.4% vs last month</div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase mb-2">
                    <span>Unique Visitors</span>
                    <Users className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">142,850</div>
                  <div className="text-[10px] text-sky-600 font-semibold mt-1">45+ countries active</div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase mb-2">
                    <span>Currently Online</span>
                    <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono flex items-center gap-2">
                    <span>842</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-1">Streaming & RSVP queuing</div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase mb-2">
                    <span>Session Duration</span>
                    <Calendar className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">6m 45s</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">Low bounce rate 21.2%</div>
                </div>
              </div>

              {/* 7-Day Trend Visual Chart */}
              <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xs font-bold text-slate-900 uppercase">
                    7-Day Traffic Velocity Trend
                  </h5>
                  <span className="text-[11px] text-slate-500">Unit: Thousand Views (K Pageviews)</span>
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-6 border-b border-slate-200">
                  {[
                    { day: 'Mon', val: 125, height: '44%' },
                    { day: 'Tue', val: 138, height: '48%' },
                    { day: 'Wed', val: 154, height: '54%' },
                    { day: 'Thu', val: 148, height: '52%' },
                    { day: 'Fri', val: 182, height: '64%' },
                    { day: 'Sat', val: 245, height: '85%' },
                    { day: 'Sun', val: 288, height: '100%' },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">
                        {bar.val}K
                      </span>
                      <div
                        className="w-full rounded-t-md transition-all duration-300 group-hover:brightness-110 cursor-pointer"
                        style={{
                          height: bar.height,
                          backgroundColor: idx >= 5 ? '#0284c7' : '#0f172a',
                        }}
                      ></div>
                      <span className="text-[10px] font-medium text-slate-600 mt-2 truncate w-full text-center">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown Grid: Routes vs Devices vs Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Pageviews by Route */}
                <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
                  <h5 className="text-xs font-bold text-slate-900 uppercase mb-3 flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-sky-600" />
                    <span>Views by Page</span>
                  </h5>
                  <div className="space-y-2.5">
                    {[
                      { route: '/multimedia (Media Center)', pct: 38, count: '486.5K' },
                      { route: '/ (Home & Feed)', pct: 32, count: '409.7K' },
                      { route: '/event (GPS Radar & Tour)', pct: 16, count: '204.8K' },
                      { route: '/cd-dvd-book (Physical)', pct: 9, count: '115.2K' },
                      { route: '/md (Official Merchandise)', pct: 5, count: '64.2K' },
                    ].map((r, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-slate-800">{r.route}</span>
                          <span className="font-mono text-slate-500 font-bold">{r.count} ({r.pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-sky-600 h-full rounded-full" style={{ width: `${r.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Device Breakdown */}
                <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
                  <h5 className="text-xs font-bold text-slate-900 uppercase mb-3 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Device Breakdown</span>
                  </h5>
                  <div className="space-y-3">
                    <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-slate-600" />
                        <div>
                          <div className="font-bold text-xs text-slate-900">Mobile (iOS / Android)</div>
                          <div className="text-[10px] text-slate-500">Optimized touch & gesture flow</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-slate-900">68%</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-slate-600" />
                        <div>
                          <div className="font-bold text-xs text-slate-900">Desktop / Laptop</div>
                          <div className="text-[10px] text-slate-500">Chrome, Safari, Edge</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-slate-900">26%</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tablet className="w-4 h-4 text-slate-600" />
                        <div>
                          <div className="font-bold text-xs text-slate-900">Tablet / iPad</div>
                          <div className="text-[10px] text-slate-500">Fandom fan-art view</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-slate-900">6%</span>
                    </div>
                  </div>
                </div>

                {/* 3. Top Fandom Search Keywords */}
                <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
                  <h5 className="text-xs font-bold text-slate-900 uppercase mb-3 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-amber-500" />
                    <span>Top Fandom Queries</span>
                  </h5>
                  <div className="space-y-2">
                    {[
                      { query: 'NewJeans Supernatural Limited', count: '42.1K' },
                      { query: 'aespa Armageddon CD Player', count: '35.8K' },
                      { query: 'BTS Monograph Boxset', count: '28.4K' },
                      { query: 'Stadium Live Concert Tour 2026', count: '19.2K' },
                      { query: 'Solo Leveling OST Soundtrack', count: '15.7K' },
                    ].map((k, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-4 font-mono font-bold text-slate-400 text-[10px]">0{idx + 1}</span>
                          <span className="text-slate-800 font-medium truncate">{k.query}</span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                          {k.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
