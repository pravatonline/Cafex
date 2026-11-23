'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, user } = useAuth();

  const [email, setEmail] = useState('admin@cafex.com');
  const [password, setPassword] = useState('Admin@Cafex2026');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect to admin overview
  if (user && ['admin', 'super_admin', 'manager', 'staff'].includes(user.role)) {
    router.push('/admin');
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await adminLogin(email, password, requires2FA ? twoFactorCode : undefined);
    setLoading(false);

    if (res.requires2FA) {
      setRequires2FA(true);
      setErrorMsg('');
      return;
    }

    if (res.success) {
      router.push('/admin');
    } else {
      setErrorMsg(res.message || 'Administrative credentials rejected.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0908] text-neutral-100">
      <div className="w-full max-w-md rounded-3xl bg-[#141210] border border-neutral-800 p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-600/20 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-600/10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
            Cafex Operations Portal
          </h2>
          <p className="text-xs text-neutral-400">
            Restricted access for Kitchen Staff, Store Managers & Executive Administrators.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          {!requires2FA ? (
            <>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Administrative Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="admin@cafex.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Master Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Enter 6-Digit Authenticator TOTP Code *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-500/40 bg-neutral-900 text-sm font-mono tracking-widest text-center text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[10px] text-neutral-400 text-center">
                Check your Google Authenticator or Authy app.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Validating Token...' : requires2FA ? 'Verify 2FA & Access Dashboard' : 'Authenticate Administrator'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
          <p><span className="text-white font-semibold">Demo Credentials:</span></p>
          <p>Email: <code className="text-amber-400">admin@cafex.com</code></p>
          <p>Password: <code className="text-amber-400">Admin@Cafex2026</code></p>
        </div>

        <div className="text-center">
          <NextLink
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Storefront
          </NextLink>
        </div>

      </div>
    </div>
  );
}
