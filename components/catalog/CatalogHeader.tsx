'use client';

import React from 'react';
import { useFilterStore, CatalogFilterState } from '@/lib/store/useFilterStore';
import { LayoutGrid, List, ArrowUpDown } from 'lucide-react';

interface CatalogHeaderProps {
  totalCount: number;
}

export function CatalogHeader({ totalCount }: CatalogHeaderProps) {
  const { sortBy, setSortBy, viewMode, setViewMode, searchQuery, categorySlug } = useFilterStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-6">
      {/* Title & Count */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {searchQuery
            ? `Hasil Pencarian "${searchQuery}"`
            : categorySlug
            ? 'Katalog Produk Kategori'
            : 'Katalog Semua Produk'}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Menampilkan <strong>{totalCount}</strong> produk pilihan terbaik
        </p>
      </div>

      {/* Sort & View Mode */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Urutkan:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as CatalogFilterState['sortBy'])}
            className="h-9 px-3 text-xs font-bold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-xs cursor-pointer"
          >
            <option value="popular">Paling Populer / Terlaris</option>
            <option value="latest">Produk Terbaru</option>
            <option value="price_asc">Harga Terendah → Tertinggi</option>
            <option value="price_desc">Harga Tertinggi → Terendah</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-brand-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Tampilan Grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-brand-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Tampilan List"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
