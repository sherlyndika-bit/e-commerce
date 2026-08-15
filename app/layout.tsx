import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { RoleSwitcherBar } from '@/components/ui/RoleSwitcherBar';
import { ToastContainer } from '@/components/ui/ToastContainer';
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TumbasCO - Marketplace Belanja Online Indonesia',
  description:
    'TumbasCO adalah platform e-commerce marketplace multi-seller terlengkap di Indonesia. Belanja fashion, gadget, skincare, perlengkapan rumah dengan promo diskon kilat, koin cashback, dan gratis ongkir!',
  keywords: [
    'TumbasCO',
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
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900 pb-16 lg:pb-0">
        {/* Floating Demo Role Switcher Bar */}
        <RoleSwitcherBar />

        {/* Child Routes */}
        {children}



        {/* Toast Feedback Renderer */}
        <ToastContainer />
      </body>
    </html>
  );
}
