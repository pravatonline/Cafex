'use client';

import React, { useState } from 'react';
import { Calendar, Users, Clock, Check, X, Search, Filter } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Reservation } from '@/types';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'res-101',
      booking_code: 'RES-2026-9481',
      customer_name: 'Sarah Jenkins',
      customer_email: 'sarah@example.com',
      customer_phone: '+1 555-019-8822',
      party_size: 2,
      seating_preference: 'Window',
      table_number: 'T-01',
      reservation_date: '2026-11-25',
      reservation_time: '18:30',
      special_requests: 'Quiet window seat for anniversary dinner',
      status: 'confirmed',
      created_at: new Date().toISOString()
    },
    {
      id: 'res-102',
      booking_code: 'RES-2026-8812',
      customer_name: 'Marcus Vance',
      customer_email: 'marcus@example.com',
      customer_phone: '+1 555-392-1982',
      party_size: 4,
      seating_preference: 'Patio',
      table_number: 'T-06',
      reservation_date: '2026-11-25',
      reservation_time: '19:00',
      status: 'confirmed',
      created_at: new Date().toISOString()
    },
    {
      id: 'res-103',
      booking_code: 'RES-2026-7241',
      customer_name: 'David Chen',
      customer_email: 'david@example.com',
      customer_phone: '+1 555-492-3311',
      party_size: 8,
      seating_preference: 'Private Lounge',
      table_number: 'T-09',
      reservation_date: '2026-11-26',
      reservation_time: '13:00',
      special_requests: 'Company team lunch with pour-over flight tasting',
      status: 'confirmed',
      created_at: new Date().toISOString()
    }
  ]);

  const [filter, setFilter] = useState('all');

  const updateStatus = (id: string, status: any) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  const filtered = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Table Reservations & Floor Planning"
        subtitle="Review table requests, manage floor occupancy, and assign table hosts."
      />

      <div className="p-8 space-y-6 max-w-7xl">
        
        {/* Controls */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#161412] border border-neutral-800">
          <span className="text-xs font-bold uppercase text-neutral-400">Filter By Status:</span>
          {['all', 'confirmed', 'seated', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filter === st
                  ? 'bg-amber-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Reservations Table */}
        <div className="rounded-3xl bg-[#161412] border border-neutral-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-900/80 border-b border-neutral-800">
                <tr>
                  <th className="py-4 px-6">Booking Code</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Party Size</th>
                  <th className="py-4 px-4">Date & Time</th>
                  <th className="py-4 px-4">Area & Table</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Floor Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-amber-500">
                      {res.booking_code}
                    </td>
                    <td className="py-4 px-4">
                      <span className="block font-semibold text-white">{res.customer_name}</span>
                      <span className="text-[10px] text-neutral-400">{res.customer_phone}</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {res.party_size} {res.party_size === 1 ? 'Guest' : 'Guests'}
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      <span className="block font-medium">{res.reservation_date}</span>
                      <span className="text-[10px] text-amber-400">{res.reservation_time}</span>
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      <span className="block font-semibold text-white">{res.seating_preference}</span>
                      <span className="text-[10px] text-neutral-400">{res.table_number || 'Unassigned'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-500/10 text-green-400">
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => updateStatus(res.id, 'seated')}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-[10px] font-bold uppercase transition-colors"
                      >
                        Seat Diners
                      </button>
                      <button
                        onClick={() => updateStatus(res.id, 'completed')}
                        className="px-2.5 py-1 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 text-[10px] font-bold uppercase transition-colors"
                      >
                        Finish
                      </button>
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
