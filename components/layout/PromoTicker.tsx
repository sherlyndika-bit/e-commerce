'use client';

import React from 'react';
import { Zap, Tag } from 'lucide-react';
import { useToastStore } from '@/lib/store/useToastStore';

export function PromoTicker() {
  const { addToast } = useToastStore();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast({
      title: 'Kode Voucher Disalin!',
      description: `Gunakan kode ${code} saat checkout untuk diskon spesial.`,
      type: 'success',
    });
  };

  return (
    <div className="bg-pink-600 text-white text-[11px] h-7 px-4 flex items-center justify-between overflow-hidden shadow-xs">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Left text */}
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="inline-flex items-center gap-1 bg-white/20 px-1.5 py-0.5 rounded font-extrabold text-[9px] uppercase tracking-wider">
            <Zap className="w-2.5 h-2.5 fill-amber-300 text-amber-300" /> Promo Gajian
          </span>
          <span className="font-medium text-white truncate">
            Gratis Ongkir Xtra s/d Rp20.000 + Cashback Koin 10% Tiap Hari!
          </span>
        </div>

        {/* Right voucher code badge */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="text-white/90 text-[10px]">Klaim Voucher:</span>
          <button
            onClick={() => handleCopyCode('ONGKIRGRATIS')}
            className="flex items-center gap-1 bg-white text-pink-700 hover:bg-pink-50 font-bold px-2 py-0.5 rounded text-[10px] shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Tag className="w-2.5 h-2.5 text-pink-600" />
            ONGKIRGRATIS
          </button>
        </div>
      </div>
    </div>
  );
}
