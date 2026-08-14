import { mockSellers } from '../mock-data/sellers';
import { Seller } from '../types/seller';

let sellersState: Seller[] = [...mockSellers];

export const sellerService = {
  async getAll(): Promise<Seller[]> {
    return sellersState;
  },

  async getById(id: string): Promise<Seller | null> {
    const seller = sellersState.find((s) => s.id === id);
    return seller || null;
  },

  async getByUsername(username: string): Promise<Seller | null> {
    const seller = sellersState.find((s) => s.username === username);
    return seller || null;
  },

  async updateSeller(id: string, updates: Partial<Seller>): Promise<Seller | null> {
    const index = sellersState.findIndex((s) => s.id === id);
    if (index === -1) return null;
    sellersState[index] = { ...sellersState[index], ...updates };
    return sellersState[index];
  },
};
