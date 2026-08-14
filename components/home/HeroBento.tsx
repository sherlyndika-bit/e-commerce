'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Truck,
  ShieldCheck,
  Sparkles,
  Award,
  Ticket,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../ui/Button';

export function HeroBento() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      tag: '🎉 PESTA BELANJA GAJIAN',
      title: 'Diskon Terbesar Se-Indonesia Sampai 80%',
      description: 'Dapatkan ekstra cashback koin, gratis ongkir instan tanpa minimal belanja, dan potongan harga kilat dari ribuan seller terverifikasi.',
      bgGradient: 'from-brand-600 via-brand-500 to-amber-500',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Serbu Promo Sekarang',
      ctaLink: '/products?sort=popular',
      badge: 'Flash Sale 24 Jam',
    },
    {
      id: 2,
      tag: '🇮🇩 100% KARYA ANAK BANGSA',
      title: 'Lokal Pride: Bangga Produk Nusantara Berkualitas',
      description: 'Dukung pengrajin kulit Bandung, skincare halal lokal, dan biji kopi artisan terbaik langsung dari sumbernya.',
      bgGradient: 'from-indigo-900 via-indigo-800 to-brand-600',
      image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Jelajahi Brand Lokal',
      ctaLink: '/shops/brodo-official',
      badge: 'Karya Terbaik Negeri',
    },
    {
      id: 3,
      tag: '✨ OFFICIAL BRAND MALL',
      title: 'Gadget & Setup Kerja Produktif Garansi Resmi',
      description: 'Headphone ANC Hi-Res, keyboard mekanikal custom, dan fast charger GaN terlengkap dengan proteksi 100% original.',
      bgGradient: 'from-slate-900 via-slate-800 to-emerald-700',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Lihat Tech Mall',
      ctaLink: '/categories/komputer-laptop',
      badge: '100% Garansi TAM & Resmi',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const quickPills = [
    { label: 'Flash Sale Kilat', icon: Zap, href: '/#flash-sale', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
    { label: 'Bebas Ongkir Xtra', icon: Truck, href: '/products?free_shipping=true', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
    { label: 'Official Mall', icon: ShieldCheck, href: '/products?seller_badge=official', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' },
    { label: 'Panen Koin COinaja', icon: Sparkles, href: '/account?tab=coins', color: 'text-coin-600 bg-coin-50 dark:bg-coin-950/40 border-coin-200 dark:border-coin-800' },
    { label: 'Lokal Pride ID', icon: Award, href: '/shops/brodo-official', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' },
    { label: 'Pusat Voucher Promo', icon: Ticket, href: '/vouchers', color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800' },
  ];

  const slide = heroSlides[currentSlide];

  return (
    <section className="py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Hero Slider (Col 8) */}
          <div className="lg:col-span-8 relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden shadow-elevated group">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} p-6 sm:p-10 flex flex-col justify-between text-white`}
              >
                {/* Background ambient image overlay */}
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-35 mix-blend-overlay pointer-events-none hidden sm:block">
                  <Image src={slide.image} alt="" fill className="object-cover" />
                </div>

                {/* Top Badge */}
                <div className="flex items-center gap-2 z-10">
                  <span className="bg-white/20 backdrop-blur-md text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">
                    {slide.tag}
                  </span>
                  <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-xs">
                    {slide.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="max-w-xl z-10 my-auto">
                  <h1 className="text-2xl sm:text-4xl lg:text-4xl font-black tracking-tight leading-tight mb-3 drop-shadow-xs">
                    {slide.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed mb-6 max-w-lg">
                    {slide.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <Link href={slide.ctaLink}>
                      <Button
                        variant="dark"
                        size="md"
                        className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg border-none"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {slide.ctaText}
                      </Button>
                    </Link>
                    <Link
                      href="/products"
                      className="text-xs font-bold text-white/90 hover:text-white underline underline-offset-4 px-3 py-2"
                    >
                      Lihat Semua Promo
                    </Link>
                  </div>
                </div>

                {/* Bottom Slider Nav Indicators */}
                <div className="flex items-center justify-between z-10 pt-2 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    {heroSlides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        title={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))
                      }
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs flex items-center justify-center text-white transition-colors"
                      title="Slide Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs flex items-center justify-center text-white transition-colors"
                      title="Slide Selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side Bento Cards (Col 4) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Bento Card 1: Cashback Koin */}
            <Link
              href="/cart"
              className="relative rounded-3xl p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-brand-600 text-white flex flex-col justify-between overflow-hidden shadow-subtle hover:shadow-elevated transition-all group hover:-translate-y-0.5"
            >
              <div className="absolute right-0 bottom-0 w-32 h-32 opacity-25 mix-blend-overlay pointer-events-none group-hover:scale-110 transition-transform">
                <Sparkles className="w-full h-full" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 bg-white/25 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase mb-2">
                  <Sparkles className="w-3 h-3 text-amber-200" /> Koin COinaja
                </span>
                <h3 className="text-xl font-black leading-snug">
                  Cashback Koin s/d 50.000 Koin
                </h3>
                <p className="text-xs text-white/85 mt-1">
                  Bisa langsung dipotong saat checkout belanja apa aja!
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold gap-1 group-hover:translate-x-1 transition-transform">
                <span>Klaim Koin Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Bento Card 2: Toko Resmi Brodo & Somethinc */}
            <Link
              href="/shops/brodo-official"
              className="relative rounded-3xl p-6 bg-slate-900 dark:bg-slate-850 text-white flex flex-col justify-between overflow-hidden shadow-subtle hover:shadow-elevated transition-all border border-slate-800 group hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase mb-2">
                    <ShieldCheck className="w-3 h-3" /> Toko Pilihan Pekan Ini
                  </span>
                  <h3 className="text-lg font-black leading-snug">
                    Brodo Footwear Official
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Sepatu kulit asli Bandung garansi kualitas internasional.
                  </p>
                </div>
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                  <Image
                    src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=200&auto=format&fit=crop"
                    alt="Brodo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-brand-400 gap-1 group-hover:translate-x-1 transition-transform">
                <span>Kunjungi Official Store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Action Feature Pills */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {quickPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <Link
                key={pill.label}
                href={pill.href}
                className={`flex items-center gap-2 p-3 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${pill.color}`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold leading-tight truncate text-slate-800 dark:text-slate-200">
                  {pill.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
