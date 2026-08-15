'use client';

import React, { useState } from 'react';
import { useProductStore } from '@/lib/store/useProductStore';
import { ProductGrid } from '../product/ProductGrid';

export function DiscoveryFeed() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'discount' | 'free_shipping'>('all');
  const [visibleCount, setVisibleCount] = useState(12);

  const { products: allProducts } = useProductStore();

  const getFilteredProducts = () => {
    let list = [...allProducts];
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
    <section className="sm:py-2.5 bg-slate-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-4 bg-pink-600 rounded-full" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Rekomendasi Untukmu
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full no-scrollbar">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-pink-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Semua
            </button>

            <button
              onClick={() => setActiveFilter('popular')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === 'popular'
                  ? 'bg-pink-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Terlaris
            </button>

            <button
              onClick={() => setActiveFilter('discount')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === 'discount'
                  ? 'bg-pink-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Diskon Terbesar
            </button>

            <button
              onClick={() => setActiveFilter('free_shipping')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === 'free_shipping'
                  ? 'bg-pink-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Bebas Ongkir
            </button>
          </div>
        </div>

        {/* Product Grid - 6 columns */}
        <ProductGrid products={visibleProducts} columns={6} />

        {/* Load More Button */}
        {visibleCount < filteredProducts.length && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-2 rounded border border-pink-600 text-pink-600 font-bold text-xs hover:bg-pink-50 transition-colors bg-white shadow-2xs"
            >
              Muat Lebih Banyak Produk
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
