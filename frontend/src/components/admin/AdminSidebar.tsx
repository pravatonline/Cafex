'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Coffee, 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Calendar, 
  Ticket, 
  Users, 
  Store, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const links = [
    { label: 'Overview & KPIs', href: '/admin', icon: LayoutDashboard },
    { label: 'Live Kitchen & Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Menu & Products', href: '/admin/menu', icon: UtensilsCrossed },
    { label: 'Table Reservations', href: '/admin/reservations', icon: Calendar },
    { label: 'Coupons & Promos', href: '/admin/coupons', icon: Ticket },
    { label: 'Customer Directory', href: '/admin/customers', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#141210] border-r border-neutral-800 text-neutral-300 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <NextLink href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Coffee className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">Cafex Admin</span>
              <span className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold">
                Management OS
              </span>
            </div>
          </NextLink>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1.5">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
            Operations & Analytics
          </span>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <NextLink
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </NextLink>
            );
          })}
        </div>
      </div>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-neutral-900/60 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
            {user ? user.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'Administrator'}</p>
            <p className="text-[10px] text-amber-500 uppercase font-medium">{user?.role || 'Super Admin'}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <NextLink
            href="/"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-medium transition-colors"
          >
            <Store className="w-3.5 h-3.5" /> Storefront
          </NextLink>
          <button
            onClick={logout}
            className="p-2 rounded-xl border border-neutral-800 hover:bg-red-950/30 text-neutral-400 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
