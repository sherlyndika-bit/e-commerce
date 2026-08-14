'use client';

import React, { useState } from 'react';
import { Megaphone, Plus, Tag, Gift, Percent, Clock, CheckCircle } from 'lucide-react';

const mockPromos = [
  { id: 'PROMO-001', name: 'Flash Sale Akhir Pekan', type: 'flash', discount: 30, products: 12, startDate: '2026-08-16', endDate: '2026-08-17', status: 'upcoming', budget: 5000000 },
  { id: 'PROMO-002', name: 'Diskon Member Setia', type: 'voucher', discount: 15, products: 'Semua', startDate: '2026-08-01', endDate: '2026-08-31', status: 'active', budget: 3000000 },
  { id: 'PROMO-003', name: 'Beli 2 Gratis 1 Skincare', type: 'bundle', discount: 33, products: 8, startDate: '2026-08-10', endDate: '2026-08-20', status: 'active', budget: 8000000 },
  { id: 'PROMO-004', name: 'Summer Sale Elektronik', type: 'flash', discount: 25, products: 5, startDate: '2026-07-25', endDate: '2026-08-05', status: 'ended', budget: 4000000 },
];

const promoTypes = [
  { type: 'flash', label: 'Flash Sale', icon: Clock, desc: 'Diskon terbatas waktu untuk meningkatkan penjualan cepat', color: 'pink' },
  { type: 'voucher', label: 'Voucher', icon: Tag, desc: 'Kode voucher yang bisa dipakai pembeli saat checkout', color: 'indigo' },
  { type: 'bundle', label: 'Bundle', icon: Gift, desc: 'Beli beberapa produk sekaligus dengan harga spesial', color: 'emerald' },
];

const statusStyle: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
  ended: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function SellerPromotionsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');

  const filtered = activeTab === 'all' ? mockPromos : mockPromos.filter(p => p.status === activeTab);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Promosi</h1>
          <p className="text-sm text-slate-500 mt-0.5">Buat dan kelola kampanye promosi untuk meningkatkan penjualan.</p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Buat Promosi Baru
        </button>
      </div>

      {/* Promo Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {promoTypes.map(pt => {
          const colors: any = {
            pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-100 hover:border-pink-300' },
            indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100 hover:border-indigo-300' },
            emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100 hover:border-emerald-300' },
          };
          const c = colors[pt.color];
          return (
            <button key={pt.type} className={`bg-white rounded-2xl border-2 ${c.border} shadow-sm p-4 text-left transition-all hover:shadow-md`}>
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                <pt.icon className={`w-5 h-5 ${c.icon}`} />
              </div>
              <p className="text-sm font-bold text-slate-900 mb-1">{pt.label}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{pt.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Promo List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-1">
          {(['all', 'active', 'upcoming', 'ended'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-lg transition-colors ${activeTab === tab ? 'bg-pink-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
              {tab === 'all' ? 'Semua' : tab === 'active' ? 'Berjalan' : tab === 'upcoming' ? 'Akan Datang' : 'Selesai'}
            </button>
          ))}
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.map(promo => (
            <div key={promo.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${promo.type === 'flash' ? 'bg-pink-50 border border-pink-100' : promo.type === 'voucher' ? 'bg-indigo-50 border border-indigo-100' : 'bg-emerald-50 border border-emerald-100'}`}>
                {promo.type === 'flash' ? <Clock className="w-5 h-5 text-pink-600" /> : promo.type === 'voucher' ? <Tag className="w-5 h-5 text-indigo-600" /> : <Gift className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-slate-900">{promo.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle[promo.status]}`}>
                    {promo.status === 'active' ? '● Berjalan' : promo.status === 'upcoming' ? '◷ Akan Datang' : '○ Selesai'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{promo.startDate} → {promo.endDate} • {typeof promo.products === 'number' ? `${promo.products} produk` : promo.products}</p>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="text-lg font-black text-pink-600">{promo.discount}%</p>
                <p className="text-[10px] text-slate-400">diskon</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors">Edit</button>
                {promo.status === 'active' && <button className="px-3 py-1.5 text-xs font-semibold bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-lg transition-colors">Stop</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
