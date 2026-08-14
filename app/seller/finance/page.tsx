'use client';

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, Download } from 'lucide-react';
import { formatRupiah } from '@/lib/utils/formatters';

const incomeData = [
  { bulan: 'Mar', pendapatan: 18500000, komisi: 925000, bersih: 17575000 },
  { bulan: 'Apr', pendapatan: 22000000, komisi: 1100000, bersih: 20900000 },
  { bulan: 'Mei', pendapatan: 31000000, komisi: 1550000, bersih: 29450000 },
  { bulan: 'Jun', pendapatan: 28500000, komisi: 1425000, bersih: 27075000 },
  { bulan: 'Jul', pendapatan: 38000000, komisi: 1900000, bersih: 36100000 },
  { bulan: 'Agu', pendapatan: 44100000, komisi: 2205000, bersih: 41895000 },
];

const transactions = [
  { id: 'TRX-001', date: '2026-08-14', desc: 'Penjualan Produk (28 pesanan)', amount: 8100000, type: 'income' },
  { id: 'TRX-002', date: '2026-08-14', desc: 'Biaya Platform (5%)', amount: -405000, type: 'deduction' },
  { id: 'TRX-003', date: '2026-08-13', desc: 'Penjualan Produk (24 pesanan)', amount: 9400000, type: 'income' },
  { id: 'TRX-004', date: '2026-08-13', desc: 'Biaya Platform (5%)', amount: -470000, type: 'deduction' },
  { id: 'TRX-005', date: '2026-08-12', desc: 'Pencairan Saldo ke Bank', amount: -15000000, type: 'withdrawal' },
  { id: 'TRX-006', date: '2026-08-11', desc: 'Penjualan Produk (18 pesanan)', amount: 6200000, type: 'income' },
];

export default function SellerFinancePage() {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'riwayat' | 'pencairan'>('ringkasan');

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Keuangan Toko</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pantau pemasukan, pengeluaran, dan saldo toko kamu.</p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Ekspor Laporan
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl p-5 text-white shadow-lg shadow-pink-200">
          <p className="text-xs font-semibold text-pink-200 mb-1">Saldo Tersedia</p>
          <p className="text-3xl font-black">{formatRupiah(41895000)}</p>
          <p className="text-xs text-pink-200 mt-2">Siap dicairkan ke rekening bank</p>
          <button className="mt-4 w-full bg-white text-pink-700 font-bold text-sm py-2 rounded-xl hover:bg-pink-50 transition-colors">
            Cairkan Sekarang
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-slate-500">Pemasukan Bulan Ini</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatRupiah(44100000)}</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">↑ +16% dari bulan lalu</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xs font-semibold text-slate-500">Menunggu Pencairan</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatRupiah(2205000)}</p>
          <p className="text-xs text-slate-400 mt-1">Estimasi cair: 3-5 hari kerja</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border border-slate-200 rounded-xl overflow-hidden text-sm font-medium bg-white shadow-sm w-fit">
        {(['ringkasan', 'riwayat', 'pencairan'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 capitalize transition-colors ${activeTab === tab ? 'bg-pink-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'ringkasan' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-900 mb-5">Tren Pendapatan Bersih (6 Bulan)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: any) => `${v / 1000000}Jt`} dx={-8} />
                <RechartsTooltip formatter={(value: any) => [formatRupiah(value)]} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Bar dataKey="pendapatan" fill="#fbcfe8" radius={[3, 3, 0, 0]} name="Kotor" />
                <Bar dataKey="bersih" fill="#ec4899" radius={[3, 3, 0, 0]} name="Bersih" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-50">
            {transactions.map((t) => (
              <div key={t.id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'income' ? 'bg-emerald-50 border border-emerald-100' : t.type === 'deduction' ? 'bg-amber-50 border border-amber-100' : 'bg-red-50 border border-red-100'}`}>
                    {t.type === 'income' ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : t.type === 'deduction' ? <DollarSign className="w-4 h-4 text-amber-600" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.desc}</p>
                    <p className="text-[11px] text-slate-400">{t.date} • {t.id}</p>
                  </div>
                </div>
                <p className={`text-sm font-bold ${t.amount > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {t.amount > 0 ? '+' : ''}{formatRupiah(Math.abs(t.amount))}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pencairan' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-900">Rekening Terdaftar: BCA ****1234</p>
              <p className="text-xs text-emerald-700 mt-0.5">a.n. Nama Seller • Terverifikasi</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Jumlah Pencairan</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rp</span>
                <input type="number" placeholder="0" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-400 transition-all" />
              </div>
              <button className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">Cairkan</button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Min. pencairan Rp 100.000 • Proses 1-3 hari kerja</p>
          </div>
        </div>
      )}
    </div>
  );
}
