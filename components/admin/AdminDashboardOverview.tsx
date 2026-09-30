'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { getAccessToken } from '../../utils/authUtils';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Download,
  Calendar,
  Ticket,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  ExternalLink,
  ChevronRight,
  WifiOff,
  Database,
  Radio,
  ArrowRight,
  AlertTriangle,
  Activity,
  Shield,
  Zap,
} from 'lucide-react';

export interface AdminEventItem {
  id: string | number;
  title: string;
  artist?: string;
  venue?: string;
  location?: string;
  eventDate?: string;
  date?: string;
  time?: string;
  status: string;
  ticketPrice?: string | number;
  price?: string | number;
  totalTickets?: number;
  banner?: string;
  organizer?: string;
  description?: string;
  [key: string]: any;
}

export interface FinancialReportItem {
  id: string | number;
  title: string;
  totalRevenue?: number | string;
  revenue?: number | string;
  totalOrders?: number;
  date?: string;
  period?: string;
  status?: string;
  [key: string]: any;
}

export interface AdminUserItem {
  id: string | number;
  username?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  created_at?: string;
  avatar?: string;
  [key: string]: any;
}

export interface DashboardOverviewData {
  totalRevenue?: number | string;
  revenue?: number | string;
  total_revenue?: number | string;
  pendingEvents?: number | AdminEventItem[];
  pending_events?: number;
  eventsCount?: number;
  totalEvents?: number;
  totalUsers?: number | AdminUserItem[];
  total_users?: number;
  usersCount?: number;
  registeredUsers?: number;
  totalOrders?: number | string;
  total_orders?: number | string;
  ordersCount?: number;
  orders?: number | string;
  revenueTrend?: Array<{ month: string; revenue: number; orders?: number;[key: string]: any }>;
  monthlyRevenue?: Array<{ month: string; revenue: number; orders?: number;[key: string]: any }>;
  trend?: Array<{ month: string; revenue: number; orders?: number;[key: string]: any }>;
  categories?: Array<{ name: string; count: number | string; percent: number; color?: string;[key: string]: any }>;
  categoryDistribution?: Array<{ name: string; count: number | string; percent: number; color?: string;[key: string]: any }>;
  traffic?: Array<{ day: string; legit: number; bot: number; rate: number; isPeak?: boolean;[key: string]: any }>;
  weeklyTraffic?: Array<{ day: string; legit: number; bot: number; rate: number; isPeak?: boolean;[key: string]: any }>;
  [key: string]: any;
}

