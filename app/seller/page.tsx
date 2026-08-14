'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { productService } from '@/lib/services/productService';
import { orderService } from '@/lib/services/orderService';
import { sellerService } from '@/lib/services/sellerService';
import { mockCategories } from '@/lib/mock-data/categories';
import { Product } from '@/lib/types/product';
import { Order, OrderStatus } from '@/lib/types/order';
import { Seller } from '@/lib/types/seller';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatRupiah, formatDateIndo, slugify } from '@/lib/utils/formatters';
import {
  Store,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Truck,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';

export default function SellerCenterPage() {
  const { currentUser } = useAuthStore();
  const { addToast } = useToastStore();

  const sellerId = currentUser.sellerId || 'seller-3';

  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats'>('products');

  // Add / Edit Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState(mockCategories[0].id);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isFlashSale, setIsFlashSale] = useState(false);

  useEffect(() => {
    sellerService.getById(sellerId).then((s) => setSeller(s));
    productService.getBySeller(sellerId).then((prods) => setProducts(prods));
    orderService.getBySellerId(sellerId).then((ords) => setOrders(ords));
  }, [sellerId]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setTitle('');
    setPrice('');
    setOriginalPrice('');
    setStock('');
    setCategoryId(mockCategories[0].id);
    setImageUrl('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop');
    setDescription('');
    setIsFlashSale(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setPrice(p.price.toString());
    setOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setStock(p.stock.toString());
    setCategoryId(p.categoryId);
    setImageUrl(p.images[0] || '');
    setDescription(p.description);
    setIsFlashSale(Boolean(p.isFlashSale));
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !stock) {
      addToast({
        title: 'Mohon isi nama produk, harga, dan stok',
        type: 'warning',
      });
      return;
    }

    const selectedCat = mockCategories.find((c) => c.id === categoryId) || mockCategories[0];

    if (editingProduct) {
      // Update
      const updated = await productService.updateProduct(editingProduct.id, {
        title,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stock: Number(stock),
        categoryId,
        categorySlug: selectedCat.slug,
        images: [imageUrl || editingProduct.images[0]],
        description: description || editingProduct.description,
        isFlashSale,
      });

      if (updated) {
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
        addToast({
          title: 'Produk Berhasil Diperbarui! ✅',
          description: title,
          type: 'success',
        });
      }
    } else {
      // Create new
      const created = await productService.createProduct({
        slug: slugify(title) + '-' + Date.now().toString().slice(-4),
        title,
        description: description || 'Produk berkualitas tinggi dari toko terpercaya.',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stock: Number(stock),
        soldCount: 0,
        rating: 5.0,
        reviewCount: 0,
        categoryId,
        categorySlug: selectedCat.slug,
        sellerId: seller?.id || 'seller-3',
        sellerName: seller?.name || 'TechZone Gadget Store',
        sellerCity: seller?.city || 'Jakarta Pusat',
        sellerBadge: seller?.badge || 'official',
        images: [imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'],
        specifications: [
          { label: 'Garansi', value: '1 Tahun Resmi' },
          { label: 'Kondisi', value: '100% Baru Original' },
        ],
        badges: isFlashSale ? ['flash_sale', 'gratis_ongkir'] : ['gratis_ongkir'],
        weightGrams: 500,
        isFlashSale,
        tags: [selectedCat.name, title.split(' ')[0]],
        isActive: true,
      });

      setProducts([created, ...products]);
      addToast({
        title: 'Produk Baru Berhasil Ditambahkan! 🚀',
        description: `${title} sekarang aktif dijual di toko.`,
        type: 'success',
      });
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      await productService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      addToast({
        title: 'Produk Dihapus',
        description: name,
        type: 'info',
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const resiNumber = `JT${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const updated = await orderService.updateStoreOrderStatus(
      orderId,
      sellerId,
      newStatus,
      newStatus === 'shipping'
        ? `Paket telah diserahkan ke kurir dengan nomor resi ${resiNumber}`
        : 'Pesanan telah selesai diterima pembeli',
      resiNumber
    );

    if (updated) {
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      addToast({
        title: `Status Pesanan Diperbarui: ${newStatus.toUpperCase()}! 📦`,
        type: 'success',
      });
    }
  };

  // Calculate seller revenue
  const totalRevenue = orders.reduce((sum, o) => {
    const storeOrder = o.storeOrders.find((so) => so.sellerId === sellerId);
    return sum + (storeOrder ? storeOrder.subtotal : 0);
  }, 0);

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seller Header Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-elevated mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-white shrink-0">
              <Image
                src={seller?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{seller?.name || 'Seller Center'}</h1>
                <Badge variant="official" size="xs">
                  Official Store
                </Badge>
              </div>
              <p className="text-xs text-white/70 mt-1">
                {seller?.city} • Tingkat Balas Chat: {seller?.responseRate}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleOpenAdd}
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              + Tambah Produk Baru
            </Button>

            {seller && (
              <Link href={`/shops/${seller.username}`} target="_blank">
                <Button
                  variant="dark"
                  size="md"
                  className="bg-white/20 hover:bg-white/30 border border-white/20 text-white"
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Lihat Toko Publik
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block">Total Omset Penjualan</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {formatRupiah(totalRevenue || 5277000)}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block">Pesanan Masuk</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {orders.length} Pesanan
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block">Produk Aktif Dijual</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {products.length} Produk
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block">Rating Rata-rata Toko</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                ★ {seller?.rating || 4.9} / 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'products'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Kelola Produk Toko ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Pesanan Masuk ({orders.length})
          </button>
        </div>

        {/* TAB 1: PRODUCT MANAGEMENT TABLE */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Daftar Inventaris Produk Toko
              </h3>
              <Button onClick={handleOpenAdd} variant="primary" size="xs">
                + Tambah Baru
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Produk</th>
                    <th className="py-3 px-4">Harga Jual</th>
                    <th className="py-3 px-4">Stok</th>
                    <th className="py-3 px-4">Terjual</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <Image src={p.images[0]} alt="" fill className="object-cover" />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {p.title}
                            </p>
                            <span className="text-[10px] text-slate-400 capitalize">
                              {p.categorySlug.replace(/-/g, ' ')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-500">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {p.stock} pcs
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {p.soldCount}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded">
                          Aktif
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INCOMING ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((ord) => {
              const storeOrder = ord.storeOrders.find((so) => so.sellerId === sellerId);
              if (!storeOrder) return null;

              return (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {ord.orderNumber}
                      </span>
                      <span className="text-slate-400 ml-2">Pembeli: <strong>{ord.userName}</strong> ({ord.userPhone})</span>
                    </div>
                    <span className="bg-brand-50 text-brand-600 font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                      Status: {storeOrder.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {storeOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <Image src={item.productImage} alt="" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {item.productTitle}
                          </p>
                          <p className="text-slate-400">
                            {item.quantity} pcs • {formatRupiah(item.price)}
                          </p>
                        </div>
                        <span className="text-xs font-black text-brand-500">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions for seller */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Kurir: <strong>{storeOrder.shipping.courierName}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {storeOrder.status === 'processing' && (
                        <Button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'shipping')}
                          variant="primary"
                          size="sm"
                          leftIcon={<Truck className="w-3.5 h-3.5" />}
                        >
                          Kirim Barang & Terbitkan Resi
                        </Button>
                      )}

                      {storeOrder.status === 'shipping' && (
                        <Button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                          variant="secondary"
                          size="sm"
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        >
                          Selesaikan Pesanan
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Add / Edit Product */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={editingProduct ? 'Edit Produk Toko' : 'Tambah Produk Baru ke Toko'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Nama Produk:</label>
              <input
                type="text"
                placeholder="Contoh: Sony WH-1000XM5 Wireless Headphone"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Harga Jual (Rp):</label>
                <input
                  type="number"
                  placeholder="350000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Harga Asli / Coret (Opsional):</label>
                <input
                  type="number"
                  placeholder="500000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Jumlah Stok:</label>
                <input
                  type="number"
                  placeholder="50"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Kategori:</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
                >
                  {mockCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">URL Gambar Produk (Unsplash / Hosted):</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Deskripsi Produk:</label>
              <textarea
                rows={3}
                placeholder="Jelaskan keunggulan produk dan spesifikasi lengkap..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="flashSaleCheck"
                checked={isFlashSale}
                onChange={(e) => setIsFlashSale(e.target.checked)}
                className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500/20"
              />
              <label htmlFor="flashSaleCheck" className="font-bold cursor-pointer">
                Ikutkan dalam Event Flash Sale Kilat
              </label>
            </div>

            <div className="pt-3">
              <Button type="submit" variant="primary" size="md" className="w-full">
                {editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk ke Marketplace'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
