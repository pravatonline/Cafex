'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import NextLink from 'next/link';
import { 
  Star, 
  Clock, 
  Flame, 
  ShieldAlert, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Check, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { SelectedAddon } from '@/types';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addItem } = useCart();

  const product = mockProducts.find(p => p.slug === slug || p.id === slug) || mockProducts[0];

  // Customization state
  const [quantity, setQuantity] = useState(1);
  const [selectedMilk, setSelectedMilk] = useState<SelectedAddon>({
    group: 'Milk Option',
    name: 'Whole Dairy Milk',
    price: 0.00,
  });
  const [selectedSize, setSelectedSize] = useState<SelectedAddon>({
    group: 'Size Selection',
    name: 'Regular (12 oz)',
    price: 0.00,
  });
  const [extraShot, setExtraShot] = useState(false);
  const [selectedSyrup, setSelectedSyrup] = useState<SelectedAddon | null>(null);

  // Recommendations
  const smartPairings = mockProducts.filter(p => p.id !== product.id).slice(0, 3);

  // Live price calculation
  const basePrice = product.sale_price || product.base_price;
  let addonsSum = selectedMilk.price + selectedSize.price;
  if (extraShot) addonsSum += 1.25;
  if (selectedSyrup) addonsSum += selectedSyrup.price;

  const unitPrice = basePrice + addonsSum;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const activeAddons: SelectedAddon[] = [selectedMilk, selectedSize];
    if (extraShot) activeAddons.push({ group: 'Espresso Boost', name: 'Extra Ristretto Shot', price: 1.25 });
    if (selectedSyrup) activeAddons.push(selectedSyrup);

    addItem(product, quantity, activeAddons);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Breadcrumb */}
      <div className="mb-6">
        <NextLink
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-amber-600 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
        </NextLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Product Visual Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-espresso-100 dark:bg-neutral-800 border border-espresso-100 dark:border-neutral-800 shadow-xl">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.is_chef_special && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-600 text-white shadow-lg">
                <Sparkles className="w-3.5 h-3.5" /> Chef&apos;s Signature
              </div>
            )}
          </div>

          {/* Nutrition Breakdown Grid */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 space-y-4">
            <h3 className="font-serif font-bold text-base text-espresso-950 dark:text-white">
              Nutritional Profile & Macro Facts
            </h3>
            <div className="grid grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-espresso-50 dark:bg-neutral-900 border border-espresso-100 dark:border-neutral-800">
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Calories</span>
                <span className="text-sm font-bold text-espresso-950 dark:text-white">{product.calories} kcal</span>
              </div>
              <div className="p-3 rounded-2xl bg-espresso-50 dark:bg-neutral-900 border border-espresso-100 dark:border-neutral-800">
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Total Fat</span>
                <span className="text-sm font-bold text-espresso-950 dark:text-white">{product.nutrition_facts.fat}</span>
              </div>
              <div className="p-3 rounded-2xl bg-espresso-50 dark:bg-neutral-900 border border-espresso-100 dark:border-neutral-800">
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Carbs</span>
                <span className="text-sm font-bold text-espresso-950 dark:text-white">{product.nutrition_facts.carbs}</span>
              </div>
              <div className="p-3 rounded-2xl bg-espresso-50 dark:bg-neutral-900 border border-espresso-100 dark:border-neutral-800">
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Protein</span>
                <span className="text-sm font-bold text-espresso-950 dark:text-white">{product.nutrition_facts.protein}</span>
              </div>
              <div className="p-3 rounded-2xl bg-espresso-50 dark:bg-neutral-900 border border-espresso-100 dark:border-neutral-800">
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Sugar</span>
                <span className="text-sm font-bold text-espresso-950 dark:text-white">{product.nutrition_facts.sugar}</span>
              </div>
            </div>

            {/* Allergen Notice */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Contains Allergens: {product.allergens.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Title, Description, Customization & Ordering */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {product.category_name}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 dark:text-white mt-1">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm font-semibold text-espresso-950 dark:text-white">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating_avg.toFixed(2)}</span>
                <span className="text-xs text-neutral-400">({product.rating_count} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{product.preparation_time_minutes} mins prep</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Customizer Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 space-y-5">
            <h3 className="font-serif font-bold text-base text-espresso-950 dark:text-white border-b border-espresso-100 dark:border-neutral-800 pb-3">
              Customize Your Order
            </h3>

            {/* Size Options */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Size Selection
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { group: 'Size Selection', name: 'Regular (12 oz)', price: 0.00 },
                  { group: 'Size Selection', name: 'Large (16 oz)', price: 0.85 },
                ].map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                      selectedSize.name === s.name
                        ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                        : 'border-espresso-200 dark:border-neutral-800 text-espresso-950 dark:text-neutral-300'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="font-bold">{s.price > 0 ? `+${formatCurrency(s.price)}` : 'Included'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Milk Options */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Milk Choice
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { group: 'Milk Option', name: 'Whole Dairy Milk', price: 0.00 },
                  { group: 'Milk Option', name: 'Organic Oat Milk', price: 0.85 },
                  { group: 'Milk Option', name: 'Almond Milk', price: 0.85 },
                  { group: 'Milk Option', name: 'Coconut Milk', price: 0.85 },
                ].map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setSelectedMilk(m)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                      selectedMilk.name === m.name
                        ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                        : 'border-espresso-200 dark:border-neutral-800 text-espresso-950 dark:text-neutral-300'
                    }`}
                  >
                    <span>{m.name}</span>
                    <span className="font-bold">{m.price > 0 ? `+${formatCurrency(m.price)}` : 'Free'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Shot */}
            <div>
              <button
                type="button"
                onClick={() => setExtraShot(!extraShot)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                  extraShot
                    ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'border-espresso-200 dark:border-neutral-800 text-espresso-950 dark:text-neutral-300'
                }`}
              >
                <span>Add Extra Ristretto Espresso Shot</span>
                <span className="font-bold">+$1.25</span>
              </button>
            </div>

            {/* Add to Cart Actions */}
            <div className="pt-4 border-t border-espresso-100 dark:border-neutral-800 flex items-center gap-4">
              <div className="flex items-center gap-2 bg-espresso-50 dark:bg-neutral-800 rounded-xl p-1.5 border border-espresso-200 dark:border-neutral-700">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-espresso-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold w-6 text-center text-espresso-950 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-espresso-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-600/20 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" /> Add to Order
                </span>
                <span className="text-sm font-bold">{formatCurrency(totalPrice)}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 2. "PAIRS PERFECTLY WITH..." AI RECOMMENDATIONS */}
      <section className="mt-20 pt-12 border-t border-espresso-100 dark:border-neutral-800">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Flavor Synergy
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950 dark:text-white mt-1">
            Pairs Perfectly With...
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {smartPairings.map((pairing) => (
            <ProductCard key={pairing.id} product={pairing} />
          ))}
        </div>
      </section>

    </div>
  );
}
