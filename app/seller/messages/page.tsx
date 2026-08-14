'use client';

import React, { useState } from 'react';
import { MessageSquare, Search, Send, Circle } from 'lucide-react';

const mockChats = [
  { id: '1', buyer: 'Rian Kusuma', avatar: 'R', lastMsg: 'Kak, apakah produknya ready?', time: '10:23', unread: 2, product: 'Serum Vitamin C' },
  { id: '2', buyer: 'Nadia Salsabila', avatar: 'N', lastMsg: 'Oke kak, ditunggu ya!', time: '09:45', unread: 0, product: 'Moisturizer SPF50' },
  { id: '3', buyer: 'Faisal Akbar', avatar: 'F', lastMsg: 'Berapa lama pengirimannya?', time: '08:12', unread: 1, product: 'Sony WF-1000XM5' },
  { id: '4', buyer: 'Budi Santoso', avatar: 'B', lastMsg: 'Terima kasih kak!', time: 'Kemarin', unread: 0, product: 'Kemeja Flanel' },
  { id: '5', buyer: 'Dewi Anggraini', avatar: 'D', lastMsg: 'Ada diskon gak kak?', time: 'Kemarin', unread: 0, product: 'Paket Jamu' },
];

const mockMessages = [
  { from: 'buyer', text: 'Kak, apakah stok produk Serum Vitamin C masih ada?', time: '10:15' },
  { from: 'seller', text: 'Halo kak! Masih ada stok yaa 😊', time: '10:16' },
  { from: 'buyer', text: 'Oh oke kak. Kalau beli 2 ada diskon gak?', time: '10:18' },
  { from: 'seller', text: 'Untuk pembelian 2 pcs, kaka bisa pakai voucher HEMAT10 ya kak, diskon 10%!', time: '10:20' },
  { from: 'buyer', text: 'Wah oke kak, ditunggu ya pengirimannya!', time: '10:22' },
  { from: 'buyer', text: 'Kak, apakah produknya ready?', time: '10:23' },
];

export default function SellerMessagesPage() {
  const [activeChat, setActiveChat] = useState(mockChats[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Pesan</h1>
        <p className="text-sm text-slate-500 mt-0.5">Chat dengan pembeli dan jawab pertanyaan mereka.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex h-[600px]">
        {/* Chat List */}
        <div className="w-72 border-r border-slate-100 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari pembeli..." className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-all" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {mockChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${activeChat.id === chat.id ? 'bg-pink-50 border-l-2 border-pink-500' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900 truncate">{chat.buyer}</p>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">{chat.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{chat.lastMsg}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{chat.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
              {activeChat.avatar}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{activeChat.buyer}</p>
              <p className="text-[11px] text-slate-400">Re: {activeChat.product}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <Circle className="w-2 h-2 fill-current" />
              Online
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50">
            {mockMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'seller' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.from === 'seller' ? 'bg-pink-600 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm shadow-xs'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === 'seller' ? 'text-pink-200' : 'text-slate-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="px-5 py-2 border-t border-slate-100 bg-white flex gap-2 overflow-x-auto">
            {['Stok masih ada 😊', 'Pengiriman 1-3 hari', 'Terima kasih!', 'Cek deskripsi produk ya'].map(r => (
              <button key={r} onClick={() => setMessage(r)} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200 border border-slate-200 text-slate-600 text-xs font-medium rounded-full transition-colors flex-shrink-0">
                {r}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="px-4 py-3 border-t border-slate-100 bg-white flex gap-3 items-center">
            <input
              type="text"
              placeholder="Ketik pesan..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
            />
            <button className="w-10 h-10 rounded-xl bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition-colors flex-shrink-0 shadow-sm">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
