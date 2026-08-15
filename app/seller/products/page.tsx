'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useProductStore } from '@/lib/store/useProductStore';
import { formatRupiah } from '@/lib/utils/formatters';
import { Search, Plus, SlidersHorizontal, Edit2, Trash2, Archive, Package } from 'lucide-react';

export default function SellerProductsPage() {
  const { products, deleteProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'semua' | 'aktif' | 'habis'>('semua');

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'aktif') return matchSearch && p.stock > 0;
    if (activeTab === 'habis') return matchSearch && p.stock === 0;
    return matchSearch;
  });

  const activeCount = products.filter(p => p.stock > 0).length;
  const outCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Produk Saya</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kelola semua produk yang kamu jual di TumbasCO.</p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Tambah Produk
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Produk', value: products.length, color: 'text-slate-900' },
          { label: 'Produk Aktif', value: activeCount, color: 'text-emerald-600' },
          { label: 'Stok Habis', value: outCount, color: 'text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex border border-slate-200 rounded-lg overflow-hidden text-sm font-medium flex-shrink-0">
            {(['semua', 'aktif', 'habis'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 capitalize transition-colors ${activeTab === tab ? 'bg-pink-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama produk atau SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex-shrink-0 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">Produk</th>
                <th className="px-5 py-3.5">Harga</th>
                <th className="px-5 py-3.5">Stok</th>
                <th className="px-5 py-3.5">Terjual</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden relative flex-shrink-0 border border-slate-100 bg-slate-50">
                        {product.images[0] && (
                          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">{product.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">SKU: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-bold text-slate-900">{formatRupiah(product.price)}</p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-[11px] text-slate-400 line-through">{formatRupiah(product.originalPrice)}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      product.stock > 10 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      product.stock > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {product.stock > 0 ? `${product.stock} unit` : 'Habis'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 font-medium">{product.soldCount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      product.stock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {product.stock > 0 ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Arsipkan">
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">Tidak ada produk ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> produk</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-sm text-slate-400 hover:text-slate-700 disabled:opacity-40" disabled>← Prev</button>
            <button className="w-7 h-7 text-sm font-bold bg-pink-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1 text-sm text-slate-400 hover:text-slate-700">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
