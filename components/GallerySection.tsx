'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  src: string;
  span?: string;
}

export default function GallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      title: 'The Brass Espresso Bar',
      category: 'Sanctuary',
      src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
      span: 'md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto',
    },
    {
      id: 'g2',
      title: 'Precision Pour-Over Ritual',
      category: 'Brewing',
      src: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
      span: 'aspect-[4/3]',
    },
    {
      id: 'g3',
      title: 'Fresh Morning Pastry Display',
      category: 'Bakery',
      src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      span: 'aspect-[4/3]',
    },
    {
      id: 'g4',
      title: 'Cozy Fireside Reading Nooks',
      category: 'Atmosphere',
      src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      span: 'aspect-[4/3]',
    },
    {
      id: 'g5',
      title: 'Direct-Trade Bean Roasting Drum',
      category: 'Roastery',
      src: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=800&q=80',
      span: 'aspect-[4/3]',
    },
  ];

  return (
    <section id="gallery" className="py-20 md:py-28 bg-[#f6efe3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c97a3e] block mb-2">
            Atmosphere & Moments
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#2c1810] tracking-tight">
            Step Inside The Sanctuary
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6a4c37]">
            Sun-drenched wooden tables, warm vinyl melodies, and the unmistakable aroma of slow-roasted beans.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-[240px]">
          {galleryItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedPhoto(item)}
              className={`relative rounded-3xl overflow-hidden cursor-pointer group shadow-sm border border-[#ebdcc9] bg-[#ebdcc9] ${item.span || 'aspect-[4/3]'}`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                referrerPolicy="no-referrer"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e6b98d]">
                  {item.category}
                </span>
                <h4 className="font-editorial text-xl font-bold">{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-[#24130a] rounded-3xl overflow-hidden border border-white/10"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#e6b98d] uppercase tracking-wider font-semibold">
                    {selectedPhoto.category}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold">{selectedPhoto.title}</h3>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
