'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter 
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, formatTime } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-1001',
      order_number: 'CFX-2026-8941',
      customer_name: 'Sarah Jenkins',
      customer_email: 'sarah@example.com',
      customer_phone: '+1 (555) 019-8822',
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
          special_instructions: 'Extra hot microfoam'
        },
        {
          product_id: 'p7',
          product_name: 'French Butter Pain au Chocolat',
          unit_price: 4.95,
          quantity: 1,
          total_price: 4.95,
          selected_addons: []
        }
      ],
      subtotal: 14.45,
      discount_amount: 0.00,
      tax_amount: 1.23,
      delivery_fee: 3.99,
      tip_amount: 2.00,
      total_amount: 21.67,
      payment_method: 'stripe',
      payment_status: 'paid',
      created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString()
    },
    {
      id: 'ord-1002',
      order_number: 'CFX-2026-9023',
      customer_name: 'Marcus Vance',
      customer_email: 'marcus@example.com',
      customer_phone: '+1 (555) 392-1982',
      order_type: 'takeaway',
      status: 'placed',
      items: [
        {
          product_id: 'p3',
          product_name: 'Velvet Nitro Cold Brew',
          unit_price: 5.95,
          quantity: 1,
          total_price: 5.95,
          selected_addons: []
        },
        {
          product_id: 'p9',
          product_name: 'Truffled Prosciutto Panini',
          unit_price: 11.50,
          quantity: 1,
          total_price: 11.50,
          selected_addons: []
        }
      ],
      subtotal: 17.45,
      discount_amount: 0.00,
      tax_amount: 1.48,
      delivery_fee: 0.00,
      tip_amount: 0.00,
      total_amount: 18.93,
      payment_method: 'phonepe',
      payment_status: 'paid',
      created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString()
    },
    {
      id: 'ord-1003',
      order_number: 'CFX-2026-9011',
      customer_name: 'Emily Watson',
      customer_email: 'emily@example.com',
      customer_phone: '+1 (555) 888-2910',
      order_type: 'dine_in',
      status: 'ready',
      items: [
        {
          product_id: 'p5',
          product_name: 'Ceremonial Uji Matcha Latte',
          unit_price: 6.50,
          quantity: 2,
          total_price: 13.00,
          selected_addons: []
        }
      ],
      subtotal: 13.00,
      discount_amount: 0.00,
      tax_amount: 1.10,
      delivery_fee: 0.00,
      tip_amount: 1.50,
      total_amount: 15.60,
      payment_method: 'razorpay',
      payment_status: 'paid',
      created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = activeFilter === 'all' || o.status === activeFilter;
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Live Kitchen Display & Order Dispatch"
        subtitle="Manage live orders, monitor prep times, and update customer tracking."
      />

      <div className="p-8 space-y-6 max-w-7xl">
        
        {/* Filter Controls */}
        <div className="p-4 rounded-2xl bg-[#161412] border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {[
              { label: 'All Orders', value: 'all' },
              { label: 'New Placed', value: 'placed' },
              { label: 'Kitchen In-Prep', value: 'preparing' },
              { label: 'Ready for Pickup', value: 'ready' },
              { label: 'Out for Delivery', value: 'out_for_delivery' },
              { label: 'Delivered', value: 'delivered' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === f.value
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Order # or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

        </div>

        {/* Order Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-3xl bg-[#161412] border border-neutral-800 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-800/80 pb-3">
                  <div>
                    <span className="font-mono font-bold text-base text-amber-500">
                      #{order.order_number}
                    </span>
                    <p className="text-xs font-semibold text-white mt-0.5">{order.customer_name}</p>
                    <p className="text-[10px] text-neutral-400">{order.customer_phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 block mb-1">
                      {order.order_type}
                    </span>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" /> Just now
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="py-4 space-y-2.5 border-b border-neutral-800/80 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-white">{item.quantity}x {item.product_name}</span>
                        {item.selected_addons && item.selected_addons.length > 0 && (
                          <p className="text-[10px] text-amber-400/90">{item.selected_addons.map(a => a.name).join(', ')}</p>
                        )}
                        {item.special_instructions && (
                          <p className="text-[10px] text-neutral-400 italic mt-0.5">Note: &ldquo;{item.special_instructions}&rdquo;</p>
                        )}
                      </div>
                      <span className="font-bold text-neutral-300 shrink-0">{formatCurrency(item.total_price)}</span>
                    </div>
                  ))}
                </div>

                {order.delivery_address && (
                  <p className="text-[10px] text-neutral-400 pt-2 line-clamp-1">
                    Deliver to: {order.delivery_address.street}, {order.delivery_address.city}
                  </p>
                )}
              </div>

              {/* Status Controls */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold text-white mb-3">
                  <span>Total Payable:</span>
                  <span className="text-amber-500">{formatCurrency(order.total_amount)} ({order.payment_method.toUpperCase()})</span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Update Order Velocity:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => updateStatus(order.id, 'preparing')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                        order.status === 'preparing'
                          ? 'bg-amber-600 text-white'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      In Kitchen
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, 'ready')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                        order.status === 'ready'
                          ? 'bg-green-600 text-white'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Ready
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, 'delivered')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                        order.status === 'delivered'
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
