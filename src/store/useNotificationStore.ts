import { create } from 'zustand';
import { Notification } from '@/types';
import api from '@/lib/axios';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  activeToast: Notification | null;
  setActiveToast: (toast: Notification | null) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  activeToast: null,
  setActiveToast: (toast) => set({ activeToast: toast }),
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    set({ notifications, unreadCount });
  },
  addNotification: (notification) => {
    const notifications = [notification, ...get().notifications];
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    set({ notifications, unreadCount });
  },
  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      const updated = get().notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      const unreadCount = updated.filter((n) => !n.is_read).length;
      set({ notifications: updated, unreadCount });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },
  markAllAsRead: async () => {
    const unread = get().notifications.filter((n) => !n.is_read);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((n) => api.patch(`/notifications/${n.id}/read`)));
      const updated = get().notifications.map((n) => ({ ...n, is_read: true }));
      set({ notifications: updated, unreadCount: 0 });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },
  clearAll: async () => {
    try {
      await api.delete('/notifications');
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  },
  fetchNotifications: async () => {
    try {
      const response = await api.get('/notifications', {
        params: { page: 1, limit: 10 },
      });
      // If endpoint is paginated, it might return data under data.notifications or similar.
      // Let's handle both array response and paginated response { notifications: [], total: ... }
      const data = response.data?.data;
      const list = data?.notifications || [];
      const unreadCount = list.filter((n: Notification) => !n.is_read).length;
      set({ notifications: list, unreadCount });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },
}));
