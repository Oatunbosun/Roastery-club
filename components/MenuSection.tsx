'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Sparkles, Plus, Clock, Flame, Sliders } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '@/lib/coffee-data';
import { useCart } from '@/lib/cart-context';
import ItemModal from './ItemModal';

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { addItem } = useCart();

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'classics', label: 'Espresso & Classics' },
    { id: 'pourover', label: 'Specialty Pour Over' },
    { id: 'coldbrew', label: 'Cold Brew & Iced' },
    { id: 'bakery', label: 'Artisanal Bakery' },
    { id: 'beans', label: 'Roastery Beans' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="py-20 md:py-28 bg-[#f6efe3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c97a3e] block mb-2">
            The Daily Brew Bar
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#2c1810] tracking-tight">
            Curated Artisanal Menu
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6a4c37] leading-relaxed">
            Every bean is micro-lot sourced, precision ground, and extracted with pure calibrated spring water at 93.5°C.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto pb-4 mb-10 gap-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-[#2c1810] text-[#fbf7ee] shadow-lg shadow-[#2c1810]/20 scale-105'
                  : 'bg-white/80 hover:bg-white text-[#6a4c37] border border-[#ebdcc9] hover:border-[#c97a3e]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="group flex flex-col bg-[#fbf7ee] rounded-3xl overflow-hidden border border-[#ebdcc9] shadow-sm hover:shadow-xl hover:shadow-[#2c1810]/10 transition-all duration-300"
            >
              {/* Image Frame */}
              <div
                className="relative aspect-[16/10] overflow-hidden bg-[#e5d4be] cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-3 left-3 bg-[#c97a3e] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    {item.badge}
                  </span>
                )}

                {/* Prep time badge */}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#eedbc7]" />
                  {item.prepTime}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3
                      className="font-editorial text-xl font-bold text-[#2c1810] group-hover:text-[#c97a3e] transition-colors cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      {item.name}
                    </h3>
                    <span className="font-editorial text-lg font-bold text-[#b45309]">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-[#6a4c37] leading-relaxed line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  {/* Tasting notes */}
                  {item.tastingNotes && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tastingNotes.slice(0, 3).map((note) => (
                        <span
                          key={note}
                          className="px-2 py-0.5 rounded-full bg-[#f1e5d4] text-[10px] font-semibold text-[#785133]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#f0e4d3] flex items-center gap-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-[#d8c4ad] bg-white hover:bg-[#faf5ed] text-[#3e2213] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#c97a3e]" />
                    <span>Customize</span>
                  </button>
                  <button
                    onClick={() => addItem(item)}
                    className="py-2.5 px-4 rounded-xl bg-[#d38243] hover:bg-[#bd6f32] text-white text-xs font-bold shadow-md shadow-[#d38243]/20 flex items-center justify-center gap-1 transition-all active:scale-95"
                    title="Quick Add to Bag"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Item Customizer Modal */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
}
