'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { sellerService } from '@/lib/services/sellerService';
import { productService } from '@/lib/services/productService';
import { voucherService } from '@/lib/services/voucherService';
import { Seller } from '@/lib/types/seller';
import { Product } from '@/lib/types/product';
import { Voucher } from '@/lib/types/voucher';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { formatCompactNumber, formatRupiah } from '@/lib/utils/formatters';
import { useToastStore } from '@/lib/store/useToastStore';
import {
  MapPin,
  MessageSquare,
  Sparkles,
  Users,
  ShieldCheck,
  Tag,
  Search,
  Check,
} from 'lucide-react';

export default function ShopProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [claimedVouchers, setClaimedVouchers] = useState<string[]>([]);
  const [searchInShop, setSearchInShop] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'vouchers'>('all');

  const { addToast } = useToastStore();

  useEffect(() => {
    sellerService.getByUsername(username).then((s) => {
      if (s) {
        setSeller(s);
        productService.getBySeller(s.id).then((prods) => setProducts(prods));
        voucherService.getBySeller(s.id).then((vouchs) => setVouchers(vouchs));
      }
    });
  }, [username]);

  if (!seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold mb-2">Toko Tidak Ditemukan</h2>
        <Link href="/" className="text-sm text-brand-500 font-bold hover:underline">
          ← Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    addToast({
      title: !isFollowing ? `Mengikuti ${seller.name}!` : `Berhenti mengikuti ${seller.name}`,
      description: !isFollowing ? 'Kamu akan menerima notifikasi promo dan produk baru dari toko ini.' : '',
      type: 'info',
    });
  };

  const handleClaimVoucher = (vouch: Voucher) => {
    setClaimedVouchers([...claimedVouchers, vouch.id]);
    addToast({
      title: 'Voucher Toko Berhasil Diklaim! 🎉',
      description: `Gunakan kode ${vouch.code} saat checkout dari toko ${seller.name}.`,
      type: 'success',
    });
  };

  const filteredProducts = products.filter((p) => {
    if (searchInShop.trim()) {
      return p.title.toLowerCase().includes(searchInShop.toLowerCase());
    }
    if (activeTab === 'popular') {
      return p.soldCount > 1000;
    }
    return true;
  });

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shop Hero Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-elevated mb-8">
          {/* Banner background */}
          <div className="relative h-48 sm:h-64 w-full">
            <Image src={seller.banner} alt={seller.name} fill className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </div>

          {/* Shop Profile Details Overlay */}
          <div className="p-6 sm:p-8 -mt-20 sm:-mt-24 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              {/* Left Profile Info */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-white shrink-0">
                  <Image src={seller.avatar} alt={seller.name} fill className="object-cover" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl sm:text-2xl font-black text-white">
                      {seller.name}
                    </h1>
                    <Badge
                      variant={seller.badge === 'official' ? 'official' : 'star'}
                      size="sm"
                    >
                      {seller.badge === 'official' ? 'Official Store' : 'Star Seller'}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 max-w-xl mb-2">
                    {seller.tagline}
                  </p>
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    {seller.city}, {seller.province} • Bergabung sejak {seller.joinedSince.slice(0, 4)}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Follow & Chat */}
              <div className="flex items-center gap-2.5">
                <Button
                  onClick={handleToggleFollow}
                  variant={isFollowing ? 'secondary' : 'primary'}
                  size="md"
                  leftIcon={<Users className="w-4 h-4" />}
                >
                  {isFollowing ? 'Mengikuti ✓' : '+ Ikuti Toko'}
                </Button>

                <Button
                  onClick={() =>
                    addToast({
                      title: `Chat dengan ${seller.name}`,
                      type: 'info',
                    })
                  }
                  variant="dark"
                  size="md"
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/20 text-white"
                  leftIcon={<MessageSquare className="w-4 h-4" />}
                >
                  Chat Penjual
                </Button>
              </div>
            </div>

            {/* Stats Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
              <div>
                <span className="text-white/60 block text-[11px]">Rating Ulasan:</span>
                <span className="font-extrabold text-amber-300 text-sm flex items-center gap-1 mt-0.5">
                  ★ {seller.rating} / 5.0
                </span>
              </div>
              <div>
                <span className="text-white/60 block text-[11px]">Pengikut Toko:</span>
                <span className="font-extrabold text-white text-sm mt-0.5 block">
                  {formatCompactNumber(seller.followerCount + (isFollowing ? 1 : 0))}
                </span>
              </div>
              <div>
                <span className="text-white/60 block text-[11px]">Kecepatan Respons:</span>
                <span className="font-extrabold text-emerald-400 text-sm mt-0.5 block">
                  {seller.responseRate}% ({seller.responseSpeed})
                </span>
              </div>
              <div>
                <span className="text-white/60 block text-[11px]">Total Produk:</span>
                <span className="font-extrabold text-white text-sm mt-0.5 block">
                  {seller.totalProducts} Barang Aktif
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Vouchers Row */}
        {vouchers.length > 0 && (
          <div className="mb-8">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-500" />
              Voucher Diskon Toko {seller.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {vouchers.map((vouch) => {
                const isClaimed = claimedVouchers.includes(vouch.id);
                return (
                  <div
                    key={vouch.id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/80 border border-brand-200/70 dark:border-slate-700 flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <span className="font-black text-sm text-brand-600 dark:text-brand-400 block">
                        {vouch.title}
                      </span>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Min. belanja {formatRupiah(vouch.minPurchase)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleClaimVoucher(vouch)}
                      disabled={isClaimed}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                        isClaimed
                          ? 'bg-emerald-500 text-white cursor-default'
                          : 'bg-brand-500 hover:bg-brand-600 text-white shadow-xs'
                      }`}
                    >
                      {isClaimed ? 'Klaim ✓' : 'Klaim'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Products Section with Shop Search */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Semua Produk ({products.length})
              </button>

              <button
                onClick={() => setActiveTab('popular')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'popular'
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Produk Terlaris
              </button>
            </div>

            {/* In-Shop Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={`Cari di ${seller.name}...`}
                value={searchInShop}
                onChange={(e) => setSearchInShop(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} columns={4} />
        </div>
      </div>
    </div>
  );
}
