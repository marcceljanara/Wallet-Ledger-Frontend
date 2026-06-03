'use client';

import * as React from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Terminal, CheckCircle2 } from 'lucide-react';

interface NotificationManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationManagementModal({ isOpen, onClose }: NotificationManagementModalProps) {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotificationStore();
  const [filter, setFilter] = React.useState<'ALL' | 'UNREAD'>('ALL');

  const filteredNotifications = React.useMemo(() => {
    if (filter === 'UNREAD') {
      return notifications.filter((n) => !n.is_read);
    }
    return notifications;
  }, [notifications, filter]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Notification History Log"
      className="max-w-2xl h-[600px] flex flex-col relative overflow-hidden"
    >
      <div className="flex flex-col h-full overflow-hidden -m-4">
        {/* Terminal Filter Bar */}
        <div className="bg-black/40 border-b border-zinc-800 px-4 py-2 flex items-center shrink-0">
          <span className="font-mono text-xs text-primary mr-2">&gt;</span>
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">filter_by:</span>
          
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                filter === 'ALL' ? 'text-primary font-bold' : 'text-zinc-600 hover:text-text-muted'
              }`}
            >
              ALL_EVENTS
            </button>
            <span className="text-zinc-800">/</span>
            <button
              onClick={() => setFilter('UNREAD')}
              className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                filter === 'UNREAD' ? 'text-primary font-bold' : 'text-zinc-600 hover:text-text-muted'
              }`}
            >
              UNREAD_ONLY
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-2 py-0.5 border border-error/30 hover:border-error bg-error/15 text-error text-[9px] font-mono uppercase tracking-wider transition-colors"
            >
              <Trash2 size={10} /> PURGE_ALL
            </button>
          </div>
        </div>

        {/* Scrollable Notification List */}
        <div className="flex-1 overflow-y-auto bg-black/10 divide-y divide-zinc-900 custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs">
              NO INCOMING SYSTEM ALERTS FOUND ({filter})
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start border-b border-zinc-900 p-4 hover:bg-zinc-900/20 transition-colors group relative ${
                  notif.is_read ? 'opacity-60' : ''
                }`}
              >
                {/* Status Pip Indicator */}
                {!notif.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
                )}
                
                <div className="mt-1 mr-3 shrink-0">
                  <div
                    className={`w-2 h-2 ${
                      notif.is_read
                        ? 'border border-zinc-700'
                        : 'bg-primary shadow-[0_0_8px_rgba(78,222,163,0.6)]'
                    }`}
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                      notif.is_read ? 'text-text-muted' : 'text-primary'
                    }`}>
                      {notif.title}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-text-muted leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {!notif.is_read && (
                  <div className="ml-4 shrink-0">
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="border border-zinc-800 hover:border-primary px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-text-muted hover:text-primary transition-all"
                    >
                      MARK_READ
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <footer className="h-12 border-t border-zinc-800 flex items-center justify-between px-4 bg-[#141416] shrink-0 font-mono text-[10px]">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary"></span>
              <span className="text-text-muted">UNREAD: {unreadCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 border border-zinc-700"></span>
              <span className="text-text-muted">TOTAL: {notifications.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-text-muted">
            <Terminal size={12} className="text-primary" />
            <span>SYSTEM_LOGGER_OK</span>
            <span className="animate-pulse bg-primary h-3 w-1.5 inline-block"></span>
          </div>
        </footer>

        {/* Scanning Line Effect */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-primary/10 pointer-events-none animate-[scan_6s_linear_infinite]"></div>
      </div>
      
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </Dialog>
  );
}
