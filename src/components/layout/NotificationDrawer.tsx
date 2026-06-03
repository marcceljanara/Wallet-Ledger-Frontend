import * as React from 'react';
import { X, Trash2, CheckCircle2 } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHistory: () => void;
}

export function NotificationDrawer({ isOpen, onClose, onOpenHistory }: NotificationDrawerProps) {
  const { notifications, markAsRead, clearAll } = useNotificationStore();
  const drawerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        ref={drawerRef}
        className="w-full max-w-sm bg-[#141416] border-l border-zinc-800 h-full flex flex-col focus:outline-none animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-black/25">
          <div className="flex items-center gap-2">
            <span className="font-space text-xs font-semibold uppercase tracking-wider text-foreground">
              Notifications
            </span>
            {notifications.filter(n => !n.is_read).length > 0 && (
              <Badge variant="primary">
                {notifications.filter(n => !n.is_read).length} New
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              className="text-primary hover:underline text-[9px] font-mono uppercase tracking-wider focus:outline-none p-1 border border-transparent focus:border-secondary"
            >
              LOGS
            </button>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-main p-1 transition-colors focus:outline-none border border-transparent focus:border-secondary"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-text-muted font-mono text-xs">
              NO INCOMING ALERTS
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 transition-colors relative ${
                  notif.is_read ? 'bg-transparent' : 'bg-primary/5'
                }`}
              >
                {!notif.is_read && (
                  <div className="absolute top-4 left-2 w-1.5 h-1.5 bg-primary rounded-none" />
                )}
                <div className="pl-2">
                  <h4 className={`text-xs font-space font-medium ${notif.is_read ? 'text-text-muted' : 'text-text-main'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{notif.message}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-mono text-[9px] text-zinc-600">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    {!notif.is_read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-primary hover:text-primary-container focus:outline-none"
                      >
                        <CheckCircle2 size={10} /> Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-black/25 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              className="text-error border-error/50 hover:bg-error/10 hover:border-error w-full flex items-center justify-center gap-1.5"
              onClick={clearAll}
            >
              <Trash2 size={12} /> Clear All Alerts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
