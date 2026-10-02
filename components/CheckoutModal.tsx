'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CreditCard,
  CheckCircle,
  Truck,
  Coffee,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Home,
  Clock,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function CheckoutModal() {
  const {
    items,
    subtotal,
    tax,
    tip,
    setTip,
    discount,
    promoCode,
    total,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    setMailgunPreview,
  } = useCart();

  const { user, userProfile, signIn, loadUserOrders } = useAuth();

  // Form states
  const [orderType, setOrderType] = useState<'pickup' | 'dine_in' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [orderNotes, setOrderNotes] = useState('');

  // Derived values for Google / Roastery Club account or manual input
  const effectiveCustomerName = customerName || userProfile?.displayName || user?.displayName || '';
  const effectiveCustomerEmail = customerEmail || userProfile?.email || user?.email || '';
  const effectivePhone = phone || userProfile?.phone || '';
  const effectiveDeliveryAddress = deliveryAddress || (userProfile?.deliveryAddress?.street
    ? `${userProfile.deliveryAddress.street}${userProfile.deliveryAddress.suite ? `, ${userProfile.deliveryAddress.suite}` : ''}, ${userProfile.deliveryAddress.city || ''} ${userProfile.deliveryAddress.zip || ''}`
    : '');
  const effectiveOrderNotes = orderNotes || userProfile?.deliveryAddress?.instructions || '';

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'counter'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('987');

  // Processing & Completed states
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);
  const [brewStep, setBrewStep] = useState(1);

  const handleBackToHome = useCallback(() => {
    setIsCheckoutOpen(false);
    setPlacedOrder(null);
    const homeEl = document.getElementById('home');
    if (homeEl) {
      homeEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [setIsCheckoutOpen]);

  // Keyboard shortcut: Escape to close and go back to home page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBackToHome();
      }
    };
    if (isCheckoutOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, handleBackToHome]);

  // Simulate coffee brewing progress after order placement
  useEffect(() => {
    if (placedOrder) {
      const timer1 = setTimeout(() => setBrewStep(2), 3000);
      const timer2 = setTimeout(() => setBrewStep(3), 7000);
      const timer3 = setTimeout(() => setBrewStep(4), 11000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [placedOrder]);

  const tipOptions = [
    { label: 'No Tip', amount: 0 },
    { label: '$1.00', amount: 1.0 },
    { label: '$1.50 (Popular)', amount: 1.5 },
    { label: '$2.50', amount: 2.5 },
    { label: '$4.00 (Generous)', amount: 4.0 },
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const finalName = customerName || effectiveCustomerName;
    const finalEmail = customerEmail || effectiveCustomerEmail;
    if (!finalName || !finalEmail) {
      alert('Please provide your name and email address for order confirmation.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        userId: user ? user.uid : 'guest',
        customerName: finalName,
        customerEmail: finalEmail,
        phone: phone || effectivePhone,
        orderType,
        deliveryAddress: orderType === 'delivery' ? (deliveryAddress || effectiveDeliveryAddress) : orderType === 'dine_in' ? `Dine-In (${tableNumber})` : 'Roastery Bar Pickup',
        items: items.map((i) => ({
          name: i.item.name,
          quantity: i.quantity,
          price: i.calculatedPrice,
          size: i.size,
          milk: i.milk,
          roast: i.roast,
          extraShot: i.extraShot,
          notes: i.notes,
        })),
        subtotal,
        tax,
        tip,
        discount,
        promoCode: promoCode || '',
        total,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card (Stripe Verified)' : paymentMethod === 'wallet' ? 'Google/Apple Pay' : 'Pay at Roastery Bar',
        notes: orderNotes || effectiveOrderNotes,
        status: 'brewing',
        createdAt: new Date().toISOString(),
      };

      // 1. Persist to Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderPayload);
      const completeOrder = { id: docRef.id, ...orderPayload };

      // 2. Dispatch Confirmation Email via Mailgun API
      try {
        const mailRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: finalEmail,
            type: 'order_confirmation',
            order: completeOrder,
          }),
        });
        const mailData = await mailRes.json();
        if (mailData?.htmlPreview) {
          setMailgunPreview({ open: true, data: mailData });
        }
      } catch (mailErr) {
        console.warn('Mailgun notification error:', mailErr);
      }

      // 3. Trigger festive confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c97a3e', '#2c1810', '#e5d4be', '#ffffff'],
        });
      } catch (err) {}

      // 4. Update UI
      setPlacedOrder(completeOrder);
      clearCart();
      if (user) {
        loadUserOrders();
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      alert('Could not submit order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleBackToHome();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-3xl my-8 bg-[#fbf7ee] rounded-3xl shadow-2xl border border-[#ebdcc9] overflow-hidden text-[#2c1810] cursor-default"
      >
        {/* Modal Top Bar with prominent Back to Home navigation */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#ebdcc9] flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3ebd9] hover:bg-[#ebdcc9] text-xs font-bold text-[#2c1810] border border-[#d8c4ad] transition-all shadow-xs group"
              title="Return to The Roastery Club Home Page"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </button>

            <button
              type="button"
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-left group"
              title="Go to Home"
            >
              <span className="font-editorial text-xl sm:text-2xl font-bold text-[#2c1810] group-hover:text-[#c97a3e] transition-colors leading-none">
                The Roastery Club
              </span>
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#f3ebd9] text-[#8c5020] font-bold uppercase tracking-wider">
                Checkout
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBackToHome}
              className="p-2 rounded-full hover:bg-[#ebdcc9] text-[#2c1810] transition-colors"
              title="Close & Return to Home Page"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Breadcrumb Navigation Bar */}
        <div className="px-5 sm:px-6 py-2 bg-[#f4ebdc]/70 border-b border-[#ebdcc9] flex items-center justify-between text-xs text-[#785133]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBackToHome}
              className="hover:text-[#2c1810] font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5 text-[#c97a3e]" />
              <span>Home Lounge</span>
            </button>
            <span className="text-[#bfa894]">/</span>
            <button
              type="button"
              onClick={() => {
                setIsCheckoutOpen(false);
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#2c1810] font-semibold underline underline-offset-2"
            >
              Menu
            </button>
            <span className="text-[#bfa894]">/</span>
            <span className="font-bold text-[#2c1810]">Order Checkout</span>
          </div>

          <button
            type="button"
            onClick={handleBackToHome}
            className="text-[11px] text-[#8c6e58] hover:text-[#2c1810] font-medium hidden sm:inline"
          >
            Press ESC or click outside to exit
          </button>
        </div>

        {placedOrder ? (
          /* Success & Brewing Tracker Screen */
          <div className="p-8 sm:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-[#f4ebdc] border-2 border-[#c97a3e] text-[#c97a3e] flex items-center justify-center mx-auto mb-6 shadow-md"
            >
              <CheckCircle className="w-10 h-10 stroke-[2.2]" />
            </motion.div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#8c6e58] block mb-1">
              Order #{placedOrder.id?.slice(-8).toUpperCase()} Confirmed
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2c1810] mb-3">
              Your Brew is in the Works!
            </h2>
            <p className="text-sm text-[#6a4c37] max-w-lg mx-auto mb-8">
              Thank you, <strong className="text-[#2c1810]">{placedOrder.customerName}</strong>! We have dispatched your digital receipt to{' '}
              <strong className="text-[#2c1810]">{placedOrder.customerEmail}</strong> via Mailgun.
            </p>

            {/* Live Brewing Progress Tracker */}
            <div className="p-6 rounded-3xl bg-white border border-[#ebdcc9] max-w-xl mx-auto mb-8 text-left shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8c6e58] flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-[#c97a3e]" />
                  <span>Live Barista Status</span>
                </span>
                <span className="text-xs font-bold text-[#b45309] bg-[#fbf5ed] px-2.5 py-1 rounded-full border border-[#ebdcc9]">
                  {brewStep === 1 && '1/4: Grinding Single-Origin Beans'}
                  {brewStep === 2 && '2/4: Extracting Ristretto Shots (93°C)'}
                  {brewStep === 3 && '3/4: Steaming Velvety Microfoam'}
                  {brewStep === 4 && '4/4: Ready for You!'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#f1e5d4] h-2.5 rounded-full overflow-hidden mb-5">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#c97a3e] to-[#b45309] rounded-full"
                  initial={{ width: '25%' }}
                  animate={{
                    width:
                      brewStep === 1
                        ? '25%'
                        : brewStep === 2
                        ? '50%'
                        : brewStep === 3
                        ? '75%'
                        : '100%',
                  }}
                  transition={{ duration: 0.6 }}
                />
              </div>

              {/* Order items recap */}
              <div className="space-y-2 border-t border-[#f0e4d3] pt-4">
                <span className="text-xs font-bold text-[#2c1810] block">Ordered Items:</span>
                {placedOrder.items?.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs text-[#6a4c37]">
                    <span>
                      {it.quantity}x {it.name} {it.milk ? `(${it.milk})` : ''}
                    </span>
                    <span className="font-semibold text-[#2c1810]">
                      ${(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold text-[#2c1810] pt-2 border-t border-dashed border-[#ebdcc9]">
                  <span>Total Paid ({placedOrder.paymentMethod})</span>
                  <span className="text-[#b45309] font-editorial text-base">
                    ${placedOrder.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleBackToHome}
                className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-[#3e2213] hover:bg-[#27150a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <Home className="w-4 h-4 text-[#e6b98d]" />
                <span>Return to Home Page</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setPlacedOrder(null);
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto py-3.5 px-6 rounded-full border border-[#d8c4ad] bg-white hover:bg-[#f3ebd9] text-[#2c1810] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Browse More Brews</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">
            
            {/* Google Auth Quick Sign-In Banner if not logged in */}
            {!user && (
              <div className="p-3.5 rounded-2xl bg-[#faf5ed] border border-[#ebdcc9] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
                    {/* Google G Logo */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.27-2.09 3.67-5.17 3.67-9.15z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2c1810] block">Have a Google Account?</span>
                    <span className="text-[11px] text-[#8c6e58]">Sign in to auto-fill details & track your past orders</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f3ebd9] text-xs font-bold text-[#2c1810] border border-[#d8c4ad] shadow-xs transition-colors"
                >
                  Quick Sign In
                </button>
              </div>
            )}

            {/* 1. Order Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-2">
                1. How Would You Like Your Order?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'pickup', title: 'Pickup at Bar', desc: 'Ready in 10-12 mins' },
                  { id: 'dine_in', title: 'Dine-In Table', desc: 'Brought to your seat' },
                  { id: 'delivery', title: 'Courier Delivery', desc: 'Hot & insulated (+$2.50)' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setOrderType(type.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      orderType === type.id
                        ? 'border-[#c97a3e] bg-[#fbf5ed] ring-2 ring-[#c97a3e]/30 shadow-xs'
                        : 'border-[#ecdcc9] bg-white hover:border-[#d9c5b0]'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#2c1810] block mb-0.5">{type.title}</span>
                    <span className="text-[11px] text-[#8c6e58]">{type.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Customer Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={effectiveCustomerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Julian Barnes"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={effectiveCustomerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="julian@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone || effectivePhone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 789-0123"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                />
              </div>
            </div>

            {/* Additional info depending on orderType */}
            {orderType === 'delivery' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                  Delivery Destination Address *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress || effectiveDeliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="742 Evergreen Terrace, Apt 4B, Roast District"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                />
              </div>
            )}

            {orderType === 'dine_in' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                  Table Number or Seating Location
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. Table 4, Patio Booth 2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                />
              </div>
            )}

            {/* 3. Barista Tip */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-2">
                2. Support the Baristas (Tip)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {tipOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setTip(opt.amount)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      tip === opt.amount
                        ? 'border-[#c97a3e] bg-[#d38243] text-white shadow-xs'
                        : 'border-[#ecdcc9] bg-white text-[#6a4c37] hover:border-[#c97a3e]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Payment Method */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-2 flex items-center justify-between">
                <span>3. Payment Details</span>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
                </span>
              </label>

              <div className="grid grid-cols-3 gap-3 mb-3">
                {[
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'wallet', label: 'Google / Apple Pay' },
                  { id: 'counter', label: 'Pay at Counter' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === pm.id
                        ? 'border-[#c97a3e] bg-[#fbf5ed] ring-1 ring-[#c97a3e] text-[#2c1810]'
                        : 'border-[#ecdcc9] bg-white text-[#6a4c37]'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-white border border-[#ebdcc9] space-y-3">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#8c6e58] mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#d8c4ad] text-xs font-mono text-[#2c1810] focus:outline-none focus:ring-1 focus:ring-[#c97a3e]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-[#8c6e58] mb-1">
                        Expires
                      </label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8c4ad] text-xs font-mono text-[#2c1810] focus:outline-none focus:ring-1 focus:ring-[#c97a3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-[#8c6e58] mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8c4ad] text-xs font-mono text-[#2c1810] focus:outline-none focus:ring-1 focus:ring-[#c97a3e]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                Special Delivery / Pickup Notes
              </label>
              <input
                type="text"
                value={orderNotes || effectiveOrderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Leave on doorstep, extra napkins, oat milk in latte..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
              />
            </div>

            {/* Total and Action Buttons */}
            <div className="pt-4 border-t border-[#ebdcc9] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-[#8c6e58] block">Total Charged</span>
                <span className="font-editorial text-2xl font-bold text-[#b45309]">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleBackToHome}
                  className="flex-1 sm:flex-initial py-3.5 px-6 rounded-2xl border border-[#d8c4ad] bg-white hover:bg-[#f3ebd9] text-[#2c1810] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  ← Back to Home
                </button>

                <button
                  type="submit"
                  disabled={isProcessing || items.length === 0}
                  className="flex-1 sm:flex-initial py-3.5 px-8 rounded-2xl bg-[#d38243] hover:bg-[#bd6f32] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d38243]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  <span>{isProcessing ? 'Transmitting Brew Order...' : `Pay $${total.toFixed(2)} & Order`}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

          </form>
        )}
      </motion.div>
    </div>
  );
}
