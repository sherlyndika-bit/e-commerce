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
  RiArrowRightSLine,
  RiGiftFill,
  RiSparklingFill
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
    <section className="bg-slate-50 pt-0 sm:pt-2 pb-0">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Desktop Bento Hero Grid: 8 Cols Main Slider + 4 Cols Side Promos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-3">
          {/* Main Banner Slider (Cols 12 on mobile, Cols 8 on desktop) */}
          <div className="lg:col-span-8 relative h-48 sm:h-64 lg:h-[300px] rounded-none sm:rounded-xl overflow-hidden group shadow-none sm:shadow-2xs bg-slate-900">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                  </div>

                  {/* Text content */}
                  <div className="relative z-10 p-4 sm:p-7 max-w-lg">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="bg-pink-600 text-white font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded shadow-2xs">
                        {slide.tag}
                      </span>
                      <span className="bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded shadow-2xs">
                        {slide.badge}
                      </span>
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-[26px] font-black tracking-tight leading-snug mb-1.5 drop-shadow-sm">
                      {slide.title}
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-200 mb-3 max-w-md line-clamp-2 leading-relaxed">
                      {slide.description}
                    </p>
                    <Link href={slide.ctaLink}>
                      <button className="bg-pink-600 hover:bg-pink-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer">
                        {slide.ctaText} →
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className={`absolute inset-0 ${heroSlides[0].bgGradient} flex items-center text-white`}>
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={heroSlides[0].image}
                    alt={heroSlides[0].title}
                    fill
                    className="object-cover opacity-60"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                </div>
                <div className="relative z-10 p-4 sm:p-7 max-w-lg">
                  <span className="bg-pink-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded">
                    {heroSlides[0].tag}
                  </span>
                  <h1 className="text-lg sm:text-2xl font-black mt-2 mb-1">
                    {heroSlides[0].title}
                  </h1>
                </div>
              </div>
            )}

            {/* Nav Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20 cursor-pointer"
            >
              <RiArrowLeftSLine className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20 cursor-pointer"
            >
              <RiArrowRightSLine className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === i ? 'w-4 bg-pink-500' : 'w-1.5 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Stacked Promos (Hidden on mobile, Shown on desktop to make the screen rich & active) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-2.5">
            {/* Promo Card 1 */}
            <Link
              href="/vouchers"
              className="relative h-[145px] rounded-xl overflow-hidden bg-gradient-to-br from-pink-900 to-rose-950 p-4 text-white flex flex-col justify-between group shadow-2xs border border-pink-900/40 hover:border-pink-500 transition-colors"
            >
              <div className="absolute right-0 top-0 w-36 h-full opacity-30 group-hover:scale-110 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400&auto=format&fit=crop"
                  alt="Voucher"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow-2xs mb-1">
                  <RiGiftFill className="w-3 h-3" /> VOUCHER PENGGUNA BARU
                </span>
                <h3 className="font-black text-sm text-white leading-tight">
                  Klaim Diskon Rp50.000 + 10.000 Koin
                </h3>
                <p className="text-[11px] text-pink-200 mt-0.5">
                  Khusus transaksi pertama di TumbasCO
                </p>
              </div>
              <span className="relative z-10 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 group-hover:text-amber-200">
                Klaim Sekarang →
              </span>
            </Link>

            {/* Promo Card 2 */}
            <Link
              href="/products?free_shipping=true"
              className="relative h-[145px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 p-4 text-white flex flex-col justify-between group shadow-2xs border border-slate-800 hover:border-indigo-500 transition-colors"
            >
              <div className="absolute right-0 top-0 w-36 h-full opacity-30 group-hover:scale-110 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400&auto=format&fit=crop"
                  alt="Bebas Ongkir"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1 bg-pink-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-2xs mb-1">
                  <RiTruckFill className="w-3 h-3" /> BEBAS ONGKIR XTRA
                </span>
                <h3 className="font-black text-sm text-white leading-tight">
                  Gratis Ongkos Kirim Se-Indonesia
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Tanpa minimum belanja ke seluruh pelosok
                </p>
              </div>
              <span className="relative z-10 inline-flex items-center gap-1 text-[11px] font-bold text-pink-300 group-hover:text-pink-200">
                Belanja Sekarang →
              </span>
            </Link>
          </div>
        </div>

        {/* Compact Quick Actions Strip */}
        <div className="mt-0 sm:mt-2.5 mx-0 bg-white sm:rounded-xl border-y sm:border border-slate-200/90 shadow-none sm:shadow-2xs p-2.5 sm:p-3">
          <div className="flex justify-between sm:justify-center sm:gap-16 lg:gap-24 px-2 sm:px-0">
            {quickPills.map((pill) => {
              const isButton = pill.href === '#';
              const Icon = pill.icon;
              const InnerContent = (
                <div className="flex flex-col items-center justify-center text-center group cursor-pointer w-full py-1">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-1.5 transition-all duration-200 group-hover:bg-pink-600 group-hover:text-white group-hover:scale-105 border border-pink-100/80 shadow-2xs">
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-700 group-hover:text-pink-600 leading-tight truncate max-w-full px-0.5">
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
      </div>
    </section>
  );
}
