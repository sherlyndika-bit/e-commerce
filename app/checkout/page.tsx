'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { sellerService } from '@/lib/services/sellerService';
import { orderService } from '@/lib/services/orderService';
import { ShippingOption, Seller } from '@/lib/types/seller';
import { PaymentMethodType, StoreOrder } from '@/lib/types/order';
import { AddressCard } from '@/components/checkout/AddressCard';
import { ShippingSelector } from '@/components/checkout/ShippingSelector';
import { PaymentMethodAccordion } from '@/components/checkout/PaymentMethodAccordion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah } from '@/lib/utils/formatters';
import {
  ShieldCheck,
  ChevronRight,
  Store,
  MapPin,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    getSellerGroups,
    appliedVoucher,
    useCoins,
    clearCart,
  } = useCartStore();

  const { currentUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [selectedAddress, setSelectedAddress] = useState(currentUser.addresses[0]);
  const [selectedShippings, setSelectedShippings] = useState<{ [sellerId: string]: ShippingOption }>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qris');
  const [paymentMethodName, setPaymentMethodName] = useState('QRIS Instant (GoPay/BCA/OVO/ShopeePay)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sellerGroups = getSellerGroups().filter((g) => g.items.some((i) => i.selected));

  // Initialize default shippings for each seller group
  useEffect(() => {
    sellerGroups.forEach(async (group) => {
      if (!selectedShippings[group.sellerId]) {
        const seller = await sellerService.getById(group.sellerId);
        if (seller && seller.supportedShippings.length > 0) {
          setSelectedShippings((prev) => ({
            ...prev,
            [group.sellerId]: seller.supportedShippings[0],
          }));
        }
      }
    });
  }, [sellerGroups]);

  // If no items selected, redirect back to cart
  const selectedItems = items.filter((i) => i.selected);

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Total shipping cost calculated across all sellers
  const totalShippingCost = Object.values(selectedShippings).reduce(
    (sum, ship) => sum + ship.price,
    0
  );

  // Voucher discount
  let voucherDiscount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'free_shipping') {
      voucherDiscount = Math.min(appliedVoucher.discountAmount, totalShippingCost);
    } else if (appliedVoucher.type === 'discount_percent') {
      voucherDiscount = Math.round((subtotal * appliedVoucher.discountAmount) / 100);
      if (appliedVoucher.maxDiscount) {
        voucherDiscount = Math.min(voucherDiscount, appliedVoucher.maxDiscount);
      }
    } else if (appliedVoucher.type === 'discount_fixed') {
      voucherDiscount = appliedVoucher.discountAmount;
    }
  }

  // Coins deduction
  const maxAllowedCoins = Math.min(currentUser.coinBalance, Math.round(subtotal * 0.25));
  const coinDeduction = useCoins ? maxAllowedCoins : 0;

  const grandTotal = Math.max(0, subtotal + totalShippingCost - voucherDiscount - coinDeduction);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      addToast({
        title: 'Alamat Pengiriman Belum Dipilih',
        type: 'warning',
      });
      return;
    }

    setIsSubmitting(true);

    // Build store orders payload
    const storeOrders: StoreOrder[] = sellerGroups.map((group) => {
      const shipping =
        selectedShippings[group.sellerId] || {
          id: 'ship-default',
          code: 'reguler',
          courierName: 'J&T Express Reguler',
          estimatedDays: '1-2 hari',
          price: 12000,
        };

      const groupSubtotal = group.items
        .filter((i) => i.selected)
        .reduce((sum, i) => sum + i.price * i.quantity, 0);

      return {
        sellerId: group.sellerId,
        sellerName: group.sellerName,
        sellerCity: group.sellerCity,
        sellerBadge: group.sellerBadge,
        items: group.items
          .filter((i) => i.selected)
          .map((i) => ({
            id: `item-${Date.now()}-${i.product.id}`,
            productId: i.product.id,
            productTitle: i.product.title,
            productSlug: i.product.slug,
            productImage: i.product.images[0],
            variantSelected: i.variantSelected,
            price: i.price,
            quantity: i.quantity,
            weightGrams: i.product.weightGrams,
          })),
        shipping,
        shippingCost: shipping.price,
        shippingDiscount: appliedVoucher?.type === 'free_shipping' ? 10000 : 0,
        storeNote: group.items[0]?.storeNote,
        subtotal: groupSubtotal,
        trackingNumber: `JT${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        status: 'processing',
        statusHistory: [
          {
            status: 'unpaid',
            title: 'Pesanan Dibuat',
            description: 'Menunggu pembayaran pembeli',
            timestamp: new Date().toISOString(),
          },
          {
            status: 'processing',
            title: 'Pembayaran Diterima',
            description: 'Penjual sedang menyiapkan barang dan nomor resi otomatis',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    });

    const newOrder = await orderService.createOrder({
      userId: currentUser.id,
      userName: selectedAddress.recipientName,
      userPhone: selectedAddress.phone,
      shippingAddress: selectedAddress,
      storeOrders,
      itemsSubtotal: subtotal,
      totalShippingCost,
      totalDiscount: voucherDiscount,
      coinUsed: coinDeduction,
      grandTotal,
      paymentMethod,
      paymentMethodName,
      paymentStatus: 'paid',
      paymentDetails: {
        vaNumber: `8808${selectedAddress.phone.slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`,
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    clearCart();
    setIsSubmitting(false);

    addToast({
      title: 'Pembayaran Berhasil Dikonfirmasi! 🎉',
      description: `Pesanan ${newOrder.orderNumber} sedang diproses oleh penjual.`,
      type: 'success',
    });

    router.push(`/checkout/success?order_id=${newOrder.id}`);
  };

  if (selectedItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold mb-2">Tidak ada barang yang dipilih untuk checkout</h2>
        <Link href="/cart" className="text-sm text-brand-500 font-bold hover:underline">
          ← Kembali ke Keranjang Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-brand-500 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cart" className="hover:text-brand-500 transition-colors">
            Keranjang
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-bold">
            Checkout Pesanan
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Checkout Steps (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Delivery Address */}
            <AddressCard
              selectedAddress={selectedAddress}
              onSelectAddress={(addr) => setSelectedAddress(addr)}
            />

            {/* Step 2: Per-Seller Store Group & Shipping Selector */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Rincian Pesanan per Toko ({sellerGroups.length} Toko)
              </h3>

              {sellerGroups.map((group) => {
                const groupItems = group.items.filter((i) => i.selected);
                return (
                  <div
                    key={group.sellerId}
                    className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle space-y-4"
                  >
                    {/* Store Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-brand-500" />
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {group.sellerName}
                        </span>
                        <Badge
                          variant={group.sellerBadge === 'official' ? 'official' : 'star'}
                          size="xs"
                        >
                          {group.sellerBadge === 'official' ? 'Official' : 'Star'}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {group.sellerCity}
                      </span>
                    </div>

                    {/* Store Items List */}
                    <div className="space-y-3">
                      {groupItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3.5">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {item.product.title}
                            </p>
                            {item.variantSelected && (
                              <p className="text-[11px] text-slate-400">
                                Variasi: {item.variantSelected}
                              </p>
                            )}
                            <p className="text-xs font-semibold text-brand-500 mt-0.5">
                              {item.quantity} x {formatRupiah(item.price)}
                            </p>
                          </div>
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {formatRupiah(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Courier Selector for this Store */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <ShippingSelector
                        sellerName={group.sellerName}
                        sellerId={group.sellerId}
                        options={[
                          { id: `ship-${group.sellerId}-1`, code: 'reguler', courierName: 'J&T Express Reguler', estimatedDays: '1-2 hari', price: 12000, isFreeEligible: true },
                          { id: `ship-${group.sellerId}-2`, code: 'sameday', courierName: 'SiCepat Sameday', estimatedDays: '6-8 jam', price: 22000 },
                          { id: `ship-${group.sellerId}-3`, code: 'instant', courierName: 'GoSend Instant', estimatedDays: '1-2 jam', price: 34000 },
                        ]}
                        selectedOptionId={selectedShippings[group.sellerId]?.id || `ship-${group.sellerId}-1`}
                        onSelect={(opt) =>
                          setSelectedShippings((prev) => ({
                            ...prev,
                            [group.sellerId]: opt,
                          }))
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 3: Payment Method Accordion */}
            <PaymentMethodAccordion
              selectedMethod={paymentMethod}
              onSelect={(method, name) => {
                setPaymentMethod(method);
                setPaymentMethodName(name);
              }}
            />
          </div>

          {/* Right: Checkout Breakdown (Col 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle space-y-4 sticky top-24">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Ringkasan Pembayaran
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Total Harga ({selectedItems.length} barang):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Total Ongkos Kirim:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatRupiah(totalShippingCost)}
                  </span>
                </div>

                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Diskon Voucher ({appliedVoucher?.code}):</span>
                    <span>-{formatRupiah(voucherDiscount)}</span>
                  </div>
                )}

                {useCoins && coinDeduction > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                    <span>Potongan Koin COinaja:</span>
                    <span>-{formatRupiah(coinDeduction)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Metode Bayar:</span>
                  <span className="font-bold text-brand-500 truncate max-w-40 text-right">
                    {paymentMethod.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Total Final */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Total Tagihan Akhir:</span>
                  <span className="text-2xl font-black text-brand-500">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full"
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Bayar Sekarang ({formatRupiah(grandTotal)})
              </Button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Transaksi dienkripsi dengan standar keamanan tinggi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
