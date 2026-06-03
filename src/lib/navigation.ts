import { Wallet, History, FileText, Database, BarChart3, Users, ClipboardList } from 'lucide-react';

export interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number | string }>;
}

export const userMenuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Wallet },
  { name: 'Transactions', href: '/transactions', icon: History },
  { name: 'Ledger Entries', href: '/ledger', icon: FileText },
  { name: 'Audit Logs', href: '/audit-logs', icon: Database },
];

export const adminMenuItems: MenuItem[] = [
  { name: 'Admin Overview', href: '/admin', icon: BarChart3 },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Global Audit Logs', href: '/admin/audit-logs', icon: ClipboardList },
];
