'use client';

import React from 'react';
import Link from 'next/link';
import { mockCategories } from '@/lib/mock-data/categories';
import { useToastStore } from '@/lib/store/useToastStore';
import { 
  RiSmartphoneFill,
  RiShirtFill,
  RiShoppingBag3Fill,
  RiSparkling2Fill,
  RiComputerFill,
  RiHomeSmile2Fill,
  RiRestaurant2Fill,
  RiTrophyFill,
  RiHeart3Fill,
  RiGamepadFill,
  RiCarFill,
  RiBookOpenFill
} from 'react-icons/ri';

export function CategoryExplorer() {
  const { addToast } = useToastStore();
  const getCategoryIcon = (iconName: string) => {
    // We map the mock data's iconName (which was designed for Lucide) to FontAwesome Solid icons
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Smartphone':
        return <RiSmartphoneFill {...props} />;
      case 'Shirt':
        return <RiShirtFill {...props} />;
      case 'ShoppingBag':
        return <RiShoppingBag3Fill {...props} />;
      case 'Sparkles':
        return <RiSparkling2Fill {...props} />;
      case 'Laptop':
        return <RiComputerFill {...props} />;
      case 'Home':
        return <RiHomeSmile2Fill {...props} />;
      case 'Utensils':
        return <RiRestaurant2Fill {...props} />;
      case 'Trophy':
        return <RiTrophyFill {...props} />;
      case 'Heart':
        return <RiHeart3Fill {...props} />;
      case 'Gamepad2':
        return <RiGamepadFill {...props} />;
      case 'Car':
        return <RiCarFill {...props} />;
      case 'BookOpen':
        return <RiBookOpenFill {...props} />;
      default:
        return <RiShoppingBag3Fill {...props} />;
    }
  };

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

        {/* Dense 12-Category Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-y-6 gap-x-2">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center hover:-translate-y-1 transition-transform duration-200 text-center"
            >
              <div className="relative w-[52px] h-[52px] rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mb-2 shadow-xs border border-pink-100 transition-all duration-200 group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500 group-hover:shadow-md">
                {getCategoryIcon(cat.iconName)}
                
                {cat.isPopular && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-sm z-10 border-[1.5px] border-white">
                    Hot
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-600 group-hover:text-pink-600 line-clamp-2 leading-tight px-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
