'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem } from './coffee-data';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, options?: Partial<CartItem>) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  tip: number;
  setTip: (tip: number) => void;
  discount: number;
  promoCode: string;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeOrderReceipt: any | null;
  setActiveOrderReceipt: (receipt: any | null) => void;
  mailgunPreview: { open: boolean; data: any | null };
  setMailgunPreview: (prev: { open: boolean; data: any | null }) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [tip, setTip] = useState(1.50);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [activeOrderReceipt, setActiveOrderReceipt] = useState<any | null>(null);
  const [mailgunPreview, setMailgunPreview] = useState<{ open: boolean; data: any | null }>({
    open: false,
    data: null,
  });

  // Calculate pricing
  const subtotal = items.reduce((sum, item) => sum + item.calculatedPrice * item.quantity, 0);
  const tax = Number((subtotal * 0.0825).toFixed(2));
  const total = Math.max(0, Number((subtotal - discount + tax + tip).toFixed(2)));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (item: MenuItem, options: Partial<CartItem> = {}) => {
    let price = item.price;
    if (options.size === 'Large (16oz)') price += 0.85;
    if (options.size === '250g Bag') price = item.price;
    if (options.milk && options.milk.includes('+0.75')) price += 0.75;
    if (options.sweetness && options.sweetness.includes('+0.60')) price += 0.60;
    if (options.extraShot) price += 1.00;

    const cartId = `${item.id}-${options.size || 'default'}-${options.milk || 'default'}-${options.roast || 'default'}-${Date.now()}`;
    const newItem: CartItem = {
      cartId,
      item,
      quantity: 1,
      size: options.size || (item.category === 'beans' ? '250g Bag' : 'Regular (12oz)'),
      milk: options.milk || (item.category === 'classics' ? 'Whole Milk' : 'None'),
      roast: options.roast || (item.roastLevel ? `${item.roastLevel} Balanced` as any : 'Medium Balanced'),
      sweetness: options.sweetness || '100% Standard',
      extraShot: options.extraShot || false,
      notes: options.notes || '',
      calculatedPrice: Number(price.toFixed(2)),
    };

    setItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeItem = (cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(0);
    setPromoCode('');
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ROASTERY10') {
      const disc = Number((subtotal * 0.1).toFixed(2));
      setDiscount(disc);
      setPromoCode(clean);
      return { success: true, message: 'Promo code applied! 10% discount on order.' };
    }
    if (clean === 'BARISTA') {
      setDiscount(5.00);
      setPromoCode(clean);
      return { success: true, message: '$5 Barista Welcome perk applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try "ROASTERY10" or "BARISTA"' };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        tip,
        setTip,
        discount,
        promoCode,
        applyPromoCode,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeOrderReceipt,
        setActiveOrderReceipt,
        mailgunPreview,
        setMailgunPreview,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
