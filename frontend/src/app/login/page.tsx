'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { Coffee, Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    router.push('/profile');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (mode === 'signin') {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        router.push('/profile');
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } else {
      if (!fullName) {
        setErrorMsg('Please enter your full name.');
        setLoading(false);
        return;
      }
      const res = await register(fullName, email, password, phone);
      setLoading(false);
      if (res.success) {
        router.push('/profile');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white mx-auto shadow-md shadow-amber-600/20">
            <Coffee className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-espresso-950 dark:text-white">
            {mode === 'signin' ? 'Welcome Back to Cafex' : 'Join Cafex Rewards'}
          </h2>
          <p className="text-xs text-neutral-500">
            {mode === 'signin'
              ? 'Sign in to access your order history and loyalty points.'
              : 'Create an account and receive 50 bonus welcome points immediately!'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 rounded-2xl bg-espresso-50 dark:bg-neutral-900 border border-espresso-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-white dark:bg-neutral-800 text-espresso-950 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-espresso-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-neutral-800 text-espresso-950 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-espresso-900 dark:hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Sarah Jenkins"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-8822"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Account' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-espresso-100 dark:border-neutral-800 text-center">
          <NextLink
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Staff & Admin Portal Sign In &rarr;
          </NextLink>
        </div>

      </div>
    </div>
  );
}
