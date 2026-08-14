'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SellerCartGroup as SellerGroupType, useCartStore } from '@/lib/store/useCartStore';
import { formatRupiah } from '@/lib/utils/formatters';
import { Trash2, Store, MapPin, Plus, Minus, MessageSquare } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface SellerCartGroupProps {
  group: SellerGroupType;
}

export function SellerCartGroup({ group }: SellerCartGroupProps) {
  const {
    toggleSellerSelection,
    toggleItemSelection,
    updateQuantity,
    removeItem,
    setStoreNote,
  } = useCartStore();

  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle overflow-hidden mb-4">
      {/* Store Header */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={group.allSelected}
            onChange={() => toggleSellerSelection(group.sellerId)}
            className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500/20 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-500" />
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {group.sellerName}
            </span>
            <Badge
              variant={group.sellerBadge === 'official' ? 'official' : 'star'}
              size="xs"
            >
              {group.sellerBadge === 'official' ? 'Official' : 'Star'}
            </Badge>
          </div>
        </div>

        <span className="text-xs text-slate-400 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          {group.sellerCity}
        </span>
      </div>

      {/* Item Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {group.items.map((item) => (
          <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Checkbox + Thumbnail + Details */}
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleItemSelection(item.id)}
                className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500/20 cursor-pointer mt-1"
              />

              <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-brand-500 line-clamp-2 leading-snug transition-colors"
                >
                  {item.product.title}
                </Link>

                {item.variantSelected && (
                  <div className="mt-1">
                    <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                      Variasi: {item.variantSelected}
                    </span>
                  </div>
                )}

                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-sm font-extrabold text-brand-500">
                    {formatRupiah(item.price)}
                  </span>
                  {item.product.originalPrice && item.product.originalPrice > item.price && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatRupiah(item.product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quantity Stepper & Subtotal */}
            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              {/* Stepper */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 py-1 text-xs font-bold text-slate-900 dark:text-white min-w-7 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Total Item Price */}
              <div className="text-right min-w-24">
                <span className="text-sm font-black text-slate-900 dark:text-white block">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                title="Hapus dari Keranjang"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Store Note Input Footer */}
      <div className="p-3.5 bg-slate-50/60 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder={`Tulis catatan untuk toko ${group.sellerName} (opsional)...`}
          value={group.items[0]?.storeNote || ''}
          onChange={(e) => setStoreNote(group.sellerId, e.target.value)}
          className="w-full text-xs bg-transparent border-none focus:outline-none placeholder:text-slate-400 text-slate-800 dark:text-slate-200"
        />
      </div>
    </div>
  );
}
