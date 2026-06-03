import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, ClipboardList, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Admin Overview', href: '/admin', icon: BarChart3 },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Global Audit Logs', href: '/admin/audit-logs', icon: ClipboardList },
  ];

  return (
    <aside className="hidden md:flex w-64 border-r border-zinc-800 bg-[#141416] flex-col h-[calc(100vh-3rem)]">
      {/* Menu Area */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-error px-3 mb-2">
          Admin Control Center
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase tracking-wider border rounded-none transition-colors",
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
      </nav>

      {/* Back to User Dashboard */}
      <div className="p-4 border-t border-zinc-800 bg-black/25">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider border border-zinc-800 text-text-muted hover:text-text-main hover:border-zinc-700 transition-colors rounded-none"
        >
          <ArrowLeft size={12} />
          <span>Exit Admin Mode</span>
        </Link>
      </div>
    </aside>
  );
}
