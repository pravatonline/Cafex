'use client';

import React, { useState } from 'react';
import { Ticket, Plus, Tag, Percent, DollarSign, Check, X } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { mockCoupons } from '@/lib/mockData';
import { Coupon } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('20');
  const [minOrder, setMinOrder] = useState('15');
  const [maxDiscount, setMaxDiscount] = useState('10');

  const toggleCoupon = (id: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      description,
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_amount: Number(minOrder),
      max_discount_amount: discountType === 'percentage' ? Number(maxDiscount) : null,
      usage_limit: 1000,
      used_count: 0,
      is_first_order_only: false,
      is_active: true
    };

    setCoupons([newCoupon, ...coupons]);
    setModalOpen(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Promotions & Coupon Engine"
        subtitle="Configure marketing discounts, percentage off vouchers, and track redemption velocity."
      />

      <div className="p-8 space-y-6 max-w-7xl">
        
        {/* Header Action */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#161412] border border-neutral-800">
          <div>
            <h3 className="font-serif font-bold text-base text-white">Active Promo Vouchers</h3>
            <p className="text-xs text-neutral-400">Total active promotional campaigns: {coupons.filter(c => c.is_active).length}</p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Voucher
          </button>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="p-6 rounded-3xl bg-[#161412] border border-neutral-800 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-base text-white tracking-wider">
                        {coupon.code}
                      </span>
                      <span className="block text-[10px] text-amber-500 font-semibold uppercase">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% Discount` : `${formatCurrency(coupon.discount_value)} Flat Off`}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${coupon.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {coupon.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {coupon.description}
                </p>

                <div className="text-[11px] text-neutral-500 space-y-1 pt-2 border-t border-neutral-800/80">
                  <p>Min Order Spend: <strong className="text-neutral-300">{formatCurrency(coupon.min_order_amount)}</strong></p>
                  {coupon.max_discount_amount && (
                    <p>Max Savings Cap: <strong className="text-neutral-300">{formatCurrency(coupon.max_discount_amount)}</strong></p>
                  )}
                  <p>Times Redeemed: <strong className="text-amber-400">{coupon.used_count} orders</strong></p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => toggleCoupon(coupon.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                    coupon.is_active
                      ? 'border border-neutral-700 hover:bg-neutral-800 text-neutral-300'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {coupon.is_active ? 'Deactivate Coupon' : 'Enable Coupon'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Create Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-[#161412] border border-neutral-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-white">Generate Promo Voucher</h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER30"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Dollar ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Min Order ($)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Max Cap ($)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 30% off summer pour-over flights"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider"
                >
                  Generate Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
