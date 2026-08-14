'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { orderService } from '@/lib/services/orderService';
import { productService } from '@/lib/services/productService';
import { mockVouchers } from '@/lib/mock-data/vouchers';
import { Order, OrderStatus } from '@/lib/types/order';
import { Product } from '@/lib/types/product';
import { Address } from '@/lib/types/user';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { InvoiceModal } from '@/components/checkout/InvoiceModal';
import { formatRupiah, formatDateIndo } from '@/lib/utils/formatters';
import {
  Package,
  Heart,
  MapPin,
  Sparkles,
  Ticket,
  User as UserIcon,
  Store,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react';

function AccountContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'orders' | 'wishlist' | 'addresses' | 'coins' | 'profile' | null;

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'coins' | 'profile'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'processing' | 'shipping' | 'completed'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const { currentUser, addAddress } = useAuthStore();
  const { wishlistIds } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    orderService.getByUserId(currentUser.id).then((ords) => setOrders(ords));
  }, [currentUser.id]);

  useEffect(() => {
    productService.getAll().then((prods) => {
      setWishlistProducts(prods.filter((p) => wishlistIds.includes(p.id)));
    });
  }, [wishlistIds]);

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.storeOrders.some((so) => so.status === orderStatusFilter);
  });

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Greeting Hero Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-brand-900 text-white rounded-3xl p-6 sm:p-8 shadow-elevated mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-brand-400 shrink-0">
              <Image src={currentUser.avatar} alt={currentUser.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{currentUser.name}</h1>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" /> {currentUser.memberTier} Member
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1">{currentUser.email} • {currentUser.phone}</p>
            </div>
          </div>

          {/* Quick Balance Cards */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 min-w-36">
              <span className="text-[11px] text-amber-300 font-bold block flex items-center gap-1">
                💰 Koin COinaja
              </span>
              <span className="text-lg font-black text-white mt-0.5 block">
                {formatRupiah(currentUser.coinBalance)}
              </span>
            </div>

            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 min-w-36">
              <span className="text-[11px] text-brand-300 font-bold block flex items-center gap-1">
                🎟️ Kupon Saya
              </span>
              <span className="text-lg font-black text-white mt-0.5 block">
                {mockVouchers.length} Kupon Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Nav (Col 3) */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-subtle space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
                  activeTab === 'orders'
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Pesanan Saya</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
                  activeTab === 'wishlist'
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </div>
                {wishlistIds.length > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full">
                    {wishlistIds.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
                  activeTab === 'addresses'
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Alamat Pengiriman</span>
              </button>

              <button
                onClick={() => setActiveTab('coins')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
                  activeTab === 'coins'
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Voucher & Koin</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
                  activeTab === 'profile'
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Profil Akun</span>
              </button>
            </div>
          </div>

          {/* Main Tab Content (Col 9) */}
          <div className="lg:col-span-9">
            {/* TAB 1: PESANAN SAYA */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {/* Status Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Semua Pesanan' },
                    { id: 'processing', label: 'Diproses Penjual' },
                    { id: 'shipping', label: 'Sedang Dikirim' },
                    { id: 'completed', label: 'Selesai' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setOrderStatusFilter(filter.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        orderStatusFilter === filter.id
                          ? 'bg-brand-500 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      Tidak ada pesanan pada status ini
                    </h3>
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {ord.orderNumber}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-400">
                            {formatDateIndo(ord.createdAt)}
                          </span>
                        </div>
                        <span className="font-bold text-brand-500 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-0.5 rounded-full text-[11px]">
                          {ord.paymentStatus === 'paid' ? 'Lunas' : 'Belum Bayar'} ({ord.paymentMethodName})
                        </span>
                      </div>

                      {/* Store Sub-Orders */}
                      {ord.storeOrders.map((storeOrder) => (
                        <div key={storeOrder.sellerId} className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Store className="w-4 h-4 text-brand-500" />
                              <span className="font-bold text-slate-900 dark:text-white">
                                {storeOrder.sellerName}
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                              {storeOrder.status === 'shipping' ? '🚚 Sedang Dikirim' : storeOrder.status === 'processing' ? '📦 Sedang Diproses' : '✅ Selesai'}
                            </span>
                          </div>

                          {storeOrder.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                                <Image src={item.productImage} alt={item.productTitle} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {item.productTitle}
                                </p>
                                {item.variantSelected && (
                                  <p className="text-[11px] text-slate-400">
                                    Variasi: {item.variantSelected}
                                  </p>
                                )}
                                <p className="text-xs text-brand-500 font-semibold mt-0.5">
                                  {item.quantity} x {formatRupiah(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Order Footer & Tracking Trigger */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Total Pesanan:</span>
                          <span className="font-black text-base text-brand-500">
                            {formatRupiah(ord.grandTotal)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            variant="secondary"
                            size="sm"
                          >
                            📄 Invoice
                          </Button>
                          <Button
                            onClick={() => setSelectedOrderForTracking(ord)}
                            variant="outline"
                            size="sm"
                            leftIcon={<Truck className="w-3.5 h-3.5 text-brand-600" />}
                          >
                            Lacak
                          </Button>
                          <Button
                            onClick={() => {
                              addToast({
                                title: 'Barang ditambahkan kembali ke keranjang!',
                                type: 'success',
                              });
                            }}
                            variant="primary"
                            size="sm"
                          >
                            Beli Lagi
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Wishlist Favorit Saya ({wishlistProducts.length})
                </h3>
                <ProductGrid
                  products={wishlistProducts}
                  emptyMessage="Belum ada barang di wishlist. Klik ikon hati pada produk yang kamu suka!"
                  columns={3}
                />
              </div>
            )}

            {/* TAB 3: ALAMAT TERSIMPAN */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Daftar Alamat Pengiriman
                  </h3>
                  <Button
                    onClick={() =>
                      addToast({
                        title: 'Form Tambah Alamat',
                        description: 'Gunakan tombol di form checkout untuk tambah alamat instan.',
                        type: 'info',
                      })
                    }
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Tambah Alamat
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-subtle text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {addr.recipientName}
                          </span>
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-[10px]">
                            {addr.label}
                          </span>
                        </div>
                        {addr.isDefault && (
                          <span className="bg-brand-500 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                            Alamat Utama
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 font-semibold">{addr.phone}</p>
                      <p className="text-slate-600 dark:text-slate-300">{addr.fullAddress}</p>
                      <p className="text-slate-400">
                        {addr.district}, {addr.city}, {addr.province} {addr.postalCode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: VOUCHER & KOIN */}
            {activeTab === 'coins' && (
              <div className="space-y-6">
                {/* Coin balance banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 to-brand-500 text-white shadow-md">
                  <span className="text-xs font-bold text-white/90">Saldo Koin COinaja Kamu</span>
                  <h3 className="text-3xl font-black mt-1">
                    {formatRupiah(currentUser.coinBalance)}
                  </h3>
                  <p className="text-xs text-white/80 mt-1">
                    1 Koin = Rp1. Bisa langsung dipotong saat checkout di seluruh toko marketplace!
                  </p>
                </div>

                {/* Vouchers Grid */}
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Koleksi Voucher Tersedia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockVouchers.map((v) => (
                    <div
                      key={v.id}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center justify-between"
                    >
                      <div>
                        <span className="font-black text-sm text-brand-500 block">
                          {v.title}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">{v.description}</p>
                        <span className="text-[11px] font-bold text-slate-400 mt-2 block">
                          Kode: <strong className="text-slate-800 dark:text-slate-200">{v.code}</strong>
                        </span>
                      </div>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(v.code);
                          addToast({
                            title: 'Kode Voucher Disalin! 📋',
                            description: v.code,
                            type: 'success',
                          });
                        }}
                        variant="outline"
                        size="xs"
                      >
                        Salin Kode
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PROFIL */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-subtle space-y-4 max-w-xl">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Informasi Akun
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      defaultValue={currentUser.name}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={currentUser.email}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Nomor Telepon</label>
                    <input
                      type="tel"
                      defaultValue={currentUser.phone}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>
                  <Button
                    onClick={() =>
                      addToast({
                        title: 'Profil Berhasil Diperbarui!',
                        type: 'success',
                      })
                    }
                    variant="primary"
                    size="md"
                    className="mt-2"
                  >
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Tracking Modal */}
        <Modal
          isOpen={selectedOrderForTracking !== null}
          onClose={() => setSelectedOrderForTracking(null)}
          title={`Lacak Pesanan #${selectedOrderForTracking?.orderNumber}`}
          maxWidth="lg"
        >
          {selectedOrderForTracking && (
            <div className="space-y-4">
              {selectedOrderForTracking.storeOrders.map((so) => (
                <div key={so.sellerId} className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs flex justify-between">
                    <span className="font-bold">{so.sellerName}</span>
                    <span className="text-brand-500 font-bold">{so.shipping.courierName} ({so.trackingNumber})</span>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-brand-500 ml-2 text-xs">
                    {so.statusHistory.map((h, i) => (
                      <div key={i}>
                        <p className="font-bold text-slate-900 dark:text-white">{h.title}</p>
                        <p className="text-slate-500">{h.description}</p>
                        <span className="text-[10px] text-slate-400">{formatDateIndo(h.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>

        {/* Printable Invoice Modal */}
        <InvoiceModal
          order={selectedOrderForInvoice}
          isOpen={selectedOrderForInvoice !== null}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-xs font-bold text-slate-500">Memuat Dashboard Akun...</p>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
