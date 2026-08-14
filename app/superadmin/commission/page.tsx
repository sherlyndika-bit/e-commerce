'use client';

import React, { useState } from 'react';
import { Percent, Save, Info } from 'lucide-react';

const commissionRules = [
  { category: 'Fashion & Aksesoris', current: 5, proposed: 5, volume: 'Rp286Jt/bln' },
  { category: 'Elektronik & Gadget', current: 4, proposed: 4, volume: 'Rp249Jt/bln' },
  { category: 'Kecantikan & Perawatan', current: 6, proposed: 6, volume: 'Rp169Jt/bln' },
  { category: 'Makanan & Minuman', current: 3, proposed: 3, volume: 'Rp89Jt/bln' },
  { category: 'Olahraga & Outdoor', current: 5, proposed: 5, volume: 'Rp54Jt/bln' },
  { category: 'Rumah & Furnitur', current: 5, proposed: 5, volume: 'Rp43Jt/bln' },
];

export default function SuperadminCommissionPage() {
  const [rules, setRules] = useState(commissionRules);
  const [baseRate, setBaseRate] = useState(5);

  const handleChange = (idx: number, val: number) => {
    const updated = [...rules];
    updated[idx].proposed = Math.min(20, Math.max(0, val));
    setRules(updated);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Pengaturan Komisi Platform</h1>
        <p className="text-sm text-slate-500 mt-0.5">Atur biaya platform (platform fee) yang dikenakan kepada seller.</p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-900">Cara Kerja Komisi</p>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Komisi platform dihitung dari total nilai transaksi per pesanan. Seller akan menerima pendapatan dikurangi persentase komisi yang ditetapkan. Perubahan komisi akan berlaku 7 hari setelah pemberitahuan kepada seller.
          </p>
        </div>
      </div>

      {/* Base Rate */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-900 mb-4">Tarif Dasar Platform</h2>
        <div className="flex items-center gap-5">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-700 block mb-2">Komisi Default (untuk kategori yang tidak disebutkan khusus)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={20}
                step={0.5}
                value={baseRate}
                onChange={e => setBaseRate(Number(e.target.value))}
                className="flex-1 accent-emerald-600"
              />
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <span className="text-xl font-black text-emerald-700">{baseRate}</span>
                <Percent className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per Category */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Komisi Per Kategori</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {rules.map((rule, i) => (
            <div key={rule.category} className="px-5 py-4 flex items-center gap-5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{rule.category}</p>
                <p className="text-xs text-slate-400 mt-0.5">Volume: {rule.volume}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Saat Ini</p>
                  <p className="text-sm font-bold text-slate-500">{rule.current}%</p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-1">Ubah ke</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleChange(i, rule.proposed - 0.5)} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-colors">-</button>
                    <div className="w-14 text-center">
                      <span className={`text-base font-black ${rule.proposed !== rule.current ? 'text-emerald-600' : 'text-slate-900'}`}>{rule.proposed}%</span>
                    </div>
                    <button onClick={() => handleChange(i, rule.proposed + 0.5)} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-colors">+</button>
                  </div>
                </div>
              </div>
              {rule.proposed !== rule.current && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border flex-shrink-0 ${rule.proposed > rule.current ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                  {rule.proposed > rule.current ? `+${(rule.proposed - rule.current).toFixed(1)}%` : `${(rule.proposed - rule.current).toFixed(1)}%`}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
