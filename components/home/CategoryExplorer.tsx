'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockCategories } from '@/lib/mock-data/categories';
import {
  Smartphone,
  Shirt,
  ShoppingBag,
  Sparkles,
  Laptop,
  Home,
  Utensils,
  Trophy,
  Heart,
  Gamepad2,
  Car,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export function CategoryExplorer() {
  const getCategoryIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone {...props} />;
      case 'Shirt':
        return <Shirt {...props} />;
      case 'ShoppingBag':
        return <ShoppingBag {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Laptop':
        return <Laptop {...props} />;
      case 'Home':
        return <Home {...props} />;
      case 'Utensils':
        return <Utensils {...props} />;
      case 'Trophy':
        return <Trophy {...props} />;
      case 'Heart':
        return <Heart {...props} />;
      case 'Gamepad2':
        return <Gamepad2 {...props} />;
      case 'Car':
        return <Car {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      default:
        return <ShoppingBag {...props} />;
    }
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-black text-brand-500 uppercase tracking-wider block">
              12 Kategori Marketplace Lengkap
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Jelajahi Berdasarkan Kebutuhanmu
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1 group"
          >
            Lihat Semua Produk
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 12-Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-800 shadow-subtle hover:shadow-elevated transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Category Icon & Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-xs">
                  {getCategoryIcon(cat.iconName)}
                </div>
                {cat.isPopular && (
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    Hot
                  </span>
                )}
              </div>

              {/* Title & Items Count */}
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {cat.itemCount}+ produk
                </p>
              </div>

              {/* Hover preview image strip */}
              <div className="mt-3 relative h-16 w-full rounded-lg overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
                <Image
                  src={cat.bannerImage}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
