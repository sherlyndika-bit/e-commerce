'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Grid,
  ChevronDown,
  X,
  Store,
  ShieldCheck,
  Package,
  MapPin,
  Sparkles,
  LogOut,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { mockProducts } from '@/lib/mock-data/products';
import { mockCategories } from '@/lib/mock-data/categories';
import { formatRupiah } from '@/lib/utils/formatters';
import { MegaMenu } from './MegaMenu';
import { Badge } from '../ui/Badge';

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { items, getTotalItemsCount, getSelectedSubtotal } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { currentUser, isAuthenticated, logout } = useAuthStore();

  const totalCartCount = getTotalItemsCount();
  const totalWishlistCount = wishlistIds.length;

  // Filtered preview for live autocomplete
  const filteredProducts = searchQuery.trim()
    ? mockProducts
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
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
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

  const trendingKeywords = ['Headphone ANC', 'Boots Kulit Brodo', 'Serum Somethinc', 'Keychron K2', 'Kopi Arabika'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                CO
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  CO<span className="text-brand-500">inaja</span>
                  <span className="ml-1 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                </span>
                <span className="text-[9px] font-bold text-slate-400 -mt-1 hidden sm:block tracking-wider">
                  MARKETPLACE NUSANTARA
                </span>
              </div>
            </Link>

            {/* Category Button (Mega Menu Trigger) */}
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                isMegaMenuOpen
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Kategori</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Search Bar with Live Autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Cari gadget, fashion, skincare, kopi nusantara..."
                className="w-full h-11 pl-11 pr-24 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white dark:focus:bg-slate-850 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 h-8 rounded-full transition-all active:scale-95 shadow-xs"
              >
                Cari
              </button>
            </form>

            {/* Live Autocomplete Popup */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 p-4 animate-in fade-in slide-in-from-top-1 duration-150">
                {searchQuery.trim() ? (
                  <div>
                    {/* Categories match */}
                    {filteredCategories.length > 0 && (
                      <div className="mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Kategori Terkait
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {filteredCategories.map((c) => (
                            <Link
                              key={c.id}
                              href={`/categories/${c.slug}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="text-xs bg-slate-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 px-3 py-1 rounded-lg font-medium transition-colors"
                            >
                              📁 {c.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Products match */}
                    {filteredProducts.length > 0 ? (
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Produk Pilihan
                        </span>
                        <div className="space-y-2">
                          {filteredProducts.map((p) => (
                            <Link
                              key={p.id}
                              href={`/products/${p.slug}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                            >
                              <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                                <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-500">
                                  {p.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs font-bold text-brand-500">
                                    {formatRupiah(p.price)}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {p.sellerCity}
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-2">
                        Tekan <strong>Enter</strong> untuk mencari &quot;{searchQuery}&quot; di seluruh katalog
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    {/* Trending keywords */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <TrendingUp className="w-3.5 h-3.5 text-brand-500" />
                      Paling Sering Dicari
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingKeywords.map((kw) => (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => {
                            setSearchQuery(kw);
                            setIsSearchOpen(false);
                            router.push(`/products?q=${encodeURIComponent(kw)}`);
                          }}
                          className="text-xs bg-slate-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:hover:bg-brand-950 px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Wishlist, Cart, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Wishlist Button */}
            <Link
              href="/account?tab=wishlist"
              className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Wishlist Saya"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-scale-in">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Hover Preview */}
            <div
              className="relative"
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
            >
              <Link
                href="/cart"
                className="relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 text-slate-800 dark:text-slate-200 transition-all group font-bold text-xs"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-1 rounded-full bg-brand-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-bold">
                  {formatRupiah(getSelectedSubtotal())}
                </span>
              </Link>

              {/* Cart Flyout Hover Preview */}
              {isCartHovered && items.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Keranjang ({items.length} Barang)
                    </span>
                    <Link href="/cart" className="text-xs text-brand-500 font-bold hover:underline">
                      Lihat Semua
                    </Link>
                  </div>

                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                          <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {item.product.title}
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[11px] text-slate-400">
                              {item.quantity} x {formatRupiah(item.price)}
                            </span>
                            <span className="text-xs font-bold text-brand-500">
                              {formatRupiah(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href="/cart"
                      className="w-full block text-center bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs py-2 rounded-xl shadow-xs transition-colors"
                    >
                      Buka Keranjang & Checkout
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Account Menu */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-brand-300">
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-amber-500 font-extrabold flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      {currentUser.memberTier}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-500 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white px-3.5 py-1.5 rounded-xl transition-colors shadow-xs"
                  >
                    Daftar
                  </Link>
                </div>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && isAuthenticated && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-brand-400 shrink-0">
                        <Image src={currentUser.avatar} alt={currentUser.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                          💰 {formatRupiah(currentUser.coinBalance)} Koin
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Profil & Pengaturan</span>
                    </Link>

                    <Link
                      href="/account?tab=orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>Pesanan Saya</span>
                    </Link>

                    <Link
                      href="/account?tab=wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      <span>Wishlist</span>
                    </Link>

                    <Link
                      href="/account?tab=addresses"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>Alamat Tersimpan</span>
                    </Link>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    <Link
                      href="/seller"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>Seller Center</span>
                      </div>
                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Toko</span>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Portal</span>
                      </div>
                      <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded">Admin</span>
                    </Link>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 text-slate-500 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
    </header>
  );
}
