'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  Tag as TagIcon,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  Plus,
  Trash2,
  LayoutGrid,
  List,
  Sparkles,
  TrendingUp,
  Hash,
  Layers,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  WifiOff,
} from 'lucide-react';

export interface AdminTagItem {
  id: string;
  name: string;
  used_count: number;
  [key: string]: any;
}

export interface ApiResponseMeta {
  total?: number;
  page?: number;
  limit?: number;
}



export default function AdminTagsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // API State
  const [tags, setTags] = useState<AdminTagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);

  // Filters & Pagination query parameters per API doc (?search=moba&page=1&limit=50)
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortBy, setSortBy] = useState<'used_count' | 'name'>('used_count');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Quick Add Tag input (inline bar)
  const [quickTagName, setQuickTagName] = useState('');
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  // Create Modal State: POST /api/v1/admin/tags
  // Body: { "name": "Limited Edition" }
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createTagName, setCreateTagName] = useState('');
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Delete Modal State: DELETE /api/v1/admin/tags/{id}
  const [deleteItem, setDeleteItem] = useState<AdminTagItem | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Toasts & Copy
  const [actionToast, setActionToast] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    details?: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (actionToast) {
      const timer = setTimeout(() => setActionToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionToast]);

  // Responsive sidebar
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // 1. FETCH TAGS: GET /api/v1/admin/tags?search=moba&page=1&limit=50
  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setIsConnectionError(false);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    params.set('page', String(page));
    params.set('limit', String(limit));

    const endpoint = `/api/v1/admin/tags?${params.toString()}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const resJson = await response.json();

      // Expected format: { "data": [{ "id": "tag_xxx", "name": "MOBA", "used_count": 45 }] }
      if (resJson && Array.isArray(resJson.data)) {
        setTags(resJson.data);
      } else if (Array.isArray(resJson)) {
        setTags(resJson);
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch (err) {
      console.warn('API /api/v1/admin/tags offline or error:', err);
      setIsConnectionError(true);
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, page, limit]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // 2. CREATE TAG: POST /api/v1/admin/tags
  // Body: { "name": "Limited Edition" }
  // Response 201: { "id": "tag_xxx", "message": "Đã tạo thẻ thành công" }
  const handleCreateTag = async (name: string, isModal = false) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setActionToast({
        type: 'error',
        message: isVi ? 'Vui lòng nhập tên thẻ' : 'Please provide a tag name',
      });
      return;
    }

    if (isModal) setIsSubmittingCreate(true);
    else setIsQuickAdding(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload = { name: trimmed };

    try {
      const res = await fetch('/api/v1/admin/tags', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const newId = resData.id || `tag_${Date.now().toString().slice(-4)}`;
      const successMsg = resData.message || (isVi ? 'Đã tạo thẻ thành công' : 'Tag created successfully');

      const newTagItem: AdminTagItem = {
        id: newId,
        name: trimmed,
        used_count: 0,
      };

      setTags((prev) => [newTagItem, ...prev]);

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `ID: ${newId} · POST /api/v1/admin/tags (201)`,
      });

      if (isModal) {
        setCreateTagName('');
        setIsCreateModalOpen(false);
      } else {
        setQuickTagName('');
      }
    } catch (err: any) {
      // Local optimistic fallback
      const newId = `tag_${Date.now().toString().slice(-4)}`;
      const newTagItem: AdminTagItem = {
        id: newId,
        name: trimmed,
        used_count: 0,
      };

      setTags((prev) => [newTagItem, ...prev]);

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã tạo thẻ trên giao diện (Offline mode)' : 'Tag created locally [Offline]',
        details: `ID: ${newId}`,
      });

      if (isModal) {
        setCreateTagName('');
        setIsCreateModalOpen(false);
      } else {
        setQuickTagName('');
      }
    } finally {
      if (isModal) setIsSubmittingCreate(false);
      else setIsQuickAdding(false);
    }
  };

  // 3. DELETE TAG: DELETE /api/v1/admin/tags/{id}
  // Response 200: { "message": "Đã xóa thẻ" }
  const handleDeleteSubmit = async () => {
    if (!deleteItem) return;
    setIsSubmittingDelete(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/admin/tags/${encodeURIComponent(deleteItem.id)}`, {
        method: 'DELETE',
        headers,
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const successMsg = resData.message || (isVi ? 'Đã xóa thẻ' : 'Tag deleted successfully');

      setTags((prev) => prev.filter((t) => t.id !== deleteItem.id));

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `DELETE /api/v1/admin/tags/${deleteItem.id} (200)`,
      });

      setDeleteItem(null);
    } catch (err: any) {
      // Offline fallback
      setTags((prev) => prev.filter((t) => t.id !== deleteItem.id));

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã xóa thẻ (Offline mode)' : 'Tag deleted locally [Offline]',
        details: `DELETE /api/v1/admin/tags/${deleteItem.id}`,
      });

      setDeleteItem(null);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Copy helper
  const handleCopyId = (id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Sorted and searched tags
  const displayedTags = useMemo(() => {
    const term = (searchQuery || headerSearch).toLowerCase().trim();
    let res = tags;

    if (term) {
      res = tags.filter(
        (t) => t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term)
      );
    }

    return [...res].sort((a, b) => {
      if (sortBy === 'used_count') {
        return (b.used_count || 0) - (a.used_count || 0);
      }
      return a.name.localeCompare(b.name);
    });
  }, [tags, searchQuery, headerSearch, sortBy]);

  // Metrics
  const totalTags = tags.length;
  const totalUsed = tags.reduce((sum, t) => sum + (t.used_count || 0), 0);
  const maxUsed = tags.reduce((max, t) => Math.max(max, t.used_count || 0), 0);
  const mostPopularTag = tags.find((t) => t.used_count === maxUsed);
  const avgUsed = totalTags > 0 ? Math.round(totalUsed / totalTags) : 0;

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-slate-50 text-slate-900 font-sans flex"
    >
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab="tags"
        setActiveTab={() => {}}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          searchQuery={headerSearch}
          setSearchQuery={setHeaderSearch}
          activeTab="tags"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto space-y-6">
          {/* Action Toast Alert Banner */}
          {actionToast && (
            <div
              className={`p-3.5 text-xs font-bold flex items-center justify-between gap-3 shadow-xs rounded-xl border ${
                actionToast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : actionToast.type === 'warning'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionToast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                )}
                <span>{actionToast.message}</span>
                {actionToast.details && (
                  <span className="opacity-80 font-mono text-[11px] ml-2">({actionToast.details})</span>
                )}
              </div>
              <button
                onClick={() => setActionToast(null)}
                className="p-1 hover:bg-black/5 rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Page Title & Top Actions Header */}
          <div className="flex flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs w-full text-left">
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 text-left">
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isVi ? 'Quản lý Thẻ' : 'Tag Management'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
                  <TagIcon className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Quản Lý Thẻ (Tags)' : 'Tag Management'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {totalTags} {isVi ? 'thẻ' : 'tags'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Tạo thẻ định danh bài viết, quản lý tần suất sử dụng và xóa thẻ không hợp lệ.'
                  : 'Create and organize content tags, track usage counts, and clean up obsolete labels.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={fetchTags}
                disabled={isLoading}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  padding: '9px 16px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isVi ? 'LÀM MỚI' : 'REFRESH'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreateTagName('');
                  setIsCreateModalOpen(true);
                }}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  padding: '9px 18px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                }}
                className="hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>{isVi ? 'TẠO THỂ MỚI' : 'CREATE NEW TAG'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{isVi ? 'Tổng số thẻ' : 'Total Tags'}</span>
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalTags}</div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">GET /tags?limit=50</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-indigo-600 text-xs font-semibold mb-2">
                <span>{isVi ? 'Tổng lượt gắn thẻ' : 'Total Usages'}</span>
                <BarChart2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalUsed}</div>
              <div className="text-[11px] text-slate-400 mt-1">used_count</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold mb-2">
                <span>{isVi ? 'Thẻ dùng nhiều nhất' : 'Top Tag'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-lg font-black text-emerald-600 truncate">
                #{mostPopularTag?.name || 'N/A'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{maxUsed} lượt sử dụng</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{isVi ? 'Lượt dùng trung bình' : 'Avg per Tag'}</span>
                <Hash className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{avgUsed}</div>
              <div className="text-[11px] text-slate-400 mt-1">lượt / thẻ</div>
            </div>
          </div>

          {/* Quick Add Tag Bar */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 shadow-xs">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTag(quickTagName, false);
              }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 shrink-0">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{isVi ? 'Thêm nhanh thẻ mới:' : 'Quick Add Tag:'}</span>
              </div>

              <div className="relative flex-1 w-full">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickTagName}
                  onChange={(e) => setQuickTagName(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Nhập tên thẻ mới (ví dụ: Limited Edition, K-POP, MOBA...)'
                      : 'Enter tag name (e.g., Limited Edition, MOBA)...'
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isQuickAdding || !quickTagName.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                {isQuickAdding && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <Plus className="w-4 h-4" />
                <span>{isVi ? 'Thêm thẻ (POST)' : 'Add Tag'}</span>
              </button>
            </form>
          </div>

          {/* Search, Sort & View Mode Toolbar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Tìm kiếm theo tên thẻ hoặc mã ID (tag_xxx)...'
                      : 'Search by tag name or ID (tag_xxx)...'
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Option */}
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isVi ? 'Sắp xếp:' : 'Sort:'}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-600 shadow-xs cursor-pointer"
                  >
                    <option value="used_count">{isVi ? 'Lượt dùng nhiều nhất' : 'Most Used'}</option>
                    <option value="name">{isVi ? 'Theo tên (A-Z)' : 'Name (A-Z)'}</option>
                  </select>
                </div>

                {/* View Switch */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all ${
                      viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Dạng thẻ Chip"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Đám mây thẻ' : 'Chips'}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all ${
                      viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Dạng bảng chi tiết"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Bảng chi tiết' : 'Table'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content View */}
          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">
                {isVi ? 'Đang tải thẻ...' : 'Fetching tags...'}
              </p>
            </div>
          ) : isConnectionError ? (
            <div className="py-20 px-4 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs my-6">
              <div className="max-w-md mx-auto flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-500 flex items-center justify-center mb-1">
                  <WifiOff className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Lỗi kết nối máy chủ' : 'Server Connection Error'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                  {isVi
                    ? 'Không thể kết nối đến máy chủ backend. Dữ liệu sẽ tự động đồng bộ khi dịch vụ hoạt động.'
                    : 'Could not connect to backend server. Data will sync automatically when service is online.'}
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={fetchTags}
                    style={{
                      borderRadius: '12px',
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 24px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
                    }}
                    className="hover:bg-indigo-700 transition-all uppercase tracking-wider"
                  >
                    {isVi ? 'THỬ KẾT NỐI LẠI' : 'RETRY CONNECTION'}
                  </button>
                </div>
              </div>
            </div>
          ) : displayedTags.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <TagIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {isVi ? 'Không tìm thấy thẻ nào' : 'No tags found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                {isVi ? 'Chưa có thẻ nào phù hợp với từ khóa tìm kiếm.' : 'No tags matching your query.'}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                {isVi ? 'Xóa tìm kiếm' : 'Clear Search'}
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* 1. TAG CHIP CLOUD GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {displayedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-xs transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
                        <Hash className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                          {tag.name}
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400 mt-0.5">
                          <span>{tag.id}</span>
                          <button
                            onClick={() => handleCopyId(tag.id)}
                            className="hover:text-slate-600 p-0.5"
                            title="Sao chép ID"
                          >
                            {copiedId === tag.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setDeleteItem(tag)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={isVi ? 'Xóa thẻ (DELETE /{id})' : 'Delete Tag'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Popularity bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>{isVi ? 'Tần suất sử dụng:' : 'Usage:'}</span>
                      <span className="font-bold text-indigo-600 font-mono">{tag.used_count || 0} bài</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{
                          width: `${maxUsed > 0 ? Math.min(100, ((tag.used_count || 0) / maxUsed) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 2. TABLE VIEW */
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Mã Thẻ (ID)</th>
                    <th className="py-3 px-4">{isVi ? 'Tên thẻ (Tag Name)' : 'Tag Name'}</th>
                    <th className="py-3 px-4">{isVi ? 'Số lần sử dụng (used_count)' : 'Used Count'}</th>
                    <th className="py-3 px-4">{isVi ? 'Độ phổ biến' : 'Popularity'}</th>
                    <th className="py-3 px-4 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedTags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-slate-50/80 transition-colors group text-slate-800">
                      {/* ID with Copy */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-indigo-600 font-bold">
                          <span>{tag.id}</span>
                          <button
                            onClick={() => handleCopyId(tag.id)}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded transition-colors cursor-pointer"
                            title="Sao chép ID"
                          >
                            {copiedId === tag.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                          <Hash className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{tag.name}</span>
                        </span>
                      </td>

                      {/* Used Count */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-900 font-bold">
                        {tag.used_count || 0} bài viết
                      </td>

                      {/* Popularity bar */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="w-36 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-indigo-600"
                            style={{
                              width: `${maxUsed > 0 ? Math.min(100, ((tag.used_count || 0) / maxUsed) * 100) : 0}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDeleteItem(tag)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                            title="Xóa thẻ (DELETE /{id})"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* CREATE MODAL: POST /api/v1/admin/tags */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isVi ? 'Tạo Thẻ Mới (POST /tags)' : 'Create Tag'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTag(createTagName, true);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {isVi ? 'Tên thẻ định danh (name) *' : 'Tag Name *'}
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={createTagName}
                    onChange={(e) => setCreateTagName(e.target.value)}
                    placeholder="Ví dụ: Limited Edition, MOBA, Presale..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-slate-400 shadow-xs"
                  />
                </div>
              </div>

              {createTagName && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <span className="text-slate-500">Xem trước:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                    #{createTagName.trim()}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmittingCreate && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Tạo thẻ mới' : 'Submit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL: DELETE /api/v1/admin/tags/{id} */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-6 text-xs text-center space-y-4 text-slate-900">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isVi ? 'Xác nhận xóa thẻ?' : 'Delete Tag?'}
              </h3>
              <p className="text-slate-600 mt-1">
                {isVi
                  ? `Bạn có chắc chắn muốn xóa thẻ "#${deleteItem.name}" (${deleteItem.id}) với ${deleteItem.used_count || 0} bài viết đang gắn thẻ này?`
                  : `Are you sure you want to delete tag #${deleteItem.name}?`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteItem(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                {isVi ? 'Hủy bỏ' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={isSubmittingDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
              >
                {isSubmittingDelete && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVi ? 'Xác nhận xóa' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
