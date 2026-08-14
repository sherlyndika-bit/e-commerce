'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { sellerService } from '@/lib/services/sellerService';
import { productService } from '@/lib/services/productService';
import { orderService } from '@/lib/services/orderService';
import { Seller } from '@/lib/types/seller';
import { Product } from '@/lib/types/product';
import { Order } from '@/lib/types/order';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah, formatCompactNumber } from '@/lib/utils/formatters';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Store,
  DollarSign,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

export default function AdminPortalPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'sellers' | 'moderation'>('overview');

  const { addToast } = useToastStore();

  useEffect(() => {
    sellerService.getAll().then((s) => setSellers(s));
    productService.getAll().then((p) => setProducts(p));
    orderService.getAll().then((o) => setOrders(o));
  }, []);

  const totalGMV = orders.reduce((sum, o) => sum + o.grandTotal, 0) + 148500000;

  const handleToggleOfficial = async (seller: Seller) => {
    const newBadge = seller.badge === 'official' ? 'star' : 'official';
    const updated = await sellerService.updateSeller(seller.id, { badge: newBadge });
    if (updated) {
      setSellers(sellers.map((s) => (s.id === updated.id ? updated : s)));
      addToast({
        title: `Status Toko ${seller.name} Diperbarui!`,
        description: `Sekarang berstatus: ${newBadge === 'official' ? 'Official Store' : 'Star Seller'}`,
        type: 'success',
      });
    }
  };

  const handleToggleProductStatus = async (product: Product) => {
    const updated = await productService.updateProduct(product.id, { isActive: !product.isActive });
    if (updated) {
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      addToast({
        title: `Moderasi Produk: ${updated.isActive ? 'Diaktifkan' : 'Dinonaktifkan'}`,
        description: product.title,
        type: updated.isActive ? 'success' : 'warning',
      });
    }
  };

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-elevated mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-500 text-slate-950 shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">Portal Super Admin</h1>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Master Control
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Pengawasan transaksi marketplace, verifikasi toko seller, dan moderasi konten.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/seller">
              <Button variant="secondary" size="sm">
                Lihat Seller Center
              </Button>
            </Link>
            <Link href="/">
              <Button variant="primary" size="sm">
                Buka Marketplace
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block">Gross Merchandise Value (GMV)</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {formatRupiah(totalGMV)}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block">Total Penjual Terdaftar</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {sellers.length} Seller Aktif
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block">Total Pengguna Terdaftar</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                142.500 Pengguna
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block">Total Produk di Platform</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {products.length} Produk
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Verifikasi Seller ({sellers.length})
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'moderation'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Moderasi Katalog Produk ({products.length})
          </button>
        </div>

        {/* TAB 1: SELLER VERIFICATION */}
        {activeTab === 'overview' && (
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Daftar Penjual & Status Verifikasi Official
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Nama Toko & Penjual</th>
                    <th className="py-3 px-4">Kota Asal</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Total Terjual</th>
                    <th className="py-3 px-4">Badge Saat Ini</th>
                    <th className="py-3 px-4 text-right">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <Image src={s.avatar} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{s.name}</p>
                            <p className="text-[11px] text-slate-400">@{s.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {s.city}
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-500">
                        ★ {s.rating}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {formatCompactNumber(s.totalSold)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={s.badge === 'official' ? 'official' : 'star'} size="xs">
                          {s.badge === 'official' ? 'Official Store' : 'Star Seller'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleOfficial(s)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                            s.badge === 'official'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          {s.badge === 'official' ? 'Ubah ke Star' : 'Jadikan Official'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MODERATION */}
        {activeTab === 'moderation' && (
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Moderasi Katalog Produk Marketplace
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Produk</th>
                    <th className="py-3 px-4">Penjual</th>
                    <th className="py-3 px-4">Harga</th>
                    <th className="py-3 px-4">Status Moderasi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <Image src={p.images[0]} alt="" fill className="object-cover" />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {p.title}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {p.sellerName}
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-500">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                            p.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {p.isActive ? 'Tayang di Katalog' : 'Ditangguhkan'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleProductStatus(p)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                            p.isActive
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {p.isActive ? 'Tangguhkan' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
