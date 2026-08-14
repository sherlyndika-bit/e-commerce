'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Seller } from '@/lib/types/seller';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { MapPin, MessageSquare, Store, Clock, Award, ArrowRight } from 'lucide-react';
import { formatCompactNumber } from '@/lib/utils/formatters';
import { useToastStore } from '@/lib/store/useToastStore';

interface SellerInfoCardProps {
  seller: Seller;
}

export function SellerInfoCard({ seller }: SellerInfoCardProps) {
  const { addToast } = useToastStore();

  const handleChat = () => {
    addToast({
      title: `Memulai Chat dengan ${seller.name} 💬`,
      description: 'Fitur chat live seller siap digunakan untuk tanya stok dan varian.',
      type: 'info',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        {/* Left Seller Profile */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-brand-200 dark:border-slate-700 shadow-xs shrink-0">
            <Image src={seller.avatar} alt={seller.name} fill className="object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {seller.name}
              </h4>
              <Badge
                variant={seller.badge === 'official' ? 'official' : 'star'}
                size="xs"
              >
                {seller.badge === 'official' ? 'Official' : 'Star Seller'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              {seller.city}, {seller.province}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleChat}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand-500" />
            <span>Chat Penjual</span>
          </button>

          <Link
            href={`/shops/${seller.username}`}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 flex items-center justify-center gap-1.5 transition-colors border border-brand-200/60 dark:border-brand-800"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Kunjungi Toko</span>
          </Link>
        </div>
      </div>

      {/* Seller Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Rating Toko:</span>
          <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
            ★ {seller.rating} / 5.0
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Produk Dijual:</span>
          <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">
            {seller.totalProducts} Produk
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Respons Chat:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            {seller.responseRate}% ({seller.responseSpeed})
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Pengikut Toko:</span>
          <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">
            {formatCompactNumber(seller.followerCount)} Followers
          </span>
        </div>
      </div>
    </div>
  );
}