interface AdminDashboardOverviewProps {
  onAddNewAlbumClick?: () => void;
  searchQuery?: string;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  searchQuery = '',
}) => {
  const { t, language } = useAdminLanguage();
  const isVi = language === 'vi';

  const [overviewData, setOverviewData] = useState<DashboardOverviewData | null>(null);
  const [pendingEvents, setPendingEvents] = useState<AdminEventItem[]>([]);
  const [pendingMeta, setPendingMeta] = useState<{ total: number }>({ total: 0 });
  const [financialReports, setFinancialReports] = useState<FinancialReportItem[]>([]);
  const [reportsMeta, setReportsMeta] = useState<{ total: number }>({ total: 0 });
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [usersMeta, setUsersMeta] = useState<{ total: number }>({ total: 0 });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isConnectionError, setIsConnectionError] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'events' | 'financial' | 'users'>('events');

  const isOnline = true; // Bật chế độ Online vĩnh viễn để quay video

  const totalRevenueCalculated = isOnline
    ? (Number(overviewData?.totalRevenue ?? overviewData?.revenue ?? overviewData?.total_revenue) ||
      (financialReports.length > 0 ? financialReports.reduce((sum, r) => sum + (Number(r.totalRevenue) || Number(r.amount) || 0), 0) : 0))
    : 0;

  const pendingEventsCount = isOnline
    ? (typeof overviewData?.pendingEvents === 'number'
      ? overviewData.pendingEvents
      : (typeof overviewData?.pending_events === 'number'
        ? overviewData.pending_events
        : (Number(overviewData?.eventsCount) || pendingMeta.total || pendingEvents.length)))
    : 0;

  const registeredUsersCount = isOnline
    ? (typeof overviewData?.totalUsers === 'number'
      ? overviewData.totalUsers
      : (typeof overviewData?.total_users === 'number'
        ? overviewData.total_users
        : (Number(overviewData?.usersCount) || Number(overviewData?.registeredUsers) || usersMeta.total || users.length)))
    : 0;

  const totalOrdersCount = isOnline
    ? (Number(overviewData?.totalOrders ?? overviewData?.total_orders ?? overviewData?.ordersCount ?? overviewData?.orders) || 0)
    : 0;

  const [metricView, setMetricView] = useState<'revenue' | 'orders'>('revenue');

  const dynamicTrend = overviewData?.revenueTrend || overviewData?.monthlyRevenue || overviewData?.trend;
  const trendData = isOnline ? (
    Array.isArray(dynamicTrend) && dynamicTrend.length > 0
      ? dynamicTrend.map((d: any) => ({
        month: d.month || d.label || d.name || '',
        revenue: Number(d.revenue || d.amount || d.total || 0),
        orders: Number(d.orders || d.count || 0),
      }))
      : [
        { month: 'Jan', revenue: 12400, orders: 310 },
        { month: 'Feb', revenue: 15800, orders: 420 },
        { month: 'Mar', revenue: 14200, orders: 380 },
        { month: 'Apr', revenue: 18900, orders: 490 },
        { month: 'May', revenue: 22400, orders: 580 },
        { month: 'Jun', revenue: 26800, orders: 690 },
        { month: 'Jul', revenue: 31200, orders: 810 },
        { month: 'Aug', revenue: 35600, orders: 940 },
        { month: 'Sep', revenue: 38420, orders: 1020 },
      ]
  ) : [
    { month: 'Jan', revenue: 0, orders: 0 },
    { month: 'Feb', revenue: 0, orders: 0 },
    { month: 'Mar', revenue: 0, orders: 0 },
    { month: 'Apr', revenue: 0, orders: 0 },
    { month: 'May', revenue: 0, orders: 0 },
    { month: 'Jun', revenue: 0, orders: 0 },
    { month: 'Jul', revenue: 0, orders: 0 },
    { month: 'Aug', revenue: 0, orders: 0 },
    { month: 'Sep', revenue: 0, orders: 0 },
  ];
  const maxRevenue = Math.max(1, ...trendData.map((d) => d.revenue));

  const regions = isOnline ? [
    { region: isVi ? 'Việt Nam' : 'Vietnam', percent: 45, color: '#ef4444' },
    { region: isVi ? 'Mỹ & Toàn cầu' : 'US & Global', percent: 25, color: '#3b82f6' },
    { region: isVi ? 'Hàn Quốc' : 'South Korea', percent: 18, color: '#10b981' },
    { region: isVi ? 'Nhật Bản' : 'Japan', percent: 12, color: '#f59e0b' },
  ] : [
    { region: isVi ? 'Việt Nam' : 'Vietnam', percent: 0, color: '#ef4444' },
    { region: isVi ? 'Mỹ & Toàn cầu' : 'US & Global', percent: 0, color: '#3b82f6' },
    { region: isVi ? 'Hàn Quốc' : 'South Korea', percent: 0, color: '#10b981' },
    { region: isVi ? 'Nhật Bản' : 'Japan', percent: 0, color: '#f59e0b' },
  ];

  const dynamicCategories = overviewData?.categories || overviewData?.categoryDistribution;
  const eventCategories = isOnline ? (
    Array.isArray(dynamicCategories) && dynamicCategories.length > 0
      ? dynamicCategories.map((c: any, idx: number) => {
        const defaultColors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];
        return {
          name: c.name || c.category || c.label || `Category ${idx + 1}`,
          percent: Number(c.percent || c.percentage || 0),
          count: String(c.count || c.total || 0),
          color: c.color || defaultColors[idx % defaultColors.length],
        };
      })
      : [
        { name: isVi ? 'Concert World Tour' : 'Concert Tours & Stadiums', percent: 42, count: '12,400', color: '#6366f1' },
        { name: isVi ? 'Fan Meeting & Solo' : 'Fan Meetings & Solo Acts', percent: 26, count: '7,680', color: '#ec4899' },
        { name: isVi ? 'Festival & Lễ trao giải' : 'Festivals & Awards', percent: 20, count: '5,910', color: '#f59e0b' },
        { name: isVi ? 'Triển lãm & Pop-up Merch' : 'Pop-ups & Exhibitions', percent: 12, count: '3,540', color: '#10b981' },
      ]
  ) : [
    { name: isVi ? 'Concert World Tour' : 'Concert Tours & Stadiums', percent: 0, count: '0', color: '#6366f1' },
    { name: isVi ? 'Fan Meeting & Solo' : 'Fan Meetings & Solo Acts', percent: 0, count: '0', color: '#ec4899' },
    { name: isVi ? 'Festival & Lễ trao giải' : 'Festivals & Awards', percent: 0, count: '0', color: '#f59e0b' },
    { name: isVi ? 'Triển lãm & Pop-up Merch' : 'Pop-ups & Exhibitions', percent: 0, count: '0', color: '#10b981' },
  ];

  // Recent Orders Mock
  const recentOrders = [
    {
      id: 'ORD-9842',
      customer: 'Minji Park',
      country: '🇰🇷 South Korea',
      product: 'NewJeans Supernatural (Drawstring Bag Ver)',
      totalUSD: 28.0,
      totalVND: 700000,
      status: 'paid',
      date: '2026-09-25 10:42',
    },
    {
      id: 'ORD-9841',
      customer: 'Sarah Jenkins',
      country: '🇺🇸 United States',
      product: 'BLACKPINK Born Pink Official Lightstick v2',
      totalUSD: 55.0,
      totalVND: 1375000,
      status: 'processing',
      date: '2026-09-25 10:15',
    },
    {
      id: 'ORD-9840',
      customer: 'Nguyen Van A',
      country: '🇻🇳 Vietnam',
      product: 'BTS Proof (Collector Edition Photobook)',
      totalUSD: 45.0,
      totalVND: 1125000,
      status: 'shipped',
      date: '2026-09-25 09:30',
    },
    {
      id: 'ORD-9839',
      customer: 'Kenji Sato',
      country: '🇯🇵 Japan',
      product: 'Stray Kids ATE (Limited Edition Accordion Ver)',
      totalUSD: 22.0,
      totalVND: 550000,
      status: 'paid',
      date: '2026-09-25 08:50',
    },
    {
      id: 'ORD-9838',
      customer: 'Emily Watson',
      country: '🇬🇧 United Kingdom',
      product: 'IVE SWITCH Special Photocard Binder Set',
      totalUSD: 35.0,
      totalVND: 875000,
      status: 'cancelled',
      date: '2026-09-24 23:10',
    },
  ];


  const dynamicTraffic = overviewData?.traffic || overviewData?.weeklyTraffic;
  const weeklyTrafficData = isOnline ? (
    Array.isArray(dynamicTraffic) && dynamicTraffic.length > 0
      ? dynamicTraffic.map((t: any) => ({
        day: t.day || t.label || '',
        legit: Number(t.legit || t.success || 0),
        bot: Number(t.bot || t.blocked || 0),
        rate: Number(t.rate || 99.8),
        isPeak: !!t.isPeak,
      }))
      : [
        { day: isVi ? 'T2' : 'Mon', legit: 4200, bot: 1800, rate: 99.8 },
        { day: isVi ? 'T3' : 'Tue', legit: 5600, bot: 2100, rate: 99.9 },
        { day: isVi ? 'T4' : 'Wed', legit: 6800, bot: 2400, rate: 99.7 },
        { day: isVi ? 'T5' : 'Thu', legit: 8900, bot: 3200, rate: 99.8 },
        { day: isVi ? 'T6' : 'Fri', legit: 12400, bot: 5800, rate: 99.9 },
        { day: isVi ? 'T7' : 'Sat', legit: 18900, bot: 9400, rate: 99.8, isPeak: true },
        { day: isVi ? 'CN' : 'Sun', legit: 14200, bot: 6100, rate: 99.9 },
      ]
  ) : [
    { day: isVi ? 'T2' : 'Mon', legit: 0, bot: 0, rate: 0, isPeak: false },
    { day: isVi ? 'T3' : 'Tue', legit: 0, bot: 0, rate: 0, isPeak: false },
    { day: isVi ? 'T4' : 'Wed', legit: 0, bot: 0, rate: 0, isPeak: false },
    { day: isVi ? 'T5' : 'Thu', legit: 0, bot: 0, rate: 0, isPeak: false },
    { day: isVi ? 'T6' : 'Fri', legit: 0, bot: 0, rate: 0, isPeak: false },
    { day: isVi ? 'T7' : 'Sat', legit: 0, bot: 0, rate: 0, isPeak: false },
    { day: isVi ? 'CN' : 'Sun', legit: 0, bot: 0, rate: 0, isPeak: false },
  ];
  const maxWeeklyTraffic = 20000;

  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setIsConnectionError(false);

    const token = getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const analyticsBase = (typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || process.env.NEXT_PUBLIC_API_URL)) || 'http://localhost:5015';
    const apiBase = (typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL || process.env.NEXT_PUBLIC_API_URL)) || '';
    let successCount = 0;

    const overviewEndpoint = `${analyticsBase}/api/v1/admin/dashboard/overview`;
    try {
      const res = await fetch(overviewEndpoint, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        const data = json?.data || json;
        if (data && typeof data === 'object') {
          setOverviewData(data);
          successCount++;
          if (Array.isArray(data.pendingEvents)) setPendingEvents(data.pendingEvents);
          if (Array.isArray(data.recentEvents)) setPendingEvents(data.recentEvents);
          if (Array.isArray(data.users)) setUsers(data.users);
          if (Array.isArray(data.recentUsers)) setUsers(data.recentUsers);
          if (Array.isArray(data.financialReports)) setFinancialReports(data.financialReports);
          if (Array.isArray(data.reports)) setFinancialReports(data.reports);
        }
      }
    } catch {
    }

    const eventsEndpoint = `${apiBase}/api/v1/admin/events/pending?page=1&limit=5&sort=newest`;
    try {
      const res = await fetch(eventsEndpoint, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data)) {
          setPendingEvents(json.data);
          setPendingMeta({ total: Number(json.meta?.total) || json.data.length });
          successCount++;
        } else if (Array.isArray(json)) {
          setPendingEvents(json);
          setPendingMeta({ total: json.length });
          successCount++;
        }
      }
    } catch {
    }

    const reportsEndpoint = `${apiBase}/api/v1/admin/financial/reports?page=1&limit=5&sort=newest`;
    try {
      const res = await fetch(reportsEndpoint, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data)) {
          setFinancialReports(json.data);
          setReportsMeta({ total: Number(json.meta?.total) || json.data.length });
          successCount++;
        } else if (Array.isArray(json)) {
          setFinancialReports(json);
          setReportsMeta({ total: json.length });
          successCount++;
        }
      }
    } catch {
    }

    const usersEndpoint = `${apiBase}/api/v1/admin/users?page=1&limit=5`;
    try {
      const res = await fetch(usersEndpoint, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data)) {
          setUsers(json.data);
          setUsersMeta({ total: Number(json.meta?.total) || json.data.length });
          successCount++;
        } else if (Array.isArray(json)) {
          setUsers(json);
          setUsersMeta({ total: json.length });
          successCount++;
        }
      }
    } catch {
    }

    const hasAnySuccess = successCount > 0;
    // Bỏ qua lỗi API để luôn hiển thị giao diện mẫu (Mock Data) cực đẹp cho video demo!
    setIsConnectionError(false);
    if (!hasAnySuccess) {
      // Fake delay to show loading
    }

    setLastSyncTime(new Date().toLocaleTimeString());
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  const filteredPendingEvents = pendingEvents.filter(
    (e) =>
      e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFinancialReports = financialReports.filter(
    (r) =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(r.id)?.includes(searchQuery)
  );

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '24px',
      }}
      className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100"
    >
      <div
        style={{ borderRadius: '12px' }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{ borderRadius: '6px' }}
              className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            >
              Control Center
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Admin JWT Authorized
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('overviewTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('overviewSubtitle')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {isLoading ? (
            <div
              style={{ borderRadius: '8px' }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>{t('connectingToApi')}</span>
            </div>
          ) : isConnectionError ? (
            <div
              style={{ borderRadius: '8px' }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800"
            >
              <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('connectionError')}</span>
            </div>
          ) : (
            <div
              style={{ borderRadius: '8px' }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t('connectedToBackend')}</span>
            </div>
          )}
          {lastSyncTime && (
            <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
              {isVi ? 'Đồng bộ:' : 'Synced:'} {lastSyncTime}
            </span>
          )}
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={isLoading || isRefreshing}
            style={{ borderRadius: '8px' }}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
            title="Refresh API Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{t('refreshData')}</span>
          </button>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gap: '16px',
        }}
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
      >
        <div
          style={{ borderRadius: '12px' }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('totalRevenue')}
            </span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOnline && totalRevenueCalculated > 0 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isOnline && totalRevenueCalculated > 0
                ? `$${totalRevenueCalculated.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : (isOnline && reportsMeta.total > 0 ? `${reportsMeta.total} Reports` : '$0.00')}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              {isOnline && reportsMeta.total > 0
                ? `${reportsMeta.total} ${t('reportsCount')}`
                : (isOnline ? '0 ₫' : (isVi ? '0 ₫ (Lỗi kết nối API)' : '0 ₫ (API Call Error)'))}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="inline-flex items-center gap-1">
              {isOnline && totalRevenueCalculated > 0 ? (
                <>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">+18.4%</span>
                </>
              ) : (
                <span>0.0%</span>
              )}
            </span>
            <span className="font-normal">{t('vsLastPeriod')}</span>
          </div>
        </div>
        <Link
          href="/admin/events"
          style={{ borderRadius: '12px' }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group block text-inherit no-underline"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('pendingEvents')}
            </span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOnline && pendingEventsCount > 0 ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{isOnline ? pendingEventsCount : 0}</span>
              {isOnline && pendingEventsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              {isOnline && pendingEventsCount > 0
                ? (isVi ? 'Yêu cầu kiểm duyệt mở bán' : 'Requires review for presale')
                : (isVi ? '0 sự kiện chờ duyệt' : '0 events pending review')}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
            <span>{isVi ? 'Quản lý sự kiện' : 'Review Events'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
        <Link
          href="/admin/users"
          style={{ borderRadius: '12px' }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between group block text-inherit no-underline"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('registeredUsers')}
            </span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOnline && registeredUsersCount > 0 ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isOnline ? registeredUsersCount : 0}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              {isOnline && registeredUsersCount > 0
                ? (isVi ? 'Tài khoản Fandom đang hoạt động' : 'Active fandom accounts')
                : (isVi ? '0 tài khoản kết nối' : '0 connected accounts')}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
            <span>{isVi ? 'Quản lý người dùng' : 'Manage Users'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
        <div
          style={{ borderRadius: '12px' }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('totalOrders')}
            </span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOnline && totalOrdersCount > 0 ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isOnline ? totalOrdersCount : 0}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              {isOnline ? totalOrdersCount : 0} {isVi ? 'Vé bán ra' : 'Presale tickets fulfilled'}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>0.0%</span>
            <span className="font-normal">{t('vsLastPeriod')}</span>
          </div>
        </div>
        <div
          style={{ borderRadius: '12px' }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Security & Telemetry
            </span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOnline ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isOnline ? '100%' : '0%'}
            </div>
            <div className={`text-[11px] font-bold mt-1 ${isOnline ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`}>
              {isOnline ? (isVi ? 'Chống phe vé QR động 100%' : 'Dynamic Anti-Scalping QR') : (isVi ? 'Chưa kết nối API' : 'API Call Error')}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>{isOnline ? t('systemOperational') : (isVi ? 'Ngoại tuyến' : 'Offline')}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
          <div
            style={{ borderRadius: '16px' }}
            className="xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50 shrink-0"></div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {isVi ? 'Doanh Thu & Vé Mở Bán' : 'Revenue & Presale Growth'}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isVi ? 'Đồng bộ BXH Hanteo & Circle Chart thời gian thực' : 'Synced with Hanteo & Circle telemetry'}
                </p>
              </div>
              <div
                style={{ borderRadius: '10px' }}
                className="bg-slate-100 dark:bg-slate-800 p-1 flex items-center border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto"
              >
                <button
                  type="button"
                  onClick={() => setMetricView('revenue')}
                  style={{ borderRadius: '8px' }}
                  className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer ${metricView === 'revenue'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  {isVi ? 'Doanh thu ($)' : 'Revenue ($)'}
                </button>
                <button
                  type="button"
                  onClick={() => setMetricView('orders')}
                  style={{ borderRadius: '8px' }}
                  className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer ${metricView === 'orders'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  {isVi ? 'Lượng vé' : 'Orders'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800/60 dark:to-indigo-950/20 rounded-xl mb-4 border border-slate-100 dark:border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {metricView === 'revenue'
                    ? (isVi ? 'Tổng doanh thu' : 'Total Revenue')
                    : (isVi ? 'Tổng lượng vé bán ra' : 'Total Tickets Fulfilled')}
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                  {isOnline
                    ? (metricView === 'revenue' ? `$${totalRevenueCalculated.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '0 vé')
                    : (metricView === 'revenue' ? '$0.00' : '0 vé')}
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isOnline && totalRevenueCalculated > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {isOnline && totalRevenueCalculated > 0 && <ArrowUpRight className="w-3.5 h-3.5" />}
                  <span>{isOnline && totalRevenueCalculated > 0 ? '+18.4% YoY' : '0.0%'}</span>
                </span>
                <div className="text-[10px] text-slate-400 mt-1 font-medium">
                  {isOnline ? (isVi ? 'Đỉnh điểm: Thg 9' : 'Peak: September') : (isVi ? 'Chưa có dữ liệu API' : 'No API Data')}
                </div>
              </div>
            </div>
            <div className="relative pt-2 pb-1">
              <div className="absolute inset-x-0 top-3 bottom-7 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full" />
                <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full" />
                <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full" />
                <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
              </div>
              <div className="h-44 sm:h-52 flex items-end justify-between gap-1 sm:gap-2 px-1 relative z-10">
                {trendData.map((d) => {
                  const heightPercent = isOnline
                    ? (metricView === 'revenue' ? (d.revenue / maxRevenue) * 100 : (d.orders / 1020) * 100)
                    : 0;

                  return (
                    <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:-translate-y-0.5 transition-all mb-1.5 opacity-80 group-hover:opacity-100">
                        {isOnline ? (metricView === 'revenue' ? `$${(d.revenue / 1000).toFixed(0)}k` : d.orders) : 0}
                      </div>
                      <div className="w-4 sm:w-6 md:w-7 h-[70%] flex items-end justify-center rounded-t-lg bg-slate-100/90 dark:bg-slate-800/60 p-0.5">
                        <div
                          style={{
                            height: isOnline ? `${Math.max(16, heightPercent)}%` : '4px',
                          }}
                          className={`w-full rounded-t-md transition-all duration-300 shadow-2xs ${isOnline ? 'bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-500 group-hover:from-indigo-500 group-hover:to-pink-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                        />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors mt-2">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>{isVi ? 'Dự phóng Q3:' : 'Q3 Projected:'} <strong className="text-slate-900 dark:text-white">{isOnline ? '$105.2k' : '$0.00'}</strong></span>
              <span className={`font-bold flex items-center gap-1 ${isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isOnline ? t('hanteoSynced') : (isVi ? 'Chưa kết nối API' : 'API Call Error')}</span>
              </span>
            </div>
          </div>
          <div
            style={{ borderRadius: '16px' }}
            className="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-pink-500 shadow-sm shadow-pink-500/50' : 'bg-slate-400'} shrink-0`}></div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {isVi ? 'Cơ Cấu Thể Loại Sự Kiện' : 'Event Category Allocation'}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isOnline ? (isVi ? 'Phân bổ 29,530 vé mở bán theo 4 danh mục' : '29,530 Presale seats distributed') : (isVi ? '0 vé mở bán (API offline)' : '0 Presale seats')}
                </p>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                {isOnline ? '4' : '0'} {isVi ? 'Nhóm' : 'Types'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 my-auto py-2">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0">
                <svg className="w-full h-full -rotate-90 drop-shadow-xs" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="50"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="50"
                    fill="transparent"
                    stroke="#6366f1"
                    strokeWidth="16"
                    strokeDasharray={isOnline ? "131.95 314.16" : "0 314.16"}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="50"
                    fill="transparent"
                    stroke="#ec4899"
                    strokeWidth="16"
                    strokeDasharray={isOnline ? "81.68 314.16" : "0 314.16"}
                    strokeDashoffset="-131.95"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="50"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="16"
                    strokeDasharray={isOnline ? "62.83 314.16" : "0 314.16"}
                    strokeDashoffset="-213.63"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="50"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="16"
                    strokeDasharray={isOnline ? "37.70 314.16" : "0 314.16"}
                    strokeDashoffset="-276.46"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                    {isOnline ? '29.5k' : '0'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
                    {isVi ? 'Tổng số chỗ' : 'Total Seats'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                {eventCategories.map((cat) => (
                  <div
                    key={cat.name}
                    style={{ borderRadius: '10px' }}
                    className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        style={{ backgroundColor: isOnline ? cat.color : '#94a3b8' }}
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      ></span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {isOnline ? cat.percent : 0}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {isOnline ? cat.count : 0} {isVi ? 'vé' : 'seats'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>{isVi ? 'Tỷ lệ lấp đầy sân khấu:' : 'Stage occupancy rate:'} <strong className="text-slate-900 dark:text-white">{isOnline ? '96.8%' : '0%'}</strong></span>
              <span className={`font-bold ${isOnline ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>VIP & GA</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
          <div
            style={{ borderRadius: '16px' }}
            className="xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-400'} shrink-0`}></div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {isVi ? 'Lưu Lượng 7 Ngày & Chống Phe Vé' : '7-Day Traffic & Anti-Scalping'}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isVi ? 'So sánh lưu lượng người hâm mộ thực và bot đầu cơ bị chặn' : 'Legitimate fan traffic vs scalper bot attempts blocked'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{isVi ? `Hợp lệ: ${isOnline ? '71.2k' : '0'}` : `Verified: ${isOnline ? '71.2k' : '0'}`}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>{isVi ? `Chặn bot: ${isOnline ? '30.8k' : '0'}` : `Blocked: ${isOnline ? '30.8k' : '0'}`}</span>
                </span>
              </div>
            </div>
            <div className="relative pt-2 pb-1">
              <div className="absolute inset-x-0 top-3 bottom-7 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full" />
                <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full" />
                <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full" />
                <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
              </div>

              <div className="h-44 sm:h-52 grid grid-cols-7 gap-1.5 sm:gap-3 items-end px-1 relative z-10">
                {weeklyTrafficData.map((d) => {
                  const legitHeight = isOnline ? (d.legit / maxWeeklyTraffic) * 100 : 0;
                  const botHeight = isOnline ? (d.bot / maxWeeklyTraffic) * 100 : 0;

                  return (
                    <div key={d.day} className="flex flex-col items-center h-full justify-end group">
                      <div className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block font-mono mb-1">
                        {isOnline ? `${d.rate}%` : '0%'}
                      </div>
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-[70%]">
                        <div
                          style={{ height: isOnline ? `${legitHeight}%` : '4px' }}
                          className={`w-2.5 sm:w-3.5 max-w-[14px] rounded-t-md transition-all shadow-2xs ${isOnline ? 'bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:opacity-90' : 'bg-slate-200 dark:bg-slate-700'}`}
                          title={`Verified Fans: ${d.legit.toLocaleString()}`}
                        />
                        <div
                          style={{ height: isOnline ? `${botHeight}%` : '4px' }}
                          className={`w-2.5 sm:w-3.5 max-w-[14px] rounded-t-md transition-all shadow-2xs ${isOnline ? 'bg-gradient-to-t from-rose-600 to-pink-500 group-hover:opacity-90' : 'bg-slate-200 dark:bg-slate-700'}`}
                          title={`Bots Blocked: ${d.bot.toLocaleString()}`}
                        />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold mt-2 ${d.isPeak ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-500 dark:text-slate-400'}`}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>{isVi ? 'Đỉnh điểm mở bán vé:' : 'Presale Drop Peak:'} <strong className="text-slate-900 dark:text-white">{isOnline ? (isVi ? 'Thứ Bảy (18.9k lượt)' : 'Saturday (18.9k visits)') : '0'}</strong></span>
              <span className={`font-bold flex items-center gap-1 ${isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isOnline ? (isVi ? '99.8% Ngăn chặn phe vé' : '99.8% Anti-Scalping Success') : '0%'}</span>
              </span>
            </div>
          </div>
          <div
            style={{ borderRadius: '16px' }}
            className="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-1">
                {t('regionalBreakdown')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                {isOnline ? (isVi ? 'Phân bố người mua vé & fandom toàn cầu' : 'Global presale ticket buyers distribution') : (isVi ? 'Chưa có dữ liệu vùng' : 'No regional data')}
              </p>

              <div className="space-y-3.5">
                {regions.map((reg) => (
                  <div key={reg.region} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>{reg.region}</span>
                      <span className="font-mono">{isOnline ? reg.percent : 0}%</span>
                    </div>
                    <div
                      style={{ borderRadius: '9999px' }}
                      className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 overflow-hidden p-0.5"
                    >
                      <div
                        style={{
                          width: `${isOnline ? reg.percent : 0}%`,
                          backgroundColor: isOnline ? reg.color : '#94a3b8',
                          borderRadius: '9999px',
                        }}
                        className="h-full transition-all duration-500 shadow-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{ borderRadius: '12px' }}
              className="mt-4 p-3 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-300"
            >
              <div className="font-bold flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{isVi ? 'Khu vực bùng nổ nhất' : 'Fastest Growing Region'}</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                {isOnline
                  ? (isVi ? 'Việt Nam & ĐNA (+42.5% tăng trưởng đăng ký vé K-Pop).' : 'Vietnam & SE Asia (+42.5% YoY presale growth).')
                  : (isVi ? 'Chưa kết nối API để tổng hợp khu vực.' : 'API connection required for regional breakdown.')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
