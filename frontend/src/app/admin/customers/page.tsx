'use client';

import React, { useState } from 'react';
import { Users, Award, ShoppingBag, Coins, Search, ShieldCheck } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { formatCurrency } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([
    {
      id: 'u-1',
      fullName: 'Sarah Jenkins',
      email: 'sarah@example.com',
      phone: '+1 (555) 019-8822',
      totalOrders: 14,
      totalSpent: 348.50,
      points: 250,
      tier: 'Silver',
      joined: 'Nov 2024'
    },
    {
      id: 'u-2',
      fullName: 'Marcus Vance',
      email: 'marcus@example.com',
      phone: '+1 (555) 392-1982',
      totalOrders: 38,
      totalSpent: 890.20,
      points: 890,
      tier: 'Gold',
      joined: 'Feb 2024'
    },
    {
      id: 'u-3',
      fullName: 'David Chen',
      email: 'david@example.com',
      phone: '+1 (555) 492-3311',
      totalOrders: 72,
      totalSpent: 2640.00,
      points: 2640,
      tier: 'Platinum',
      joined: 'Jan 2023'
    },
    {
      id: 'u-4',
      fullName: 'Elena Rostova',
      email: 'elena@example.com',
      phone: '+1 (555) 201-9988',
      totalOrders: 8,
      totalSpent: 195.40,
      points: 150,
      tier: 'Bronze',
      joined: 'Aug 2024'
    }
  ]);

  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Customer Directory & Loyalty Management"
        subtitle="View guest lifetime spend, manage loyalty rewards tiers, and customer profiles."
      />

      <div className="p-8 space-y-6 max-w-7xl">
        
        {/* Search */}
        <div className="p-4 rounded-2xl bg-[#161412] border border-neutral-800 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by customer name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <span className="text-xs text-neutral-400">Total Registered Members: {customers.length}</span>
        </div>

        {/* Customer Table */}
        <div className="rounded-3xl bg-[#161412] border border-neutral-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-900/80 border-b border-neutral-800">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Total Orders</th>
                  <th className="py-4 px-4">Lifetime Spend</th>
                  <th className="py-4 px-4">Loyalty Tier</th>
                  <th className="py-4 px-4">Rewards Balance</th>
                  <th className="py-4 px-6">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {c.fullName.charAt(0)}
                      </div>
                      <span className="font-semibold text-white">{c.fullName}</span>
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      <span className="block">{c.email}</span>
                      <span className="text-[10px] text-neutral-500">{c.phone}</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {c.totalOrders} Orders
                    </td>
                    <td className="py-4 px-4 font-bold text-amber-500">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        c.tier === 'Gold' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        c.tier === 'Silver' ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' :
                        'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}>
                        {c.tier} Tier
                      </span>
                    </td>
                    <td className="py-4 px-4 text-neutral-300 font-medium">
                      <span className="flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-400" /> {c.points} pts
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-500">
                      {c.joined}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
