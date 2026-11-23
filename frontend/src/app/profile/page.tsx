'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  Coins, 
  Award, 
  ShoppingBag, 
  Calendar, 
  LogOut, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl font-bold text-espresso-950 dark:text-white mb-2">Access Restricted</h2>
        <p className="text-xs text-neutral-500 mb-6">Please log in to view your profile and loyalty balance.</p>
        <NextLink href="/login" className="px-6 py-2.5 rounded-full bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider">
          Go to Sign In
        </NextLink>
      </div>
    );
  }

  const loyalty = user.loyalty || { points_balance: 250, lifetime_points: 480, tier: 'Silver' };

  const pastOrders = [
    {
      id: 'ord-1001',
      orderNumber: 'CFX-2026-8941',
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      items: '2x Cafex Signature Golden Cortado, 1x Pain au Chocolat',
      total: 21.67,
      status: 'delivered',
    },
    {
      id: 'ord-1002',
      orderNumber: 'CFX-2026-7712',
      date: new Date(Date.now() - 10 * 86400000).toISOString(),
      items: '1x Truffled Prosciutto Panini, 1x Velvet Nitro Cold Brew',
      total: 18.90,
      status: 'completed',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header Profile Summary */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-amber-600/30" style={{ width: '72px', height: '72px' }}>
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950 dark:text-white">
                {user.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {loyalty.tier} Member
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">{user.email} &bull; {user.phone || '+1 (555) 019-8822'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {['admin', 'super_admin', 'manager'].includes(user.role) && (
            <NextLink
              href="/admin"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Portal
            </NextLink>
          )}
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="px-4 py-2 rounded-xl border border-espresso-200 dark:border-neutral-700 hover:bg-red-50 dark:hover:bg-red-950/20 text-neutral-600 dark:text-neutral-400 hover:text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Loyalty Card & Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-espresso-950 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200">
                  Cafex Rewards Card
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1">{loyalty.tier} Tier</h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-200" />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-amber-200 block">Available Balance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-4xl font-extrabold">{loyalty.points_balance}</span>
                <span className="text-xs text-amber-200">Points (= {formatCurrency(loyalty.points_balance / 100)} voucher)</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/20 text-xs">
              <div className="flex justify-between text-amber-200 text-[11px]">
                <span>Progress to Gold (1,000 pts)</span>
                <span>{loyalty.lifetime_points || 480} / 1,000 pts</span>
              </div>
              <div className="h-2 rounded-full bg-black/30 overflow-hidden">
                <div
                  className="h-full bg-amber-300 rounded-full"
                  style={{ width: `${Math.min(100, ((loyalty.lifetime_points || 480) / 1000) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 space-y-3">
            <h4 className="font-serif font-bold text-sm text-espresso-950 dark:text-white">How Rewards Work</h4>
            <ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-2">
              <li className="flex items-center gap-2">✓ Earn 10 points for every $1 spent on orders.</li>
              <li className="flex items-center gap-2">✓ Redeem 100 points for $1.00 instant checkout voucher.</li>
              <li className="flex items-center gap-2">✓ Gold & Platinum members receive complimentary monthly cold brew.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Historical Orders */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-xl space-y-6">
            <h3 className="font-serif font-bold text-lg text-espresso-950 dark:text-white border-b border-espresso-100 dark:border-neutral-800 pb-3 flex items-center justify-between">
              <span>Your Recent Orders</span>
              <ShoppingBag className="w-4 h-4 text-amber-500" />
            </h3>

            <div className="space-y-4">
              {pastOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-espresso-50/70 dark:bg-neutral-900/60 border border-espresso-100 dark:border-neutral-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-espresso-950 dark:text-white">#{ord.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-500/10 text-green-500">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{ord.items}</p>
                    <span className="text-[10px] text-neutral-400">{formatDate(ord.date)}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block font-bold text-sm text-espresso-950 dark:text-white">
                      {formatCurrency(ord.total)}
                    </span>
                    <NextLink
                      href={`/order-tracking/${ord.orderNumber}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline mt-1"
                    >
                      Track Order <ArrowRight className="w-3 h-3" />
                    </NextLink>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <NextLink
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-600 text-white font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-amber-700 transition-colors"
              >
                Place a New Order
              </NextLink>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
