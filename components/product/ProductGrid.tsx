'use client';

import React from 'react';
import { Product } from '@/lib/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  columns?: 3 | 4 | 5;
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = 'Belum ada produk yang sesuai dengan filter.',
  columns = 4,
}: ProductGridProps) {
  const columnClasses = {
    3: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  };

  if (isLoading) {
    return (
      <div className={`grid ${columnClasses[columns]} gap-3 sm:gap-4 lg:gap-5`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 animate-pulse flex flex-col justify-between h-[340px]"
          >
            <div>
              <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-xl mb-3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-500 text-3xl flex items-center justify-center mx-auto mb-4">
          🔍
        </div>
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
          Produk Tidak Ditemukan
        </h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${columnClasses[columns]} gap-3 sm:gap-4 lg:gap-5`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
