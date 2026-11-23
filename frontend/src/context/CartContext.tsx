'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, SelectedAddon, OrderType } from '@/types';
import { api } from '@/lib/api';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  orderType: OrderType;
  appliedCoupon: string | null;
  couponDiscount: number;
  tipAmount: number;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setOrderType: (type: OrderType) => void;
  setTipAmount: (amount: number) => void;
  addItem: (product: Product, quantity?: number, selectedAddons?: SelectedAddon[], instructions?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  isOpen: false,
  orderType: 'delivery',
  appliedCoupon: null,
  couponDiscount: 0,
  tipAmount: 0,
  subtotal: 0,
  taxAmount: 0,
  deliveryFee: 0,
  totalAmount: 0,
  itemCount: 0,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  setOrderType: () => {},
  setTipAmount: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  applyCoupon: async () => ({ success: false, message: '' }),
  removeCoupon: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [tipAmount, setTipAmount] = useState<number>(2.00);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cafex_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        localStorage.removeItem('cafex_cart');
      }
    }
  }, []);

  // Save cart changes to localStorage
  useEffect(() => {
    localStorage.setItem('cafex_cart', JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  const addItem = (
    product: Product,
    quantity = 1,
    selectedAddons: SelectedAddon[] = [],
    instructions = ''
  ) => {
    const addonsCost = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = (product.sale_price || product.base_price) + addonsCost;

    // Generate unique key based on product ID and selected add-ons
    const addonsHash = selectedAddons
      .map(a => `${a.group}:${a.name}`)
      .sort()
      .join('|');
    const cartItemId = `${product.id}_${addonsHash}`;

    setItems(prevItems => {
      const existing = prevItems.find(i => i.cartItemId === cartItemId);
      if (existing) {
        return prevItems.map(i =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prevItems,
        {
          cartItemId,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          basePrice: product.sale_price || product.base_price,
          unitPrice,
          quantity,
          imageUrl: product.image_url,
          selectedAddons,
          specialInstructions: instructions,
        },
      ];
    });

    setIsOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => {
          if (i.cartItemId === cartItemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const applyCoupon = async (code: string) => {
    const currentSubtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const res = await api.validateCoupon(code, currentSubtotal);
    if (res.success && res.coupon) {
      setAppliedCoupon(res.coupon.code);
      setCouponDiscount(res.coupon.calculatedDiscount);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Invalid coupon' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // Financial calculations
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const deliveryFee = orderType === 'delivery' && items.length > 0 ? (subtotal >= 35 ? 0 : 3.99) : 0;
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const taxAmount = items.length > 0 ? Number((taxableAmount * 0.085).toFixed(2)) : 0;
  const totalAmount = items.length > 0 ? Number((taxableAmount + taxAmount + deliveryFee + (orderType === 'delivery' ? tipAmount : 0)).toFixed(2)) : 0;
  const itemCount = items.reduce((count, i) => count + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        orderType,
        appliedCoupon,
        couponDiscount,
        tipAmount,
        subtotal,
        taxAmount,
        deliveryFee,
        totalAmount,
        itemCount,
        openCart,
        closeCart,
        toggleCart,
        setOrderType,
        setTipAmount,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
