'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Coffee, CheckCircle, PackageCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';

interface OrdersHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrdersHistoryModal({ isOpen, onClose }: OrdersHistoryModalProps) {
  const { userOrders, user } = useAuth();
  const { setMailgunPreview } = useCart();

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#fbf7ee] rounded-3xl shadow-2xl border border-[#ebdcc9] overflow-hidden flex flex-col text-[#2c1810] cursor-default"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#ebdcc9] bg-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f3ebd9] text-[#c97a3e] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#2c1810]">
                Your Order History
              </h2>
              <span className="text-[11px] text-[#8c6e58]">
                {user ? user.email : 'Guest Session'} • Persisted in Database
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#ebdcc9] text-[#2c1810] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {userOrders.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <Coffee className="w-10 h-10 text-[#a88d77] mb-2" />
              <h3 className="font-editorial text-xl font-bold text-[#2c1810] mb-1">
                No Past Orders Found
              </h3>
              <p className="text-xs text-[#7a5840]">
                Once you place an order, it will appear here in real-time.
              </p>
            </div>
          ) : (
            userOrders.map((ord: any) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl bg-white border border-[#ebdcc9] shadow-xs hover:border-[#c97a3e] transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#8c6e58] uppercase tracking-wider block">
                      Order #{ord.id?.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-[#a38771]">
                      {new Date(ord.createdAt || '2026-01-01').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-editorial text-lg font-bold text-[#b45309]">
                      ${Number(ord.total || 0).toFixed(2)}
                    </span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                      {ord.status || 'Brewed'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5 py-2 border-y border-[#f0e4d3] text-xs text-[#523826]">
                  {ord.items?.map((it: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {it.quantity}x {it.name} {it.milk ? `(${it.milk})` : ''}
                      </span>
                      <span className="font-medium text-[#2c1810]">
                        ${(Number(it.price || 0) * Number(it.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 text-[11px] text-[#8c6e58]">
                  <span>Method: {ord.paymentMethod || 'Online Checkout'}</span>
                  <span>Type: {ord.orderType || 'Pickup'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#ebdcc9] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              const homeEl = document.getElementById('home');
              if (homeEl) homeEl.scrollIntoView({ behavior: 'smooth' });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="py-2 px-5 rounded-full bg-[#f3ebd9] hover:bg-[#ebdcc9] text-[#2c1810] text-xs font-bold transition-colors"
          >
            ← Back to Home
          </button>
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-full bg-[#3e2213] hover:bg-[#27150a] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            Close History
          </button>
        </div>
      </motion.div>
    </div>
  );
}
