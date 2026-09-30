'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  Users,
  Search,
  ArrowUpDown,
  RefreshCw,
  WifiOff,
  CheckCircle2,
  Shield,
  UserCheck,
  Mail,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Copy,
  Database,
  Lock,
  Ban,
  Unlock,
  AlertTriangle,
  X,
} from 'lucide-react';

// User type definition compatible with API doc: { id: "xxx", title: "User Management", ... }
export interface AdminUserItem {
  id: string | number;
  title?: string;
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  created_at?: string;
  avatar?: string;
  [key: string]: any;
}

// Fallback demo users for offline / preview mode
const FALLBACK_USERS: AdminUserItem[] = [
  {
    id: 'usr_001',
    name: 'Nguyễn Văn Admin',
    fullName: 'Nguyễn Văn Admin',
    username: 'admin_chief',
    email: 'admin@fanhub.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2026-08-15 08:30',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    phone: '+84 901 234 567',
  },
  {
    id: 'usr_002',
    name: 'Lê Hoàng Nam',
    fullName: 'Lê Hoàng Nam',
    username: 'nam_event_owner',
    email: 'nam.le@fandomfest.vn',
    role: 'EventOwner',
    status: 'active',
    createdAt: '2026-09-01 10:15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    phone: '+84 912 345 678',
  },
  {
    id: 'usr_003',
    name: 'Trần Thị Mai',
    fullName: 'Trần Thị Mai',
    username: 'mai_moderator',
    email: 'mai.tran@fanhub.com',
    role: 'Moderator',
    status: 'active',
    createdAt: '2026-09-05 14:20',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    phone: '+84 987 654 321',
  },
  {
    id: 'usr_004',
    name: 'Phạm Minh Tuấn',
    fullName: 'Phạm Minh Tuấn',
    username: 'tuan_otaku',
    email: 'tuan.pham@gmail.com',
    role: 'User',
    status: 'active',
    createdAt: '2026-09-10 16:45',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    phone: '+84 933 112 233',
  },
  {
    id: 'usr_005',
    name: 'Spammer Bot V2',
    fullName: 'Spammer Bot V2',
    username: 'spammer_99',
    email: 'bot@spamattack.xyz',
    role: 'User',
    status: 'banned',
    createdAt: '2026-09-18 22:05',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    phone: '+84 999 888 777',
  },
  {
    id: 'usr_006',
    name: 'Đỗ Thảo Linh',
    fullName: 'Đỗ Thảo Linh',
    username: 'linh_kpop',
    email: 'thaolinh@gmail.com',
    role: 'User',
    status: 'active',
    createdAt: '2026-09-22 09:12',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    phone: '+84 908 776 554',
  },
  {
    id: 'usr_007',
    name: 'Hoàng Anh Dũng',
    fullName: 'Hoàng Anh Dũng',
    username: 'dung_esports',
    email: 'dung.esports@vng.vn',
    role: 'EventOwner',
    status: 'active',
    createdAt: '2026-09-23 11:30',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    phone: '+84 944 556 677',
  },
];

export interface ApiResponseMeta {
  total: number;
  page: number;
  limit: number;
}

