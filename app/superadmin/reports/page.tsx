'use client';

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { FileBarChart, Download, TrendingUp, DollarSign } from 'lucide-react';
import { formatRupiah } from '@/lib/utils/formatters';

const monthlyData = [
  { bulan: 'Jan', gmv: 450000000, komisi: 22500000, sellerBaru: 42, userBaru: 1820 },
  { bulan: 'Feb', gmv: 520000000, komisi: 26000000, sellerBaru: 58, userBaru: 2140 },
  { bulan: 'Mar', gmv: 480000000, komisi: 24000000, sellerBaru: 37, userBaru: 1650 },
  { bulan: 'Apr', gmv: 610000000, komisi: 30500000, sellerBaru: 71, userBaru: 2890 },
  { bulan: 'Mei', gmv: 750000000, komisi: 37500000, sellerBaru: 94, userBaru: 3540 },
  { bulan: 'Jun', gmv: 890000000, komisi: 44500000, sellerBaru: 108, userBaru: 4210 },
];

const tabs = ['Bulanan', 'Kuartalan', 'Tahunan'];

export default function SuperadminReportsPage() {
  const [activeTab, setActiveTab] = useState('Bulanan');

  const totalGmv = monthlyData.reduce((sum, d) => sum + d.gmv, 0);
  const totalKomisi = monthlyData.reduce((sum, d) => sum + d.komisi, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Laporan Keuangan</h1>
          <p className="text-sm text-slate-500 mt-0.5">Ringkasan finansial platform TumbasCO secara periodik.</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <div className="flex border border-slate-200 rounded-lg overflow-hidden text-sm font-medium bg-white">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 transition-colors ${activeTab === tab ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{tab}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Ekspor
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total GMV (6 Bln)', value: formatRupiah(totalGmv), icon: TrendingUp, color: 'emerald' },
          { label: 'Total Komisi (6 Bln)', value: formatRupiah(totalKomisi), icon: DollarSign, color: 'indigo' },
          { label: 'Rata-rata GMV/Bln', value: formatRupiah(totalGmv / 6), icon: BarChart, color: 'blue' },
          { label: 'Growth Rate', value: '+18.5%', icon: TrendingUp, color: 'pink' },
        ].map(c => {
          const colors: any = {
            emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
            indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
            blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
            pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-100' },
          };
          const cl = colors[c.color];
          return (
            <div key={c.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className={`w-9 h-9 rounded-xl ${cl.bg} border ${cl.border} flex items-center justify-center mb-3`}>
                <c.icon className={`w-4 h-4 ${cl.icon}`} />
              </div>
              <p className="text-xs text-slate-500 mb-0.5">{c.label}</p>
              <p className="text-lg font-bold text-slate-900">{c.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-900 mb-5">GMV Bulanan</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: any) => `${v / 1000000}M`} dx={-8} />
                <RechartsTooltip formatter={(value: any) => [formatRupiah(value), 'GMV']} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Bar dataKey="gmv" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-900 mb-5">Seller & User Baru</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dx={-8} />
                <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Line type="monotone" dataKey="sellerBaru" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} name="Seller Baru" />
                <Line type="monotone" dataKey="userBaru" stroke="#ec4899" strokeWidth={2.5} dot={{ r: 3, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }} name="User Baru" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Ringkasan Per Bulan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">Bulan</th>
                <th className="px-5 py-3">GMV</th>
                <th className="px-5 py-3">Komisi (5%)</th>
                <th className="px-5 py-3">Seller Baru</th>
                <th className="px-5 py-3">User Baru</th>
                <th className="px-5 py-3">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {monthlyData.map((d, i) => {
                const prev = monthlyData[i - 1];
                const growth = prev ? (((d.gmv - prev.gmv) / prev.gmv) * 100).toFixed(1) : null;
                return (
                  <tr key={d.bulan} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 text-sm font-bold text-slate-900">{d.bulan} 2026</td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-900">{formatRupiah(d.gmv)}</td>
                    <td className="px-5 py-3 text-sm font-medium text-indigo-700">{formatRupiah(d.komisi)}</td>
                    <td className="px-5 py-3 text-sm text-slate-700">+{d.sellerBaru}</td>
                    <td className="px-5 py-3 text-sm text-slate-700">+{d.userBaru.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      {growth ? (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${Number(growth) >= 0 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                          {Number(growth) >= 0 ? '+' : ''}{growth}%
                        </span>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
