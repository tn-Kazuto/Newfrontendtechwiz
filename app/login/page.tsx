'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, User, Lock, Sparkles, Check, ShieldCheck, LogIn, Key } from 'lucide-react';
import { JwtTokenInspectorModal } from '../../components/JwtTokenInspectorModal';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoggedIn, loginAs } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isJwtModalOpen, setIsJwtModalOpen] = useState(false);

  // If already logged in, show user profile view
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full bg-[#161b22] border-2 border-black p-6 space-y-5 shadow-[8px_8px_0px_#000000]">
          <div className="bg-[#ffd60a] text-black px-4 py-2 border-b-2 border-black flex items-center justify-between -mx-6 -mt-6 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" />
              <h2 className="text-xs font-black uppercase tracking-wider m-0">FAN PROFILE CARD</h2>
            </div>
            <span className="text-[10px] font-black px-1.5 py-0.5 bg-black text-emerald-400">ONLINE</span>
          </div>

          <div className="text-center space-y-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-3 border-[#ff2e93] shadow-[3px_3px_0px_#000]"
            />
            <h3 className="text-lg font-black text-white m-0">{user.name}</h3>
            <p className="text-xs text-neutral-400 m-0">{user.email}</p>
          </div>

          <div className="p-3 bg-black/60 border border-neutral-700 text-xs space-y-2 rounded-none">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 uppercase text-[11px] font-bold">Role:</span>
              <span className="text-[#ffd60a] font-black uppercase tracking-wider">{user.role}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 uppercase text-[11px] font-bold">Fandoms:</span>
              <span className="text-white font-bold truncate max-w-[200px]">
                {user.favoriteFandoms && user.favoriteFandoms.length > 0 ? user.favoriteFandoms.join(', ') : 'All Universal'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 uppercase text-[11px] font-bold">Member Since:</span>
              <span className="text-neutral-300 font-bold">{user.memberSince || '2024'}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setIsJwtModalOpen(true)}
              className="py-2.5 px-4 bg-[#00f0ff] hover:bg-cyan-400 text-black text-xs font-black text-center border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>INSPECT SECURE JWT TOKEN CLAIMS</span>
            </button>

            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="py-2.5 px-4 bg-[#ffd60a] hover:bg-yellow-400 text-black text-xs font-black text-center no-underline border-2 border-black shadow-[3px_3px_0px_#000]"
              >
                OPEN ADMIN MANAGEMENT PANEL →
              </Link>
            )}
            <Link
              href="/"
              className="py-2.5 px-4 bg-[#ff2e93] hover:bg-pink-600 text-white text-xs font-black text-center no-underline border-2 border-black shadow-[3px_3px_0px_#000]"
            >
              RETURN TO MAIN HUB &amp; EXPLORE →
            </Link>
          </div>
        </div>

        {/* JWT Inspector Modal */}
        <JwtTokenInspectorModal
          isOpen={isJwtModalOpen}
          onClose={() => setIsJwtModalOpen(false)}
        />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const lower = email.toLowerCase();
      if (lower.includes('admin') || lower === 'admin@fanhubplus.com') {
        loginAs('admin', { email, name: 'Fandom Director (Admin)' });
        router.push('/admin');
      } else {
        loginAs('registered', { email, name: email.split('@')[0] });
        router.push('/');
      }
    }, 500);
  };

  const handleQuickLogin = (role: 'admin' | 'registered') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginAs(role);
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-mono relative selection:bg-[#ff2e93] selection:text-white">
      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
          FAN HUB PLUS AUTH
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-[#161b22] border-2 border-black shadow-[8px_8px_0px_#000000] overflow-hidden my-auto">
        {/* Banner Bar */}
        <div className="bg-[#ffd60a] text-black px-5 py-3 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff2e93] border border-black inline-block" />
            <h1 className="text-xs font-black uppercase tracking-wider m-0">
              ★ SECURE SYSTEM LOGIN
            </h1>
          </div>
          <span className="text-[10px] font-black px-1.5 py-0.5 bg-black text-white">
            SECURE V2.4
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Demo Credentials Box */}
          <div className="p-3 bg-amber-950/40 border border-amber-500/40 text-xs space-y-2">
            <div className="flex items-center justify-between text-amber-300 font-bold text-[11px] uppercase">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                SRS 1.9 DEMO 1-TOUCH
              </span>
              <span className="text-[9px] bg-amber-500/20 px-1 py-0.5 border border-amber-500/30">EVALUATOR</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 bg-black border border-amber-500/50 hover:border-amber-400 text-left transition-colors cursor-pointer"
              >
                <div className="text-[10px] font-black text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  ADMIN
                </div>
                <div className="text-[9px] text-neutral-400 truncate">admin@fanhubplus.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('registered')}
                className="p-2 bg-black border border-pink-500/50 hover:border-pink-400 text-left transition-colors cursor-pointer"
              >
                <div className="text-[10px] font-black text-[#ff2e93] flex items-center gap-1">
                  <User className="w-3 h-3" />
                  FAN USER
                </div>
                <div className="text-[9px] text-neutral-400 truncate">fan_tokki@gmail.com</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300 uppercase block">
                Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fanhubplus.com or fan@..."
                  className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-neutral-700 text-white text-xs font-mono focus:border-[#ffd60a] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300 uppercase block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-neutral-700 text-white text-xs font-mono focus:border-[#ffd60a] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <span>AUTHENTICATING...</span>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>SIGN IN TO FAN HUB</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2 text-[10px] text-neutral-500 font-bold uppercase">
            <span className="flex-1 h-px bg-neutral-700" />
            <span>OR CONTINUE WITH</span>
            <span className="flex-1 h-px bg-neutral-700" />
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                loginAs('registered', { 
                  email: 'fan_google_oauth@gmail.com', 
                  name: 'Haerin (Google Account) ⭐' 
                });
                router.push('/');
              }, 400);
            }}
            className="w-full py-2.5 bg-white hover:bg-neutral-100 text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>ONE-TOUCH GOOGLE OAUTH SIGN-IN</span>
          </button>

          {/* Security Telemetry & JWT Check Button */}
          <button
            type="button"
            onClick={() => setIsJwtModalOpen(true)}
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-cyan-300 font-bold text-[11px] uppercase border border-cyan-500/50 cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            <span>INSPECT SECURE JWT TOKEN CLAIMS</span>
          </button>

          <div className="pt-2 text-center text-[11px] text-neutral-400">
            <span>Don't have an account? </span>
            <Link href="/#login" className="text-[#ffd60a] hover:underline font-bold">
              Sign up on Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* JWT Inspector Modal */}
      <JwtTokenInspectorModal
        isOpen={isJwtModalOpen}
        onClose={() => setIsJwtModalOpen(false)}
      />

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[10px] text-neutral-600 pt-4">
        © 2026 FAN HUB PLUS • APTECH TECHWIZ 7 ACCREDITATION
      </div>
    </div>
  );
}
