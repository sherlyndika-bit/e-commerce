import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';
import { mockCategories } from '@/lib/mock-data/categories';

export function Footer() {
  const trustFeatures = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: '100% Original & Terverifikasi',
      desc: 'Jaminan produk asli langsung dari official store dan brand terpercaya.',
    },
    {
      icon: <Truck className="w-6 h-6 text-brand-500" />,
      title: 'Gratis Ongkir ke Seluruh RI',
      desc: 'Bebas ongkir tanpa batas dengan berbagai opsi kurir tercepat.',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-amber-500" />,
      title: 'Garansi Pengembalian 7 Hari',
      desc: 'Barang tidak sesuai atau rusak? Komplain mudah uang kembali 100%.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-indigo-500" />,
      title: 'Layanan Bantuan 24/7',
      desc: 'Customer care siap melayani keluhan dan pertanyaan setiap hari.',
    },
  ];

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors mt-16">
      {/* Trust Feature Badges */}
      <div className="border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((f, i) => (
              <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {f.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-elevated border border-white/20 relative overflow-hidden">
                <span className="relative z-10 text-white tracking-tighter">CO</span>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-coin-400 border border-white flex items-center justify-center text-[7px] font-black text-slate-900 shadow-xs">
                  🪙
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  CO<span className="text-brand-600 dark:text-brand-400">in</span><span className="text-coin-500">aja</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-coin-100 text-coin-700 dark:bg-coin-950/60 dark:text-coin-400 text-[8px] font-black uppercase">
                    PRO
                  </span>
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-4">
              Platform marketplace multi-seller terlengkap di Indonesia. Menghubungkan jutaan pembeli dengan ribuan pengrajin lokal, UMKM, dan distributor resmi di seluruh nusantara.
            </p>
            <div className="text-xs text-slate-400">
              <p>PT Marketplace Nusantara Digital</p>
              <p>Jakarta Selatan, DKI Jakarta 12730</p>
            </div>
          </div>

          {/* Col 2: Kategori Populer */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3.5">
              Kategori Terpopuler
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {mockCategories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categories/${cat.slug}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Layanan Pelanggan */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3.5">
              Layanan Pelanggan
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/vouchers" className="hover:text-brand-600 dark:hover:text-brand-400">🎟️ Pusat Voucher</Link></li>
              <li><Link href="/account?tab=orders" className="hover:text-brand-600 dark:hover:text-brand-400">Lacak Pesanan</Link></li>
              <li><Link href="/cart" className="hover:text-brand-600 dark:hover:text-brand-400">Cara Berbelanja</Link></li>
              <li><Link href="/auth/register" className="hover:text-brand-600 dark:hover:text-brand-400">Buka Toko Gratis</Link></li>
              <li><Link href="/seller" className="hover:text-brand-600 dark:hover:text-brand-400">Seller Center</Link></li>
              <li><Link href="/admin" className="hover:text-brand-600 dark:hover:text-brand-400">Portal Admin</Link></li>
            </ul>
          </div>

          {/* Col 4: Metode Bayar & Ekspedisi */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3.5">
              Pembayaran & Pengiriman
            </h5>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">Metode Bayar:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['QRIS', 'BCA VA', 'Mandiri', 'GoPay', 'ShopeePay', 'COD'].map((pay) => (
                    <span key={pay} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {pay}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">Jasa Pengiriman:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['J&T Express', 'SiCepat', 'GoSend', 'Anteraja', 'JNE'].map((exp) => (
                    <span key={exp} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 COinaja Marketplace. Seluruh Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan penuh <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk UMKM Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
