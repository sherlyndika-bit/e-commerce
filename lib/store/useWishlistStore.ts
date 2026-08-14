import { create } from 'zustand';

interface WishlistStoreState {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => boolean; // returns isNowInWishlist
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStoreState>((set, get) => ({
  wishlistIds: ['prod-1', 'prod-7'], // pre-populate with 2 products

  toggleWishlist: (productId: string) => {
    const exists = get().wishlistIds.includes(productId);
    if (exists) {
      set({ wishlistIds: get().wishlistIds.filter((id) => id !== productId) });
      return false;
    } else {
      set({ wishlistIds: [...get().wishlistIds, productId] });
      return true;
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlistIds.includes(productId);
  },

  clearWishlist: () => set({ wishlistIds: [] }),
}));
