'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockVouchers } from '@/lib/mock-data/vouchers';
import { Voucher } from '@/lib/types/voucher';
import { useToastStore } from '@/lib/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { formatRupiah, formatDateIndo } from '@/lib/utils/formatters';
import {
  Ticket,
  Sparkles,
  Truck,
  DollarSign,
  Clock,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';

export default function VouchersHubPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'free_shipping' | 'cashback' | 'discount'>('all');
  const [claimedCodes, setClaimedCodes] = useState<string[]>([]);
  const [sessionCountdown, setSessionCountdown] = useState({ hours: 2, minutes: 45, seconds: 12 });

  const { addToast } = useToastStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = (voucher: Voucher) => {
    if (claimedCodes.includes(voucher.code)) return;

    setClaimedCodes((prev) => [...prev, voucher.code]);
    navigator.clipboard.writeText(voucher.code);

    addToast({
      title: `Voucher ${voucher.code} Berhasil Diklaim! 🎟️`,
      description: 'Kode voucher otomatis tersalin & siap dipakai di halaman checkout.',
      type: 'success',
    });
  };

  const filteredVouchers = mockVouchers.filter((v) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'free_shipping') return v.type === 'free_shipping';
    if (activeTab === 'cashback') return v.type === 'cashback_coin';
    if (activeTab === 'discount') return v.type === 'discount_percent' || v.type === 'discount_fixed';
    return true;
  });

  return (
    <div className="py-4 sm:py-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <Link href="/" className="hover:text-pink-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-bold">
            Pusat Voucher & Promo
          </span>
        </div>

        {/* Hero Voucher Banner with Countdown */}
        <div className="relative rounded-lg bg-pink-950 text-white p-5 sm:p-7 shadow-2xs mb-6 overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" /> Klaim Promo Hari Ini
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight mb-2">
              Kumpulan Voucher Diskon, Gratis Ongkir & Cashback Koin COinaja
            </h1>
            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              Gunakan kupon ini saat checkout untuk hemat hingga ratusan ribu rupiah di seluruh toko se-Indonesia.
            </p>

            {/* Live Drop Countdown Session Box */}
            <div className="inline-flex items-center gap-2.5 p-2.5 bg-white/10 rounded-lg border border-white/15">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Sesi Berikutnya:
              </span>
              <div className="flex items-center gap-1 text-xs font-mono font-bold">
                <span className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-400">
                  {String(sessionCountdown.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-400">
                  {String(sessionCountdown.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-400">
                  {String(sessionCountdown.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4">
          {[
            { id: 'all', label: 'Semua Kupon', icon: Ticket },
            { id: 'free_shipping', label: 'Gratis Ongkir Xtra', icon: Truck },
            { id: 'cashback', label: 'Cashback Koin', icon: DollarSign },
            { id: 'discount', label: 'Diskon Belanja', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-pink-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredVouchers.map((v) => {
            const isClaimed = claimedCodes.includes(v.code);
            return (
              <div
                key={v.id}
                className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between hover:border-pink-500 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5 mb-2">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs mt-0.5 ${
                          v.type === 'free_shipping'
                            ? 'bg-pink-600'
                            : 'bg-pink-700'
                        }`}
                      >
                        {v.type === 'free_shipping' ? (
                          <Truck className="w-4 h-4" />
                        ) : v.type === 'cashback_coin' ? (
                          <DollarSign className="w-4 h-4" />
                        ) : (
                          <Ticket className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug mb-0.5 line-clamp-2">
                          {v.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Min. Belanja: {formatRupiah(v.minPurchase)}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-pink-700 rounded border border-slate-200">
                      {v.code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    {v.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400">
                    s/d {formatDateIndo(v.expiresAt)}
                  </span>
                  <Button
                    onClick={() => handleClaim(v)}
                    variant={isClaimed ? 'outline' : 'primary'}
                    size="xs"
                    className={`font-bold text-xs ${
                      isClaimed
                        ? 'border-pink-600 text-pink-700 bg-pink-50'
                        : ''
                    }`}
                  >
                    {isClaimed ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" /> Tersalin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Klaim Kupon
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
