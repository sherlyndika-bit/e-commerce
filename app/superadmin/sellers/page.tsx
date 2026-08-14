'use client';

import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, Ban, MoreVertical, Store, Clock } from 'lucide-react';

const mockSellers = [
  { id: 'SELLER-001', name: 'Beauty Shop ID', owner: 'Rina Karlina', email: 'rina@beautyshop.com', products: 245, gmv: 78000000, commission: 3900000, status: 'VERIFIED', joinDate: '2022-11-05' },
  { id: 'SELLER-002', name: 'Digital Store', owner: 'Budi Haryanto', email: 'budi@digitalstore.com', products: 124, gmv: 45000000, commission: 2250000, status: 'VERIFIED', joinDate: '2023-01-15' },
  { id: 'SELLER-003', name: 'Gadget Mania', owner: 'Siti Aminah', email: 'siti@gadgetmania.com', products: 86, gmv: 32000000, commission: 1600000, status: 'VERIFIED', joinDate: '2023-03-22' },
  { id: 'SELLER-004', name: 'Herbal Sehat', owner: 'Dewi Rahayu', email: 'dewi@herbalsehat.com', products: 38, gmv: 14000000, commission: 700000, status: 'VERIFIED', joinDate: '2023-07-01' },
  { id: 'SELLER-005', name: 'Fashion Update', owner: 'Andi Kusuma', email: 'andi@fashionupdate.com', products: 56, gmv: 12000000, commission: 600000, status: 'PENDING', joinDate: '2024-01-10' },
  { id: 'SELLER-006', name: 'Toko Serba Murah', owner: 'Hendra Wijaya', email: 'hendra@serbamurah.com', products: 12, gmv: 3200000, commission: 160000, status: 'PENDING', joinDate: '2026-08-12' },
  { id: 'SELLER-007', name: 'Kreatif Studio', owner: 'Maya Puspita', email: 'maya@kreatif.com', products: 8, gmv: 1800000, commission: 90000, status: 'PENDING', joinDate: '2026-08-13' },
  { id: 'SELLER-008', name: 'Toko Serba Ada', owner: 'Bambang Santoso', email: 'bamb@serbaada.com', products: 4, gmv: 500000, commission: 25000, status: 'BANNED', joinDate: '2023-12-01' },
];

type SellerStatus = 'ALL' | 'VERIFIED' | 'PENDING' | 'BANNED';

const statusStyle: Record<string, string> = {
  VERIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  BANNED: 'bg-red-100 text-red-800 border-red-200',
};

export default function SuperadminSellersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<SellerStatus>('ALL');

  const filtered = mockSellers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'ALL' || s.status === activeTab;
    return matchSearch && matchTab;
  });

  const count = (tab: SellerStatus) => tab === 'ALL' ? mockSellers.length : mockSellers.filter(s => s.status === tab).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Manajemen Seller</h1>
        <p className="text-sm text-slate-500 mt-0.5">Kelola dan pantau seluruh penjual yang terdaftar di COinAja.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(['ALL', 'VERIFIED', 'PENDING', 'BANNED'] as SellerStatus[]).map((tab) => (
          <div key={tab} className={`bg-white rounded-2xl border shadow-sm p-4 cursor-pointer transition-all ${activeTab === tab ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-100'}`} onClick={() => setActiveTab(tab)}>
            <p className={`text-2xl font-bold ${tab === 'VERIFIED' ? 'text-emerald-600' : tab === 'PENDING' ? 'text-amber-600' : tab === 'BANNED' ? 'text-red-600' : 'text-slate-900'}`}>{count(tab)}</p>
            <p className="text-xs text-slate-500 mt-0.5 capitalize">{tab === 'ALL' ? 'Total Seller' : tab === 'VERIFIED' ? 'Terverifikasi' : tab === 'PENDING' ? 'Menunggu Verifikasi' : 'Diblokir'}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama toko, ID, atau pemilik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex-shrink-0 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">Toko</th>
                <th className="px-5 py-3.5">Pemilik</th>
                <th className="px-5 py-3.5">Produk</th>
                <th className="px-5 py-3.5">Total GMV</th>
                <th className="px-5 py-3.5">Komisi</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Store className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{seller.name}</p>
                        <p className="text-[11px] text-slate-400">{seller.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-slate-800">{seller.owner}</p>
                    <p className="text-[11px] text-slate-400">{seller.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{seller.products}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-slate-900">Rp{(seller.gmv / 1000000).toFixed(1)}Jt</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-indigo-700">Rp{(seller.commission / 1000).toFixed(0)}K</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle[seller.status]}`}>
                      {seller.status === 'VERIFIED' && <ShieldCheck className="w-3 h-3" />}
                      {seller.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {seller.status === 'BANNED' && <Ban className="w-3 h-3" />}
                      {seller.status === 'VERIFIED' ? 'Terverifikasi' : seller.status === 'PENDING' ? 'Pending' : 'Diblokir'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {seller.status === 'PENDING' && (
                        <button className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">
                          Verifikasi
                        </button>
                      )}
                      <button className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md transition-colors">
                        Detail
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> dari {mockSellers.length} seller</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-sm text-slate-400 disabled:opacity-40" disabled>← Prev</button>
            <button className="w-7 h-7 text-sm font-bold bg-emerald-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1 text-sm text-slate-400">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
