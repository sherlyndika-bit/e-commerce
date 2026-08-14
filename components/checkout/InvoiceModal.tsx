'use client';

import React from 'react';
import { Order } from '@/lib/types/order';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatRupiah, formatDateIndo } from '@/lib/utils/formatters';
import { Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📄 Faktur & Invoice Resmi Transaksi" maxWidth="lg">
      <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-sm">
                  CO
                </div>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  CO<span className="text-brand-600">in</span><span className="text-coin-500">aja</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">PT Marketplace Nusantara Digital</p>
              <p className="text-[11px] text-slate-400">NPWP: 01.234.567.8-012.000</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-[11px] uppercase tracking-wider mb-1">
                ✓ LUNAS (PAID)
              </span>
              <p className="font-mono font-black text-slate-900 dark:text-white text-sm">
                #{order.orderNumber}
              </p>
              <p className="text-[11px] text-slate-400">
                Tanggal: {formatDateIndo(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                Diterbitkan Untuk:
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{order.shippingAddress.recipientName}</p>
              <p className="text-slate-500">{order.shippingAddress.phone}</p>
              <p className="text-slate-500">{order.shippingAddress.fullAddress}</p>
              <p className="text-slate-500">
                {order.shippingAddress.district}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                Metode Pembayaran:
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{order.paymentMethodName}</p>
              <p className="text-slate-500">Status: Verifikasi Otomatis Berhasil</p>
              <p className="text-slate-400 text-[10px] mt-2">
                ID Transaksi: TRX-{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Item Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-y border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Deskripsi Barang</th>
                  <th className="py-2.5 px-3">Toko</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Harga</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.storeOrders.flatMap((so) =>
                  so.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {item.productTitle}
                        {item.variantSelected && (
                          <span className="block text-[10px] text-slate-400">
                            Varian: {item.variantSelected}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{so.sellerName}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right text-slate-500">{formatRupiah(item.price)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatRupiah(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Total Breakdown */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Produk:</span>
                <span>{formatRupiah(order.itemsSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total Ongkos Kirim:</span>
                <span>{formatRupiah(order.totalShippingCost)}</span>
              </div>
              {order.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Diskon Kupon Promo:</span>
                  <span>-{formatRupiah(order.totalDiscount)}</span>
                </div>
              )}
              {order.coinUsed > 0 && (
                <div className="flex justify-between text-coin-600 font-bold">
                  <span>Potongan Koin COinaja:</span>
                  <span>-{formatRupiah(order.coinUsed)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Pembayaran:</span>
                <span className="text-brand-600 dark:text-brand-400">{formatRupiah(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer Official Seal */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Dokumen ini diterbitkan secara sah dan otomatis oleh sistem marketplace COinaja.</span>
            </div>
            <span className="font-mono">COINAJA-AUTHENTIC-RECORD</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button onClick={onClose} variant="outline" size="sm">
            Tutup
          </Button>
          <Button onClick={handlePrint} variant="primary" size="sm" leftIcon={<Printer className="w-4 h-4" />}>
            Cetak / Simpan PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}
