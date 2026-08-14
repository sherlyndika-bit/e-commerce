'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockVouchers } from '@/lib/mock-data/vouchers';
import { Voucher } from '@/lib/types/voucher';
import { useToastStore } from '@/lib/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah, formatDateIndo } from '@/lib/utils/formatters';
import {
  Ticket,
  Sparkles,
  Truck,
  DollarSign,
  Store,
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
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-brand-500 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-bold">
            Pusat Voucher & Promo
          </span>
        </div>

        {/* Hero Voucher Banner with Countdown */}
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-950 text-white p-6 sm:p-10 shadow-elevated mb-10 overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coin-500 text-slate-950 font-black text-xs uppercase tracking-wider mb-3 shadow-glow-coin">
              <Sparkles className="w-3.5 h-3.5" /> Klaim Sekarang Tanpa Syarat Ribet
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
              Panen Voucher Diskon, Gratis Ongkir & Cashback Koin COinaja!
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
              Gunakan kupon ini saat checkout untuk hemat hingga ratusan ribu rupiah di seluruh toko se-Indonesia.
            </p>

            {/* Live Drop Countdown Session Box */}
            <div className="inline-flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
              <span className="text-xs font-bold text-coin-300 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Drop Sesi Berikutnya:
              </span>
              <div className="flex items-center gap-1 text-xs font-mono font-black">
                <span className="bg-slate-900 px-2 py-1 rounded-lg text-coin-400">
                  {String(sessionCountdown.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 px-2 py-1 rounded-lg text-coin-400">
                  {String(sessionCountdown.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 px-2 py-1 rounded-lg text-coin-400">
                  {String(sessionCountdown.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-elevated'
                    : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vouchers Grid with Realistic Ticket Cutout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVouchers.map((v) => {
            const isClaimed = claimedCodes.includes(v.code);
            return (
              <div
                key={v.id}
                className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle p-5 flex flex-col justify-between relative overflow-hidden group hover:border-brand-300 transition-all hover:shadow-elevated"
              >
                {/* Left Ticket Header Accent */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                        v.type === 'free_shipping'
                          ? 'bg-emerald-500'
                          : v.type === 'cashback_coin'
                          ? 'bg-coin-500 text-slate-950 font-black'
                          : 'bg-brand-600'
                      }`}
                    >
                      {v.type === 'free_shipping' ? (
                        <Truck className="w-5 h-5" />
                      ) : v.type === 'cashback_coin' ? (
                        '🪙'
                      ) : (
                        <Ticket className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                        {v.title}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Min. Belanja: {formatRupiah(v.minPurchase)}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-black px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 rounded-lg border border-slate-200 dark:border-slate-700">
                    {v.code}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {v.description}
                </p>

                {/* Progress bar of voucher usage */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
                    <span>Kuota Terpakai</span>
                    <span className="text-brand-600 dark:text-brand-400">82%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[82%] h-full bg-gradient-to-r from-brand-500 to-coin-500 rounded-full" />
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400">
                    Berlaku s/d {formatDateIndo(v.expiresAt)}
                  </span>
                  <Button
                    onClick={() => handleClaim(v)}
                    variant={isClaimed ? 'outline' : 'primary'}
                    size="sm"
                    className={`font-black text-xs ${
                      isClaimed
                        ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                        : ''
                    }`}
                  >
                    {isClaimed ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Tersalin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3.5 h-3.5" /> Klaim Kupon
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
