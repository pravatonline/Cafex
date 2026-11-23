'use client';

import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-neutral-800 bg-[#161412] px-8 flex items-center justify-between shrink-0">
      <div>
        <h1 className="font-serif text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          POS Kitchen Engine Live
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          2FA Protected
        </div>

        <button
          aria-label="Notifications"
          className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
      </div>
    </header>
  );
};
