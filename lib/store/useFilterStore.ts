import { create } from 'zustand';

export interface CatalogFilterState {
  searchQuery: string;
  categorySlug: string;
  subcategoryId: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  selectedCities: string[];
  sellerBadge: string;
  freeShippingOnly: boolean;
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'latest';
  viewMode: 'grid' | 'list';

  setSearchQuery: (q: string) => void;
  setCategorySlug: (slug: string) => void;
  setSubcategoryId: (id: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setMinRating: (rating: number) => void;
  toggleCity: (city: string) => void;
  setSellerBadge: (badge: string) => void;
  setFreeShippingOnly: (val: boolean) => void;
  setSortBy: (sort: CatalogFilterState['sortBy']) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<CatalogFilterState>((set) => ({
  searchQuery: '',
  categorySlug: '',
  subcategoryId: '',
  minPrice: 0,
  maxPrice: 0,
  minRating: 0,
  selectedCities: [],
  sellerBadge: '',
  freeShippingOnly: false,
  sortBy: 'popular',
  viewMode: 'grid',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategorySlug: (categorySlug) => set({ categorySlug, subcategoryId: '' }),
  setSubcategoryId: (subcategoryId) => set({ subcategoryId }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setMinRating: (minRating) => set({ minRating }),
  toggleCity: (city) =>
    set((state) => ({
      selectedCities: state.selectedCities.includes(city)
        ? state.selectedCities.filter((c) => c !== city)
        : [...state.selectedCities, city],
    })),
  setSellerBadge: (sellerBadge) => set({ sellerBadge }),
  setFreeShippingOnly: (freeShippingOnly) => set({ freeShippingOnly }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
  resetFilters: () =>
    set({
      searchQuery: '',
      categorySlug: '',
      subcategoryId: '',
      minPrice: 0,
      maxPrice: 0,
      minRating: 0,
      selectedCities: [],
      sellerBadge: '',
      freeShippingOnly: false,
      sortBy: 'popular',
    }),
}));
