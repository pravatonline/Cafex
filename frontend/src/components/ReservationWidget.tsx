'use client';

import React, { useState } from 'react';
import { Calendar, Users, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { api } from '@/lib/api';

export const ReservationWidget = () => {
  const [partySize, setPartySize] = useState(2);
  const [seatingPreference, setSeatingPreference] = useState<'Indoor' | 'Window' | 'Patio' | 'Rooftop' | 'Private Lounge'>('Indoor');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('18:00');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<any | null>(null);

  const timeSlots = [
    '08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '18:30', '19:30', '20:30'
  ];

  const handleBookTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setLoading(true);
    const res = await api.bookReservation({
      customerName,
      customerEmail: customerEmail || 'guest@example.com',
      customerPhone,
      partySize,
      seatingPreference,
      reservationDate: date,
      reservationTime: time,
      specialRequests
    });
    setLoading(false);

    if (res.success) {
      setBookingResult(res.reservation);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white dark:bg-[#181614] border border-espresso-100 dark:border-neutral-800 p-6 md:p-8 shadow-xl">
      {bookingResult ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-espresso-950 dark:text-white">
            Table Reserved Successfully!
          </h3>
          <p className="text-sm text-neutral-500 max-w-md mx-auto">
            We have confirmed your table for <span className="font-semibold text-espresso-950 dark:text-white">{bookingResult.party_size} guests</span> on{' '}
            <span className="font-semibold text-espresso-950 dark:text-white">{bookingResult.reservation_date}</span> at{' '}
            <span className="font-semibold text-espresso-950 dark:text-white">{bookingResult.reservation_time}</span>.
          </p>

          <div className="p-4 rounded-2xl bg-espresso-50 dark:bg-neutral-900 border border-espresso-200 dark:border-neutral-800 inline-block text-left text-xs space-y-1">
            <p><span className="text-neutral-500">Booking Code:</span> <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{bookingResult.booking_code}</span></p>
            <p><span className="text-neutral-500">Section:</span> <span className="font-semibold text-espresso-950 dark:text-white">{bookingResult.seating_preference}</span></p>
            <p><span className="text-neutral-500">Assigned Table:</span> <span className="font-semibold text-espresso-950 dark:text-white">{bookingResult.table_number || 'Host will escort upon arrival'}</span></p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setBookingResult(null)}
              className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Book Another Table
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBookTable} className="space-y-6">
          <div className="border-b border-espresso-100 dark:border-neutral-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Instant Confirmation
            </span>
            <h3 className="font-serif text-2xl font-bold text-espresso-950 dark:text-white mt-1">
              Reserve Your Experience
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Select your party size, date, preferred ambience, and enjoy priority artisan service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Party Size */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                <Users className="w-3.5 h-3.5 inline mr-1 text-amber-500" /> Party Size
              </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white font-medium focus:outline-none focus:border-amber-500"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-amber-500" /> Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-amber-500" /> Preferred Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white font-medium focus:outline-none focus:border-amber-500"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Seating Preference */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-amber-500" /> Seating Area
              </label>
              <select
                value={seatingPreference}
                onChange={(e) => setSeatingPreference(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white font-medium focus:outline-none focus:border-amber-500"
              >
                <option value="Indoor">Indoor Cozy Lounge</option>
                <option value="Window">Window View</option>
                <option value="Patio">Sunlit Garden Patio</option>
                <option value="Rooftop">Bistro Rooftop</option>
                <option value="Private Lounge">Private Room</option>
              </select>
            </div>

          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <input
              type="text"
              placeholder="Your Full Name *"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-neutral-400">
              * Tables held for up to 15 minutes past reserved time. No deposit required.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-600/20 disabled:opacity-50"
            >
              {loading ? 'Confirming...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
