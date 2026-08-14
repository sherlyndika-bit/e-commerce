'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/useCartStore';
import { SellerCartGroup } from '@/components/cart/SellerCartGroup';
import { CartSummaryCard } from '@/components/cart/CartSummaryCard';
import { Button } from '@/components/ui/Button';
import { Trash2, ChevronRight } from 'lucide-react';

export default function CartPage() {
  const { items, getSellerGroups, toggleAllSelection, clearCart } = useCartStore();

  const sellerGroups = getSellerGroups();
  const allSelected = items.length > 0 && items.every((i) => i.selected);

  return (
    <div className="py-4 sm:py-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <Link href="/" className="hover:text-pink-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-bold">
            Keranjang Belanja
          </span>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="py-12 text-center bg-white rounded-lg border border-slate-200/90 p-6 max-w-md mx-auto shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-3 text-2xl">
              🛒
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Keranjang Belanjamu Masih Kosong!
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4 leading-relaxed">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Store Groups & Select All Bar (Col 8) */}
            <div className="lg:col-span-8 space-y-3">
              {/* Select All Header Bar */}
              <div className="p-3 bg-white rounded-lg border border-slate-200/90 shadow-2xs flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => toggleAllSelection(!allSelected)}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500/20 cursor-pointer"
                  />
                  <span>Pilih Semua ({items.length})</span>
                </label>

                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Semua
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
