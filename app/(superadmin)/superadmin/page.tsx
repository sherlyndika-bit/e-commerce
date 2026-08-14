'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  DollarSign, 
  Store, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
} from 'lucide-react';
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
  { name: 'Jan', commission: 22500000 },
  { name: 'Feb', commission: 26000000 },
  { name: 'Mar', commission: 24000000 },
  { name: 'Apr', commission: 30500000 },
  { name: 'Mei', commission: 37500000 },
  { name: 'Jun', commission: 44500000 },
];

export default function SuperadminOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Metrik tingkat tinggi untuk memantau performa marketplace COinAja.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          Download Laporan Keuangan
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard 
          title="Total GMV (Bulan Ini)" 
          value={formatRupiah(890000000)}
          trend="+18.5%" 
          isPositive={true} 
          icon={TrendingUp} 
          color="emerald" 
        />
        <KPICard 
          title="Pendapatan Komisi (5%)" 
          value={formatRupiah(44500000)}
          trend="+18.5%" 
          isPositive={true} 
          icon={DollarSign} 
          color="indigo" 
        />
        <KPICard 
          title="Total Penjual Aktif" 
          value="1,284" 
          trend="+4.2%" 
          isPositive={true} 
          icon={Store} 
          color="blue" 
        />
        <KPICard 
          title="Total Pengguna" 
          value="45,912" 
          trend="+12.4%" 
          isPositive={true} 
          icon={Users} 
          color="pink" 
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GMV Line Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Gross Merchandise Value (GMV)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gmvData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  tickFormatter={(val) => `Rp${val / 1000000}M`}
                  dx={-10}
                />
                <RechartsTooltip 
                  formatter={(value: any) => [formatRupiah(value), 'GMV']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="gmv" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commission Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Pendapatan Komisi (Platform Fee)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  tickFormatter={(val) => `Rp${val / 1000000}M`}
                  dx={-10} 
                />
                <RechartsTooltip 
                  cursor={{fill: '#f1f5f9'}}
                  formatter={(value: any) => [formatRupiah(value), 'Komisi']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="commission" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, isPositive, icon: Icon, color }: any) {
  const colorMap: any = {
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : null}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
