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
      className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl z-40 animate-in fade-in duration-100"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-12 min-h-[360px]">
        {/* Left Column: 12 Category List */}
        <div className="col-span-4 border-r border-slate-100 py-3 pr-2 overflow-y-auto max-h-[400px]">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Semua Kategori
          </div>
          <div className="space-y-0.5">
            {mockCategories.map((cat) => {
              const isSelected = activeCategory.id === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  onMouseEnter={() => setActiveCategory(cat)}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                    isSelected
                      ? 'bg-pink-50 text-pink-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isSelected ? 'text-pink-600' : 'text-slate-400'}>
                      {getCategoryIcon(cat.iconName)}
                    </span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-pink-600' : 'text-slate-300'}`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Subcategories, Tags & Featured Visual */}
        <div className="col-span-8 p-5 flex flex-col justify-between">
          <div>
            {/* Category Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  {getCategoryIcon(activeCategory.iconName)}
                  {activeCategory.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeCategory.description}
                </p>
              </div>
              <Link
                href={`/categories/${activeCategory.slug}`}
                onClick={onClose}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
              >
                Lihat Semua ({activeCategory.itemCount}+ Produk)
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {activeCategory.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categories/${activeCategory.slug}?sub=${sub.slug}`}
                  onClick={onClose}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-pink-200 bg-slate-50/60 hover:bg-pink-50/40 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 hover:text-pink-600 transition-colors">
                      {sub.name}
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      {sub.itemCount} produk aktif
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </Link>
              ))}
            </div>

            {/* Popular Tags */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Populer di {activeCategory.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCategory.featuredTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?q=${encodeURIComponent(tag)}`}
                    onClick={onClose}
                    className="text-[11px] bg-slate-100 hover:bg-pink-50 text-slate-700 hover:text-pink-700 px-2.5 py-0.5 rounded-full transition-colors font-medium"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Banner Promo Strip */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 -mx-5 -mb-5 px-5 py-2.5 rounded-b-lg">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded overflow-hidden shrink-0 border border-slate-200">
                <Image
                  src={activeCategory.bannerImage}
                  alt={activeCategory.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Promo Kategori {activeCategory.name}
                </p>
                <p className="text-[11px] text-pink-600 font-semibold">
                  Diskon hingga 70% + Bebas Ongkir
                </p>
              </div>
            </div>
            <Link
              href={`/categories/${activeCategory.slug}`}
              onClick={onClose}
              className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
            >
              Belanja Kategori Ini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
