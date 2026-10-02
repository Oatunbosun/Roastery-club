'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Coffee Catering & Events');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString(),
      });
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Contact submit error:', err);
      alert('Could not submit message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#f6efe3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c97a3e] block mb-2">
            Visit & Connect
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#2c1810] tracking-tight">
            We Would Love to Welcome You
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6a4c37]">
            Stop by for your morning pour over or reach out for wholesale roasting inquiries and private events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cafe Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-[#fbf7ee] border border-[#ebdcc9] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#f3ebd9] text-[#c97a3e] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-editorial text-lg font-bold text-[#2c1810] mb-1">
                    The Flagship Roastery
                  </h4>
                  <p className="text-xs text-[#6a4c37] leading-relaxed">
                    42 Artisan Way, Historic Roast District<br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#fbf7ee] border border-[#ebdcc9] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#f3ebd9] text-[#c97a3e] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-editorial text-lg font-bold text-[#2c1810] mb-1">
                    Roastery & Bar Hours
                  </h4>
                  <p className="text-xs text-[#6a4c37] leading-relaxed">
                    Monday – Friday: <strong>6:30 AM – 8:30 PM</strong><br />
                    Saturday – Sunday: <strong>7:00 AM – 9:00 PM</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#fbf7ee] border border-[#ebdcc9] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#f3ebd9] text-[#c97a3e] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-editorial text-lg font-bold text-[#2c1810] mb-1">
                    Direct Contact
                  </h4>
                  <p className="text-xs text-[#6a4c37] leading-relaxed">
                    hello@roasteryclub.com<br />
                    Telephone: (555) 762-7837
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-[#ebdcc9] shadow-sm">
            {sent ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-[#f3ebd9] text-[#c97a3e] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#2c1810] mb-2">
                  Message Dispatched!
                </h3>
                <p className="text-xs text-[#6a4c37] max-w-sm mx-auto mb-6">
                  Thank you for reaching out. Our roastery team will get back to your email within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="py-2.5 px-6 rounded-full bg-[#3e2213] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Claire Redfield"
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="claire@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                  >
                    <option value="Coffee Catering & Events">Coffee Catering & Events</option>
                    <option value="Wholesale Bean Partnership">Wholesale Bean Partnership</option>
                    <option value="Table & Lounge Inquiries">Table & Lounge Inquiries</option>
                    <option value="General Feedback & Compliments">General Feedback & Compliments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8c6e58] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you have in mind..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="py-3 px-8 rounded-full bg-[#d38243] hover:bg-[#bd6f32] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#d38243]/20 flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Transmitting...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
