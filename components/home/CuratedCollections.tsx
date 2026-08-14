'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function CuratedCollections() {
  const collections = [
    {
      id: 'col-1',
      title: 'Lokal Pride Indonesia',
      subtitle: 'Koleksi Sepatu Kulit & Fashion Asli Bandung',
      discount: 'Diskon s/d 40%',
      image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop',
      link: '/shops/brodo-official',
      bgTag: 'bg-pink-600',
    },
    {
      id: 'col-2',
      title: 'Skincare Glowing BPOM',
      subtitle: 'Serum & Sunscreen Halal Terlaris Garansi Asli',
      discount: 'Cashback 20rb Koin',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
      link: '/categories/kecantikan-perawatan',
      bgTag: 'bg-rose-600',
    },
    {
      id: 'col-3',
      title: 'Desk Setup Minimalis',
      subtitle: 'Mechanical Keyboard, Monitor & Audio Hi-Res',
      discount: 'Gratis Ongkir Xtra',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop',
      link: '/categories/komputer-laptop',
      bgTag: 'bg-indigo-600',
    },
  ];

  return (
    <section className="py-4 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
            Koleksi Pilihan Hari Ini
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={col.link}
              className="group relative h-28 sm:h-32 rounded-lg overflow-hidden border border-slate-200/90 shadow-2xs transition-all flex flex-col justify-end p-3 hover:border-pink-500"
            >
              {/* Background Image */}
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 text-white">
                <span className={`inline-block ${col.bgTag} text-white font-black text-[9px] uppercase px-1.5 py-0.2 rounded mb-1`}>
                  {col.discount}
                </span>
                <h3 className="text-xs sm:text-sm font-bold leading-tight drop-shadow-2xs">
                  {col.title}
                </h3>
                <p className="text-[10px] text-slate-200 font-normal line-clamp-1">
                  {col.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
