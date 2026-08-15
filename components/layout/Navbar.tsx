'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  Grid,
  ChevronDown,
  X,
  Store,
  Package,
  LogOut,
  Ticket,
  ShoppingBag,
  Bell,
  MessageCircle,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { useProductStore } from '@/lib/store/useProductStore';
import { useChatStore } from '@/lib/store/useChatStore';
import { mockCategories } from '@/lib/mock-data/categories';
import { formatRupiah } from '@/lib/utils/formatters';
import { MegaMenu } from './MegaMenu';
import { LuckySpinModal } from '../gamification/LuckySpinModal';
import { TopUpModal } from '../wallet/TopUpModal';

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isLuckySpinOpen, setIsLuckySpinOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { items, getTotalItemsCount } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { currentUser, isAuthenticated, logout } = useAuthStore();
  const { addToast } = useToastStore();
  const { products: allProducts } = useProductStore();
  const { toggleChat, getTotalUnreadCount } = useChatStore();

  const totalCartCount = getTotalItemsCount();
  const totalWishlistCount = wishlistIds.length;
  const totalChatUnread = getTotalUnreadCount();

  const filteredProducts = searchQuery.trim()
    ? allProducts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  const filteredCategories = searchQuery.trim()
    ? mockCategories
        .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const trendingKeywords = ['Headphone ANC', 'Boots Kulit Brodo', 'Serum Somethinc', 'Keychron K2', 'Kopi Arabika', 'Sepatu Sneakers'];

  return (
    <>
      {/* We wrap the header and mega menu in a sticky container so the mega menu positions correctly relative to it */}
      <div className="sticky top-0 z-50 w-full relative">
        <header className="bg-white border-b border-slate-200/90 shadow-2xs relative z-50 w-full">
          {/* TOP BAR */}
          <div className="bg-slate-50 border-b border-slate-200/60 hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-7 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-4">
                <button onClick={() => addToast({ title: 'Tentang TumbasCO', description: 'Fitur halaman perusahaan sedang dikembangkan.', type: 'info' })} className="hover:text-pink-600 transition-colors">Tentang TumbasCO</button>
                <span className="text-slate-300">|</span>
                <Link href="/auth/register" className="hover:text-pink-600 transition-colors flex items-center gap-1"><Store className="w-3 h-3 text-pink-600"/> Mulai Berjualan</Link>
                <span className="text-slate-300">|</span>
                <button onClick={() => addToast({ title: 'Download App', description: 'Aplikasi mobile akan segera rilis di Play Store & App Store.', type: 'info' })} className="hover:text-pink-600 transition-colors">Download App</button>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/vouchers" className="hover:text-pink-600 transition-colors">Promo & Voucher</Link>
                <span className="text-slate-300">|</span>
                <button onClick={() => addToast({ title: 'TumbasCO Care', description: 'Customer service kami siap membantu Anda 24/7.', type: 'info' })} className="hover:text-pink-600 transition-colors">TumbasCO Care</button>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">🇮🇩 IDR</span>
              </div>
            </div>
          </div>

          {/* MAIN NAVIGATION HEADER */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between gap-4 sm:gap-6">
              {/* 1. Logo & Kategori Button */}
              <div className="flex items-center gap-3 shrink-0">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center text-white shadow-2xs">
                    <ShoppingBag className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight text-pink-600">
                      TumbasCO
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-pink-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Kategori</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* 2. Search Bar & Trending Keywords */}
              <div className="flex-1 max-w-3xl relative flex flex-col gap-1" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative flex w-full h-9 border border-slate-300 focus-within:border-pink-600 rounded-md overflow-hidden bg-white transition-colors">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Cari barang, brand, atau kategori di TumbasCO..."
                    className="w-full h-full pl-3 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button type="submit" className="w-10 bg-pink-600 hover:bg-pink-700 flex items-center justify-center transition-colors">
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </form>

                <div className="hidden md:flex items-center gap-2.5 text-[10px] text-slate-500 whitespace-nowrap overflow-x-auto no-scrollbar">
                  {trendingKeywords.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => { setSearchQuery(kw); setIsSearchOpen(false); router.push(`/products?q=${encodeURIComponent(kw)}`); }}
                      className="hover:text-pink-600 transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>

                {/* Autocomplete Popup */}
                {isSearchOpen && (
                  <div className="absolute top-10 left-0 w-full bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-[60] p-3 animate-in fade-in duration-100">
                    {searchQuery.trim() ? (
                      <div>
                        {filteredCategories.length > 0 && (
                          <div className="mb-2 pb-2 border-b border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Kategori Terkait</span>
                            <div className="flex flex-wrap gap-1">
                              {filteredCategories.map((c) => (
                                <Link key={c.id} href={`/categories/${c.slug}`} onClick={() => setIsSearchOpen(false)} className="text-[11px] bg-slate-50 hover:bg-pink-50 hover:text-pink-600 px-2 py-0.5 rounded font-medium transition-colors">
                                  {c.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        {filteredProducts.length > 0 ? (
                          <div>
                            <div className="space-y-1">
                              {filteredProducts.map((p) => (
                                <Link key={p.id} href={`/products/${p.slug}`} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-2.5 p-1 rounded hover:bg-slate-50 transition-colors group">
                                  <Image src={p.images[0]} alt={p.title} width={32} height={32} className="rounded object-cover border border-slate-100" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-800 truncate group-hover:text-pink-600">{p.title}</p>
                                    <span className="text-xs font-bold text-pink-600">{formatRupiah(p.price)}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                           <p className="text-xs text-slate-500 p-2">Tekan Enter untuk mencari &quot;{searchQuery}&quot;</p>
                        )}
                      </div>
                    ) : (
                      <div>
                         <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Pencarian Populer</span>
                         <div className="flex flex-wrap gap-1.5">
                           {trendingKeywords.map((kw) => (
                             <button key={kw} onClick={() => { setSearchQuery(kw); setIsSearchOpen(false); router.push(`/products?q=${encodeURIComponent(kw)}`); }} className="text-xs bg-slate-50 hover:bg-pink-50 hover:text-pink-600 px-2.5 py-1 rounded-full text-slate-600 transition-colors">
                               {kw}
                             </button>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Right Action Icons & User Profile */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {/* Chat button - Visible on mobile & desktop */}
                <button
                  onClick={toggleChat}
                  className="relative p-1.5 text-slate-700 hover:text-pink-600 transition-colors flex items-center cursor-pointer"
                  title="TumbasChat Penjual"
                >
                  <MessageCircle className="w-5 h-5" />
                  {totalChatUnread > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-pink-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                      {totalChatUnread}
                    </span>
                  )}
                </button>

                {/* Wishlist - Hidden on mobile because it is in the MobileNav bottom bar */}
                <Link href="/account?tab=wishlist" className="relative p-1.5 text-slate-600 hover:text-pink-600 transition-colors hidden md:flex">
                  <Heart className="w-5 h-5" />
                  {totalWishlistCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                      {totalWishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart button */}
                <div className="relative" onMouseEnter={() => setIsCartHovered(true)} onMouseLeave={() => setIsCartHovered(false)}>
                  <Link href="/cart" className="relative p-1.5 text-slate-700 hover:text-pink-600 transition-colors flex items-center">
                    <ShoppingCart className="w-5 h-5" />
                    {totalCartCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-0.5 rounded-full bg-pink-600 text-white text-[9px] font-black flex items-center justify-center">
                        {totalCartCount}
                      </span>
                    )}
                  </Link>

                  {isCartHovered && items.length > 0 && (
                    <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in duration-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Keranjang Belanja</p>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-2.5 py-1">
                            <Image src={item.product.images[0]} alt={item.product.title} width={36} height={36} className="rounded border border-slate-100 object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">{item.product.title}</p>
                              <span className="text-xs font-bold text-pink-600">{formatRupiah(item.product.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2.5 mt-2 border-t border-slate-100 flex justify-between items-center">
                         <span className="text-xs text-slate-500">{items.length} Barang</span>
                         <Link href="/cart" className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded text-xs font-bold transition-colors">Lihat Keranjang</Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-5 w-px bg-slate-200" />

                <div ref={userMenuRef} className="relative flex items-center">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                       <div className="relative w-7 h-7 rounded-full border border-slate-200 overflow-hidden">
                         <Image src={currentUser.avatar} alt="User" fill className="object-cover" />
                       </div>
                       <div className="hidden lg:flex flex-col text-left">
                         <span className="text-xs font-bold text-slate-800 flex items-center gap-0.5">
                           {currentUser.name.split(' ')[0]} <ChevronDown className="w-3 h-3 text-slate-400" />
                         </span>
                       </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link href="/auth/login" className="px-2.5 py-1 text-xs font-bold text-pink-600 hover:bg-pink-50 rounded border border-pink-600 transition-colors">Masuk</Link>
                      <Link href="/auth/register" className="px-2.5 py-1 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded transition-colors">Daftar</Link>
                    </div>
                  )}

                  {isUserMenuOpen && isAuthenticated && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50">
                      <div className="p-2 border-b border-slate-100 mb-1 flex items-center gap-2.5">
                         <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-sm">🪙</div>
                         <div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">Saldo Koin</p>
                           <p className="text-xs font-black text-amber-600">{formatRupiah(currentUser.coinBalance)}</p>
                         </div>
                      </div>
                      <div className="space-y-0.5 text-xs font-medium">
                        <Link href="/account?tab=orders" className="flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-700 hover:bg-slate-50"><Package className="w-3.5 h-3.5 text-slate-400" /> Pesanan Saya</Link>
                        <Link href="/vouchers" className="flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-700 hover:bg-slate-50"><Ticket className="w-3.5 h-3.5 text-pink-600" /> Pusat Voucher</Link>
                        <Link href="/seller" className="flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-700 hover:bg-slate-50"><Store className="w-3.5 h-3.5 text-pink-600" /> Toko Saya</Link>
                        <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-rose-600 hover:bg-rose-50 text-left"><LogOut className="w-3.5 h-3.5" /> Keluar</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mega Menu Dropdown */}
        <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
      </div>

      {/* Interactive Modals */}
      <LuckySpinModal isOpen={isLuckySpinOpen} onClose={() => setIsLuckySpinOpen(false)} />
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </>
  );
}
