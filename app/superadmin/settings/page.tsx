'use client';

import React, { useState } from 'react';
import { Settings, Globe, Bell, Shield, CreditCard, Mail, Smartphone, ChevronRight, Save, ToggleLeft, ToggleRight } from 'lucide-react';

export default function SuperadminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [sellerVerifAuto, setSellerVerifAuto] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-emerald-500' : 'bg-slate-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`} style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }} />
    </button>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Konfigurasi Platform</h1>
        <p className="text-sm text-slate-500 mt-0.5">Atur parameter global dan konfigurasi sistem COinAja.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Platform Settings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Pengaturan Platform</h2>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Mode Maintenance</p>
                <p className="text-xs text-slate-400 mt-0.5">Nonaktifkan akses publik sementara</p>
              </div>
              <Toggle value={maintenanceMode} onChange={setMaintenanceMode} />
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Registrasi Terbuka</p>
                <p className="text-xs text-slate-400 mt-0.5">Izinkan pengguna baru mendaftar</p>
              </div>
              <Toggle value={registrationOpen} onChange={setRegistrationOpen} />
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Verifikasi Seller Otomatis</p>
                <p className="text-xs text-slate-400 mt-0.5">Seller langsung aktif tanpa review manual</p>
              </div>
              <Toggle value={sellerVerifAuto} onChange={setSellerVerifAuto} />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Notifikasi Admin</h2>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Notifikasi Email</p>
                <p className="text-xs text-slate-400 mt-0.5">Laporan harian dan alert kritis via email</p>
              </div>
              <Toggle value={emailNotif} onChange={setEmailNotif} />
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Push Notification</p>
                <p className="text-xs text-slate-400 mt-0.5">Alert real-time di browser</p>
              </div>
              <Toggle value={pushNotif} onChange={setPushNotif} />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Informasi Platform</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Versi Platform', value: 'v2.4.1' },
            { label: 'Environment', value: 'Production' },
            { label: 'Region', value: 'Asia / Jakarta' },
            { label: 'Last Deploy', value: '2026-08-14 20:23' },
          ].map(info => (
            <div key={info.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{info.label}</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{info.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Pengaturan Lanjutan</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { icon: CreditCard, label: 'Konfigurasi Payment Gateway', desc: 'Atur integrasi Midtrans, QRIS, COinPay' },
            { icon: Mail, label: 'Template Email Platform', desc: 'Edit template email transaksional' },
            { icon: Smartphone, label: 'Konfigurasi Push Notification', desc: 'FCM keys dan delivery settings' },
            { icon: Shield, label: 'Keamanan & Audit Log', desc: 'Log akses admin dan security events' },
          ].map(item => (
            <button key={item.label} className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
