import { mockProducts } from '../mock-data/products';
import { Product } from '../types/product';

// In-memory data store for client-side modifications (e.g. seller add/edit/delete)
let productsState: Product[] = [...mockProducts];

export interface ProductFilterParams {
  query?: string;
  categorySlug?: string;
  subcategoryId?: string;
  sellerId?: string;
  sellerBadge?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sellerCity?: string;
  freeShippingOnly?: boolean;
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'latest';
}

export const productService = {
  async getAll(): Promise<Product[]> {
    return productsState.filter((p) => p.isActive);
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const product = productsState.find((p) => p.slug === slug && p.isActive);
    return product || null;
  },

  async getById(id: string): Promise<Product | null> {
    const product = productsState.find((p) => p.id === id);
    return product || null;
  },

  async getFlashSale(): Promise<Product[]> {
    return productsState.filter((p) => p.isActive && p.isFlashSale);
  },

  async getBySeller(sellerId: string): Promise<Product[]> {
    return productsState.filter((p) => p.sellerId === sellerId);
  },

  async getRelated(productId: string, limit = 4): Promise<Product[]> {
    const target = productsState.find((p) => p.id === productId);
    if (!target) return [];
    return productsState
      .filter((p) => p.id !== productId && (p.categoryId === target.categoryId || p.sellerId === target.sellerId))
      .slice(0, limit);
  },

  async filterProducts(params: ProductFilterParams): Promise<Product[]> {
    let result = productsState.filter((p) => p.isActive);

    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.sellerName.toLowerCase().includes(q)
      );
    }

    if (params.categorySlug) {
      result = result.filter((p) => p.categorySlug === params.categorySlug);
    }

    if (params.subcategoryId) {
      result = result.filter((p) => p.subcategoryId === params.subcategoryId);
    }

    if (params.sellerId) {
      result = result.filter((p) => p.sellerId === params.sellerId);
    }

    if (params.sellerBadge) {
      result = result.filter((p) => p.sellerBadge === params.sellerBadge);
    }

    if (params.minPrice !== undefined) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }

    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    if (params.rating !== undefined && params.rating > 0) {
      result = result.filter((p) => p.rating >= params.rating!);
    }

    if (params.sellerCity) {
      result = result.filter((p) => p.sellerCity.toLowerCase().includes(params.sellerCity!.toLowerCase()));
    }

    if (params.freeShippingOnly) {
      result = result.filter((p) => p.badges.includes('gratis_ongkir'));
    }

    // Sorting
    switch (params.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.soldCount - a.soldCount);
        break;
    }

    return result;
  },

  // Seller CRUD
  async createProduct(newProduct: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const created: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    productsState.unshift(created);
    return created;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = productsState.findIndex((p) => p.id === id);
    if (index === -1) return null;
    productsState[index] = { ...productsState[index], ...updates };
    return productsState[index];
  },

  async deleteProduct(id: string): Promise<boolean> {
    const index = productsState.findIndex((p) => p.id === id);
    if (index === -1) return false;
    productsState.splice(index, 1);
    return true;
  },
};
