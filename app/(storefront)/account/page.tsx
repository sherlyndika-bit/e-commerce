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
import { Order } from '@/lib/types/order';
import { Product } from '@/lib/types/product';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
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
  Plus,
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

  const { currentUser } = useAuthStore();
  const { wishlistIds } = useWishlistStore();
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
    <div className="py-4 sm:py-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Greeting Hero Card */}
        <div className="bg-pink-950 text-white rounded-lg p-5 sm:p-6 shadow-2xs mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-pink-400 shrink-0 bg-white">
              <Image src={currentUser.avatar} alt={currentUser.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold">{currentUser.name}</h1>
                <span className="bg-amber-400 text-slate-950 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> {currentUser.memberTier} Member
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{currentUser.email} • {currentUser.phone}</p>
            </div>
          </div>

          {/* Quick Balance Cards */}
          <div className="flex items-center gap-2.5">
            <div className="p-3 bg-white/10 rounded-lg border border-white/15 min-w-32">
              <span className="text-[10px] text-amber-300 font-bold block">
                💰 Koin COinaja
              </span>
              <span className="text-sm sm:text-base font-bold text-white mt-0.5 block">
                {formatRupiah(currentUser.coinBalance)}
              </span>
            </div>

            <div className="p-3 bg-white/10 rounded-lg border border-white/15 min-w-32">
              <span className="text-[10px] text-pink-300 font-bold block">
                🎟️ Kupon Aktif
              </span>
              <span className="text-sm sm:text-base font-bold text-white mt-0.5 block">
                {mockVouchers.length} Kupon
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Sidebar Nav (Col 3) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-slate-200/90 p-2 shadow-2xs space-y-0.5">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-bold transition-colors text-left ${
                  activeTab === 'orders'
                    ? 'bg-pink-600 text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Pesanan Saya</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold transition-colors text-left ${
                  activeTab === 'wishlist'
                    ? 'bg-pink-600 text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </div>
                {wishlistIds.length > 0 && (
                  <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full">
                    {wishlistIds.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-bold transition-colors text-left ${
                  activeTab === 'addresses'
                    ? 'bg-pink-600 text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Alamat Pengiriman</span>
              </button>

              <button
                onClick={() => setActiveTab('coins')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-bold transition-colors text-left ${
                  activeTab === 'coins'
                    ? 'bg-pink-600 text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Voucher & Koin</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-bold transition-colors text-left ${
                  activeTab === 'profile'
                    ? 'bg-pink-600 text-white'
                    : 'text-slate-700 hover:bg-slate-50'
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
              <div className="space-y-3">
                {/* Status Filter Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'Semua Pesanan' },
                    { id: 'processing', label: 'Diproses' },
                    { id: 'shipping', label: 'Dikirim' },
                    { id: 'completed', label: 'Selesai' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setOrderStatusFilter(filter.id as any)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors whitespace-nowrap ${
                        orderStatusFilter === filter.id
                          ? 'bg-pink-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-lg border border-slate-200/90 p-8 text-center">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-xs sm:text-sm text-slate-700">
                      Tidak ada pesanan pada status ini
                    </h3>
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs space-y-3"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">
                            {ord.orderNumber}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400 text-[11px]">
                            {formatDateIndo(ord.createdAt)}
                          </span>
                        </div>
                        <span className="font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded text-[10px]">
                          {ord.paymentStatus === 'paid' ? 'Lunas' : 'Belum Bayar'} ({ord.paymentMethodName})
                        </span>
                      </div>

                      {/* Store Sub-Orders */}
                      {ord.storeOrders.map((storeOrder) => (
                        <div key={storeOrder.sellerId} className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <Store className="w-3.5 h-3.5 text-pink-600" />
                              <span className="font-bold text-slate-900">
                                {storeOrder.sellerName}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-1.5 py-0.2 rounded">
                              {storeOrder.status === 'shipping' ? '🚚 Sedang Dikirim' : storeOrder.status === 'processing' ? '📦 Diproses' : '✅ Selesai'}
                            </span>
                          </div>

                          {storeOrder.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-md">
                              <div className="relative w-12 h-12 rounded overflow-hidden bg-slate-200 shrink-0">
                                <Image src={item.productImage} alt={item.productTitle} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {item.productTitle}
                                </p>
                                {item.variantSelected && (
                                  <p className="text-[10px] text-slate-400">
                                    Variasi: {item.variantSelected}
                                  </p>
                                )}
                                <p className="text-xs text-pink-600 font-semibold mt-0.5">
                                  {item.quantity} x {formatRupiah(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Order Footer */}
                      <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px]">Total Belanja:</span>
                          <span className="font-black text-sm text-slate-900 block">
                            {formatRupiah(ord.grandTotal)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <Button
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            variant="outline"
                            size="xs"
                          >
                            📄 Invoice
                          </Button>
                          <Button
                            onClick={() => setSelectedOrderForTracking(ord)}
                            variant="outline"
                            size="xs"
                            leftIcon={<Truck className="w-3 h-3 text-pink-600" />}
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
                            size="xs"
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
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900">
                  Wishlist Favorit Saya ({wishlistProducts.length})
                </h3>
                <ProductGrid
                  products={wishlistProducts}
                  emptyMessage="Belum ada barang di wishlist. Klik ikon hati pada produk yang kamu suka!"
                  columns={5}
                />
              </div>
            )}

            {/* TAB 3: ALAMAT TERSIMPAN */}
            {activeTab === 'addresses' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">
                    Daftar Alamat Pengiriman
                  </h3>
                  <Button
                    onClick={() =>
                      addToast({
                        title: 'Form Tambah Alamat',
                        description: 'Gunakan tombol di form checkout untuk tambah alamat baru.',
                        type: 'info',
                      })
                    }
                    variant="primary"
                    size="xs"
                    leftIcon={<Plus className="w-3 h-3" />}
                  >
                    Tambah Alamat
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-lg bg-white border border-slate-200/90 shadow-2xs text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">
                            {addr.recipientName}
                          </span>
                          <span className="bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-[10px]">
                            {addr.label}
                          </span>
                        </div>
                        {addr.isDefault && (
                          <span className="bg-pink-600 text-white font-bold text-[9px] px-1.5 py-0.2 rounded">
                            Utama
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 font-medium">{addr.phone}</p>
                      <p className="text-slate-600 leading-relaxed">{addr.fullAddress}</p>
                      <p className="text-slate-400 text-[11px]">
                        {addr.district}, {addr.city}, {addr.province} {addr.postalCode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: VOUCHER & KOIN */}
            {activeTab === 'coins' && (
              <div className="space-y-4">
                {/* Coin balance banner */}
                <div className="p-5 rounded-lg bg-amber-500 text-slate-950 shadow-2xs">
                  <span className="text-xs font-bold text-slate-900">Saldo Koin COinaja</span>
                  <h3 className="text-2xl font-black mt-0.5">
                    {formatRupiah(currentUser.coinBalance)}
                  </h3>
                  <p className="text-xs text-slate-900/80 mt-0.5">
                    1 Koin = Rp1. Bisa langsung dipotong saat checkout di seluruh toko marketplace!
                  </p>
                </div>

                {/* Vouchers Grid */}
                <h3 className="font-bold text-sm text-slate-900">
                  Koleksi Voucher Tersedia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mockVouchers.map((v) => (
                    <div
                      key={v.id}
                      className="p-4 rounded-lg bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs text-pink-700 block">
                          {v.title}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">{v.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Kode: <strong className="text-slate-800">{v.code}</strong>
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
                        Salin
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PROFIL */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-2xs space-y-3 max-w-lg">
                <h3 className="font-bold text-sm text-slate-900">
                  Informasi Akun
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      defaultValue={currentUser.name}
                      className="w-full h-8 px-3 rounded border border-slate-300 bg-white font-medium focus:outline-none focus:border-pink-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={currentUser.email}
                      className="w-full h-8 px-3 rounded border border-slate-300 bg-white font-medium focus:outline-none focus:border-pink-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Nomor Telepon</label>
                    <input
                      type="tel"
                      defaultValue={currentUser.phone}
                      className="w-full h-8 px-3 rounded border border-slate-300 bg-white font-medium focus:outline-none focus:border-pink-600"
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
                    size="sm"
                    className="mt-1"
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
            <div className="space-y-3">
              {selectedOrderForTracking.storeOrders.map((so) => (
                <div key={so.sellerId} className="space-y-2">
                  <div className="p-2.5 bg-slate-50 rounded text-xs flex justify-between">
                    <span className="font-bold">{so.sellerName}</span>
                    <span className="text-pink-700 font-bold">{so.shipping.courierName} ({so.trackingNumber})</span>
                  </div>

                  <div className="space-y-2 pl-3 border-l-2 border-pink-500 ml-1.5 text-xs">
                    {so.statusHistory.map((h, i) => (
                      <div key={i}>
                        <p className="font-bold text-slate-900">{h.title}</p>
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
          <div className="animate-spin w-6 h-6 border-3 border-pink-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Memuat Dashboard Akun...</p>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
