'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { User, Store, ShieldCheck, Mail, Lock, Phone } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, updateUser } = useAuthStore();
  const { addToast } = useToastStore();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(email || 'budi.santoso@example.com');
      updateUser({
        name: name || (role === 'seller' ? shopName : 'Pengguna Baru'),
        email: email || 'user@coinaja.id',
        phone: phone || '08123456789',
        role,
      });

      setIsLoading(false);
      addToast({
        title: role === 'seller' ? 'Toko Berhasil Dibuka! 🏪' : 'Akun Berhasil Dibuat! 🎉',
        description: `Selamat datang di COinaja, ${name || shopName}!`,
        type: 'success',
      });

      if (role === 'seller') {
        router.push('/seller');
      } else {
        router.push('/');
      }
    }, 600);
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-elevated">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-400 flex items-center justify-center text-white font-black text-xl shadow-md">
                CO
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                CO<span className="text-brand-500">inaja</span>
              </span>
            </Link>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Daftar Akun Baru
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pilih tujuan pendaftaranmu di platform COinaja
            </p>
          </div>

          {/* Role Choice Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                role === 'buyer'
                  ? 'bg-white dark:bg-slate-700 text-brand-500 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Daftar Pembeli</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                role === 'seller'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Buka Toko Gratis</span>
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {role === 'seller' ? (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Toko Penjual:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bandung Leather Craft"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500 font-medium"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  placeholder="Nama sesuai KTP"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500 font-medium"
                  required
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email Aktif:
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500 font-medium"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Nomor WhatsApp / HP:
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500 font-medium"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Kata Sandi:
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500 font-medium"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button
              type="submit"
              variant={role === 'seller' ? 'secondary' : 'primary'}
              size="lg"
              isLoading={isLoading}
              className={`w-full mt-2 ${role === 'seller' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
            >
              {role === 'seller' ? 'Buka Toko Sekarang' : 'Daftar Sebagai Pembeli'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="font-bold text-brand-500 hover:underline">
              Masuk di Sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
