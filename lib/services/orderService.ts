import { mockOrders } from '../mock-data/orders';
import { Order, OrderStatus } from '../types/order';

let ordersState: Order[] = [...mockOrders];

export const orderService = {
  async getAll(): Promise<Order[]> {
    return ordersState;
  },

  async getById(id: string): Promise<Order | null> {
    const order = ordersState.find((o) => o.id === id || o.orderNumber === id);
    return order || null;
  },

  async getByUserId(userId: string): Promise<Order[]> {
    return ordersState.filter((o) => o.userId === userId);
  },

  async getBySellerId(sellerId: string): Promise<Order[]> {
    return ordersState.filter((o) => o.storeOrders.some((so) => so.sellerId === sellerId));
  },

  async createOrder(newOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const created: Order = {
      ...newOrder,
      id: `ord-${Date.now()}`,
      orderNumber: `CO-${datePrefix}-${randomNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ordersState.unshift(created);
    return created;
  },

  async updateStoreOrderStatus(
    orderId: string,
    sellerId: string,
    newStatus: OrderStatus,
    description: string,
    trackingNumber?: string
  ): Promise<Order | null> {
    const order = ordersState.find((o) => o.id === orderId);
    if (!order) return null;

    const storeOrder = order.storeOrders.find((so) => so.sellerId === sellerId);
    if (!storeOrder) return null;

    storeOrder.status = newStatus;
    if (trackingNumber) {
      storeOrder.trackingNumber = trackingNumber;
    }
    storeOrder.statusHistory.push({
      status: newStatus,
      title: `Status: ${newStatus.toUpperCase()}`,
      description,
      timestamp: new Date().toISOString(),
    });

    order.updatedAt = new Date().toISOString();
    return order;
  },
};
