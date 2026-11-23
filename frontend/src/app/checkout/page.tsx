'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  Coins, 
  Tag, 
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { PaymentMethod } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    orderType, 
    subtotal, 
    couponDiscount, 
    deliveryFee, 
    taxAmount, 
    tipAmount, 
    setTipAmount, 
    totalAmount, 
    clearCart,
    appliedCoupon
  } = useCart();
  const { user } = useAuth();

  // Contact State
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Address State
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('94107');
  const [tableNumber, setTableNumber] = useState('T-01');

  // Payment Method Selection
  const [selectedGateway, setSelectedGateway] = useState<PaymentMethod>('stripe');

  // Loyalty Points Redemption
  const availablePoints = user?.loyalty?.points_balance || 0;
  const [redeemLoyalty, setRedeemLoyalty] = useState(false);
  const loyaltyPointsToUse = redeemLoyalty ? Math.min(availablePoints, Math.floor(subtotal * 100)) : 0;
  const loyaltyDiscount = Number((loyaltyPointsToUse / 100).toFixed(2));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const finalPayableTotal = Math.max(0, Number((totalAmount - loyaltyDiscount).toFixed(2)));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      setErrorMsg('Please enter customer name and phone number.');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Your cart is empty. Please add items to proceed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        orderType,
        customer: {
          name: customerName,
          email: customerEmail || 'guest@example.com',
          phone: customerPhone,
        },
        deliveryAddress: orderType === 'delivery' ? {
          street,
          city,
          state,
          postalCode,
        } : null,
        tableNumber: orderType === 'dine_in' ? tableNumber : null,
        items,
        couponCode: appliedCoupon,
        pointsToRedeem: loyaltyPointsToUse,
        tipAmount,
        paymentMethod: selectedGateway,
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.order) {
        clearCart();
        router.push(`/order-tracking/${res.order.order_number}`);
      } else {
        setErrorMsg(res.message || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
      }
    } catch {
      setErrorMsg('Network error. Failed to connect to ordering engine.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl font-bold text-espresso-950 dark:text-white mb-2">
          Your order is empty
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Add single-origin coffees, flaky pastries, or gourmet bowls before checking out.
        </p>
        <NextLink
          href="/menu"
          className="px-6 py-3 rounded-full bg-amber-600 text-white font-semibold text-xs uppercase tracking-wider shadow-md"
        >
          Return to Menu
        </NextLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Back button */}
      <div className="mb-6">
        <NextLink
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-amber-600 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
        </NextLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Checkout Details Form */}
        <div className="lg:col-span-7 space-y-6">
          
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
            
            {/* 1. Customer Information */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-espresso-950 dark:text-white border-b border-espresso-100 dark:border-neutral-800 pb-3">
                1. Contact & Recipient Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Phone Number (for SMS Tracking) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Email Address (for Digital Receipt)
                </label>
                <input
                  type="email"
                  placeholder="sarah@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* 2. Delivery Address or Dine-In Table */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-espresso-950 dark:text-white border-b border-espresso-100 dark:border-neutral-800 pb-3 flex items-center justify-between">
                <span>2. Fulfillment: {orderType.toUpperCase()}</span>
                <span className="text-xs font-normal text-amber-600 dark:text-amber-400 capitalize">{orderType} Order</span>
              </h3>

              {orderType === 'delivery' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Street Address & Apt/Suite *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="450 Mission St, Apt 12B"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {orderType === 'dine_in' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Your Table Number (Look at table stand QR)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. T-04 or Window Table"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Our barista will bring your fresh order directly to your table.</p>
                </div>
              )}

              {orderType === 'takeaway' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                  <p className="font-semibold">Pickup at Express Roastery Counter</p>
                  <p className="text-[11px] mt-0.5">Your drinks & pastries will be freshly packed and ready in ~15 minutes at 742 Evergreen Terrace.</p>
                </div>
              )}
            </div>

            {/* 3. Multi-Gateway Payment Options */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-espresso-950 dark:text-white border-b border-espresso-100 dark:border-neutral-800 pb-3 flex items-center justify-between">
                <span>3. Payment Gateway Integration</span>
                <span className="flex items-center gap-1 text-[11px] text-green-500 font-medium">
                  <Lock className="w-3.5 h-3.5" /> 256-bit Encrypted
                </span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'stripe', label: 'Stripe', subtitle: 'Visa / MC / Apple Pay' },
                  { id: 'razorpay', label: 'Razorpay', subtitle: 'UPI / Cards / NetBanking' },
                  { id: 'phonepe', label: 'PhonePe', subtitle: 'Instant UPI Flow' },
                  { id: 'payu', label: 'PayU', subtitle: 'Secured Gateway' },
                  { id: 'paypal', label: 'PayPal', subtitle: 'Global Balance' },
                  { id: 'cod', label: 'Cash on Delivery', subtitle: 'Pay when served' },
                ].map((gateway) => (
                  <button
                    key={gateway.id}
                    type="button"
                    onClick={() => setSelectedGateway(gateway.id as PaymentMethod)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      selectedGateway === gateway.id
                        ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/30'
                        : 'border-espresso-200 dark:border-neutral-800 text-espresso-950 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <span className="font-bold text-xs">{gateway.label}</span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">{gateway.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

          </form>

        </div>

        {/* Right Column: Order Summary, Coupons & Loyalty points */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-xl space-y-6 sticky top-28">
            
            <h3 className="font-serif font-bold text-lg text-espresso-950 dark:text-white border-b border-espresso-100 dark:border-neutral-800 pb-3">
              Order Summary ({items.length} items)
            </h3>

            {/* Item List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-bold text-amber-600 w-4">{item.quantity}x</span>
                    <span className="font-medium text-espresso-950 dark:text-white truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-espresso-950 dark:text-white shrink-0">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Loyalty Points Redemption Box */}
            {availablePoints > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Coins className="w-4 h-4" /> Cafex Rewards ({availablePoints} pts available)
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={redeemLoyalty}
                      onChange={(e) => setRedeemLoyalty(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:left-[0px] after:bg-amber-600 after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500/30"></div>
                  </label>
                </div>
                {redeemLoyalty && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                    Redeeming {loyaltyPointsToUse} points for a {formatCurrency(loyaltyDiscount)} voucher deduction!
                  </p>
                )}
              </div>
            )}

            {/* Tip Selection (Delivery only) */}
            {orderType === 'delivery' && (
              <div className="space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Courier Courier Tip
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[1.50, 2.00, 3.00, 5.00].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTipAmount(t)}
                      className={`py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                        tipAmount === t
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'border-espresso-200 dark:border-neutral-800 text-espresso-950 dark:text-neutral-300'
                      }`}
                    >
                      ${t.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calculation Breakdown */}
            <div className="space-y-2 text-xs border-t border-espresso-100 dark:border-neutral-800 pt-4 text-neutral-500 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-espresso-950 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                  <span>Loyalty Points Discount</span>
                  <span>-{formatCurrency(loyaltyDiscount)}</span>
                </div>
              )}
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-espresso-950 dark:text-white">{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Free'}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (8.5%)</span>
                <span className="font-semibold text-espresso-950 dark:text-white">{formatCurrency(taxAmount)}</span>
              </div>
              {orderType === 'delivery' && tipAmount > 0 && (
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span className="font-semibold text-espresso-950 dark:text-white">{formatCurrency(tipAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-espresso-950 dark:text-white pt-2 border-t border-espresso-100 dark:border-neutral-800">
                <span>Total Amount</span>
                <span className="text-lg text-amber-600 dark:text-amber-400">{formatCurrency(finalPayableTotal)}</span>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{errorMsg}</p>
            )}

            {/* Submit Order Trigger */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isSubmitting ? (
                'Processing Order...'
              ) : (
                <>
                  Pay {formatCurrency(finalPayableTotal)} & Place Order
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
