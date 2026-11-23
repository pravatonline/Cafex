'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Product, SelectedAddon } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface CustomizationModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  // Default option selections
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

  const [extraShot, setExtraShot] = useState<boolean>(false);
  const [selectedSyrup, setSelectedSyrup] = useState<SelectedAddon | null>(null);

  if (!isOpen) return null;

  const milkOptions: SelectedAddon[] = [
    { group: 'Milk Option', name: 'Whole Dairy Milk', price: 0.00 },
    { group: 'Milk Option', name: 'Organic Oat Milk', price: 0.85 },
    { group: 'Milk Option', name: 'Almond Milk', price: 0.85 },
    { group: 'Milk Option', name: 'Coconut Milk', price: 0.85 },
  ];

  const sizeOptions: SelectedAddon[] = [
    { group: 'Size Selection', name: 'Regular (12 oz)', price: 0.00 },
    { group: 'Size Selection', name: 'Large (16 oz)', price: 0.85 },
  ];

  const syrupOptions: SelectedAddon[] = [
    { group: 'Syrups & Flavors', name: 'Madagascar Vanilla (+1 pump)', price: 0.75 },
    { group: 'Syrups & Flavors', name: 'Smoked Caramel (+1 pump)', price: 0.75 },
  ];

  // Calculate live price
  const basePrice = product.sale_price || product.base_price;
  let addonsSum = selectedMilk.price + selectedSize.price;
  if (extraShot) addonsSum += 1.25;
  if (selectedSyrup) addonsSum += selectedSyrup.price;

  const singleUnitPrice = basePrice + addonsSum;
  const totalPrice = singleUnitPrice * quantity;

  const handleAddToCart = () => {
    const activeAddons: SelectedAddon[] = [selectedMilk, selectedSize];
    if (extraShot) {
      activeAddons.push({ group: 'Espresso Boost', name: 'Extra Ristretto Shot', price: 1.25 });
    }
    if (selectedSyrup) {
      activeAddons.push(selectedSyrup);
    }

    addItem(product, quantity, activeAddons, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#161412] shadow-2xl border border-espresso-100 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative h-44 w-full bg-espresso-950 overflow-hidden shrink-0">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <h3 className="font-serif text-xl font-bold text-white drop-shadow-sm">{product.name}</h3>
            <p className="text-xs text-neutral-300 line-clamp-1">{product.short_description || product.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. Size Selection */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              1. Choose Size
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {sizeOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setSelectedSize(opt)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedSize.name === opt.name
                      ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                      : 'border-espresso-200 dark:border-neutral-800 text-espresso-900 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  <span className="text-xs">{opt.name}</span>
                  <span className="text-xs font-bold">{opt.price > 0 ? `+${formatCurrency(opt.price)}` : 'Included'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Milk Options */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              2. Milk Choice
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {milkOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setSelectedMilk(opt)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedMilk.name === opt.name
                      ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                      : 'border-espresso-200 dark:border-neutral-800 text-espresso-900 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  <span className="text-xs">{opt.name}</span>
                  <span className="text-xs font-bold">{opt.price > 0 ? `+${formatCurrency(opt.price)}` : 'Free'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Extra Espresso Shot */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              3. Espresso Boost
            </h4>
            <button
              type="button"
              onClick={() => setExtraShot(!extraShot)}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                extraShot
                  ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                  : 'border-espresso-200 dark:border-neutral-800 text-espresso-900 dark:text-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${extraShot ? 'bg-amber-600 border-amber-600 text-white' : 'border-neutral-400'}`}>
                  {extraShot && <Check className="w-3 h-3" />}
                </div>
                <span className="text-xs">Add Extra Ristretto Espresso Shot</span>
              </div>
              <span className="text-xs font-bold">+$1.25</span>
            </button>
          </div>

          {/* 4. Syrups */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              4. Artisanal Flavor Pumps (Optional)
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {syrupOptions.map((opt) => {
                const isSelected = selectedSyrup?.name === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setSelectedSyrup(isSelected ? null : opt)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                        : 'border-espresso-200 dark:border-neutral-800 text-espresso-900 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <span className="text-xs">{opt.name}</span>
                    <span className="text-xs font-bold">+{formatCurrency(opt.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Special Notes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              Barista Instructions
            </h4>
            <input
              type="text"
              placeholder="e.g. Extra hot, light ice, oat milk foam"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-800 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

        </div>

        {/* Modal Footer (Quantity Stepper & Add Button) */}
        <div className="p-6 border-t border-espresso-100 dark:border-neutral-800 bg-espresso-50/50 dark:bg-[#12100E] flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-xl p-1.5 border border-espresso-200 dark:border-neutral-700">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-espresso-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold w-6 text-center text-espresso-950 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-espresso-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-all shadow-md shadow-amber-600/20 flex items-center justify-between"
          >
            <span>Add to Cart</span>
            <span>{formatCurrency(totalPrice)}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
