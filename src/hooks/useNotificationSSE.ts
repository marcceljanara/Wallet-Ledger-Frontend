import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Notification } from '@/types';

export function useNotificationSSE() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    // Fetch existing notifications first
    useNotificationStore.getState().fetchNotifications();

    const streamUrl = `${
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
    }/notifications/stream`;

    console.log('Connecting to SSE stream:', streamUrl);
    // Connect using native EventSource. Since backend session token is HTTPOnly cookie,
    // browser EventSource will automatically send the cookie if withCredentials is true.
    const es = new EventSource(streamUrl, { withCredentials: true });
    eventSourceRef.current = es;

    es.onopen = () => {
      console.log('SSE connection opened');
    };

    const handleNotification = (event: MessageEvent) => {
      try {
        console.log('SSE notification received:', event.data);
        const newNotif: Notification = JSON.parse(event.data);
        useNotificationStore.getState().addNotification(newNotif);
      } catch (err) {
        console.error('Failed to parse SSE notification:', err);
      }
    };

    es.addEventListener('notification', handleNotification);

    es.onerror = (err) => {
      console.error('SSE connection error:', err);
      // Native EventSource automatically attempts to reconnect on failure
    };

    return () => {
      console.log('Closing SSE connection');
      es.removeEventListener('notification', handleNotification);
      es.close();
      if (eventSourceRef.current === es) {
        eventSourceRef.current = null;
      }
    };
  }, [isAuthenticated]);

  return eventSourceRef.current;
}
