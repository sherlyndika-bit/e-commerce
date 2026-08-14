'use client';

import React from 'react';
import { Sparkles, Zap, Truck, Tag } from 'lucide-react';
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
    <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white text-xs py-1.5 px-4 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left marquee / highlight */}
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full font-extrabold text-[10px] tracking-wide uppercase">
            <Zap className="w-3 h-3 fill-amber-300 text-amber-300 animate-bounce" /> Pesta Gajian
          </span>
          <span className="font-medium text-white/95">
            Gratis Ongkir Xtra s/d Rp20.000 ke Seluruh Indonesia + Diskon s/d 80%!
          </span>
        </div>

        {/* Right promo code badge */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-white/90">
            <Truck className="w-3.5 h-3.5" />
            <span>Klaim Voucher:</span>
          </div>
          <button
            onClick={() => handleCopyCode('ONGKIRGRATIS')}
            className="group flex items-center gap-1 bg-white text-brand-600 hover:bg-amber-100 font-extrabold px-2.5 py-0.5 rounded-md text-[11px] shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Tag className="w-3 h-3 text-brand-500 group-hover:rotate-12 transition-transform" />
            ONGKIRGRATIS
          </button>
        </div>
      </div>
    </div>
  );
}
