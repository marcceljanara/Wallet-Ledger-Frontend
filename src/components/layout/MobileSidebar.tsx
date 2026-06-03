import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Wallet, History, FileText, Database, Shield, BarChart3, Users, ClipboardList, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
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

  // Automatically close sidebar when pathname changes
  React.useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isOpen) return null;

  const isAdminRoute = pathname.startsWith('/admin');

  const userMenuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Wallet },
    { name: 'Transactions', href: '/transactions', icon: History },
    { name: 'Ledger Entries', href: '/ledger', icon: FileText },
    { name: 'Audit Logs', href: '/audit-logs', icon: Database },
  ];

  const adminMenuItems = [
    { name: 'Admin Overview', href: '/admin', icon: BarChart3 },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Global Audit Logs', href: '/admin/audit-logs', icon: ClipboardList },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-start">
      <div
        ref={sidebarRef}
        className="w-72 bg-[#141416] border-r border-zinc-800 h-full flex flex-col focus:outline-none animate-in slide-in-from-left duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-black/25">
          <div className="flex flex-col">
            <span className="font-space text-xs font-semibold uppercase tracking-wider text-primary">
              Obsidian Ledger
            </span>
            <span className="font-mono text-[9px] text-text-muted mt-0.5">
              {isAdminRoute ? 'Admin Control Center' : 'Workspace'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main p-1 transition-colors focus:outline-none border border-transparent focus:border-secondary"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {isAdminRoute ? (
            <>
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase tracking-wider border rounded-none transition-colors",
                      isActive
                        ? "bg-error/10 border-error text-error"
                        : "bg-transparent border-transparent text-text-muted hover:border-zinc-800 hover:text-text-main"
                    )}
                  >
                    <Icon size={14} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </>
          ) : (
            <>
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase tracking-wider border rounded-none transition-colors",
                      isActive
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-transparent border-transparent text-text-muted hover:border-zinc-800 hover:text-text-main"
                    )}
                  >
                    <Icon size={14} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-zinc-800 bg-black/25">
          {isAdminRoute ? (
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider border border-zinc-800 text-text-muted hover:text-text-main hover:border-zinc-700 transition-colors rounded-none w-full"
            >
              <ArrowLeft size={12} />
              <span>Exit Admin Mode</span>
            </Link>
          ) : (
            user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider border border-error/50 text-error hover:bg-error/10 hover:border-error transition-colors rounded-none w-full"
              >
                <Shield size={12} />
                <span>Switch to Admin</span>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
