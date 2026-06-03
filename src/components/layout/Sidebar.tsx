import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, History, FileText, Database, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Wallet },
    { name: 'Transactions', href: '/transactions', icon: History },
    { name: 'Ledger Entries', href: '/ledger', icon: FileText },
    { name: 'Audit Logs', href: '/audit-logs', icon: Database },
  ];

  return (
    <aside className="hidden md:flex w-64 border-r border-zinc-800 bg-[#141416] flex-col h-[calc(100vh-3rem)]">
      {/* Menu Area */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-text-muted px-3 mb-2">
          Workspace
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase tracking-wider border rounded-none transition-colors",
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
      </nav>

      {/* Admin Quick Link */}
      {user?.role === 'ADMIN' && (
        <div className="p-4 border-t border-zinc-800 bg-black/25">
          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider border border-error/50 text-error hover:bg-error/10 hover:border-error transition-colors rounded-none"
          >
            <Shield size={12} />
            <span>Switch to Admin</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
