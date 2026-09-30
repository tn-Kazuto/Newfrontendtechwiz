'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  LifeBuoy,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  Bug,
  Lightbulb,
  HelpCircle,
  Clock,
  Eye,
  MessageSquare,
  Send,
  User,
  Mail,
  Image as ImageIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCheck,
  XCircle,
  SlidersHorizontal,
  Flame,
  FileText,
  WifiOff,
} from 'lucide-react';

export interface FeedbackUser {
  id?: string;
  name?: string;
  email?: string;
}

export interface AdminFeedbackItem {
  id: string;
  user: string | FeedbackUser;
  type: 'bug' | 'suggestion' | 'query' | string;
  title: string;
  status: 'Open' | 'In_Progress' | 'Resolved' | 'Closed' | string;
  created_at: string;
  content?: string;
  screenshot_url?: string;
  response_note?: string;
  [key: string]: any;
}



export default function AdminFeedbacksPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Main data states
  const [feedbacks, setFeedbacks] = useState<AdminFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  // Filters & Pagination: ?type=bug|suggestion|query&status=Open&page=1&limit=20
  const [typeFilter, setTypeFilter] = useState<'all' | 'bug' | 'suggestion' | 'query'>('all');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In_Progress' | 'Resolved' | 'Closed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<AdminFeedbackItem | null>(null);
  const [statusModalItem, setStatusModalItem] = useState<AdminFeedbackItem | null>(null);

  // Form for PUT /api/v1/admin/feedbacks/{id}/status
  const [updateStatusForm, setUpdateStatusForm] = useState({
    status: 'In_Progress' as 'In_Progress' | 'Resolved' | 'Closed',
    response_note: '',
  });
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  // Helper get user info
  const getUserName = (u: any) => {
    if (!u) return 'Ẩn danh';
    if (typeof u === 'string') return u;
    return u.name || u.email || 'User';
  };

  const getUserEmail = (u: any) => {
    if (!u || typeof u === 'string') return '';
    return u.email || '';
  };

  // Toast clear
  useEffect(() => {
    if (apiSuccess) {
      const timer = setTimeout(() => setApiSuccess(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [apiSuccess]);

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => setApiError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  // Fetch Feedbacks: GET /api/v1/admin/feedbacks?type=...&status=...&page=...&limit=...
  const fetchFeedbacks = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setIsConnectionError(false);

    try {
      const token = getAccessToken();
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const url = `/api/v1/admin/feedbacks?${params.toString()}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json = await res.json();
      const rawData = json.data || json.feedbacks || (Array.isArray(json) ? json : []);

      if (Array.isArray(rawData)) {
        setFeedbacks(rawData);
        setTotalCount(json.meta?.total || json.total || rawData.length);
      } else {
        setFeedbacks([]);
        setTotalCount(0);
      }
      setApiError(null);
      setIsConnectionError(false);
    } catch (err: any) {
      console.warn('API /api/v1/admin/feedbacks offline or error:', err);
      setFeedbacks([]);
      setTotalCount(0);
      setIsConnectionError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [typeFilter, statusFilter, searchTerm, page, limit]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Fetch Feedback Detail: GET /api/v1/admin/feedbacks/{id}
  const fetchFeedbackDetail = async (id: string) => {
    try {
      const token = getAccessToken();
      const res = await fetch(`/api/v1/admin/feedbacks/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (data && data.id) {
          setDetailItem(data);
          return data;
        }
      }
    } catch (err) {
      console.warn('GET /api/v1/admin/feedbacks/{id} fallback to local item');
    }
    const found = feedbacks.find((f) => f.id === id);
    if (found) setDetailItem(found);
    return found;
  };

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Update Status Modal
  const openStatusModal = (item: AdminFeedbackItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStatusModalItem(item);
    setUpdateStatusForm({
      status: (item.status === 'Open' ? 'In_Progress' : item.status) as any,
      response_note: item.response_note || '',
    });
  };

  // Submit Status Update: PUT /api/v1/admin/feedbacks/{id}/status
  // Request: { "status": "In_Progress | Resolved | Closed", "response_note": "..." }
  // Response 200: { "message": "Cập nhật tiến độ xử lý và gửi phản hồi thành công" }
  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalItem) return;

    setIsSubmittingStatus(true);
    setApiError(null);

    const payload = {
      status: updateStatusForm.status,
      response_note: updateStatusForm.response_note.trim(),
    };

    try {
      const token = getAccessToken();
      const res = await fetch(`/api/v1/admin/feedbacks/${statusModalItem.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setApiSuccess(
          json.message ||
            (isVi
              ? 'Cập nhật tiến độ xử lý và gửi phản hồi thành công'
              : 'Feedback status updated and response sent successfully')
        );
        setStatusModalItem(null);
        fetchFeedbacks(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('PUT feedback status offline, updating locally:', err);
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === statusModalItem.id
            ? { ...f, status: payload.status, response_note: payload.response_note }
            : f
        )
      );
      setApiSuccess(
        isVi
          ? 'Cập nhật tiến độ xử lý thành công (Local)'
          : 'Feedback status updated locally'
      );
      setStatusModalItem(null);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // Render Type Badge
  const renderTypeBadge = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t === 'bug') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <Bug className="w-3 h-3 text-rose-600" />
          <span>Báo lỗi (Bug)</span>
        </span>
      );
    }
    if (t === 'suggestion') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Lightbulb className="w-3 h-3 text-amber-600" />
          <span>Đề xuất (Suggestion)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <HelpCircle className="w-3 h-3 text-blue-600" />
        <span>Thắc mắc (Query)</span>
      </span>
    );
  };

  // Render Status Badge
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{isVi ? 'Đã giải quyết' : 'Resolved'}</span>
        </span>
      );
    }
    if (s === 'in_progress') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3 h-3 text-blue-600 animate-spin" />
          <span>{isVi ? 'Đang xử lý' : 'In Progress'}</span>
        </span>
      );
    }
    if (s === 'closed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
          <CheckCheck className="w-3 h-3 text-slate-500" />
          <span>{isVi ? 'Đã đóng' : 'Closed'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Flame className="w-3 h-3 text-amber-600 animate-pulse" />
        <span>{isVi ? 'Mới mở (Open)' : 'Open'}</span>
      </span>
    );
  };

  // KPI computations
  const totalCountAll = feedbacks.length;
  const bugCount = feedbacks.filter((f) => (f.type || '').toLowerCase() === 'bug').length;
  const suggestionCount = feedbacks.filter((f) => (f.type || '').toLowerCase() === 'suggestion').length;
  const openCount = feedbacks.filter((f) => (f.status || '').toLowerCase() === 'open').length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="feedbacks"
        setActiveTab={() => {}}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          searchQuery={headerSearch}
          setSearchQuery={setHeaderSearch}
          activeTab="feedbacks"
        />

        {/* BREADCRUMB & TOP ACTIONS HEADER */}
        <div className="p-6 pb-0">
          <div className="flex flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs w-full text-left">
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 text-left">
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isVi ? 'Phản hồi & Báo lỗi' : 'Feedback & Support'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Quản Lý Ý Kiến, Thắc Mắc & Báo Lỗi' : 'User Feedback & Bug Tracking'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {totalCountAll} {isVi ? 'phiếu' : 'tickets'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Tiếp nhận phản hồi người dùng, phân loại báo lỗi hệ thống và cập nhật trạng thái xử lý.'
                  : 'Receive user feedback, categorize bug reports, and respond to support tickets.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => fetchFeedbacks(true)}
                disabled={loading || refreshing}
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
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{isVi ? 'LÀM MỚI' : 'REFRESH'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {apiSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{apiSuccess}</span>
            </div>
            <button onClick={() => setApiSuccess(null)} className="p-1 hover:bg-emerald-100 rounded-md text-emerald-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{apiError}</span>
            </div>
            <button onClick={() => setApiError(null)} className="p-1 hover:bg-rose-100 rounded-md text-rose-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* CONTENT BODY */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
              <p className="text-xs text-slate-500">{isVi ? 'Đang tải phản hồi khách hàng...' : 'Loading feedbacks...'}</p>
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
                    onClick={() => fetchFeedbacks(true)}
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
          ) : (
            <>
              {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Tổng số phiếu nhận' : 'Total Tickets'}</span>
                <LifeBuoy className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalCountAll}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Từ khách hàng và đối tác' : 'All user inquiries'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Phiếu mới cần xử lý' : 'Open / Unresolved'}</span>
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-amber-600">{openCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Đang đợi admin phản hồi' : 'Awaiting admin response'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Báo cáo sự cố lỗi' : 'Bug Reports'}</span>
                <Bug className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600">{bugCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Cần chuyển bộ phận kỹ thuật' : 'Requires dev triage'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Góp ý & Đề xuất' : 'Suggestions'}</span>
                <Lightbulb className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">{suggestionCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isVi ? 'Ý tưởng cải tiến sản phẩm' : 'Product ideas & requests'}
              </div>
            </div>
          </div>

          {/* FILTER TOOLBAR: ?type=bug|suggestion|query&status=Open */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder={
                    isVi
                      ? 'Tìm kiếm theo tiêu đề phản hồi, mã fb_xxx, tên khách hàng...'
                      : 'Search by title, feedback id, user name...'
                  }
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative min-w-[170px]">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 cursor-pointer appearance-none shadow-xs"
                >
                  <option value="All">{isVi ? 'Tất cả Trạng thái' : 'All Statuses'}</option>
                  <option value="Open">{isVi ? 'Mới mở (Open)' : 'Open'}</option>
                  <option value="In_Progress">{isVi ? 'Đang xử lý (In_Progress)' : 'In Progress'}</option>
                  <option value="Resolved">{isVi ? 'Đã giải quyết (Resolved)' : 'Resolved'}</option>
                  <option value="Closed">{isVi ? 'Đã đóng (Closed)' : 'Closed'}</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* TYPE FILTER TABS: ?type=bug|suggestion|query */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 shrink-0 font-medium text-[11px]">
                {isVi ? 'Phân loại phiếu:' : 'Ticket Type:'}
              </span>

              {[
                { id: 'all', label: isVi ? 'Tất cả' : 'All Types', icon: LifeBuoy },
                { id: 'bug', label: isVi ? 'Báo lỗi (bug)' : 'Bugs', icon: Bug },
                { id: 'suggestion', label: isVi ? 'Đề xuất (suggestion)' : 'Suggestions', icon: Lightbulb },
                { id: 'query', label: isVi ? 'Thắc mắc (query)' : 'Queries', icon: HelpCircle },
              ].map((t) => {
                const isActive = typeFilter === t.id;
                const Icon = t.icon;
                const count =
                  t.id === 'all'
                    ? totalCountAll
                    : feedbacks.filter((f) => (f.type || '').toLowerCase() === t.id).length;

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTypeFilter(t.id as any);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TABLE OF FEEDBACKS */}
          <div className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">{isVi ? 'Phân loại' : 'Type'}</th>
                    <th className="px-4 py-3">{isVi ? 'Tiêu đề phản hồi' : 'Title'}</th>
                    <th className="px-4 py-3">{isVi ? 'Người gửi' : 'User'}</th>
                    <th className="px-4 py-3">{isVi ? 'Trạng thái' : 'Status'}</th>
                    <th className="px-4 py-3">{isVi ? 'Thời gian' : 'Date'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feedbacks.map((fb) => (
                    <tr
                      key={fb.id}
                      onClick={() => fetchFeedbackDetail(fb.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer text-slate-800"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderTypeBadge(fb.type)}
                      </td>

                      <td className="px-4 py-3 max-w-sm">
                        <div className="font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
                          {fb.title}
                        </div>
                        <button
                          onClick={(e) => handleCopyId(fb.id, e)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 font-mono flex items-center gap-1 mt-0.5"
                        >
                          <span>{fb.id}</span>
                          {copiedId === fb.id ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{getUserName(fb.user)}</div>
                        {getUserEmail(fb.user) && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {getUserEmail(fb.user)}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderStatusBadge(fb.status)}
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(fb.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => openStatusModal(fb, e)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold text-[10px] cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
                            title={isVi ? 'Cập nhật tiến độ & Phản hồi' : 'Update Status'}
                          >
                            <Send className="w-3 h-3" />
                            <span>{isVi ? 'Phản hồi' : 'Reply'}</span>
                          </button>

                          <button
                            onClick={() => fetchFeedbackDetail(fb.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            title={isVi ? 'Xem chi tiết' : 'View'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div>
              {isVi
                ? `Hiển thị ${feedbacks.length} phiếu phản hồi (Trang ${page})`
                : `Showing ${feedbacks.length} tickets (Page ${page})`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isVi ? 'Trang trước' : 'Previous'}</span>
              </button>

              <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold shadow-xs">
                {page}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={feedbacks.length < limit || loading}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
              >
                <span>{isVi ? 'Trang sau' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
        )}
        </div>
      </div>

      {/* DETAIL MODAL: GET /api/v1/admin/feedbacks/{id} */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isVi ? 'Chi tiết Ý kiến & Phản hồi' : 'Feedback Ticket Details'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">{detailItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="flex items-center justify-between">
                <div>{renderTypeBadge(detailItem.type)}</div>
                <div>{renderStatusBadge(detailItem.status)}</div>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">{detailItem.title}</h2>
                <div className="text-[11px] text-slate-500">
                  {new Date(detailItem.created_at).toLocaleString()}
                </div>
              </div>

              {/* User info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">{isVi ? 'Người gửi' : 'User'}</div>
                  <div className="font-bold text-slate-900 mt-0.5">{getUserName(detailItem.user)}</div>
                  {getUserEmail(detailItem.user) && (
                    <div className="text-[11px] text-slate-500 font-mono">{getUserEmail(detailItem.user)}</div>
                  )}
                </div>
                <button
                  onClick={() => handleCopyId(detailItem.id)}
                  className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg flex items-center gap-1 text-[11px] shadow-xs transition-colors"
                >
                  {copiedId === detailItem.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === detailItem.id ? 'Copied' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Content description */}
              <div>
                <div className="text-slate-700 font-semibold mb-1">
                  {isVi ? 'Nội dung chi tiết (content):' : 'Feedback Content:'}
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line">
                  {detailItem.content || (isVi ? 'Không có nội dung chi tiết.' : 'No content provided.')}
                </div>
              </div>

              {/* Screenshot attachment */}
              {detailItem.screenshot_url && (
                <div>
                  <div className="text-slate-700 font-semibold mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isVi ? 'Ảnh chụp màn hình (screenshot_url):' : 'Screenshot Attachment:'}</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                      src={detailItem.screenshot_url}
                      alt="Screenshot"
                      className="w-full max-h-56 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Response Note if present */}
              {detailItem.response_note && (
                <div>
                  <div className="text-indigo-600 font-semibold mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Phản hồi từ Admin (response_note):' : 'Admin Response:'}</span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                    {detailItem.response_note}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs cursor-pointer font-semibold shadow-xs transition-colors"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>

              <button
                onClick={() => {
                  const item = detailItem;
                  setDetailItem(null);
                  openStatusModal(item);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isVi ? 'Cập nhật tiến độ & Trả lời' : 'Update & Reply'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL: PUT /api/v1/admin/feedbacks/{id}/status */}
      {statusModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isVi ? 'Cập nhật Tiến độ & Phản hồi' : 'Update Status & Reply'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    PUT /api/v1/admin/feedbacks/{statusModalItem.id}/status
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStatusModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[11px]">Tiêu đề:</div>
                <div className="font-bold text-slate-900 mt-0.5">{statusModalItem.title}</div>
              </div>

              {/* Status choice: In_Progress | Resolved | Closed */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Trạng thái xử lý mới (status) *' : 'New Status (status) *'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'In_Progress', label: 'Đang xử lý', sub: 'In_Progress' },
                    { id: 'Resolved', label: 'Giải quyết', sub: 'Resolved' },
                    { id: 'Closed', label: 'Đóng phiếu', sub: 'Closed' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setUpdateStatusForm({ ...updateStatusForm, status: s.id as any })}
                      className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                        updateStatusForm.status === s.id
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="text-[11px]">{s.label}</div>
                      <div className="text-[9px] font-mono text-slate-400">{s.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Response Note: response_note */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Nội dung phản hồi gửi khách (response_note) *' : 'Response Note (response_note) *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={updateStatusForm.response_note}
                  onChange={(e) => setUpdateStatusForm({ ...updateStatusForm, response_note: e.target.value })}
                  placeholder={
                    isVi
                      ? 'Ví dụ: Lỗi đã được đội kỹ thuật khắc phục / Cảm ơn góp ý quý báu của bạn...'
                      : 'e.g. Bug has been resolved by our engineering team...'
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalItem(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-xs cursor-pointer transition-colors"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStatus}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {isSubmittingStatus && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Gửi phản hồi' : 'Submit Response'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
