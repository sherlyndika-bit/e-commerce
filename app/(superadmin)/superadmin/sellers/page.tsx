'use client';

import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, Ban, MoreVertical, Store } from 'lucide-react';

const mockSellers = [
  { id: 'SELLER-001', name: 'Digital Store', owner: 'Budi Haryanto', products: 124, gmv: 45000000, status: 'VERIFIED', joinDate: '2023-01-15' },
  { id: 'SELLER-002', name: 'Gadget Mania', owner: 'Siti Aminah', products: 86, gmv: 32000000, status: 'VERIFIED', joinDate: '2023-03-22' },
  { id: 'SELLER-003', name: 'Beauty Shop ID', owner: 'Rina Karlina', products: 245, gmv: 78000000, status: 'VERIFIED', joinDate: '2022-11-05' },
  { id: 'SELLER-004', name: 'Fashion Update', owner: 'Andi Kusuma', products: 56, gmv: 12000000, status: 'PENDING', joinDate: '2024-01-10' },
  { id: 'SELLER-005', name: 'Toko Serba Ada', owner: 'Bambang S.', products: 12, gmv: 1500000, status: 'BANNED', joinDate: '2023-12-01' },
];

export default function SuperadminSellersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Penjual</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola dan awasi aktivitas seluruh toko yang terdaftar di COinAja.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama toko atau ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              Status Toko
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-medium">Toko</th>
                <th className="px-6 py-4 font-medium">Pemilik</th>
                <th className="px-6 py-4 font-medium">Total Produk</th>
                <th className="px-6 py-4 font-medium">GMV Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                        <Store className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{seller.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">ID: {seller.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{seller.owner}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Bergabung: {seller.joinDate}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {seller.products}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    Rp{(seller.gmv / 1000000).toFixed(1)}Jt
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      seller.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                      seller.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {seller.status === 'VERIFIED' && <ShieldCheck className="w-3 h-3 mr-1" />}
                      {seller.status === 'BANNED' && <Ban className="w-3 h-3 mr-1" />}
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md transition-colors">
                        Lihat Detail
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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
