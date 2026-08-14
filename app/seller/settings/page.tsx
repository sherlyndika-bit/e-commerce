'use client';

import React, { useState } from 'react';
import { Store, MapPin, Phone, Globe, CreditCard, Bell, Shield, ChevronRight, Camera } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

const menuItems = [
  { icon: Store, label: 'Profil Toko', desc: 'Nama, deskripsi, kategori, foto toko', color: 'pink' },
  { icon: MapPin, label: 'Alamat & Pengiriman', desc: 'Atur alamat pickup dan kurir yang didukung', color: 'blue' },
  { icon: Phone, label: 'Informasi Kontak', desc: 'Nomor HP dan email yang bisa dihubungi', color: 'emerald' },
  { icon: Globe, label: 'Jam Operasional', desc: 'Atur kapan toko kamu aktif menerima pesanan', color: 'indigo' },
  { icon: CreditCard, label: 'Rekening Bank', desc: 'Akun bank untuk pencairan saldo', color: 'amber' },
  { icon: Bell, label: 'Notifikasi', desc: 'Atur preferensi notifikasi email dan push', color: 'violet' },
  { icon: Shield, label: 'Keamanan Akun', desc: 'Password, 2FA, dan sesi login aktif', color: 'red' },
];

export default function SellerSettingsPage() {
  const { currentUser: user } = useAuthStore();
  const [storeName, setStoreName] = useState('Toko ' + (user?.name || 'Saya'));
  const [storeDesc, setStoreDesc] = useState('Toko online terpercaya dengan produk berkualitas tinggi dan pengiriman cepat.');

  const colors: any = {
    pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-500', border: 'border-red-100' },
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Pengaturan Toko</h1>
        <p className="text-sm text-slate-500 mt-0.5">Kelola informasi, tampilan, dan preferensi toko kamu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Store Profile Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
          <h2 className="text-base font-bold text-slate-900">Profil Toko</h2>

          {/* Store Photo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-700 font-black text-2xl border-2 border-pink-200">
                {storeName.charAt(0)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{storeName}</p>
              <p className="text-xs text-slate-500 mt-0.5">JPG, PNG, maks 2MB. Rasio 1:1 direkomendasikan.</p>
              <button className="mt-2 text-xs font-semibold text-pink-600 hover:text-pink-700 transition-colors">Ubah Foto Toko</button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Nama Toko</label>
              <input value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Deskripsi Toko</label>
              <textarea value={storeDesc} onChange={e => setStoreDesc(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-all resize-none" />
              <p className="text-xs text-slate-400 mt-1">{storeDesc.length}/500 karakter</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Kategori Utama</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-all bg-white">
                  <option>Kecantikan & Perawatan</option>
                  <option>Elektronik</option>
                  <option>Fashion</option>
                  <option>Makanan & Minuman</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Kota Toko</label>
                <input placeholder="Jakarta Selatan" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-all" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
              Simpan Perubahan
            </button>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Menu Pengaturan</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {menuItems.map(item => {
              const c = colors[item.color];
              return (
                <button key={item.label} className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left">
                  <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-4 h-4 ${c.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
