'use client';

import React from 'react';
import NextLink from 'next/link';
import { Coffee, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const Footer = () => {
  const pathname = usePathname();

  // Hide on admin portal
  if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  return (
    <footer className="bg-espresso-950 text-neutral-300 pt-16 pb-12 border-t border-espresso-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white">
                <Coffee className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Cafex<span className="text-amber-500">.</span>
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Purveyors of artisanal single-origin coffees, handcrafted pastries, and wholesome cuisine. Roasted responsibly, poured passionately.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-amber-500 hover:bg-neutral-800 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-amber-500 hover:bg-neutral-800 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-amber-500 hover:bg-neutral-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-white font-serif font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <NextLink href="/menu" className="hover:text-amber-400 transition-colors">Explore Our Menu</NextLink>
              </li>
              <li>
                <NextLink href="/reservations" className="hover:text-amber-400 transition-colors">Reserve a Table</NextLink>
              </li>
              <li>
                <NextLink href="/about" className="hover:text-amber-400 transition-colors">Our Roastery Story</NextLink>
              </li>
              <li>
                <NextLink href="/gallery" className="hover:text-amber-400 transition-colors">Ambience Gallery</NextLink>
              </li>
              <li>
                <NextLink href="/contact" className="hover:text-amber-400 transition-colors">Franchise & Partner Inquiries</NextLink>
              </li>
              <li>
                <NextLink href="/admin/login" className="hover:text-amber-400 transition-colors text-xs text-neutral-500 pt-2 block">
                  Staff / Admin Login
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Operational Hours */}
          <div>
            <h3 className="text-white font-serif font-semibold text-lg mb-4">Opening Hours</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-medium">Monday - Friday</span>
                  <span className="text-xs">06:30 AM - 09:00 PM</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-medium">Saturday & Sunday</span>
                  <span className="text-xs">07:30 AM - 10:00 PM</span>
                </div>
              </li>
              <li className="pt-2 text-xs text-amber-400/90 font-medium">
                * Kitchen closes 30 mins before closing
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h3 className="text-white font-serif font-semibold text-lg mb-4">Visit Our Roastery</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>742 Evergreen Terrace, Downtown Tech District, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+1 (555) 749-2831</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>hello@cafex.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-espresso-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Cafex Roastery & Bistro. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
            <a href="#" className="hover:text-neutral-400">Food Allergen Guide</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
