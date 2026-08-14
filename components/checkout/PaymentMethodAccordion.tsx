'use client';

import React from 'react';
import { PaymentMethodType } from '@/lib/types/order';
import { QrCode, Building2, Wallet, HandCoins, Check } from 'lucide-react';

interface PaymentMethodAccordionProps {
  selectedMethod: PaymentMethodType;
  onSelect: (method: PaymentMethodType, name: string) => void;
}

interface PaymentItem {
  id: PaymentMethodType;
  name: string;
  desc: string;
  badge?: string;
}

interface PaymentGroup {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  items: PaymentItem[];
}

export function PaymentMethodAccordion({
  selectedMethod,
  onSelect,
}: PaymentMethodAccordionProps) {
  const methods: PaymentGroup[] = [
    {
      category: 'QRIS & Pembayaran Instan',
      icon: QrCode,
      items: [
        {
          id: 'qris' as PaymentMethodType,
          name: 'QRIS Instant (GoPay, OVO, ShopeePay, DANA, BCA, Livin)',
          desc: 'Scan barcode langsung terverifikasi otomatis dalam 1 detik tanpa upload bukti transfer.',
          badge: 'Paling Praktis',
        },
      ],
    },
    {
      category: 'Virtual Account Bank (Verifikasi Otomatis)',
      icon: Building2,
      items: [
        {
          id: 'bca_va' as PaymentMethodType,
          name: 'BCA Virtual Account',
          desc: 'Bebas biaya admin transfer untuk semua nasabah Bank BCA.',
        },
        {
          id: 'mandiri_va' as PaymentMethodType,
          name: 'Mandiri Virtual Account',
          desc: 'Bayar via aplikasi Livin by Mandiri atau ATM.',
        },
        {
          id: 'bri_va' as PaymentMethodType,
          name: 'BRI Virtual Account (BRIVA)',
          desc: 'Bayar via BRImo atau jaringan agen BRILink.',
        },
      ],
    },
    {
      category: 'E-Wallet Saldo Digital',
      icon: Wallet,
      items: [
        {
          id: 'gopay' as PaymentMethodType,
          name: 'GoPay / GoPay Coins',
          desc: 'Terhubung langsung dengan akun Gojek.',
        },
        {
          id: 'shopeepay' as PaymentMethodType,
          name: 'ShopeePay',
          desc: 'Dapatkan ekstra cashback koin khusus pengguna ShopeePay.',
        },
        {
          id: 'dana' as PaymentMethodType,
          name: 'DANA Digital Wallet',
          desc: 'Pembayaran cepat dan aman via akun DANA.',
        },
      ],
    },
    {
      category: 'Bayar di Tempat (COD)',
      icon: HandCoins,
      items: [
        {
          id: 'cod' as PaymentMethodType,
          name: 'COD (Bayar Tunai ke Kurir)',
          desc: 'Bayar langsung uang tunai saat kurir mengantarkan paket ke rumahmu.',
          badge: 'Bisa Cek Dulu',
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
        Pilih Metode Pembayaran
      </h3>

      <div className="space-y-3">
        {methods.map((group, idx) => {
          const GroupIcon = group.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-subtle"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <GroupIcon className="w-4 h-4 text-brand-500" />
                <span>{group.category}</span>
              </div>

              <div className="space-y-2 pt-3">
                {group.items.map((item) => {
                  const isSelected = selectedMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelect(item.id, item.name)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 shadow-xs ring-1 ring-brand-500'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] bg-brand-500 text-white font-extrabold px-2 py-0.2 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                          isSelected
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
