import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'PENDING_PAYMENT' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  courier?: string;
}

interface OrderStore {
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus, trackingInfo?: { trackingNumber: string, courier: string }) => void;
}

// Initial mock orders for the ERP to show some data immediately
const mockInitialOrders: Order[] = [
  {
    id: 'ORD-2026-0001',
    customerId: 'user-2',
    customerName: 'Budi Santoso',
    customerPhone: '081234567890',
    shippingAddress: 'Jl. Sudirman No. 1, Jakarta Selatan, 12190',
    totalAmount: 154000,
    status: 'PROCESSING',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    items: [
      {
        id: 'item-1',
        productId: 'prod-2',
        productName: 'Brodo Base Signature - Black White',
        price: 350000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'ORD-2026-0002',
    customerId: 'user-3',
    customerName: 'Siti Aminah',
    customerPhone: '085612345678',
    shippingAddress: 'Jl. Malioboro No. 10, Yogyakarta, 55271',
    totalAmount: 5120000,
    status: 'PENDING_PAYMENT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item-2',
        productId: 'prod-1',
        productName: 'Sony WH-1000XM5 Wireless Headphones',
        price: 4999000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'
      }
    ]
  }
];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: mockInitialOrders,

      placeOrder: (orderData) =>
        set((state) => {
          const newOrder: Order = {
            ...orderData,
            id: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { orders: [newOrder, ...state.orders] };
        }),

      updateOrderStatus: (id, status, trackingInfo) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? {
                  ...order,
                  status,
                  ...(trackingInfo ? trackingInfo : {}),
                  updatedAt: new Date().toISOString(),
                }
              : order
          ),
        })),
    }),
    {
      name: 'coinaja-orders-storage',
      skipHydration: true,
    }
  )
);
