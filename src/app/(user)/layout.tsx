'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationSSE } from '@/hooks/useNotificationSSE';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { NotificationToast } from '@/components/shared/NotificationToast';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  
  // Establish native SSE connection for real-time notifications
  useNotificationSSE();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 border-t border-r border-primary animate-spin" />
          <span className="uppercase tracking-widest text-text-muted">Authenticating Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 font-sans">
          {children}
        </main>
      </div>
      <NotificationToast />
    </div>
  );
}
