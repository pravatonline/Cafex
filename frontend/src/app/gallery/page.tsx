'use client';

import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';

export default function GalleryPage() {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<{ url: string; title: string; category: string } | null>(null);

  const galleryItems = [
    {
      id: 1,
      tag: 'craft',
      category: 'Coffee Craft',
      title: 'Precision Pour-Over Extraction',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      tag: 'bakery',
      category: 'European Bakery',
      title: 'Pain au Chocolat Fresh from Hearth Oven',
      url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      tag: 'ambiance',
      category: 'Ambiance',
      title: 'Sunlit Window Lounge at Golden Hour',
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      tag: 'craft',
      category: 'Coffee Craft',
      title: 'Single-Origin Ethiopian Microfoam Latte Art',
      url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=900&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      tag: 'ambiance',
      category: 'Ambiance',
      title: 'Downtown Tech District Roastery Patio',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      tag: 'bakery',
      category: 'European Bakery',
      title: 'Twice-Baked Almond Frangipane Croissants',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80',
    },
    {
      id: 7,
      tag: 'craft',
      category: 'Coffee Craft',
      title: 'Draft Cold Brew Cascading Nitro Pour',
      url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=900&auto=format&fit=crop&q=80',
    },
    {
      id: 8,
      tag: 'roastery',
      category: 'Roastery Lab',
      title: 'Probat Drum Roasting Master Batch',
      url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&auto=format&fit=crop&q=80',
    },
  ];

  const filtered = selectedTag === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.tag === selectedTag);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Visual Symphony
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-950 dark:text-white mt-1">
          The Cafex Moments
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          Glimpses into our micro-roasting craft, daily fresh bakery creations, and atmospheric seating areas.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {[
          { label: 'All Photos', tag: 'all' },
          { label: 'Coffee Craft', tag: 'craft' },
          { label: 'European Bakery', tag: 'bakery' },
          { label: 'Bistro Ambiance', tag: 'ambiance' },
          { label: 'Roastery Lab', tag: 'roastery' },
        ].map((t) => (
          <button
            key={t.tag}
            onClick={() => setSelectedTag(t.tag)}
            className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTag === t.tag
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-white dark:bg-[#1C1917] text-espresso-800 dark:text-neutral-300 border border-espresso-200 dark:border-neutral-800 hover:border-amber-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Masonry-style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveImage(item)}
            className="group relative aspect-square rounded-3xl overflow-hidden bg-espresso-100 dark:bg-neutral-800 cursor-pointer shadow-md"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {item.category}
              </span>
              <h4 className="font-serif font-bold text-white text-sm mt-1">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden bg-black shadow-2xl flex flex-col items-center">
            <img
              src={activeImage.url}
              alt={activeImage.title}
              className="max-h-[75vh] w-auto object-contain rounded-2xl"
            />
            <div className="p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {activeImage.category}
              </span>
              <h3 className="font-serif font-bold text-lg text-white mt-0.5">{activeImage.title}</h3>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
