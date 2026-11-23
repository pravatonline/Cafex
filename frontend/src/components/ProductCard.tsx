'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { Star, Plus, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { CustomizationModal } from './CustomizationModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  const hasDiscount = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.base_price;
  const currentPrice = product.sale_price || product.base_price;

  return (
    <>
      <div className="group relative rounded-3xl bg-white dark:bg-[#1A1715] border border-espresso-100 dark:border-neutral-800/80 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/10 dark:hover:shadow-black/40 flex flex-col justify-between">
        
        <div>
          {/* Product Image & Badges */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-espresso-100 dark:bg-neutral-800 mb-4">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Chef's Special / Featured Badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
              {product.is_chef_special && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white shadow-md">
                  <Sparkles className="w-3 h-3" /> Chef&apos;s Pick
                </span>
              )}
              {hasDiscount && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-md">
                  Sale
                </span>
              )}
            </div>

            {/* Dietary Tags (Vegan, Gluten-Free) */}
            <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
              {product.dietary_flags.is_vegan && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-950/80 backdrop-blur-md text-green-300 border border-green-700/40">
                  Vegan
                </span>
              )}
              {product.dietary_flags.is_gluten_free && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/80 backdrop-blur-md text-amber-300 border border-amber-700/40">
                  GF
                </span>
              )}
            </div>

            {/* Rating pill */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating_avg.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Meta Info */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {product.category_name || 'Artisan Special'}
            </span>
            <NextLink href={`/product/${product.slug}`} className="block mt-1">
              <h3 className="font-serif font-bold text-base text-espresso-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </NextLink>
            <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {product.short_description || product.description}
            </p>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-espresso-100 dark:border-neutral-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-espresso-950 dark:text-white">
                {formatCurrency(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatCurrency(product.base_price)}
                </span>
              )}
            </div>
            {product.calories && (
              <span className="text-[10px] text-neutral-400 block">{product.calories} kcal</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Customize Trigger */}
            <button
              onClick={() => setModalOpen(true)}
              aria-label="Customize item"
              className="p-2 rounded-xl border border-espresso-200 dark:border-neutral-700 hover:border-amber-500 text-neutral-600 dark:text-neutral-300 hover:text-amber-600 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Quick Add */}
            <button
              onClick={() => addItem(product, 1)}
              aria-label="Add to cart"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Item Customizer Modal */}
      {modalOpen && (
        <CustomizationModal
          product={product}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};
