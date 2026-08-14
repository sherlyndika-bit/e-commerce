import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PromoTicker } from '@/components/layout/PromoTicker';
import { MobileNav } from '@/components/layout/MobileNav';
import { RoleSwitcherBar } from '@/components/ui/RoleSwitcherBar';
import { ToastContainer } from '@/components/ui/ToastContainer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'COinaja - Belanja Apa Aja, CO-in Aja! Marketplace Indonesia',
  description:
    'Platform e-commerce marketplace multi-seller terlengkap di Indonesia. Belanja fashion, gadget, skincare, perlengkapan rumah, dan kopi nusantara dengan promo diskon kilat, koin cashback, dan gratis ongkir!',
  keywords: [
    'marketplace indonesia',
    'belanja online',
    'diskon kilat',
    'gratis ongkir',
    'koin cashback',
    'official store',
    'lokal pride',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col antialiased bg-[#f8fafc] text-slate-900 pb-16 lg:pb-0">
        {/* Floating Demo Role Switcher Bar */}
        <RoleSwitcherBar />

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

        {/* Toast Feedback Renderer */}
        <ToastContainer />
      </body>
    </html>
  );
}
