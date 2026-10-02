'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Coffee } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    tax,
    tip,
    discount,
    promoCode,
    applyPromoCode,
    total,
    setIsCheckoutOpen,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage({ text: res.message, error: !res.success });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#fbf7ee] shadow-2xl border-l border-[#ecdcc9] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#ebdcc9] flex items-center justify-between bg-white/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#f3ebd9] flex items-center justify-center text-[#c97a3e]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-editorial text-xl font-bold text-[#2c1810]">
                      Your Coffee Bag
                    </h2>
                    <span className="text-[11px] text-[#8c6e58]">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full hover:bg-[#f3ebd9] text-[#2c1810] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-[#f3ebd9] text-[#8c6e58] flex items-center justify-center mb-4">
                      <Coffee className="w-8 h-8" />
                    </div>
                    <h3 className="font-editorial text-xl font-bold text-[#2c1810] mb-2">
                      Your bag is empty
                    </h3>
                    <p className="text-xs text-[#7a5840] max-w-xs mb-6">
                      Explore our hand-roasted espresso, pour overs, or fresh butter pastries.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="py-2.5 px-6 rounded-full bg-[#3e2213] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#27150a] transition-colors"
                    >
                      Browse Offerings
                    </button>
                  </div>
                ) : (
                  items.map((cartItem) => (
                    <div
                      key={cartItem.cartId}
                      className="p-4 rounded-2xl bg-white border border-[#ebdcc9] shadow-xs flex gap-3.5"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#e5d4be] shrink-0 border border-[#ebdcc9]">
                        <Image
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          fill
                          referrerPolicy="no-referrer"
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <h4 className="font-editorial text-sm font-bold text-[#2c1810] truncate">
                            {cartItem.item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(cartItem.cartId)}
                            className="text-[#a38771] hover:text-red-600 transition-colors p-0.5"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Modifiers */}
                        <div className="text-[11px] text-[#8c6e58] space-y-0.5 mb-2 leading-tight">
                          {cartItem.size && <div>Size: {cartItem.size}</div>}
                          {cartItem.milk && cartItem.milk !== 'None' && <div>Milk: {cartItem.milk}</div>}
                          {cartItem.extraShot && <div className="text-[#b45309] font-medium">+ Extra Shot</div>}
                          {cartItem.notes && <div className="italic text-[#966b4d]">&ldquo;{cartItem.notes}&rdquo;</div>}
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-[#faf5ed] rounded-lg border border-[#ebdcc9] p-0.5">
                            <button
                              onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity - 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-[#785133] hover:bg-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-[#2c1810]">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity + 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-[#785133] hover:bg-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-editorial text-sm font-bold text-[#b45309]">
                            ${(cartItem.calculatedPrice * cartItem.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary (if items exist) */}
              {items.length > 0 && (
                <div className="p-6 border-t border-[#ebdcc9] bg-white/80 space-y-4">
                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c6e58]" />
                      <input
                        type="text"
                        placeholder="Promo code (ROASTERY10)"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#d8c4ad] bg-[#faf5eb] text-xs uppercase placeholder:normal-case text-[#2c1810] focus:outline-none focus:ring-1 focus:ring-[#c97a3e]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#f3ebd9] hover:bg-[#ebdcc9] text-xs font-bold text-[#3e2213] border border-[#d8c4ad] transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {promoMessage && (
                    <p className={`text-[11px] ${promoMessage.error ? 'text-red-600' : 'text-emerald-700 font-semibold'}`}>
                      {promoMessage.text}
                    </p>
                  )}

                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-[#6a4c37]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#2c1810]">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Discount ({promoCode})</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Estimated Tax (8.25%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Barista Tip</span>
                      <span>${tip.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-[#ebdcc9] flex justify-between text-base font-bold text-[#2c1810]">
                      <span className="font-editorial">Total Amount</span>
                      <span className="font-editorial text-lg text-[#b45309]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#d38243] hover:bg-[#bd6f32] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d38243]/25 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
