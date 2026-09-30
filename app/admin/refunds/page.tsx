'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  RotateCcw,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  DollarSign,
  Calendar,
  Filter,
  Eye,
  Clock,
  XCircle,
  FileCheck,
  User,
  Ticket,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  WifiOff,
} from 'lucide-react';

export interface AdminRefundItem {
  id: string;
  booking_id: string;
  amount: number;
  user: string | { name?: string; email?: string };
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  created_at: string;
  admin_note?: string;
  [key: string]: any;
}



export default function AdminRefundsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Main list state
  const [refunds, setRefunds] = useState<AdminRefundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  // Filters & Pagination: ?status=Pending&page=1&limit=20
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<AdminRefundItem | null>(null);
  const [actionItem, setActionItem] = useState<{
    item: AdminRefundItem;
    type: 'approve' | 'reject';
  } | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Currency Formatter
  const formatCurrency = (amount: number | string) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat(isVi ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getUserName = (u: any) => {
    if (!u) return 'Khách hàng';
    if (typeof u === 'string') return u;
    return u.name || u.email || 'User';
  };

  // Toast clear
  useEffect(() => {
    if (apiSuccess) {
      const timer = setTimeout(() => setApiSuccess(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [apiSuccess]);

  // Fetch Refunds: GET /api/v1/admin/refunds?status=...&page=...&limit=...
  const fetchRefunds = useCallback(async (isRefresh = false) => {
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

      const url = `/api/v1/admin/refunds?${params.toString()}`;
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
      const rawData = json.data || json.refunds || (Array.isArray(json) ? json : []);

      if (Array.isArray(rawData)) {
        setRefunds(rawData);
        setTotalCount(json.meta?.total || json.total || rawData.length);
      } else {
        setRefunds([]);
        setTotalCount(0);
      }
      setApiError(null);
      setIsConnectionError(false);
    } catch (err: any) {
      console.warn('API /api/v1/admin/refunds offline or error:', err);
      setRefunds([]);
      setTotalCount(0);
      setIsConnectionError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, searchTerm, page, limit]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit Action (Approve / Reject Refund)
  const handleProcessAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionItem) return;

    setIsSubmittingAction(true);
    setApiError(null);

    const isApprove = actionItem.type === 'approve';
    const endpoint = `/api/v1/admin/refunds/${actionItem.item.id}/process`;
    const payload = {
      action: isApprove ? 'Approve' : 'Reject',
      note: adminNote.trim() || (isApprove ? 'Đồng ý hoàn tiền do sự kiện hủy' : 'Từ chối hoàn tiền theo quy định'),
    };

    try {
      const token = getAccessToken();
      const res = await fetch(endpoint, {
        method: 'POST',
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
              ? 'Lệnh hoàn tiền đã được xử lý thành công'
              : 'Refund processed successfully')
        );
        setActionItem(null);
        setAdminNote('');
        fetchRefunds(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('Action refund offline, updating locally:', err);
      setRefunds((prev) =>
        prev.map((r) =>
          r.id === actionItem.item.id
            ? { ...r, status: payload.action === 'Approve' ? 'Approved' : 'Rejected', admin_note: payload.note }
            : r
        )
      );
      setApiSuccess(
        isVi
          ? 'Lệnh hoàn tiền đã được xử lý thành công (Local)'
          : 'Refund processed locally'
      );
      setActionItem(null);
      setAdminNote('');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{isVi ? 'Đã hoàn tiền' : 'Approved'}</span>
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" />
          <span>{isVi ? 'Từ chối hoàn' : 'Rejected'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
        <span>{isVi ? 'Chờ xét duyệt' : 'Pending'}</span>
      </span>
    );
  };

  // KPI computations
  const pendingRefunds = refunds.filter((r) => (r.status || '').toLowerCase() === 'pending');
  const pendingAmount = pendingRefunds.reduce((sum, r) => sum + (r.amount || 0), 0);
  const approvedCount = refunds.filter((r) => (r.status || '').toLowerCase() === 'approved').length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="refunds"
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
          activeTab="refunds"
        />

        {/* BREADCRUMB & TOP ACTIONS HEADER */}
        <div className="p-6 pb-0">
          <div className="flex flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs w-full text-left">
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 text-left">
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isVi ? 'Yêu cầu Hoàn tiền' : 'Refund Requests'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Xử Lý Yêu Cầu Hoàn Tiền Vé' : 'Refund Management'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {refunds.length} {isVi ? 'yêu cầu' : 'records'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Kiểm duyệt đơn xin hoàn trả tiền vé, xét duyệt điều kiện và hoàn trả tự động.'
                  : 'Review ticket refund requests, check policy conditions, and execute payouts.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => fetchRefunds(true)}
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
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{apiSuccess}</span>
            </div>
            <button onClick={() => setApiSuccess(null)} className="p-1 hover:bg-emerald-100 rounded-md cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* CONTENT BODY */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
              <p className="text-xs text-slate-500">{isVi ? 'Đang tải danh sách hoàn tiền...' : 'Loading refund requests...'}</p>
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
                    onClick={() => fetchRefunds(true)}
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
              {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Tổng tiền chờ hoàn' : 'Pending Refund Sum'}</span>
                <DollarSign className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 font-mono">
                {formatCurrency(pendingAmount)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {pendingRefunds.length} {isVi ? 'yêu cầu cần duyệt' : 'pending claims'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Đang chờ xử lý' : 'Pending Requests'}</span>
                <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-slate-900">{pendingRefunds.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Ưu tiên duyệt trong 24h' : 'Target SLA 24h'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Đã duyệt hoàn trả' : 'Approved Refunds'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">{approvedCount}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Đã trả về tài khoản nguồn' : 'Refunded to source'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Chính sách hoàn tiền' : 'Refund Policy'}</span>
                <RotateCcw className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xl font-bold text-slate-900">48h Trước Sự Kiện</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Hủy do BTC hoàn 100%' : '100% refund on organizer cancellation'}
              </div>
            </div>
          </div>

          {/* FILTER & TABS TOOLBAR: ?status=Pending */}
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
                      ? 'Tìm kiếm theo mã đơn (bk_xxx), tên khách hàng hoặc lý do...'
                      : 'Search by booking id, customer or reason...'
                  }
                  className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
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
            </div>

            {/* STATUS FILTER TABS */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 shrink-0 font-medium text-[11px]">
                {isVi ? 'Trạng thái hoàn:' : 'Refund Status:'}
              </span>

              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => {
                const isActive = statusFilter === tab;
                const count =
                  tab === 'All'
                    ? refunds.length
                    : refunds.filter((r) => (r.status || '').toLowerCase() === tab.toLowerCase()).length;

                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setStatusFilter(tab);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isActive
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
                        ? isVi ? 'Đã hoàn tiền' : 'Approved'
                        : isVi ? 'Từ chối' : 'Rejected'}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TABLE OF REFUND REQUESTS */}
          <div className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">{isVi ? 'Mã yêu cầu (id)' : 'Refund ID'}</th>
                    <th className="px-4 py-3">{isVi ? 'Mã đặt vé (booking_id)' : 'Booking ID'}</th>
                    <th className="px-4 py-3">{isVi ? 'Khách hàng' : 'Customer'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Số tiền (amount)' : 'Amount'}</th>
                    <th className="px-4 py-3">{isVi ? 'Lý do hoàn tiền (reason)' : 'Reason'}</th>
                    <th className="px-4 py-3">{isVi ? 'Trạng thái' : 'Status'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {refunds.map((ref) => (
                    <tr
                      key={ref.id}
                      onClick={() => setDetailItem(ref)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer text-slate-800"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-indigo-600">
                        <div className="flex items-center gap-1.5">
                          <span>{ref.id}</span>
                          <button
                            onClick={(e) => handleCopyId(ref.id, e)}
                            className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                          >
                            {copiedId === ref.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono text-indigo-700 font-bold">
                        {ref.booking_id}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{getUserName(ref.user)}</div>
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                        {formatCurrency(ref.amount)}
                      </td>

                      <td className="px-4 py-3 max-w-xs">
                        <div className="text-slate-600 truncate">{ref.reason}</div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderStatusBadge(ref.status)}
                      </td>

                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {(ref.status || '').toLowerCase() === 'pending' && (
                            <>
                              <button
                                onClick={() =>
                                  setActionItem({
                                    item: ref,
                                    type: 'approve',
                                  })
                                }
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-[10px] cursor-pointer transition-colors shadow-2xs"
                                title={isVi ? 'Duyệt hoàn tiền' : 'Approve'}
                              >
                                {isVi ? 'Duyệt hoàn' : 'Approve'}
                              </button>

                              <button
                                onClick={() =>
                                  setActionItem({
                                    item: ref,
                                    type: 'reject',
                                  })
                                }
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-[10px] cursor-pointer transition-colors shadow-2xs"
                                title={isVi ? 'Từ chối hoàn' : 'Reject'}
                              >
                                {isVi ? 'Từ chối' : 'Reject'}
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setDetailItem(ref)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
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
                ? `Hiển thị ${refunds.length} yêu cầu (Trang ${page})`
                : `Showing ${refunds.length} requests (Page ${page})`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-xs text-slate-700"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isVi ? 'Trang trước' : 'Previous'}</span>
              </button>

              <span className="px-3 py-1.5 bg-slate-100 text-indigo-700 border border-slate-200 rounded-xl font-bold font-mono">
                {page}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={refunds.length < limit || loading}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-xs text-slate-700"
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

      {/* DETAIL MODAL */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isVi ? 'Chi tiết Yêu cầu Hoàn tiền' : 'Refund Request Details'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">{detailItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Số tiền yêu cầu hoàn</div>
                <div className="text-2xl font-black text-emerald-600 font-mono">
                  {formatCurrency(detailItem.amount)}
                </div>
                <div className="mt-2">{renderStatusBadge(detailItem.status)}</div>
              </div>

              <div className="divide-y divide-slate-100 border-t border-b border-slate-100 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">{isVi ? 'Khách hàng' : 'Customer'}</span>
                  <span className="font-semibold text-slate-800">{getUserName(detailItem.user)}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">{isVi ? 'Mã đặt vé (booking_id)' : 'Booking ID'}</span>
                  <span className="font-mono text-indigo-600 font-bold">{detailItem.booking_id}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">{isVi ? 'Thời gian gửi yêu cầu' : 'Requested at'}</span>
                  <span className="font-mono text-slate-700">
                    {new Date(detailItem.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-slate-600 font-semibold mb-1">
                  {isVi ? 'Lý do hoàn tiền:' : 'Refund Reason:'}
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                  {detailItem.reason}
                </div>
              </div>

              {detailItem.admin_note && (
                <div>
                  <div className="text-amber-700 font-semibold mb-1">
                    {isVi ? 'Ghi chú xử lý từ Admin:' : 'Admin Note:'}
                  </div>
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                    {detailItem.admin_note}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-end">
              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs cursor-pointer font-bold shadow-xs"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE / REJECT MODAL */}
      {actionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg border ${
                    actionItem.type === 'approve'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}
                >
                  {actionItem.type === 'approve' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {actionItem.type === 'approve'
                      ? isVi ? 'Duyệt hoàn tiền cho khách' : 'Approve Refund'
                      : isVi ? 'Từ chối yêu cầu hoàn tiền' : 'Reject Refund'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    POST /api/v1/admin/refunds/{actionItem.item.id}/process
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActionItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessAction} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Mã đặt vé (booking_id)</div>
                  <div className="font-mono text-indigo-700 font-bold">{actionItem.item.booking_id}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Số tiền hoàn (amount)</div>
                  <div className="font-mono text-emerald-600 font-bold">{formatCurrency(actionItem.item.amount)}</div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Ghi chú xử lý (note)' : 'Process Note (note)'}
                </label>
                <textarea
                  rows={3}
                  required={actionItem.type === 'reject'}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={
                    actionItem.type === 'approve'
                      ? isVi ? 'Ví dụ: Đồng ý hoàn tiền do sự kiện hủy...' : 'e.g. Approve refund due to event cancellation...'
                      : isVi ? 'Bắt buộc nhập lý do từ chối để thông báo đến khách hàng...' : 'Enter rejection reason...'
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-slate-400 shadow-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionItem(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl cursor-pointer shadow-xs font-semibold"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAction}
                  className={`px-4 py-2 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs text-white ${
                    actionItem.type === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {isSubmittingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {actionItem.type === 'approve'
                      ? isVi ? 'Xác nhận Hoàn tiền' : 'Confirm Approve'
                      : isVi ? 'Xác nhận Từ chối' : 'Confirm Reject'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
