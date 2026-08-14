'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { User, Store, ArrowRightLeft, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function RoleSwitcherBar() {
  const { currentUser, switchUser, allDemoUsers } = useAuthStore();
  const { addToast } = useToastStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSwitch = (userId: string, roleName: string) => {
    switchUser(userId);
    addToast({
      title: `Berpindah Mode: ${roleName}`,
      description: `Sekarang kamu sedang melihat sebagai ${roleName}`,
      type: 'info',
    });
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-full shadow-2xl border border-slate-700/80 px-3 py-1.5 flex items-center gap-2 text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 font-medium hover:text-brand-400 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
          <span className="text-[11px] text-slate-300">Mode:</span>
          <strong className="text-white font-bold flex items-center gap-1">
            {currentUser.role === 'buyer' && <User className="w-3 h-3 text-blue-400" />}
            {currentUser.role === 'seller' && <Store className="w-3 h-3 text-pink-400" />}
            {currentUser.role === 'buyer' ? 'Pembeli' : 'Seller'}
          </strong>
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>

        {currentUser.role === 'seller' && (
          <Link
            href="/seller"
            className="bg-pink-600 hover:bg-pink-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ml-1"
          >
            Seller Center →
          </Link>
        )}
        {currentUser.role === 'admin' && (
          <Link
            href="/superadmin"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ml-1"
          >
            Buka Superadmin →
          </Link>
        )}
      </div>

      {/* Expanded Menu */}
      {isExpanded && (
        <div className="absolute bottom-10 right-0 mb-1 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-2 shadow-2xl w-48 text-xs space-y-1">
          <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Ganti Akun Demo</p>
          {allDemoUsers.map((u) => {
            const isActive = currentUser.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => handleSwitch(u.id, u.role === 'buyer' ? 'Pembeli' : 'Seller Center')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] font-medium transition-colors ${
                  isActive ? 'bg-brand-500 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {u.role === 'buyer' ? '👤' : u.role === 'seller' ? '🏪' : '🛡️'} {u.name.split(' ')[0]}
                </span>
                <span className="text-[9px] opacity-70 uppercase">{u.role}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
