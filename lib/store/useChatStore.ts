import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatConversation, ChatMessage, ChatProductAttachment } from '../types/chat';

const initialConversations: ChatConversation[] = [
  {
    id: 'conv-1',
    shopId: 'seller-1',
    shopName: 'Official Store Apple ID',
    shopAvatar: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=150&auto=format&fit=crop&q=80',
    shopBadge: 'official',
    isOnline: true,
    lastSeen: 'Online',
    lastMessage: 'Halo kak! Ada yang bisa kami bantu untuk iPhone 15 Pro?',
    lastMessageTime: '10:45',
    unreadCount: 1,
    quickReplies: ['Apakah stok ready?', 'Bisa kirim hari ini?', 'Apakah garansi resmi iBox?'],
    messages: [
      {
        id: 'msg-1',
        senderId: 'seller-1',
        senderName: 'Official Store Apple ID',
        senderRole: 'seller',
        senderAvatar: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=150&auto=format&fit=crop&q=80',
        content: 'Selamat datang di Official Store Apple ID! Semua produk bergaransi resmi TAM/iBox.',
        timestamp: '10:40',
        isRead: true,
      },
      {
        id: 'msg-2',
        senderId: 'seller-1',
        senderName: 'Official Store Apple ID',
        senderRole: 'seller',
        senderAvatar: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=150&auto=format&fit=crop&q=80',
        content: 'Halo kak! Ada yang bisa kami bantu untuk iPhone 15 Pro?',
        timestamp: '10:45',
        isRead: false,
      },
    ],
  },
  {
    id: 'conv-2',
    shopId: 'seller-2',
    shopName: 'Erigo Official Store',
    shopAvatar: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=150&auto=format&fit=crop&q=80',
    shopBadge: 'official',
    isOnline: true,
    lastSeen: 'Online',
    lastMessage: 'Terima kasih telah berbelanja di Erigo!',
    lastMessageTime: 'Kemarin',
    unreadCount: 0,
    quickReplies: ['Ready size XL?', 'Bahan cotton combed?', 'Kapan promo cashback?'],
    messages: [
      {
        id: 'msg-2-1',
        senderId: 'seller-2',
        senderName: 'Erigo Official Store',
        senderRole: 'seller',
        senderAvatar: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=150&auto=format&fit=crop&q=80',
        content: 'Halo kak! Koleksi oversize t-shirt terbaru sudah ready ya.',
        timestamp: '09:12',
        isRead: true,
      },
    ],
  },
  {
    id: 'conv-3',
    shopId: 'support',
    shopName: 'TumbasCO Care (24/7 CS)',
    shopAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    shopBadge: 'support',
    isOnline: true,
    lastSeen: 'Online 24 Jam',
    lastMessage: 'Ada kendala transaksi atau klaim voucher? Kami siap membantu.',
    lastMessageTime: '08:00',
    unreadCount: 0,
    quickReplies: ['Cara klaim voucher gratis ongkir', 'Status pengembalian dana', 'Cara daftar jadi seller'],
    messages: [
      {
        id: 'msg-3-1',
        senderId: 'support',
        senderName: 'TumbasCO Care',
        senderRole: 'support',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Halo! Selamat datang di Layanan Pelanggan TumbasCO. Ada kendala transaksi atau klaim voucher? Kami siap membantu.',
        timestamp: '08:00',
        isRead: true,
      },
    ],
  },
];

interface ChatStore {
  isOpen: boolean;
  activeConversationId: string | null;
  attachedProduct: ChatProductAttachment | null;
  conversations: ChatConversation[];
  isTyping: boolean;
  typingShopName: string;

  // Actions
  toggleChat: () => void;
  openChat: (shopId?: string, product?: any, shopInfo?: { name: string; avatar?: string; badge?: any }) => void;
  closeChat: () => void;
  selectConversation: (convId: string) => void;
  attachProduct: (product: ChatProductAttachment | null) => void;
  sendMessage: (content: string, productAttachment?: ChatProductAttachment) => void;
  markConversationAsRead: (convId: string) => void;
  getTotalUnreadCount: () => number;
}

