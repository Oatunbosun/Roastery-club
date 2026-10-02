'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, CheckCircle, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function MailgunPreviewModal() {
  const { mailgunPreview, setMailgunPreview, setIsCheckoutOpen } = useCart();

  if (!mailgunPreview.open || !mailgunPreview.data) return null;

  const data = mailgunPreview.data;

  const handleReturnHome = () => {
    setMailgunPreview({ open: false, data: null });
    setIsCheckoutOpen(false);
    const homeEl = document.getElementById('home');
    if (homeEl) {
      homeEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setMailgunPreview({ open: false, data: null });
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#ebdcc9] overflow-hidden flex flex-col cursor-default"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#ebdcc9] bg-[#faf5ed] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#c97a3e] text-white flex items-center justify-center shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#2c1810]">
                  Official Email Receipt
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Dispatched
                </span>
              </div>
              <span className="text-[11px] text-[#8c6e58]">
                Sent to: <strong className="text-[#2c1810]">{data.to}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => setMailgunPreview({ open: false, data: null })}
            className="p-2 rounded-full hover:bg-[#ebdcc9] text-[#2c1810] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-5 py-2.5 bg-[#fbf7ee] border-b border-[#ebdcc9] text-xs text-[#6a4c37] flex items-center justify-between">
          <span>Subject: <strong className="text-[#2c1810]">{data.subject}</strong></span>
          <span className="text-[11px] text-[#8c6e58]">The Roastery Club Concierge</span>
        </div>

        {/* Live Rendered HTML Receipt */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f7f3ec]">
          {data.htmlPreview ? (
            <div
              className="bg-white rounded-2xl shadow-sm border border-[#ebdcc9] overflow-hidden"
              dangerouslySetInnerHTML={{ __html: data.htmlPreview }}
            />
          ) : (
            <p className="text-xs text-gray-500">Email preview content rendered.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#ebdcc9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#8c6e58]">
            A verified confirmation copy has been sent to your inbox.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReturnHome}
              className="flex-1 sm:flex-initial py-2 px-5 rounded-full bg-[#d38243] hover:bg-[#bd6f32] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              Return to Home Page
            </button>
            <button
              type="button"
              onClick={() => setMailgunPreview({ open: false, data: null })}
              className="flex-1 sm:flex-initial py-2 px-4 rounded-full bg-[#faf5ed] hover:bg-[#ebdcc9] text-[#2c1810] text-xs font-bold border border-[#d8c4ad] transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
