'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockSellers } from '@/lib/mock-data/sellers';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { ArrowRight, MapPin } from 'lucide-react';
import { formatCompactNumber } from '@/lib/utils/formatters';

export function FeaturedSellers() {
  return (
    <section className="sm:py-1 bg-slate-50">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="bg-white border-y sm:border border-slate-200/90 sm:rounded-xl shadow-none sm:shadow-2xs p-3.5 sm:p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-pink-600 rounded-full" />
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Official Store & Toko Pilihan
              </h2>
            </div>
            <Link
              href="/shops/brodo-official"
              className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 group"
            >
              Lihat Semua Toko
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Sellers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mockSellers.slice(0, 4).map((seller) => (
            <Link
              key={seller.id}
              href={`/shops/${seller.username}`}
              className="group flex flex-col bg-white rounded-lg border border-slate-200/80 hover:border-pink-500 hover:shadow-2xs transition-all overflow-hidden"
            >
              {/* Banner Image */}
              <div className="relative h-20 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={seller.banner}
                  alt={seller.name}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-1.5 left-2.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${
                    seller.badge === 'official' ? 'bg-indigo-600' : 'bg-amber-500 text-slate-900'
                  }`}>
                    {seller.badge === 'official' ? 'Official Store' : 'Star Seller'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="relative w-9 h-9 rounded-md overflow-hidden border-2 border-white shadow-2xs shrink-0 -mt-6 z-10 bg-white">
                      <Image
                        src={seller.avatar}
                        alt={seller.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 -mt-2">
                      <h3 className="font-bold text-xs text-slate-900 truncate group-hover:text-pink-600 transition-colors">
                        {seller.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 flex items-center gap-0.5 truncate">
                        <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        {seller.city}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {seller.tagline}
                  </p>
                </div>

                {/* Footer Stats */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1">
                    <RatingStars rating={seller.rating} size="xs" />
                    <span className="font-bold text-slate-700">
                      {seller.rating}
                    </span>
                  </div>
                  <span className="text-slate-500 font-medium">
                    {formatCompactNumber(seller.totalSold)} Terjual
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
