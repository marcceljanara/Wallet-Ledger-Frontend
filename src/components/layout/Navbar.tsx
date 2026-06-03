import * as React from 'react';
import { Bell, LogOut, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { NotificationDrawer } from './NotificationDrawer';
import { NotificationManagementModal } from '../shared/NotificationManagementModal';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <header className="h-12 border-b border-zinc-800 bg-[#141416] flex items-center justify-between px-4 sticky top-0 z-30">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-space text-xs font-semibold uppercase tracking-wider text-primary">
            Obsidian Ledger
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 border border-zinc-800 bg-black text-text-muted">
            V1.1.0
          </span>
        </div>

        {/* Info & Navigation */}
        <div className="flex items-center gap-4">
          {/* User Role Badge */}
          {user?.role === 'ADMIN' && (
            <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-error bg-error/10 border border-error/30 px-2 py-0.5">
              <ShieldAlert size={10} /> Admin Mode
            </div>
          )}

          {/* Email */}
          <span className="font-mono text-xs text-text-muted hidden md:inline">
            {user?.email}
          </span>

          {/* Notifications Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-1.5 border border-zinc-800 bg-black hover:border-zinc-700 text-text-muted hover:text-text-main transition-all focus:outline-none focus:border-secondary"
            aria-label="Open notifications"
          >
            <Bell size={14} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary font-mono text-[8px] font-bold px-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-none border border-black animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-1.5 border border-zinc-800 bg-black hover:border-error/50 text-text-muted hover:text-error transition-all focus:outline-none focus:border-error"
            aria-label="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenHistory={() => {
          setIsDrawerOpen(false);
          setIsModalOpen(true);
        }}
      />

      <NotificationManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
