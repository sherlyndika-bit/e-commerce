import { ShippingOption } from './seller';
import { Address } from './user';

export type OrderStatus =
  | 'unpaid' // Menunggu Pembayaran
  | 'processing' // Sedang Diproses Penjual
  | 'shipping' // Sedang Dikirim Kurir
  | 'delivered' // Sampai di Tujuan
  | 'completed' // Selesai
  | 'cancelled'; // Dibatalkan

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  productImage: string;
  variantSelected?: string;
  price: number;
  quantity: number;
  weightGrams: number;
}

export interface StoreOrder {
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  sellerBadge: 'official' | 'star' | 'power' | 'regular';
  items: OrderItem[];
  shipping: ShippingOption;
  shippingCost: number;
  shippingDiscount: number;
  storeNote?: string;
  subtotal: number;
  trackingNumber?: string;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
  }[];
}

export type PaymentMethodType =
  | 'qris'
  | 'bca_va'
  | 'mandiri_va'
  | 'bri_va'
  | 'gopay'
  | 'shopeepay'
  | 'dana'
  | 'cod';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "CO-20260814-9982"
  userId: string;
  userName: string;
  userPhone: string;
  shippingAddress: Address;
  storeOrders: StoreOrder[];
  itemsSubtotal: number;
  totalShippingCost: number;
  totalDiscount: number;
  coinUsed: number;
  grandTotal: number;
  paymentMethod: PaymentMethodType;
  paymentMethodName: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired';
  paymentDetails?: {
    vaNumber?: string;
    qrCodeUrl?: string;
    expiryDate: string;
  };
  createdAt: string;
  updatedAt: string;
}
