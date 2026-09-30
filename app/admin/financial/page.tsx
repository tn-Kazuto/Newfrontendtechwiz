'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  TrendingUp,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  DollarSign,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BarChart3,
  PieChart,
  Download,
  Ticket,
  Percent,
  Wallet,
  Building2,
  ChevronRight,
  ExternalLink,
  WifiOff,
} from 'lucide-react';

export interface FinancialBreakdownItem {
  event_id: string;
  event_title: string;
  tickets_sold: number;
  revenue: number;
  commission?: number;
}

export interface FinancialReportData {
  total_volume: number;
  commission_earned: number;
  breakdown: FinancialBreakdownItem[];
  meta?: any;
}

export default function AdminFinancialPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Date Filter & Group By states
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-09-30');
  const [groupBy, setGroupBy] = useState<'event' | 'month' | 'category'>('event');

  // Report State
  const [report, setReport] = useState<FinancialReportData>({ total_volume: 0, commission_earned: 0, breakdown: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search in breakdown
  const [searchTerm, setSearchTerm] = useState('');

  // Currency Formatter
  const formatCurrency = (amount: number | string) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat(isVi ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Fetch Report: GET /api/v1/admin/financial/reports?from=2026-01-01&to=2026-09-30&group_by=event
  const fetchReport = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setIsConnectionError(false);

    try {
      const token = getAccessToken();
      const params = new URLSearchParams({
        from: fromDate,
        to: toDate,
        group_by: groupBy,
      });

      const apiBase = (typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || process.env.NEXT_PUBLIC_API_URL)) || 'http://localhost:5015';
      const url = `${apiBase}/api/v1/admin/financial/reports?${params.toString()}`;
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
      const rawData = json.data || json;

      if (rawData && (rawData.total_volume !== undefined || rawData.breakdown)) {
        setReport({
          total_volume: rawData.total_volume || 0,
          commission_earned: rawData.commission_earned || 0,
          breakdown: Array.isArray(rawData.breakdown) ? rawData.breakdown : [],
        });
      }
      setApiError(null);
      setIsConnectionError(false);
    } catch (err: any) {
      console.warn('API /api/v1/admin/financial/reports offline or error:', err);
      setReport({ total_volume: 0, commission_earned: 0, breakdown: [] });
      setIsConnectionError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fromDate, toDate, groupBy]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered breakdown
  const filteredBreakdown = useMemo(() => {
    if (!searchTerm.trim()) return report.breakdown || [];
    const q = searchTerm.toLowerCase();
    return (report.breakdown || []).filter(
      (b) =>
        b.event_title.toLowerCase().includes(q) ||
        b.event_id.toLowerCase().includes(q)
    );
  }, [report.breakdown, searchTerm]);

  // Derived metrics
  const totalTicketsSold = useMemo(() => {
    return (report.breakdown || []).reduce((sum, b) => sum + (b.tickets_sold || 0), 0);
  }, [report.breakdown]);

  const netPayout = report.total_volume - report.commission_earned;
  const commissionRate = report.total_volume > 0
    ? ((report.commission_earned / report.total_volume) * 100).toFixed(1)
    : '5.0';

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="financial"
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
          activeTab="financial"
        />

        {/* BREADCRUMB & TOP ACTIONS HEADER */}
        <div className="p-6 pb-0">
          <div className="flex flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs w-full text-left">
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 text-left">
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isVi ? 'Báo cáo Tài chính' : 'Financial Reports'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Doanh Thu & Hoa Hồng Nền Tảng' : 'Platform Financial & Revenue'}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Theo dõi tổng doanh số bán vé, hoa hồng chiết khấu nền tảng và dòng tiền thực nhận.'
                  : 'Track total ticket volume, platform commission fee, and net payouts.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => fetchReport(true)}
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
              <button
                type="button"
                onClick={() => {
                  alert(isVi ? 'Đang xuất file báo cáo tài chính Excel/CSV...' : 'Exporting financial data...');
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
                <Download className="w-4 h-4" />
                <span>{isVi ? 'XUẤT BÁO CÁO' : 'EXPORT REPORT'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
              <p className="text-xs text-slate-500">{isVi ? 'Đang tải báo cáo tài chính...' : 'Loading financial report...'}</p>
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
                    onClick={() => fetchReport(true)}
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
              {/* DATE RANGE FILTER TOOLBAR: ?from=...&to=...&group_by=event */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="text-slate-600 font-medium">{isVi ? 'Từ ngày:' : 'From:'}</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent text-slate-900 font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="text-slate-600 font-medium">{isVi ? 'Đến ngày:' : 'To:'}</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent text-slate-900 font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">{isVi ? 'Nhóm theo:' : 'Group by:'}</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as any)}
                  className="bg-transparent text-indigo-600 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="event">Sự kiện (Event)</option>
                  <option value="month">Tháng (Month)</option>
                  <option value="category">Danh mục (Category)</option>
                </select>
              </div>
            </div>

            {/* Quick date range buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => {
                  setFromDate('2026-09-01');
                  setToDate('2026-09-30');
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg cursor-pointer shadow-2xs"
              >
                {isVi ? 'Tháng này' : 'This Month'}
              </button>
              <button
                onClick={() => {
                  setFromDate('2026-07-01');
                  setToDate('2026-09-30');
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg cursor-pointer shadow-2xs"
              >
                {isVi ? 'Quý 3' : 'Q3'}
              </button>
              <button
                onClick={() => {
                  setFromDate('2026-01-01');
                  setToDate('2026-09-30');
                }}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold rounded-lg cursor-pointer shadow-2xs"
              >
                {isVi ? 'Từ đầu năm' : 'YTD'}
              </button>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Tổng Doanh Số (total_volume)' : 'Total Volume'}</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600 font-mono">
                {formatCurrency(report.total_volume)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                <span>+18.4% so với kỳ trước</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Hoa Hồng Thu Được (commission)' : 'Commission Earned'}</span>
                <Percent className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 font-mono">
                {formatCurrency(report.commission_earned)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Tỷ lệ chiết khấu bình quân: <strong className="text-slate-700">{commissionRate}%</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Thực Nhận BTC (Net Payout)' : 'Net Organizer Payout'}</span>
                <Wallet className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {formatCurrency(netPayout)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Đã khấu trừ hoa hồng hệ thống' : 'After platform fee'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Tổng Số Vé Bán Ra' : 'Total Tickets Sold'}</span>
                <Ticket className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {totalTicketsSold.toLocaleString()} {isVi ? 'vé' : 'tickets'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Qua cổng thanh toán trực tuyến' : 'Online transaction volume'}
              </div>
            </div>
          </div>

          {/* BREAKDOWN TABLE */}
          <div className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isVi ? 'Chi Tiết Doanh Thu Theo Sự Kiện (Breakdown)' : 'Revenue Breakdown by Event'}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {filteredBreakdown.length} sự kiện
                </span>
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isVi ? 'Lọc theo tên sự kiện...' : 'Filter events...'}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">{isVi ? 'Sự kiện' : 'Event'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Số vé đã bán' : 'Tickets Sold'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Doanh thu (revenue)' : 'Revenue'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Hoa hồng ước tính' : 'Commission'}</th>
                    <th className="px-4 py-3 text-center">{isVi ? 'Tỷ trọng doanh thu' : 'Share'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBreakdown.map((item) => {
                    const share = report.total_volume > 0 ? (item.revenue / report.total_volume) * 100 : 0;
                    const comm = item.commission || Math.round(item.revenue * 0.05);

                    return (
                      <tr key={item.event_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 max-w-sm">
                          <div className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                            {item.event_title}
                          </div>
                          <button
                            onClick={(e) => handleCopyId(item.event_id, e)}
                            className="text-[10px] text-slate-400 hover:text-indigo-600 font-mono flex items-center gap-1 mt-0.5 cursor-pointer"
                          >
                            <span>{item.event_id}</span>
                            {copiedId === item.event_id ? (
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-700">
                          {item.tickets_sold.toLocaleString()}
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600">
                          {formatCurrency(item.revenue)}
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-600">
                          {formatCurrency(comm)}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-2 max-w-[120px] mx-auto">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(5, share))}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] text-slate-500 w-10 text-right">
                              {share.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
        )}
        </div>
      </div>
    </div>
  );
}
