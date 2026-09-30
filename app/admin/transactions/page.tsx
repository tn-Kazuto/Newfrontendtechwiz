'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  Receipt,
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
  CreditCard,
  User,
  Hash,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowUpDown,
  Download,
  WifiOff,
} from 'lucide-react';

export interface AdminTransactionItem {
  id: string;
  user: string | { name?: string; email?: string; id?: string };
  amount: number;
  provider: 'VNPay' | 'Momo' | 'ZaloPay' | 'VietQR' | 'Stripe' | string;
  merchant_ref: string;
  status: 'Success' | 'Pending' | 'Failed' | string;
  created_at: string;
  payment_method?: string;
  [key: string]: any;
}

// Fallback demo transactions
const FALLBACK_TRANSACTIONS: AdminTransactionItem[] = [
  {
    id: 'tx_98124',
    user: 'Nguyen Van A',
    amount: 250000,
    provider: 'VNPay',
    merchant_ref: 'ORD_12345',
    status: 'Success',
    created_at: '2026-09-26T14:32:00Z',
    payment_method: 'VNPay QR',
  },
  {
    id: 'tx_98125',
    user: 'Le Thi Thu Ha',
    amount: 1500000,
    provider: 'Momo',
    merchant_ref: 'ORD_12346',
    status: 'Success',
    created_at: '2026-09-26T15:10:00Z',
    payment_method: 'Ví MoMo',
  },
  {
    id: 'tx_98126',
    user: 'Tran Dinh Quang',
    amount: 500000,
    provider: 'VNPay',
    merchant_ref: 'ORD_12347',
    status: 'Pending',
    created_at: '2026-09-26T16:05:00Z',
    payment_method: 'ATM Nội địa',
  },
  {
    id: 'tx_98127',
    user: 'Pham Minh Hoang',
    amount: 850000,
    provider: 'ZaloPay',
    merchant_ref: 'ORD_12348',
    status: 'Success',
    created_at: '2026-09-26T16:45:00Z',
    payment_method: 'ZaloPay QR',
  },
  {
    id: 'tx_98128',
    user: 'Vuong Quoc Bao',
    amount: 3200000,
    provider: 'VietQR',
    merchant_ref: 'ORD_12349',
    status: 'Success',
    created_at: '2026-09-27T08:12:00Z',
    payment_method: 'Chuyển khoản VietQR Pro',
  },
  {
    id: 'tx_98129',
    user: 'Dang Thi Mai',
    amount: 450000,
    provider: 'VNPay',
    merchant_ref: 'ORD_12350',
    status: 'Failed',
    created_at: '2026-09-27T09:20:00Z',
    payment_method: 'Thẻ Quốc tế Visa/Master',
  },
];

