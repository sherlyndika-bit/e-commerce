import { create } from 'zustand';
import { mockUsers } from '../mock-data/users';
import { User } from '../types/user';

interface AuthStoreState {
  currentUser: User;
  allDemoUsers: User[];
  isAuthenticated: boolean;
  switchUser: (userId: string) => void;
  setUserRole: (role: 'buyer' | 'seller' | 'admin') => void;
  login: (email: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addAddress: (address: User['addresses'][0]) => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  currentUser: mockUsers[0], // default: Budi Santoso (Buyer)
  allDemoUsers: mockUsers,
  isAuthenticated: true,

  switchUser: (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
    }
  },

  setUserRole: (role: 'buyer' | 'seller' | 'admin') => {
    const targetUser = mockUsers.find((u) => u.role === role) || mockUsers[0];
    set({ currentUser: targetUser, isAuthenticated: true });
  },

  login: (email: string) => {
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || mockUsers[0];
    set({ currentUser: user, isAuthenticated: true });
    return true;
  },

  logout: () => {
    set({ isAuthenticated: false });
  },

  updateUser: (updates) => {
    set((state) => ({
      currentUser: { ...state.currentUser, ...updates },
    }));
  },

  addAddress: (newAddr) => {
    set((state) => {
      const addresses = [...state.currentUser.addresses];
      if (newAddr.isDefault) {
        addresses.forEach((a) => (a.isDefault = false));
      }
      return {
        currentUser: {
          ...state.currentUser,
          addresses: [newAddr, ...addresses],
        },
      };
    });
  },
}));
