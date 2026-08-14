'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiFlashlightFill,
  RiTruckFill,
  RiShieldStarFill,
  RiSmartphoneFill,
  RiCopperCoinFill,
  RiCoupon2Fill,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri';
import { useToastStore } from '@/lib/store/useToastStore';

export function HeroBento() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { addToast } = useToastStore();

  const heroSlides = [
    {
      id: 1,
      tag: '🔥 PESTA DISKON GAJIAN',
      title: 'Diskon Spesial Gadget & Elektronik Hingga 80%',
      description: 'Ekstra cashback koin, gratis ongkir se-Indonesia, dan cicilan 0% tanpa DP.',
      bgGradient: 'bg-slate-900',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
      ctaText: 'Belanja Sekarang',
      ctaLink: '/products?sort=popular',
      badge: 'Flash Sale 24 Jam',
    },
    {
      id: 2,
      tag: '🇮🇩 BANGGA LOKAL PRIDE',
      title: 'Karya Terbaik Pengrajin & Brand Asli Nusantara',
      description: 'Sepatu kulit Bandung, batik tulis, fashion artisan kualitas internasional.',
      bgGradient: 'bg-pink-950',
      image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1200&auto=format&fit=crop',
      ctaText: 'Cek Koleksi Lokal',
      ctaLink: '/shops/brodo-official',
      badge: '100% Original',
    },
    {
      id: 3,
      tag: '✨ BEAUTY & GLOWING',
      title: 'Skincare & Makeup Original BPOM Terlaris',
      description: 'Dapatkan voucher potongan langsung Rp50.000 untuk brand official.',
      bgGradient: 'bg-rose-950',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
      ctaText: 'Klaim Promo',
      ctaLink: '/categories/kecantikan-perawatan',
      badge: 'Gratis Ongkir Xtra',
    },
  ];

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const quickPills = [
    { label: 'Kejar Diskon', icon: RiFlashlightFill, href: '/#flash-sale' },
    { label: 'Bebas Ongkir', icon: RiTruckFill, href: '/products?free_shipping=true' },
    { label: 'Official Store', icon: RiShieldStarFill, href: '/products?seller_badge=official' },
    { label: 'Top-Up & Tagihan', icon: RiSmartphoneFill, href: '#', onClick: () => addToast({ title: 'Top-Up & Tagihan', description: 'Layanan Pulsa & Tagihan akan segera hadir.', type: 'info' }) },
    { label: 'Koin Rewards', icon: RiCopperCoinFill, href: '/account?tab=coins' },
    { label: 'Kupon Promo', icon: RiCoupon2Fill, href: '/vouchers' },
  ];

  const slide = heroSlides[currentSlide];

  return (
    <section className="bg-white pt-3 pb-2 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Banner Slider */}
        <div className="relative h-56 sm:h-72 md:h-80 rounded-lg overflow-hidden group shadow-xs bg-slate-100">
          {isMounted ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`absolute inset-0 ${slide.bgGradient} flex items-center text-white`}
              >
                {/* Background Photo */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover opacity-60"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Text content */}
                <div className="relative z-10 p-5 sm:p-8 md:p-10 max-w-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-pink-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded">
                      {slide.tag}
                    </span>
                    <span className="bg-amber-400 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded">
                      {slide.badge}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight mb-2 drop-shadow-sm">
                    {slide.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 mb-4 max-w-md line-clamp-2">
                    {slide.description}
                  </p>
                  <Link href={slide.ctaLink}>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded text-xs font-bold transition-all shadow-sm">
                      {slide.ctaText} →
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className={`absolute inset-0 ${heroSlides[0].bgGradient} flex items-center text-white`}>
                {/* SSR Placeholder matching first slide */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={heroSlides[0].image}
                    alt={heroSlides[0].title}
                    fill
                    className="object-cover opacity-60"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="relative z-10 p-5 sm:p-8 md:p-10 max-w-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-pink-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded">
                      {heroSlides[0].tag}
                    </span>
                    <span className="bg-amber-400 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded">
                      {heroSlides[0].badge}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight mb-2 drop-shadow-sm">
                    {heroSlides[0].title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 mb-4 max-w-md line-clamp-2">
                    {heroSlides[0].description}
                  </p>
                  <button className="bg-pink-600 text-white px-4 py-1.5 rounded text-xs font-bold shadow-sm">
                    {heroSlides[0].ctaText} →
                  </button>
                </div>
            </div>
          )}

          {/* Nav Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20"
          >
            <RiArrowLeftSLine className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20"
          >
            <RiArrowRightSLine className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === i ? 'w-4 bg-pink-500' : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Minimalist Single-Tone Quick Actions */}
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 pt-2">
          {quickPills.map((pill) => {
            const isButton = pill.href === '#';
            const Icon = pill.icon;
            const InnerContent = (
              <div className="flex flex-col items-center justify-center text-center group cursor-pointer w-full">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 mb-2 transition-all duration-200 group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-md border border-pink-100">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-700 group-hover:text-pink-700 leading-tight px-1">
                  {pill.label}
                </span>
              </div>
            );

            if (isButton) {
              return (
                <button
                  key={pill.label}
                  onClick={pill.onClick}
                  className="focus:outline-none"
                >
                  {InnerContent}
                </button>
              );
            }

            return (
              <Link
                key={pill.label}
                href={pill.href}
                className="focus:outline-none"
              >
                {InnerContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
