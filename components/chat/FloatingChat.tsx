'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  ChevronLeft,
  Store,
  CheckCheck,
  Check,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Search,
  Smile,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { useChatStore } from '@/lib/store/useChatStore';
import { formatRupiah } from '@/lib/utils/formatters';

export function FloatingChat() {
  const {
    isOpen,
    activeConversationId,
    attachedProduct,
    conversations,
    isTyping,
    typingShopName,
    toggleChat,
    closeChat,
    selectConversation,
    attachProduct,
    sendMessage,
    getTotalUnreadCount,
  } = useChatStore();

  const [inputMessage, setInputMessage] = useState('');
  const [viewMode, setViewMode] = useState<'room' | 'list'>('room');
  const [searchFilter, setSearchFilter] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalUnread = getTotalUnreadCount();
  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Auto-scroll to bottom when messages or typing status changes
  useEffect(() => {
    if (isOpen && viewMode === 'room') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, viewMode, activeConv?.messages, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && viewMode === 'room') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, viewMode, activeConversationId]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !attachedProduct) return;
    sendMessage(inputMessage, attachedProduct || undefined);
    setInputMessage('');
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text, attachedProduct || undefined);
  };

  const filteredConversations = conversations.filter((c) =>
    c.shopName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50">
          <button
            onClick={toggleChat}
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Buka Chat Penjual"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5 transition-transform group-hover:rotate-12" />
              {totalUnread > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {totalUnread}
                </span>
              )}
            </div>
            <span className="font-bold text-xs sm:text-sm tracking-wide pr-1">Chat Penjual</span>
          </button>
        </div>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-50 w-full sm:w-[380px] h-[100dvh] sm:h-[560px] max-h-[100dvh] sm:max-h-[85vh] bg-white sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-3.5 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              {viewMode === 'room' && (
                <button
                  onClick={() => setViewMode('list')}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                  title="Daftar Chat"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {viewMode === 'room' && activeConv ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/50 shrink-0 bg-white/20">
                    <img
                      src={activeConv.shopAvatar}
                      alt={activeConv.shopName}
                      className="w-full h-full object-cover"
                    />
                    {activeConv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-pink-700" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-xs sm:text-sm truncate leading-tight">
                        {activeConv.shopName}
                      </h3>
                      {activeConv.shopBadge === 'official' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-pink-100 font-medium leading-none mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {activeConv.lastSeen || 'Online'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-pink-200" />
                  <h3 className="font-extrabold text-sm tracking-wide">TumbasChat</h3>
                </div>
              )}
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode(viewMode === 'room' ? 'list' : 'room')}
                className="p-1.5 hover:bg-white/20 rounded-lg text-pink-100 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                title={viewMode === 'room' ? 'Semua Obrolan' : 'Kembali ke Chat'}
              >
                {viewMode === 'room' ? 'Semua' : 'Buka'}
              </button>
              <button
                onClick={closeChat}
                className="p-1.5 hover:bg-white/20 rounded-lg text-pink-100 hover:text-white transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VIEW 1: CONVERSATIONS LIST */}
          {viewMode === 'list' && (
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
              {/* Search in chats */}
              <div className="p-3 bg-white border-b border-slate-100">
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari toko atau CS..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  {searchFilter && (
                    <button onClick={() => setSearchFilter('')}>
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Chat list */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      selectConversation(conv.id);
                      setViewMode('room');
                    }}
                    className={`w-full text-left p-3.5 flex items-center gap-3 hover:bg-pink-50/50 transition-colors cursor-pointer ${
                      conv.id === activeConversationId ? 'bg-pink-50/30' : 'bg-white'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <img src={conv.shopAvatar} alt={conv.shopName} className="w-full h-full object-cover" />
                      {conv.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-xs text-slate-800 truncate flex items-center gap-1">
                          {conv.shopName}
                          {conv.shopBadge === 'official' && (
                            <ShieldCheck className="w-3 h-3 text-pink-600 inline" />
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate leading-snug">
                        {conv.lastMessage || 'Mulai percakapan...'}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-pink-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: ACTIVE CHAT ROOM */}
          {viewMode === 'room' && activeConv && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
              {/* Product Attachment Preview Card (If Attached) */}
              {attachedProduct && (
                <div className="bg-white border-b border-slate-200 p-2.5 flex items-center gap-2.5 shrink-0 shadow-2xs">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 relative bg-slate-50">
                    <img
                      src={attachedProduct.image}
                      alt={attachedProduct.title}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tanya Produk Ini:</p>
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                      {attachedProduct.title}
                    </h4>
                    <p className="text-xs font-black text-pink-600">
                      {formatRupiah(attachedProduct.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => attachProduct(null)}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                    title="Batal lampirkan"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                {/* Date Divider */}
                <div className="text-center my-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Hari ini
                  </span>
                </div>

                {activeConv.messages.map((msg) => {
                  const isMe = msg.senderRole === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      {/* Product Card Inside Message */}
                      {msg.productAttachment && (
                        <div
                          className={`max-w-[85%] rounded-xl p-2 border mb-1 flex items-center gap-2 ${
                            isMe
                              ? 'bg-pink-50 border-pink-200 text-slate-800'
                              : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-white border border-slate-100 shrink-0">
                            <img
                              src={msg.productAttachment.image}
                              alt=""
                              className="w-full h-full object-contain p-0.5"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-800 truncate leading-snug">
                              {msg.productAttachment.title}
                            </p>
                            <p className="text-xs font-black text-pink-600">
                              {formatRupiah(msg.productAttachment.price)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bubble */}
                      <div className="flex items-end gap-1.5 max-w-[85%]">
                        {!isMe && (
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 shrink-0 mb-1">
                            <img
                              src={msg.senderAvatar || activeConv.shopAvatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-xs shadow-xs'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>

                      {/* Timestamp & Status */}
                      <div
                        className={`flex items-center gap-1 text-[9px] text-slate-400 px-1 ${
                          isMe ? 'justify-end' : 'justify-start ml-7'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isMe && (
                          <CheckCheck className="w-3 h-3 text-pink-500" />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 ml-1 text-slate-400 text-xs animate-in fade-in duration-150">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <img src={activeConv.shopAvatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-3 py-2 flex items-center gap-1 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 italic">Sedang mengetik...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              {activeConv.quickReplies && activeConv.quickReplies.length > 0 && (
                <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                  {activeConv.quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReply(reply)}
                      className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-pink-50 hover:text-pink-600 border border-slate-200 hover:border-pink-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input */}
              <form
                onSubmit={handleSend}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`Kirim pesan ke ${activeConv.shopName}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 text-xs bg-slate-100 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:ring-1 focus:ring-pink-500 placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() && !attachedProduct}
                  className="p-2.5 rounded-xl bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-40 disabled:hover:bg-pink-600 transition-colors shadow-xs shrink-0 cursor-pointer"
                  title="Kirim Pesan"
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
