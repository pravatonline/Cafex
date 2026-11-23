'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { 
  Coffee, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Menu as MenuIcon, 
  X, 
  User as UserIcon, 
  Calendar,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export const Navbar = () => {
  const pathname = usePathname();
  const { toggleCart, itemCount } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Hide standard customer navbar inside admin dashboard
  if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'Reservations', href: '/reservations' },
    { label: 'About Us', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#12100E]/90 border-b border-espresso-100 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <NextLink href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
            <Coffee className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-espresso-950 dark:text-white">
              Cafex<span className="text-amber-500">.</span>
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-espresso-500 dark:text-neutral-400 font-medium">
              Roastery & Bistro
            </span>
          </div>
        </NextLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <NextLink
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 font-semibold'
                    : 'text-espresso-800 dark:text-neutral-300'
                }`}
              >
                {link.label}
              </NextLink>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Color Theme"
            className="p-2.5 rounded-full text-espresso-700 dark:text-neutral-300 hover:bg-espresso-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Table Reservation Button (Desktop) */}
          <NextLink
            href="/reservations"
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Table
          </NextLink>

          {/* Cart Drawer Trigger */}
          <button
            onClick={toggleCart}
            aria-label="Shopping Cart"
            className="relative p-2.5 rounded-full bg-espresso-100 dark:bg-neutral-800 text-espresso-900 dark:text-white hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {itemCount}
              </span>
            )}
          </button>

          {/* Customer / Admin Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full border border-espresso-200 dark:border-neutral-700 hover:border-amber-500 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-[#1C1917] shadow-xl border border-espresso-100 dark:border-neutral-800 py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-espresso-100 dark:border-neutral-800">
                    <p className="font-semibold text-espresso-950 dark:text-white truncate">{user.fullName}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    {user.loyalty && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {user.loyalty.tier} Member ({user.loyalty.points_balance} pts)
                      </span>
                    )}
                  </div>

                  <NextLink
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-espresso-800 dark:text-neutral-300 hover:bg-espresso-50 dark:hover:bg-neutral-800"
                  >
                    <UserIcon className="w-4 h-4" /> My Profile & Orders
                  </NextLink>

                  {['admin', 'super_admin', 'manager', 'staff'].includes(user.role) && (
                    <NextLink
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin Portal
                    </NextLink>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NextLink
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <UserIcon className="w-3.5 h-3.5" />
              Sign In
            </NextLink>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-espresso-800 dark:text-neutral-300 hover:bg-espresso-100 dark:hover:bg-neutral-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-white dark:bg-[#12100E] border-b border-espresso-100 dark:border-neutral-800 space-y-3">
          {navLinks.map((link) => (
            <NextLink
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-espresso-800 dark:text-neutral-200 hover:bg-amber-50 dark:hover:bg-neutral-800"
            >
              {link.label}
            </NextLink>
          ))}
          <div className="pt-2 border-t border-espresso-100 dark:border-neutral-800">
            <NextLink
              href="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-600 text-white font-medium text-sm"
            >
              <Calendar className="w-4 h-4" /> Book a Table
            </NextLink>
          </div>
        </div>
      )}
    </header>
  );
};
