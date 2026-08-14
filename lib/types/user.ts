export interface Address {
  id: string;
  label: string; // e.g. "Rumah", "Kantor", "Apartemen"
  recipientName: string;
  phone: string;
  fullAddress: string;
  district: string; // Kecamatan
  city: string; // Kota/Kabupaten
  province: string; // Provinsi
  postalCode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'buyer' | 'seller' | 'admin';
  sellerId?: string; // linked seller account if role is seller
  addresses: Address[];
  coinBalance: number;
  memberTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  createdAt: string;
}
