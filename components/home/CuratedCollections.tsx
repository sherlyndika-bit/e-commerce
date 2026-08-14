'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CuratedCollections() {
  const collections = [
    {
      id: 'col-1',
      title: '🇮🇩 Lokal Pride Indonesia',
      subtitle: 'Koleksi Sepatu & Fashion Asli Bandung',
      discount: 'Diskon s/d 40%',
      image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop',
      link: '/shops/brodo-official',
      bg: 'from-amber-900/90 to-brand-900/90',
    },
    {
      id: 'col-2',
      title: '✨ Skincare Glowing BPOM',
      subtitle: 'Serum & Sunscreen Halal Terlaris',
      discount: 'Cashback 20rb Koin',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
      link: '/categories/kecantikan-perawatan',
      bg: 'from-rose-900/90 to-pink-900/90',
    },
    {
      id: 'col-3',
      title: '⚡ Desk Setup Minimalis',
      subtitle: 'Mechanical Keyboard & Audio Hi-Res',
      discount: 'Gratis Ongkir Xtra',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop',
      link: '/categories/komputer-laptop',
      bg: 'from-slate-900/90 to-indigo-900/90',
    },
  ];

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={col.link}
              className="group relative h-48 sm:h-52 rounded-3xl overflow-hidden shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-end p-6 hover:-translate-y-1"
            >
              {/* Background Image with Dark Gradient Overlay */}
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${col.bg} opacity-85 group-hover:opacity-90 transition-opacity`} />

              {/* Content */}
              <div className="relative z-10 text-white">
                <span className="inline-block bg-white/20 backdrop-blur-xs text-amber-300 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full mb-1.5 border border-white/20">
                  {col.discount}
                </span>
                <h3 className="text-lg font-black leading-tight mb-1">
                  {col.title}
                </h3>
                <p className="text-xs text-white/80 font-medium mb-2">
                  {col.subtitle}
                </p>
                <div className="flex items-center text-xs font-bold text-amber-300 gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Lihat Koleksi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
