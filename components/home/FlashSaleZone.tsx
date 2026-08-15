'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowRight } from 'lucide-react';
import { useProductStore } from '@/lib/store/useProductStore';
import { formatRupiah, formatDiscount } from '@/lib/utils/formatters';

export function FlashSaleZone() {
  const { products: allProducts } = useProductStore();
  
  // Ambil beberapa produk untuk flash sale dari Zustand store
  const flashSaleProducts = allProducts.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 6);

  // Live countdown timer
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

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <section id="flash-sale" className="sm:py-2.5 bg-slate-50">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="bg-white border-y sm:border border-slate-200/90 sm:rounded-xl overflow-hidden shadow-none sm:shadow-2xs">
          {/* Header Row with Countdown */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-gradient-to-r from-amber-50 to-white border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <h2 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-tight">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                Kejar Diskon Spesial
              </h2>
              
              {/* Digital Countdown Box */}
              <div className="flex items-center gap-1 font-mono font-bold text-xs text-white">
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">{padZero(timeLeft.hours)}</span>
                <span className="text-slate-800 font-bold">:</span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">{padZero(timeLeft.minutes)}</span>
                <span className="text-slate-800 font-bold">:</span>
                <span className="bg-rose-600 px-1.5 py-0.5 rounded text-[11px]">{padZero(timeLeft.seconds)}</span>
              </div>
            </div>
            
            <Link href="/products?sort=popular" className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Flash Sale Dense 6-Column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-100 bg-white">
            {flashSaleProducts.slice(0, 6).map((product) => {
              const discount = product.originalPrice ? formatDiscount(product.originalPrice, product.price) : product.flashSaleDiscount || 20;
              const totalStock = (product.flashSaleStock || 20) + (product.flashSaleSold || 10);
              const soldPercentage = Math.round(((product.flashSaleSold || 10) / totalStock) * 100);

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group flex flex-col p-2.5 sm:p-3 text-slate-900 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="relative aspect-square w-full rounded overflow-hidden bg-slate-50 mb-2 border border-slate-100">
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-0 right-0 bg-rose-600 text-white font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-bl">
                      {discount}%
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[11px] font-medium text-slate-800 line-clamp-1 group-hover:text-pink-600 mb-1">
                        {product.title}
                      </h3>
                      <span className="text-xs sm:text-sm font-black text-pink-600 block">
                        {formatRupiah(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through block">
                          {formatRupiah(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="mt-2 relative w-full h-3 bg-slate-100 rounded-full overflow-hidden flex items-center justify-center">
                      <div className="absolute top-0 left-0 h-full bg-rose-500 rounded-full" style={{ width: `${soldPercentage}%` }} />
                      <span className="relative z-10 text-[8px] font-bold text-white uppercase tracking-wider drop-shadow-2xs">
                        Terjual {product.flashSaleSold || 10}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
