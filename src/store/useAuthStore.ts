import { create } from 'zustand';
import { User } from '@/types';
import api from '@/lib/axios';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Verify session by hitting a protected endpoint
      const response = await api.get('/wallets/me');
      
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('wl_user') : null;
      let user: User | null = null;
      if (storedUser) {
        user = JSON.parse(storedUser);
      } else {
        user = {
          user_id: response.data.data?.user_id || '',
          email: response.data.data?.email || '',
          role: 'USER',
        };
      }
      
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wl_user');
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wl_user');
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
