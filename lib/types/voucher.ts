export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'discount_percent' | 'discount_fixed' | 'free_shipping' | 'cashback_coin';
  discountAmount: number; // e.g. 15 (%) or 20000 (IDR)
  maxDiscount?: number; // e.g. 50000
  minPurchase: number; // e.g. 100000
  sellerId?: string; // if null, platform-wide voucher
  sellerName?: string;
  expiresAt: string;
  usageCount: number;
  usageLimit: number;
}
