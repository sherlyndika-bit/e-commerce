'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';

export function MobileNav() {
  const pathname = usePathname();
  const { getTotalItemsCount } = useCartStore();
  const { wishlistIds } = useWishlistStore();

  const totalCart = getTotalItemsCount();
  const totalWishlist = wishlistIds.length;

  const navItems = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Katalog', href: '/products', icon: Grid },
    { label: 'Wishlist', href: '/account?tab=wishlist', icon: Heart, badge: totalWishlist },
    { label: 'Keranjang', href: '/cart', icon: ShoppingBag, badge: totalCart },
    { label: 'Akun', href: '/account', icon: User },
  ];

  return (
    <div 
      className="lg:hidden fixed bottom-0 left-0 w-full z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pt-1.5 px-3 shadow-lg"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.375rem)' }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-pink-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-pink-600 text-white text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
