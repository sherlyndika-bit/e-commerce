'use client';

import React, { useState } from 'react';
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
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState(mockCategories[0]);

  if (!isOpen) return null;

  const getCategoryIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4' };
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
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-12 min-h-[380px]">
        {/* Left Column: 12 Category List */}
        <div className="col-span-4 border-r border-slate-100 dark:border-slate-800 py-3 pr-2 overflow-y-auto max-h-[420px]">
          <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Semua Kategori Pilihan
          </div>
          <div className="space-y-0.5">
            {mockCategories.map((cat) => {
              const isSelected = activeCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveCategory(cat)}
                  onClick={() => {
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left ${
                    isSelected
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isSelected ? 'text-brand-500' : 'text-slate-400'}>
                      {getCategoryIcon(cat.iconName)}
                    </span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5 text-brand-500' : 'text-slate-300 dark:text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Subcategories, Tags & Featured Visual */}
        <div className="col-span-8 p-6 flex flex-col justify-between">
          <div>
            {/* Category Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  {getCategoryIcon(activeCategory.iconName)}
                  {activeCategory.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activeCategory.description}
                </p>
              </div>
              <Link
                href={`/categories/${activeCategory.slug}`}
                onClick={onClose}
                className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1 group"
              >
                Lihat Semua ({activeCategory.itemCount}+ Produk)
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {activeCategory.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categories/${activeCategory.slug}?sub=${sub.slug}`}
                  onClick={onClose}
                  className="group p-3 rounded-xl border border-slate-100 hover:border-brand-200 dark:border-slate-800 dark:hover:border-brand-900 bg-slate-50/50 hover:bg-brand-50/30 dark:bg-slate-850 dark:hover:bg-brand-950/20 transition-all flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {sub.name}
                    </h5>
                    <span className="text-xs text-slate-400">
                      {sub.itemCount} produk aktif
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            {/* Popular Tags */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Kata Kunci Populer:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeCategory.featuredTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?q=${encodeURIComponent(tag)}`}
                    onClick={onClose}
                    className="text-xs bg-slate-100 hover:bg-brand-100 text-slate-700 hover:text-brand-700 dark:bg-slate-800 dark:hover:bg-brand-950 dark:text-slate-300 dark:hover:text-brand-300 px-3 py-1 rounded-full transition-colors font-medium"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Banner Promo Strip */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={activeCategory.bannerImage}
                  alt={activeCategory.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Flash Sale Kategori {activeCategory.name}
                </p>
                <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">
                  Diskon hingga 70% + Gratis Ongkir
                </p>
              </div>
            </div>
            <Link
              href={`/categories/${activeCategory.slug}`}
              onClick={onClose}
              className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Belanja Kategori Ini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
