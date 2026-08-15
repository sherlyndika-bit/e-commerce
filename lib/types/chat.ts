export interface ChatProductAttachment {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'seller' | 'support';
  senderAvatar?: string;
  content: string;
  timestamp: string;
  productAttachment?: ChatProductAttachment;
  isRead: boolean;
  isSending?: boolean;
}

export interface ChatConversation {
  id: string;
  shopId: string;
  shopName: string;
  shopAvatar: string;
  shopBadge?: 'official' | 'star' | 'power' | 'support';
  isOnline: boolean;
  lastSeen?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: ChatMessage[];
  quickReplies?: string[];
}
