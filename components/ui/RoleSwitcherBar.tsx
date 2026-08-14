'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { User, Store, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

export function RoleSwitcherBar() {
  const { currentUser, switchUser, allDemoUsers } = useAuthStore();
  const { addToast } = useToastStore();

  const handleSwitch = (userId: string, roleName: string) => {
    switchUser(userId);
    addToast({
      title: `Berpindah Mode: ${roleName}`,
      description: `Sekarang kamu sedang melihat sebagai ${roleName}`,
      type: 'info',
    });
  };

  return (
    <div className="bg-slate-900 text-white text-xs py-1.5 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-flex items-center gap-1 bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] border border-brand-500/30">
            <ArrowRightLeft className="w-3 h-3" /> Demo Switcher
          </span>
          <span className="hidden sm:inline">Role Aktif:</span>
          <strong className="text-white font-semibold flex items-center gap-1.5">
            {currentUser.role === 'buyer' && <User className="w-3.5 h-3.5 text-blue-400" />}
            {currentUser.role === 'seller' && <Store className="w-3.5 h-3.5 text-emerald-400" />}
            {currentUser.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
            {currentUser.name}
          </strong>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {allDemoUsers.map((u) => {
            const isActive = currentUser.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => handleSwitch(u.id, u.role === 'buyer' ? 'Pembeli' : u.role === 'seller' ? 'Seller Center' : 'Super Admin')}
                className={`px-2.5 py-0.5 rounded transition-all font-medium text-[11px] flex items-center gap-1 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-xs font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {u.role === 'buyer' && '👤 Pembeli'}
                {u.role === 'seller' && '🏪 Seller'}
                {u.role === 'admin' && '🛡️ Admin'}
              </button>
            );
          })}

          <div className="h-3.5 w-px bg-slate-700 mx-1 hidden sm:block" />

          {currentUser.role === 'seller' && (
            <Link
              href="/seller"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded font-bold text-[11px] transition-colors"
            >
              Buka Seller Center →
            </Link>
          )}

          {currentUser.role === 'admin' && (
            <Link
              href="/admin"
              className="bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-0.5 rounded font-bold text-[11px] transition-colors"
            >
              Buka Admin Portal →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
