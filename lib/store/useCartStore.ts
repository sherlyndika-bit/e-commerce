import { create } from 'zustand';
import { Product } from '../types/product';
import { Voucher } from '../types/voucher';

export interface CartItem {
  id: string; // unique item id: productId + (variantSelected || '')
  product: Product;
  variantSelected?: string;
  price: number;
  quantity: number;
  selected: boolean;
  storeNote?: string;
}

export interface SellerCartGroup {
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  sellerBadge: 'official' | 'star' | 'power' | 'regular';
  items: CartItem[];
  allSelected: boolean;
}

interface CartStoreState {
  items: CartItem[];
  appliedVoucher: Voucher | null;
  useCoins: boolean;
  addItem: (product: Product, quantity?: number, variantSelected?: string, priceOverride?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleItemSelection: (itemId: string) => void;
  toggleSellerSelection: (sellerId: string) => void;
  toggleAllSelection: (select?: boolean) => void;
  setStoreNote: (sellerId: string, note: string) => void;
  applyVoucher: (voucher: Voucher) => void;
  removeVoucher: () => void;
  toggleUseCoins: () => void;
  clearCart: () => void;
  // Getters
  getSellerGroups: () => SellerCartGroup[];
  getSelectedItems: () => CartItem[];
  getSelectedSubtotal: () => number;
  getSelectedCount: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  items: [
    // Pre-populate with realistic items from 2 different sellers to demonstrate multi-seller cart immediately!
    {
      id: 'prod-1-Black-Velvet',
      product: {
        id: 'prod-1',
        slug: 'sony-wh-1000xm5-wireless-noise-cancelling-headphones',
        title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        description: '',
        price: 4999000,
        stock: 24,
        soldCount: 840,
        rating: 4.9,
        reviewCount: 230,
        categoryId: 'cat-1',
        categorySlug: 'elektronik-gadget',
        sellerId: 'seller-3',
        sellerName: 'TechZone Gadget Store',
        sellerCity: 'Jakarta Pusat',
        sellerBadge: 'official',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'],
        specifications: [],
        badges: ['flash_sale', 'official'],
        weightGrams: 500,
        tags: [],
        createdAt: '',
        isActive: true,
      },
      variantSelected: 'Black Velvet',
      price: 4999000,
      quantity: 1,
      selected: true,
    },
    {
      id: 'prod-3-EU-42',
      product: {
        id: 'prod-3',
        slug: 'brodo-vulcano-leather-boots-vintage-brown',
        title: 'Brodo Vulcano Vintage Boots - Sepatu Kulit Asli Pull-Up',
        description: '',
        price: 749000,
        stock: 45,
        soldCount: 1850,
        rating: 4.9,
        reviewCount: 480,
        categoryId: 'cat-2',
        categorySlug: 'fashion-pria',
        sellerId: 'seller-1',
        sellerName: 'Brodo Footwear Official',
        sellerCity: 'Bandung',
        sellerBadge: 'official',
        images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop'],
        specifications: [],
        badges: ['lokal_pride', 'official'],
        weightGrams: 1100,
        tags: [],
        createdAt: '',
        isActive: true,
      },
      variantSelected: 'Vintage Brown, EU 42',
      price: 749000,
      quantity: 1,
      selected: true,
    },
  ],
  appliedVoucher: null,
  useCoins: false,

  addItem: (product, quantity = 1, variantSelected, priceOverride) => {
    const itemPrice = priceOverride !== undefined ? priceOverride : product.price;
    const itemId = `${product.id}-${variantSelected ? variantSelected.replace(/\s+/g, '-') : 'default'}`;

    set((state) => {
      const existing = state.items.find((i) => i.id === itemId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === itemId
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: itemId,
            product,
            variantSelected,
            price: itemPrice,
            quantity,
            selected: true,
          },
        ],
      };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.min(quantity, i.product.stock) } : i
      ),
    }));
  },

  toggleItemSelection: (itemId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, selected: !i.selected } : i
      ),
    }));
  },

  toggleSellerSelection: (sellerId) => {
    set((state) => {
      const sellerItems = state.items.filter((i) => i.product.sellerId === sellerId);
      const allSelected = sellerItems.every((i) => i.selected);
      return {
        items: state.items.map((i) =>
          i.product.sellerId === sellerId ? { ...i, selected: !allSelected } : i
        ),
      };
    });
  },

  toggleAllSelection: (select) => {
    set((state) => {
      const shouldSelect = select !== undefined ? select : !state.items.every((i) => i.selected);
      return {
        items: state.items.map((i) => ({ ...i, selected: shouldSelect })),
      };
    });
  },

  setStoreNote: (sellerId, note) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.product.sellerId === sellerId ? { ...i, storeNote: note } : i
      ),
    }));
  },

  applyVoucher: (voucher) => set({ appliedVoucher: voucher }),
  removeVoucher: () => set({ appliedVoucher: null }),
  toggleUseCoins: () => set((state) => ({ useCoins: !state.useCoins })),
  clearCart: () => set({ items: [], appliedVoucher: null, useCoins: false }),

  getSellerGroups: () => {
    const items = get().items;
    const groupMap = new Map<string, SellerCartGroup>();

    items.forEach((item) => {
      const sellerId = item.product.sellerId;
      if (!groupMap.has(sellerId)) {
        groupMap.set(sellerId, {
          sellerId,
          sellerName: item.product.sellerName,
          sellerCity: item.product.sellerCity,
          sellerBadge: item.product.sellerBadge,
          items: [],
          allSelected: true,
        });
      }
      groupMap.get(sellerId)!.items.push(item);
    });

    const groups = Array.from(groupMap.values());
    groups.forEach((group) => {
      group.allSelected = group.items.every((i) => i.selected);
    });

    return groups;
  },

  getSelectedItems: () => get().items.filter((i) => i.selected),

  getSelectedSubtotal: () => {
    return get()
      .items.filter((i) => i.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getSelectedCount: () => {
    return get()
      .items.filter((i) => i.selected)
      .reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalItemsCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