export default function AdminTransactionsPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Main list state
  const [transactions, setTransactions] = useState<AdminTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filters & Pagination: ?provider=VNPay&status=Success&page=1&limit=20
  const [providerFilter, setProviderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<AdminTransactionItem | null>(null);

  // Currency Formatter
  const formatCurrency = (amount: number | string) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat(isVi ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Helper get user name
  const getUserName = (u: any) => {
    if (!u) return 'Anonymous';
    if (typeof u === 'string') return u;
    return u.name || u.email || 'User';
  };

  // Fetch Transactions: GET /api/v1/admin/transactions?provider=...&status=...&page=...&limit=...
  const fetchTransactions = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setIsConnectionError(false);

    try {
      const token = getAccessToken();
      const params = new URLSearchParams();
      if (providerFilter) params.set('provider', providerFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const url = `/api/v1/admin/transactions?${params.toString()}`;
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
      const rawData = json.data || json.transactions || (Array.isArray(json) ? json : []);

      if (Array.isArray(rawData)) {
        setTransactions(rawData);
        setTotalCount(json.meta?.total || json.total || rawData.length);
      } else {
        setTransactions([]);
        setTotalCount(0);
      }
      setApiError(null);
      setIsConnectionError(false);
    } catch (err: any) {
      console.warn('API /api/v1/admin/transactions offline or error:', err);
      setTransactions([]);
      setTotalCount(0);
      setIsConnectionError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [providerFilter, statusFilter, searchTerm, page, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Status Badge
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'success' || s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{isVi ? 'Thành công' : 'Success'}</span>
        </span>
      );
    }
    if (s === 'failed' || s === 'error') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" />
          <span>{isVi ? 'Thất bại' : 'Failed'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
        <span>{isVi ? 'Đang xử lý' : 'Pending'}</span>
      </span>
    );
  };

  // Provider Pill
  const renderProviderBadge = (provider: string) => {
    const p = (provider || '').toUpperCase();
    let bg = 'bg-slate-100 text-slate-700 border-slate-200';
    if (p.includes('VNPAY')) bg = 'bg-blue-50 text-blue-700 border-blue-200';
    if (p.includes('MOMO')) bg = 'bg-pink-50 text-pink-700 border-pink-200';
    if (p.includes('ZALOPAY')) bg = 'bg-sky-50 text-sky-700 border-sky-200';
    if (p.includes('VIETQR')) bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';

    return (
      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold font-mono border ${bg}`}>
        {provider}
      </span>
    );
  };

  // KPI Computations
  const totalVolume = useMemo(() => {
    return transactions
      .filter((t) => (t.status || '').toLowerCase() === 'success')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions]);

  const successCount = transactions.filter((t) => (t.status || '').toLowerCase() === 'success').length;
  const pendingCount = transactions.filter((t) => (t.status || '').toLowerCase() === 'pending').length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="transactions"
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
          activeTab="transactions"
        />

        {/* BREADCRUMB & TOP ACTIONS HEADER */}
        <div className="p-6 pb-0">
          <div className="flex flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs w-full text-left">
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 text-left">
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isVi ? 'Lịch sử Giao dịch' : 'Transaction History'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Nhật Ký Giao Dịch & Cổng Thanh Toán' : 'Transaction Logs & Gateways'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {transactions.length} {isVi ? 'giao dịch' : 'records'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Theo dõi nhật ký các giao dịch thanh toán vé, nạp ví và trạng thái đối soát cổng.'
                  : 'Monitor ticket payment logs, wallet top-ups, and gateway reconciliation status.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => fetchTransactions(true)}
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
              <p className="text-xs text-slate-500">{isVi ? 'Đang tải danh sách giao dịch...' : 'Loading transactions...'}</p>
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
                    onClick={() => fetchTransactions(true)}
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
                    <span>{isVi ? 'Tổng tiền thanh toán' : 'Settled Volume'}</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600 font-mono">
                    {formatCurrency(totalVolume)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {isVi ? 'Đã thanh toán thành công' : 'Captured successfully'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span>{isVi ? 'Giao dịch thành công' : 'Successful'}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{successCount}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {isVi ? 'Tỷ lệ thanh toán chuẩn 100%' : 'Processed without issues'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span>{isVi ? 'Giao dịch chờ xử lý' : 'Pending'}</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {isVi ? 'Đang đợi webhook cổng' : 'Awaiting IPN callback'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span>{isVi ? 'Cổng thanh toán' : 'Payment Gateways'}</span>
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">VNPay, MoMo, VietQR</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {isVi ? 'Hỗ trợ quét mã & thẻ ngân hàng' : 'Multi-gateway routing'}
                  </div>
                </div>
              </div>

              {/* FILTER & SEARCH BAR */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  {/* Search input */}
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
                          ? 'Tìm kiếm theo mã đơn (ORD_xxx), mã GD, tên khách hàng...'
                          : 'Search by merchant_ref, transaction id, customer...'
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

                  {/* Provider Filter: ?provider=VNPay */}
                  <div className="flex items-center gap-2">
                    <div className="relative min-w-[150px]">
                      <select
                        value={providerFilter}
                        onChange={(e) => {
                          setProviderFilter(e.target.value);
                          setPage(1);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer appearance-none shadow-xs"
                      >
                        <option value="">{isVi ? 'Tất cả Cổng (Provider)' : 'All Providers'}</option>
                        <option value="VNPay">VNPay</option>
                        <option value="Momo">MoMo</option>
                        <option value="ZaloPay">ZaloPay</option>
                        <option value="VietQR">VietQR</option>
                        <option value="Stripe">Stripe</option>
                      </select>
                      <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Status Filter: ?status=Success */}
                    <div className="relative min-w-[140px]">
                      <select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setPage(1);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer appearance-none shadow-xs"
                      >
                        <option value="">{isVi ? 'Tất cả Trạng thái' : 'All Statuses'}</option>
                        <option value="Success">{isVi ? 'Thành công' : 'Success'}</option>
                        <option value="Pending">{isVi ? 'Chờ xử lý' : 'Pending'}</option>
                        <option value="Failed">{isVi ? 'Thất bại' : 'Failed'}</option>
                      </select>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* TABLE OF TRANSACTIONS */}
              <div className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">{isVi ? 'Mã Giao dịch (id)' : 'Tx ID'}</th>
                        <th className="px-4 py-3">{isVi ? 'Khách hàng' : 'User'}</th>
                        <th className="px-4 py-3 text-right">{isVi ? 'Số tiền (amount)' : 'Amount'}</th>
                        <th className="px-4 py-3">{isVi ? 'Cổng thanh toán' : 'Provider'}</th>
                        <th className="px-4 py-3">{isVi ? 'Mã đơn (merchant_ref)' : 'Merchant Ref'}</th>
                        <th className="px-4 py-3">{isVi ? 'Trạng thái' : 'Status'}</th>
                        <th className="px-4 py-3">{isVi ? 'Thời gian' : 'Time'}</th>
                        <th className="px-4 py-3 text-right">{isVi ? 'Chi tiết' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          onClick={() => setDetailItem(tx)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer text-slate-800"
                        >
                          <td className="px-4 py-3 font-mono font-bold text-indigo-600">
                            <div className="flex items-center gap-1.5">
                              <span>{tx.id}</span>
                              <button
                                onClick={(e) => handleCopyId(tx.id, e)}
                                className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                              >
                                {copiedId === tx.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-800">{getUserName(tx.user)}</div>
                          </td>

                          <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                            {formatCurrency(tx.amount)}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            {renderProviderBadge(tx.provider)}
                          </td>

                          <td className="px-4 py-3 font-mono text-slate-600">
                            {tx.merchant_ref}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            {renderStatusBadge(tx.status)}
                          </td>

                          <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                            {new Date(tx.created_at).toLocaleDateString()}{' '}
                            <span className="text-[10px] text-slate-400">
                              {new Date(tx.created_at).toLocaleTimeString()}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setDetailItem(tx)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
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
                    ? `Hiển thị ${transactions.length} giao dịch (Trang ${page})`
                    : `Showing ${transactions.length} records (Page ${page})`}
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
                    disabled={transactions.length < limit || loading}
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
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isVi ? 'Chi tiết Giao dịch' : 'Transaction Receipt'}
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
                <div className="text-xs text-slate-500 mb-1">Số tiền thanh toán</div>
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
                  <span className="text-slate-500">{isVi ? 'Cổng thanh toán' : 'Provider'}</span>
                  <div>{renderProviderBadge(detailItem.provider)}</div>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">{isVi ? 'Mã đơn đối soát' : 'Merchant Ref'}</span>
                  <span className="font-mono text-slate-800 font-bold">{detailItem.merchant_ref}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">{isVi ? 'Phương thức' : 'Payment Method'}</span>
                  <span className="text-slate-700">{detailItem.payment_method || detailItem.provider}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">{isVi ? 'Thời gian' : 'Timestamp'}</span>
                  <span className="font-mono text-slate-700">
                    {new Date(detailItem.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
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
    </div>
  );
}