// Sound chime generator using browser Web Audio API
function playChimeSound() {
  try {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      activeConversationId: 'conv-1',
      attachedProduct: null,
      conversations: initialConversations,
      isTyping: false,
      typingShopName: '',

      toggleChat: () => {
        const nextState = !get().isOpen;
        set({ isOpen: nextState });
        if (nextState && get().activeConversationId) {
          get().markConversationAsRead(get().activeConversationId!);
        }
      },

      openChat: (shopId, product, shopInfo) => {
        const state = get();
        let targetConvId = state.activeConversationId || 'conv-1';

        if (shopId) {
          const existing = state.conversations.find((c) => c.shopId === shopId);
          if (existing) {
            targetConvId = existing.id;
          } else {
            // Create a new conversation for this seller
            const newConv: ChatConversation = {
              id: `conv-${Date.now()}`,
              shopId,
              shopName: shopInfo?.name || 'Toko Partner TumbasCO',
              shopAvatar: shopInfo?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              shopBadge: shopInfo?.badge || 'star',
              isOnline: true,
              lastSeen: 'Online',
              lastMessage: 'Halo! Ada yang bisa kami bantu?',
              lastMessageTime: 'Baru saja',
              unreadCount: 0,
              quickReplies: ['Apakah produk ready?', 'Bisa kirim hari ini?', 'Bisa minta foto asli?'],
              messages: [
                {
                  id: `msg-${Date.now()}`,
                  senderId: shopId,
                  senderName: shopInfo?.name || 'Toko Partner TumbasCO',
                  senderRole: 'seller',
                  senderAvatar: shopInfo?.avatar,
                  content: `Halo kak! Selamat datang di ${shopInfo?.name || 'toko kami'}. Silakan tanya jika ada pertanyaan seputar produk kami. 😊`,
                  timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                  isRead: true,
                },
              ],
            };

            set({
              conversations: [newConv, ...state.conversations],
            });
            targetConvId = newConv.id;
          }
        }

        let productAttachment: ChatProductAttachment | null = null;
        if (product) {
          productAttachment = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || '',
            slug: product.slug,
          };
        }

        set({
          isOpen: true,
          activeConversationId: targetConvId,
          attachedProduct: productAttachment,
        });

        get().markConversationAsRead(targetConvId);
      },

      closeChat: () => {
        set({ isOpen: false });
      },

      selectConversation: (convId: string) => {
        set({ activeConversationId: convId });
        get().markConversationAsRead(convId);
      },

      attachProduct: (product: ChatProductAttachment | null) => {
        set({ attachedProduct: product });
      },

      markConversationAsRead: (convId: string) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  unreadCount: 0,
                  messages: c.messages.map((m) => ({ ...m, isRead: true })),
                }
              : c
          ),
        }));
      },

      getTotalUnreadCount: () => {
        return get().conversations.reduce((sum, c) => sum + c.unreadCount, 0);
      },

      sendMessage: (content: string, productAttachment?: ChatProductAttachment) => {
        const state = get();
        const activeId = state.activeConversationId;
        if (!activeId || !content.trim()) return;

        const currentConv = state.conversations.find((c) => c.id === activeId);
        if (!currentConv) return;

        const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        const userMsg: ChatMessage = {
          id: `msg-u-${Date.now()}`,
          senderId: 'current-user',
          senderName: 'Saya',
          senderRole: 'user',
          content: content.trim(),
          timestamp: timeNow,
          productAttachment: productAttachment || state.attachedProduct || undefined,
          isRead: true,
        };

        // Update state with user message and clear attached product
        set((prev) => ({
          attachedProduct: null,
          conversations: prev.conversations.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  lastMessage: content.trim(),
                  lastMessageTime: timeNow,
                  messages: [...c.messages, userMsg],
                }
              : c
          ),
        }));

        // Simulate intelligent seller typing and auto-reply
        set({ isTyping: true, typingShopName: currentConv.shopName });

        setTimeout(() => {
          const lower = content.toLowerCase();
          let replyText = 'Halo kak! Pesan Anda sudah kami terima. Ada yang bisa kami bantu lagi untuk produk ini? 🙏';

          if (lower.includes('ready') || lower.includes('stok') || lower.includes('ada')) {
            replyText = 'Halo kak! Barang ini 100% ready stock ya, siap langsung dikirim hari ini sebelum jam 16.00 WIB. Silakan langsung diorder kak! 😊';
          } else if (lower.includes('kirim') || lower.includes('sampai') || lower.includes('ongkir') || lower.includes('ekspedisi')) {
            replyText = 'Pengiriman kami bisa via J&T, SiCepat, JNE, dan GoSend Instant kak. Packing sudah termasuk Bubble Wrap tebal gratis agar aman sampai alamat tujuan.';
          } else if (lower.includes('ori') || lower.includes('asli') || lower.includes('garansi') || lower.includes('official')) {
            replyText = 'Produk kami dijamin 100% Original & bergaransi resmi kak. Ada jaminan retur ganti baru 7 hari jika barang diterima dalam keadaan cacat pabrik.';
          } else if (lower.includes('diskon') || lower.includes('nego') || lower.includes('voucher') || lower.includes('murah') || lower.includes('promo')) {
            replyText = 'Bisa klaim voucher toko di beranda kami kak! Ada potongan diskon spesial dan cashback koin untuk transaksi hari ini.';
          } else if (lower.includes('size') || lower.includes('ukuran') || lower.includes('warna')) {
            replyText = 'Untuk pilihan varian & warna yang aktif di halaman produk semuanya ready ya kak. Silakan pilih varian yang diinginkan saat checkout!';
          }

          const sellerMsg: ChatMessage = {
            id: `msg-s-${Date.now()}`,
            senderId: currentConv.shopId,
            senderName: currentConv.shopName,
            senderRole: currentConv.shopBadge === 'support' ? 'support' : 'seller',
            senderAvatar: currentConv.shopAvatar,
            content: replyText,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            isRead: get().isOpen,
          };

          set((prev) => ({
            isTyping: false,
            conversations: prev.conversations.map((c) =>
              c.id === activeId
                ? {
                    ...c,
                    lastMessage: replyText,
                    lastMessageTime: sellerMsg.timestamp,
                    unreadCount: prev.isOpen ? 0 : c.unreadCount + 1,
                    messages: [...c.messages, sellerMsg],
                  }
                : c
            ),
          }));

          playChimeSound();
        }, 1200);
      },
    }),
    {
      name: 'tumbasco-chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    }
  )
);
