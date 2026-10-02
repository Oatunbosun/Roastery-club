'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import OurStorySection from '@/components/OurStorySection';
import GallerySection from '@/components/GallerySection';
import ReservationSection from '@/components/ReservationSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import MailgunPreviewModal from '@/components/MailgunPreviewModal';
import OrdersHistoryModal from '@/components/OrdersHistoryModal';
import AccountModal from '@/components/AccountModal';

export default function HomePage() {
  const [isOrdersHistoryOpen, setIsOrdersHistoryOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#fbf7ee] text-[#2c1810] selection:bg-[#ecdcc9] selection:text-[#2c1810]">
      {/* Navigation */}
      <Navbar onOpenOrders={() => setIsOrdersHistoryOpen(true)} />

      {/* Hero Section inspired directly by reference design */}
      <HeroSection />

      {/* Menu & Beverage Customization */}
      <MenuSection />

      {/* Brand Story & Craft */}
      <OurStorySection />

      {/* Cafe Ambiance Gallery */}
      <GallerySection />

      {/* Table & Lounge Reservation */}
      <ReservationSection />

      {/* Location & Contact */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Slide-over Cart */}
      <CartDrawer />

      {/* Dedicated Checkout Flow */}
      <CheckoutModal />

      {/* Mailgun Email Dispatch Inspector */}
      <MailgunPreviewModal />

      {/* User Order History Modal */}
      <OrdersHistoryModal
        isOpen={isOrdersHistoryOpen}
        onClose={() => setIsOrdersHistoryOpen(false)}
      />

      {/* Member Lounge & Roastery Club Account Modal */}
      <AccountModal />
    </main>
  );
}
