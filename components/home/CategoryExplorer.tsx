'use client';

import React from 'react';
import Link from 'next/link';
import { mockCategories } from '@/lib/mock-data/categories';
import { useToastStore } from '@/lib/store/useToastStore';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CategoryExplorer() {
  const { addToast } = useToastStore();

  return (
    <section className="sm:py-2.5 bg-slate-50">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="bg-white sm:rounded-xl border-y sm:border border-slate-200/90 shadow-none sm:shadow-2xs p-3.5 sm:p-5">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-pink-600 rounded-full" />
              <h2 className="text-sm sm:text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                Kategori Pilihan
              </h2>
            </div>
            <Link 
              href="/categories"
              className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 group"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Balanced Category Grid - Strict 6-col on Desktop, 4-col on Mobile */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-6 gap-x-2 sm:gap-x-4 lg:gap-x-6 gap-y-4 sm:gap-y-5 justify-items-center">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center hover:-translate-y-1 transition-transform duration-200 text-center w-full max-w-[90px]"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mb-2 border border-pink-100/90 transition-all duration-200 group-hover:border-pink-300 group-hover:bg-pink-100/60 shrink-0 p-2 shadow-2xs">
                  <img
                    src={cat.imageIcon}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {cat.isPopular && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full shadow-xs z-10 border border-white">
                      Hot
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-700 group-hover:text-pink-600 line-clamp-2 leading-tight px-0.5">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
