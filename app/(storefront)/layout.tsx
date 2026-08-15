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
      {/* Promo Marquee Ticker - Hidden on mobile for native app feel */}
      <div className="hidden sm:block">
        <PromoTicker />
      </div>

      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Content Body - with bottom padding on mobile for MobileNav */}
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>

      {/* Global Footer - Hidden on mobile like a native app */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      {/* Mobile Sticky Bottom Nav */}
      <MobileNav />

      {/* Floating Interactive Live Chat Widget */}
      <FloatingChat />
    </div>
  );
}
