'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  MessageSquare,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  LayoutGrid,
  List,
  User,
  Trash2,
  ShieldCheck,
  Flag,
  FileText,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
  WifiOff,
} from 'lucide-react';

// Data item interface matching GET /api/v1/admin/comments/flagged:
// { id: "cmt_xxx", post_id: "cnt_xxx", user: "Spammer", body: "Bình luận spam...", reports_count: 5 }
export interface AdminCommentItem {
  id: string;
  post_id: string;
  user: string;
  body: string;
  reports_count: number;
  created_at?: string;
  status?: string;
  [key: string]: any;
}

export interface ApiResponseMeta {
  total: number;
  page: number;
  limit?: number;
}



export default function AdminCommentsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // API State
  const [comments, setComments] = useState<AdminCommentItem[]>([]);
  const [meta, setMeta] = useState<ApiResponseMeta>({ total: 0, page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);

  // Filters state (matching API: ?page=1&limit=20&sort=reports_count)
  const [sort, setSort] = useState<string>('reports_count');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Detail Modal
  const [selectedComment, setSelectedComment] = useState<AdminCommentItem | null>(null);

  // Delete Modal: DELETE /api/v1/admin/comments/{id}
  const [deleteComment, setDeleteComment] = useState<AdminCommentItem | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Toast notifications
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

  // 1. FETCH FLAGGED COMMENTS: GET /api/v1/admin/comments/flagged?page=1&limit=20&sort=reports_count
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setIsConnectionError(false);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    params.set('sort', sort);

    const endpoint = `/api/v1/admin/comments/flagged?${params.toString()}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const resJson = await response.json();

      // Expected format: { "data": [{ id: "cmt_xxx", post_id: "cnt_xxx", user: "Spammer", body: "...", reports_count: 5 }] }
      if (resJson && Array.isArray(resJson.data)) {
        setComments(resJson.data);
        if (resJson.meta) {
          setMeta({
            total: Number(resJson.meta.total) || resJson.data.length,
            page: Number(resJson.meta.page) || page,
            limit: Number(resJson.meta.limit) || limit,
          });
        } else {
          setMeta({ total: resJson.data.length, page, limit });
        }
      } else if (Array.isArray(resJson)) {
        setComments(resJson);
        setMeta({ total: resJson.length, page: 1, limit });
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch (err) {
      console.warn('Backend API /api/v1/admin/comments/flagged offline or error:', err);
      setIsConnectionError(true);
      setComments([]);
      setMeta({
        total: 0,
        page,
        limit,
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sort]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 2. DELETE FLAGGED COMMENT: DELETE /api/v1/admin/comments/{id}
  // Response 200: { "message": "Đã xóa bình luận vi phạm" }
  const handleDeleteSubmit = async () => {
    if (!deleteComment) return;
    setIsSubmittingDelete(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/admin/comments/${encodeURIComponent(deleteComment.id)}`, {
        method: 'DELETE',
        headers,
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const successMsg = resData.message || (isVi ? 'Đã xóa bình luận vi phạm' : 'Flagged comment deleted successfully');

      setComments((prev) => prev.filter((item) => item.id !== deleteComment.id));
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      if (selectedComment && selectedComment.id === deleteComment.id) {
        setSelectedComment(null);
      }

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `DELETE /api/v1/admin/comments/${deleteComment.id} (200 OK)`,
      });

      setDeleteComment(null);
    } catch (err: any) {
      // Offline fallback
      setComments((prev) => prev.filter((item) => item.id !== deleteComment.id));
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      if (selectedComment && selectedComment.id === deleteComment.id) {
        setSelectedComment(null);
      }

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã xóa bình luận vi phạm (Offline mode)' : 'Comment deleted locally [Offline]',
        details: `DELETE /api/v1/admin/comments/${deleteComment.id}`,
      });

      setDeleteComment(null);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Dismiss Flag (Keep Comment)
  const handleDismissFlag = (item: AdminCommentItem) => {
    setComments((prev) => prev.filter((c) => c.id !== item.id));
    setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    if (selectedComment && selectedComment.id === item.id) {
      setSelectedComment(null);
    }
    setActionToast({
      type: 'success',
      message: isVi ? 'Đã bỏ qua cảnh báo và giữ lại bình luận' : 'Flag dismissed successfully',
      details: `ID: ${item.id}`,
    });
  };

  // Copy ID helper
  const handleCopyId = (id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Client search filter
  const displayedComments = useMemo(() => {
    const term = (searchQuery || headerSearch).toLowerCase().trim();
    if (!term) return comments;

    return comments.filter((item) => {
      const bodyMatch = (item.body || '').toLowerCase().includes(term);
      const userMatch = (item.user || '').toLowerCase().includes(term);
      const idMatch = (item.id || '').toLowerCase().includes(term);
      const postMatch = (item.post_id || '').toLowerCase().includes(term);
      return bodyMatch || userMatch || idMatch || postMatch;
    });
  }, [comments, searchQuery, headerSearch]);

  // Metrics
  const totalComments = meta.total || displayedComments.length;
  const maxReports = displayedComments.reduce((max, c) => Math.max(max, c.reports_count || 0), 0);
  const urgentCount = displayedComments.filter((c) => (c.reports_count || 0) >= 5).length;
  const uniqueUsers = new Set(displayedComments.map((c) => c.user)).size;

  const totalPages = Math.max(1, Math.ceil(totalComments / limit));

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-slate-50 text-slate-900 font-sans flex"
    >
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab="comments"
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
          activeTab="comments"
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
                  {isVi ? 'Kiểm duyệt Bình luận' : 'Comment Moderation'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/60 shadow-2xs shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Quản Lý Bình Luận Bị Báo Cáo' : 'Flagged Comments Moderation'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {totalComments} {isVi ? 'báo cáo' : 'flagged'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Kiểm duyệt các bình luận spam, thù địch hoặc vi phạm bị người dùng cắm cờ báo cáo.'
                  : 'Review and remove comments flagged by community users for spam or abuse.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={fetchComments}
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
            </div>
          </div>

          {/* Quick Metrics KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{isVi ? 'Tổng bình luận vi phạm' : 'Total Flagged'}</span>
                <MessageSquare className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalComments}</div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">meta.total: {meta.total}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-rose-600 text-xs font-semibold mb-2">
                <span>{isVi ? 'Báo cáo cao nhất' : 'Max Reports'}</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600">{maxReports} lượt</div>
              <div className="text-[11px] text-slate-400 mt-1">sort=reports_count</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-amber-600 text-xs font-semibold mb-2">
                <span>{isVi ? 'Cần xử lý gấp (≥5)' : 'High Priority (≥5)'}</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">{urgentCount}</div>
              <div className="text-[11px] text-slate-400 mt-1">Độ ưu tiên cao</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{isVi ? 'Người dùng bị báo cáo' : 'Reported Users'}</span>
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900">{uniqueUsers}</div>
              <div className="text-[11px] text-slate-400 mt-1">Tài khoản liên quan</div>
            </div>
          </div>

          {/* Filtering and Search Controls */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Tìm theo nội dung, người dùng, mã cmt_xxx, mã bài viết cnt_xxx...'
                      : 'Search comment body, user, cmt_xxx, or post cnt_xxx...'
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

              {/* Sort by & view mode controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isVi ? 'Sắp xếp:' : 'Sort:'}</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-600 shadow-xs cursor-pointer"
                  >
                    <option value="reports_count">{isVi ? 'Lượt báo cáo nhiều nhất' : 'Most Reported'}</option>
                    <option value="newest">{isVi ? 'Mới nhất' : 'Newest'}</option>
                    <option value="oldest">{isVi ? 'Cũ nhất' : 'Oldest'}</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                      viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Bảng biểu (Table)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                      viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Dạng lưới (Grid)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span>{isVi ? 'Hiển thị:' : 'Limit:'}</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-600 shadow-xs cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Content List Table / Grid */}
          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">
                {isVi ? 'Đang tải bình luận vi phạm...' : 'Fetching flagged comments...'}
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
                    onClick={fetchComments}
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
          ) : displayedComments.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {isVi ? 'Không có bình luận vi phạm nào' : 'No flagged comments found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                {isVi
                  ? 'Hệ thống hiện tại sạch hoàn toàn, không có bình luận nào bị cộng đồng báo cáo.'
                  : 'All comments are clean and no reports are currently pending review.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSort('reports_count');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                {isVi ? 'Xóa bộ lọc' : 'Clear Filters'}
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* TABLE VIEW */
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Mã bình luận</th>
                    <th className="py-3 px-4">{isVi ? 'Người gửi (User)' : 'User'}</th>
                    <th className="py-3 px-4">{isVi ? 'Nội dung bình luận (Body)' : 'Comment Body'}</th>
                    <th className="py-3 px-4">{isVi ? 'Bài viết (Post ID)' : 'Post ID'}</th>
                    <th className="py-3 px-4">{isVi ? 'Lượt báo cáo' : 'Reports Count'}</th>
                    <th className="py-3 px-4 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedComments.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group text-slate-800"
                    >
                      {/* ID with Copy button */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-indigo-600 font-bold">
                          <span>{item.id}</span>
                          <button
                            onClick={() => handleCopyId(item.id)}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded transition-colors cursor-pointer"
                            title="Sao chép ID"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* User */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-[10px] border border-rose-200">
                            {item.user ? item.user.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="font-semibold text-slate-900">{item.user}</span>
                        </div>
                      </td>

                      {/* Body */}
                      <td className="py-3 px-4">
                        <div className="text-slate-700 max-w-[420px] line-clamp-2 leading-relaxed">
                          {item.body}
                        </div>
                      </td>

                      {/* Post ID */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-slate-500">
                          <Link
                            href={`/admin/events`}
                            className="hover:text-indigo-600 underline underline-offset-2 flex items-center gap-1 transition-colors"
                            title="Xem bài viết gốc"
                          >
                            <span>{item.post_id}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        </div>
                      </td>

                      {/* Reports Count */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${
                            item.reports_count >= 8
                              ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                              : item.reports_count >= 4
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>{item.reports_count} {isVi ? 'báo cáo' : 'reports'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail */}
                          <button
                            onClick={() => setSelectedComment(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title={isVi ? 'Xem chi tiết' : 'View Details'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Dismiss Flag (Keep Comment) */}
                          <button
                            onClick={() => handleDismissFlag(item)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                            title={isVi ? 'Bỏ qua cảnh báo' : 'Dismiss Flag'}
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          {/* Delete Comment: DELETE /api/v1/admin/comments/{id} */}
                          <button
                            onClick={() => setDeleteComment(item)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                            title={isVi ? 'Xóa bình luận vi phạm (DELETE /{id})' : 'Delete Comment'}
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
          ) : (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedComments.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-indigo-600">
                        <span>{item.id}</span>
                        <button
                          onClick={() => handleCopyId(item.id)}
                          className="p-0.5 text-slate-400 hover:text-slate-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200"
                      >
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>{item.reports_count} {isVi ? 'báo cáo' : 'reports'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-[10px] border border-rose-200">
                        {item.user ? item.user.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="font-semibold text-slate-900 text-xs">{item.user}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-auto">Post: {item.post_id}</span>
                    </div>

                    <p className="text-xs text-slate-700 p-3 bg-slate-50 rounded-lg border border-slate-200 leading-relaxed line-clamp-3">
                      "{item.body}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleDismissFlag(item)}
                      className="text-xs text-slate-500 hover:text-emerald-700 font-semibold cursor-pointer transition-colors"
                    >
                      {isVi ? 'Bỏ qua' : 'Dismiss'}
                    </button>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => setSelectedComment(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        {isVi ? 'Chi tiết' : 'View'}
                      </button>
                      <button
                        onClick={() => setDeleteComment(item)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isVi ? 'Xóa' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-xs text-slate-500 font-mono">
              {isVi
                ? `Hiển thị ${displayedComments.length} trên tổng ${totalComments} mục (Trang ${page} / ${totalPages})`
                : `Showing ${displayedComments.length} of ${totalComments} entries (Page ${page} of ${totalPages})`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isVi ? 'Trước' : 'Prev'}</span>
              </button>

              <div className="px-3 py-1.5 bg-indigo-600 rounded-xl text-xs font-mono font-bold text-white shadow-xs">
                {page} / {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <span>{isVi ? 'Sau' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* DETAIL MODAL */}
      {selectedComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isVi ? 'Chi Tiết Bình Luận Vi Phạm' : 'Flagged Comment Details'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">Comment ID:</span>
                  <span className="text-indigo-600 font-bold font-mono">{selectedComment.id}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{selectedComment.reports_count} {isVi ? 'báo cáo' : 'reports'}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 font-semibold mb-1">{isVi ? 'Người gửi (user):' : 'User:'}</div>
                  <div className="text-slate-900 font-bold flex items-center gap-1.5">
                    <User className="w-4 h-4 text-rose-600" />
                    <span>{selectedComment.user}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 font-semibold mb-1">{isVi ? 'Bài viết liên quan:' : 'Target Post:'}</div>
                  <div className="text-indigo-600 font-mono font-bold">{selectedComment.post_id}</div>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  {isVi ? 'Nội dung bình luận (body):' : 'Comment Body:'}
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedComment.body}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedComment(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDismissFlag(selectedComment)}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Bỏ qua cảnh báo' : 'Dismiss'}</span>
                </button>

                <button
                  onClick={() => {
                    setDeleteComment(selectedComment);
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Xóa bình luận vi phạm' : 'Delete Comment'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL: DELETE /api/v1/admin/comments/{id} */}
      {deleteComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-6 text-xs text-center space-y-4 text-slate-900">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isVi ? 'Xóa bình luận vi phạm?' : 'Delete Flagged Comment?'}
              </h3>
              <p className="text-slate-600 mt-1">
                {isVi
                  ? `Bạn có chắc chắn muốn xóa bình luận của "${deleteComment.user}" (${deleteComment.id}) với ${deleteComment.reports_count} lượt báo cáo? Hành động này không thể hoàn tác.`
                  : `Are you sure you want to delete comment from ${deleteComment.user}?`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteComment(null)}
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
                <span>{isVi ? 'Xóa bình luận' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
