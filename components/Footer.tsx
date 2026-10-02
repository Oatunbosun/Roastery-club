'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Coffee, Heart, CheckCircle } from 'lucide-react';

export default function Footer() {
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#24130a] text-[#fbf7ee] pt-16 pb-12 border-t border-[#3e2213]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" className="text-[#c97a3e]">
                <path d="M20 38C20 38 20 72 50 72C80 72 80 38 80 38H20Z" fill="#c97a3e" />
                <path d="M75 44C85 44 88 56 75 62" stroke="#c97a3e" strokeWidth="7" strokeLinecap="round" />
                <circle cx="42" cy="50" r="3.5" fill="#24130a" />
                <circle cx="58" cy="50" r="3.5" fill="#24130a" />
                <path d="M45 58C48 62 52 62 55 58" stroke="#24130a" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="font-editorial text-2xl font-bold text-[#fbf7ee]">
                The Roastery Club
              </span>
            </div>

            <p className="text-xs text-[#b89f8c] leading-relaxed max-w-sm">
              Artisanal micro-batch roastery and neighborhood lounge. Handcrafted single-origin coffees, organic slow-fermented pastries, and quiet fireside moments.
            </p>

            <div className="pt-2 text-xs text-[#e6b98d]">
              📍 42 Artisan Way • Open Daily 6:30 AM – 9:00 PM
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c97a3e] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#b89f8c]">
              <li><a href="#home" className="hover:text-white transition-colors">Home Lounge</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Curated Brew Menu</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">Our Roasting Craft</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Atmosphere Gallery</a></li>
              <li><a href="#reservation" className="hover:text-white transition-colors">Reserve a Table</a></li>
            </ul>
          </div>

          {/* Coffee Offerings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c97a3e] mb-4">
              Specialties
            </h4>
            <ul className="space-y-2.5 text-xs text-[#b89f8c]">
              <li><span>Double Ristretto Flat White</span></li>
              <li><span>Whipped Velvet Cloud Mocha</span></li>
              <li><span>Ethiopian Chemex Pour-Over</span></li>
              <li><span>Salted Caramel Nitro Cold Brew</span></li>
              <li><span>Pistachio Cardamom Croissant</span></li>
            </ul>
          </div>

          {/* Newsletter with Promo */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c97a3e] mb-3">
              Roaster’s Journal
            </h4>
            <p className="text-xs text-[#b89f8c] mb-3 leading-relaxed">
              Subscribe for new micro-lot drops & get 10% off your next checkout with code <strong className="text-white">ROASTERY10</strong>.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Welcome to the Club! Code ROASTERY10 unlocked.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-[#a8907c] focus:outline-none focus:ring-1 focus:ring-[#c97a3e]"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-xl bg-[#d38243] hover:bg-[#bd6f32] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Join the Club
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8c6e58] gap-4">
          <p>© {new Date().getFullYear()} The Roastery Club. All rights reserved. Crafted with passion.</p>
          <div className="flex items-center gap-6">
            <span>Powered by Firebase & Mailgun</span>
            <span>Google Cloud OAuth Enabled</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
