import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, children, className }: DialogProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (isOpen && mounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, mounted]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        className={cn(
          "relative w-full max-w-md bg-[#141416] border border-zinc-800 rounded-none shadow-none flex flex-col max-h-[90vh] focus:outline-none animate-in fade-in zoom-in-95 duration-150",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-black/25">
          {title ? (
            <h2 className="font-space text-xs font-semibold uppercase tracking-wider text-text-main">
              {title}
            </h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors focus:outline-none p-1 border border-transparent focus:border-secondary"
            aria-label="Close dialog"
          >
            <X size={14} />
          </button>
        </div>
        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 font-sans text-sm">{children}</div>
      </div>
    </div>,
    document.body
  );
}
