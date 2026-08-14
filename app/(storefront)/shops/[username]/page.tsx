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
import { formatCompactNumber, formatRupiah } from '@/lib/utils/formatters';
import { useToastStore } from '@/lib/store/useToastStore';
import {
  MapPin,
  MessageSquare,
  Users,
  Tag,
  Search,
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
        <h2 className="text-lg font-bold mb-2">Toko Tidak Ditemukan</h2>
        <Link href="/" className="text-xs text-pink-600 font-bold hover:underline">
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
    <div className="py-4 sm:py-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shop Hero Header Banner */}
        <div className="relative rounded-lg overflow-hidden bg-slate-900 text-white shadow-2xs mb-5">
          {/* Banner background */}
          <div className="relative h-40 sm:h-52 w-full">
            <Image src={seller.banner} alt={seller.name} fill className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </div>

          {/* Shop Profile Details Overlay */}
          <div className="p-5 sm:p-6 -mt-16 sm:-mt-20 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              {/* Left Profile Info */}
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
                  <Image src={seller.avatar} alt={seller.name} fill className="object-cover" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                      {seller.name}
                    </h1>
                    <Badge
                      variant={seller.badge === 'official' ? 'official' : 'star'}
                      size="xs"
                    >
                      {seller.badge === 'official' ? 'Official Store' : 'Star Seller'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-200 max-w-xl mb-1.5 line-clamp-1">
                    {seller.tagline}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-pink-400" />
                    {seller.city}, {seller.province} • Bergabung {seller.joinedSince.slice(0, 4)}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Follow & Chat */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleToggleFollow}
                  variant={isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  leftIcon={<Users className="w-3.5 h-3.5" />}
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
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Chat Penjual
                </Button>
              </div>
            </div>

            {/* Stats Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Rating Toko:</span>
                <span className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-1 mt-0.5">
                  ★ {seller.rating} / 5.0
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Pengikut:</span>
                <span className="font-bold text-white text-xs sm:text-sm mt-0.5 block">
                  {formatCompactNumber(seller.followerCount + (isFollowing ? 1 : 0))}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Kecepatan Balas:</span>
                <span className="font-bold text-pink-400 text-xs sm:text-sm mt-0.5 block">
                  {seller.responseRate}% ({seller.responseSpeed})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Barang:</span>
                <span className="font-bold text-white text-xs sm:text-sm mt-0.5 block">
                  {seller.totalProducts} Produk
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Vouchers Row */}
        {vouchers.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-pink-600" />
              Voucher Diskon {seller.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {vouchers.map((vouch) => {
                const isClaimed = claimedVouchers.includes(vouch.id);
                return (
                  <div
                    key={vouch.id}
                    className="p-3 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-xs text-pink-700 block">
                        {vouch.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Min. belanja {formatRupiah(vouch.minPurchase)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleClaimVoucher(vouch)}
                      disabled={isClaimed}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                        isClaimed
                          ? 'bg-pink-600 text-white cursor-default'
                          : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
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
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
            {/* Tabs */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-pink-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Semua Produk ({products.length})
              </button>

              <button
                onClick={() => setActiveTab('popular')}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  activeTab === 'popular'
                    ? 'bg-pink-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Produk Terlaris
              </button>
            </div>

            {/* In-Shop Search */}
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder={`Cari di ${seller.name}...`}
                value={searchInShop}
                onChange={(e) => setSearchInShop(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-pink-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Product Grid - 6 columns */}
          <ProductGrid products={filteredProducts} columns={6} />
        </div>
      </div>
    </div>
  );
}
