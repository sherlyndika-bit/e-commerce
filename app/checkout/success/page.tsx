'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { orderService } from '@/lib/services/orderService';
import { Order } from '@/lib/types/order';
import { formatRupiah, formatDateIndo } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToastStore } from '@/lib/store/useToastStore';
import {
  CheckCircle2,
  Copy,
  Package,
  Truck,
  MapPin,
  Clock,
  Store,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState<Order | null>(null);
  const { addToast } = useToastStore();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore in environments without canvas
    }

    if (orderId) {
      orderService.getById(orderId).then((ord) => {
        if (ord) setOrder(ord);
      });
    }
  }, [orderId]);

  const handleCopyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      addToast({
        title: 'Nomor Pesanan Disalin! 📋',
        description: order.orderNumber,
        type: 'success',
      });
    }
  };

  return (
    <div className="py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Banner Card */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-elevated text-center mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Pesanan Berhasil Dikonfirmasi!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            Terima kasih telah berbelanja di COinaja. Penjual telah menerima notifikasi dan sedang memproses pesananmu.
          </p>

          {/* Order Number Box */}
          {order && (
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-400">Nomor Pesanan:</span>
              <strong className="font-mono font-black text-brand-500 text-sm">
                {order.orderNumber}
              </strong>
              <button
                onClick={handleCopyOrderNumber}
                className="p-1 text-slate-400 hover:text-brand-500 rounded transition-colors"
                title="Salin Nomor Pesanan"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Live Order Tracking Timeline */}
        {order && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-subtle">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-500" />
                Live Status Pelacakan Pengiriman
              </h2>

              {order.storeOrders.map((storeOrder) => (
                <div
                  key={storeOrder.sellerId}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-4 mb-4 last:mb-0"
                >
                  {/* Store info header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-brand-500" />
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {storeOrder.sellerName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Kurir:</span>
                      <span className="font-bold text-xs text-brand-500">
                        {storeOrder.shipping.courierName} ({storeOrder.trackingNumber})
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {storeOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                          <Image src={item.productImage} alt={item.productTitle} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.productTitle}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {item.quantity} x {formatRupiah(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Steps Timeline */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-200 dark:before:bg-brand-900">
                      {storeOrder.statusHistory.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                            ✓
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {step.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {step.description}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {formatDateIndo(step.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/account?tab=orders" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Lihat di Pesanan Saya
                </Button>
              </Link>
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Belanja Produk Lainnya
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-xs font-bold text-slate-500">Memuat Rincian Pesanan...</p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
