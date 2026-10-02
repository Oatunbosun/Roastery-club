'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Award, Coffee, Flame, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { MENU_ITEMS } from '@/lib/coffee-data';

export default function HeroSection() {
  const { addItem, setIsCartOpen } = useCart();

  const handleQuickAdd = (itemId: string) => {
    const item = MENU_ITEMS.find((m) => m.id === itemId);
    if (item) {
      addItem(item);
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-20 md:pt-14 md:pb-28 bg-[#fbf7ee]">
      
      {/* Decorative Curving Ribbon SVG Background (Identical to reference) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-35 z-0">
        <svg
          className="w-full h-full min-w-[1200px]"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main sweeping infinity loop ribbon */}
          <path
            d="M-100 500 C 150 180, 500 120, 720 220 C 1050 380, 1300 240, 1550 150 C 1700 80, 1300 700, 950 680 C 600 660, 200 820, -50 650 Z"
            stroke="#e5d4be"
            strokeWidth="56"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M100 850 C 350 400, 600 200, 850 350 C 1100 500, 1400 400, 1600 750"
            stroke="#ecdcc9"
            strokeWidth="32"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Botanical Coffee Branch Sketches (Left & Right corners matching reference) */}
      <div className="absolute -left-10 top-1/3 w-64 h-64 pointer-events-none opacity-25 select-none hidden md:block">
        <svg viewBox="0 0 200 200" fill="none" stroke="#7a5538" strokeWidth="1.2">
          {/* Coffee leaves & branch line art */}
          <path d="M20 180 Q 70 120, 150 60" />
          <path d="M50 150 Q 80 130, 90 90 Q 70 110, 50 150" />
          <path d="M80 120 Q 120 110, 140 70 Q 110 80, 80 120" />
          <path d="M110 90 Q 140 60, 170 40 Q 140 70, 110 90" />
          {/* Coffee cherries */}
          <circle cx="85" cy="115" r="5" />
          <circle cx="95" cy="110" r="4.5" />
          <circle cx="75" cy="125" r="4" />
        </svg>
      </div>

      <div className="absolute -right-12 bottom-12 w-72 h-72 pointer-events-none opacity-25 select-none hidden md:block">
        <svg viewBox="0 0 200 200" fill="none" stroke="#7a5538" strokeWidth="1.2">
          <path d="M180 190 Q 130 110, 50 40" />
          <path d="M140 140 Q 100 120, 80 80 Q 110 100, 140 140" />
          <path d="M100 90 Q 70 60, 40 40 Q 70 70, 100 90" />
          <circle cx="115" cy="105" r="5" />
          <circle cx="125" cy="115" r="4.5" />
          <circle cx="105" cy="95" r="4" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4ebdc] border border-[#e5d5c0] text-[#70492b] text-xs font-bold tracking-widest uppercase mb-4 shadow-sm"
        >
          <Flame className="w-3.5 h-3.5 text-[#c97a3e]" />
          <span>MICRO-BATCH WOOD ROASTED • ETHICAL DIRECT TRADE</span>
          <Sparkles className="w-3.5 h-3.5 text-[#c97a3e]" />
        </motion.div>

        {/* Hero Headline with Editorial Font Treatment */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-[#2b1810] leading-[1.08] mb-8 md:mb-14 select-none"
        >
          <span className="inline-block transition-transform duration-300 hover:-translate-y-1">
            Freshly
          </span>{' '}
          <span className="relative inline-block font-normal italic px-1 sm:px-3 text-transparent bg-clip-text bg-gradient-to-r from-[#b45309] via-[#d38243] to-[#c97a3e] transition-all duration-500 hover:scale-105 group cursor-default">
            Brewed
            {/* Hand-drawn artisan calligraphic underline swoosh */}
            <svg
              className="absolute -bottom-2 sm:-bottom-3.5 left-0 w-full h-3 sm:h-5 text-[#c97a3e] overflow-visible pointer-events-none"
              viewBox="0 0 200 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 5 12 Q 100 22 195 8"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="opacity-80"
              />
              <path
                d="M 12 15 Q 110 24 185 13"
                stroke="#e6b98d"
                strokeWidth="2"
                strokeLinecap="round"
                className="opacity-90"
              />
            </svg>
          </span>{' '}
          <span className="inline-block transition-transform duration-300 hover:-translate-y-1">
            Coffee
          </span>
        </motion.h1>

        {/* The 3 Angled Floating Hero Cards (Exact replication of reference layout) */}
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center justify-center px-4 sm:px-6">
          
          {/* Card 1 (Left): Rustic Stoneware Latte Art (-4deg tilt) */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            whileHover={{ y: -12, rotate: -2, scale: 1.03 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="group relative cursor-pointer"
            onClick={() => handleQuickAdd('latte-art-artisan')}
          >
            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden shadow-2xl shadow-[#2c1810]/25 border-4 border-white/80 bg-[#ebd9c5] transition-all duration-300">
              <Image
                src="https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=900&q=85"
                alt="Artisanal Latte Art in Stoneware Cup"
                fill
                priority
                referrerPolicy="no-referrer"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24130a]/80 via-transparent to-black/10 opacity-90 group-hover:opacity-75 transition-opacity" />
              
              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-left text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e6b98d] block mb-1">
                  Artisanal Classic
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#fbf7ee] leading-tight mb-1">
                  Artisanal Flat White
                </h3>
                <div className="flex items-center justify-between text-xs text-[#eedbc7]">
                  <span>Double ristretto • Oat microfoam</span>
                  <span className="font-bold text-sm text-white">$5.75</span>
                </div>
              </div>

              {/* Quick Add Pill */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#2c1810] shadow-md flex items-center gap-1.5">
                <span>Add to Bag</span>
                <ArrowRight className="w-3 h-3 text-[#c97a3e]" />
              </div>
            </div>
          </motion.div>

          {/* Card 2 (Center): Whipped Cream Cloud Mocha (+2deg tilt, elevated) */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: -16, rotate: 2, scale: 1 }}
            whileHover={{ y: -28, rotate: 0, scale: 1.05 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="group relative cursor-pointer z-20 md:-mt-6"
            onClick={() => handleQuickAdd('signature-cloud-mocha')}
          >
            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl shadow-[#2c1810]/35 border-4 border-white bg-[#ebd9c5] transition-all duration-300 ring-2 ring-[#c97a3e]/30">
              <Image
                src="https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=900&q=85"
                alt="Whipped Velvet Cloud Mocha"
                fill
                priority
                referrerPolicy="no-referrer"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24130a]/85 via-transparent to-black/15 opacity-90 group-hover:opacity-75 transition-opacity" />

              {/* Badge */}
              <div className="absolute top-4 left-4 bg-[#c97a3e] text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>House Favorite</span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-0 inset-x-0 p-6 text-left text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e6b98d] block mb-1">
                  Single-Origin Valrhona
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#fbf7ee] leading-tight mb-1">
                  Whipped Cloud Mocha
                </h3>
                <div className="flex items-center justify-between text-xs text-[#eedbc7]">
                  <span>Vanilla bean cream • Cocoa curls</span>
                  <span className="font-bold text-base text-white">$6.50</span>
                </div>
              </div>

              {/* Quick Add Pill */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2c1810] shadow-md flex items-center gap-1.5">
                <span>Quick Order</span>
                <ArrowRight className="w-3 h-3 text-[#c97a3e]" />
              </div>
            </div>
          </motion.div>

          {/* Card 3 (Right): Golden Cinnamon Cappuccino (+6deg tilt) */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: 10 }}
            animate={{ opacity: 1, y: 0, rotate: 6 }}
            whileHover={{ y: -12, rotate: 3, scale: 1.03 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="group relative cursor-pointer"
            onClick={() => handleQuickAdd('cappuccino-cinnamon-dust')}
          >
            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden shadow-2xl shadow-[#2c1810]/25 border-4 border-white/80 bg-[#ebd9c5] transition-all duration-300">
              <Image
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85"
                alt="Golden Dust Cappuccino"
                fill
                priority
                referrerPolicy="no-referrer"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24130a]/80 via-transparent to-black/10 opacity-90 group-hover:opacity-75 transition-opacity" />

              {/* Bottom Caption */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-left text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e6b98d] block mb-1">
                  Velvet Foam Classic
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#fbf7ee] leading-tight mb-1">
                  Golden Dust Cappuccino
                </h3>
                <div className="flex items-center justify-between text-xs text-[#eedbc7]">
                  <span>Ceylon spice • Dense microfoam</span>
                  <span className="font-bold text-sm text-white">$5.25</span>
                </div>
              </div>

              {/* Quick Add Pill */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#2c1810] shadow-md flex items-center gap-1.5">
                <span>Add to Bag</span>
                <ArrowRight className="w-3 h-3 text-[#c97a3e]" />
              </div>
            </div>
          </motion.div>

        </div>

        {/* Feature Highlights beneath cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 md:mt-20 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-8 border-t border-[#ebdcc9]"
        >
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#ede1d3]">
            <span className="font-editorial text-2xl font-bold text-[#2c1810]">100%</span>
            <span className="text-xs text-[#7a5840] font-medium mt-0.5">Arabica Single Origin</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#ede1d3]">
            <span className="font-editorial text-2xl font-bold text-[#2c1810]">48 hrs</span>
            <span className="text-xs text-[#7a5840] font-medium mt-0.5">Peak Roasting Freshness</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#ede1d3]">
            <span className="font-editorial text-2xl font-bold text-[#2c1810]">4.9 ★</span>
            <span className="text-xs text-[#7a5840] font-medium mt-0.5">Over 2,400+ Cafe Ratings</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#ede1d3]">
            <span className="font-editorial text-2xl font-bold text-[#2c1810]">Zero Waste</span>
            <span className="text-xs text-[#7a5840] font-medium mt-0.5">Compostable Bean Chaff</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
