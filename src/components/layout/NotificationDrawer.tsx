import * as React from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHistory: () => void;
}

function formatTimeAgo(createdAt: string) {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function NotificationDrawer({ isOpen, onClose, onOpenHistory }: NotificationDrawerProps) {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible overlay for capturing click outside */}
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />

      {/* Dropdown Container */}
      <div
        className="absolute top-10 right-0 w-[calc(100vw-2rem)] sm:w-96 max-h-[500px] bg-[#141416] border border-border-subtle shadow-2xl z-50 flex flex-col focus:outline-none animate-in fade-in-50 slide-in-from-top-2 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-black/25">
          <h3 className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
            EVENT_STREAM_MONITOR
          </h3>
          <div className="flex gap-4">
            {notifications.filter((n) => !n.is_read).length > 0 && (
              <button
                onClick={() => {
                  markAllAsRead();
                }}
                className="text-[10px] font-mono font-bold tracking-wider uppercase text-outline hover:text-primary transition-colors focus:outline-none"
              >
                MARK_ALL_READ
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  clearAll();
                }}
                className="text-[10px] font-mono font-bold tracking-wider uppercase text-outline hover:text-error transition-colors focus:outline-none"
              >
                CLEAR_LOGS
              </button>
            )}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto flex-1 max-h-[380px] custom-scrollbar divide-y divide-border-subtle">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-text-muted font-mono text-xs uppercase tracking-wider">
              NO INCOMING ALERTS
            </div>
          ) : (
            notifications.map((notif) => {
              const formattedTitle = notif.title
                .toUpperCase()
                .replace(/\s+/g, '_');

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.is_read) {
                      markAsRead(notif.id);
                    }
                  }}
                  className="p-4 hover:bg-surface-container-low transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-start gap-3">
                    {/* Unread Pip */}
                    <div
                      className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                        notif.is_read ? 'bg-outline/25' : 'bg-primary'
                      }`}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <p
                          className={`font-mono text-[10px] font-bold tracking-wider uppercase truncate ${
                            notif.is_read ? 'text-outline' : 'text-on-surface'
                          }`}
                        >
                          {formattedTitle}
                        </p>
                        <span className="font-mono text-[10px] text-outline shrink-0">
                          {formatTimeAgo(notif.created_at)}
                        </span>
                      </div>
                      <p
                        className={`font-mono text-xs leading-relaxed break-words ${
                          notif.is_read ? 'text-outline' : 'text-on-surface-variant'
                        }`}
                      >
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-surface-container-lowest text-center border-t border-border-subtle">
          <button
            onClick={() => {
              onOpenHistory();
            }}
            className="font-mono text-[10px] font-bold tracking-wider uppercase text-primary hover:underline focus:outline-none"
          >
            VIEW_ALL_EVENTS
          </button>
        </div>
      </div>
    </>
  );
}
