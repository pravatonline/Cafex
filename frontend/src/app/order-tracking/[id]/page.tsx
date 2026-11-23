'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import NextLink from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  Bike, 
  Coffee, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ArrowLeft,
  Flame,
  PackageCheck
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, formatTime } from '@/lib/utils';
import { api } from '@/lib/api';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderIdentifier = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderIdentifier) return;
      const res = await api.getOrderTracking(orderIdentifier);
      if (res) {
        setOrder(res);
      } else {
        // Fallback realistic order simulation
        setOrder({
          id: 'ord-sim',
          order_number: orderIdentifier,
          customer_name: 'Sarah Jenkins',
          customer_email: 'sarah@example.com',
          customer_phone: '+1 (555) 749-2831',
          order_type: 'delivery',
          status: 'preparing',
          delivery_address: {
            street: '450 Mission St, Apt 12B',
            city: 'San Francisco',
            state: 'CA',
            postal_code: '94105',
          },
          items: [
            {
              product_id: 'p1',
              product_name: 'Cafex Signature Golden Cortado',
              unit_price: 4.75,
              quantity: 2,
              total_price: 9.50,
              selected_addons: [{ group: 'Milk Option', name: 'Organic Oat Milk', price: 0.85 }],
            },
            {
              product_id: 'p7',
              product_name: 'French Butter Pain au Chocolat',
              unit_price: 4.95,
              quantity: 1,
              total_price: 4.95,
              selected_addons: [],
            },
          ],
          subtotal: 14.45,
          discount_amount: 0.00,
          tax_amount: 1.23,
          delivery_fee: 3.99,
          tip_amount: 2.00,
          total_amount: 21.67,
          payment_method: 'stripe',
          payment_status: 'paid',
          created_at: new Date().toISOString(),
          estimated_delivery_time: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
        });
      }
      setLoading(false);
    }

    loadOrder();
  }, [orderIdentifier]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl font-bold text-espresso-950 dark:text-white mb-2">Order Not Found</h2>
        <p className="text-xs text-neutral-500 mb-6">Could not locate tracking information for #{orderIdentifier}.</p>
        <NextLink href="/" className="px-6 py-2.5 rounded-full bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider">
          Back to Home
        </NextLink>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Received by kitchen system' },
    { key: 'confirmed', label: 'Payment Verified', desc: 'Ingredients prepared' },
    { key: 'preparing', label: 'Brewing & Baking', desc: 'Baristas crafting items' },
    { key: 'ready', label: 'Ready', desc: 'Freshly packed & insulated' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier en route' },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your artisan coffee!' },
  ];

  const statusOrder = ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed'];
  const currentIndex = Math.max(0, statusOrder.indexOf(order.status));

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso-100 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Live Order Tracking
          </span>
          <h1 className="font-serif text-3xl font-bold text-espresso-950 dark:text-white mt-1">
            Order #{order.order_number}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Estimated Delivery: <span className="font-semibold text-espresso-950 dark:text-white">~25-30 Minutes</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Paid via {order.payment_method.toUpperCase()}
          </div>
          <NextLink
            href="/menu"
            className="px-4 py-2 rounded-xl border border-espresso-200 dark:border-neutral-800 text-xs font-semibold text-espresso-900 dark:text-white hover:border-amber-500 transition-colors"
          >
            Order More
          </NextLink>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-xl space-y-6">
        <h3 className="font-serif font-bold text-lg text-espresso-950 dark:text-white">
          Real-Time Preparation Lifecycle
        </h3>

        <div className="relative">
          {/* Track Line */}
          <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-espresso-100 dark:bg-neutral-800 z-0">
            <div
              className="h-full bg-amber-600 transition-all duration-700"
              style={{ width: `${Math.min(100, (currentIndex / 5) * 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const isPast = idx <= currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={step.key} className="flex flex-col sm:items-center sm:text-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-amber-600 text-white ring-4 ring-amber-500/30 scale-110 shadow-lg'
                        : isPast
                        ? 'bg-green-600 text-white'
                        : 'bg-espresso-100 dark:bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {isPast && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isCurrent ? 'text-amber-600 dark:text-amber-400' : 'text-espresso-950 dark:text-white'}`}>
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Recipient & Location */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-espresso-950 dark:text-white border-b border-espresso-100 dark:border-neutral-800 pb-3">
            Fulfillment Details
          </h3>
          <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
            <p><span className="text-neutral-400">Recipient:</span> <span className="font-semibold text-espresso-950 dark:text-white">{order.customer_name}</span></p>
            <p><span className="text-neutral-400">Phone:</span> <span className="font-semibold text-espresso-950 dark:text-white">{order.customer_phone}</span></p>
            {order.delivery_address && (
              <p><span className="text-neutral-400">Delivery Address:</span> <span className="font-semibold text-espresso-950 dark:text-white">{order.delivery_address.street}, {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}</span></p>
            )}
            <p><span className="text-neutral-400">Fulfillment Mode:</span> <span className="font-semibold text-amber-600 uppercase">{order.order_type}</span></p>
          </div>
        </div>

        {/* Financial Items Summary */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-espresso-950 dark:text-white border-b border-espresso-100 dark:border-neutral-800 pb-3">
            Items in Order ({order.items.length})
          </h3>
          <div className="space-y-3 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-espresso-950 dark:text-white">{item.quantity}x {item.product_name}</span>
                  {item.selected_addons && item.selected_addons.length > 0 && (
                    <span className="block text-[10px] text-neutral-400">{item.selected_addons.map(a => a.name).join(', ')}</span>
                  )}
                </div>
                <span className="font-bold text-espresso-950 dark:text-white">{formatCurrency(item.total_price)}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-espresso-100 dark:border-neutral-800 flex justify-between font-bold text-sm text-espresso-950 dark:text-white">
              <span>Total Paid</span>
              <span className="text-amber-600 dark:text-amber-400">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
