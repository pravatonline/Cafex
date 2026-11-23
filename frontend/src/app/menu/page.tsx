'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { mockCategories, mockProducts } from '@/lib/mockData';
import { ProductCard } from '@/components/ProductCard';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDiet, setSelectedDiet] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Filter Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category_id === selectedCategory || p.category_name?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // Filter Dietary
    if (selectedDiet !== 'all') {
      if (selectedDiet === 'vegan') result = result.filter(p => p.dietary_flags.is_vegan);
      if (selectedDiet === 'gluten_free') result = result.filter(p => p.dietary_flags.is_gluten_free);
      if (selectedDiet === 'dairy_free') result = result.filter(p => p.dietary_flags.is_dairy_free);
      if (selectedDiet === 'keto') result = result.filter(p => p.dietary_flags.is_keto);
    }

    // Filter Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.short_description && p.short_description.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.sale_price || a.base_price) - (b.sale_price || b.base_price));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (b.sale_price || b.base_price) - (a.sale_price || a.base_price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating_avg - a.rating_avg);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.rating_count - a.rating_count);
    }

    return result;
  }, [selectedCategory, selectedDiet, searchQuery, sortBy]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Our Culinary Creations
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-950 dark:text-white mt-1">
          Artisan Menu
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          Handcrafted espresso drinks, rare cold brews, ceremonial matcha, and flaky morning pastries.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white dark:bg-[#1C1917] text-espresso-800 dark:text-neutral-300 border border-espresso-200 dark:border-neutral-800 hover:border-amber-500'
          }`}
        >
          All Items ({mockProducts.length})
        </button>
        {mockCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-white dark:bg-[#1C1917] text-espresso-800 dark:text-neutral-300 border border-espresso-200 dark:border-neutral-800 hover:border-amber-500'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filters & Search Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search coffee, pastry, matcha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Diet:
          </span>
          {[
            { label: 'All', value: 'all' },
            { label: 'Vegan', value: 'vegan' },
            { label: 'Gluten-Free', value: 'gluten_free' },
            { label: 'Dairy-Free', value: 'dairy_free' },
            { label: 'Keto', value: 'keto' },
          ].map((d) => (
            <button
              key={d.value}
              onClick={() => setSelectedDiet(d.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedDiet === d.value
                  ? 'bg-espresso-900 text-white dark:bg-white dark:text-black font-semibold'
                  : 'bg-espresso-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-espresso-900 dark:hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="w-full md:w-auto flex items-center justify-end gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
          >
            <option value="featured">Featured Picks</option>
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#161412] rounded-3xl border border-dashed border-espresso-200 dark:border-neutral-800">
          <Sparkles className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-xl text-espresso-950 dark:text-white">
            No culinary items found
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Try adjusting your search keywords or clearing your dietary filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDiet('all');
              setSearchQuery('');
            }}
            className="mt-4 px-5 py-2 rounded-full bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
