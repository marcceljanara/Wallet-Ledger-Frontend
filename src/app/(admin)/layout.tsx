'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationSSE } from '@/hooks/useNotificationSSE';
import { Navbar } from '@/components/layout/Navbar';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, checkAuth } = useAuthStore();
  
  // Establish native SSE connection for admin notification alerts
  useNotificationSSE();

  React.useEffect(() => {
    checkAuth().then((currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else if (currentUser.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    });
  }, [checkAuth, router]);

  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 border-t border-r border-error animate-spin" />
          <span className="uppercase tracking-widest text-error">Verifying Administrative Privileges...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-6 font-sans">
          {children}
        </main>
      </div>
    </div>
  );
}
