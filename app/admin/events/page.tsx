'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  Calendar,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  Plus,
  Pencil,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  Sparkles,
  MapPin,
  Clock,
  Ticket,
  Mail,
  Building2,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Filter,
  DollarSign,
  UserCheck,
  XCircle,
  FileCheck,
  WifiOff,
  SlidersHorizontal,
  QrCode,
} from 'lucide-react';
import { AdminTicketCheckinModal } from '../../../components/admin/AdminTicketCheckinModal';

export interface EventTicketType {
  name: string;
  price: number;
  total: number;
}

export interface AdminEventOrganizer {
  name: string;
  email?: string;
  phone?: string;
}

export interface AdminEventItem {
  id: string;
  title: string;
  organizer: string | AdminEventOrganizer;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Flagged' | string;
  start_time: string;
  end_time?: string;
  location?: string;
  ticket_types?: EventTicketType[];
  ai_risk_score?: number;
  banner_url?: string;
  description?: string;
  created_at?: string;
  [key: string]: any;
}



export default function AdminEventsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Main list state
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Flagged'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Copy helper feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminEventItem | null>(null);
  const [detailItem, setDetailItem] = useState<AdminEventItem | null>(null);
  const [reviewItem, setReviewItem] = useState<AdminEventItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AdminEventItem | null>(null);

  // Form states for CREATE (Thêm sự kiện)
  const [createForm, setCreateForm] = useState({
    title: '',
    organizer_name: '',
    organizer_email: '',
    location: '',
    latitude: '21.0205',
    longitude: '105.7645',
    start_time: '',
    end_time: '',
    banner_url: '',
    description: '',
    tickets: [
      { name: 'Vé tiêu chuẩn', price: 150000, total: 1000 },
      { name: 'Vé VIP', price: 500000, total: 100 },
    ],
  });
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Form states for EDIT (Sửa sự kiện)
  const [editForm, setEditForm] = useState({
    title: '',
    organizer_name: '',
    organizer_email: '',
    location: '',
    start_time: '',
    end_time: '',
    banner_url: '',
    description: '',
    tickets: [] as EventTicketType[],
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Form state for REVIEW (Duyệt / Từ chối sự kiện: PUT /api/v1/admin/events/{id}/review)
  const [reviewForm, setReviewForm] = useState({
    status: 'Approved' as 'Approved' | 'Rejected',
    admin_note: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Currency formatter
  const formatCurrency = (amount: number | string) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat(isVi ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Toast auto-clear
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

  // Fetch Events: GET /api/v1/admin/events?status=Pending|Approved|Rejected|Flagged&page=1&limit=20
  const fetchEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setIsConnectionError(false);

    try {
      const token = getAccessToken();
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const url = `/api/v1/admin/events?${params.toString()}`;
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
      const rawData = json.data || json.events || (Array.isArray(json) ? json : []);

      if (Array.isArray(rawData)) {
        setEvents(rawData);
        setTotalCount(json.meta?.total || json.total || rawData.length);
      } else {
        setEvents([]);
        setTotalCount(0);
      }
      setApiError(null);
      setIsConnectionError(false);
    } catch (err: any) {
      console.warn('API /api/v1/admin/events offline or error:', err);
      setEvents([]);
      setTotalCount(0);
      setIsConnectionError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, searchTerm, page, limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Fetch Event Detail: GET /api/v1/admin/events/{id}
  const fetchEventDetail = async (id: string) => {
    try {
      const token = getAccessToken();
      const res = await fetch(`/api/v1/admin/events/${id}`, {
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
      console.warn('GET /api/v1/admin/events/{id} fallback to local item');
    }
    const found = events.find((e) => e.id === id);
    if (found) setDetailItem(found);
    return found;
  };

  // Copy ID
  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper get organizer name
  const getOrganizerName = (org: string | AdminEventOrganizer | undefined) => {
    if (!org) return 'N/A';
    if (typeof org === 'string') return org;
    return org.name || 'N/A';
  };

  const getOrganizerEmail = (org: string | AdminEventOrganizer | undefined) => {
    if (!org || typeof org === 'string') return '';
    return org.email || '';
  };

  // CREATE EVENT: POST /api/v1/admin/events
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      setApiError(isVi ? 'Vui lòng nhập tiêu đề sự kiện!' : 'Event title is required');
      return;
    }

    setIsSubmittingCreate(true);
    setApiError(null);

    const payload = {
      title: createForm.title.trim(),
      organizer: {
        name: createForm.organizer_name.trim() || 'Admin Ban Tổ Chức',
        email: createForm.organizer_email.trim() || 'admin@event.vn',
      },
      location: createForm.location.trim() || 'TP. Hồ Chí Minh',
      start_time: createForm.start_time || new Date().toISOString(),
      end_time: createForm.end_time || undefined,
      banner_url: createForm.banner_url.trim() || undefined,
      description: createForm.description.trim(),
      ticket_types: createForm.tickets.filter((t) => t.name.trim() && t.price >= 0),
    };

    try {
      const token = getAccessToken();
      const res = await fetch('/api/v1/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok || res.status === 201) {
        setApiSuccess(json.message || (isVi ? 'Đã tạo sự kiện mới thành công' : 'Event created successfully'));
        setIsCreateOpen(false);
        fetchEvents(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('POST event failed, simulating success locally:', err);
      const newEvt: AdminEventItem = {
        id: `evt_${Date.now()}`,
        title: payload.title,
        organizer: payload.organizer,
        status: 'Pending',
        start_time: payload.start_time,
        end_time: payload.end_time,
        location: payload.location,
        ticket_types: payload.ticket_types,
        ai_risk_score: 0.05,
        banner_url: payload.banner_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
        description: payload.description,
        created_at: new Date().toISOString(),
      };
      setEvents((prev) => [newEvt, ...prev]);
      setApiSuccess(isVi ? 'Đã thêm sự kiện thành công (Local)' : 'Event added locally');
      setIsCreateOpen(false);
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (item: AdminEventItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditItem(item);
    setEditForm({
      title: item.title || '',
      organizer_name: getOrganizerName(item.organizer),
      organizer_email: getOrganizerEmail(item.organizer),
      location: item.location || '',
      start_time: item.start_time ? item.start_time.split('T')[0] : '',
      end_time: item.end_time ? item.end_time.split('T')[0] : '',
      banner_url: item.banner_url || '',
      description: item.description || '',
      tickets: item.ticket_types ? [...item.ticket_types] : [{ name: 'Standard', price: 150000, total: 500 }],
    });
  };

  // EDIT EVENT: PUT /api/v1/admin/events/{id}
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    if (!editForm.title.trim()) {
      setApiError(isVi ? 'Tiêu đề sự kiện không được để trống!' : 'Title cannot be blank');
      return;
    }

    setIsSubmittingEdit(true);
    setApiError(null);

    const payload = {
      title: editForm.title.trim(),
      organizer: {
        name: editForm.organizer_name.trim(),
        email: editForm.organizer_email.trim(),
      },
      location: editForm.location.trim(),
      start_time: editForm.start_time,
      end_time: editForm.end_time,
      banner_url: editForm.banner_url.trim(),
      description: editForm.description.trim(),
      ticket_types: editForm.tickets,
    };

    try {
      const token = getAccessToken();
      const res = await fetch(`/api/v1/admin/events/${editItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setApiSuccess(json.message || (isVi ? 'Cập nhật thông tin sự kiện thành công' : 'Event updated successfully'));
        setEditItem(null);
        fetchEvents(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('PUT event failed, updating locally:', err);
      setEvents((prev) =>
        prev.map((e) => (e.id === editItem.id ? { ...e, ...payload } : e))
      );
      setApiSuccess(isVi ? 'Cập nhật thông tin sự kiện thành công (Local)' : 'Event updated locally');
      setEditItem(null);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // REVIEW EVENT: PUT /api/v1/admin/events/{id}/review
  // Request: { "status": "Approved | Rejected", "admin_note": "..." }
  // Response 200: { "message": "Đã duyệt/từ chối sự kiện thành công" }
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewItem) return;

    setIsSubmittingReview(true);
    setApiError(null);

    const payload = {
      status: reviewForm.status,
      admin_note: reviewForm.admin_note.trim(),
    };

    try {
      const token = getAccessToken();
      const res = await fetch(`/api/v1/admin/events/${reviewItem.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setApiSuccess(json.message || (isVi ? 'Đã duyệt/từ chối sự kiện thành công' : 'Event review updated successfully'));
        setReviewItem(null);
        fetchEvents(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('PUT event review failed, updating locally:', err);
      setEvents((prev) =>
        prev.map((e) => (e.id === reviewItem.id ? { ...e, status: payload.status } : e))
      );
      setApiSuccess(
        isVi
          ? `Đã cập nhật trạng thái sự kiện thành [${payload.status}] (Local)`
          : `Event status updated to ${payload.status}`
      );
      setReviewItem(null);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // DELETE EVENT: DELETE /api/v1/admin/events/{id}
  // Response 200: { "message": "Đã gỡ sự kiện vi phạm khỏi hệ thống" }
  const handleDeleteSubmit = async () => {
    if (!deleteItem) return;
    setIsSubmittingDelete(true);
    setApiError(null);

    try {
      const token = getAccessToken();
      const res = await fetch(`/api/v1/admin/events/${deleteItem.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setApiSuccess(json.message || (isVi ? 'Đã gỡ sự kiện vi phạm khỏi hệ thống' : 'Event removed from system'));
        setDeleteItem(null);
        fetchEvents(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('DELETE event failed, removing locally:', err);
      setEvents((prev) => prev.filter((e) => e.id !== deleteItem.id));
      setApiSuccess(isVi ? 'Đã gỡ sự kiện khỏi hệ thống (Local)' : 'Event deleted locally');
      setDeleteItem(null);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{isVi ? 'Đã duyệt' : 'Approved'}</span>
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" />
          <span>{isVi ? 'Từ chối' : 'Rejected'}</span>
        </span>
      );
    }
    if (s === 'flagged') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <ShieldAlert className="w-3 h-3 text-rose-600" />
          <span>{isVi ? 'Gắn cờ vi phạm' : 'Flagged'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
        <span>{isVi ? 'Chờ duyệt' : 'Pending'}</span>
      </span>
    );
  };

  // Render AI Risk Score Badge
  const renderRiskBadge = (score?: number) => {
    if (score === undefined || score === null) return null;
    const isSafe = score < 0.3;
    const isModerate = score >= 0.3 && score < 0.6;

    const colorClasses = isSafe
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : isModerate
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-rose-50 text-rose-700 border-rose-200';

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${colorClasses}`}
        title={`AI Risk Analysis Score: ${(score * 100).toFixed(0)}%`}
      >
        <Sparkles className="w-3 h-3" />
        <span>Risk: {(score * 100).toFixed(0)}%</span>
      </span>
    );
  };

  // KPI computations
  const totalEvents = events.length;
  const pendingCount = events.filter((e) => (e.status || '').toLowerCase() === 'pending').length;
  const approvedCount = events.filter((e) => (e.status || '').toLowerCase() === 'approved').length;
  const flaggedCount = events.filter(
    (e) => (e.status || '').toLowerCase() === 'flagged' || (e.status || '').toLowerCase() === 'rejected'
  ).length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="events"
        setActiveTab={() => { }}
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
          activeTab="events"
        />

        {/* BREADCRUMB & TOP ACTIONS HEADER */}
        <div className="p-3 pb-0">
          <div className="flex flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs w-full text-left">
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 text-left">
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isVi ? 'Quản lý Sự kiện' : 'Event Management'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Quản lý & Duyệt Sự Kiện' : 'Event Control & Approvals'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {totalEvents} {isVi ? 'sự kiện' : 'events'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Quản lý danh sách sự kiện, kiểm duyệt đơn đăng ký và điều phối vé.'
                  : 'Manage event catalog, review submissions, and control tickets.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => fetchEvents(true)}
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
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                }}
                className="hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700/80 transition-all"
                title={isVi ? 'Làm mới' : 'Refresh'}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{isVi ? 'Làm mới' : 'Refresh'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCheckinOpen(true)}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.35)',
                }}
                className="hover:bg-emerald-700 transition-all active:scale-95"
                title="Scan attendee dynamic QR passes"
              >
                <QrCode className="w-4 h-4 stroke-[2.5]" />
                <span style={{ color: '#ffffff' }}>Gate Check-in QR</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.35)',
                }}
                className="hover:bg-indigo-700 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span style={{ color: '#ffffff' }}>{isVi ? 'Thêm sự kiện mới' : 'Create Event'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {apiSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{apiSuccess}</span>
            </div>
            <button onClick={() => setApiSuccess(null)} className="p-1 hover:bg-emerald-100 rounded-md">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{apiError}</span>
            </div>
            <button onClick={() => setApiError(null)} className="p-1 hover:bg-rose-100 rounded-md">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* CONTENT BODY */}
        <div className="p-3">
          {/* KPI STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Tổng số sự kiện' : 'Total Events'}</span>
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalEvents}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Tất cả trạng thái' : 'Across all statuses'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Chờ phê duyệt' : 'Pending Review'}</span>
                <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Cần Admin kiểm duyệt' : 'Awaiting admin decision'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Đã duyệt công khai' : 'Approved & Live'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">{approvedCount}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Đang mở bán vé / hiển thị' : 'Active public ticket sales'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Vi phạm / Từ chối' : 'Flagged / Rejected'}</span>
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-600">{flaggedCount}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Có nguy cơ rủi ro cao' : 'Flagged high risk events'}
              </div>
            </div>
          </div>

          {/* FILTER & SEARCH TOOLBAR */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3 mb-6 my-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Box */}
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
                      ? 'Tìm kiếm theo tên sự kiện, đơn vị tổ chức, địa điểm (vd: Cosplay Expo, SECC, Otaku...)...'
                      : 'Search by event title, organizer, location...'
                  }
                  className="w-full pl-11 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
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

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${viewMode === 'grid'
                      ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                      }`}
                    title={isVi ? 'Xem dạng lưới card' : 'Grid View'}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${viewMode === 'table'
                      ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                      }`}
                    title={isVi ? 'Xem dạng bảng' : 'Table View'}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* STATUS TABS FILTER: ?status=Pending|Approved|Rejected|Flagged */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500 shrink-0 font-medium text-[11px]">
                {isVi ? 'Trạng thái duyệt:' : 'Review Status:'}
              </span>

              {(['All', 'Pending', 'Approved', 'Rejected', 'Flagged'] as const).map((tab) => {
                const isActive = statusFilter === tab;
                const count =
                  tab === 'All'
                    ? totalEvents
                    : events.filter((e) => (e.status || '').toLowerCase() === tab.toLowerCase()).length;

                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setStatusFilter(tab);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                      }`}
                  >
                    <span>
                      {tab === 'All'
                        ? isVi ? 'Tất cả' : 'All'
                        : tab === 'Pending'
                          ? isVi ? 'Chờ duyệt' : 'Pending'
                          : tab === 'Approved'
                            ? isVi ? 'Đã duyệt' : 'Approved'
                            : tab === 'Rejected'
                              ? isVi ? 'Từ chối' : 'Rejected'
                              : isVi ? 'Gắn cờ vi phạm' : 'Flagged'}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN EVENTS DISPLAY */}
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
              <p className="text-xs text-slate-500">{isVi ? 'Đang tải danh sách sự kiện...' : 'Loading events...'}</p>
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
                    onClick={() => fetchEvents(true)}
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
          ) : events.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {isVi ? 'Không tìm thấy sự kiện nào' : 'No events found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'All'
                  ? (isVi ? 'Thử thay đổi từ khóa hoặc bộ lọc trạng thái.' : 'Try changing search keywords or status filter.')
                  : (isVi ? 'Chưa có sự kiện nào. Hãy nhấn "Thêm sự kiện mới" để tạo sự kiện đầu tiên.' : 'No events yet. Click "Create Event" to add one.')}
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                {isVi ? 'Thêm sự kiện ngay' : 'Create Event Now'}
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((item) => {
                const orgName = getOrganizerName(item.organizer);
                const startDateStr = item.start_time ? new Date(item.start_time).toLocaleDateString() : 'N/A';

                return (
                  <div
                    key={item.id}
                    onClick={() => fetchEventDetail(item.id)}
                    className="group relative bg-white hover:border-slate-300 border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Poster Banner */}
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        {item.banner_url ? (
                          <img
                            src={item.banner_url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                          <Calendar className="w-12 h-12" />
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">{renderStatusBadge(item.status)}</div>

                        {/* AI Risk Score */}
                        <div className="absolute top-3 right-3">{renderRiskBadge(item.ai_risk_score)}</div>

                        {/* ID banner */}
                        <div className="absolute bottom-2 right-2">
                          <button
                            onClick={(e) => handleCopyId(item.id, e)}
                            className="text-[10px] text-slate-700 hover:text-slate-900 flex items-center gap-1 font-mono px-2 py-0.5 rounded-md bg-white/90 border border-slate-200 backdrop-blur-xs shadow-xs"
                            title={isVi ? 'Sao chép ID' : 'Copy ID'}
                          >
                            {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{item.id.slice(0, 8)}</span>
                          </button>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-4 space-y-2.5">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {item.title}
                        </h3>

                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="truncate">{orgName}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                            <span>{startDateStr}</span>
                          </div>

                          {item.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          )}

                          {item.ticket_types && item.ticket_types.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Ticket className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="text-slate-800 font-bold">
                                {formatCurrency(item.ticket_types[0].price)}
                                {item.ticket_types.length > 1 ? ` (+${item.ticket_types.length - 1} hạng vé)` : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                      {/* Review Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReviewItem(item);
                          setReviewForm({
                            status: item.status === 'Approved' ? 'Approved' : 'Approved',
                            admin_note: '',
                          });
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        title={isVi ? 'Xét duyệt sự kiện' : 'Review event'}
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>{isVi ? 'Duyệt sự kiện' : 'Review'}</span>
                      </button>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => fetchEventDetail(item.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title={isVi ? 'Xem chi tiết' : 'View details'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => openEditModal(item, e)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title={isVi ? 'Sửa thông tin' : 'Edit event'}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteItem(item);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title={isVi ? 'Gỡ / Xóa sự kiện' : 'Delete event'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">{isVi ? 'Tên sự kiện' : 'Event Title'}</th>
                      <th className="px-4 py-3">{isVi ? 'Đơn vị tổ chức' : 'Organizer'}</th>
                      <th className="px-4 py-3">{isVi ? 'Thời gian' : 'Date / Time'}</th>
                      <th className="px-4 py-3">{isVi ? 'Địa điểm' : 'Location'}</th>
                      <th className="px-4 py-3">{isVi ? 'Trạng thái' : 'Status'}</th>
                      <th className="px-4 py-3">{isVi ? 'AI Risk' : 'AI Risk'}</th>
                      <th className="px-4 py-3 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.map((item) => {
                      const orgName = getOrganizerName(item.organizer);
                      const startDateStr = item.start_time ? new Date(item.start_time).toLocaleDateString() : 'N/A';

                      return (
                        <tr
                          key={item.id}
                          onClick={() => fetchEventDetail(item.id)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3 max-w-xs">
                            <div className="font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate">
                              {item.title}
                            </div>
                            <button
                              onClick={(e) => handleCopyId(item.id, e)}
                              className="text-[10px] text-slate-400 hover:text-slate-600 font-mono flex items-center gap-1 mt-0.5"
                            >
                              <span>{item.id}</span>
                              {copiedId === item.id ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </td>

                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-800">{orgName}</div>
                            {getOrganizerEmail(item.organizer) && (
                              <div className="text-[10px] text-slate-500 font-mono">
                                {getOrganizerEmail(item.organizer)}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">
                            {startDateStr}
                          </td>

                          <td className="px-4 py-3 max-w-[180px] truncate text-slate-600">
                            {item.location || '—'}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            {renderStatusBadge(item.status)}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            {renderRiskBadge(item.ai_risk_score)}
                          </td>

                          <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setReviewItem(item);
                                  setReviewForm({
                                    status: item.status === 'Approved' ? 'Approved' : 'Approved',
                                    admin_note: '',
                                  });
                                }}
                                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold text-[10px] cursor-pointer"
                                title={isVi ? 'Xét duyệt' : 'Review'}
                              >
                                {isVi ? 'Duyệt' : 'Review'}
                              </button>

                              <button
                                onClick={() => fetchEventDetail(item.id)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                                title={isVi ? 'Xem chi tiết' : 'View'}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={(e) => openEditModal(item, e)}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                                title={isVi ? 'Sửa' : 'Edit'}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteItem(item);
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title={isVi ? 'Xóa' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAGINATION BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div>
              {isVi
                ? `Hiển thị ${events.length} sự kiện (Trang ${page})`
                : `Showing ${events.length} events (Page ${page})`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isVi ? 'Trang trước' : 'Previous'}</span>
              </button>

              <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold shadow-xs">
                {page}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={events.length < limit || loading}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>{isVi ? 'Trang sau' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE EVENT MODAL: POST /api/v1/admin/events */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isVi ? 'Thêm Sự kiện Mới' : 'Create New Event'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">POST /api/v1/admin/events</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto text-xs text-slate-700">
              {/* Event Title */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Tiêu đề sự kiện *' : 'Event Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder={isVi ? 'Ví dụ: Cosplay Expo 2026, Chung kết MOBA...' : 'e.g. Cosplay Expo 2026...'}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              {/* Organizer Name & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isVi ? 'Đơn vị tổ chức *' : 'Organizer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.organizer_name}
                    onChange={(e) => setCreateForm({ ...createForm, organizer_name: e.target.value })}
                    placeholder="Otaku Club, Star Media..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isVi ? 'Email liên hệ' : 'Contact Email'}
                  </label>
                  <input
                    type="email"
                    value={createForm.organizer_email}
                    onChange={(e) => setCreateForm({ ...createForm, organizer_email: e.target.value })}
                    placeholder="contact@club.vn"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>
              </div>

              {/* Location & Start Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isVi ? 'Địa điểm tổ chức (location)' : 'Location'}
                  </label>
                  <input
                    type="text"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    placeholder="SECC Q7, Sân vận động Mỹ Đình..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isVi ? 'Thời gian bắt đầu (start_time)' : 'Start Date & Time'}
                  </label>
                  <input
                    type="date"
                    value={createForm.start_time}
                    onChange={(e) => setCreateForm({ ...createForm, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>
              </div>

              {/* GPS Coordinates (Latitude, Longitude) for Radar Location */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>GPS Radar Coordinates (Latitude &amp; Longitude)</span>
                  </label>
                  <span className="text-[10px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    Radar Active
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 block mb-1">Latitude</span>
                    <input
                      type="text"
                      value={createForm.latitude}
                      onChange={(e) => setCreateForm({ ...createForm, latitude: e.target.value })}
                      placeholder="21.0205"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 block mb-1">Longitude</span>
                    <input
                      type="text"
                      value={createForm.longitude}
                      onChange={(e) => setCreateForm({ ...createForm, longitude: e.target.value })}
                      placeholder="105.7645"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-medium self-center mr-1">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, location: 'My Dinh National Stadium (Hanoi)', latitude: '21.0205', longitude: '105.7645' })}
                    className="px-2 py-0.5 bg-white border border-indigo-200 hover:bg-indigo-600 hover:text-white rounded text-[10px] font-mono cursor-pointer transition-colors"
                  >
                    📍 My Dinh Stadium
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, location: 'Vietnam National Convention Center (Hanoi)', latitude: '21.0055', longitude: '105.7836' })}
                    className="px-2 py-0.5 bg-white border border-indigo-200 hover:bg-indigo-600 hover:text-white rounded text-[10px] font-mono cursor-pointer transition-colors"
                  >
                    📍 National Convention Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, location: 'SECC Saigon Exhibition Center', latitude: '10.7302', longitude: '106.7218' })}
                    className="px-2 py-0.5 bg-white border border-indigo-200 hover:bg-indigo-600 hover:text-white rounded text-[10px] font-mono cursor-pointer transition-colors"
                  >
                    📍 SECC Saigon
                  </button>
                </div>
              </div>

              {/* Banner URL */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Đường dẫn ảnh bìa / Poster (banner_url)' : 'Banner URL'}
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={createForm.banner_url}
                    onChange={(e) => setCreateForm({ ...createForm, banner_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                  {createForm.banner_url && (
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img
                        src={createForm.banner_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Ticket Types */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-purple-600" />
                    <span>{isVi ? 'Cơ cấu các hạng vé (ticket_types)' : 'Ticket Types'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setCreateForm({
                        ...createForm,
                        tickets: [...createForm.tickets, { name: '', price: 0, total: 100 }],
                      })
                    }
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isVi ? 'Thêm hạng vé' : 'Add Ticket'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {createForm.tickets.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        placeholder={isVi ? 'Tên vé (VD: VIP, Standard)' : 'Ticket Name'}
                        value={t.name}
                        onChange={(e) => {
                          const updated = [...createForm.tickets];
                          updated[idx].name = e.target.value;
                          setCreateForm({ ...createForm, tickets: updated });
                        }}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                      />
                      <input
                        type="number"
                        placeholder="Giá (VND)"
                        min={0}
                        step={10000}
                        value={t.price}
                        onChange={(e) => {
                          const updated = [...createForm.tickets];
                          updated[idx].price = Number(e.target.value);
                          setCreateForm({ ...createForm, tickets: updated });
                        }}
                        className="w-28 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-indigo-600 font-mono font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Số lượng"
                        min={1}
                        value={t.total}
                        onChange={(e) => {
                          const updated = [...createForm.tickets];
                          updated[idx].total = Number(e.target.value);
                          setCreateForm({ ...createForm, tickets: updated });
                        }}
                        className="w-20 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                      />
                      {createForm.tickets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setCreateForm({
                              ...createForm,
                              tickets: createForm.tickets.filter((_, i) => i !== idx),
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Mô tả chi tiết sự kiện' : 'Event Description'}
                </label>
                <textarea
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder={isVi ? 'Nhập nội dung chương trình, khách mời, quy định tham gia...' : 'Enter event description...'}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer font-medium"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmittingCreate && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Tạo sự kiện' : 'Create Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL: PUT /api/v1/admin/events/{id} */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isVi ? 'Cập nhật Thông tin Sự kiện' : 'Update Event Details'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">PUT /api/v1/admin/events/{editItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto text-xs text-slate-700">
              {/* Event Title */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Tiêu đề sự kiện *' : 'Event Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              {/* Organizer Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isVi ? 'Đơn vị tổ chức *' : 'Organizer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.organizer_name}
                    onChange={(e) => setEditForm({ ...editForm, organizer_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isVi ? 'Email liên hệ' : 'Contact Email'}
                  </label>
                  <input
                    type="email"
                    value={editForm.organizer_email}
                    onChange={(e) => setEditForm({ ...editForm, organizer_email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isVi ? 'Địa điểm tổ chức (location)' : 'Location'}
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isVi ? 'Ngày bắt đầu' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={editForm.start_time}
                    onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>
              </div>

              {/* Banner URL */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Đường dẫn ảnh bìa / Poster (banner_url)' : 'Banner URL'}
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={editForm.banner_url}
                    onChange={(e) => setEditForm({ ...editForm, banner_url: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                  {editForm.banner_url && (
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img
                        src={editForm.banner_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Mô tả chi tiết sự kiện' : 'Description'}
                </label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer font-medium"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmittingEdit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Lưu thay đổi' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL: PUT /api/v1/admin/events/{id}/review */}
      {reviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isVi ? 'Xét duyệt Hồ sơ Sự kiện' : 'Review Event Proposal'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">PUT /api/v1/admin/events/{reviewItem.id}/review</p>
                </div>
              </div>
              <button
                onClick={() => setReviewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4 overflow-y-auto text-xs text-slate-700">
              {/* Event Info Card */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Sự kiện:</span>
                  {renderRiskBadge(reviewItem.ai_risk_score)}
                </div>
                <div className="text-sm font-bold text-slate-900">{reviewItem.title}</div>
                <div className="text-[11px] text-slate-500">
                  Đơn vị: <span className="text-slate-800 font-medium">{getOrganizerName(reviewItem.organizer)}</span>
                </div>
              </div>

              {/* Decision Choice */}
              <div>
                <label className="block text-slate-700 font-semibold mb-2">
                  {isVi ? 'Quyết định phê duyệt *' : 'Approval Decision *'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, status: 'Approved' })}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${reviewForm.status === 'Approved'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isVi ? 'Phê Duyệt (Approved)' : 'Approve'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, status: 'Rejected' })}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${reviewForm.status === 'Rejected'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{isVi ? 'Từ Chối (Rejected)' : 'Reject'}</span>
                  </button>
                </div>
              </div>

              {/* Admin Note: admin_note */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Ghi chú kiểm duyệt (admin_note)' : 'Admin Review Note (admin_note)'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewForm.admin_note}
                  onChange={(e) => setReviewForm({ ...reviewForm, admin_note: e.target.value })}
                  placeholder={
                    isVi
                      ? 'Nhập lý do phê duyệt hoặc lý do từ chối (vd: Hồ sơ giấy phép địa điểm đầy đủ hợp lệ...)'
                      : 'Enter administrative reason or note...'
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewItem(null)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer font-medium"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className={`px-4 py-2 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs ${reviewForm.status === 'Approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                >
                  {isSubmittingReview && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {reviewForm.status === 'Approved'
                      ? isVi ? 'Xác nhận Duyệt' : 'Confirm Approve'
                      : isVi ? 'Xác nhận Từ chối' : 'Confirm Reject'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL: GET /api/v1/admin/events/{id} */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header image banner */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              {detailItem.banner_url ? (
                <img
                  src={detailItem.banner_url}
                  alt={detailItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                  <Calendar className="w-16 h-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/30" />

              <button
                onClick={() => setDetailItem(null)}
                className="absolute top-4 right-4 p-1.5 text-white hover:text-slate-200 rounded-lg bg-black/40 border border-white/20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-1.5">
                  {renderStatusBadge(detailItem.status)}
                  {renderRiskBadge(detailItem.ai_risk_score)}
                </div>
                <h2 className="text-lg font-black text-white">{detailItem.title}</h2>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-700">
              {/* Event ID */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Event ID (UUID)</div>
                  <div className="font-mono text-slate-800 font-semibold mt-0.5">{detailItem.id}</div>
                </div>
                <button
                  onClick={() => handleCopyId(detailItem.id)}
                  className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-1 text-[11px] shadow-xs cursor-pointer"
                >
                  {copiedId === detailItem.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === detailItem.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Organizer & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold flex items-center gap-1 mb-1">
                    <Building2 className="w-3 h-3 text-indigo-600" />
                    <span>{isVi ? 'Đơn vị tổ chức' : 'Organizer'}</span>
                  </div>
                  <div className="text-slate-900 font-bold">{getOrganizerName(detailItem.organizer)}</div>
                  {getOrganizerEmail(detailItem.organizer) && (
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {getOrganizerEmail(detailItem.organizer)}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{isVi ? 'Địa điểm' : 'Location'}</span>
                  </div>
                  <div className="text-slate-900 font-bold">{detailItem.location || 'Chưa cập nhật'}</div>
                  {detailItem.start_time && (
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {new Date(detailItem.start_time).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Types */}
              {detailItem.ticket_types && detailItem.ticket_types.length > 0 && (
                <div>
                  <h4 className="text-slate-800 font-bold mb-2 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-purple-600" />
                    <span>{isVi ? 'Các hạng vé đang mở bán' : 'Ticket Classes & Pricing'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {detailItem.ticket_types.map((ticket, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{ticket.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {isVi ? `Số lượng: ${ticket.total} vé` : `Capacity: ${ticket.total}`}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-indigo-600">
                          {formatCurrency(ticket.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {detailItem.description && (
                <div>
                  <h4 className="text-slate-800 font-bold mb-1">
                    {isVi ? 'Mô tả chương trình' : 'Event Description'}
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line">
                    {detailItem.description}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <button
                onClick={() => {
                  const item = detailItem;
                  setDetailItem(null);
                  setDeleteItem(item);
                }}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isVi ? 'Gỡ sự kiện' : 'Delete'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailItem(null)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs cursor-pointer font-medium"
                >
                  {isVi ? 'Đóng' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    const item = detailItem;
                    setDetailItem(null);
                    setReviewItem(item);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Xét duyệt' : 'Review'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL: DELETE /api/v1/admin/events/{id} */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-6 text-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isVi ? 'Gỡ bỏ sự kiện khỏi hệ thống?' : 'Remove Event?'}
              </h3>
              <p className="text-slate-600 mt-1">
                {isVi
                  ? `Bạn có chắc chắn muốn gỡ sự kiện vi phạm "${deleteItem.title}" (ID: ${deleteItem.id})? Hành động này sẽ hủy mọi quyền hiển thị và bán vé.`
                  : `Are you sure you want to remove event "${deleteItem.title}"?`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteItem(null)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg cursor-pointer"
              >
                {isVi ? 'Hủy bỏ' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={isSubmittingDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {isSubmittingDelete && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVi ? 'Xác nhận gỡ sự kiện' : 'Confirm Remove'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Ticket Checkin Modal */}
      <AdminTicketCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
      />
    </div>
  );
}
