export interface ShippingOption {
  id: string;
  code: 'instant' | 'sameday' | 'reguler' | 'hemat' | 'cargo';
  courierName: string; // e.g. "J&T Express", "SiCepat REG", "GoSend Instant", "Anteraja"
  estimatedDays: string; // e.g. "1-2 hari", "2-3 jam"
  price: number; // e.g. 12000
  isFreeEligible?: boolean;
}

export interface Seller {
  id: string;
  username: string;
  name: string;
  tagline: string;
  description: string;
  avatar: string;
  banner: string;
  badge: 'official' | 'star' | 'power' | 'regular';
  city: string;
  province: string;
  rating: number;
  totalProducts: number;
  totalSold: number;
  responseRate: number; // e.g. 98%
  responseSpeed: string; // e.g. "hitungan menit"
  joinedSince: string; // e.g. "2022-01-15"
  followerCount: number;
  isVerified: boolean;
  supportedShippings: ShippingOption[];
}
