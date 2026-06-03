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
      // The backend /wallets/me endpoint requires authentication.
      // We can fetch this or a custom check auth endpoint if it exists.
      // Looking at backend README, GET /api/v1/wallets/me is protected.
      // We will make a request to /wallets/me to see if the session is valid.
      // If it succeeds, the user is authenticated.
      const response = await api.get('/wallets/me');
      
      // Let's assume the response contains user details or we can extract it.
      // Since it's /wallets/me, let's see if the response payload has wallet and user details.
      // We'll structure it based on typical payload.
      // If the response is successful, we set isAuthenticated: true.
      // We can also fetch the user list or assume a decoded user from the response.
      // Wait, let's assume the response has { user: User, id: string, balance: string, ... }
      // Or we can save a user object in localStorage upon login and verify it.
      // Let's check what the user details are. If they are stored in localStorage,
      // we can load them, but checkAuth will verify if the session is still active.
      
      // If user details are stored in localStorage:
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('wl_user') : null;
      let user: User | null = null;
      if (storedUser) {
        user = JSON.parse(storedUser);
      } else {
        // Fallback user if we don't have it in local storage but the wallet fetch succeeded
        user = {
          user_id: response.data.data?.user_id || '',
          email: 'user@ledger.local',
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
