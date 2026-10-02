'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  ArrowRight,
  LogOut,
  Coffee,
  Menu as MenuIcon,
  X,
  Clock,
  Sparkles,
  ChevronDown,
  MapPin,
  Calendar,
  Compass,
  User,
  Award,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

interface NavbarProps {
  onOpenOrders?: () => void;
}

export default function Navbar({ onOpenOrders }: NavbarProps) {
  const { itemCount, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const {
    user,
    userProfile,
    signIn,
    signOut,
    userOrders,
    setIsAccountModalOpen,
    setAccountActiveTab,
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
    } catch (err) {
      console.error('Sign in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const primaryLeftLinks = [
    { label: 'MENU', href: '#menu' },
    { label: 'OUR STORY', href: '#story' },
    { label: 'RESERVATION', href: '#reservation' },
  ];

  return (
    <>
      {/* Top Subtle Announcement Bar */}
      <div className="bg-[#2c1810] text-[#fbf7ee] text-[11px] font-medium py-1.5 px-4 text-center tracking-wider border-b border-[#3e2213] relative z-40 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[#c97a3e] text-[10px] font-bold uppercase tracking-widest">
            Artisanal Micro-Batch Roastery
          </span>
          <span className="text-[#e6b98d]">
            ✦ Micro-lot beans roasted fresh every 48 hours • Free local delivery over $25 with code <strong className="text-white">ROASTERY10</strong>
          </span>
          <span className="text-[10px] text-[#b89f8c]">
            42 Artisan Way • Open Daily 6:30 AM
          </span>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#fbf7ee]/95 backdrop-blur-md border-b border-[#ebdcc9]/70 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left Navigation: Streamlined & Spacious */}
          <nav className="hidden lg:flex items-center space-x-8">
            {primaryLeftLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[12px] font-bold tracking-[0.16em] text-[#3e2213] hover:text-[#c97a3e] transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c97a3e] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* Center Logo with Awesome Interactive Animation */}
          <Link
            href="#home"
            className="flex items-center justify-center group flex-col py-1"
            title="The Roastery Club - Return to Top"
          >
            <div className="flex items-center gap-2.5">
              {/* Cup emblem with playful hover tilt and perpetual steam float */}
              <motion.div
                whileHover={{ rotate: [-2, 4, -2, 0], scale: 1.08 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="relative cursor-pointer"
              >
                <svg width="36" height="36" viewBox="0 0 100 100" fill="none" className="text-[#3e2213] shrink-0 drop-shadow-xs">
                  {/* Cup body */}
                  <path d="M20 38C20 38 20 72 50 72C80 72 80 38 80 38H20Z" fill="#3e2213" />
                  {/* Cup handle */}
                  <path d="M75 44C85 44 88 56 75 62" stroke="#3e2213" strokeWidth="7" strokeLinecap="round" />
                  {/* Saucer */}
                  <path d="M16 78C30 83 70 83 84 78" stroke="#3e2213" strokeWidth="6" strokeLinecap="round" />
                  {/* Cute smiling face */}
                  <circle cx="42" cy="50" r="3.5" fill="#fbf7ee" />
                  <circle cx="58" cy="50" r="3.5" fill="#fbf7ee" />
                  <path d="M45 58C48 62 52 62 55 58" stroke="#fbf7ee" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Floating heart steam */}
                  <motion.path
                    d="M50 28C46 22 41 24 43 19C45 15 50 20 50 20C50 20 55 15 57 19C59 24 54 22 50 28Z"
                    fill="#c97a3e"
                    animate={{
                      y: [0, -3.5, 0],
                      scale: [1, 1.1, 1],
                      opacity: [0.85, 1, 0.85],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  {/* Floating aroma beans */}
                  <motion.circle
                    cx="16"
                    cy="30"
                    r="3"
                    fill="#c97a3e"
                    animate={{ y: [0, -2, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  />
                  <motion.circle
                    cx="84"
                    cy="30"
                    r="3"
                    fill="#c97a3e"
                    animate={{ y: [0, -2, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  />
                </svg>

                {/* Micro steam sparkle on hover */}
                <motion.span
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  whileHover={{ opacity: 1, scale: 1, y: -6 }}
                  className="absolute -top-2 right-0 text-[10px] pointer-events-none select-none text-[#d38243]"
                >
                  ✨
                </motion.span>
              </motion.div>

              {/* Animated Name Branding */}
              <div className="flex flex-col text-left relative">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] tracking-[0.28em] uppercase text-[#8c6e58] font-bold leading-none group-hover:text-[#c97a3e] transition-colors">
                    The
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#c97a3e]/60 group-hover:scale-150 group-hover:bg-[#c97a3e] transition-all" />
                  <span className="text-[8px] tracking-wider text-[#b89f8c] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    EST. 2024
                  </span>
                </div>

                {/* Main Name with Liquid Caramel Shimmer */}
                <span className="font-editorial text-2xl sm:text-[26px] font-bold tracking-tight text-[#2c1810] leading-tight flex items-center">
                  <span className="relative inline-block bg-gradient-to-r from-[#2c1810] via-[#c97a3e] to-[#2c1810] bg-[length:200%_auto] bg-clip-text group-hover:text-transparent group-hover:bg-right transition-all duration-700">
                    Roastery Club
                  </span>
                </span>

                {/* Animated warm latte art flourish underline */}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-[#c97a3e] via-[#e6b98d] to-transparent group-hover:w-full transition-all duration-500 rounded-full" />
              </div>
            </div>
          </Link>

          {/* Right Area: Consolidated "Explore" Menu + Integrated Action Island */}
          <div className="hidden lg:flex items-center space-x-6">
            
            {/* Elegant Explore Dropdown for secondary links */}
            <div className="relative">
              <button
                onClick={() => setExploreDropdownOpen(!exploreDropdownOpen)}
                onBlur={() => setTimeout(() => setExploreDropdownOpen(false), 200)}
                className="flex items-center gap-1 text-[12px] font-bold tracking-[0.16em] text-[#3e2213] hover:text-[#c97a3e] transition-colors py-1 group"
              >
                <span>EXPLORE</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${exploreDropdownOpen ? 'rotate-180 text-[#c97a3e]' : 'text-[#8c6e58]'}`} />
              </button>

              <AnimatePresence>
                {exploreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-52 rounded-2xl bg-white p-2 shadow-xl border border-[#ebdcc9] z-50 text-[#2c1810]"
                  >
                    <a
                      href="#gallery"
                      onClick={() => setExploreDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#3e2213] hover:bg-[#faf5ed] rounded-xl transition-colors"
                    >
                      <Compass className="w-4 h-4 text-[#c97a3e]" />
                      <span>Atmosphere & Gallery</span>
                    </a>
                    <a
                      href="#contact"
                      onClick={() => setExploreDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#3e2213] hover:bg-[#faf5ed] rounded-xl transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-[#c97a3e]" />
                      <span>Location & Contact</span>
                    </a>
                    <a
                      href="#reservation"
                      onClick={() => setExploreDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#3e2213] hover:bg-[#faf5ed] rounded-xl transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-[#c97a3e]" />
                      <span>Table Booking</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Unified Action Island: Combines Cart, User Auth, and Order CTA into one gorgeous pill */}
            <div className="flex items-center bg-white/80 border border-[#ecdcc9] rounded-full p-1 pl-2 gap-2 shadow-xs hover:border-[#d8c4ad] transition-all">
              
              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full text-[#3e2213] hover:bg-[#f3ebd9] transition-colors"
                title={`Open Coffee Bag (${itemCount} items)`}
              >
                <ShoppingBag className="w-4 h-4 text-[#3e2213]" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-[#c97a3e] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#fbf7ee]"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {/* Minimalist User Auth Chip */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-[#c97a3e] transition-all"
                    title={`Signed in as ${user.displayName || user.email}`}
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        width={28}
                        height={28}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-[#c97a3e]"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#3e2213] text-white flex items-center justify-center text-xs font-bold">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 rounded-2xl bg-white p-3 shadow-xl border border-[#ecdcc9] z-50 text-[#2c1810]"
                      >
                        <div className="px-3 py-2 border-b border-[#f0e4d3] mb-2">
                          <p className="text-xs font-bold text-[#2c1810] truncate">
                            {user.displayName || 'Roastery Club Guest'}
                          </p>
                          <p className="text-[11px] text-[#8c6e58] truncate">{user.email}</p>
                        </div>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setAccountActiveTab('card');
                            setIsAccountModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#3e2213] hover:bg-[#faf5ed] rounded-xl transition-colors"
                        >
                          <Award className="w-4 h-4 text-[#c97a3e]" />
                          <span>Member VIP Pass & Perks</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setAccountActiveTab('preferences');
                            setIsAccountModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#3e2213] hover:bg-[#faf5ed] rounded-xl transition-colors"
                        >
                          <Coffee className="w-4 h-4 text-[#c97a3e]" />
                          <span>Coffee Palate DNA</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setAccountActiveTab('orders');
                            setIsAccountModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#3e2213] hover:bg-[#faf5ed] rounded-xl transition-colors"
                        >
                          <Clock className="w-4 h-4 text-[#c97a3e]" />
                          <span>Past Orders ({userOrders.length})</span>
                        </button>

                        <button
                          onClick={() => {
                            signOut();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-xl transition-colors mt-1 border-t border-[#f5ede0] pt-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className="relative p-2 rounded-full text-[#3e2213] hover:bg-[#f3ebd9] hover:text-[#c97a3e] transition-all group"
                  title="Roastery Club Member Account & Sign In"
                >
                  <User className="w-4 h-4 text-[#3e2213] group-hover:text-[#c97a3e] transition-colors" />
                </button>
              )}

              {/* Subtle Divider */}
              <div className="h-4 w-px bg-[#ebdcc9]" />

              {/* Signature ORDER NOW CTA Pill */}
              <button
                onClick={() => {
                  if (itemCount > 0) {
                    setIsCheckoutOpen(true);
                  } else {
                    const menuEl = document.getElementById('menu');
                    menuEl?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-[#d38243] hover:bg-[#bd6f32] text-white font-semibold text-[12px] tracking-wider uppercase shadow-sm shadow-[#d38243]/20 hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>ORDER NOW</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </button>

            </div>

          </div>

          {/* Mobile Bar Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#3e2213] rounded-full hover:bg-[#f3ebd9]"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c97a3e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#3e2213] rounded-full hover:bg-[#f3ebd9]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-[#ebdcc9] bg-[#fbf7ee] px-6 py-6 overflow-hidden"
            >
              <div className="flex flex-col space-y-4">
                {[
                  { label: 'HOME', href: '#home' },
                  { label: 'MENU', href: '#menu' },
                  { label: 'OUR STORY', href: '#story' },
                  { label: 'GALLERY', href: '#gallery' },
                  { label: 'RESERVATION', href: '#reservation' },
                  { label: 'CONTACT', href: '#contact' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-bold tracking-wider text-[#3e2213] hover:text-[#c97a3e]"
                  >
                    {link.label}
                  </a>
                ))}

                <div className="pt-4 border-t border-[#ecdcc9] flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (itemCount > 0) setIsCheckoutOpen(true);
                      else {
                        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full py-3 rounded-full bg-[#d38243] text-white font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>ORDER NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {user ? (
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#ecdcc9]">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setIsAccountModalOpen(true);
                        }}
                        className="flex items-center gap-2 text-left"
                      >
                        {user.photoURL && (
                          <Image
                            src={user.photoURL}
                            alt=""
                            width={32}
                            height={32}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div>
                          <p className="text-xs font-bold text-[#2c1810]">{user.displayName || 'Member'}</p>
                          <p className="text-[10px] text-[#8c6e58]">{user.email}</p>
                          <span className="text-[9px] text-[#c97a3e] font-bold">Open VIP Lounge →</span>
                        </div>
                      </button>
                      <button
                        onClick={() => signOut()}
                        className="text-xs text-red-600 font-semibold p-2"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsAccountModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl border border-[#d8c4ad] bg-white hover:bg-[#faf5eb] text-[#2c1810] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#c97a3e]" />
                      <span>Member Sign In & VIP Perks</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
