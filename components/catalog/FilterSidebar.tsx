'use client';

import React from 'react';
import { mockCategories } from '@/lib/mock-data/categories';
import { useFilterStore } from '@/lib/store/useFilterStore';
import { formatRupiah } from '@/lib/utils/formatters';
import { RotateCcw, Star, ShieldCheck, Truck, MapPin } from 'lucide-react';

export function FilterSidebar() {
  const {
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

  const cities = ['Jakarta Pusat', 'Jakarta Barat', 'Jakarta Selatan', 'Bandung', 'Surabaya', 'Yogyakarta'];

  return (
    <aside className="w-full bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
          Filter Produk
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Categories Filter */}
      <div>
        <span className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider block mb-2.5">
          Kategori
        </span>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setCategorySlug('')}
            className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
              categorySlug === ''
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Semua Kategori
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategorySlug(cat.slug)}
              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors font-medium flex items-center justify-between ${
                categorySlug === cat.slug
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              <span className="text-[10px] text-slate-400 font-normal">({cat.itemCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider block mb-2.5">
          Rentang Harga (Rp)
        </span>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Harga Min"
              value={minPrice || ''}
              onChange={(e) => setPriceRange(Number(e.target.value) || 0, maxPrice)}
              className="w-full h-8 px-2.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              placeholder="Harga Maks"
              value={maxPrice || ''}
              onChange={(e) => setPriceRange(minPrice, Number(e.target.value) || 0)}
              className="w-full h-8 px-2.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Quick Price Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { label: '< 100rb', min: 0, max: 100000 },
              { label: '100rb - 500rb', min: 100000, max: 500000 },
              { label: '500rb - 2jt', min: 500000, max: 2000000 },
              { label: '> 2jt', min: 2000000, max: 0 },
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPriceRange(p.min, p.max)}
                className="text-[10px] bg-slate-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 font-medium transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Location Filter */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider block mb-2.5">
          Lokasi Pengiriman
        </span>
        <div className="space-y-1.5">
          {cities.map((city) => {
            const isChecked = selectedCities.includes(city);
            return (
              <label
                key={city}
                className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-brand-500 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCity(city)}
                  className="rounded text-brand-500 focus:ring-brand-500/20 w-3.5 h-3.5"
                />
                <span>{city}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Seller Type Filter */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider block mb-2.5">
          Jenis Toko
        </span>
        <div className="space-y-1.5">
          {[
            { value: '', label: 'Semua Penjual' },
            { value: 'official', label: 'Official Store Resmi' },
            { value: 'star', label: 'Star Seller' },
          ].map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-brand-500 transition-colors"
            >
              <input
                type="radio"
                name="sellerBadge"
                checked={sellerBadge === item.value}
                onChange={() => setSellerBadge(item.value)}
                className="text-brand-500 focus:ring-brand-500/20 w-3.5 h-3.5"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider block mb-2.5">
          Rating Minimum
        </span>
        <div className="space-y-1.5">
          {[
            { val: 0, label: 'Semua Rating' },
            { val: 4.8, label: '★ 4.8 ke atas' },
            { val: 4.5, label: '★ 4.5 ke atas' },
            { val: 4.0, label: '★ 4.0 ke atas' },
          ].map((r) => (
            <label
              key={r.val}
              className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-brand-500 transition-colors"
            >
              <input
                type="radio"
                name="minRating"
                checked={minRating === r.val}
                onChange={() => setMinRating(r.val)}
                className="text-brand-500 focus:ring-brand-500/20 w-3.5 h-3.5"
              />
              <span className="flex items-center gap-1 font-medium">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Free Shipping Toggle */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Bebas Ongkir Saja
            </span>
          </div>
          <input
            type="checkbox"
            checked={freeShippingOnly}
            onChange={(e) => setFreeShippingOnly(e.target.checked)}
            className="rounded text-brand-500 focus:ring-brand-500/20 w-4 h-4"
          />
        </label>
      </div>
    </aside>
  );
}
