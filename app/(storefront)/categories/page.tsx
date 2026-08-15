import React from 'react';
import Link from 'next/link';
import { mockCategories } from '@/lib/mock-data/categories';
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
import { ChevronRight } from 'lucide-react';

export default function AllCategoriesPage() {
  const getCategoryIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Smartphone': return <RiSmartphoneFill {...props} />;
      case 'Shirt': return <RiShirtFill {...props} />;
      case 'ShoppingBag': return <RiShoppingBag3Fill {...props} />;
      case 'Sparkles': return <RiSparkling2Fill {...props} />;
      case 'Laptop': return <RiComputerFill {...props} />;
      case 'Home': return <RiHomeSmile2Fill {...props} />;
      case 'Utensils': return <RiRestaurant2Fill {...props} />;
      case 'Trophy': return <RiTrophyFill {...props} />;
      case 'Heart': return <RiHeart3Fill {...props} />;
      case 'Gamepad2': return <RiGamepadFill {...props} />;
      case 'Car': return <RiCarFill {...props} />;
      case 'BookOpen': return <RiBookOpenFill {...props} />;
      default: return <RiShoppingBag3Fill {...props} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-pink-600">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-slate-800">Semua Kategori</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kategori Belanja</h1>
          <p className="text-sm text-slate-500 mt-1">Jelajahi semua kategori produk di TumbasCO</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockCategories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden group hover:border-pink-300 hover:shadow-md transition-all">
              {/* Category Header Link */}
              <Link 
                href={`/categories/${cat.slug}`}
                className="flex items-center gap-4 p-4 border-b border-slate-100 bg-slate-50 group-hover:bg-pink-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white text-pink-500 flex items-center justify-center shadow-xs border border-pink-100 group-hover:bg-pink-500 group-hover:text-white transition-all">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-pink-700 truncate">{cat.name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{cat.description}</p>
                </div>
              </Link>
              
              {/* Subcategories */}
              <div className="p-4 space-y-3">
                {cat.subcategories.map((sub) => (
                  <Link 
                    key={sub.id} 
                    href={`/categories/${cat.slug}?sub=${sub.slug}`}
                    className="flex items-center justify-between text-xs text-slate-600 hover:text-pink-600 transition-colors"
                  >
                    <span className="font-medium truncate pr-2">{sub.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full shrink-0">
                      {sub.itemCount}
                    </span>
                  </Link>
                ))}
                
                <Link 
                  href={`/categories/${cat.slug}`}
                  className="block pt-2 mt-2 border-t border-slate-100 text-xs font-bold text-pink-600 hover:text-pink-700 text-center"
                >
                  Lihat Semua {cat.name} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
