'use client';

import React from 'react';
import Link from 'next/link';
import { mockCategories } from '@/lib/mock-data/categories';
import { useToastStore } from '@/lib/store/useToastStore';


export function CategoryExplorer() {
  const { addToast } = useToastStore();


  return (
    <section className="py-4 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
            Kategori Pilihan
          </h2>
          <Link 
            href="/categories"
            className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Balanced Category List - Tight & Centered */}
        <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 lg:gap-x-12 gap-y-8 px-2 max-w-5xl mx-auto">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center hover:-translate-y-1 transition-transform duration-200 text-center w-[72px] sm:w-[80px]"
            >
              <div className="relative w-[72px] h-[72px] rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mb-3 shadow-xs border border-pink-100 transition-all duration-200 group-hover:border-pink-300 group-hover:shadow-md shrink-0 p-2">
                <img src={cat.imageIcon} alt={cat.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                
                {cat.isPopular && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm z-10 border-[1.5px] border-white">
                    Hot
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-pink-600 line-clamp-2 leading-tight px-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
