'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { voucherService } from '@/lib/services/voucherService';
import { formatRupiah } from '@/lib/utils/formatters';
import { Button } from '../ui/Button';
import { Tag, Sparkles, ShieldCheck, ArrowRight, X } from 'lucide-react';

export function CartSummaryCard() {
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  const {
    getSelectedSubtotal,
    getSelectedCount,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    useCoins,
    toggleUseCoins,
  } = useCartStore();

  const { currentUser } = useAuthStore();
  const { addToast } = useToastStore();

  const selectedCount = getSelectedCount();
  const subtotal = getSelectedSubtotal();

  // Calculate voucher discount
  let voucherDiscount = 0;
  if (appliedVoucher && subtotal >= appliedVoucher.minPurchase) {
    if (appliedVoucher.type === 'discount_percent') {
      voucherDiscount = Math.round((subtotal * appliedVoucher.discountAmount) / 100);
      if (appliedVoucher.maxDiscount) {
        voucherDiscount = Math.min(voucherDiscount, appliedVoucher.maxDiscount);
      }
    } else if (appliedVoucher.type === 'discount_fixed') {
      voucherDiscount = appliedVoucher.discountAmount;
    } else if (appliedVoucher.type === 'free_shipping') {
      voucherDiscount = appliedVoucher.discountAmount;
    }
  }

  // Calculate Coin deduction (max 25% of subtotal or total user coin)
  const maxAllowedCoins = Math.min(currentUser.coinBalance, Math.round(subtotal * 0.25));
  const coinDeduction = useCoins ? maxAllowedCoins : 0;

  const grandTotal = Math.max(0, subtotal - voucherDiscount - coinDeduction);

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) return;

    setIsApplyingVoucher(true);
    const voucher = await voucherService.getByCode(voucherCodeInput.trim());
    setIsApplyingVoucher(false);

    if (!voucher) {
      addToast({
        title: 'Voucher Tidak Valid',
        description: 'Kode voucher yang kamu masukkan tidak ditemukan atau sudah kedaluwarsa.',
        type: 'error',
      });
      return;
    }

    if (subtotal < voucher.minPurchase) {
      addToast({
        title: 'Minimal Belanja Belum Terpenuhi',
        description: `Voucher ini membutuhkan minimal belanja ${formatRupiah(voucher.minPurchase)}.`,
        type: 'warning',
      });
      return;
    }

    applyVoucher(voucher);
    setVoucherCodeInput('');
    addToast({
      title: 'Voucher Berhasil Dipasang! 🎉',
      description: voucher.title,
      type: 'success',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle space-y-5 sticky top-24">
      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
        Ringkasan Belanja
      </h3>

      {/* Voucher Input */}
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-brand-500" />
          Makin Hemat Pakai Voucher:
        </label>
        {appliedVoucher ? (
          <div className="flex items-center justify-between p-2.5 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 rounded-xl">
            <div>
              <span className="font-bold text-xs text-brand-600 dark:text-brand-400 block">
                🎟️ {appliedVoucher.code}
              </span>
              <span className="text-[11px] text-slate-500">
                Hemat {formatRupiah(voucherDiscount)}
              </span>
            </div>
            <button
              onClick={removeVoucher}
              className="text-slate-400 hover:text-rose-500 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyVoucher} className="flex gap-2">
            <input
              type="text"
              placeholder="Contoh: ONGKIRGRATIS"
              value={voucherCodeInput}
              onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
              className="flex-1 h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-bold focus:outline-none focus:border-brand-500"
            />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              isLoading={isApplyingVoucher}
              className="h-9 px-3 text-xs font-bold"
            >
              Pakai
            </Button>
          </form>
        )}
      </div>

      {/* Coin Deduction Toggle */}
      <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-900/60">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Tukarkan Koin COinaja
              </span>
              <span className="text-[11px] text-slate-500">
                Saldo: {formatRupiah(currentUser.coinBalance)} (Maks potong {formatRupiah(maxAllowedCoins)})
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={useCoins}
            onChange={toggleUseCoins}
            disabled={subtotal === 0 || currentUser.coinBalance === 0}
            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500/20 cursor-pointer disabled:opacity-50"
          />
        </label>
      </div>

      {/* Breakdown lines */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Total Harga ({selectedCount} barang):</span>
          <span className="font-semibold text-slate-900 dark:text-white">{formatRupiah(subtotal)}</span>
        </div>

        {voucherDiscount > 0 && (
          <div className="flex justify-between text-pink-600 dark:text-pink-400 font-semibold">
            <span>Diskon Voucher ({appliedVoucher?.code}):</span>
            <span>-{formatRupiah(voucherDiscount)}</span>
          </div>
        )}

        {useCoins && coinDeduction > 0 && (
          <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
            <span>Potongan Koin COinaja:</span>
            <span>-{formatRupiah(coinDeduction)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimasi Ongkos Kirim:</span>
          <span className="text-slate-400 text-[11px]">Dihitung di checkout</span>
        </div>
      </div>

      {/* Total Section */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-slate-500 block">Total Tagihan:</span>
          <span className="text-xl font-black text-brand-500">
            {formatRupiah(grandTotal)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      {selectedCount > 0 ? (
        <Link href="/checkout" className="block">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Beli ({selectedCount}) & Checkout
          </Button>
        </Link>
      ) : (
        <Button variant="primary" size="lg" disabled className="w-full">
          Pilih Produk Dulu
        </Button>
      )}

      {/* Safety Notice */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
        <span>Jaminan Belanja Aman 100% Bebas Penipuan</span>
      </div>
    </div>
  );
}
