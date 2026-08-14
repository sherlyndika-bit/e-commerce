'use client';

import React from 'react';
import { useFilterStore } from '@/lib/store/useFilterStore';
import { mockCategories } from '@/lib/mock-data/categories';
import { formatRupiah } from '@/lib/utils/formatters';
import { X, RotateCcw } from 'lucide-react';

export function ActiveFilterChips() {
  const {
    searchQuery,
    setSearchQuery,
    categorySlug,
    setCategorySlug,
    minPrice,
    maxPrice,
    setPriceRange,
    minRating,
    setMinRating,
    selectedCities,
    toggleCity,
    sellerBadge,
    setSellerBadge,
    freeShippingOnly,
    setFreeShippingOnly,
    resetFilters,
  } = useFilterStore();

  const activeCategory = mockCategories.find((c) => c.slug === categorySlug);

  const hasAnyFilter =
    Boolean(searchQuery) ||
    Boolean(categorySlug) ||
    minPrice > 0 ||
    maxPrice > 0 ||
    minRating > 0 ||
    selectedCities.length > 0 ||
    Boolean(sellerBadge) ||
    freeShippingOnly;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Filter Aktif:
      </span>

      {searchQuery && (
        <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200">
          Cari: &quot;{searchQuery}&quot;
          <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-rose-500">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {activeCategory && (
        <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200">
          Kategori: {activeCategory.name}
          <button onClick={() => setCategorySlug('')} className="text-slate-400 hover:text-rose-500">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {(minPrice > 0 || maxPrice > 0) && (
        <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200">
          Harga: {minPrice > 0 ? formatRupiah(minPrice) : 'Rp0'} - {maxPrice > 0 ? formatRupiah(maxPrice) : 'Maks'}
          <button onClick={() => setPriceRange(0, 0)} className="text-slate-400 hover:text-rose-500">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {minRating > 0 && (
        <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200">
          Rating ≥ {minRating}★
          <button onClick={() => setMinRating(0)} className="text-slate-400 hover:text-rose-500">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {selectedCities.map((city) => (
        <span
          key={city}
          className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
        >
          {city}
          <button onClick={() => toggleCity(city)} className="text-slate-400 hover:text-rose-500">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {sellerBadge && (
        <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200">
          Toko: {sellerBadge === 'official' ? 'Official Store' : 'Star Seller'}
          <button onClick={() => setSellerBadge('')} className="text-slate-400 hover:text-rose-500">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {freeShippingOnly && (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg text-xs font-medium">
          🚚 Bebas Ongkir
          <button onClick={() => setFreeShippingOnly(false)} className="text-emerald-500 hover:text-rose-500">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        onClick={resetFilters}
        className="text-xs font-bold text-rose-500 hover:text-rose-600 underline ml-auto transition-colors"
      >
        Hapus Semua
      </button>
    </div>
  );
}
