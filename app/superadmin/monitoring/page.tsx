'use client';

import React from 'react';
import { Activity, Server, Cpu, Database, Globe, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const uptimeData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  latency: Math.floor(Math.random() * 50) + 120,
  requests: Math.floor(Math.random() * 500) + 1200,
}));

const services = [
  { name: 'API Gateway', status: 'operational', latency: '142ms', uptime: '99.98%' },
  { name: 'Payment Service', status: 'operational', latency: '89ms', uptime: '99.99%' },
  { name: 'Search Engine', status: 'operational', latency: '65ms', uptime: '99.95%' },
  { name: 'CDN / File Storage', status: 'operational', latency: '38ms', uptime: '100%' },
  { name: 'Notification Service', status: 'degraded', latency: '320ms', uptime: '99.1%' },
  { name: 'Database Primary', status: 'operational', latency: '12ms', uptime: '100%' },
  { name: 'Cache Server', status: 'operational', latency: '4ms', uptime: '100%' },
];

const incidents = [
  { date: '2026-08-13 14:32', title: 'Notifikasi Push Terlambat', status: 'resolved', impact: 'minor' },
  { date: '2026-08-10 09:15', title: 'Peningkatan Latency API Payment', status: 'resolved', impact: 'minor' },
  { date: '2026-08-05 02:40', title: 'Maintenance Rutin Database', status: 'resolved', impact: 'maintenance' },
];

export default function SuperadminMonitoringPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Monitoring Platform</h1>
        <p className="text-sm text-slate-500 mt-0.5">Status real-time seluruh layanan dan infrastruktur TumbasCO.</p>
      </div>

      {/* Status Banner */}
      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold text-emerald-900">Semua Sistem Beroperasi Normal</p>
          <p className="text-xs text-emerald-700 mt-0.5">Update terakhir: beberapa detik yang lalu • 6/7 layanan 100% operational</p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full">99.9% Uptime</span>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Response Time', value: '142ms', icon: Clock, color: 'emerald', good: true },
          { label: 'Req/Menit', value: '1,847', icon: Activity, color: 'indigo', good: true },
          { label: 'CPU Usage', value: '34%', icon: Cpu, color: 'amber', good: true },
          { label: 'DB Query Avg', value: '12ms', icon: Database, color: 'blue', good: true },
        ].map(m => {
          const colors: any = {
            emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
            indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
            amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
            blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
          };
          const c = colors[m.color];
          return (
            <div key={m.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-3`}>
                <m.icon className={`w-4 h-4 ${c.icon}`} />
              </div>
              <p className="text-xs text-slate-500 mb-0.5">{m.label}</p>
              <p className="text-xl font-bold text-slate-900">{m.value}</p>
            </div>
          );
        })}
      </div>

      {/* Latency Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-900 mb-5">Response Time - 24 Jam Terakhir</h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={8} interval={3} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: any) => `${v}ms`} dx={-8} />
              <RechartsTooltip formatter={(value: any) => [`${value}ms`, 'Latency']} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
              <Line type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Status Layanan</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {services.map(svc => (
            <div key={svc.name} className="px-5 py-3.5 flex items-center gap-4">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${svc.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{svc.name}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${svc.status === 'operational' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                {svc.status === 'operational' ? 'Operational' : 'Degraded'}
              </span>
              <span className="text-xs text-slate-500 w-16 text-right">{svc.latency}</span>
              <span className="text-xs font-bold text-slate-700 w-14 text-right">{svc.uptime}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Incidents */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Riwayat Insiden</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {incidents.map(inc => (
            <div key={inc.title} className="px-5 py-3.5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{inc.title}</p>
                <p className="text-xs text-slate-400">{inc.date}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${inc.impact === 'minor' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                {inc.impact === 'minor' ? 'Minor' : 'Maintenance'}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">Resolved</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
