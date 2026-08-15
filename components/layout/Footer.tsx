import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { mockCategories } from '@/lib/mock-data/categories';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-8">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {/* Col 1: Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center text-white font-black text-base shadow-2xs">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-pink-600">
                  TumbasCO
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-3">
              Platform marketplace multi-seller terlengkap di Indonesia. Menghubungkan jutaan pembeli dengan ribuan pengrajin lokal, UMKM, dan distributor resmi di seluruh nusantara.
            </p>
            <div className="text-[11px] text-slate-400 leading-tight space-y-0.5">
              <p className="font-semibold text-slate-600">PT Marketplace Nusantara Digital</p>
              <p>Gedung Menara Digital Lt. 18, Jakarta Selatan 12730</p>
            </div>
          </div>

          {/* Col 2: Kategori Populer */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Kategori Populer
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {mockCategories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categories/${cat.slug}`} className="hover:text-pink-600 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Layanan Pelanggan */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Layanan Pelanggan
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li><Link href="/vouchers" className="hover:text-pink-600">Pusat Voucher Promo</Link></li>
              <li><Link href="/account?tab=orders" className="hover:text-pink-600">Lacak Status Pesanan</Link></li>
              <li><Link href="/cart" className="hover:text-pink-600">Panduan Belanja</Link></li>
              <li><Link href="/auth/register" className="hover:text-pink-600">Mulai Jualan Gratis</Link></li>
              <li><Link href="/seller" className="hover:text-pink-600">Seller Center</Link></li>
            </ul>
          </div>

          {/* Col 4: Metode Bayar & Ekspedisi */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Pembayaran & Logistik
            </h5>
            <div className="space-y-2.5">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">Metode Bayar:</span>
                <div className="flex flex-wrap gap-1">
                  {['QRIS', 'BCA VA', 'Mandiri', 'BRI', 'GoPay', 'OVO', 'COD'].map((pay) => (
                    <span key={pay} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {pay}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">Mitra Pengiriman:</span>
                <div className="flex flex-wrap gap-1">
                  {['J&T Express', 'SiCepat', 'GoSend', 'Anteraja', 'JNE'].map((exp) => (
                    <span key={exp} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px] text-slate-400">
          <p>© 2026 TumbasCO Marketplace. Seluruh Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
