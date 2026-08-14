'use client';

import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import {
  DollarSign, ShoppingBag, Package, Star,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Clock, TrendingUp
} from 'lucide-react';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { useProductStore } from '@/lib/store/useProductStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { formatRupiah } from '@/lib/utils/formatters';

const revenueData = [
  { day: 'Sen', revenue: 3200000 },
  { day: 'Sel', revenue: 5100000 },
  { day: 'Rab', revenue: 4300000 },
  { day: 'Kam', revenue: 7800000 },
  { day: 'Jum', revenue: 6200000 },
  { day: 'Sab', revenue: 9400000 },
  { day: 'Min', revenue: 8100000 },
];

const orderStatusData = [
  { status: 'Belum Bayar', count: 4, color: '#f59e0b' },
  { status: 'Diproses', count: 12, color: '#6366f1' },
  { status: 'Dikirim', count: 28, color: '#3b82f6' },
  { status: 'Selesai', count: 94, color: '#10b981' },
];

export default function SellerDashboardPage() {
  const { orders } = useOrderStore();
  const { products } = useProductStore();
  const { currentUser: user } = useAuthStore();

  const pendingOrders = orders.filter(o => o.status === 'PENDING_PAYMENT' || o.status === 'PROCESSING');
  const lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0);
  const outOfStock = products.filter(p => p.stock === 0);

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-5">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Selamat Datang, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-slate-500 mt-0.5">{today}</p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200">
          <Package className="w-4 h-4" />
          Tambah Produk
        </button>
      </div>

      {/* Alert Banner */}
      {pendingOrders.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">
              Ada {pendingOrders.length} pesanan yang perlu kamu proses sekarang!
            </p>
            <p className="text-xs text-amber-700 mt-0.5">Segera konfirmasi agar pembeli tidak menunggu lama.</p>
          </div>
          <a href="/seller/orders" className="text-xs font-bold text-amber-700 hover:text-amber-900 whitespace-nowrap underline">
            Proses Sekarang →
          </a>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Pendapatan Hari Ini" value={formatRupiah(8100000)} trend="+24.1%" positive icon={DollarSign} color="pink" />
        <KPICard title="Pesanan Masuk" value={`${orders.length}`} trend="+8 Baru" positive icon={ShoppingBag} color="indigo" />
        <KPICard title="Produk Aktif" value={`${products.length}`} trend="Stabil" positive icon={Package} color="emerald" />
        <KPICard title="Rating Toko" value="4.9 / 5.0" trend="⭐ Top Seller" positive icon={Star} color="amber" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pendapatan 7 Hari Terakhir</h2>
              <p className="text-sm text-slate-500 mt-0.5">Total: <span className="font-bold text-pink-600">{formatRupiah(44100000)}</span></p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              +18.5%
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: any) => `${v / 1000000}Jt`} dx={-8} />
                <RechartsTooltip
                  formatter={(value: any) => [formatRupiah(value), 'Pendapatan']}
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ r: 3, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-900 mb-5">Status Pesanan</h2>
          <div className="space-y-3">
            {orderStatusData.map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{item.status}</span>
                  <span className="text-sm font-bold text-slate-900">{item.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(item.count / 94) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total Pesanan</span>
              <span className="text-lg font-bold text-slate-900">138</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Pesanan Terbaru</h2>
            <a href="/seller/orders" className="text-xs font-semibold text-pink-600 hover:text-pink-700">Lihat Semua →</a>
          </div>
          <div className="divide-y divide-slate-50">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-xs font-mono font-bold text-pink-600">{order.id}</p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">{order.customerName}</p>
                  <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{formatRupiah(order.totalAmount)}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                    order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'PROCESSING' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">Belum ada pesanan</div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Stok Perlu Diisi</h2>
            <a href="/seller/products" className="text-xs font-semibold text-pink-600 hover:text-pink-700">Kelola Produk →</a>
          </div>
          <div className="divide-y divide-slate-50">
            {outOfStock.slice(0, 2).map((p) => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">HABIS</span>
                </div>
              </div>
            ))}
            {lowStockProducts.slice(0, 3).map((p) => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">Sisa {p.stock} unit</span>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && outOfStock.length === 0 && (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">Semua stok aman ✅</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, positive, icon: Icon, color }: any) {
  const colors: any = {
    pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
  };
  const c = colors[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {trend}
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-1">{title}</p>
      <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
