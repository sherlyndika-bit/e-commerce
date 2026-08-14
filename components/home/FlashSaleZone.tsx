'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Flame, ArrowRight, ShoppingBag, Clock } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data/products';
import { formatRupiah, formatDiscount } from '@/lib/utils/formatters';
import { useCartStore } from '@/lib/store/useCartStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { Badge } from '../ui/Badge';

export function FlashSaleZone() {
  const flashSaleProducts = mockProducts.filter((p) => p.isFlashSale);

  // Live countdown timer: ends in 5 hours, 28 mins, 45 secs from now
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 28,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const handleQuickAdd = (product: typeof flashSaleProducts[0]) => {
    addItem(product, 1);
    addToast({
      title: 'Diskon Kilat Berhasil Masuk! ⚡',
      description: `${product.title} telah masuk ke keranjangmu.`,
      type: 'success',
    });
  };

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <section id="flash-sale" className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-600 via-brand-500 to-rose-600 rounded-3xl p-5 sm:p-8 text-white shadow-xl overflow-hidden relative">
          {/* Ambient Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

          {/* Header Row with Countdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/20 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white text-brand-600 shadow-md">
                <Zap className="w-6 h-6 fill-current animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5">
                    FLASH SALE KILAT
                    <Flame className="w-5 h-5 text-amber-300 animate-bounce" />
                  </h2>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Sesi Pagi
                  </span>
                </div>
                <p className="text-xs text-white/85">
                  Produk brand pilihan dengan potongan harga terbesar, stok terbatas!
                </p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-3 bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Clock className="w-4 h-4" />
                <span>Berakhir Dalam:</span>
              </div>
              <div className="flex items-center gap-1 font-mono font-black text-sm text-slate-950">
                <span className="bg-white px-2 py-1 rounded-lg">{padZero(timeLeft.hours)}</span>
                <span className="text-white font-bold">:</span>
                <span className="bg-white px-2 py-1 rounded-lg">{padZero(timeLeft.minutes)}</span>
                <span className="text-white font-bold">:</span>
                <span className="bg-amber-400 px-2 py-1 rounded-lg">{padZero(timeLeft.seconds)}</span>
              </div>
            </div>
          </div>

          {/* Flash Sale Product Cards Slider / Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 relative z-10">
            {flashSaleProducts.map((product) => {
              const discount = product.originalPrice
                ? formatDiscount(product.originalPrice, product.price)
                : product.flashSaleDiscount || 20;

              const totalStock = (product.flashSaleStock || 20) + (product.flashSaleSold || 10);
              const soldPercentage = Math.round(((product.flashSaleSold || 10) / totalStock) * 100);

              return (
                <div
                  key={product.id}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl p-3 text-slate-900 dark:text-white shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    {/* Image with discount badge */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2.5">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-brand-500 text-white font-black text-[11px] px-2 py-0.5 rounded-md shadow-md">
                        -{discount}%
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3
                      className="text-xs font-bold line-clamp-2 leading-snug hover:text-brand-500 transition-colors mb-2 min-h-8"
                      title={product.title}
                    >
                      {product.title}
                    </h3>
                  </Link>

                  <div>
                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 flex-wrap mb-2">
                      <span className="text-sm sm:text-base font-black text-brand-500">
                        {formatRupiah(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                          {formatRupiah(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="mb-2.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        <span className="text-brand-600 dark:text-brand-400">🔥 Terjual {product.flashSaleSold || 10}</span>
                        <span>Sisa {product.flashSaleStock || 5}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-brand-500 rounded-full transition-all"
                          style={{ width: `${soldPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="w-full h-8 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Bungkus Kilat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner Footer */}
          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between relative z-10 text-xs">
            <span className="font-semibold text-white/90">
              Jangan sampai kehabisan! Flash sale berikutnya mulai pukul 18:00 WIB.
            </span>
            <Link
              href="/products?sort=popular"
              className="text-white hover:text-amber-200 font-extrabold flex items-center gap-1 transition-colors"
            >
              Lihat Semua Diskon Kilat
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
