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
  Plus,
  Image as ImageIcon,
  Star,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Send,
  XCircle,
  Pencil,
  Pin,
  WifiOff,
} from 'lucide-react';

// Data item interface matching list API:
export interface AdminContentItem {
  id: string;
  title: string;
  author: string | { id?: string; name?: string };
  status: 'Pending' | 'Published' | 'Approved' | 'Rejected' | 'Flagged' | string;
  created_at?: string;
  createdAt?: string;
  category_id?: string;
  category?: string;
  description?: string;
  body?: string;
  is_featured?: boolean;
  is_pinned?: boolean;
  views?: number;
  [key: string]: any;
}

export interface ContentMedia {
  url: string;
  type?: string;
}

// Data detail interface matching GET /api/v1/admin/contents/{id}
export interface AdminContentDetail {
  id: string;
  title: string;
  body: string;
  media?: ContentMedia[];
  author?: {
    id?: string;
    name?: string;
  };
  status: string;
  created_at?: string;
  category_id?: string;
  is_pinned?: boolean;
  is_featured?: boolean;
}

export interface ApiResponseMeta {
  total: number;
  page: number;
  limit?: number;
}



export default function AdminEventsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // API State
  const [contents, setContents] = useState<AdminContentItem[]>([]);
  const [meta, setMeta] = useState<ApiResponseMeta>({ total: 0, page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);

  // Filters state (matching API: ?status=Pending|Published|Flagged&category_id=...&page=1&limit=20)
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Published' | 'Flagged'>('all');
  const [categoryIdFilter, setCategoryIdFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // 1. DETAIL MODAL STATE: GET /api/v1/admin/contents/{id}
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<AdminContentDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // 2. REVIEW MODAL STATE: PUT /api/v1/admin/contents/{id}/review
  // Body: { "action": "Approve | Reject", "reject_reason": "..." }
  const [reviewModalItem, setReviewModalItem] = useState<AdminContentItem | null>(null);
  const [reviewAction, setReviewAction] = useState<'Approve' | 'Reject'>('Approve');
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // 3. CREATE MODAL STATE: POST /api/v1/admin/contents
  // Body: { "title": "...", "body": "...", "category_id": "...", "is_featured": true, "media_urls": ["..."] }
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    body: '',
    category_id: 'cat_event',
    is_featured: false,
    media_url_input: '',
    media_urls: [] as string[],
  });
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // 4. EDIT MODAL STATE: PUT /api/v1/admin/contents/{id}
  // Body: { "title": "...", "body": "...", "is_pinned": true }
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminContentItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    body: '',
    is_pinned: false,
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // 5. DELETE MODAL STATE: DELETE /api/v1/admin/contents/{id}
  const [deleteItem, setDeleteItem] = useState<AdminContentItem | null>(null);
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

  // Fetch Content List: GET /api/v1/admin/contents?status=...&category_id=...&page=...&limit=...
  const fetchContents = useCallback(async () => {
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
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    }
    if (categoryIdFilter !== 'all' && categoryIdFilter.trim()) {
      params.set('category_id', categoryIdFilter.trim());
    }
    params.set('page', String(page));
    params.set('limit', String(limit));

    const endpoint = `/api/v1/admin/contents?${params.toString()}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const resJson = await response.json();

      if (resJson && Array.isArray(resJson.data)) {
        setContents(resJson.data);
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
        setContents(resJson);
        setMeta({ total: resJson.length, page: 1, limit });
      } else {
        throw new Error('Invalid format');
      }
    } catch (err) {
      console.warn('Backend API /api/v1/admin/contents offline or error.', err);
      setIsConnectionError(true);
      setContents([]);
      setMeta({
        total: 0,
        page,
        limit,
      });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, categoryIdFilter, page, limit]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // 1. CALL API: GET /api/v1/admin/contents/{id}
  const handleOpenDetailModal = async (item: AdminContentItem) => {
    setIsDetailModalOpen(true);
    setIsDetailLoading(true);
    setDetailItem(null);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/admin/contents/${encodeURIComponent(item.id)}`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setDetailItem(data);
    } catch (err) {
      console.warn(`GET /api/v1/admin/contents/${item.id} failed, using local item details:`, err);
      const authorObj = typeof item.author === 'object' && item.author !== null
        ? item.author
        : { id: 'usr_xxx', name: String(item.author || 'User B') };

      setDetailItem({
        id: item.id,
        title: item.title,
        body: item.body || item.description || 'Nội dung chi tiết của bài viết được hiển thị tại đây.',
        media: item.media || (item.image ? [{ url: item.image, type: 'Image' }] : []),
        author: authorObj,
        status: item.status || 'Pending',
        created_at: item.created_at || '2026-09-25',
        category_id: item.category_id || item.category,
        is_pinned: item.is_pinned ?? false,
      });
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 2. CALL API: PUT /api/v1/admin/contents/{id}/review
  const handleSubmitReview = async () => {
    if (!reviewModalItem) return;
    setIsSubmittingReview(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload = {
      action: reviewAction,
      reject_reason: reviewAction === 'Reject' ? (rejectReason.trim() || 'Nội dung vi phạm bản quyền hình ảnh') : '',
    };

    const targetUrl = `/api/v1/admin/contents/${encodeURIComponent(reviewModalItem.id)}/review`;

    try {
      const res = await fetch(targetUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const successMsg = resData.message || (reviewAction === 'Approve' ? 'Đã duyệt bài viết thành công' : 'Đã từ chối bài viết thành công');
      const nextStatus = reviewAction === 'Approve' ? 'Published' : 'Flagged';

      setContents((prev) =>
        prev.map((i) => (i.id === reviewModalItem.id ? { ...i, status: nextStatus } : i))
      );

      if (detailItem && detailItem.id === reviewModalItem.id) {
        setDetailItem((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `PUT /api/v1/admin/contents/${reviewModalItem.id}/review [${reviewAction}]`,
      });

      setReviewModalItem(null);
      setRejectReason('');
    } catch (err: any) {
      const nextStatus = reviewAction === 'Approve' ? 'Published' : 'Flagged';
      setContents((prev) =>
        prev.map((i) => (i.id === reviewModalItem.id ? { ...i, status: nextStatus } : i))
      );
      if (detailItem && detailItem.id === reviewModalItem.id) {
        setDetailItem((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }

      setActionToast({
        type: 'warning',
        message: isVi
          ? `Đã cập nhật trạng thái (${reviewAction}) trên giao diện [Offline]`
          : `Review updated to ${reviewAction} [Offline mode]`,
        details: err.message,
      });

      setReviewModalItem(null);
      setRejectReason('');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // 3. CALL API: POST /api/v1/admin/contents
  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.body.trim()) {
      setActionToast({
        type: 'error',
        message: isVi ? 'Vui lòng nhập đầy đủ tiêu đề và nội dung' : 'Please fill in both title and body',
      });
      return;
    }

    setIsSubmittingCreate(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload = {
      title: createForm.title.trim(),
      body: createForm.body.trim(),
      category_id: createForm.category_id,
      is_featured: Boolean(createForm.is_featured),
      media_urls: createForm.media_urls,
    };

    try {
      const res = await fetch('/api/v1/admin/contents', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const newId = resData.id || `cnt_${Date.now().toString().slice(-4)}`;
      const successMsg = resData.message || (isVi ? 'Đăng bài viết thành công!' : 'Content published successfully!');

      const newItem: AdminContentItem = {
        id: newId,
        title: createForm.title.trim(),
        author: { id: 'usr_admin', name: 'Admin Portal' },
        status: 'Published',
        created_at: new Date().toISOString().split('T')[0],
        category_id: createForm.category_id,
        category: createForm.category_id === 'cat_event' ? 'Sự kiện' : 'Thông báo',
        description: createForm.body.slice(0, 120) + '...',
        body: createForm.body,
        media: createForm.media_urls.map((u) => ({ url: u, type: 'Image' })),
        is_featured: createForm.is_featured,
        is_pinned: false,
        views: 0,
      };

      setContents((prev) => [newItem, ...prev]);
      setMeta((prev) => ({ ...prev, total: prev.total + 1 }));

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `ID: ${newId} · POST /api/v1/admin/contents (201 Created)`,
      });

      setCreateForm({
        title: '',
        body: '',
        category_id: 'cat_event',
        is_featured: false,
        media_url_input: '',
        media_urls: [],
      });
      setIsCreateModalOpen(false);
    } catch (err: any) {
      const newId = `cnt_${Date.now().toString().slice(-4)}`;
      const newItem: AdminContentItem = {
        id: newId,
        title: createForm.title.trim(),
        author: { id: 'usr_admin', name: 'Admin Portal' },
        status: 'Published',
        created_at: new Date().toISOString().split('T')[0],
        category_id: createForm.category_id,
        category: createForm.category_id === 'cat_event' ? 'Sự kiện' : 'Thông báo',
        description: createForm.body.slice(0, 120) + '...',
        body: createForm.body,
        media: createForm.media_urls.map((u) => ({ url: u, type: 'Image' })),
        is_featured: createForm.is_featured,
        is_pinned: false,
        views: 0,
      };

      setContents((prev) => [newItem, ...prev]);
      setMeta((prev) => ({ ...prev, total: prev.total + 1 }));

      setActionToast({
        type: 'warning',
        message: isVi
          ? 'Đã tạo bài viết trên giao diện (Offline mode)'
          : 'Content created locally [Offline]',
        details: `ID: ${newId} · ${err.message}`,
      });

      setCreateForm({
        title: '',
        body: '',
        category_id: 'cat_event',
        is_featured: false,
        media_url_input: '',
        media_urls: [],
      });
      setIsCreateModalOpen(false);
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // 4. CALL API: PUT /api/v1/admin/contents/{id}
  // Request: { "title": "Tiêu đề cập nhật", "body": "Nội dung cập nhật...", "is_pinned": true }
  // Response 200: { "message": "Cập nhật bài viết thành công" }
  const handleOpenEditModal = (item: AdminContentItem) => {
    setEditItem(item);
    setEditForm({
      title: item.title || '',
      body: item.body || item.description || '',
      is_pinned: Boolean(item.is_pinned),
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    if (!editForm.title.trim() || !editForm.body.trim()) {
      setActionToast({
        type: 'error',
        message: isVi ? 'Vui lòng nhập đầy đủ tiêu đề và nội dung' : 'Please fill in both title and body',
      });
      return;
    }

    setIsSubmittingEdit(true);

    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload = {
      title: editForm.title.trim(),
      body: editForm.body.trim(),
      is_pinned: Boolean(editForm.is_pinned),
    };

    try {
      const res = await fetch(`/api/v1/admin/contents/${encodeURIComponent(editItem.id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const successMsg = resData.message || (isVi ? 'Cập nhật bài viết thành công' : 'Content updated successfully');

      // Update state in list
      setContents((prev) =>
        prev.map((i) =>
          i.id === editItem.id
            ? { ...i, title: payload.title, body: payload.body, description: payload.body.slice(0, 120) + '...', is_pinned: payload.is_pinned }
            : i
        )
      );

      // If detail modal is currently showing this item, update it too
      if (detailItem && detailItem.id === editItem.id) {
        setDetailItem((prev) =>
          prev ? { ...prev, title: payload.title, body: payload.body, is_pinned: payload.is_pinned } : null
        );
      }

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `PUT /api/v1/admin/contents/${editItem.id} (200 OK)`,
      });

      setIsEditModalOpen(false);
    } catch (err: any) {
      // Offline fallback
      setContents((prev) =>
        prev.map((i) =>
          i.id === editItem.id
            ? { ...i, title: payload.title, body: payload.body, description: payload.body.slice(0, 120) + '...', is_pinned: payload.is_pinned }
            : i
        )
      );
      if (detailItem && detailItem.id === editItem.id) {
        setDetailItem((prev) =>
          prev ? { ...prev, title: payload.title, body: payload.body, is_pinned: payload.is_pinned } : null
        );
      }

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã cập nhật bài viết trên giao diện (Offline mode)' : 'Content updated locally [Offline]',
        details: `ID: ${editItem.id}`,
      });

      setIsEditModalOpen(false);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // 5. CALL API: DELETE /api/v1/admin/contents/{id}
  // Response 200: { "message": "Đã gỡ bỏ bài viết vi phạm khỏi hệ thống" }
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
      const res = await fetch(`/api/v1/admin/contents/${encodeURIComponent(deleteItem.id)}`, {
        method: 'DELETE',
        headers,
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.message || `Lỗi API HTTP ${res.status}`);
      }

      const successMsg = resData.message || (isVi ? 'Đã gỡ bỏ bài viết vi phạm khỏi hệ thống' : 'Content removed successfully');

      setContents((prev) => prev.filter((item) => item.id !== deleteItem.id));
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      if (detailItem && detailItem.id === deleteItem.id) {
        setIsDetailModalOpen(false);
      }

      setActionToast({
        type: 'success',
        message: successMsg,
        details: `DELETE /api/v1/admin/contents/${deleteItem.id} (200 OK)`,
      });
      setDeleteItem(null);
    } catch (err: any) {
      setContents((prev) => prev.filter((item) => item.id !== deleteItem.id));
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      if (detailItem && detailItem.id === deleteItem.id) {
        setIsDetailModalOpen(false);
      }

      setActionToast({
        type: 'warning',
        message: isVi ? 'Đã gỡ bỏ bài viết vi phạm khỏi hệ thống (Offline mode)' : 'Removed locally from view',
        details: `DELETE /api/v1/admin/contents/${deleteItem.id}`,
      });
      setDeleteItem(null);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Add/remove media URL
  const handleAddMediaUrl = () => {
    const url = createForm.media_url_input.trim();
    if (!url) return;
    if (createForm.media_urls.includes(url)) return;
    setCreateForm((prev) => ({
      ...prev,
      media_urls: [...prev.media_urls, url],
      media_url_input: '',
    }));
  };

  const handleRemoveMediaUrl = (index: number) => {
    setCreateForm((prev) => ({
      ...prev,
      media_urls: prev.media_urls.filter((_, i) => i !== index),
    }));
  };

  // Helpers
  const getAuthorDisplay = (author: any) => {
    if (!author) return 'N/A';
    if (typeof author === 'string') return author;
    return author.name || author.id || 'N/A';
  };

  const handleCopyId = (id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Client search filter
  const displayedItems = useMemo(() => {
    const term = (searchQuery || headerSearch).toLowerCase().trim();
    let res = contents;

    if (term) {
      res = contents.filter((item) => {
        const titleMatch = (item.title || '').toLowerCase().includes(term);
        const authorName = getAuthorDisplay(item.author).toLowerCase();
        const authorMatch = authorName.includes(term);
        const idMatch = (item.id || '').toLowerCase().includes(term);
        const categoryMatch = (item.category || item.category_id || '').toLowerCase().includes(term);
        return titleMatch || authorMatch || idMatch || categoryMatch;
      });
    }

    // Sort pinned items to the top
    return [...res].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return 0;
    });
  }, [contents, searchQuery, headerSearch]);

  // Counts
  const totalCount = meta.total || displayedItems.length;
  const countPending = displayedItems.filter((i) => (i.status || '').toLowerCase() === 'pending').length;
  const countPublished = displayedItems.filter((i) => {
    const s = (i.status || '').toLowerCase();
    return s === 'published' || s === 'approved' || s === 'active';
  }).length;
  const countFlagged = displayedItems.filter((i) => {
    const s = (i.status || '').toLowerCase();
    return s === 'flagged' || s === 'rejected';
  }).length;

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  // Status Badge
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'published' || s === 'active' || s === 'approved') {
      return (
        <span
          style={{ borderRadius: '6px' }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{s === 'approved' ? (isVi ? 'Đã duyệt' : 'Approved') : (isVi ? 'Đã xuất bản' : 'Published')}</span>
        </span>
      );
    }
    if (s === 'flagged' || s === 'rejected' || s === 'banned') {
      return (
        <span
          style={{ borderRadius: '6px' }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>{s === 'rejected' ? (isVi ? 'Từ chối' : 'Rejected') : (isVi ? 'Bị báo cáo' : 'Flagged')}</span>
        </span>
      );
    }
    return (
      <span
        style={{ borderRadius: '6px' }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"
      >
        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>{isVi ? 'Chờ duyệt' : 'Pending'}</span>
      </span>
    );
  };

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-slate-50 text-slate-900 font-sans flex"
    >
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab="contents"
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
          activeTab="events"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto space-y-6">
          {/* Action Toast Alert Banner */}
          {actionToast && (
            <div
              style={{ borderRadius: '10px' }}
              className={`p-3.5 text-xs font-bold flex items-center justify-between gap-3 shadow-md border ${
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
                className="p-1 hover:bg-slate-200 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-slate-600" />
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
                  {isVi ? 'Quản lý Nội dung' : 'Content Management'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Quản Lý Nội Dung & Bài Viết' : 'Content & Post Management'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {totalCount} {isVi ? 'bài viết' : 'posts'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Quản lý bài viết, kiểm duyệt nội dung công khai, ghim bài và xử lý báo cáo.'
                  : 'Manage articles, review public submissions, pin featured posts, and resolve flags.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={fetchContents}
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
                onClick={() => setIsCreateModalOpen(true)}
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
                <span>{isVi ? 'ĐĂNG BÀI MỚI' : 'CREATE NEW POST'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{isVi ? 'Tổng nội dung' : 'Total Items'}</span>
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalCount}</div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">meta.total: {meta.total}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{isVi ? 'Chờ duyệt' : 'Pending Review'}</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">{countPending}</div>
              <div className="text-[11px] text-slate-400 mt-1">status=Pending</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{isVi ? 'Đã duyệt / Xuất bản' : 'Approved / Published'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">{countPublished}</div>
              <div className="text-[11px] text-slate-400 mt-1">status=Published</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{isVi ? 'Bị từ chối / Báo cáo' : 'Rejected / Flagged'}</span>
                <Flag className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600">{countFlagged}</div>
              <div className="text-[11px] text-slate-400 mt-1">status=Flagged</div>
            </div>
          </div>

          {/* Filtering and Search Controls */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 overflow-x-auto">
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isVi ? 'Tất cả' : 'All'}
                </button>
                <button
                  onClick={() => {
                    setStatusFilter('Pending');
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    statusFilter === 'Pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-amber-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Chờ duyệt (Pending)' : 'Pending'}</span>
                </button>
                <button
                  onClick={() => {
                    setStatusFilter('Published');
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    statusFilter === 'Published'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Đã xuất bản (Published)' : 'Published'}</span>
                </button>
                <button
                  onClick={() => {
                    setStatusFilter('Flagged');
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    statusFilter === 'Flagged'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-rose-700'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Bị báo cáo (Flagged)' : 'Flagged'}</span>
                </button>
              </div>

              {/* View switch & page size */}
              <div className="flex items-center gap-3 self-end lg:self-auto">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Bảng biểu (Table)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Dạng lưới (Grid)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{isVi ? 'Hiển thị:' : 'Limit:'}</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer shadow-xs"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Input & Category Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Tìm kiếm theo tiêu đề, tác giả, mã ID (cnt_xxx)...'
                      : 'Search by title, author, or ID (cnt_xxx)...'
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors shadow-xs"
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

              <div className="relative">
                <select
                  value={categoryIdFilter}
                  onChange={(e) => {
                    setCategoryIdFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 cursor-pointer appearance-none shadow-xs"
                >
                  <option value="all">{isVi ? 'Tất cả danh mục' : 'All Categories'}</option>
                  <option value="cat_event">{isVi ? 'Sự kiện (Event)' : 'Events'}</option>
                  <option value="cat_review">Review</option>
                  <option value="cat_announcement">{isVi ? 'Thông báo' : 'Announcement'}</option>
                  <option value="cat_report">{isVi ? 'Báo cáo vi phạm' : 'Reports'}</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Content List Table / Grid */}
          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">
                {isVi ? 'Đang tải danh sách bài viết...' : 'Fetching contents from API...'}
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
                    onClick={fetchContents}
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
          ) : displayedItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {isVi ? 'Không tìm thấy nội dung nào' : 'No contents found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                {isVi
                  ? 'Không có dữ liệu bài viết hoặc sự kiện phù hợp với bộ lọc hiện tại.'
                  : 'No records matching the selected status or query filters.'}
              </p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCategoryIdFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
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
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">{isVi ? 'Tiêu đề nội dung' : 'Title'}</th>
                    <th className="py-3 px-4">{isVi ? 'Tác giả' : 'Author'}</th>
                    <th className="py-3 px-4">{isVi ? 'Trạng thái' : 'Status'}</th>
                    <th className="py-3 px-4">{isVi ? 'Ngày tạo' : 'Created At'}</th>
                    <th className="py-3 px-4 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedItems.map((item) => (
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

                      {/* Title - Click opens Detail Modal (GET /api/v1/admin/contents/{id}) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {item.is_pinned && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shrink-0">
                              <Pin className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                              <span>Ghim</span>
                            </span>
                          )}
                          <button
                            onClick={() => handleOpenDetailModal(item)}
                            className="font-bold text-slate-900 hover:text-indigo-600 text-left max-w-[360px] line-clamp-2 leading-relaxed cursor-pointer transition-colors"
                          >
                            {item.title}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {item.is_featured && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>Featured</span>
                            </span>
                          )}
                          {(item.category || item.category_id) && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                              {item.category || item.category_id}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] border border-indigo-200">
                            {getAuthorDisplay(item.author).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{getAuthorDisplay(item.author)}</div>
                            {typeof item.author === 'object' && item.author?.id && (
                              <div className="text-[10px] text-slate-400 font-mono">{item.author.id}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* Created At */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.created_at || item.createdAt || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail: GET /api/v1/admin/contents/{id} */}
                          <button
                            onClick={() => handleOpenDetailModal(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                            title={isVi ? 'Xem chi tiết (GET /{id})' : 'View Details'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Content: PUT /api/v1/admin/contents/{id} */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
                            title={isVi ? 'Cập nhật bài viết (PUT /{id})' : 'Edit Content'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Quick Review: PUT /api/v1/admin/contents/{id}/review */}
                          <button
                            onClick={() => {
                              setReviewModalItem(item);
                              setReviewAction('Approve');
                              setRejectReason('');
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                            title={isVi ? 'Duyệt bài viết (PUT /review)' : 'Approve Content'}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setReviewModalItem(item);
                              setReviewAction('Reject');
                              setRejectReason('');
                            }}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
                            title={isVi ? 'Từ chối bài viết (PUT /review)' : 'Reject Content'}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>

                          {/* Delete Item: DELETE /api/v1/admin/contents/{id} */}
                          <button
                            onClick={() => setDeleteItem(item)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                            title={isVi ? 'Gỡ bỏ bài viết (DELETE /{id})' : 'Delete'}
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
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl bg-white border ${
                    item.is_pinned ? 'border-indigo-300 shadow-md ring-1 ring-indigo-200' : 'border-slate-200/80 shadow-xs'
                  } hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-indigo-600">
                        <span>{item.id}</span>
                        <button
                          onClick={() => handleCopyId(item.id)}
                          className="p-0.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.is_pinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                            <Pin className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                            <span>Ghim</span>
                          </span>
                        )}
                        {renderStatusBadge(item.status)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenDetailModal(item)}
                      className="text-left font-bold text-slate-900 hover:text-indigo-600 text-sm line-clamp-2 mb-2 leading-snug cursor-pointer transition-colors"
                    >
                      {item.title}
                    </button>

                    {item.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{getAuthorDisplay(item.author)}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.created_at || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    {item.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                        {item.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                        title="Chỉnh sửa (PUT /{id})"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDetailModal(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                      >
                        {isVi ? 'Xem' : 'View'}
                      </button>
                      <button
                        onClick={() => {
                          setReviewModalItem(item);
                          setReviewAction('Approve');
                          setRejectReason('');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        {isVi ? 'Duyệt' : 'Approve'}
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
                ? `Hiển thị ${displayedItems.length} trên tổng ${totalCount} mục (Trang ${page} / ${totalPages})`
                : `Showing ${displayedItems.length} of ${totalCount} entries (Page ${page} of ${totalPages})`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isVi ? 'Trước' : 'Prev'}</span>
              </button>

              <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-indigo-700">
                {page} / {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <span>{isVi ? 'Sau' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* 1. DETAIL MODAL (GET /api/v1/admin/contents/{id}) */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isVi ? 'Chi Tiết Bài Viết (GET /contents/{id})' : 'Content Details'}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {isDetailLoading ? (
                <div className="py-12 text-center">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                  <p className="text-slate-500 font-semibold">Đang tải dữ liệu từ GET /api/v1/admin/contents/{'{id}'}...</p>
                </div>
              ) : detailItem ? (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono">ID:</span>
                      <span className="text-indigo-600 font-bold font-mono">{detailItem.id}</span>
                      {detailItem.is_pinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                          <Pin className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                          <span>Ghim</span>
                        </span>
                      )}
                    </div>
                    <div>{renderStatusBadge(detailItem.status)}</div>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      {isVi ? 'Tiêu đề bài viết (title):' : 'Title:'}
                    </label>
                    <div className="text-slate-900 text-base font-bold p-3 bg-slate-50 rounded-lg border border-slate-200">
                      {detailItem.title}
                    </div>
                  </div>

                  {/* Author Object { id: "usr_xxx", name: "User B" } */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-slate-500 font-semibold mb-1">{isVi ? 'Tác giả (author):' : 'Author:'}</div>
                      <div className="text-slate-900 font-bold flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        <span>{getAuthorDisplay(detailItem.author)}</span>
                      </div>
                      {typeof detailItem.author === 'object' && detailItem.author?.id && (
                        <div className="text-[11px] text-slate-400 font-mono mt-1">ID: {detailItem.author.id}</div>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-slate-500 font-semibold mb-1">{isVi ? 'Thời gian tạo:' : 'Created At:'}</div>
                      <div className="text-slate-900 font-mono mt-1">{detailItem.created_at || '2026-09-25'}</div>
                    </div>
                  </div>

                  {/* Media Array: [{ url: "...", type: "Image" }] */}
                  {detailItem.media && detailItem.media.length > 0 && (
                    <div>
                      <label className="text-slate-600 font-semibold block mb-2 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-indigo-600" />
                        <span>{isVi ? `Hình ảnh / Phương tiện đính kèm (${detailItem.media.length}):` : 'Attached Media:'}</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {detailItem.media.map((m, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center"
                          >
                            <img
                              src={m.url}
                              alt={`media-${idx}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop';
                              }}
                            />
                            <a
                              href={m.url}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity gap-1 text-[11px] font-bold"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Mở ảnh</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      {isVi ? 'Nội dung chi tiết (body):' : 'Content Body:'}
                    </label>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap text-xs">
                      {detailItem.body || 'Không có nội dung chi tiết.'}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-500">Không tìm thấy dữ liệu.</div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
                >
                  {isVi ? 'Đóng' : 'Close'}
                </button>
                {detailItem && (
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenEditModal(detailItem as any);
                    }}
                    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Chỉnh sửa' : 'Edit'}</span>
                  </button>
                )}
              </div>

              {detailItem && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setReviewModalItem(detailItem as any);
                      setReviewAction('Reject');
                      setRejectReason('');
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Từ chối (Reject)' : 'Reject'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setReviewModalItem(detailItem as any);
                      setReviewAction('Approve');
                      setRejectReason('');
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Duyệt bài (Approve)' : 'Approve'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. REVIEW MODAL (PUT /api/v1/admin/contents/{id}/review) */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isVi ? 'Kiểm Duyệt Bài Viết (PUT /review)' : 'Review Content'}
                </h3>
              </div>
              <button
                onClick={() => setReviewModalItem(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 mb-1">{isVi ? 'Bài viết cần duyệt:' : 'Target Content:'}</div>
                <div className="text-slate-900 font-bold line-clamp-2">{reviewModalItem.title}</div>
                <div className="text-[11px] text-indigo-600 font-mono mt-1">ID: {reviewModalItem.id}</div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-2">
                  {isVi ? 'Hành động kiểm duyệt (action):' : 'Review Action:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewAction('Approve')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      reviewAction === 'Approve'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Approve (Duyệt)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewAction('Reject')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      reviewAction === 'Reject'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Reject (Từ chối)</span>
                  </button>
                </div>
              </div>

              {reviewAction === 'Reject' && (
                <div className="animate-in fade-in duration-200">
                  <label className="text-slate-700 font-bold block mb-1.5">
                    {isVi ? 'Lý do từ chối (reject_reason):' : 'Rejection Reason:'}
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Ví dụ: Nội dung vi phạm bản quyền hình ảnh, spam quảng cáo..."
                    rows={3}
                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-rose-500 placeholder-slate-400 shadow-xs"
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setReviewModalItem(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
              >
                {isVi ? 'Hủy' : 'Cancel'}
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className={`px-4 py-2 font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5 text-white shadow-xs ${
                  reviewAction === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isSubmittingReview && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVi ? `Xác nhận ${reviewAction}` : `Confirm ${reviewAction}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CREATE MODAL (POST /api/v1/admin/contents) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isVi ? 'Đăng Bài Viết / Sự Kiện Mới (POST /contents)' : 'Publish New Content / Event'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {isVi ? 'Tiêu đề bài viết (title) *' : 'Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Ví dụ: Thông báo Sự kiện Chung kết Thế Giới..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-slate-400 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">
                    {isVi ? 'Danh mục (category_id)' : 'Category'}
                  </label>
                  <select
                    value={createForm.category_id}
                    onChange={(e) => setCreateForm({ ...createForm, category_id: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 cursor-pointer shadow-xs"
                  >
                    <option value="cat_event">{isVi ? 'Sự kiện (cat_event)' : 'Event'}</option>
                    <option value="cat_announcement">{isVi ? 'Thông báo (cat_announcement)' : 'Announcement'}</option>
                    <option value="cat_review">Review</option>
                    <option value="cat_news">{isVi ? 'Tin tức (cat_news)' : 'News'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">
                    {isVi ? 'Nổi bật (is_featured)' : 'Featured'}
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.is_featured}
                      onChange={(e) => setCreateForm({ ...createForm, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-slate-700 font-semibold">{isVi ? 'Đánh dấu Nổi bật / Featured' : 'Mark as Featured'}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {isVi ? 'Danh sách URL Hình ảnh (media_urls):' : 'Media URLs:'}
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="url"
                    value={createForm.media_url_input}
                    onChange={(e) => setCreateForm({ ...createForm, media_url_input: e.target.value })}
                    placeholder="https://example.com/banner.jpg"
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-slate-400 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddMediaUrl}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-indigo-700 font-bold rounded-lg border border-slate-300 cursor-pointer shadow-xs"
                  >
                    {isVi ? 'Thêm ảnh' : 'Add'}
                  </button>
                </div>

                {createForm.media_urls.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 rounded-lg bg-slate-50 border border-slate-200">
                    {createForm.media_urls.map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] bg-white px-2.5 py-1.5 rounded border border-slate-200 shadow-2xs">
                        <span className="truncate max-w-[360px] text-slate-700 font-mono">{url}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMediaUrl(idx)}
                          className="text-rose-500 hover:text-rose-700 ml-2 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {isVi ? 'Nội dung chi tiết (body) *' : 'Body *'}
                </label>
                <textarea
                  required
                  rows={5}
                  value={createForm.body}
                  onChange={(e) => setCreateForm({ ...createForm, body: e.target.value })}
                  placeholder={
                    isVi
                      ? 'Nhập nội dung chi tiết bài viết, lịch trình, điều kiện tham dự sự kiện...'
                      : 'Enter detailed content...'
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-slate-400 shadow-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/50 -mx-6 -mb-6 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmittingCreate && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <Send className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Đăng bài viết (POST)' : 'Submit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. EDIT MODAL (PUT /api/v1/admin/contents/{id}) */}
      {isEditModalOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isVi ? 'Chỉnh Sửa Bài Viết (PUT /contents/{id})' : 'Edit Content'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-mono">ID:</span>
                <span className="text-indigo-600 font-bold font-mono">{editItem.id}</span>
              </div>

              {/* Title */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {isVi ? 'Tiêu đề cập nhật (title) *' : 'Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Tiêu đề cập nhật..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
                />
              </div>

              {/* Is Pinned Checkbox */}
              <div>
                <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={editForm.is_pinned}
                    onChange={(e) => setEditForm({ ...editForm, is_pinned: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <Pin className="w-4 h-4 text-indigo-600" />
                    <span>{isVi ? 'Ghim bài viết lên đầu trang (is_pinned)' : 'Pin this content to top (is_pinned)'}</span>
                  </div>
                </label>
              </div>

              {/* Body */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {isVi ? 'Nội dung cập nhật (body) *' : 'Body *'}
                </label>
                <textarea
                  required
                  rows={6}
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                  placeholder="Nội dung cập nhật..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-slate-400 leading-relaxed shadow-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/50 -mx-6 -mb-6 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmittingEdit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Lưu cập nhật (PUT)' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL (DELETE /api/v1/admin/contents/{id}) */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-6 text-xs text-center space-y-4 text-slate-900">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isVi ? 'Gỡ bỏ bài viết vi phạm?' : 'Remove Content?'}
              </h3>
              <p className="text-slate-500 mt-1">
                {isVi
                  ? `Bạn có chắc chắn muốn gỡ bỏ bài viết "${deleteItem.title}" (${deleteItem.id}) khỏi hệ thống?`
                  : `Are you sure you want to remove "${deleteItem.title}"?`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteItem(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-lg cursor-pointer shadow-xs"
              >
                {isVi ? 'Hủy bỏ' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={isSubmittingDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {isSubmittingDelete && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVi ? 'Gỡ bỏ bài viết' : 'Confirm Remove'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