export default function AdminUsersPage() {
  const { language, setLanguage } = useAdminLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  const isVi = language === 'vi';

  // API State (Initialized empty - no hardcoded mock sample users)
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [meta, setMeta] = useState<ApiResponseMeta>({ total: 0, page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters & Pagination query parameters per API doc (?page=1&limit=20&sort=newest)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [sort, setSort] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Detail & Confirmation Modal State
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [confirmActionUser, setConfirmActionUser] = useState<AdminUserItem | null>(null);
  const [banningUserId, setBanningUserId] = useState<string | number | null>(null);
  const [actionToast, setActionToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Responsive sidebar detection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Fetch users from backend API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setIsConnectionError(false);
    setErrorMessage(null);

    // Get Admin JWT token from cookie or localStorage
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
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (roleFilter !== 'all') {
      params.set('role', roleFilter);
    }
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    const apiUrl = `${apiBase}/api/v1/admin/users?${params.toString()}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const resData = await response.json();
        const rawUsers = resData && Array.isArray(resData.data) ? resData.data : Array.isArray(resData) ? resData : [];

        setUsers(rawUsers);
        setMeta({
          total: Number(resData.meta?.total) || rawUsers.length,
          page: Number(resData.meta?.page) || page,
          limit: Number(resData.meta?.limit) || limit,
        });
        setIsConnectionError(false);
      } else {
        setUsers([]);
        setMeta({ total: 0, page: 1, limit });
        setIsConnectionError(true);
      }
    } catch (err: any) {
      console.warn('Backend API /api/v1/admin/users offline:', err);
      setUsers([]);
      setMeta({ total: 0, page: 1, limit });
      setIsConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sort, searchQuery, roleFilter, statusFilter]);

  // Trigger fetch on query param changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Toggle Ban / Unban User: PUT /api/v1/admin/users/{id}/ban
  const handleToggleBanUser = async (targetUser: AdminUserItem) => {
    const isCurrentlyBanned = (targetUser.status || '').toLowerCase() === 'banned' || (targetUser.status || '').toLowerCase() === 'locked';
    const nextStatus = isCurrentlyBanned ? 'active' : 'banned';
    const actionLabel = isCurrentlyBanned ? 'Unban' : 'Ban';

    setBanningUserId(targetUser.id);
    setActionToast(null);

    const token = getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Body according to API doc: { "title": "Update data", "status": "updated" }
    const requestBody = {
      title: 'Update data',
      status: 'updated',
      targetStatus: nextStatus,
      action: isCurrentlyBanned ? 'unban' : 'ban',
    };

    try {
      const response = await fetch(`/api/v1/admin/users/${encodeURIComponent(targetUser.id)}/ban`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const resJson = await response.json().catch(() => ({}));
      const successMessage = resJson.message || `User successfully ${isCurrentlyBanned ? 'unbanned' : 'banned'}!`;

      // Update state locally
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u))
      );
      if (selectedUser && selectedUser.id === targetUser.id) {
        setSelectedUser((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }

      setActionToast({
        type: 'success',
        message: successMessage,
      });
      setTimeout(() => setActionToast(null), 4000);
    } catch (err: any) {
      console.warn('Connection error on PUT /api/v1/admin/users/{id}/ban:', err);
      setActionToast({
        type: 'error',
        message: isVi ? 'Lỗi kết nối: Không thể cập nhật trạng thái người dùng.' : 'Connection Error: Failed to update user status to backend server.',
      });
      setTimeout(() => setActionToast(null), 5000);
    } finally {
      setBanningUserId(null);
      setConfirmActionUser(null);
    }
  };

  // Filtered users for local search / roles
  const displayedUsers = users;

  const filteredUsers = displayedUsers.filter((u) => {
    const term = (searchQuery || headerSearch).toLowerCase().trim();
    const titleMatch = (u.title || '').toLowerCase().includes(term);
    const nameMatch = (u.name || u.fullName || u.username || '').toLowerCase().includes(term);
    const emailMatch = (u.email || '').toLowerCase().includes(term);
    const idMatch = String(u.id || '').toLowerCase().includes(term);

    const matchSearch = !term || titleMatch || nameMatch || emailMatch || idMatch;
    const matchRole = roleFilter === 'all' || (u.role || 'registered').toLowerCase() === roleFilter.toLowerCase();
    const matchStatus = statusFilter === 'all' || (u.status || 'active').toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil((meta.total || displayedUsers.length) / (meta.limit || limit)));

  const handleCopyId = (id: string | number) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(String(id));
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div
      translate="no"
      className="notranslate min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex text-slate-900 dark:text-slate-100"
    >
      {/* Sidebar with activeTab='users' */}
      <AdminSidebar
        activeTab="users"
        setActiveTab={() => { }}
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
          activeTab="users"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Action Toast Alert Banner */}
          {actionToast && (
            <div
              style={{ borderRadius: '8px' }}
              className={`p-3 text-xs font-bold flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 ${actionToast.type === 'success'
                ? 'bg-emerald-600 text-white'
                : actionToast.type === 'warning'
                  ? 'bg-amber-600 text-white'
                  : 'bg-rose-600 text-white'
                }`}
            >
              <div className="flex items-center gap-2">
                {actionToast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{actionToast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionToast(null)}
                className="p-1 hover:bg-white/20 rounded cursor-pointer bg-transparent border-0 text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Top Title & Route Breadcrumb Header (Space-Between Flex Row) */}
          <div className="flex flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs mb-6 w-full text-left">
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 text-left">
                <span>{'Admin'}</span>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isVi ? 'Quản lý người dùng' : 'User Management'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Quản lý người dùng' : 'User Management'}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Quản lý hệ thống tài khoản người dùng, phân quyền truy cập và kiểm soát trạng thái.'
                  : 'Manage user accounts, roles, access permissions, and account statuses.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={fetchUsers}
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
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                }}
                className="hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700/80 transition-all"
                title={isVi ? 'Làm mới danh sách' : 'Refresh user list'}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{isVi ? 'Làm mới' : 'Refresh'}</span>
              </button>
            </div>
          </div>



          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{isVi ? 'TỔNG NGƯỜI DÙNG' : 'TOTAL USERS'}</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {meta.total || users.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{isVi ? 'Từ phản hồi API meta.total' : 'From API response meta.total'}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{isVi ? 'QUẢN TRỊ VIÊN' : 'ADMINISTRATORS'}</span>
                <Shield className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {filteredUsers.filter((u) => (u.role || '').toLowerCase() === 'admin').length}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">{isVi ? 'Quyền truy cập cao nhất' : 'Full privileged access'}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{isVi ? 'TÀI KHOẢN BỊ KHÓA' : 'BANNED ACCOUNTS'}</span>
                <Ban className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {filteredUsers.filter((u) => (u.status || '').toLowerCase() === 'banned' || (u.status || '').toLowerCase() === 'locked').length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{isVi ? 'Đã bị chặn đăng nhập' : 'Login blocked'}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{isVi ? 'TRẠNG THÁI API' : 'API STATUS'}</span>
                {isConnectionError ? (
                  <WifiOff className="w-4 h-4 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div className={`text-base font-bold ${isConnectionError ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {isConnectionError ? (isVi ? 'Lỗi kết nối' : 'Connection Error') : (isVi ? 'Đã kết nối' : 'Connected')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isConnectionError ? (isVi ? 'Chờ máy chủ hoạt động' : 'Awaiting backend deployment') : (isVi ? 'Xác thực JWT hợp lệ' : 'JWT Authentication OK')}
              </div>
            </div>
          </div>

          {/* Filter, Search & Sort Toolbar */}
          <div className="p-4 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={isVi ? 'Tìm kiếm theo tên, email hoặc mã ID...' : 'Search users by name, email, or ID...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderRadius: '12px' }}
                  className="w-full pl-11 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Sort selector: ?sort=newest */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    style={{ borderRadius: '12px' }}
                    className="p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="newest">{isVi ? 'Mới nhất trước (newest)' : 'Newest first (newest)'}</option>
                    <option value="oldest">{isVi ? 'Cũ nhất trước (oldest)' : 'Oldest first (oldest)'}</option>
                    <option value="name_asc">{isVi ? 'Tên (A-Z)' : 'Name (A-Z)'}</option>
                    <option value="name_desc">{isVi ? 'Tên (Z-A)' : 'Name (Z-A)'}</option>
                  </select>
                </div>

                {/* Limit selector: ?limit=20 */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">{isVi ? 'Hiển thị:' : 'Show:'}</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    style={{ borderRadius: '12px' }}
                    className="p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value={10}>10 {isVi ? '/ trang' : '/ page'}</option>
                    <option value={20}>20 {isVi ? '/ trang (mặc định)' : '/ page (default)'}</option>
                    <option value={50}>50 {isVi ? '/ trang' : '/ page'}</option>
                  </select>
                </div>

                {/* Role filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ borderRadius: '12px' }}
                  className="p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="all">{isVi ? 'Tất cả vai trò' : 'All Roles'}</option>
                  <option value="admin">{isVi ? 'Quản trị viên (Admin)' : 'Administrator (Admin)'}</option>
                  <option value="registered">{isVi ? 'Thành viên (Member)' : 'Registered Member'}</option>
                </select>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ borderRadius: '12px' }}
                  className="p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="all">{isVi ? 'Tất cả trạng thái' : 'All Status'}</option>
                  <option value="active">{isVi ? 'Hoạt động (Active)' : 'Active'}</option>
                  <option value="inactive">{isVi ? 'Chờ duyệt (Pending)' : 'Pending'}</option>
                  <option value="banned">{isVi ? 'Bị khóa (Banned)' : 'Banned'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Data Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-500">
                  {isVi ? 'Đang tải danh sách người dùng từ máy chủ...' : 'Loading user catalog from server...'}
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 px-4 text-center">
                {isConnectionError ? (
                  <div className="max-w-md mx-auto flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                      <WifiOff className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {isVi ? 'Lỗi kết nối máy chủ' : 'Connection Error'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isVi
                        ? 'Không thể kết nối đến máy chủ backend. Dữ liệu sẽ tự động đồng bộ khi dịch vụ hoạt động.'
                        : 'Could not connect to backend server. When deployed alongside backend, data will sync automatically.'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={fetchUsers}
                        style={{
                          borderRadius: '8px',
                          backgroundColor: '#4f46e5',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 16px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {isVi ? 'Thử kết nối lại' : 'Retry Connection'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Users className="w-8 h-8 stroke-1" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {isVi ? 'Không tìm thấy người dùng nào phù hợp' : 'No matching users found'}
                    </p>
                    <p className="text-xs">
                      {isVi ? 'Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc.' : 'Try adjusting your search terms or filter settings.'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">{isVi ? 'NGƯỜI DÙNG' : 'USER / TITLE'}</th>
                      <th className="py-3 px-4">{isVi ? 'MÃ ID' : 'USER ID'}</th>
                      <th className="py-3 px-4">{isVi ? 'EMAIL / LIÊN HỆ' : 'EMAIL / CONTACT'}</th>
                      <th className="py-3 px-4">{isVi ? 'VAI TRÒ' : 'ROLE'}</th>
                      <th className="py-3 px-4">{isVi ? 'TRẠNG THÁI' : 'STATUS'}</th>
                      <th className="py-3 px-4">{isVi ? 'NGÀY THAM GIA' : 'JOIN DATE'}</th>
                      <th className="py-3 px-4 text-right">{isVi ? 'THAO TÁC' : 'ACTIONS'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredUsers.map((item, idx) => {
                      const displayTitle = item.full_name || item.fullName || item.name || item.title || `User #${item.id}`;
                      const email = item.email || (item.id ? `user_${item.id}@fanhub.com` : (isVi ? 'Chưa cung cấp' : 'Not provided'));
                      const role = (item.role || 'registered').toLowerCase();
                      const status = (item.status || 'active').toLowerCase();
                      const rawDate = item.created_at || item.createdAt || '2026-09-01';
                      const formattedDate = new Date(rawDate).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      });

                      const isAdmin = role.includes('admin');
                      const isActive = status === 'active';
                      const isBanned = status === 'banned' || status === 'locked';
                      const isProcessingThis = banningUserId === item.id;

                      return (
                        <tr
                          key={item.id || idx}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* User Name / Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                style={{ borderRadius: '50%' }}
                                className={`w-8 h-8 flex items-center justify-center font-bold text-xs uppercase shrink-0 ${isAdmin
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                  }`}
                              >
                                {item.avatar ? (
                                  <img
                                    src={item.avatar}
                                    alt={displayTitle}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  displayTitle.charAt(0) || 'U'
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[260px]">
                                  {displayTitle}
                                </div>
                                {item.phone && (
                                  <div className="text-[11px] text-slate-400 font-mono">{item.phone}</div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* ID Code with Copy */}
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            <button
                              type="button"
                              onClick={() => handleCopyId(item.id)}
                              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer bg-transparent border-0 p-0"
                              title={isVi ? 'Sao chép mã ID' : 'Copy ID'}
                            >
                              <span>{String(item.id)}</span>
                              <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                            </button>
                          </td>

                          {/* Email */}
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{email}</span>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-3 px-4">
                            {isAdmin ? (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                              >
                                <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                <span>{isVi ? 'Quản trị' : 'Admin'}</span>
                              </span>
                            ) : (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                              >
                                <UserCheck className="w-3 h-3 text-slate-500" />
                                <span>{isVi ? 'Thành viên' : 'Member'}</span>
                              </span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4">
                            {isBanned ? (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800"
                              >
                                <Ban className="w-3 h-3 text-rose-500" />
                                <span>{isVi ? 'BỊ KHÓA' : 'BANNED'}</span>
                              </span>
                            ) : isActive ? (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{isVi ? 'Hoạt động' : 'Active'}</span>
                              </span>
                            ) : (
                              <span
                                style={{ borderRadius: '6px' }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                              >
                                <span>{isVi ? 'Chờ duyệt' : 'Pending'}</span>
                              </span>
                            )}
                          </td>

                          {/* Created Date */}
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {formattedDate}
                          </td>

                          {/* Actions: View Detail & Ban/Unban Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Ban / Unban Button with explicit inline style */}
                              {isBanned ? (
                                <button
                                  type="button"
                                  onClick={() => setConfirmActionUser(item)}
                                  disabled={isProcessingThis}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 14px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    backgroundColor: '#16a34a',
                                    color: '#ffffff',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: isProcessingThis ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.35)',
                                    opacity: isProcessingThis ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  title={isVi ? 'Mở khóa tài khoản' : 'Unban this user'}
                                >
                                  {isProcessingThis ? (
                                    <RefreshCw className="w-3 h-3 animate-spin text-white" />
                                  ) : (
                                    <Unlock className="w-3 h-3 text-white" />
                                  )}
                                  <span style={{ color: '#ffffff' }}>{isVi ? 'Bỏ khóa' : 'Unban'}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmActionUser(item)}
                                  disabled={isProcessingThis}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 14px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    backgroundColor: '#dc2626',
                                    color: '#ffffff',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: isProcessingThis ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)',
                                    opacity: isProcessingThis ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  title={isVi ? 'Khóa tài khoản này' : 'Ban this user account'}
                                >
                                  {isProcessingThis ? (
                                    <RefreshCw className="w-3 h-3 animate-spin text-white" />
                                  ) : (
                                    <Ban className="w-3 h-3 text-white" />
                                  )}
                                  <span style={{ color: '#ffffff' }}>{isVi ? 'Khóa' : 'Ban'}</span>
                                </button>
                              )}

                              {/* View Detail Button */}
                              <button
                                type="button"
                                onClick={() => setSelectedUser(item)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '6px',
                                  backgroundColor: '#f1f5f9',
                                  color: '#334155',
                                  border: '1px solid #cbd5e1',
                                  cursor: 'pointer',
                                }}
                                title={isVi ? 'Xem chi tiết người dùng' : 'View User Details'}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div>
                {isVi ? 'Hiển thị ' : 'Showing '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {filteredUsers.length > 0 ? (page - 1) * limit + 1 : 0}
                </strong>{' '}
                -{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {Math.min(page * limit, meta.total || filteredUsers.length)}
                </strong>{' '}
                {isVi ? ' trong tổng số ' : 'of '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {meta.total || filteredUsers.length}
                </strong>{' '}
                {isVi ? 'người dùng' : 'users'}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  style={{
                    borderRadius: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    opacity: page <= 1 ? 0.4 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                  }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Trước' : 'Previous'}</span>
                </button>

                <div className="px-3 py-1.5 font-bold text-slate-800 dark:text-slate-200">
                  {isVi ? 'Trang' : 'Page'} {page} / {totalPages}
                </div>

                <button
                  type="button"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  style={{
                    borderRadius: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                    opacity: page >= totalPages ? 0.4 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                  }}
                >
                  <span>{isVi ? 'Sau' : 'Next'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal for Ban / Unban */}
      {confirmActionUser && (
        <div
          translate="no"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          className="notranslate"
          onClick={() => setConfirmActionUser(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              position: 'relative',
            }}
            className="dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 animate-in fade-in-0 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const isBanned = (confirmActionUser.status || '').toLowerCase() === 'banned' || (confirmActionUser.status || '').toLowerCase() === 'locked';
              const userName = confirmActionUser.full_name || confirmActionUser.fullName || confirmActionUser.name || confirmActionUser.title || `User #${confirmActionUser.id}`;

              return (
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      style={{
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isBanned ? '#dcfce7' : '#fee2e2',
                        color: isBanned ? '#16a34a' : '#dc2626',
                        flexShrink: 0,
                      }}
                    >
                      {isBanned ? <Unlock className="w-6 h-6" /> : <Ban className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {isBanned
                          ? (isVi ? 'Xác nhận mở khóa tài khoản' : 'Confirm Account Unban')
                          : (isVi ? 'Xác nhận khóa tài khoản' : 'Confirm Account Ban')}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {isBanned
                          ? (isVi
                            ? `Bạn có chắc chắn muốn mở khóa cho tài khoản ${userName}? Người dùng sẽ khôi phục quyền truy cập bình thường.`
                            : `Are you sure you want to unban ${userName}? The user will regain normal login and purchasing privileges.`)
                          : (isVi
                            ? `Bạn có chắc chắn muốn khóa tài khoản ${userName}? Khi bị khóa, tài khoản này sẽ ngay lập tức bị chặn đăng nhập.`
                            : `Are you sure you want to ban ${userName}? When banned, this user will be immediately blocked from logging in.`)}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="text-slate-500 flex items-center justify-between">
                      <span>{isVi ? 'Tài khoản:' : 'Target User:'}</span>
                      <span className="text-slate-900 dark:text-slate-100 font-semibold">{userName}</span>
                    </div>
                    <div className="text-slate-500 flex items-center justify-between">
                      <span>{'Email:'}</span>
                      <span className="text-slate-700 dark:text-slate-300">{confirmActionUser.email || 'N/A'}</span>
                    </div>
                    <div className="text-slate-500 flex items-center justify-between">
                      <span>{isVi ? 'Mã ID:' : 'User ID:'}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{confirmActionUser.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setConfirmActionUser(null)}
                      style={{
                        padding: '9px 18px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                      }}
                    >
                      {isVi ? 'Hủy bỏ' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      disabled={banningUserId === confirmActionUser.id}
                      onClick={() => handleToggleBanUser(confirmActionUser)}
                      style={{
                        padding: '9px 18px',
                        fontSize: '12px',
                        fontWeight: 800,
                        backgroundColor: isBanned ? '#16a34a' : '#dc2626',
                        color: '#ffffff',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: isBanned ? '0 4px 10px rgba(22, 163, 74, 0.35)' : '0 4px 10px rgba(220, 38, 38, 0.35)',
                      }}
                    >
                      {banningUserId === confirmActionUser.id && (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      )}
                      <span style={{ color: '#ffffff' }}>
                        {isBanned
                          ? (isVi ? 'Xác nhận mở khóa' : 'Confirm Unban')
                          : (isVi ? 'Xác nhận khóa' : 'Confirm Ban')}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          translate="no"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          className="notranslate"
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              position: 'relative',
            }}
            className="dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 animate-in fade-in-0 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const isBanned = (selectedUser.status || '').toLowerCase() === 'banned' || (selectedUser.status || '').toLowerCase() === 'locked';
              const userName = selectedUser.full_name || selectedUser.fullName || selectedUser.name || selectedUser.title || `User #${selectedUser.id}`;

              return (
                <>
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center uppercase">
                        {userName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {userName}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">ID: {String(selectedUser.id)}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      style={{
                        borderRadius: '6px',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="py-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider mb-1">
                          {isVi ? 'Mã ID:' : 'User ID:'}
                        </span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded text-[11px]">
                          {String(selectedUser.id)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider mb-1">
                          {isVi ? 'Họ và tên:' : 'Full Name:'}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {userName}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider mb-1">
                          {isVi ? 'Địa chỉ Email:' : 'Email Address:'}
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 break-all">
                          {selectedUser.email || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider mb-1">
                          {isVi ? 'Vai trò:' : 'Role:'}
                        </span>
                        <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded text-[11px] border border-indigo-200 dark:border-indigo-800 inline-block">
                          {selectedUser.role || 'User'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider mb-1">
                          {isVi ? 'Trạng thái:' : 'Status:'}
                        </span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] inline-block ${isBanned ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 border border-rose-200' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 border border-emerald-200'}`}>
                          {isBanned ? (isVi ? 'BỊ KHÓA' : 'BANNED') : (isVi ? 'Hoạt động' : (selectedUser.status || 'Active'))}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider mb-1">
                          {isVi ? 'Ngày khởi tạo:' : 'Created At:'}
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {selectedUser.created_at || selectedUser.createdAt || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    {/* Ban / Unban Trigger Button inside Detail Modal */}
                    <div>
                      {isBanned ? (
                        <button
                          type="button"
                          onClick={() => setConfirmActionUser(selectedUser)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.35)',
                          }}
                        >
                          <Unlock className="w-3.5 h-3.5 text-white" />
                          <span style={{ color: '#ffffff' }}>{isVi ? 'Mở khóa tài khoản này' : 'Unban this user'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmActionUser(selectedUser)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)',
                          }}
                        >
                          <Ban className="w-3.5 h-3.5 text-white" />
                          <span style={{ color: '#ffffff' }}>{isVi ? 'Khóa tài khoản này' : 'Ban this user'}</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      style={{
                        padding: '7px 16px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                      }}
                    >
                      {isVi ? 'Đóng' : 'Close'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
