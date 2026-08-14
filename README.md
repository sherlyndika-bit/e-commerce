# COinaja — Multi-Category E-Commerce Marketplace Indonesia 🛍️

Platform marketplace e-commerce multi-seller dan multi-kategori modern khas Indonesia dengan desain orisinal setara produk digital agency profesional. Dibangun langsung dari kode (*from scratch*) tanpa builder/template siap pakai.

---

## 🌟 Fitur Utama

### 1. Pengalaman Pembeli (Buyer Experience)
- **Asymmetric Hero Section**: Hero banner interaktif dengan auto-sliding banner promo, side bento cards, dan quick action pills.
- **Live Flash Sale Zone**: Countdown timer real-time (Jam : Menit : Detik), indikator persentase stok menipis (*"Sisa 4 pcs"*), dan tombol bungkus kilat.
- **12 Kategori Marketplace Lengkap**:
  - Elektronik & Gadget, Fashion Pria, Fashion Wanita, Kecantikan & Perawatan, Komputer & Laptop, Rumah Tangga & Perabotan, Makanan & Minuman, Olahraga & Outdoor, Ibu & Bayi, Hobi & Koleksi, Otomotif, Buku & Alat Tulis.
- **Navigasi & Mega Menu**: Menu kategori 2-tingkat dengan preview subkategori dinamis, live search autocomplete dengan saran kata kunci populer.
- **Katalog & Filter Pencarian Dinamis (`/products`)**:
  - Filter multi-kategori, rentang harga, rating bintang minimum, lokasi asal pengiriman, status toko (*Official Store / Star Seller*), dan opsi *Bebas Ongkir*.
  - Pengurutan: *Paling Populer, Terbaru, Harga Terendah → Tertinggi, Harga Tertinggi → Terendah, Rating Tertinggi*.
  - Mode tampilan Grid & List.
- **Detail Produk (PDP - `/products/[slug]`)**:
  - Galeri gambar HD dengan zoom on hover dan thumbnail carousel.
  - Selector varian interaktif (*Ukuran, Warna, Memori*) dengan penyesuaian harga dan stok langsung.
  - Profil toko terverifikasi dengan rating, kecepatan balas chat, dan tombol kunjungi toko.
  - Review & rating pembeli berfoto dengan filter bintang dan respons resmi penjual.
  - Rekomendasi produk serupa dan produk lain dari toko ini.
- **Multi-Seller Cart (`/cart`)**:
  - Keranjang belanja terkelompok otomatis per toko penjual.
  - Seleksi per barang atau per toko, input catatan toko, kupon promo, dan pemotong Koin COinaja.
- **Checkout Multi-Toko (`/checkout`)**:
  - Manajemen alamat pengiriman dengan modal tambah alamat.
  - Pilihan kurir dan ongkir terpisah per toko (*J&T, SiCepat, GoSend, Anteraja*).
  - Pilihan metode bayar (*QRIS Instant, BCA/Mandiri/BRI Virtual Account, GoPay, ShopeePay, COD*).
  - Live order tracking timeline (*Pesanan Dibuat -> Pembayaran Diterima -> Diproses -> Dikirim -> Selesai*).
- **Dashboard Akun Pembeli (`/account`)**:
  - Tab *Pesanan Saya* dengan filter status, modal pelacakan paket, dan tombol beli lagi.
  - Tab *Wishlist*, *Alamat Tersimpan*, *Koin & Voucher*, dan *Profil Akun*.

### 2. Seller Center (`/seller`)
- Dashboard metrik toko (*Total Omset, Pesanan Masuk, Total Produk Aktif, Rating Toko*).
- **Manajemen Produk (CRUD)**: Tambah produk baru (lengkap dengan foto, kategori, varian, dan flag Flash Sale), edit harga/stok, dan hapus produk.
- **Manajemen Pesanan**: Update status pesanan pembeli (*Kirim Barang & Terbitkan Resi Otomatis*).
- **Halaman Profil Toko Publik (`/shops/[username]`)**: Banner toko, klaim voucher toko langsung, dan etalase produk toko.

### 3. Portal Super Admin (`/admin`)
- Ringkasan statistik platform (*Gross Merchandise Value / GMV, Total Seller, Total Pengguna*).
- Moderasi seller: verifikasi dan pemberian badge *Official Store*.
- Moderasi katalog produk: penangguhan atau pengaktifan produk di katalog.

### 4. Interactive Demo Role Switcher
- Floating topbar untuk berpindah instan 1-klik antara akun:
  - 👤 **Pembeli**: Budi Santoso
  - 🏪 **Penjual**: Hendra Wijaya (*TechZone Gadget Store*)
  - 🛡️ **Super Admin**: Siti Rahmawati

---

## 🛠️ Tech Stack & Arsitektur

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom Design System Tokens + Google Font `Plus Jakarta Sans`
- **Animasi & Interaksi**: Framer Motion & Canvas Confetti
- **Icons**: Lucide React
- **State Management (Client)**: Zustand (`useCartStore`, `useWishlistStore`, `useAuthStore`, `useFilterStore`, `useToastStore`)
- **Data Layer**: Modular Service Abstraction Layer (`lib/services/`) yang terhubung ke dataset realistis berstruktur database (`lib/mock-data/` & `lib/types/`).

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/sherlyndika-bit/e-commerce.git
   cd e-commerce
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```

4. **Buka di browser:**
   Akses `http://localhost:3000`

5. **Build produksi:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📁 Struktur Direktori

```
├── app/
│   ├── account/          # Dashboard Pembeli (Pesanan, Wishlist, Alamat, Koin)
│   ├── admin/            # Portal Super Admin
│   ├── auth/             # Login & Register (Pembeli / Penjual)
│   ├── cart/             # Multi-Seller Grouped Cart
│   ├── categories/       # Dynamic Category Catalog
│   ├── checkout/         # Multi-Store Checkout & Success Tracking
│   ├── products/         # Search & Catalog Filter + Product Detail (PDP)
│   ├── seller/           # Seller Center Dashboard (CRUD & Fulfillment)
│   ├── shops/            # Seller Storefront Profile
│   ├── globals.css       # Tailwind & Custom Design System Tokens
│   ├── layout.tsx        # Root Layout with Font & Global UI
│   └── page.tsx          # Asymmetric Bento Landing Page
├── components/
│   ├── cart/             # Cart UI Atoms & Summary
│   ├── catalog/          # Filter Sidebar, Chips & Header
│   ├── checkout/         # Address Card, Shipping & Payment Accordion
│   ├── home/             # Hero Bento, Flash Sale, Category Explorer, Feed
│   ├── layout/           # Navbar, MegaMenu, Footer, MobileNav, PromoTicker
│   ├── product/          # Product Card, Grid, Gallery, Quick View Modal
│   └── ui/               # Badge, Button, Modal, RatingStars, RoleSwitcher, Toast
├── lib/
│   ├── mock-data/        # Realistic Indonesian Datasets (Categories, Sellers, Products, Orders)
│   ├── services/         # Data Access & Mutation Layer
│   ├── store/            # Zustand Global State Stores
│   ├── types/            # TypeScript Database-Ready Interfaces
│   └── utils/            # Rupiah & Date Formatters, Slugify, ClassMerge
```

---

## 📄 Lisensi
© 2026 COinaja Marketplace Nusantara.
