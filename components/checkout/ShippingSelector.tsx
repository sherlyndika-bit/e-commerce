'use client';

import React from 'react';
import { ShippingOption } from '@/lib/types/seller';
import { formatRupiah } from '@/lib/utils/formatters';
import { Truck, Check, Clock } from 'lucide-react';

interface ShippingSelectorProps {
  sellerName: string;
  sellerId: string;
  options: ShippingOption[];
  selectedOptionId: string;
  onSelect: (option: ShippingOption) => void;
}

export function ShippingSelector({
  sellerName,
  options,
  selectedOptionId,
  onSelect,
}: ShippingSelectorProps) {
  return (
    <div className="space-y-2.5">
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <Truck className="w-3.5 h-3.5 text-brand-500" />
        Pilih Opsi Pengiriman untuk Toko {sellerName}:
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt)}
              className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 shadow-xs ring-1 ring-brand-500'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {opt.courierName}
                  </span>
                  {opt.isFreeEligible && (
                    <span className="text-[10px] bg-pink-100 text-pink-700 font-extrabold px-1.5 py-0.2 rounded">
                      Promo Bebas Ongkir
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Estimasi: {opt.estimatedDays}
                </p>
                <span className="text-xs font-extrabold text-brand-500 mt-1 block">
                  {formatRupiah(opt.price)}
                </span>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
