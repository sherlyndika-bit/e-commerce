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
  Ticket,
  PlusCircle,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { mockProducts } from '@/lib/mock-data/products';
import { mockCategories } from '@/lib/mock-data/categories';
import { formatRupiah } from '@/lib/utils/formatters';
import { MegaMenu } from './MegaMenu';
import { Badge } from '../ui/Badge';
import { ThemeToggle } from '../ui/ThemeToggle';
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

  // Close popups on click outside
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

  const trendingKeywords = ['Headphone ANC', 'Boots Kulit Brodo', 'Serum Somethinc', 'Keychron K2', 'Kopi Arabika'];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
            {/* Distinctive Logo Brand */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-elevated group-hover:scale-105 transition-transform border border-white/20 relative overflow-hidden">
                  <span className="relative z-10 text-white tracking-tighter">CO</span>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-coin-400 border border-white flex items-center justify-center text-[8px] font-black text-slate-900 shadow-xs">
                    🪙
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                    CO<span className="text-brand-600 dark:text-brand-400">in</span><span className="text-coin-500">aja</span>
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-coin-100 text-coin-700 dark:bg-coin-950/60 dark:text-coin-400 text-[9px] font-black uppercase tracking-wider">
                      PRO
                    </span>
                  </span>
                  <span className="text-[9px] font-extrabold text-slate-400 -mt-1 hidden sm:block tracking-widest uppercase">
                    Belanja & Panen Koin
                  </span>
                </div>
              </Link>

              {/* Category Mega Menu Trigger */}
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isMegaMenuOpen
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Grid className="w-4 h-4 text-brand-600" />
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
                  placeholder="Cari gadget, fashion, skincare, produk nusantara..."
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
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 h-8 rounded-full transition-all active:scale-95 shadow-xs"
                >
                  Cari
                </button>
              </form>

              {/* Live Autocomplete Popup */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 p-4 animate-in fade-in slide-in-from-top-1 duration-150">
                  {searchQuery.trim() ? (
                    <div>
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
                                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
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

            {/* Quick Actions & Right Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Voucher Hub Link */}
              <Link
                href="/vouchers"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                <Ticket className="w-4 h-4 text-brand-600" />
                <span>Voucher</span>
              </Link>

              {/* Lucky Spin / Coin Center Trigger */}
              <button
                onClick={() => setIsLuckySpinOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coin-50 hover:bg-coin-100 dark:bg-coin-950/40 dark:hover:bg-coin-900/60 text-coin-700 dark:text-coin-400 text-xs font-black transition-colors border border-coin-200/80 dark:border-coin-800"
              >
                <span className="text-sm">🪙</span>
                <span>{formatRupiah(currentUser.coinBalance || 0)}</span>
              </button>

              {/* Theme Switcher Toggle */}
              <ThemeToggle />

              {/* Wishlist Button */}
              <Link
                href="/account?tab=wishlist"
                className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Wishlist Saya"
              >
                <Heart className="w-5 h-5" />
                {totalWishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {totalWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <div
                className="relative"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <Link
                  href="/cart"
                  className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 text-slate-800 dark:text-slate-200 transition-all group font-bold text-xs"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {totalCartCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-brand-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
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
                      <Link href="/cart" className="text-xs text-brand-600 font-bold hover:underline">
                        Lihat Semua
                      </Link>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                            <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {item.product.title}
                            </p>
                            <span className="text-xs font-bold text-brand-600">
                              {formatRupiah(item.product.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
                      <Link href="/cart" className="w-full">
                        <button className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-xs shadow-xs">
                          Buka Keranjang Belanja
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div ref={userMenuRef} className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden md:inline max-w-[100px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-brand-500">
                      <Image src={currentUser.avatar} alt={currentUser.name} fill className="object-cover" />
                    </div>
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="px-3.5 py-1.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs"
                  >
                    Masuk
                  </Link>
                )}

                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-coin-600 bg-coin-50 dark:bg-coin-950/40 px-2 py-0.5 rounded-full">
                          🪙 {formatRupiah(currentUser.coinBalance)}
                        </span>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsTopUpOpen(true);
                          }}
                          className="text-[10px] font-black text-brand-600 hover:underline"
                        >
                          + Isi Saldo
                        </button>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-xs font-semibold">
                      <Link
                        href="/account?tab=orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>Pesanan Saya</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsLuckySpinOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                      >
                        <Sparkles className="w-4 h-4 text-coin-500" />
                        <span>Roda Koin & Check-in</span>
                      </button>

                      <Link
                        href="/vouchers"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Ticket className="w-4 h-4 text-emerald-500" />
                        <span>Pusat Voucher</span>
                      </Link>

                      <Link
                        href="/seller"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Store className="w-4 h-4 text-brand-600" />
                        <span>Seller Center</span>
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <span>Portal Admin</span>
                      </Link>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar</span>
                        </button>
                      </div>
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

      {/* Global Interactive Modals */}
      <LuckySpinModal isOpen={isLuckySpinOpen} onClose={() => setIsLuckySpinOpen(false)} />
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </>
  );
}
