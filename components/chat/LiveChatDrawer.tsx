'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MessageCircle, X, Send, Store, CheckCheck, Smile, Paperclip, ChevronLeft, Sparkles } from 'lucide-react';
import { mockSellers } from '@/lib/mock-data/sellers';
import { formatRupiah } from '@/lib/utils/formatters';

interface Message {
  id: string;
  sender: 'user' | 'seller';
  text: string;
  timestamp: string;
}

interface Conversation {
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerBadge: 'official' | 'star' | 'regular';
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: Message[];
}

export function LiveChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSellerId, setActiveSellerId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      sellerId: 'seller-1',
      sellerName: 'Brodo Footwear Official',
      sellerAvatar: mockSellers[0].avatar,
      sellerBadge: 'official',
      lastMessage: 'Halo kak Budi, pesanan sepatu Signore Boots sudah kami siapkan ya!',
      lastTime: '15:42',
      unreadCount: 1,
      messages: [
        {
          id: 'm1',
          sender: 'seller',
          text: 'Halo kak Budi, terima kasih sudah berkunjung ke Brodo Official!',
          timestamp: '15:40',
        },
        {
          id: 'm2',
          sender: 'seller',
          text: 'Halo kak Budi, pesanan sepatu Signore Boots sudah kami siapkan ya!',
          timestamp: '15:42',
        },
      ],
    },
    {
      sellerId: 'seller-2',
      sellerName: 'Somethinc Beauty ID',
      sellerAvatar: mockSellers[1].avatar,
      sellerBadge: 'official',
      lastMessage: 'Serum Niacinamide 10% batch terbaru expiry date 2028 kak.',
      lastTime: '14:20',
      unreadCount: 0,
      messages: [
        {
          id: 'm3',
          sender: 'user',
          text: 'Kak, serum Niacinamide-nya ready stock?',
          timestamp: '14:18',
        },
        {
          id: 'm4',
          sender: 'seller',
          text: 'Serum Niacinamide 10% batch terbaru expiry date 2028 kak, 100% ready!',
          timestamp: '14:20',
        },
      ],
    },
    {
      sellerId: 'seller-3',
      sellerName: 'TechZone Gadget Store',
      sellerAvatar: mockSellers[2].avatar,
      sellerBadge: 'official',
      lastMessage: 'Garansi resmi Sony Indonesia 1 tahun klaim bisa di seluruh service center.',
      lastTime: 'Kemarin',
      unreadCount: 0,
      messages: [
        {
          id: 'm5',
          sender: 'seller',
          text: 'Garansi resmi Sony Indonesia 1 tahun klaim bisa di seluruh service center.',
          timestamp: 'Kemarin',
        },
      ],
    },
  ]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const activeConv = conversations.find((c) => c.sellerId === activeSellerId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTyping]);

  const handleOpenConversation = (sellerId: string) => {
    setActiveSellerId(sellerId);
    setConversations((prev) =>
      prev.map((c) => (c.sellerId === sellerId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeSellerId) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Sekarang',
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.sellerId === activeSellerId
          ? {
              ...c,
              lastMessage: text.trim(),
              lastTime: 'Sekarang',
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );

    if (!textToSend) setInputText('');

    // Simulate seller smart auto-response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const autoReplies: Record<string, string> = {
        'seller-1': 'Baik kak, produk ini 100% original kulit sapi asli dan siap dikirim hari ini juga! Ada variasi ukuran yang ingin dipastikan?',
        'seller-2': 'Halo kak! Semua produk kami BPOM verified dan ready stock ya. Pesanan sebelum jam 16:00 WIB langsung dikirim sore ini kak ✨',
        'seller-3': 'Siap kak, produk gadget di TechZone bergaransi resmi, segel utuh, dan free bubble wrap tebal 4 lapis!',
      };

      const replyText =
        autoReplies[activeSellerId] ||
        'Terima kasih sudah menghubungi toko kami! Tim admin kami sedang mengecek ketersediaan stok untukmu kak.';

      const sellerMsg: Message = {
        id: `msg-rep-${Date.now()}`,
        sender: 'seller',
        text: replyText,
        timestamp: 'Baru saja',
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.sellerId === activeSellerId
            ? {
                ...c,
                lastMessage: replyText,
                lastTime: 'Baru saja',
                messages: [...c.messages, sellerMsg],
              }
            : c
        )
      );
    }, 1200);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-elevated hover:shadow-glow hover:scale-105 active:scale-95 transition-all group"
        aria-label="Live Chat Seller"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5" />
          {totalUnread > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-coin-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-xs">
              {totalUnread}
            </span>
          )}
        </div>
        <span className="text-xs font-black tracking-wide hidden sm:inline">
          Live Chat Toko
        </span>
      </button>

      {/* Floating Chat Panel Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-96 h-[520px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
            {activeSellerId ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveSellerId(null)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/40">
                  <Image src={activeConv?.sellerAvatar || ''} alt="" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-tight truncate max-w-[170px]">
                    {activeConv?.sellerName}
                  </h4>
                  <span className="text-[10px] text-pink-300 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                    Online (Balas &lt; 5 menit)
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center font-bold text-coin-300">
                  💬
                </div>
                <div>
                  <h4 className="font-black text-sm">Pesan & Chat Toko</h4>
                  <p className="text-[10px] text-white/80">Terhubung langsung ke seller resmi</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/60 dark:bg-slate-950/40">
            {activeSellerId && activeConv ? (
              /* Chat Thread */
              <div className="space-y-3">
                {/* Official Guarantee Pill */}
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-[10px] font-bold px-3 py-1 rounded-full border border-brand-200/60 dark:border-brand-900/40">
                    <Sparkles className="w-3 h-3 text-coin-500" />
                    Chat Dilindungi Garansi Transaksi COinaja
                  </span>
                </div>

                {activeConv.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-brand-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/70 dark:border-slate-700 shadow-2xs'
                      }`}
                    >
                      <p>{m.text}</p>
                      <div
                        className={`text-[9px] mt-1 flex items-center gap-1 ${
                          m.sender === 'user' ? 'text-brand-200 justify-end' : 'text-slate-400'
                        }`}
                      >
                        <span>{m.timestamp}</span>
                        {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              /* Conversation List */
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1">
                  Percakapan Terakhir
                </span>
                {conversations.map((c) => (
                  <div
                    key={c.sellerId}
                    onClick={() => handleOpenConversation(c.sellerId)}
                    className="p-3 bg-white dark:bg-slate-850 hover:bg-brand-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-all flex items-center gap-3 shadow-2xs hover:scale-[1.01]"
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700">
                      <Image src={c.sellerAvatar} alt={c.sellerName} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {c.sellerName}
                        </h4>
                        <span className="text-[10px] text-slate-400">{c.lastTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                    </div>

                    {c.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-coin-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Replies & Footer Input */}
          {activeSellerId && (
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
              {/* Quick Reply Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2">
                {[
                  'Barang ready kak?',
                  'Bisa kirim hari ini?',
                  'Apakah bergaransi resmi?',
                  'Bisa minta foto aslinya?',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/60 dark:hover:text-brand-300 text-[10px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap transition-colors border border-slate-200/60 dark:border-slate-700"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Text Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ketik pesan untuk penjual..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 h-9 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
