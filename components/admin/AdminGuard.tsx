'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, LogOut, Lock, RefreshCw, User } from 'lucide-react';
import { checkIsAdmin, getAccessToken } from '../../utils/authUtils';
import { useAuth } from '../../context/AuthContext';
import { isBypassAdminEnabled } from '../../config/adminConfig';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const verifyAccess = () => {
      const hasToken = !!getAccessToken();
      const isAdmin = checkIsAdmin(user);
      setIsAuthorized(isAdmin);
      setIsChecking(false);
    };

    verifyAccess();
  }, [user]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 rounded-lg bg-[#111622] border border-slate-800 flex items-center justify-center shadow-lg mb-3">
          <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
        </div>
        <p className="text-xs font-bold tracking-wide text-slate-400 font-mono">Authenticating Administrator privileges...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 relative selection:bg-rose-500 selection:text-white">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(225,29,72,0.08),transparent_50%)] pointer-events-none" />

        {/* Square Modern Card Container */}
        <div className="relative max-w-md w-full bg-[#111622] border border-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Top accent gradient bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500 rounded-t-lg" />

          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-3.5">
            {/* Square Icon Badge */}
            <div className="w-14 h-14 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500 shadow-inner relative">
              <ShieldAlert className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-xs animate-ping opacity-75" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 rounded-xs" />
            </div>

            {/* Status Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-rose-950/70 border border-rose-900/80 text-rose-400 text-[11px] font-mono font-bold tracking-wider uppercase">
              <Lock className="w-3.5 h-3.5" />
              <span>403 FORBIDDEN · ACCESS RESTRICTED</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Restricted Administrator Portal
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                You do not have permission to access the FanHub Admin Dashboard. This area is strictly reserved for authorized Administrators.
              </p>
            </div>
          </div>

          {/* Square Account Info Card */}
          <div className="bg-[#0b0e14] border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider pb-2 border-b border-slate-800/80">
              <span className="flex items-center gap-1.5 text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Current Account
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-slate-800/80 text-slate-400 border border-slate-700/60 font-mono">
                SESSION
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-500 font-medium">Email:</div>
              <div className="text-xs font-mono font-bold text-white truncate bg-slate-900/70 px-3 py-2 rounded-sm border border-slate-800">
                {user?.email || 'Not Signed In'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-medium">Role:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {user?.role || 'visitor'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm no-underline active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>

            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              type="button"
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Switch Account / Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isBypassAdminEnabled() && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-xs font-mono flex items-center justify-between z-50 relative">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              <strong>[DEV MODE]</strong> Chế độ Bypass Kiểm Tra Admin đang <strong>BẬT</strong> (<code className="bg-amber-950/60 px-1 py-0.5 rounded text-amber-200">config/adminConfig.ts</code> = <code className="text-emerald-400 font-bold">'on'</code>)
            </span>
          </div>
          <span className="text-[11px] text-amber-400/80 hidden sm:inline">Truy cập tất cả trang Quản trị không cần Token/Role API</span>
        </div>
      )}
      {children}
    </>
  );
};
