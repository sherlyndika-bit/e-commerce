import { mockVouchers } from '../mock-data/vouchers';
import { Voucher } from '../types/voucher';

export const voucherService = {
  async getAll(): Promise<Voucher[]> {
    return mockVouchers;
  },

  async getByCode(code: string): Promise<Voucher | null> {
    const voucher = mockVouchers.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());
    return voucher || null;
  },

  async getBySeller(sellerId: string): Promise<Voucher[]> {
    return mockVouchers.filter((v) => v.sellerId === sellerId || !v.sellerId);
  },
};
