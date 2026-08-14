'use client';

import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Eye, ShoppingBag, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatRupiah } from '@/lib/utils/formatters';

const dailyRevenue = [
  { day: 'Sen', revenue: 3200000, visitors: 142, orders: 8 },
  { day: 'Sel', revenue: 5100000, visitors: 198, orders: 14 },
  { day: 'Rab', revenue: 4300000, visitors: 175, orders: 11 },
  { day: 'Kam', revenue: 7800000, visitors: 284, orders: 22 },
  { day: 'Jum', revenue: 6200000, visitors: 241, orders: 18 },
  { day: 'Sab', revenue: 9400000, visitors: 352, orders: 27 },
  { day: 'Min', revenue: 8100000, visitors: 318, orders: 24 },
];

const conversionData = [
  { day: 'Sen', rate: 5.6 },
  { day: 'Sel', rate: 7.1 },
  { day: 'Rab', rate: 6.3 },
  { day: 'Kam', rate: 7.8 },
  { day: 'Jum', rate: 7.5 },
  { day: 'Sab', rate: 7.7 },
  { day: 'Min', rate: 7.5 },
];

const topProducts = [
  { name: 'Serum Vitamin C 30ml', views: 1240, orders: 88, revenue: 25080000 },
  { name: 'Sony WF-1000XM5', views: 980, orders: 34, revenue: 108800000 },
  { name: 'Moisturizer SPF50', views: 870, orders: 62, revenue: 19840000 },
  { name: 'Keychron K3 Pro', views: 756, orders: 28, revenue: 40600000 },
  { name: 'Toner AHA BHA', views: 620, orders: 45, revenue: 8910000 },
];

const tabs = ['7 Hari', '30 Hari', '3 Bulan', '1 Tahun'];

export default function SellerStatsPage() {
  const [activeTab, setActiveTab] = useState('7 Hari');

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Statistik Toko</h1>
          <p className="text-sm text-slate-500 mt-0.5">Analisis performa dan pertumbuhan toko kamu.</p>
        </div>
        <div className="flex border border-slate-200 rounded-lg overflow-hidden text-sm font-medium">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 transition-colors ${activeTab === tab ? 'bg-pink-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Pendapatan', value: formatRupiah(44100000), trend: '+24.1%', positive: true, icon: TrendingUp, color: 'pink' },
          { label: 'Total Pengunjung', value: '1,710', trend: '+12.8%', positive: true, icon: Eye, color: 'indigo' },
          { label: 'Total Pesanan', value: '124', trend: '+8.4%', positive: true, icon: ShoppingBag, color: 'emerald' },
          { label: 'Konversi Rata-rata', value: '7.2%', trend: '+1.3%', positive: true, icon: Star, color: 'amber' },
        ].map(kpi => {
          const colors: any = {
            pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-100' },
            indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
            emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
            amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
          };
          const c = colors[kpi.color];
          return (
            <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                  <kpi.icon className={`w-4 h-4 ${c.icon}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.trend}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-0.5">{kpi.label}</p>
              <p className="text-lg font-bold text-slate-900">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-900 mb-5">Pendapatan Harian</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: any) => `${v / 1000000}Jt`} dx={-8} />
                <RechartsTooltip formatter={(value: any) => [formatRupiah(value), 'Pendapatan']} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-900 mb-5">Pengunjung & Pesanan</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dx={-8} />
                <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Bar dataKey="visitors" fill="#e0e7ff" radius={[3, 3, 0, 0]} name="Pengunjung" />
                <Bar dataKey="orders" fill="#6366f1" radius={[3, 3, 0, 0]} name="Pesanan" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Produk Terlaris</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">Produk</th>
                <th className="px-5 py-3">Dilihat</th>
                <th className="px-5 py-3">Terjual</th>
                <th className="px-5 py-3">Pendapatan</th>
                <th className="px-5 py-3">Konversi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topProducts.map((p, i) => (
                <tr key={p.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3 flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-slate-700' : i === 2 ? 'bg-amber-700/60 text-white' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                    <span className="text-sm font-medium text-slate-800">{p.name}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{p.views.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-900">{p.orders}</td>
                  <td className="px-5 py-3 text-sm font-bold text-slate-900">{formatRupiah(p.revenue)}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {((p.orders / p.views) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
