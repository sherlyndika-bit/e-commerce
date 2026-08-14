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
import { InvoiceModal } from '@/components/checkout/InvoiceModal';
import { useToastStore } from '@/lib/store/useToastStore';
import {
  CheckCircle2,
  Copy,
  Truck,
  Store,
  FileText,
} from 'lucide-react';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
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
    <div className="py-6 sm:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Banner Card */}
        <div className="bg-white rounded-lg border border-slate-200/90 p-5 sm:p-8 shadow-2xs text-center mb-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
            Pesanan Berhasil Dikonfirmasi!
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
            Terima kasih telah berbelanja di COinaja. Penjual telah menerima notifikasi dan sedang memproses pesananmu.
          </p>

          {/* Order Number Box & Invoice Trigger */}
          {order && (
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-400">Nomor Pesanan:</span>
                <strong className="font-mono font-bold text-pink-700 text-xs sm:text-sm">
                  {order.orderNumber}
                </strong>
                <button
                  onClick={handleCopyOrderNumber}
                  className="p-1 text-slate-400 hover:text-pink-600 rounded transition-colors"
                  title="Salin Nomor Pesanan"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                onClick={() => setIsInvoiceOpen(true)}
                variant="outline"
                size="sm"
                leftIcon={<FileText className="w-3.5 h-3.5 text-pink-600" />}
              >
                Cetak Invoice PDF
              </Button>
            </div>
          )}
        </div>

        {/* Live Order Tracking Timeline */}
        {order && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-2xs">
              <h2 className="font-bold text-xs sm:text-sm text-slate-900 mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-pink-600" />
                Live Status Pelacakan Pengiriman
              </h2>

              {order.storeOrders.map((storeOrder) => (
                <div
                  key={storeOrder.sellerId}
                  className="p-4 rounded-md bg-slate-50 border border-slate-100 space-y-3 mb-3 last:mb-0"
                >
                  {/* Store info header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-pink-600" />
                      <span className="font-bold text-slate-900">
                        {storeOrder.sellerName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Kurir:</span>
                      <span className="font-bold text-pink-700 text-[11px]">
                        {storeOrder.shipping.courierName} ({storeOrder.trackingNumber})
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5">
                    {storeOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2.5">
                        <div className="relative w-10 h-10 rounded overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                          <Image src={item.productImage} alt={item.productTitle} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-900 truncate">
                            {item.productTitle}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {item.quantity} x {formatRupiah(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Steps Timeline */}
                  <div className="pt-3 border-t border-slate-200">
                    <div className="space-y-2.5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-pink-200">
                      {storeOrder.statusHistory.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 relative z-10">
                          <div className="w-4 h-4 rounded-full bg-pink-600 text-white flex items-center justify-center text-[9px] font-black shrink-0">
                            ✓
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {step.title}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {step.description}
                            </p>
                            <span className="text-[9px] text-slate-400">
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Link href="/account?tab=orders" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto">
                  Lihat di Pesanan Saya
                </Button>
              </Link>
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto">
                  Belanja Produk Lainnya
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Printable Tax Invoice Modal */}
        <InvoiceModal
          order={order}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-6 h-6 border-3 border-pink-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Memuat Rincian Pesanan...</p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
