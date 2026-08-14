'use client';

import React, { useState } from 'react';
import { Search, CheckCircle, Clock, XCircle, CreditCard } from 'lucide-react';
import { formatRupiah } from '@/lib/utils/formatters';

const mockTransactions = [
  { id: 'TRX-20260814-001', buyer: 'Rian Kusuma', seller: 'Beauty Shop ID', product: 'Serum Vitamin C 30ml', amount: 285000, fee: 14250, payment: 'COinPay', status: 'SUCCESS', date: '2026-08-14 08:23' },
  { id: 'TRX-20260814-002', buyer: 'Nadia Salsabila', seller: 'Digital Store', product: 'Sony WF-1000XM5', amount: 3200000, fee: 160000, payment: 'Transfer Bank', status: 'SUCCESS', date: '2026-08-14 09:41' },
  { id: 'TRX-20260814-003', buyer: 'Faisal Akbar', seller: 'Gadget Mania', product: 'Keychron K3 Pro', amount: 1450000, fee: 72500, payment: 'QRIS', status: 'PENDING', date: '2026-08-14 10:05' },
  { id: 'TRX-20260813-011', buyer: 'Budi Santoso', seller: 'Fashion Update', product: 'Kemeja Flanel Oversize', amount: 195000, fee: 9750, payment: 'COinPay', status: 'SUCCESS', date: '2026-08-13 14:30' },
  { id: 'TRX-20260813-012', buyer: 'Dewi Anggraini', seller: 'Herbal Sehat', product: 'Paket Jamu Kunyit', amount: 128000, fee: 6400, payment: 'GoPay', status: 'SUCCESS', date: '2026-08-13 16:55' },
  { id: 'TRX-20260813-013', buyer: 'Raka Pratama', seller: 'Digital Store', product: 'iPad Air M2', amount: 8900000, fee: 445000, payment: 'Transfer Bank', status: 'FAILED', date: '2026-08-13 18:12' },
  { id: 'TRX-20260812-021', buyer: 'Sari Indah', seller: 'Beauty Shop ID', product: 'Moisturizer SPF50', amount: 320000, fee: 16000, payment: 'QRIS', status: 'SUCCESS', date: '2026-08-12 10:20' },
  { id: 'TRX-20260812-022', buyer: 'Hendra Gunawan', seller: 'Gadget Mania', product: 'USB Hub 7-Port', amount: 245000, fee: 12250, payment: 'COinPay', status: 'SUCCESS', date: '2026-08-12 13:45' },
  { id: 'TRX-20260811-031', buyer: 'Maya Sari', seller: 'Beauty Shop ID', product: 'Toner AHA BHA', amount: 198000, fee: 9900, payment: 'OVO', status: 'SUCCESS', date: '2026-08-11 09:30' },
  { id: 'TRX-20260811-032', buyer: 'Joko Widodo', seller: 'Fashion Update', product: 'Celana Cargo', amount: 280000, fee: 14000, payment: 'COinPay', status: 'PENDING', date: '2026-08-11 20:15' },
];

const statusStyle: Record<string, string> = {
  SUCCESS: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  FAILED: 'bg-red-100 text-red-800 border-red-200',
};

export default function SuperadminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockTransactions.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = mockTransactions.reduce((sum, t) => t.status === 'SUCCESS' ? sum + t.amount : sum, 0);
  const totalFee = mockTransactions.reduce((sum, t) => t.status === 'SUCCESS' ? sum + t.fee : sum, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Monitoring Transaksi</h1>
        <p className="text-sm text-slate-500 mt-0.5">Pantau semua transaksi yang terjadi di platform COinAja.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Transaksi', value: mockTransactions.length, color: 'text-slate-900' },
          { label: 'Berhasil', value: mockTransactions.filter(t => t.status === 'SUCCESS').length, color: 'text-emerald-600' },
          { label: 'Pending', value: mockTransactions.filter(t => t.status === 'PENDING').length, color: 'text-amber-600' },
          { label: 'Gagal', value: mockTransactions.filter(t => t.status === 'FAILED').length, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs text-slate-500 mb-1">Total Volume Transaksi Sukses</p>
          <p className="text-2xl font-bold text-slate-900">{formatRupiah(totalAmount)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs text-slate-500 mb-1">Total Komisi Platform Diterima</p>
          <p className="text-2xl font-bold text-indigo-700">{formatRupiah(totalFee)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari ID transaksi, pembeli, atau seller..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:bg-white transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">ID Transaksi</th>
                <th className="px-5 py-3.5">Pembeli → Seller</th>
                <th className="px-5 py-3.5">Produk</th>
                <th className="px-5 py-3.5">Jumlah</th>
                <th className="px-5 py-3.5">Komisi</th>
                <th className="px-5 py-3.5">Metode</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">{t.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-slate-900">{t.buyer}</p>
                    <p className="text-[11px] text-slate-400">→ {t.seller}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-slate-700 truncate max-w-[140px]">{t.product}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-slate-900">{formatRupiah(t.amount)}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-indigo-700">{formatRupiah(t.fee)}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">{t.payment}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle[t.status]}`}>
                      {t.status === 'SUCCESS' && <CheckCircle className="w-3 h-3" />}
                      {t.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {t.status === 'FAILED' && <XCircle className="w-3 h-3" />}
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
