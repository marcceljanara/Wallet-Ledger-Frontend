import * as React from 'react';
import { Radio, X } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';

export function NotificationToast() {
  const { activeToast, setActiveToast } = useNotificationStore();

  React.useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeToast, setActiveToast]);

  if (!activeToast) return null;

  const formattedTitle = activeToast.title
    .toUpperCase()
    .replace(/\s+/g, '_');

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto w-80 bg-[#141416] border-l-4 border-primary border-t border-b border-r border-border-subtle p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-primary animate-pulse" />
          <span className="font-mono text-xs font-bold text-primary tracking-widest">
            INCOMING_EVENT
          </span>
        </div>
        <button
          onClick={() => setActiveToast(null)}
          className="text-outline hover:text-on-surface transition-colors focus:outline-none"
          aria-label="Close alert"
        >
          <X size={14} />
        </button>
      </div>
      <p className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider">
        {formattedTitle}
      </p>
      <p className="font-mono text-[11px] text-on-surface-variant mt-1 leading-relaxed">
        {activeToast.message}
      </p>
    </div>
  );
}
