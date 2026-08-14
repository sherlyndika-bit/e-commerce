'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Store, Users, Package, CreditCard,
  FileBarChart, Settings, Bell, Menu, X, LogOut,
  ShieldAlert, Activity, ChevronDown, ExternalLink, Percent
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

const navGroups = [
  {
    title: 'PLATFORM',
    items: [
      { label: 'Overview', icon: LayoutDashboard, href: '/superadmin' },
      { label: 'Monitoring', icon: Activity, href: '/superadmin/monitoring' },
    ],
  },
  {
    title: 'MANAJEMEN',
    items: [
      { label: 'Manajemen Seller', icon: Store, href: '/superadmin/sellers' },
      { label: 'Manajemen User', icon: Users, href: '/superadmin/users' },
      { label: 'Transaksi', icon: CreditCard, href: '/superadmin/transactions' },
    ],
  },
  {
    title: 'LAPORAN & FINANSIAL',
    items: [
      { label: 'Laporan Keuangan', icon: FileBarChart, href: '/superadmin/reports' },
      { label: 'Pengaturan Komisi', icon: Percent, href: '/superadmin/commission' },
    ],
  },
  {
    title: 'SISTEM',
    items: [
      { label: 'Konfigurasi', icon: Settings, href: '/superadmin/settings' },
    ],
  },
];

const platformStats = [
  { label: 'User Aktif', value: '45,912' },
  { label: 'Seller Aktif', value: '1,284' },
  { label: 'GMV Bulan Ini', value: 'Rp890Jt' },
  { label: 'Platform Uptime', value: '99.9%' },
];

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser: user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex font-sans">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-slate-950 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-[60px] flex items-center px-5 border-b border-white/10">
          <Link href="/superadmin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-none">COinAja</div>
              <div className="text-emerald-400 text-[10px] font-semibold tracking-widest">SUPERADMIN</div>
            </div>
          </Link>
        </div>

        {/* Admin Card */}
        <div className="mx-3 mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">{user?.name || 'Superadmin'}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                <span className="text-emerald-400 text-[10px]">Tim COinAja</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="text-[9px] font-bold text-slate-500 tracking-[0.15em] mb-1.5 px-2">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-slate-400 hover:text-white hover:bg-white/5 transition-colors mb-1">
            <ExternalLink className="w-4 h-4" />
            Lihat Marketplace
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors">
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-700">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
              Platform Online
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-slate-500 hover:text-slate-700">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-slate-800 leading-none">{user?.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Superadmin COinAja</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Platform Stats Strip */}
        <div className="bg-white border-b border-slate-100 px-4 py-2 hidden lg:flex items-center gap-6">
          {platformStats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{stat.label}:</span>
                <span className="text-xs font-bold text-slate-900">{stat.value}</span>
              </div>
              {i < platformStats.length - 1 && <div className="w-px h-4 bg-slate-200" />}
            </React.Fragment>
          ))}
        </div>

        {/* Page Content */}
        <main className="flex-1 p-5 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
