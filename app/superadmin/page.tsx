'use client';

import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { DollarSign, Store, Users, TrendingUp, ArrowUpRight, ShieldCheck, Clock } from 'lucide-react';
import { formatRupiah } from '@/lib/utils/formatters';

const gmvData = [
  { name: 'Jan', gmv: 450000000 },
  { name: 'Feb', gmv: 520000000 },
  { name: 'Mar', gmv: 480000000 },
  { name: 'Apr', gmv: 610000000 },
  { name: 'Mei', gmv: 750000000 },
  { name: 'Jun', gmv: 890000000 },
];

const commissionData = [
  { name: 'Jan', komisi: 22500000 },
  { name: 'Feb', komisi: 26000000 },
  { name: 'Mar', komisi: 24000000 },
  { name: 'Apr', komisi: 30500000 },
  { name: 'Mei', komisi: 37500000 },
  { name: 'Jun', komisi: 44500000 },
];

const categoryData = [
  { name: 'Fashion', value: 32 },
  { name: 'Elektronik', value: 28 },
  { name: 'Kecantikan', value: 19 },
  { name: 'Rumah', value: 13 },
  { name: 'Lainnya', value: 8 },
];

const PIE_COLORS = ['#ec4899', '#6366f1', '#10b981', '#f59e0b', '#94a3b8'];

const topSellers = [
  { rank: 1, name: 'Beauty Shop ID', owner: 'Rina K.', gmv: 78000000, products: 245 },
  { rank: 2, name: 'Digital Store', owner: 'Budi H.', gmv: 45000000, products: 124 },
  { rank: 3, name: 'Gadget Mania', owner: 'Siti A.', gmv: 32000000, products: 86 },
  { rank: 4, name: 'Fashion Update', owner: 'Andi K.', gmv: 18000000, products: 56 },
  { rank: 5, name: 'Herbal Sehat', owner: 'Dewi R.', gmv: 14000000, products: 38 },
];

const pendingVerifications = [
  { name: 'Toko Serba Murah', owner: 'Hendra W.', date: '2026-08-12', category: 'Fashion' },
  { name: 'Kreatif Studio', owner: 'Maya P.', date: '2026-08-13', category: 'Kerajinan' },
  { name: 'Fresh Mart', owner: 'Arif S.', date: '2026-08-14', category: 'Makanan' },
];

export default function SuperadminOverviewPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Platform Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Ringkasan performa marketplace COinAja secara menyeluruh.</p>
        </div>
        <button className="self-start sm:self-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
          Download Laporan
        </button>
      </div>

      {/* Platform Health Banner */}
      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-900">Platform COinAja berjalan normal ✓</p>
          <p className="text-xs text-emerald-700 mt-0.5">Semua sistem beroperasi. Uptime 99.9% • Response time avg 142ms</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="GMV Bulan Ini" value={formatRupiah(890000000)} trend="+18.5%" icon={TrendingUp} color="emerald" />
        <KPICard title="Komisi Platform (5%)" value={formatRupiah(44500000)} trend="+18.5%" icon={DollarSign} color="indigo" />
        <KPICard title="Total Pengguna" value="45,912" trend="+12.4%" icon={Users} color="blue" />
        <KPICard title="Seller Aktif" value="1,284" trend="+4.2%" icon={Store} color="pink" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* GMV Area Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Gross Merchandise Value</h2>
              <p className="text-sm text-slate-500 mt-0.5">6 bulan terakhir</p>
            </div>
            <div className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +18.5%
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvData}>
                <defs>
                  <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: any) => `${v / 1000000}M`} dx={-8} />
                <RechartsTooltip formatter={(value: any) => [formatRupiah(value), 'GMV']} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Area type="monotone" dataKey="gmv" stroke="#10b981" strokeWidth={2.5} fill="url(#gmvGrad)" dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commission Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pendapatan Komisi Platform</h2>
              <p className="text-sm text-slate-500 mt-0.5">Fee 5% dari GMV</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: any) => `${v / 1000000}Jt`} dx={-8} />
                <RechartsTooltip formatter={(value: any) => [formatRupiah(value), 'Komisi']} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Bar dataKey="komisi" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">Distribusi Kategori</h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: any) => [`${value}%`, 'Share']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Legend iconType="circle" iconSize={8} formatter={(value: any) => <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Top 5 Seller</h2>
            <a href="/superadmin/sellers" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Lihat Semua →</a>
          </div>
          <div className="divide-y divide-slate-50">
            {topSellers.map((seller) => (
              <div key={seller.rank} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${seller.rank === 1 ? 'bg-amber-400 text-white' : seller.rank === 2 ? 'bg-slate-300 text-slate-700' : seller.rank === 3 ? 'bg-amber-700/60 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {seller.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{seller.name}</p>
                  <p className="text-[11px] text-slate-400">{seller.products} produk</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-slate-900">Rp{(seller.gmv / 1000000).toFixed(0)}Jt</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Perlu Verifikasi</h2>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">{pendingVerifications.length} Pending</span>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingVerifications.map((v) => (
              <div key={v.name} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{v.name}</p>
                    <p className="text-[11px] text-slate-500">{v.owner} • {v.category}</p>
                  </div>
                  <button className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md transition-colors flex-shrink-0">
                    Verifikasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon: Icon, color }: any) {
  const colors: any = {
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-100' },
  };
  const c = colors[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <ArrowUpRight className="w-3.5 h-3.5" />
          {trend}
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-1">{title}</p>
      <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
