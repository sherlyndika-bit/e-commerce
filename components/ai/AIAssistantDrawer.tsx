'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bot, Sparkles, Send, X, ShoppingCart, ArrowRight, CornerDownRight, Check } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data/products';
import { Product } from '@/lib/types/product';
import { formatRupiah } from '@/lib/utils/formatters';
import { useCartStore } from '@/lib/store/useCartStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { Button } from '@/components/ui/Button';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendations?: Product[];
  timestamp: string;
}

export function AIAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'ai-welcome',
      sender: 'ai',
      text: 'Halo! Saya COinaja AI Smart Shopping Assistant 🤖✨ Ceritakan kebutuhan belanjamu (misal: "Rekomendasi gadget budget 1 jutaan", "Skincare untuk kulit kusam", atau "Sepatu kulit pria formal") dan saya carikan produk terbaik!',
      timestamp: 'Sekarang',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const quickPrompts = [
    '🎧 Headphone noise cancelling terbaik',
    '👞 Sepatu kulit lokal keren',
    '🧴 Skincare mencerahkan BPOM',
    '🍳 Alat masak anti lengket granit',
  ];

  const handleSendPrompt = (promptText?: string) => {
    const query = (promptText || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInputText('');

    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);

      // Search matching products based on query keywords
      const qLower = query.toLowerCase();
      let matched = mockProducts.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(qLower);
        const descMatch = p.description.toLowerCase().includes(qLower);
        const tagMatch = p.tags.some((t) => t.toLowerCase().includes(qLower));
        const catMatch = p.categorySlug.toLowerCase().includes(qLower);
        return titleMatch || descMatch || tagMatch || catMatch;
      });

      // If no exact match, fallback to top rated items
      if (matched.length === 0) {
        if (qLower.includes('gadget') || qLower.includes('audio') || qLower.includes('headphone') || qLower.includes('keyboard')) {
          matched = mockProducts.filter((p) => p.categorySlug === 'elektronik-gadget' || p.categorySlug === 'komputer-laptop');
        } else if (qLower.includes('kulit') || qLower.includes('sepatu') || qLower.includes('pria') || qLower.includes('fashion')) {
          matched = mockProducts.filter((p) => p.categorySlug === 'fashion-pria');
        } else if (qLower.includes('skincare') || qLower.includes('wajah') || qLower.includes('serum') || qLower.includes('cantik')) {
          matched = mockProducts.filter((p) => p.categorySlug === 'kecantikan-perawatan');
        } else {
          matched = mockProducts.slice(0, 3);
        }
      }

      const recs = matched.slice(0, 2);

      let responseText = `Berikut adalah rekomendasi produk terbaik di COinaja yang sesuai dengan pencarian "${query}":`;
      if (recs.length > 0) {
        responseText += ` Produk ini memiliki rating tinggi ${recs[0].rating}★ dari seller terverifikasi resmi!`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        recommendations: recs,
        timestamp: 'Baru saja',
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const handleQuickAdd = (product: Product) => {
    addItem(product, 1);
    addToast({
      title: 'Dimasukkan ke Keranjang! 🛒',
      description: product.title,
      type: 'success',
    });
  };

  return (
    <>
      {/* Floating AI Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 sm:bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 text-white shadow-glow hover:scale-105 active:scale-95 transition-all group"
        aria-label="Tanya COinaja AI"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-coin-300 animate-spin [animation-duration:8s]" />
        </div>
        <span className="text-xs font-black tracking-wide flex items-center gap-1.5">
          Tanya COinaja AI
          <span className="px-1.5 py-0.2 rounded-full bg-coin-400 text-slate-950 font-black text-[9px] uppercase">
            Smart
          </span>
        </span>
      </button>

      {/* Floating AI Panel Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 sm:bottom-20 left-4 sm:left-6 w-[92vw] sm:w-[420px] h-[560px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-700 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shadow-inner">
                ✨
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm">COinaja AI Shopping Copilot</h4>
                  <span className="bg-coin-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full">
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-white/80">Rekomendasi belanja personal berbasis AI</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/60 dark:bg-slate-950/40 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-800 shadow-2xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`text-[9px] mt-1 block ${
                      m.sender === 'user' ? 'text-brand-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {/* Product Recommendation Cards from AI */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="mt-2.5 w-full space-y-2">
                    {m.recommendations.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-subtle flex items-center gap-3 group hover:border-brand-300 transition-all"
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          <Image src={prod.images[0]} alt={prod.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${prod.slug}`}
                            className="font-bold text-xs text-slate-900 dark:text-white truncate block hover:text-brand-600 transition-colors"
                          >
                            {prod.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-brand-600 dark:text-brand-400">
                              {formatRupiah(prod.price)}
                            </span>
                            <span className="text-[10px] text-amber-500 font-bold">
                              ★ {prod.rating}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleQuickAdd(prod)}
                          variant="primary"
                          size="xs"
                          className="shrink-0"
                          leftIcon={<ShoppingCart className="w-3 h-3" />}
                        >
                          + Beli
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-850 rounded-2xl max-w-[70%] border border-slate-200 dark:border-slate-800">
                <Sparkles className="w-4 h-4 text-brand-600 animate-spin" />
                <span className="text-xs font-bold text-slate-500">
                  AI sedang menganalisis katalog...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-2.5 bg-slate-100/70 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendPrompt(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/60 dark:hover:text-brand-300 text-[10px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap transition-colors border border-slate-200/60 dark:border-slate-700 shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Tanya rekomendasi produk, budget, atau varian..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 h-9 px-3 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
