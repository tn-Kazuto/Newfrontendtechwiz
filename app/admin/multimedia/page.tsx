'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import {
  Tv,
  Radio,
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  Sparkles,
  Sliders,
  Filter,
  Play,
  Volume2,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Check,
  X,
  Copy,
  Clock,
  LayoutGrid,
  List
} from 'lucide-react';
import { INITIAL_MEDIA_ITEMS, MediaItem, MediaType, FandomCategory } from '../../../data/multimediaData';

export default function AdminMultimediaPage() {
  const { language } = useAdminLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState('multimedia');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<FandomCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Media list state (initialized from multimediaData)
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formArtist, setFormArtist] = useState('');
  const [formType, setFormType] = useState<MediaType>('trailer');
  const [formCategory, setFormCategory] = useState<FandomCategory>('K-Pop');
  const [formDuration, setFormDuration] = useState('03:45');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formAudioUrl, setFormAudioUrl] = useState('');
  const [formTags, setFormTags] = useState('4K HDR, Dolby Atmos');
  const [formDescription, setFormDescription] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered media
  const filteredList = useMemo(() => {
    return mediaList.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchType = typeFilter === 'all' || item.type === typeFilter;
      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchSearch && matchType && matchCategory;
    });
  }, [mediaList, searchQuery, typeFilter, categoryFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalViews = mediaList.reduce((acc, curr) => acc + curr.views, 0);
    const avgRating = (mediaList.reduce((acc, curr) => acc + (curr.rating?.average || 5.0), 0) / (mediaList.length || 1)).toFixed(1);
    const totalTrailers = mediaList.filter((m) => m.type === 'trailer').length;
    const totalAudio = mediaList.filter((m) => m.type === 'soundtrack' || m.type === 'podcast').length;
    return { totalViews, avgRating, totalTrailers, totalAudio };
  }, [mediaList]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormArtist('');
    setFormType('trailer');
    setFormCategory('K-Pop');
    setFormDuration('03:45');
    setFormThumbnail('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80');
    setFormUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    setFormAudioUrl('');
    setFormTags('4K HDR, Official Release, Dolby Atmos');
    setFormDescription('Official master audio-visual stream recorded for the global fandom universe.');
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MediaItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormArtist(item.artist);
    setFormType(item.type);
    setFormCategory(item.category);
    setFormDuration(item.duration);
    setFormThumbnail(item.thumbnailUrl);
    setFormUrl(item.embedUrl || '');
    setFormAudioUrl(item.audioUrl || '');
    setFormTags(item.tags.join(', '));
    setFormDescription(item.description);
    setIsAddEditModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingItem) {
      // Update
      setMediaList((prev) =>
        prev.map((m) =>
          m.id === editingItem.id
            ? {
              ...m,
              title: formTitle,
              artist: formArtist,
              type: formType,
              category: formCategory,
              duration: formDuration,
              thumbnailUrl: formThumbnail,
              embedUrl: formUrl || undefined,
              audioUrl: formAudioUrl || undefined,
              tags: tagArray,
              description: formDescription,
            }
            : m
        )
      );
      showToast(isEn ? 'Media updated successfully.' : 'Đã cập nhật media thành công.');
    } else {
      // Add New
      const newItem: MediaItem = {
        id: `media-adm-${Date.now()}`,
        title: formTitle,
        artist: formArtist,
        type: formType,
        category: formCategory,
        duration: formDuration,
        durationSeconds: 210,
        thumbnailUrl: formThumbnail,
        embedUrl: formUrl || undefined,
        audioUrl: formAudioUrl || undefined,
        views: Math.floor(Math.random() * 20000) + 5000,
        releaseDate: new Date().toISOString().split('T')[0],
        description: formDescription,
        tags: tagArray,
        rating: {
          average: 5.0,
          count: 1,
          distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
          thumbsUp: 45,
          thumbsDown: 1,
        },
      };
      setMediaList((prev) => [newItem, ...prev]);
      showToast(isEn ? 'New media stream added successfully.' : 'Đã thêm media mới vào kho lưu trữ.');
    }
    setIsAddEditModalOpen(false);
  };

  // Delete Media
  const handleDeleteMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
    setDeletingId(null);
    showToast(isEn ? 'Media deleted from library.' : 'Đã xóa media khỏi hệ thống.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex text-slate-900 dark:text-slate-100">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 bg-emerald-500 text-white font-bold text-sm rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Top Header & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Link href="/admin" className="hover:underline">Admin</Link>
                <span>/</span>
                <span className="text-slate-900 dark:text-slate-200 font-semibold">
                  {isEn ? 'Multimedia Content' : 'Quản lý Đa phương tiện'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <Tv className="w-7 h-7 text-indigo-500" />
                <span>{isEn ? 'Interactive Multimedia Center' : 'Trung Tâm Quản Trị Đa Phương Tiện'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Manage 4K cinematic trailers, 24-bit lossless audio tracks, studio podcasts, animated explainers and tagging.'
                  : 'Kiểm soát trailer 4K HDR, nhạc lossless 24-bit, studio podcast, đánh giá cộng đồng và hệ thống gắn thẻ tag.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isEn ? 'Add Media Stream' : 'Thêm Media Mới'}</span>
              </button>
            </div>
          </div>

          {/* Stat KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">
                {isEn ? 'Total Streams' : 'Tổng số bài media'}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {mediaList.length}
              </div>
              <span className="text-[11px] text-indigo-500 font-semibold flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3" />
                <span>{stats.totalTrailers} Video 4K • {stats.totalAudio} Audio</span>
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">
                {isEn ? 'Total Play Views' : 'Tổng lượt phát sóng'}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {stats.totalViews.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
                <Play className="w-3 h-3" />
                <span>+12.8% tuần này</span>
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">
                {isEn ? 'Audience Rating' : 'Đánh giá người dùng'}
              </span>
              <div className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{stats.avgRating} / 5.0</span>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold block mt-1">
                SRS Thumbs Up/Down verified
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">
                {isEn ? 'Storage Codec' : 'Chuẩn nén & Codec'}
              </span>
              <div className="text-2xl font-black text-cyan-600 mt-1">
                AV1 / FLAC
              </div>
              <span className="text-[11px] text-cyan-500 font-semibold flex items-center gap-1 mt-1">
                <Volume2 className="w-3 h-3" />
                <span>24-bit 96kHz Master</span>
              </span>
            </div>
          </div>

          {/* Search, Filter Bar and View Mode */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 w-full">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isEn ? 'Search title, artist, tag...' : 'Tìm tên bài, nghệ sĩ, tag...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">{isEn ? 'All Formats' : 'Tất cả định dạng'}</option>
                  <option value="trailer">Trailer 4K HDR</option>
                  <option value="soundtrack">Lossless Soundtrack</option>
                  <option value="podcast">Studio Podcast</option>
                  <option value="backstage">Behind The Scenes</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">{isEn ? 'All Universes' : 'Tất cả vũ trụ'}</option>
                  <option value="K-Pop">K-Pop</option>
                  <option value="Anime">Anime</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Movies">Movies</option>
                  <option value="TV Shows">TV Shows</option>
                  <option value="Comics">Comics</option>
                  <option value="Manga">Manga</option>
                  <option value="Cosplay">Cosplay</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs cursor-pointer ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs cursor-pointer ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media Items Table / Grid */}
          {filteredList.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <Tv className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                {isEn ? 'No multimedia stream found' : 'Không tìm thấy media nào'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn ? 'Try adjusting your search query or filters.' : 'Thử đổi từ khóa hoặc bộ lọc thể loại.'}
              </p>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">{isEn ? 'Media Item' : 'Nội dung Media'}</th>
                    <th className="py-3.5 px-3">{isEn ? 'Format & Type' : 'Định dạng'}</th>
                    <th className="py-3.5 px-3">{isEn ? 'Category' : 'Vũ trụ'}</th>
                    <th className="py-3.5 px-3">{isEn ? 'Tags' : 'Thẻ phân loại (Tags)'}</th>
                    <th className="py-3.5 px-3">{isEn ? 'Rating / Feedback' : 'Đánh giá'}</th>
                    <th className="py-3.5 px-3">{isEn ? 'Views' : 'Lượt xem'}</th>
                    <th className="py-3.5 px-4 text-right">{isEn ? 'Actions' : 'Thao tác'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Media Title & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-14 h-10 object-cover rounded-md border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white truncate block max-w-xs">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium block">
                              {item.artist} • {item.duration}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Format Badge */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.type === 'trailer'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : item.type === 'soundtrack'
                              ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                          {item.type}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {item.category}
                      </td>

                      {/* Tags */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {item.tags.slice(0, 2).map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded font-mono"
                            >
                              {t}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{item.tags.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Rating & Thumbs */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {(item.rating?.average || 5.0).toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-400">({(item.rating as any)?.count || (item.rating as any)?.totalVotes || 1})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-0.5 text-emerald-600">
                            <ThumbsUp className="w-2.5 h-2.5" /> {(item.rating as any)?.thumbsUp || 20}
                          </span>
                          <span className="flex items-center gap-0.5 text-rose-500">
                            <ThumbsDown className="w-2.5 h-2.5" /> {(item.rating as any)?.thumbsDown || 0}
                          </span>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {item.views.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyId(item.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Copy ID"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(item.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col group hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold rounded">
                        {item.type.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-600/90 text-white text-[10px] font-bold rounded">
                        {item.category}
                      </span>
                    </div>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded">
                      {item.duration}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {item.artist}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-mono text-slate-600 dark:text-slate-300 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{(item.rating?.average || 5.0).toFixed(1)}</span>
                        <span className="text-slate-400 text-[10px]">({item.views.toLocaleString()} views)</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(item.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Media Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {editingItem ? (isEn ? 'Edit Media Stream' : 'Chỉnh Sửa Media') : (isEn ? 'Add New Media Stream' : 'Thêm Media Mới')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="p-5 space-y-4 text-xs">
              {/* Title & Artist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {isEn ? 'Title / Track Name:' : 'Tiêu đề / Tên bài:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Supernatural 4K Music Video"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {isEn ? 'Artist / Creator:' : 'Nghệ sĩ / Nhà phát hành:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formArtist}
                    onChange={(e) => setFormArtist(e.target.value)}
                    placeholder="e.g. NewJeans"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Format & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {isEn ? 'Format Type:' : 'Định dạng:'}
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-slate-100"
                  >
                    <option value="trailer">Trailer 4K HDR</option>
                    <option value="soundtrack">Lossless Soundtrack</option>
                    <option value="podcast">Studio Podcast</option>
                    <option value="backstage">Behind The Scenes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {isEn ? 'Universe Category:' : 'Vũ trụ Fandom:'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-slate-100"
                  >
                    <option value="K-Pop">K-Pop</option>
                    <option value="Anime">Anime</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Movies">Movies</option>
                    <option value="TV Shows">TV Shows</option>
                    <option value="Comics">Comics</option>
                    <option value="Manga">Manga</option>
                    <option value="Cosplay">Cosplay</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {isEn ? 'Duration (MM:SS):' : 'Thời lượng:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="03:45"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? 'Thumbnail Image URL:' : 'Đường dẫn ảnh bìa / Thumbnail:'}
                </label>
                <input
                  type="url"
                  required
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Stream Video URL & Audio URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {isEn ? 'Video Stream URL (MP4/HLS):' : 'Đường dẫn Video:'}
                  </label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://...mp4"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {isEn ? 'Audio Stream URL (MP3/FLAC):' : 'Đường dẫn Audio:'}
                  </label>
                  <input
                    type="url"
                    value={formAudioUrl}
                    onChange={(e) => setFormAudioUrl(e.target.value)}
                    placeholder="https://...mp3"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? 'Metadata Tags (comma-separated):' : 'Thẻ phân loại tags (cách nhau dấu phẩy):'}
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="4K HDR, Dolby Atmos, Behind The Scenes"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? 'Description / Audio-Visual Notes:' : 'Mô tả nội dung / Ghi chú phát sóng:'}
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold transition-colors cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Hủy bỏ'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm transition-all cursor-pointer"
                >
                  {editingItem ? (isEn ? 'Save Changes' : 'Lưu Thay Đổi') : (isEn ? 'Create Media' : 'Tạo Mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                {isEn ? 'Delete Media Stream?' : 'Xác nhận xóa media?'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {isEn ? 'This stream will be removed from the public library.' : 'Mục này sẽ bị xóa khỏi kho lưu trữ công cộng.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Hủy'}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMedia(deletingId)}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer"
              >
                {isEn ? 'Confirm Delete' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
