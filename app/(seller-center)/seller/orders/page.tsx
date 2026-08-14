'use client';

import React, { useState } from 'react';
import { useOrderStore, OrderStatus } from '@/lib/store/useOrderStore';
import { formatRupiah } from '@/lib/utils/formatters';
import { Search, Filter, Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useToastStore } from '@/lib/store/useToastStore';

export default function ERPOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'ALL'>('ALL');

  const filteredOrders = orders.filter(
    (o) => activeTab === 'ALL' || o.status === activeTab
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    let trackingInfo;
    if (newStatus === 'SHIPPED') {
      trackingInfo = {
        trackingNumber: `COINAJA-${Math.floor(Math.random() * 1000000000)}`,
        courier: 'J&T Express'
      };
    }
    
    updateOrderStatus(orderId, newStatus, trackingInfo);
    
    addToast({
      title: 'Status Pesanan Diperbarui',
      description: `Pesanan ${orderId} sekarang berstatus ${newStatus}.`,
      type: 'success'
    });
  };

  const tabs = [
    { id: 'ALL', label: 'Semua', count: orders.length },
    { id: 'PENDING_PAYMENT', label: 'Belum Bayar', count: orders.filter(o => o.status === 'PENDING_PAYMENT').length },
    { id: 'PROCESSING', label: 'Diproses', count: orders.filter(o => o.status === 'PROCESSING').length },
    { id: 'SHIPPED', label: 'Dikirim', count: orders.filter(o => o.status === 'SHIPPED').length },
    { id: 'DELIVERED', label: 'Selesai', count: orders.filter(o => o.status === 'DELIVERED').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Pesanan</h1>
        <p className="text-sm text-slate-500 mt-1">Proses pesanan masuk dan pantau status pengiriman.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari ID pesanan, nama pembeli..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            Urutkan
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-200">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left: Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {order.id}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-4 mt-4">
                    <div className="w-12 h-12 rounded bg-slate-100 shrink-0 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                      {order.items[0]?.image ? (
                        <img src={order.items[0].image} alt="Product" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {order.items[0]?.productName} {order.items.length > 1 && `+ ${order.items.length - 1} produk lainnya`}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {order.customerName} • {order.customerPhone}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {order.shippingAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="lg:w-72 shrink-0 flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
                  <div className="w-full flex items-center justify-between lg:justify-end lg:gap-4 mb-4">
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-slate-500 mb-0.5">Total Belanja</p>
                      <p className="text-lg font-bold text-slate-900">{formatRupiah(order.totalAmount)}</p>
                    </div>
                  </div>
                  
                  <div className="w-full flex gap-2">
                    {order.status === 'PENDING_PAYMENT' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'PROCESSING')}
                        className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        Tandai Dibayar
                      </button>
                    )}
                    
                    {order.status === 'PROCESSING' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'SHIPPED')}
                        className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center shadow-sm"
                      >
                        Kirim Pesanan
                      </button>
                    )}
                    
                    {order.status === 'SHIPPED' && (
                      <button 
                        disabled
                        className="flex-1 bg-slate-100 text-slate-500 py-2 px-3 rounded-lg text-sm font-medium border border-slate-200 text-center cursor-not-allowed"
                      >
                        Sedang Dikirim ({order.courier})
                      </button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <div className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 py-2 px-3 rounded-lg text-sm font-bold border border-emerald-200 text-center">
                        <CheckCircle className="w-4 h-4" /> Selesai
                      </div>
                    )}
                  </div>
                </div>
                
              </div>
            </div>
          ))}
          
          {filteredOrders.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                <Package className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium text-slate-900">Belum ada pesanan</h3>
              <p className="text-sm text-slate-500 mt-1">Pesanan dengan status ini akan muncul di sini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
