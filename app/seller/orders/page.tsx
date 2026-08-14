'use client';

import React, { useState } from 'react';
import { useOrderStore, OrderStatus } from '@/lib/store/useOrderStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { formatRupiah } from '@/lib/utils/formatters';
import { Search, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';

const TABS: { id: OrderStatus | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Semua' },
  { id: 'PENDING_PAYMENT', label: 'Belum Bayar' },
  { id: 'PROCESSING', label: 'Diproses' },
  { id: 'SHIPPED', label: 'Dikirim' },
  { id: 'DELIVERED', label: 'Selesai' },
  { id: 'CANCELLED', label: 'Dibatalkan' },
];

const statusStyle: Record<string, string> = {
  PENDING_PAYMENT: 'bg-amber-100 text-amber-800 border-amber-200',
  PROCESSING: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  SHIPPED: 'bg-blue-100 text-blue-800 border-blue-200',
  DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: 'Belum Bayar',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

export default function SellerOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = orders.filter(o => {
    const matchTab = activeTab === 'ALL' || o.status === activeTab;
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const countFor = (tab: OrderStatus | 'ALL') =>
    tab === 'ALL' ? orders.length : orders.filter(o => o.status === tab).length;

  const handleAction = (orderId: string, newStatus: OrderStatus) => {
    const tracking = newStatus === 'SHIPPED' ? {
      trackingNumber: `JNE-${Date.now().toString().slice(-8)}`,
      courier: 'JNE Express'
    } : undefined;
    updateOrderStatus(orderId, newStatus, tracking);
    addToast({ title: 'Status Diperbarui', description: `Pesanan ${orderId} → ${statusLabel[newStatus]}`, type: 'success' });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Manajemen Pesanan</h1>
        <p className="text-sm text-slate-500 mt-0.5">Proses dan pantau semua pesanan dari pembeli.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 bg-white border border-slate-100 rounded-xl p-1.5 shadow-sm hide-scrollbar">
        {TABS.map((tab) => {
          const count = countFor(tab.id);
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                active ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari ID pesanan atau nama pembeli..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:border-pink-400 transition-all"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-md">{order.id}</span>
                <span className="text-xs text-slate-400 hidden sm:block">
                  {new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle[order.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {statusLabel[order.status] || order.status}
              </span>
            </div>

            {/* Order Body */}
            <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-5">
              {/* Product Info */}
              <div className="flex items-start gap-3 flex-1">
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-100">
                  {order.items[0]?.image ? (
                    <img src={order.items[0].image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-slate-400" /></div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.items[0]?.productName}
                    {order.items.length > 1 && <span className="text-slate-400 font-normal"> +{order.items.length - 1} lainnya</span>}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">👤 {order.customerName} • {order.customerPhone}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">📍 {order.shippingAddress}</p>
                </div>
              </div>

              {/* Price + Actions */}
              <div className="flex items-center justify-between lg:justify-end lg:gap-6 lg:flex-shrink-0">
                <div className="lg:text-right">
                  <p className="text-xs text-slate-400">Total Pembayaran</p>
                  <p className="text-base font-bold text-slate-900">{formatRupiah(order.totalAmount)}</p>
                </div>
                <div>
                  {order.status === 'PENDING_PAYMENT' && (
                    <button
                      onClick={() => handleAction(order.id, 'PROCESSING')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      ✓ Konfirmasi Bayar
                    </button>
                  )}
                  {order.status === 'PROCESSING' && (
                    <button
                      onClick={() => handleAction(order.id, 'SHIPPED')}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5 inline mr-1" />
                      Kirim Sekarang
                    </button>
                  )}
                  {order.status === 'SHIPPED' && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                      <Truck className="w-3.5 h-3.5" />
                      {order.courier || 'Dalam Pengiriman'}
                    </div>
                  )}
                  {order.status === 'DELIVERED' && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Pesanan Selesai
                    </div>
                  )}
                  {order.status === 'CANCELLED' && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                      <XCircle className="w-3.5 h-3.5" />
                      Dibatalkan
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Tidak ada pesanan</p>
            <p className="text-xs text-slate-400 mt-1">Pesanan dengan status ini akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
