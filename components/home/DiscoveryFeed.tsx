'use client';

import React, { useState } from 'react';
import { mockProducts } from '@/lib/mock-data/products';
import { ProductGrid } from '../product/ProductGrid';
import { Sparkles, Flame, Percent, Truck } from 'lucide-react';
import { Button } from '../ui/Button';

export function DiscoveryFeed() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'discount' | 'free_shipping'>('all');
  const [visibleCount, setVisibleCount] = useState(8);

  const getFilteredProducts = () => {
    let list = [...mockProducts];
    if (activeFilter === 'popular') {
      list = list.sort((a, b) => b.soldCount - a.soldCount);
    } else if (activeFilter === 'discount') {
      list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    } else if (activeFilter === 'free_shipping') {
      list = list.filter((p) => p.badges.includes('gratis_ongkir'));
    }
    return list;
  };

  const filteredProducts = getFilteredProducts();
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-black text-brand-500 uppercase tracking-wider block">
              ✨ Rekomendasi Pilihan Buat Kamu
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Temukan Produk Terbaik Hari Ini
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'all'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Semua Rekomendasi
            </button>

            <button
              onClick={() => setActiveFilter('popular')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'popular'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Paling Laris
            </button>

            <button
              onClick={() => setActiveFilter('discount')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'discount'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-rose-500" />
              Diskon Terbesar
            </button>

            <button
              onClick={() => setActiveFilter('free_shipping')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'free_shipping'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-500" />
              Bebas Ongkir
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={visibleProducts} columns={4} />

        {/* Load More Button */}
        {visibleCount < filteredProducts.length && (
          <div className="mt-10 text-center">
            <Button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              variant="outline"
              size="md"
              className="px-8 font-bold border-brand-300 hover:border-brand-500 text-brand-600 dark:text-brand-400"
            >
              Muat Lebih Banyak Produk ({filteredProducts.length - visibleCount} lagi)
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
