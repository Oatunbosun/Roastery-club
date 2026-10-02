'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, MapPin, CheckCircle, Sparkles, Send, Coffee } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';

export default function ReservationSection() {
  const { user } = useAuth();
  const { setMailgunPreview } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    const yyyy = tmrw.getFullYear();
    const mm = String(tmrw.getMonth() + 1).padStart(2, '0');
    const dd = String(tmrw.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [time, setTime] = useState('10:30 AM');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState('Fireplace Velvet Lounge');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<any | null>(null);

  const effectiveName = customerName || user?.displayName || '';
  const effectiveEmail = customerEmail || user?.email || '';

  const timeSlots = [
    '08:00 AM',
    '09:30 AM',
    '11:00 AM',
    '12:30 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
    '08:00 PM',
  ];

  const seatingOptions = [
    { id: 'Fireplace Velvet Lounge', desc: 'Cozy armchairs by the wood hearth' },
    { id: 'Espresso Bar Counter', desc: 'Front-row view of our manual espresso pulls' },
    { id: 'Botanical Garden Patio', desc: 'Open-air courtyard with olive trees' },
    { id: 'Roastery Drum Table', desc: 'Watch the Probat roaster in action' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customerName || effectiveName;
    const finalEmail = customerEmail || effectiveEmail;
    if (!finalName || !finalEmail || !date) return;

    setSubmitting(true);
    try {
      const reservationData = {
        userId: user ? user.uid : 'guest',
        customerName: finalName,
        customerEmail: finalEmail,
        phone: phone || '',
        date,
        time,
        guests: Number(guests),
        seatingArea,
        specialRequests: specialRequests || '',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      // 1. Persist to Firestore
      const docRef = await addDoc(collection(db, 'reservations'), reservationData);
      const savedReservation = { id: docRef.id, ...reservationData };

      // 2. Dispatch Confirmation Email via Mailgun API
      try {
        const emailRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: finalEmail,
            type: 'reservation',
            reservation: savedReservation,
          }),
        });
        const emailData = await emailRes.json();
        if (emailData?.htmlPreview) {
          setMailgunPreview({ open: true, data: emailData });
        }
      } catch (err) {
        console.warn('Mailgun dispatch notice:', err);
      }

      setConfirmedReservation(savedReservation);
    } catch (err) {
      console.error('Reservation error:', err);
      alert('Could not save reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="py-20 md:py-28 bg-[#fbf7ee] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c97a3e] block mb-2">
            Table & Lounge Bookings
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#2c1810] tracking-tight">
            Reserve Your Coffee Table
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6a4c37]">
            Whether for a quiet morning reading session, a coffee cupping experience, or afternoon tea with friends.
          </p>
        </div>

        {/* Content Box */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-[#2c1810]/5 border border-[#ebdcc9] overflow-hidden">
          {confirmedReservation ? (
            <div className="p-8 sm:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-[#f3ebd9] text-[#c97a3e] flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle className="w-9 h-9 stroke-[2.2]" />
              </motion.div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8c6e58] block mb-1">
                Booking Reference #{confirmedReservation.id?.slice(-6).toUpperCase()}
              </span>
              <h3 className="font-editorial text-3xl font-bold text-[#2c1810] mb-3">
                Your Table is Awaiting You!
              </h3>
              <p className="text-sm text-[#6a4c37] max-w-md mx-auto mb-8">
                A confirmation email has been dispatched via Mailgun to{' '}
                <strong className="text-[#2c1810]">{confirmedReservation.customerEmail}</strong>.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#faf5ed] border border-[#ebdcc9] text-left max-w-2xl mx-auto mb-8">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8c6e58] font-bold block">Date</span>
                  <span className="text-sm font-bold text-[#2c1810]">{confirmedReservation.date}</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8c6e58] font-bold block">Time</span>
                  <span className="text-sm font-bold text-[#2c1810]">{confirmedReservation.time}</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8c6e58] font-bold block">Party</span>
                  <span className="text-sm font-bold text-[#2c1810]">{confirmedReservation.guests} Guests</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8c6e58] font-bold block">Area</span>
                  <span className="text-sm font-bold text-[#2c1810] truncate block">{confirmedReservation.seatingArea}</span>
                </div>
              </div>

              <button
                onClick={() => setConfirmedReservation(null)}
                className="py-3 px-8 rounded-full bg-[#3e2213] hover:bg-[#27150a] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Book Another Time
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
              
              {/* Row 1: Name, Email, Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={effectiveName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-[#faf5eb] focus:bg-white text-xs text-[#2c1810] placeholder:text-[#a8907c] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={effectiveEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="eleanor@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-[#faf5eb] focus:bg-white text-xs text-[#2c1810] placeholder:text-[#a8907c] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                    Phone (SMS reminder)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-[#faf5eb] focus:bg-white text-xs text-[#2c1810] placeholder:text-[#a8907c] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                  />
                </div>
              </div>

              {/* Row 2: Date, Party Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#c97a3e]" />
                    <span>Select Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-[#faf5eb] focus:bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#c97a3e]" />
                    <span>Party Size</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-[#faf5eb] focus:bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest (Solo Coffee & Work)' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c97a3e]" />
                  <span>Available Time Slots</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                  {timeSlots.map((ts) => (
                    <button
                      key={ts}
                      type="button"
                      onClick={() => setTime(ts)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                        time === ts
                          ? 'border-[#c97a3e] bg-[#d38243] text-white shadow-sm'
                          : 'border-[#ecdcc9] bg-[#faf5ed] text-[#5c3e29] hover:border-[#c97a3e]'
                      }`}
                    >
                      {ts}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seating Area Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c97a3e]" />
                  <span>Preferred Atmosphere & Seating Area</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {seatingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSeatingArea(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        seatingArea === opt.id
                          ? 'border-[#c97a3e] bg-[#fbf5ea] shadow-sm ring-1 ring-[#c97a3e]'
                          : 'border-[#ecdcc9] bg-white hover:border-[#d9c5b0]'
                      }`}
                    >
                      <span className="font-bold text-xs text-[#2c1810] block mb-0.5">{opt.id}</span>
                      <span className="text-[11px] text-[#8c6e58]">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                  Special Occasion or Notes
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g., Birthday coffee tasting, high-chair needed, quiet corner..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-[#faf5eb] focus:bg-white text-xs text-[#2c1810] placeholder:text-[#a8907c] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[#ebdcc9] flex items-center justify-between">
                <span className="text-xs text-[#8c6e58]">
                  Instant reservation confirmation via Mailgun
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-3 px-8 rounded-full bg-[#d38243] hover:bg-[#bd6f32] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#d38243]/20 flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Confirming...' : 'Confirm Table'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
