export interface ProductVariantOption {
  id: string;
  name: string;
  priceModifier?: number; // delta to base price
  stock: number;
  imageUrl?: string;
}

export interface ProductVariantGroup {
  name: string; // e.g. "Warna", "Ukuran", "Kapasitas"
  options: ProductVariantOption[];
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  variantSelected?: string;
  images?: string[];
  helpfulCount: number;
  sellerReply?: {
    sellerName: string;
    comment: string;
    createdAt: string;
  };
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export type ProductBadge = 
  | 'flash_sale'
  | 'terlaris'
  | 'gratis_ongkir'
  | 'official'
  | 'diskon_spesial'
  | 'lokal_pride';

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number; // current selling price
  originalPrice?: number; // for discount strike-through
  stock: number;
  soldCount: number;
  rating: number; // e.g. 4.8
  reviewCount: number;
  categoryId: string;
  categorySlug: string;
  subcategoryId?: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  sellerBadge: 'official' | 'star' | 'power' | 'regular';
  images: string[];
  videoUrl?: string;
  variantGroups?: ProductVariantGroup[];
  specifications: ProductSpecification[];
  badges: ProductBadge[];
  weightGrams: number;
  isFlashSale?: boolean;
  flashSaleDiscount?: number;
  flashSaleStock?: number;
  flashSaleSold?: number;
  flashSaleEndAt?: string;
  tags: string[];
  createdAt: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  imageIcon: string; // Transparent PNG icon URL
  description: string;
  bannerImage: string;
  subcategories: {
    id: string;
    slug: string;
    name: string;
    itemCount: number;
  }[];
  itemCount: number;
  isPopular?: boolean;
  featuredTags: string[];
}
