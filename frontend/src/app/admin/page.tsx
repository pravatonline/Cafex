'use client';

import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Coffee, 
  Calendar, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const res = await api.getAdminAnalytics();
      setData(res);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { kpis, statusCounts, salesTrend, categorySales, topSellingItems } = data;

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Executive Operations & Analytics"
        subtitle="Real-time financial performance, kitchen velocity, and menu telemetry."
      />

      <div className="p-8 space-y-8 max-w-7xl">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl bg-[#161412] border border-neutral-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Revenue</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-serif font-bold text-white">{formatCurrency(kpis.totalRevenue)}</span>
              <div className="flex items-center gap-1 text-[11px] text-green-400 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last week
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#161412] border border-neutral-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Orders</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-serif font-bold text-white">{kpis.totalOrdersCount}</span>
              <div className="flex items-center gap-1 text-[11px] text-green-400 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +12 new orders today
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#161412] border border-neutral-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Avg Order Value</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-serif font-bold text-white">{formatCurrency(kpis.avgOrderValue)}</span>
              <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
                <span>Healthy customer basket size</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#161412] border border-neutral-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active Diners / Tables</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-serif font-bold text-white">{kpis.activeTablesCount} Available</span>
              <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-1 font-medium">
                <span>73% Peak Table Occupancy</span>
              </div>
            </div>
          </div>

        </div>

        {/* Charts & Trends Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sales Trend Visualizer */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-[#161412] border border-neutral-800 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-white">Revenue Timeline (Last 7 Days)</h3>
                <p className="text-xs text-neutral-400">Peak sales recorded during Saturday & Sunday morning brunch.</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400">
                Weekly Total: $16,560
              </span>
            </div>

            {/* Custom Bar Graph */}
            <div className="h-56 flex items-end justify-between gap-4 pt-6 px-2">
              {salesTrend.map((item: any) => {
                const maxRevenue = 4000;
                const heightPercent = Math.min(100, (item.revenue / maxRevenue) * 100);
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${item.revenue}
                    </div>
                    <div
                      className="w-full max-w-[48px] rounded-2xl bg-gradient-to-t from-amber-700 to-amber-500 group-hover:from-amber-600 group-hover:to-amber-400 transition-all shadow-md shadow-amber-600/20"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-xs font-semibold text-neutral-400 mt-1">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Sales Breakdown */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-[#161412] border border-neutral-800 shadow-md space-y-6">
            <h3 className="font-serif font-bold text-base text-white">Category Sales Share</h3>
            <div className="space-y-4">
              {categorySales.map((cat: any) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-300 font-medium">{cat.category}</span>
                    <span className="text-amber-400 font-bold">{cat.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Top Selling Items Table */}
        <div className="p-6 rounded-3xl bg-[#161412] border border-neutral-800 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-white">Top 5 Bestselling Menu Items</h3>
            <span className="text-xs text-neutral-400">Ranked by customer orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-800 pb-3">
                <tr>
                  <th className="pb-3">Item Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Orders Completed</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {topSellingItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 pr-4 flex items-center gap-3 font-semibold text-white">
                      <img src={item.imageUrl || item.image_url} alt={item.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3.5 text-neutral-400">{item.category || item.category_name}</td>
                    <td className="py-3.5 font-bold text-white">{formatCurrency(item.price || item.base_price)}</td>
                    <td className="py-3.5 text-neutral-300 font-semibold">{item.ordersCount || item.rating_count} sold</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400">
                        In Stock
                      </span>
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
