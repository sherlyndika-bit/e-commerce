import { mockCategories } from '../mock-data/categories';
import { Category } from '../types/product';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return mockCategories;
  },

  async getPopular(): Promise<Category[]> {
    return mockCategories.filter((c) => c.isPopular);
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const category = mockCategories.find((c) => c.slug === slug);
    return category || null;
  },
};
