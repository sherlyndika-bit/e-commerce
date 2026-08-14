'use client';

import React from 'react';
import { Product } from '@/lib/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  columns?: 3 | 4 | 5 | 6;
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = 'Belum ada produk yang sesuai dengan filter.',
  columns = 6,
}: ProductGridProps) {
  const columnClasses = {
    3: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
  };

  if (isLoading) {
    return (
      <div className={`grid ${columnClasses[columns]} gap-2 sm:gap-2.5`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-slate-200 p-2.5 animate-pulse flex flex-col justify-between h-[280px]"
          >
            <div>
              <div className="aspect-square bg-slate-100 rounded mb-2" />
              <div className="h-3 bg-slate-100 rounded w-3/4 mb-1.5" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-1" />
            </div>
            <div className="h-4 bg-slate-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-lg border border-slate-200 p-6 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 text-2xl flex items-center justify-center mx-auto mb-3">
          🔍
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1">
          Produk Tidak Ditemukan
        </h4>
        <p className="text-xs text-slate-500">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${columnClasses[columns]} gap-2 sm:gap-2.5`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
