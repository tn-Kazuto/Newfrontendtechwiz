'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  History,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  Calendar,
  Filter,
  Eye,
  Shield,
  ShieldAlert,
  UserX,
  UserCheck,
  FileCheck,
  FileX,
  RotateCcw,
  Settings,
  Globe,
  Clock,
  User,
  Hash,
  ChevronLeft,
  ChevronRight,
  Download,
  WifiOff,
} from 'lucide-react';

export interface AdminAuditLogItem {
  id: string;
  actor: string | { id?: string; name?: string };
  action: 'Ban_User' | 'Unban_User' | 'Approve_Event' | 'Reject_Event' | 'Delete_Content' | 'Process_Refund' | 'Update_Settings' | string;
  target: string;
  timestamp: string;
  ip: string;
  details?: string;
  [key: string]: any;
}



const LOG_ACTIONS = [
  'All',
  'Ban_User',
  'Unban_User',
  'Approve_Event',
  'Reject_Event',
  'Delete_Content',
  'Process_Refund',
  'Update_Settings',
];

export default function AdminAuditLogsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Main list state
  const [logs, setLogs] = useState<AdminAuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filters & Pagination: ?actor_id=...&action=Ban_User&from=...&to=...&page=1&limit=20
  const [actionFilter, setActionFilter] = useState('All');
  const [actorQuery, setActorQuery] = useState('');
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-09-30');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<AdminAuditLogItem | null>(null);

  const getActorName = (a: any) => {
    if (!a) return 'System';
    if (typeof a === 'string') return a;
    return a.name || a.id || 'Admin';
  };

  // Fetch Audit Logs: GET /api/v1/admin/audit-logs
  const fetchAuditLogs = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setIsConnectionError(false);

    try {
      const token = getAccessToken();
      const params = new URLSearchParams();
      if (actionFilter !== 'All') params.set('action', actionFilter);
      if (actorQuery.trim()) params.set('actor_id', actorQuery.trim());
      if (fromDate) params.set('from', fromDate);
      if (toDate) params.set('to', toDate);
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const url = `/api/v1/admin/audit-logs?${params.toString()}`;
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
      const rawData = json.data || json.logs || (Array.isArray(json) ? json : []);

      if (Array.isArray(rawData)) {
        setLogs(rawData);
        setTotalCount(json.meta?.total || json.total || rawData.length);
      } else {
        setLogs([]);
        setTotalCount(0);
      }
      setApiError(null);
      setIsConnectionError(false);
    } catch (err: any) {
      console.warn('API /api/v1/admin/audit-logs offline or error:', err);
      setLogs([]);
      setTotalCount(0);
      setIsConnectionError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [actionFilter, actorQuery, fromDate, toDate, page, limit]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render Action Badge
  const renderActionBadge = (action: string) => {
    const a = action || '';
    if (a.includes('Ban')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <UserX className="w-3 h-3 text-rose-600" />
          <span>{a}</span>
        </span>
      );
    }
    if (a.includes('Approve')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <FileCheck className="w-3 h-3 text-emerald-600" />
          <span>{a}</span>
        </span>
      );
    }
    if (a.includes('Reject')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <FileX className="w-3 h-3 text-amber-600" />
          <span>{a}</span>
        </span>
      );
    }
    if (a.includes('Refund')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <RotateCcw className="w-3 h-3 text-purple-600" />
          <span>{a}</span>
        </span>
      );
    }
    if (a.includes('Settings')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
          <Settings className="w-3 h-3 text-cyan-600" />
          <span>{a}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <Shield className="w-3 h-3 text-slate-500" />
        <span>{a}</span>
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="audit-logs"
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
          activeTab="audit-logs"
        />

        {/* BREADCRUMB & TOP ACTIONS HEADER */}
        <div className="p-6 pb-0">
          <div className="flex flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs w-full text-left">
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 text-left">
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isVi ? 'Nhật ký Kiểm toán' : 'Audit Logs'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
                  <History className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Nhật Ký Thao Tác Quản Trị Hệ Thống' : 'Admin Activity & Security Logs'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {logs.length} {isVi ? 'bản ghi' : 'events'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Theo dõi toàn bộ lịch sử thao tác của các tài khoản quản trị viên, địa chỉ IP và thời gian.'
                  : 'Track all administrator operations, IP addresses, and activity timestamps.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => fetchAuditLogs(true)}
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

        {/* CONTENT BODY */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
              <p className="text-xs text-slate-500">{isVi ? 'Đang tải nhật ký kiểm toán...' : 'Loading audit logs...'}</p>
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
                    onClick={() => fetchAuditLogs(true)}
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
              {/* FILTER TOOLBAR: ?actor_id=...&action=Ban_User&from=...&to=... */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search actor or target */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={actorQuery}
                  onChange={(e) => {
                    setActorQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder={
                    isVi
                      ? 'Tìm kiếm theo tên Admin, mã đối tượng mục tiêu (usr_xxx, evt_xxx) hoặc địa chỉ IP...'
                      : 'Search by admin name, target id or IP address...'
                  }
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                />
                {actorQuery && (
                  <button
                    onClick={() => {
                      setActorQuery('');
                      setPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Action Dropdown */}
              <div className="relative min-w-[170px]">
                <select
                  value={actionFilter}
                  onChange={(e) => {
                    setActionFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer appearance-none shadow-xs"
                >
                  <option value="All">{isVi ? 'Tất cả Thao tác' : 'All Actions'}</option>
                  {LOG_ACTIONS.filter((a) => a !== 'All').map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Date filter row */}
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">{isVi ? 'Thời gian:' : 'Range:'}</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-white border border-slate-300 px-2.5 py-1 rounded-lg text-slate-800 font-mono shadow-xs focus:outline-none focus:border-indigo-600"
              />
              <span className="text-slate-400">→</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-white border border-slate-300 px-2.5 py-1 rounded-lg text-slate-800 font-mono shadow-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* TABLE OF LOGS */}
          <div className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">{isVi ? 'Mã Log (id)' : 'Log ID'}</th>
                    <th className="px-4 py-3">{isVi ? 'Người thực hiện (actor)' : 'Actor (Admin)'}</th>
                    <th className="px-4 py-3">{isVi ? 'Thao tác (action)' : 'Action'}</th>
                    <th className="px-4 py-3">{isVi ? 'Đối tượng mục tiêu (target)' : 'Target'}</th>
                    <th className="px-4 py-3">{isVi ? 'Thời gian (timestamp)' : 'Timestamp'}</th>
                    <th className="px-4 py-3">{isVi ? 'Địa chỉ IP' : 'IP Address'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Chi tiết' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setDetailItem(item)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer text-slate-800"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span>{item.id}</span>
                          <button
                            onClick={(e) => handleCopyId(item.id, e)}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            {copiedId === item.id ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{getActorName(item.actor)}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderActionBadge(item.action)}
                      </td>

                      <td className="px-4 py-3 font-mono text-indigo-600 font-semibold">
                        <div className="flex items-center gap-1">
                          <span>{item.target}</span>
                          <button
                            onClick={(e) => handleCopyId(item.target, e)}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            {copiedId === item.target ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleDateString()}{' '}
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{item.ip}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setDetailItem(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title={isVi ? 'Xem chi tiết' : 'View'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
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
                ? `Hiển thị ${logs.length} bản ghi nhật ký (Trang ${page})`
                : `Showing ${logs.length} log events (Page ${page})`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isVi ? 'Trang trước' : 'Previous'}</span>
              </button>

              <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold shadow-xs">
                {page}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={logs.length < limit || loading}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-xs"
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
                <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isVi ? 'Chi tiết Nhật ký Kiểm toán' : 'Audit Log Detail'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">{detailItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Hành động:</span>
                  <div>{renderActionBadge(detailItem.action)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Người thực hiện:</span>
                  <span className="font-bold text-slate-900">{getActorName(detailItem.actor)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mục tiêu (target):</span>
                  <span className="font-mono text-indigo-600 font-bold">{detailItem.target}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Địa chỉ IP:</span>
                  <span className="font-mono text-slate-700">{detailItem.ip}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Thời gian:</span>
                  <span className="font-mono text-slate-700">{new Date(detailItem.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {detailItem.details && (
                <div>
                  <div className="text-slate-700 font-semibold mb-1">
                    {isVi ? 'Nội dung chi tiết thao tác:' : 'Action Details:'}
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                    {detailItem.details}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-end">
              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs cursor-pointer font-bold shadow-xs"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
