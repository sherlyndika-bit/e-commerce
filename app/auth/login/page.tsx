'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, ArrowRight, Lock, Mail, Store } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('budi.santoso@example.com');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const { login, allDemoUsers, switchUser } = useAuthStore();
  const { addToast } = useToastStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      addToast({
        title: 'Selamat Datang Kembali! 👋',
        description: 'Login berhasil. Selamat berbelanja di COinaja!',
        type: 'success',
      });
      router.push('/');
    }, 600);
  };

  const handleQuickLoginAs = (userId: string, roleName: string) => {
    switchUser(userId);
    addToast({
      title: `Login Instan sebagai ${roleName}! 🚀`,
      type: 'success',
    });
    if (roleName === 'Penjual') {
      router.push('/seller');
    } else if (roleName === 'Admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
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
              Masuk ke Akunmu
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Nikmati jutaan promo diskon kilat dan gratis ongkir
            </p>
          </div>

          {/* Quick Demo Login Buttons */}
          <div className="mb-6 p-3 bg-brand-50/70 dark:bg-brand-950/30 rounded-2xl border border-brand-200/60 dark:border-brand-900/40">
            <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 block mb-2 text-center uppercase tracking-wider">
              ⚡ 1-Click Demo Login:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLoginAs('user-buyer-1', 'Pembeli')}
                className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-500 hover:text-white font-bold text-[11px] text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
              >
                👤 Pembeli
              </button>
              <button
                type="button"
                onClick={() => handleQuickLoginAs('user-seller-1', 'Penjual')}
                className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-600 hover:text-white font-bold text-[11px] text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
              >
                🏪 Seller
              </button>
              <button
                type="button"
                onClick={() => handleQuickLoginAs('user-admin-1', 'Admin')}
                className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-600 hover:text-white font-bold text-[11px] text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email / No. Handphone:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500 font-medium"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Kata Sandi:
                </label>
                <a href="#" className="text-brand-500 font-bold hover:underline text-[11px]">
                  Lupa Sandi?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
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
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Masuk Sekarang
            </Button>
          </form>

          {/* Footer Register Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Belum punya akun di COinaja?{' '}
            <Link href="/auth/register" className="font-bold text-brand-500 hover:underline">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
