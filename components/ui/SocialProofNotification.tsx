'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data/products';

interface NotificationItem {
  name: string;
  city: string;
  product: (typeof mockProducts)[0];
  timeAgo: string;
}

export function SocialProofNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotif, setCurrentNotif] = useState<NotificationItem | null>(null);

  const samplePurchases: NotificationItem[] = [
    {
      name: 'Rian Kusuma',
      city: 'Bandung',
      product: mockProducts[0], // Brodo
      timeAgo: '1 menit lalu',
    },
    {
      name: 'Nadia Salsabila',
      city: 'Jakarta Selatan',
      product: mockProducts[4], // Somethinc
      timeAgo: '3 menit lalu',
    },
    {
      name: 'Budi Haryanto',
      city: 'Surabaya',
      product: mockProducts[1], // Sony
      timeAgo: 'Baru saja',
    },
    {
      name: 'Faisal Akbar',
      city: 'Yogyakarta',
      product: mockProducts[3], // Keychron
      timeAgo: '5 menit lalu',
    },
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrentNotif(samplePurchases[index % samplePurchases.length]);
      setIsVisible(true);
      index++;

      // Hide after 5 seconds
      const hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(hideTimeout);
    }, 14000); // Trigger every 14 seconds

    // Initial trigger after 4s
    const initialTimer = setTimeout(() => {
      setCurrentNotif(samplePurchases[0]);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  if (!isVisible || !currentNotif) return null;

  return (
    <div className="fixed bottom-20 left-4 sm:left-6 z-30 max-w-xs sm:max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-elevated flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700">
        <Image src={currentNotif.product.images[0]} alt="" fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0 text-xs">
        <p className="text-[11px] text-slate-500 leading-tight">
          <strong className="text-slate-900 dark:text-white">{currentNotif.name}</strong> ({currentNotif.city}) baru saja checkout:
        </p>
        <Link
          href={`/products/${currentNotif.product.slug}`}
          className="font-bold text-brand-600 dark:text-brand-400 truncate block mt-0.5 hover:underline"
        >
          {currentNotif.product.title}
        </Link>
        <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
          <CheckCircle className="w-2.5 h-2.5 text-emerald-500" /> Terverifikasi • {currentNotif.timeAgo}
        </span>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg shrink-0 transition-colors"
        aria-label="Tutup"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
