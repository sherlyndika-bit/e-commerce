import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PromoTicker } from '@/components/layout/PromoTicker';
import { MobileNav } from '@/components/layout/MobileNav';
import { FloatingChat } from '@/components/chat/FloatingChat';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Promo Marquee Ticker */}
      <PromoTicker />

      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Content Body */}
      <main className="flex-1">{children}</main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Nav */}
      <MobileNav />

      {/* Floating Interactive Live Chat Widget */}
      <FloatingChat />
    </div>
  );
}
