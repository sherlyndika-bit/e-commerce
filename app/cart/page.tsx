'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/useCartStore';
import { SellerCartGroup } from '@/components/cart/SellerCartGroup';
import { CartSummaryCard } from '@/components/cart/CartSummaryCard';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, ArrowLeft, Trash2, ShieldCheck, ChevronRight } from 'lucide-react';

export default function CartPage() {
  const { items, getSellerGroups, toggleAllSelection, clearCart } = useCartStore();

  const sellerGroups = getSellerGroups();
  const allSelected = items.length > 0 && items.every((i) => i.selected);

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-brand-500 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-bold">
            Keranjang Belanja Multi-Toko
          </span>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 max-w-md mx-auto shadow-subtle">
            <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-500 flex items-center justify-center mx-auto mb-4 text-3xl">
              🛒
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1.5">
              Keranjang Belanjamu Masih Kosong!
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
              Yuk jelajahi ribuan produk terbaik dari seller terverifikasi seluruh Indonesia dan nikmati promo gratis ongkirnya.
            </p>
            <Link href="/products">
              <Button variant="primary" size="md">
                Mulai Belanja Sekarang
              </Button>
            </Link>
          </div>
        ) : (
          /* Multi-Seller Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Store Groups & Select All Bar (Col 8) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Select All Header Bar */}
              <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => toggleAllSelection(!allSelected)}
                    className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500/20 cursor-pointer"
                  />
                  <span>Pilih Semua Barang ({items.length})</span>
                </label>

                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Kosongkan Keranjang
                </button>
              </div>

              {/* Multi-Seller Groups */}
              <div>
                {sellerGroups.map((group) => (
                  <SellerCartGroup key={group.sellerId} group={group} />
                ))}
              </div>
            </div>

            {/* Right: Sticky Summary Card (Col 4) */}
            <div className="lg:col-span-4">
              <CartSummaryCard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
