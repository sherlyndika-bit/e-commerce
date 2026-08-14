'use client';

import React, { useState } from 'react';
import { Search, Users, ShieldCheck, Store, Ban } from 'lucide-react';

const mockUsers = [
  { id: 'USR-001', name: 'Rian Kusuma', email: 'rian@example.com', role: 'buyer', joined: '2023-02-10', transactions: 28, totalSpend: 4500000, status: 'ACTIVE' },
  { id: 'USR-002', name: 'Nadia Salsabila', email: 'nadia@example.com', role: 'buyer', joined: '2023-05-18', transactions: 14, totalSpend: 2100000, status: 'ACTIVE' },
  { id: 'USR-003', name: 'Rina Karlina', email: 'rina@beautyshop.com', role: 'seller', joined: '2022-11-05', transactions: 245, totalSpend: 0, status: 'ACTIVE' },
  { id: 'USR-004', name: 'Budi Haryanto', email: 'budi@digitalstore.com', role: 'seller', joined: '2023-01-15', transactions: 124, totalSpend: 0, status: 'ACTIVE' },
  { id: 'USR-005', name: 'Faisal Akbar', email: 'faisal@example.com', role: 'buyer', joined: '2024-03-22', transactions: 6, totalSpend: 890000, status: 'ACTIVE' },
  { id: 'USR-006', name: 'Dewi Rahayu', email: 'dewi@herbalsehat.com', role: 'seller', joined: '2023-07-01', transactions: 38, totalSpend: 0, status: 'ACTIVE' },
  { id: 'USR-007', name: 'Agus Prasetyo', email: 'agus@example.com', role: 'buyer', joined: '2024-06-15', transactions: 3, totalSpend: 250000, status: 'INACTIVE' },
  { id: 'USR-008', name: 'Bambang Santoso', email: 'bamb@serbaada.com', role: 'seller', joined: '2023-12-01', transactions: 4, totalSpend: 0, status: 'BANNED' },
];

export default function SuperadminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total User', value: mockUsers.length, color: 'text-slate-900' },
    { label: 'User Aktif', value: mockUsers.filter(u => u.status === 'ACTIVE').length, color: 'text-emerald-600' },
    { label: 'Seller', value: mockUsers.filter(u => u.role === 'seller').length, color: 'text-indigo-600' },
    { label: 'Diblokir', value: mockUsers.filter(u => u.status === 'BANNED').length, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Manajemen User</h1>
        <p className="text-sm text-slate-500 mt-0.5">Pantau seluruh pengguna yang terdaftar di platform COinAja.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari nama, email, atau ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:bg-white transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">Pengguna</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Bergabung</th>
                <th className="px-5 py-3.5">Transaksi</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600 flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${u.role === 'seller' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {u.role === 'seller' ? <Store className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                      {u.role === 'seller' ? 'Seller' : 'Pembeli'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{u.joined}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{u.transactions}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : u.status === 'BANNED' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {u.status === 'ACTIVE' ? '● Aktif' : u.status === 'BANNED' ? '✕ Diblokir' : '○ Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md transition-colors">Detail</button>
                      {u.status !== 'BANNED' ? (
                        <button className="px-2.5 py-1 text-[11px] font-medium bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-md transition-colors">Blokir</button>
                      ) : (
                        <button className="px-2.5 py-1 text-[11px] font-medium bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 rounded-md transition-colors">Aktifkan</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
