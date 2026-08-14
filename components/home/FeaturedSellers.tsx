'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockSellers } from '@/lib/mock-data/sellers';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { ArrowRight, MapPin, CheckCircle2, Store } from 'lucide-react';
import { formatCompactNumber } from '@/lib/utils/formatters';

export function FeaturedSellers() {
  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-black text-brand-500 uppercase tracking-wider block">
              🏪 Official Store & Star Seller
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Toko Unggulan Terpercaya
            </h2>
          </div>
          <Link
            href="/shops/brodo-official"
            className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1 group"
          >
            Lihat Semua Toko Resmi
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockSellers.slice(0, 4).map((seller) => (
            <Link
              key={seller.id}
              href={`/shops/${seller.username}`}
              className="group flex flex-col bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-800 shadow-subtle hover:shadow-elevated transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Banner Image */}
              <div className="relative h-24 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <Image
                  src={seller.banner}
                  alt={seller.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <Badge
                    variant={seller.badge === 'official' ? 'official' : 'star'}
                    size="xs"
                  >
                    {seller.badge === 'official' ? 'Official Store' : 'Star Seller'}
                  </Badge>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-xs shrink-0 -mt-7 z-10 bg-white">
                      <Image
                        src={seller.avatar}
                        alt={seller.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 -mt-2">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">
                        {seller.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {seller.city}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {seller.tagline}
                  </p>
                </div>

                {/* Footer Stats */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <RatingStars rating={seller.rating} size="xs" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {seller.rating}
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium">
                    {formatCompactNumber(seller.totalSold)} Terjual
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
