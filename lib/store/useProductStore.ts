import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';
import { mockProducts } from '../mock-data/products';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  incrementSoldCount: (id: string, qty: number) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      // Initialize with mock data
      products: mockProducts,

      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      updateStock: (id, newStock) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: newStock } : p
          ),
        })),
        
      incrementSoldCount: (id, qty) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, soldCount: (p.soldCount || 0) + qty } : p
          ),
        })),
    }),
    {
      name: 'coinaja-products-storage', // unique name
      skipHydration: true, // we handle hydration manually if needed, or false to auto-hydrate. Let's use false so it hydrates automatically.
    }
  )
);
