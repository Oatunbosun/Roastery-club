'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Coffee, Sparkles, Check } from 'lucide-react';
import { MenuItem, CartItem } from '@/lib/coffee-data';
import { useCart } from '@/lib/cart-context';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function ItemModal({ item, onClose }: ItemModalProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState<'Regular (12oz)' | 'Large (16oz)' | '250g Bag'>('Regular (12oz)');
  const [milk, setMilk] = useState<'Whole Milk' | 'Oat Milk (+0.75)' | 'Almond Milk (+0.75)' | 'Coconut Milk (+0.75)' | 'None'>('Oat Milk (+0.75)');
  const [roast, setRoast] = useState<'Light Floral' | 'Medium Balanced' | 'Dark French'>('Medium Balanced');
  const [sweetness, setSweetness] = useState<'No Sugar' | '50% Sweet' | '100% Standard' | 'Vanilla Syrup (+0.60)'>('100% Standard');
  const [extraShot, setExtraShot] = useState(false);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const isCoffee = item.category === 'classics' || item.category === 'pourover' || item.category === 'coldbrew';
  const isBeans = item.category === 'beans';

  let currentPrice = item.price;
  if (size === 'Large (16oz)') currentPrice += 0.85;
  if (milk.includes('+0.75')) currentPrice += 0.75;
  if (sweetness.includes('+0.60')) currentPrice += 0.60;
  if (extraShot) currentPrice += 1.00;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(item, {
        size: isBeans ? '250g Bag' : size,
        milk: isCoffee ? milk : 'None',
        roast: isCoffee || isBeans ? roast : undefined,
        sweetness: isCoffee ? sweetness : undefined,
        extraShot: isCoffee ? extraShot : false,
        notes,
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#fbf7ee] rounded-3xl shadow-2xl border border-[#ebdcc9] p-6 text-[#2c1810]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white text-[#2c1810] shadow-md z-10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Image */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-5 border border-[#ebdcc9] bg-[#ebdcc9]">
            <Image
              src={item.image}
              alt={item.name}
              fill
              referrerPolicy="no-referrer"
              className="object-cover"
            />
            {item.badge && (
              <span className="absolute top-3 left-3 bg-[#c97a3e] text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                {item.badge}
              </span>
            )}
          </div>

          {/* Title & Info */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2c1810]">
                  {item.name}
                </h2>
                <p className="text-xs text-[#8c6e58] font-medium mt-1">
                  Est. Preparation: {item.prepTime} {item.origin ? `• Origin: ${item.origin}` : ''}
                </p>
              </div>
              <div className="text-right">
                <span className="font-editorial text-2xl font-bold text-[#b45309]">
                  ${currentPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-sm text-[#5d412e] mt-2 leading-relaxed">
              {item.description}
            </p>

            {item.tastingNotes && item.tastingNotes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2.5 py-0.5 rounded-full bg-[#f1e5d4] text-[11px] font-semibold text-[#785133]"
                  >
                    ✦ {note}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Customization Options */}
          <div className="space-y-5 border-t border-[#ebdcc9] pt-5">
            {/* Size selection */}
            {!isBeans && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-2">
                  Cup Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Regular (12oz)', price: '+0.00' },
                    { label: 'Large (16oz)', price: '+$0.85' },
                  ].map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSize(s.label as any)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        size === s.label
                          ? 'border-[#c97a3e] bg-[#f4ebdc] shadow-sm font-bold text-[#2c1810]'
                          : 'border-[#ecdcc9] bg-white/70 text-[#6a4c37] hover:border-[#d9c5b0]'
                      }`}
                    >
                      <span className="text-xs">{s.label}</span>
                      <span className="text-[11px] text-[#8c6e58]">{s.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Milk choice */}
            {isCoffee && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-2">
                  Milk or Plant Alternative
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Whole Milk',
                    'Oat Milk (+0.75)',
                    'Almond Milk (+0.75)',
                    'Coconut Milk (+0.75)',
                    'None',
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMilk(m as any)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                        milk === m
                          ? 'border-[#c97a3e] bg-[#f4ebdc] font-bold text-[#2c1810]'
                          : 'border-[#ecdcc9] bg-white/70 text-[#6a4c37] hover:border-[#d9c5b0]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Roast Profile */}
            {(isCoffee || isBeans) && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-2">
                  Roast Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Light Floral', 'Medium Balanced', 'Dark French'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoast(r as any)}
                      className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                        roast === r
                          ? 'border-[#c97a3e] bg-[#f4ebdc] font-bold text-[#2c1810]'
                          : 'border-[#ecdcc9] bg-white/70 text-[#6a4c37] hover:border-[#d9c5b0]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extras */}
            {isCoffee && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/70 border border-[#ecdcc9]">
                <div>
                  <span className="text-xs font-bold text-[#2c1810] block">Extra Double Espresso Shot</span>
                  <span className="text-[11px] text-[#8c6e58]">Adds an intense rich crema punch (+$1.00)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setExtraShot(!extraShot)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                    extraShot ? 'bg-[#c97a3e] border-[#c97a3e] text-white' : 'border-[#d0bcab] bg-white'
                  }`}
                >
                  {extraShot && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                Special Requests for Barista
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Extra hot, light ice, dusting of cocoa powder..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] placeholder:text-[#a8907c] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-8 pt-5 border-t border-[#ebdcc9] flex items-center justify-between gap-4">
            {/* Quantity */}
            <div className="flex items-center gap-2 bg-white rounded-xl border border-[#d8c4ad] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#785133] hover:bg-[#f3ebd9] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-bold text-sm text-[#2c1810]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#785133] hover:bg-[#f3ebd9] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-[#d38243] hover:bg-[#bd6f32] text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-[#d38243]/25 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Add to Order</span>
              <span>•</span>
              <span>${(currentPrice * quantity).toFixed(2)}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
