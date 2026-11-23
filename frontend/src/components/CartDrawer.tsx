'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Check, 
  Bike, 
  ShoppingBasket, 
  Utensils 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    orderType,
    setOrderType,
    removeItem,
    updateQuantity,
    appliedCoupon,
    couponDiscount,
    subtotal,
    deliveryFee,
    taxAmount,
    totalAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplying(true);
    setCouponError('');
    const res = await applyCoupon(couponInput.trim());
    setIsApplying(false);

    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#141210] shadow-2xl flex flex-col border-l border-espresso-100 dark:border-neutral-800">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-espresso-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-serif font-bold text-espresso-950 dark:text-white">Your Order</h2>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="p-2 rounded-full hover:bg-espresso-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-espresso-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Type Selector */}
          <div className="p-4 bg-espresso-50 dark:bg-neutral-900/60 border-b border-espresso-100 dark:border-neutral-800">
            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              Select Fulfillment
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === 'delivery'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-800 text-espresso-800 dark:text-neutral-300 hover:bg-espresso-100 dark:hover:bg-neutral-700'
                }`}
              >
                <Bike className="w-3.5 h-3.5" /> Delivery
              </button>
              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === 'takeaway'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-800 text-espresso-800 dark:text-neutral-300 hover:bg-espresso-100 dark:hover:bg-neutral-700'
                }`}
              >
                <ShoppingBasket className="w-3.5 h-3.5" /> Takeaway
              </button>
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === 'dine_in'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-800 text-espresso-800 dark:text-neutral-300 hover:bg-espresso-100 dark:hover:bg-neutral-700'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" /> Dine-In
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-12">
                <div className="w-16 h-16 rounded-full bg-espresso-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-semibold text-lg text-espresso-950 dark:text-white mb-1">
                  Your cart is empty
                </h3>
                <p className="text-sm max-w-xs mb-6">
                  Explore our handcrafted coffees, artisan pastries, and signature specials.
                </p>
                <NextLink
                  href="/menu"
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Browse Menu
                </NextLink>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 p-3.5 rounded-2xl bg-espresso-50/70 dark:bg-neutral-900/50 border border-espresso-100 dark:border-neutral-800"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-18 h-18 rounded-xl object-cover shrink-0"
                    style={{ width: '72px', height: '72px' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-espresso-950 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add-on Summary */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {item.selectedAddons.map(a => a.name).join(', ')}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 rounded-lg p-1 border border-espresso-200 dark:border-neutral-700">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-espresso-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-espresso-950 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-espresso-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer (Financial Breakdown & Checkout Button) */}
          {items.length > 0 && (
            <div className="p-6 border-t border-espresso-100 dark:border-neutral-800 space-y-4 bg-white dark:bg-[#141210]">
              
              {/* Promo Code Input */}
              <div className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-600 dark:text-green-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Code &apos;{appliedCoupon}&apos; applied (-{formatCurrency(couponDiscount)})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold hover:underline text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Coupon (e.g. WELCOME50)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-espresso-950 dark:text-white uppercase focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
                    >
                      {isApplying ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-espresso-950 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span>-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee {subtotal >= 35 && <span className="text-green-500 font-semibold">(Free)</span>}</span>
                    <span className="font-medium text-espresso-950 dark:text-white">{deliveryFee > 0 ? formatCurrency(deliveryFee) : '$0.00'}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (8.5%)</span>
                  <span className="font-medium text-espresso-950 dark:text-white">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="pt-2 border-t border-espresso-100 dark:border-neutral-800 flex justify-between text-sm font-bold text-espresso-950 dark:text-white">
                  <span>Total</span>
                  <span className="text-base text-amber-600 dark:text-amber-400">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <NextLink
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-all shadow-md shadow-amber-600/20 group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </NextLink>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
